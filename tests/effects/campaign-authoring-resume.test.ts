import * as issueStore from '../../src/effects/automation/issue-batch-store';
import { buildProviderIssueObservation, buildExternalSourceRefreshReceipt } from '../../src/core/external-sources/issue-observation';
import { afterEach, expect, test, spyOn } from 'bun:test';
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
import { renderIssueBatchMarker } from '../../src/core/automation/issue-batch';
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
  const successor = async (id: string, rounds?: number) => {
    const authorization = sealProgramAuthorization({ ...f.authorization, authorization_id: id, target_revision: git(f.root, ['rev-parse','HEAD']),
      allowed_work_package_ids: [id], campaign: { ...f.authorization.campaign!, campaign_id: id,
        ...(rounds === undefined ? {} : { max_authoring_rounds_per_group: rounds }) } });
    mintProgramAuthorization({ repo_root: f.root, authorization, env: f.env });
    const campaign = buildDevelopmentCampaignDefinition({ campaign_id: id, authorization_id: id, authorization_sha256: authorization.authorization_sha256,
      repository_id: authorization.repository_id, target_ref: authorization.target_ref, target_revision: authorization.target_revision, created_at: new Date().toISOString() });
    const created = createDevelopmentCampaign({ repo_root: f.root, campaign, idempotency_key: 'start', env: f.env });
    appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: id, expected_current_sha256: created.current.current_sha256,
      idempotency_key: 'prepare', operation: 'prepare_group', observed_at: new Date().toISOString(), env: f.env });
    await observeVerifiedFixtureRevision({ root: f.root, authorization, env: f.env, readBinding });
    return { repo_root: f.root, campaign_id: id, group_number: 1, env: f.env, resume_from: resume };
  };
  /**
   * The real field shape: a successor that authored and edited the existing Issues, updating
   * their remote markers, and then stopped before any adoption. It stops from group_preparing
   * because start_group now requires the group adoption and publication, so the group_running
   * variant is unreachable; the stopped-and-never-adopted predicate is identical either way.
   */
  const failedSuccessor = async (id: string) => {
    const { resume_from, ...base } = await successor(id, 2);
    const started = await startIssueBatchAuthoring({ ...base, resume_from }, { readBinding, consult: async () => ({ sessionId: `${id}-author`, status: 'completed' as const,
      meta: campaignBrowserMetadata({ sessionId: `${id}-author`, repoRoot: f.root, profileDir: f.home, profileDirectory: 'Profile 1' }) }) });
    await continueIssueBatchAuthoring({ ...base, intent_sha256: started.intent.intent_sha256, source_session_ref: started.session.session_ref,
      operation: 'edit_issue', requested_slots: ['01'], provider_issue_id: resume.issues[0]!.provider_issue_id, provider_issue_url: resume.issues[0]!.provider_issue_url },
      { readBinding, followup: async () => ({ sessionId: `${id}-followup`, status: 'completed' as const,
        meta: campaignBrowserMetadata({ sessionId: `${id}-followup`, sourceSessionId: `${id}-author`, repoRoot: f.root, profileDir: f.home, profileDirectory: 'Profile 1' }) }) });
    const status = readDevelopmentCampaignStatus(f.root, id, f.env);
    appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: id, expected_current_sha256: status.current.current_sha256,
      idempotency_key: 'stop', operation: 'stop', observed_at: new Date().toISOString(), env: f.env });
    return started;
  };
  const adoptionPath = (campaignId: string, name: string) => join(issueBatchGroupStoreRoot(f.root, campaignId, 1), 'adoption', `${name}.json`);
  const adoptSuccessor = (intent: typeof f.intent) => adoptIssueBatch({ ...f.input, campaign_id: intent.campaign_id, intent_sha256: intent.intent_sha256 }, {
    ...f.deps, observe: () => makeSnapshot(intent, intent.slots), followup: async request => {
      const data = JSON.parse(request.prompt.split('\n\n')[2]!);
      const answers = data.targets.map((t: {kind:string;path:string;line:number}) => t.kind === 'directory_entries'
        ? git(f.root, ['ls-tree','--name-only',`${intent.base_main_sha}:${t.path}`]).split('\n').sort().join('\n')
        : t.kind === 'text_line' ? git(f.root, ['show',`${intent.base_main_sha}:${t.path}`]).split('\n')[t.line-1]
        : createHash('sha256').update(execFileSync('git',['show',`${intent.base_main_sha}:${t.path}`],{cwd:f.root})).digest('hex'));
      return { sessionId: `${intent.campaign_id}-challenge`, status: 'completed' as const, output: JSON.stringify({ base_main_sha: intent.base_main_sha, answers }),
        meta: campaignBrowserMetadata({ sessionId: `${intent.campaign_id}-challenge`, sourceSessionId: `${intent.campaign_id}-author`, repoRoot: f.root, profileDir: f.home, profileDirectory: 'Profile 1' }) };
    },
  });
  return { ...f, adopted, resume, successor, failedSuccessor, readBinding, adoptionPath, adoptSuccessor };
}

