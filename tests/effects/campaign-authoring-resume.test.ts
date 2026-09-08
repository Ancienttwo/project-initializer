import { buildProviderIssueObservation, buildExternalSourceRefreshReceipt } from '../../src/core/external-sources/issue-observation';
import { afterEach, expect, test } from 'bun:test';
import { execFileSync } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { createAdoptionRepository, observeVerifiedFixtureRevision } from '../helpers/campaign-adoption-repository';
import { campaignBrowserMetadata } from '../helpers/campaign-browser-session';
import { makeSnapshot } from '../helpers/issue-batch-adoption-fixture';
import { sealProgramAuthorization } from '../../src/core/automation/budget';
import { buildDevelopmentCampaignDefinition } from '../../src/core/automation/development-campaign';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';
import { createDevelopmentCampaign, appendDevelopmentCampaignEvent, readDevelopmentCampaignStatus } from '../../src/effects/automation/development-campaign-store';
import { continueIssueBatchAuthoring, startIssueBatchAuthoring } from '../../src/effects/automation/gpt-pro-issue-authoring';
import { adoptIssueBatch } from '../../src/effects/automation/issue-batch-adoption';
import { readIssueBatchAdoptionArtifact, issueBatchGroupStoreRoot } from '../../src/effects/automation/issue-batch-store';
import { ensureCampaignAuthoringBudget, reserveAutomationBudget, appendAutomationUsage } from '../../src/effects/automation/budget-store';
import { assertResumedAdoption } from '../../src/effects/automation/campaign-authoring-resume';
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const git = (root: string, args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
async function fixture(stop = true, usage: 'none' | 'open' | 'acquired' = 'none') {
  const f = await createAdoptionRepository('active', 1, undefined, {}, {}, { verified_revision: true, max_agent_turns: 30, max_runner_invocations: 30 });
  roots.push(f.root, f.home);
  const adopted = await adoptIssueBatch(f.input, f.deps);
  git(f.root, ['merge', '--ff-only', adopted.publication!.materialized_commit]);
  if (usage !== 'none') {
    const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
    const reservation = reserveAutomationBudget({ repo_root: f.root, automation_run_id: budget.automation_run_id,
      expected_budget_sha256: budget.budget_sha256, idempotency_key: 'acquisition', operation: 'acquisition', unit_kind: 'execute', unit_id: 'test', attempt: 1, provider: null, env: f.env });
    if (usage === 'acquired') appendAutomationUsage({ repo_root: f.root, reservation, outcome: 'progress', evidence_refs: [], env: f.env });
  }
  if (stop) {
    const status = readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env);
    appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: f.intent.campaign_id, expected_current_sha256: status.current.current_sha256,
      idempotency_key: 'stop', operation: 'stop', observed_at: new Date().toISOString(), env: f.env });
  }
  const resume = { campaign_id: f.intent.campaign_id, group_number: 1, intent_sha256: f.intent.intent_sha256,
    source_session_ref: adopted.receipt.authoring_session_ref, issues: adopted.receipt.issues.map(i => ({ slot: i.slot, provider_issue_id: i.provider_issue_id,
      provider_issue_url: `https://github.com/${f.intent.provider_repository}/issues/${i.issue_number}` })) };
  const readBinding = () => ({ path: 'binding', binding: { profileDir: f.home, profileDirectory: 'Profile 1' } });
  const successor = async (id: string) => {
    const authorization = sealProgramAuthorization({ ...f.authorization, authorization_id: id, target_revision: git(f.root, ['rev-parse','HEAD']),
      allowed_work_package_ids: [id], campaign: { ...f.authorization.campaign!, campaign_id: id } });
    mintProgramAuthorization({ repo_root: f.root, authorization, env: f.env });
    const campaign = buildDevelopmentCampaignDefinition({ campaign_id: id, authorization_id: id, authorization_sha256: authorization.authorization_sha256,
      repository_id: authorization.repository_id, target_ref: authorization.target_ref, target_revision: authorization.target_revision, created_at: new Date().toISOString() });
    const created = createDevelopmentCampaign({ repo_root: f.root, campaign, idempotency_key: 'start', env: f.env });
    appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: id, expected_current_sha256: created.current.current_sha256,
      idempotency_key: 'prepare', operation: 'prepare_group', observed_at: new Date().toISOString(), env: f.env });
    await observeVerifiedFixtureRevision({ root: f.root, authorization, env: f.env, readBinding });
    return { repo_root: f.root, campaign_id: id, group_number: 1, env: f.env, resume_from: resume };
  };
  return { ...f, adopted, resume, successor, readBinding };
}

