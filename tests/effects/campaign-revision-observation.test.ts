import * as budgetStore from '../../src/effects/automation/budget-store';
import { test, expect, afterEach, spyOn } from 'bun:test';
import { execFileSync } from 'child_process';
import { mkdtempSync, realpathSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { campaignBrowserMetadata } from '../helpers/campaign-browser-session';
import { sealProgramAuthorization, validateCampaignAutomationReservationContext } from '../../src/core/automation/budget';
import { buildDevelopmentCampaignDefinition } from '../../src/core/automation/development-campaign';
import { createDevelopmentCampaign, appendDevelopmentCampaignEvent, readDevelopmentCampaignStatus, readCampaignRevisionRecord } from '../../src/effects/automation/development-campaign-store';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';
import { repoHarnessRepoIdFor } from '../../src/effects/repo-registry';
import { runCampaignRevisionObservation } from '../../src/effects/automation/campaign-revision-observation';
import { ensureCampaignAuthoringBudget, readCampaignBudgetLedger, reserveCampaignAuthoringBudget, reserveCampaignRevisionObservationBudget } from '../../src/effects/automation/budget-store';
import { AT, CAP, policy } from '../helpers/issue-batch-adoption-fixture';
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const git = (root: string, args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const SPRINT = 'plans/sprints/repair.sprint.md';
function fixture(maxCalls = 4, create = true, finiteSelection = false) {
  const mode = 'shadow', capability = CAP, rounds = 1;
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'brc6-adoption-'))); const home = realpathSync(mkdtempSync(join(tmpdir(), 'brc6-home-')));
  git(root, ['init', '-q', '-b', 'main']); git(root, ['config', 'user.name', 'Test']); git(root, ['config', 'user.email', 'test@example.invalid']);
  for (const path of ['.ai/harness', '.archcontext/model/nodes', 'src', 'plans/sprints', 'plans/policies']) mkdirSync(join(root, path), { recursive: true });
  writeFileSync(join(root, 'src/index.ts'), 'export {};\n');
  writeFileSync(join(root, '.archcontext/model/nodes/capability.yaml'), JSON.stringify({ schemaVersion: 'archcontext.node/v2', id: capability, kind: 'capability', name: 'Campaign', status: 'active', summary: 'Fixture capability', responsibilities: ['Own fixture'], source: { include: ['src/**'] }, extensions: { contractFiles: { agents: 'AGENTS.md', claude: 'CLAUDE.md' }, lspProfile: 'typescript-lsp', verification: [] } }));
  writeFileSync(join(root, '.ai/harness/policy.json'), JSON.stringify({ development_campaign: { version: 1, mode, limits: { maximum_group_count: 1, maximum_issues_per_group: 2, maximum_parallel_tasks: 2 } }, external_sources: { version: 1, mode: 'manual', github: { enabled: true, repository: 'acme/widgets', selection: finiteSelection ? { kind: 'issue_numbers', issue_numbers: [1] } : { kind: 'labels', labels_all: ['campaign'], assignees_any: [] }, limits: { max_pages: 2, max_issues: 20, max_body_bytes: 8192, max_total_bytes: 65536, deadline_ms: 1000 } } } }));
  writeFileSync(join(root, 'plans/policies/repair.json'), 'repair');
  writeFileSync(join(root, 'plans/policies/publication.json'), JSON.stringify(policy));
  const repository = repoHarnessRepoIdFor(root);
  writeFileSync(join(root, SPRINT), '# Sprint: repair\n\n> **Status**: Approved\n> **Backlog Schema**: 2\n\n## Backlog\n\n| # | ID | Status | Task | Mode | Acceptance | Plan |\n|---|----|---|---|---|---|---|\n\n## Execution Log\n');
  writeFileSync(join(root, 'plans/sprints/repair.work-graph.v1.json'), JSON.stringify({ protocol: 1, kind: 'repo-harness-work-graph', repository_id: repository, sprint_path: SPRINT, lane: 'generic-v1', work_packages: [] }));

  git(root, ['add', '.']); git(root, ['commit', '-qm', 'base']); const revision = git(root, ['rev-parse', 'HEAD']);
  const authorization = sealProgramAuthorization({ authorization_id: 'auth-1', repository_id: repository, target_ref: 'refs/heads/main', target_revision: revision, work_graph_revision: 'a'.repeat(64), allowed_work_package_ids: ['campaign-1'], allowed_risk_tiers: ['low'], merge_mode: 'manual', allowed_merge_method: 'squash', max_repair_cycles: 2, budget: { max_agent_turns: 10, max_successful_acquisitions: 2, max_runner_invocations: 10, max_provider_failures: 2, max_consecutive_no_progress_steps: 2, max_repair_cycles: 2, max_wall_clock_seconds: 3600, max_input_tokens: null, max_output_tokens: null, max_cost_micros: null }, contract_scope: 'contract_less', contract_path: null, campaign: { campaign_id: 'campaign-1', group_count: 1, issues_per_group: 2, allowed_issue_kinds: ['bugfix', 'test_gap'], max_parallel_tasks: 2, transient_retry: { max_consecutive_failures: 3, initial_backoff_ms: 1, maximum_backoff_ms: 4 }, issue_author: 'gpt_pro', local_parent_host: 'codex', chrome_profile_directory: 'Profile 1', max_authoring_rounds_per_group: rounds, max_controller_steps: 100, max_provider_calls: maxCalls, require_fresh_main_audit: true }, issued_by: 'owner', issued_at: AT, expires_at: '2027-09-05T00:00:00.000Z' });
  const env = { ...process.env, REPO_HARNESS_HOME: home };
  mintProgramAuthorization({ repo_root: root, authorization, env });
  const campaign = buildDevelopmentCampaignDefinition({ campaign_id: 'campaign-1', authorization_id: authorization.authorization_id, authorization_sha256: authorization.authorization_sha256, repository_id: repository, target_ref: authorization.target_ref, target_revision: revision, created_at: AT });
  if (create) createDevelopmentCampaign({ repo_root: root, campaign, idempotency_key: 'start', env });
  roots.push(root, home);
  const input = { repo_root: root, authorization_sha256: authorization.authorization_sha256, env };
  const binding = { profileDir: home, profileDirectory: 'Profile 1' };
  const readBinding = () => ({ path: 'binding', binding });
  const browser = (status: 'completed' | 'failed' | 'recoverable' = 'completed') => ({ sessionId: 'observation', status, output: 'No provider-resolved revision returned.', meta: { ...campaignBrowserMetadata({ sessionId: 'observation', repoRoot: root, profileDir: home, profileDirectory: 'Profile 1' }), oracle: { ...campaignBrowserMetadata({ sessionId: 'observation', repoRoot: root, profileDir: home, profileDirectory: 'Profile 1' }).oracle, networkCapture: { status: 'captured', path: '/private/test/stream.jsonl', sha256: 'a'.repeat(64), bytes: 100 } } } });
  const budget = () => ensureCampaignAuthoringBudget({ repo_root: root, authorization, env });
  return { root, home, env, campaign, authorization, input, readBinding, browser, budget };
}