test.each(['exact', 'replacement', 'partial'] as const)('stopped adopted source enforces %s Issue identities through real admission', async mode => {
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
      const snapshot = makeSnapshot(intent, mode === 'partial' ? ['01'] : intent.slots);
      if (mode !== 'replacement') return snapshot;
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
  expect(result.receipt.issues.map(i=>i.provider_issue_id)).toEqual(f.adopted.receipt.issues.filter(i=>mode!=='partial'||i.slot==='01').map(i=>i.provider_issue_id));
  expect(result.receipt.unfilled_slots).toEqual(mode==='partial'?['02']:[]);
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

test('pre-dispatch crash after continuation binding retries the same persisted intent once', async () => {
  const f = await fixture(); const next = await f.successor('campaign-2'); let calls = 0;
  const persist = issueStore.persistIssueBatchAdoptionArtifact;
  const crash = spyOn(issueStore, 'persistIssueBatchAdoptionArtifact').mockImplementation((...args) => {
    persist(...args);
    if (args[2] === 'continuation') throw Error('crash after binding before reservation');
  });
  const deps = { readBinding:f.readBinding, consult:async () => { calls++; return { sessionId:'resumed-after-crash',status:'completed' as const,
    meta:campaignBrowserMetadata({sessionId:'resumed-after-crash',repoRoot:f.root,profileDir:f.home,profileDirectory:'Profile 1'}) }; } };
  try {
    await expect(startIssueBatchAuthoring(next,{...deps,now:()=> '2026-09-09T00:00:00.000Z'})).rejects.toThrow('crash after binding');
  } finally { crash.mockRestore(); }
  expect(calls).toBe(0);
  const path=join(issueBatchGroupStoreRoot(f.root,'campaign-2',1),'intent.json');
  const original=readFileSync(path,'utf8');
  const resumed=await startIssueBatchAuthoring(next,{...deps,now:()=> '2026-09-09T00:01:00.000Z'});
  expect(calls).toBe(1);expect(readFileSync(path,'utf8')).toBe(original);
  expect(resumed.intent.created_at).toBe('2026-09-09T00:00:00.000Z');
  await expect(startIssueBatchAuthoring(next,{...deps,now:()=> '2026-09-09T00:02:00.000Z'})).rejects.toThrow('reconcile');
  expect(calls).toBe(1);
});

test('a stopped never-adopted successor is replaced through the formal entrypoint and the replacement adopts', async () => {
  const f = await fixture();
  const failed = await f.failedSuccessor('campaign-2');
  const continuationBefore = readFileSync(f.adoptionPath(f.intent.campaign_id, 'continuation'), 'utf8');
  const failedIntentBefore = readFileSync(join(issueBatchGroupStoreRoot(f.root, 'campaign-2', 1), 'intent.json'), 'utf8');
  const sourceCurrent = readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env).current.current_sha256;
  const next = await f.successor('campaign-3');
  let calls = 0;
  const started = await startIssueBatchAuthoring({ ...next, resume_from: { ...f.resume,
    supersedes: { campaign_id: 'campaign-2', group_number: 1, intent_sha256: failed.intent.intent_sha256 } } }, {
    readBinding: f.readBinding, consult: async input => {
      calls++;
      for (const slot of ['01', '02']) {
        expect(input.prompt).toContain(renderIssueBatchMarker('campaign-2', 1, slot));
        expect(input.prompt).toContain(renderIssueBatchMarker(f.intent.campaign_id, 1, slot));
        expect(input.prompt).toContain(renderIssueBatchMarker('campaign-3', 1, slot));
      }
      return { sessionId: 'campaign-3-author', status: 'completed' as const,
        meta: campaignBrowserMetadata({ sessionId: 'campaign-3-author', repoRoot: f.root, profileDir: f.home, profileDirectory: 'Profile 1' }) };
    } });
  expect(calls).toBe(1);
  const record = readIssueBatchAdoptionArtifact(f.root, f.intent, `superseded-${failed.intent.intent_sha256.slice('sha256:'.length)}`);
  expect(record).toMatchObject({ protocol: 1, kind: 'repo-harness-campaign-continuation-replacement',
    superseded: { campaign_id: 'campaign-2', group_number: 1, intent_sha256: failed.intent.intent_sha256 },
    replacement: { campaign_id: 'campaign-3', group_number: 1, intent_sha256: started.intent.intent_sha256 },
    evidence: { marked_slots: ['01', '02'] }, created_at: started.intent.created_at });
  expect(readFileSync(f.adoptionPath(f.intent.campaign_id, 'continuation'), 'utf8')).toBe(continuationBefore);
  expect(readFileSync(join(issueBatchGroupStoreRoot(f.root, 'campaign-2', 1), 'intent.json'), 'utf8')).toBe(failedIntentBefore);
  expect(readDevelopmentCampaignStatus(f.root, f.intent.campaign_id, f.env).current.current_sha256).toBe(sourceCurrent);
  const result = await f.adoptSuccessor(started.intent);
  expect(result.receipt.issues.map(i => i.provider_issue_id)).toEqual(f.adopted.receipt.issues.map(i => i.provider_issue_id));
  expect(result.publication!.materialized_commit).not.toBe(f.adopted.publication!.materialized_commit);
  expect(() => assertResumedAdoption(f.root, failed.intent, result.receipt)).toThrow('not bound');
});
