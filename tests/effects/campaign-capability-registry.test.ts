import { planningProtectionDigest, rejectProtectedPlanning } from '../../src/effects/automation/campaign-planning-proof';
import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { readCampaignCapabilityIdsAtRevision } from '../../src/effects/automation/campaign-capability-registry';
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture(source?: string) {
  const root = mkdtempSync(join(tmpdir(), 'campaign-registry-')); roots.push(root);
  const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git('init', '-q', '-b', 'main'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
  for (const path of ['.ai/harness', '.ai/context', '.archcontext/model/nodes', 'src']) mkdirSync(join(root,path),{recursive:true});
  const write = (path: string, value: unknown) => writeFileSync(join(root,path),JSON.stringify(value));
  write('.ai/harness/policy.json',{context:{...(source ? {capability_source:source} : {}),capability_registry_file:'.ai/context/capabilities.json'}});
  write('.ai/context/capabilities.json',{version:1,capabilities:[{id:'registry',domain:'product',name:'registry',prefixes:['src'],contract_files:{agents:'AGENTS.md',claude:'CLAUDE.md'},architecture_module:'docs/registry.md',workstream_dir:'tasks/workstreams/product/registry',lsp_profile:'typescript-lsp',verification_hints:[]}]});
  write('.archcontext/model/nodes/capability.yaml',{schemaVersion:'archcontext.node/v2',id:'capability.product.archcontext',kind:'capability',name:'Architecture',status:'active',summary:'Architecture owner',responsibilities:['Own source'],source:{include:['src/**']},extensions:{contractFiles:{agents:'AGENTS.md',claude:'CLAUDE.md'},lspProfile:'typescript-lsp',verification:[]}});
  write('src/index.ts',{});
  const commit=()=>{git('add','.');git('commit','-qm','fixture');return git('rev-parse','HEAD');};
  return {root,write,commit};
}
for (const source of ['registry', undefined]) test(`frozen ${source ?? 'default registry'} authority ignores unselected ArchContext`,()=>{
  const f=fixture(source), sha=f.commit();
  f.write('.ai/harness/policy.json',{context:{capability_source:'archcontext'}});
  expect(readCampaignCapabilityIdsAtRevision(f.root,sha)).toEqual(['capability.product.registry']);
});
test('explicit ArchContext ignores malformed unselected registry',()=>{
  const f=fixture('archcontext');f.write('.ai/context/capabilities.json',{});
  expect(readCampaignCapabilityIdsAtRevision(f.root,f.commit())).toEqual(['capability.product.archcontext']);
});
test('invalid selected registry never falls back to valid ArchContext',()=>{
  const f=fixture('registry');f.write('.ai/context/capabilities.json',{});
  expect(()=>readCampaignCapabilityIdsAtRevision(f.root,f.commit())).toThrow();
});
test('unknown source fails closed',()=>{
  const f=fixture('invented');expect(()=>readCampaignCapabilityIdsAtRevision(f.root,f.commit())).toThrow();
});

const protection = {protocol:1,capabilities:[],unmapped_surfaces:[],unmapped_closure:{roots:[],exempt_paths:[]}};
test('target-owned protection admits configured registry without repo-harness fixtures or ArchContext', () => {
  const f=fixture('registry');
  rmSync(join(f.root,'.archcontext'),{recursive:true});
  f.write('.ai/harness/campaign-protection.json',protection);
  const revision=f.commit();
  expect(()=>rejectProtectedPlanning(f.root,revision,'capability.product.registry',['src/new.ts'])).not.toThrow();
  for(const path of ['.ai/harness/campaign-protection.json','.ai/harness/policy.json','.ai/context/capabilities.json'])
    expect(()=>rejectProtectedPlanning(f.root,revision,'capability.product.registry',[path])).toThrow('protected guard authority input');
  expect(planningProtectionDigest(f.root,revision)).toStartWith('sha256:');
});
test('protection digest binds selected inputs and preserves exact frozen revision', () => {
  const f=fixture('registry'); f.write('.ai/harness/campaign-protection.json',protection);
  const before=f.commit(), digest=planningProtectionDigest(f.root,before);
  f.write('.archcontext/model/nodes/capability.yaml',{invalid:'unselected'});
  expect(planningProtectionDigest(f.root,f.commit())).toBe(digest);
  f.write('.ai/harness/campaign-protection.json',{...protection,unmapped_closure:{roots:['src'],exempt_paths:[]}});
  const after=f.commit();expect(planningProtectionDigest(f.root,after)).not.toBe(digest);
  expect(()=>rejectProtectedPlanning(f.root,after,'capability.product.registry',['src/new.ts'])).toThrow('protected planned path');
  expect(()=>rejectProtectedPlanning(f.root,before,'capability.product.registry',['src/new.ts'])).not.toThrow();
});
test.each([undefined,{protocol:1},{...protection,unmapped_surfaces:[{paths:['../escape']}] }])('missing or malformed target protection fails closed', value => {
  const f=fixture('registry'); if(value!==undefined)f.write('.ai/harness/campaign-protection.json',value);
  expect(()=>planningProtectionDigest(f.root,f.commit())).toThrow();
});