test('pre-active observation without intent charges once and permits later real authoring intent', async () => {
  const f = fixture(); let calls = 0;
  const deps = { readBinding: f.readBinding, consult: async (input: any) => {
    calls++;
    expect(input.captureNetworkEvidence).toBe(true); expect(input.chatgptApp).toBe('GitHub');
    expect(input.model).toBeUndefined(); expect(input.thinkingTime).toBeUndefined(); expect(input.sessionId).toBeUndefined();
    expect(input.prompt).toContain('Do not create, edit, close or reopen Issues');
    const budget = f.budget(); expect(budget.current.open_reservation_sha256s).toHaveLength(1);
    expect(readCampaignRevisionRecord(f.root, f.campaign.campaign_id, 'request')).not.toBeNull();
    return f.browser();
  } };
  const observed = await runCampaignRevisionObservation(f.input, deps);
  expect(observed.revision_evidence).toBe('unavailable'); expect(observed.browser_session).not.toBeNull();
  expect(observed.network_capture).toMatchObject({ status: 'captured' });
  expect((await runCampaignRevisionObservation(f.input, deps)).replayed).toBe(true); expect(calls).toBe(1);
  expect(readDevelopmentCampaignStatus(f.root, f.campaign.campaign_id, f.env).current.state).toBe('authorized');
  const budget = f.budget(); expect(budget.current.open_reservation_sha256s).toHaveLength(0);
  expect(readCampaignBudgetLedger(f.root, budget.budget.automation_run_id, f.env).provider_calls).toBe(1);
  const next = reserveCampaignAuthoringBudget({ repo_root: f.root, automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256, campaign_id: f.campaign.campaign_id, group_number: 1, intent_sha256: 'sha256:' + 'b'.repeat(64), operation: 'initial', idempotency_key: 'initial', env: f.env });
  expect(next.disposition).toBe('reserved');
});

