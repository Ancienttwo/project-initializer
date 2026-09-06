import { afterEach, expect, test } from 'bun:test';
import { execFileSync } from 'child_process';
import { mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { automationDigest, sealProgramAuthorization, validateAutomationReservation } from '../../src/core/automation/budget';
import { createCampaignProviderExecutor } from '../../src/effects/automation/campaign-provider-execution';
import { GithubAdapterError } from '../../src/effects/external-sources/github';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';
import {
  AUTOMATION_BUDGET_STORE_RELATIVE_ROOT, beginCampaignBudgetStep, ensureCampaignAuthoringBudget,
  readAutomationBudgetStatus, readCampaignBudgetLedger, recordCampaignProviderOutcome,
} from '../../src/effects/automation/budget-store';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const digest = (label: string) => automationDigest({ label });
const options = { timeout_ms: 1000, max_buffer: 65536 };

function fixture(calls = 8) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'campaign-provider-')));
  roots.push(root);
  const repo = join(root, 'repo');
  execFileSync('git', ['init', '-q', repo]);
  const env = { ...process.env, REPO_HARNESS_HOME: join(root, 'home') };
  const authorization = sealProgramAuthorization({
    authorization_id: 'provider-authority', repository_id: 'provider-repo',
    target_ref: 'refs/heads/main', target_revision: digest('main'), work_graph_revision: digest('graph'),
    allowed_work_package_ids: [], allowed_risk_tiers: ['low'], merge_mode: 'disabled', allowed_merge_method: 'squash',
    max_repair_cycles: 2, contract_scope: 'contract_less', contract_path: null,
    budget: { max_agent_turns: 20, max_successful_acquisitions: 2, max_runner_invocations: 20,
      max_provider_failures: 4, max_consecutive_no_progress_steps: 4, max_repair_cycles: 2,
      max_wall_clock_seconds: 1800, max_input_tokens: null, max_output_tokens: null, max_cost_micros: null },
    campaign: { campaign_id: 'provider-campaign', group_count: 1, issues_per_group: 2,
      allowed_issue_kinds: ['bugfix', 'test_gap'], max_parallel_tasks: 2,
      max_authoring_rounds_per_group: 2, max_controller_steps: 4, max_provider_calls: calls,
      issue_author: 'gpt_pro', local_parent_host: 'codex', chrome_profile_directory: 'Profile 1', require_fresh_main_audit: true },
    issued_by: 'owner', issued_at: new Date(Date.now() - 60000).toISOString(), expires_at: new Date(Date.now() + 3600000).toISOString(),
  });
  mintProgramAuthorization({ repo_root: repo, authorization, env });
  const budget = ensureCampaignAuthoringBudget({ repo_root: repo, authorization, env }).budget;
  const step = { repo_root: repo, automation_run_id: budget.automation_run_id, expected_budget_sha256: budget.budget_sha256,
    campaign_id: 'provider-campaign', group_number: 1 as const, intent_sha256: `sha256:${digest('intent')}`, idempotency_key: 'heartbeat', env };
  const admission = beginCampaignBudgetStep(step).admission;
  const binding = { ...step, step_admission_sha256: admission.event_sha256 };
  const run = join(repo, '.git', AUTOMATION_BUDGET_STORE_RELATIVE_ROOT, 'runs', budget.automation_run_id);
  return { repo, env, step, binding, run,
    status: () => readAutomationBudgetStatus(repo, budget.automation_run_id, env),
    ledger: () => readCampaignBudgetLedger(repo, budget.automation_run_id, env) };
}

test('each identity/page invocation has a reservation before I/O and durable evidence before usage', () => {
  const f = fixture(); let calls = 0;
  const provider = createCampaignProviderExecutor(f.binding, args => {
    expect(f.status().current.open_reservation_sha256s).toHaveLength(1);
    expect(f.ledger().reserved_provider_calls).toBe(1);
    calls++;
    return { stdout: JSON.stringify(args) };
  });
  for (const endpoint of ['repos/acme/repo', 'repos/acme/repo/issues?page=1', 'repos/acme/repo/issues?page=2']) {
    provider.read(['api', endpoint], options);
  }
  expect(calls).toBe(3);
  expect(f.ledger()).toMatchObject({ controller_steps: 1, provider_calls: 3, reserved_provider_calls: 0 });
  expect(f.status().current.consecutive_no_progress_steps).toBe(0);
  const receipts = readdirSync(join(f.run, 'campaign-provider-outcomes')).map(file => JSON.parse(readFileSync(join(f.run, 'campaign-provider-outcomes', file), 'utf8')));
  expect(receipts).toHaveLength(3);
  for (const receipt of receipts) {
    const usage = JSON.parse(readFileSync(join(f.run, 'events', `${receipt.reservation_sha256}.json`), 'utf8'));
    expect(usage.evidence_refs).toContainEqual({ ref: `campaign-provider-outcome:${receipt.receipt_sha256}`, sha256: receipt.receipt_sha256 });
  }
});