test.each(['exact', 'replacement'] as const)('stopped adopted source enforces %s Issue identities through real admission', async mode => {
  const f = await fixture();
  const sourcePath = join(issueBatchGroupStoreRoot(f.root, f.intent.campaign_id, 1), 'intent.json');
  const original = readFileSync(sourcePath, 'utf8');
  const oldCurrent = readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env).current.current_sha256;
  const next = await f.successor('campaign-2'); let calls = 0;
  const started = await startIssueBatchAuthoring(next, { readBinding: f.readBinding, consult: async input => {
    calls++; expect(input.prompt).toContain('Do not create any Issue');
    return { sessionId: 'successor-author', status: 'completed', meta: campaignBrowserMetadata({ sessionId: 'successor-author', repoRoot: f.root, profileDir: f.home, profileDirectory: 'Profile 1' }) };
  } });
  for (const operation of ['fill_missing', 'edit_issue'] as const) {
    await expect(continueIssueBatchAuthoring({ ...next, intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref,
      operation, requested_slots: ['01'], ...(operation === 'edit_issue' ? { provider_issue_id: 'replacement', provider_issue_url: f.resume.issues[0]!.provider_issue_url } : {}) },
      { readBinding: f.readBinding, followup: async () => { calls++; throw Error('must not edit another Issue'); } })).rejects.toThrow('existing exact Issue');
  }
  const other = await f.successor('campaign-3');
  await expect(startIssueBatchAuthoring(other, { readBinding: f.readBinding, consult: async () => { calls++; throw Error('must not dispatch'); } })).rejects.toThrow('immutable');
  expect(calls).toBe(1);
  const intent = started.intent;
  const adoption = adoptIssueBatch({ ...f.input, campaign_id: intent.campaign_id, intent_sha256: intent.intent_sha256 }, {
    ...f.deps, observe: () => {
      const snapshot = makeSnapshot(intent);
      if (mode === 'exact') return snapshot;
      const observations = snapshot.observations.map((o, n) => {
        if (n !== 0) return o;
        const { protocol, kind, source_revision, observation_sha256, ...basis } = o;
        return buildProviderIssueObservation({ ...basis, provider_issue_id: 'replacement' });
      });
      return { observations, receipt: buildExternalSourceRefreshReceipt({ ...snapshot.receipt, source_revisions: observations.map(o => o.source_revision).sort() }) };
    }, followup: async request => {
      const data = JSON.parse(request.prompt.split('\n\n')[2]!);
      const answers = data.targets.map((t: {kind:string;path:string;line:number}) => t.kind === 'directory_entries'
        ? git(f.root, ['ls-tree','--name-only',`${intent.base_main_sha}:${t.path}`]).split('\n').sort().join('\n')
        : t.kind === 'text_line' ? git(f.root, ['show',`${intent.base_main_sha}:${t.path}`]).split('\n')[t.line-1]
        : createHash('sha256').update(execFileSync('git',['show',`${intent.base_main_sha}:${t.path}`],{cwd:f.root})).digest('hex'));
      return { sessionId:'successor-challenge',status:'completed',output:JSON.stringify({base_main_sha:intent.base_main_sha,answers}),
        meta:campaignBrowserMetadata({sessionId:'successor-challenge',sourceSessionId:'successor-author',repoRoot:f.root,profileDir:f.home,profileDirectory:'Profile 1'}) };
    },
  });
  if (mode === 'replacement') {
    await expect(adoption).rejects.toThrow('replacement Issue');
    expect(readIssueBatchAdoptionArtifact(f.root, intent, 'adoption')).toBeNull();
    expect(readIssueBatchAdoptionArtifact(f.root, intent, 'publication')).toBeNull();
    return;
  }
  const result = await adoption;
  expect(result.receipt.issues.map(i=>i.provider_issue_id)).toEqual(f.adopted.receipt.issues.map(i=>i.provider_issue_id));
  expect(result.publication!.materialized_commit).not.toBe(f.adopted.publication!.materialized_commit);
  expect(readFileSync(sourcePath,'utf8')).toBe(original);
  expect(readDevelopmentCampaignStatus(f.root,f.intent.campaign_id,f.env).current.current_sha256).toBe(oldCurrent);
  expect(() => assertResumedAdoption(f.root,intent,{...result.receipt,issues:result.receipt.issues.map((i,n)=>n===0?{...i,provider_issue_id:'replacement'}:i)})).toThrow('replacement Issue');
});

for (const mode of ['active','open','acquired','wrong-issue','tampered-manifest'] as const) test(`resume rejects ${mode} source before provider dispatch`, async () => {
  const f = await fixture(mode !== 'active', mode === 'open' || mode === 'acquired' ? mode : 'none');
  if (mode === 'tampered-manifest') {
    writeFileSync(join(f.root,f.adopted.publication!.manifest_path),'{}\n');git(f.root,['add','.']);git(f.root,['commit','-qm','tamper source manifest']);
  }
  const next = await f.successor('campaign-2');let calls=0;
  if(mode==='wrong-issue') next.resume_from={...f.resume,issues:f.resume.issues.map((i,n)=>n===0?{...i,provider_issue_id:'replacement'}:i)};
  await expect(startIssueBatchAuthoring(next,{readBinding:f.readBinding,consult:async()=>{calls++;throw Error('unexpected provider');}})).rejects.toThrow();
  expect(calls).toBe(0);
  expect(readIssueBatchAdoptionArtifact(f.root,f.intent,'continuation')).toBeNull();
});