for (const status of ['failed', 'recoverable', 'throw'] as const) test(`unknown ${status} outcome cannot repeat provider I/O`, async () => {
  const f = fixture(); let calls = 0;
  const deps = { readBinding: f.readBinding, consult: async () => { calls++; if (status === 'throw') throw new Error('disconnect'); return f.browser(status); } };
  await expect(runCampaignRevisionObservation(f.input, deps)).rejects.toThrow();
  await expect(runCampaignRevisionObservation(f.input, deps)).rejects.toThrow();
  expect(calls).toBe(1); expect(f.budget().current.open_reservation_sha256s).toHaveLength(1);
  if (status !== 'throw') expect(readCampaignRevisionRecord(f.root, f.campaign.campaign_id, 'result')).toMatchObject({ browser_status: status, network_capture: { status: 'captured' } });
  await expect(runCampaignRevisionObservation(f.input, { ...deps, readBinding: () => ({ path: 'binding', binding: { profileDir: f.home + '-changed', profileDirectory: 'Profile 1' } }) })).rejects.toThrow();
  expect(calls).toBe(1);
});

test('stopped, moved target and mismatched profile refuse before any provider reservation', async () => {
  for (const reason of ['stopped', 'target', 'profile']) {
    const f = fixture(); let calls = 0;
    if (reason === 'stopped') { const state = readDevelopmentCampaignStatus(f.root, f.campaign.campaign_id, f.env); appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: f.campaign.campaign_id, expected_current_sha256: state.current.current_sha256, operation: 'stop', idempotency_key: 'stop', observed_at: new Date().toISOString(), env: f.env }); }
    if (reason === 'target') git(f.root, ['commit', '--allow-empty', '-qm', 'target moved']);
    await expect(runCampaignRevisionObservation(f.input, { readBinding: reason === 'profile' ? () => ({ path: 'binding', binding: { profileDir: f.home, profileDirectory: 'Profile 2' } }) : f.readBinding, consult: async () => { calls++; return f.browser(); } })).rejects.toThrow();
    expect(calls).toBe(0);
  }
});

test('provider-call budget includes observation and second request cannot open another observation', async () => {
  const f = fixture(1);
  await runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => f.browser() });
  const budget = f.budget();
  expect(() => reserveCampaignAuthoringBudget({ repo_root: f.root, automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256, campaign_id: f.campaign.campaign_id, group_number: 1, intent_sha256: 'sha256:' + 'b'.repeat(64), operation: 'initial', idempotency_key: 'initial', env: f.env })).toThrow();
});

test('concurrent calls issue one provider invocation', async () => {
  const f = fixture(); let calls = 0;
  const deps = { readBinding: f.readBinding, consult: async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); return f.browser(); } };
  const results = await Promise.allSettled([runCampaignRevisionObservation(f.input, deps), runCampaignRevisionObservation(f.input, deps)]);
  expect(calls).toBe(1); expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
});