test('provider cap refuses the next adapter invocation before I/O', () => {
  const f = fixture(2); let calls = 0;
  const provider = createCampaignProviderExecutor(f.binding, () => { calls++; return { stdout: '[]' }; });
  provider.read(['api', 'identity'], options);
  provider.read(['api', 'page-1'], options);
  expect(() => provider.read(['api', 'page-2'], options)).toThrow('provider_calls');
  expect(calls).toBe(2);
  expect(f.ledger().provider_calls).toBe(2);
});

test('replay-only admission cannot backfill an unadmitted receipt', () => {
  const f = fixture();
  expect(() => beginCampaignBudgetStep({ ...f.step, idempotency_key: 'unadmitted', replay_only: true })).toThrow('no prior step admission');
  expect(f.ledger().controller_steps).toBe(1);
});

test('same-step replay cannot invoke again or change the request at an existing ordinal', () => {
  const f = fixture(); let calls = 0;
  const runner = () => { calls++; return { stdout: '{}' }; };
  createCampaignProviderExecutor(f.binding, runner).read(['api', 'identity'], options);
  expect(() => createCampaignProviderExecutor(f.binding, runner).read(['api', 'identity'], options)).toThrow('already admitted');
  expect(() => createCampaignProviderExecutor(f.binding, runner).read(['api', 'different'], options)).toThrow();
  expect(calls).toBe(1);
  expect(f.ledger().provider_calls).toBe(1);
});

test('typed read failure consumes one call and stores its failure evidence', () => {
  const f = fixture();
  const error = new GithubAdapterError('rate_limit', 'provider unavailable');
  const provider = createCampaignProviderExecutor(f.binding, () => { throw error; });
  expect(() => provider.read(['api', 'identity'], options)).toThrow(error);
  expect(f.status().current).toMatchObject({ consumed: { provider_failures: 1 }, open_reservation_sha256s: [] });
  expect(f.ledger().provider_calls).toBe(1);
});

test('unknown read outcome keeps its leaf and prevents another step or provider invocation', () => {
  const f = fixture(); let calls = 0;
  const provider = createCampaignProviderExecutor(f.binding, () => { calls++; throw new Error('lost runtime result'); });
  expect(() => provider.read(['api', 'identity'], options)).toThrow('lost runtime result');
  expect(f.status().current.open_reservation_sha256s).toHaveLength(1);
  expect(() => beginCampaignBudgetStep({ ...f.step, idempotency_key: 'other' })).toThrow('reconciliation_required');
  expect(() => provider.read(['api', 'page-1'], options)).toThrow();
  expect(calls).toBe(1);
});

test('mutation failure remains unresolved even when it has a typed provider error', async () => {
  const f = fixture(); let calls = 0;
  const provider = createCampaignProviderExecutor(f.binding);
  const request = { repository: 'acme/repo', issue_number: 1, action: 'close' as const, body: null };
  await expect(provider.mutate(request, () => { calls++; throw new GithubAdapterError('deadline', 'remote outcome unknown'); })).rejects.toThrow('remote outcome unknown');
  await expect(createCampaignProviderExecutor(f.binding).mutate(request, () => { calls++; return { stdout: '{}' }; })).rejects.toThrow('already admitted');
  expect(calls).toBe(1);
  expect(f.status().current.open_reservation_sha256s).toHaveLength(1);
});

test('recorded provider outcomes cannot be relabeled after usage is closed', () => {
  const f = fixture();
  createCampaignProviderExecutor(f.binding, () => ({ stdout: '{}' })).read(['api', 'identity'], options);
  const file = readdirSync(join(f.run, 'campaign-provider-outcomes'))[0]!;
  const path = join(f.run, 'campaign-provider-outcomes', file);
  const before = readFileSync(path, 'utf8');
  const reservation = validateAutomationReservation(JSON.parse(readFileSync(join(f.run, 'reservations', 'by-digest', file), 'utf8')));
  if (reservation.kind !== 'repo-harness-campaign-automation-reservation') throw new Error('expected campaign reservation');
  recordCampaignProviderOutcome({ ...f.binding, reservation, outcome: 'returned', result_sha256: automationDigest({ stdout: '{}' }) });
  expect(() => recordCampaignProviderOutcome({ ...f.binding, reservation, outcome: 'returned', result_sha256: digest('different') })).toThrow('different observation');
  expect(readFileSync(path, 'utf8')).toBe(before);
  expect(f.ledger().provider_calls).toBe(1);
});
