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