test('crash after immutable result persists settles on replay without another provider call', async () => {
  const f = fixture(); let calls = 0;
  const deps = { readBinding: f.readBinding, consult: async () => { calls++; return f.browser(); } };
  const crash = spyOn(budgetStore, 'appendAutomationUsage').mockImplementationOnce(() => { throw new Error('crash before settlement'); });
  try { await expect(runCampaignRevisionObservation(f.input, deps)).rejects.toThrow('crash before settlement'); }
  finally { crash.mockRestore(); }
  expect(readCampaignRevisionRecord(f.root, f.campaign.campaign_id, 'result')).not.toBeNull();
  expect(f.budget().current.open_reservation_sha256s).toHaveLength(1);
  expect((await runCampaignRevisionObservation(f.input, deps)).replayed).toBe(true);
  expect(calls).toBe(1); expect(f.budget().current.open_reservation_sha256s).toHaveLength(0);
});

test('preparing first group allows capture; missing fresh session proof cannot become evidence', async () => {
  const f = fixture();
  const state = readDevelopmentCampaignStatus(f.root, f.campaign.campaign_id, f.env);
  appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: f.campaign.campaign_id, expected_current_sha256: state.current.current_sha256, operation: 'prepare_group', idempotency_key: 'prepare', observed_at: new Date().toISOString(), env: f.env });
  const observed = await runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => ({ ...f.browser(), meta: { model: { verified: true } } }) });
  expect(observed.browser_session).toBeNull(); expect(observed.revision_evidence).toBe('unavailable');
});

test('expired grant refuses before provider I/O', async () => {
  const f = fixture(); let calls = 0;
  const clock = spyOn(Date, 'now').mockReturnValue(Date.parse('2028-01-01T00:00:00Z'));
  try { await expect(runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => { calls++; return f.browser(); } })).rejects.toThrow('expired'); }
  finally { clock.mockRestore(); }
  expect(calls).toBe(0);
});

test('new observation is rejected after first provider operation or under changed request', () => {
  const f = fixture(); const budget = f.budget();
  const input = { repo_root: f.root, automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256, campaign_id: f.campaign.campaign_id, env: f.env };
  const admission = reserveCampaignRevisionObservationBudget({ ...input, request_sha256: 'a'.repeat(64) });
  budgetStore.appendAutomationUsage({ repo_root: f.root, reservation: admission.reservation, outcome: 'no_progress', evidence_refs: [{ ref: 'test:result', sha256: 'b'.repeat(64) }], env: f.env });
  expect(() => reserveCampaignRevisionObservationBudget({ ...input, request_sha256: 'c'.repeat(64) })).toThrow('first campaign provider');
});

test('observation context refuses invented intent, later group, active step and unknown keys', () => {
  const base = { campaign_id: 'campaign-1', group_number: 1, intent_sha256: null, step_admission_sha256: null, operation: 'observe_revision', request_sha256: 'a'.repeat(64) };
  for (const change of [{ intent_sha256: 'sha256:' + 'b'.repeat(64) }, { group_number: 2 }, { step_admission_sha256: 'a'.repeat(64) }, { extra: true }]) {
    expect(() => validateCampaignAutomationReservationContext({ ...base, ...change } as any)).toThrow();
  }
});

test('stop between preflight and reservation prevents provider I/O', async () => {
  const f = fixture(); let calls = 0;
  await expect(runCampaignRevisionObservation(f.input, { readBinding: () => {
    const state = readDevelopmentCampaignStatus(f.root, f.campaign.campaign_id, f.env);
    appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: f.campaign.campaign_id, expected_current_sha256: state.current.current_sha256, operation: 'stop', idempotency_key: 'stop-interleaving', observed_at: new Date().toISOString(), env: f.env });
    return f.readBinding();
  }, consult: async () => { calls++; return f.browser(); } })).rejects.toThrow();
  expect(calls).toBe(0);
});

test('stored grant can collect before campaign creation without altering Issue selection policy', async () => {
  const f = fixture(4, false);
  const result = await runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => f.browser() });
  expect(result.revision_evidence).toBe('unavailable');
  expect(() => readDevelopmentCampaignStatus(f.root, f.campaign.campaign_id, f.env)).toThrow('missing');
  const created = createDevelopmentCampaign({ repo_root: f.root, campaign: f.campaign, idempotency_key: 'create-after-observation', env: f.env });
  expect(created.current.state).toBe('authorized');
  expect((await runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => { throw new Error('must replay'); } })).replayed).toBe(true);
});

test('readonly observation does not require an Issue snapshot or weaken campaign start policy', async () => {
  const f = fixture(4, false, true);
  const result = await runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => f.browser() });
  expect(result.revision_evidence).toBe('unavailable');
  expect(() => createDevelopmentCampaign({ repo_root: f.root, campaign: f.campaign, idempotency_key: 'forbidden-start', env: f.env })).toThrow('complete repository Issue snapshot');
});

test('campaign creation cannot replace the grant that owns the pre-creation observation', async () => {
  const f = fixture(4, false);
  await runCampaignRevisionObservation(f.input, { readBinding: f.readBinding, consult: async () => f.browser() });
  const other = sealProgramAuthorization({ ...f.authorization, authorization_id: 'other-grant' });
  mintProgramAuthorization({ repo_root: f.root, authorization: other, env: f.env });
  const campaign = buildDevelopmentCampaignDefinition({ ...f.campaign, authorization_id: other.authorization_id, authorization_sha256: other.authorization_sha256 });
  expect(() => createDevelopmentCampaign({ repo_root: f.root, campaign, idempotency_key: 'other-grant-create', env: f.env })).toThrow('another authorization');
});

test('competing grant creation cannot be poisoned by the earlier observation preflight', async () => {
  const f = fixture(4, false); let calls = 0;
  const other = sealProgramAuthorization({ ...f.authorization, authorization_id: 'competing-grant' });
  mintProgramAuthorization({ repo_root: f.root, authorization: other, env: f.env });
  const campaign = buildDevelopmentCampaignDefinition({ ...f.campaign, authorization_id: other.authorization_id, authorization_sha256: other.authorization_sha256 });
  await expect(runCampaignRevisionObservation(f.input, { readBinding: () => {
    createDevelopmentCampaign({ repo_root: f.root, campaign, idempotency_key: 'competing-create', env: f.env });
    return f.readBinding();
  }, consult: async () => { calls++; return f.browser(); } })).rejects.toThrow();
  expect(calls).toBe(0);
  expect(readCampaignRevisionRecord(f.root, f.campaign.campaign_id, 'request')).toBeNull();
  const result = await runCampaignRevisionObservation({ ...f.input, authorization_sha256: other.authorization_sha256 }, { readBinding: f.readBinding, consult: async () => f.browser() });
  expect(result.revision_evidence).toBe('unavailable');
});

test('durable result settles after stop and target movement without re-admission', async () => {
  const f = fixture(); let calls = 0;
  const deps = { readBinding: f.readBinding, consult: async () => { calls++; return f.browser(); } };
  const crash = spyOn(budgetStore, 'appendAutomationUsage').mockImplementationOnce(() => { throw new Error('settlement interrupted'); });
  try { await expect(runCampaignRevisionObservation(f.input, deps)).rejects.toThrow('settlement interrupted'); }
  finally { crash.mockRestore(); }
  const state = readDevelopmentCampaignStatus(f.root, f.campaign.campaign_id, f.env);
  appendDevelopmentCampaignEvent({ repo_root: f.root, campaign_id: f.campaign.campaign_id, expected_current_sha256: state.current.current_sha256, operation: 'stop', idempotency_key: 'post-result-stop', observed_at: new Date().toISOString(), env: f.env });
  git(f.root, ['commit', '--allow-empty', '-qm', 'post-result target movement']);
  expect((await runCampaignRevisionObservation(f.input, deps)).replayed).toBe(true);
  expect(calls).toBe(1); expect(f.budget().current.open_reservation_sha256s).toHaveLength(0);
});
