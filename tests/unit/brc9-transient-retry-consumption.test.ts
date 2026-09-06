import { afterAll, afterEach, beforeEach, expect, test } from 'bun:test';
import { createHash } from 'crypto';
import { mkdtempSync, realpathSync, rmSync, readFileSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';
import { observeCampaignTransientRetry, validateProgramAuthorization, sealProgramAuthorization,
  type CampaignTransientRetryPolicyV1, type AutomationOutcome, type ProgramAuthorizationV1,
} from '../../src/core/automation/budget';
import { beginCampaignBudgetStep, reserveAutomationBudget, appendAutomationUsage,
  ensureCampaignAuthoringBudget, readAutomationBudgetStatus, AUTOMATION_BUDGET_STORE_RELATIVE_ROOT,
} from '../../src/effects/automation/budget-store';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';
import { __setAutomationClockForTests, __resetAutomationClockForTests } from '../../src/effects/automation/budget-store.internal';

const hex = (seed: string): string => createHash('sha256').update(seed, 'utf8').digest('hex');
const intent = (seed: string): string => `sha256:${hex(seed)}`;
const roots = new Set<string>();

afterAll(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

function fixture(): { readonly repo: string; readonly env: NodeJS.ProcessEnv } {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'campaign-step-budget-')));
  roots.add(root);
  const repo = join(root, 'repo');
  const init = spawnSync('git', ['init', '-q', repo], { encoding: 'utf8' });
  if (init.status !== 0) throw new Error(init.stderr);
  return { repo, env: { ...process.env, REPO_HARNESS_HOME: join(root, 'home') } };
}

function authorization(rounds = 2, runnerInvocations = 8, steps = 4, calls = 8): ProgramAuthorizationV1 {
  const issued = new Date(Date.now() - 60_000);
  const expires = new Date(Date.now() + 3_600_000);
  return sealProgramAuthorization({
    authorization_id: `campaign-authorization-${rounds}-${runnerInvocations}`,
    repository_id: 'campaign-budget-repo',
    target_ref: 'refs/heads/main',
    target_revision: hex('campaign-target'),
    work_graph_revision: hex('campaign-work-graph'),
    allowed_work_package_ids: [],
    allowed_risk_tiers: ['low'],
    merge_mode: 'disabled',
    allowed_merge_method: 'squash',
    max_repair_cycles: 2,
    budget: {
      max_agent_turns: 20,
      max_successful_acquisitions: 2,
      max_runner_invocations: runnerInvocations,
      max_provider_failures: 4,
      max_consecutive_no_progress_steps: 4,
      max_repair_cycles: 2,
      max_wall_clock_seconds: 1800,
      max_input_tokens: null,
      max_output_tokens: null,
      max_cost_micros: null,
    },
    contract_scope: 'contract_less',
    contract_path: null,
    campaign: {
      campaign_id: 'campaign-budget-test',
      group_count: 3,
      issues_per_group: 10,
      allowed_issue_kinds: ['bugfix', 'test_gap'],
      max_parallel_tasks: 3,
      max_authoring_rounds_per_group: rounds, max_controller_steps: steps, max_provider_calls: calls,
      issue_author: 'gpt_pro',
      local_parent_host: 'codex',
      chrome_profile_directory: 'Profile-1',
      require_fresh_main_audit: true,
    },
    issued_by: 'ancienttwo',
    issued_at: issued.toISOString(),
    expires_at: expires.toISOString(),
  });
}

function setup(rounds = 2, runnerInvocations = 8, steps = 4, calls = 8, policy?: CampaignTransientRetryPolicyV1) {
  const { repo, env } = fixture();
  const original = authorization(rounds, runnerInvocations, steps, calls);
  const grant = policy ? sealProgramAuthorization({ ...original, campaign: { ...original.campaign!, transient_retry: policy } }) : original;
  mintProgramAuthorization({ repo_root: repo, authorization: grant, env });
  const status = ensureCampaignAuthoringBudget({ repo_root: repo, authorization: grant, env });
  return { repo, env, grant, status };
}

test('a campaign grant without explicit transient policy cannot admit a new step', () => {
  const f = setup();
  expect(() => beginCampaignBudgetStep({ repo_root: f.repo, automation_run_id: f.status.budget.automation_run_id,
    expected_budget_sha256: f.status.budget.budget_sha256, campaign_id: f.grant.campaign!.campaign_id,
    group_number: 1, intent_sha256: intent('intent'), idempotency_key: 'missing-policy', env: f.env,
  })).toThrow('campaign_retry_policy_required');
});

let now: number;
let previousSeam: string | undefined;
beforeEach(() => {
  now = Date.now(); previousSeam = process.env.REPO_HARNESS_TEST_CLOCK_SEAM;
  process.env.REPO_HARNESS_TEST_CLOCK_SEAM = '1';
  __setAutomationClockForTests(() => new Date(now));
});
afterEach(() => {
  __resetAutomationClockForTests();
  if (previousSeam === undefined) delete process.env.REPO_HARNESS_TEST_CLOCK_SEAM;
  else process.env.REPO_HARNESS_TEST_CLOCK_SEAM = previousSeam;
});
const retryPolicy = { max_consecutive_failures: 3, initial_backoff_ms: 100, maximum_backoff_ms: 150 };
function reserve(f: ReturnType<typeof setup>, key: string, operation: 'dispatch' | 'acquisition' = 'dispatch') {
  return reserveAutomationBudget({ repo_root: f.repo, automation_run_id: f.status.budget.automation_run_id,
    expected_budget_sha256: f.status.budget.budget_sha256, idempotency_key: key, operation,
    unit_kind: 'execute', unit_id: 'task', attempt: 1, provider: null, env: f.env });
}
function settle(f: ReturnType<typeof setup>, reservation: ReturnType<typeof reserve>, outcome: AutomationOutcome) {
  return appendAutomationUsage({ repo_root: f.repo, reservation, outcome, evidence_refs: [{ ref: 'fixture:verified-result', sha256: hex(reservation.idempotency_key) }], env: f.env });
}
function events(f: ReturnType<typeof setup>) {
  const path = join(f.repo, '.git', AUTOMATION_BUDGET_STORE_RELATIVE_ROOT, 'runs', f.status.budget.automation_run_id, 'events');
  return readdirSync(path).filter(n => n.endsWith('.json')).map(n => JSON.parse(readFileSync(join(path, n), 'utf8')));
}
function observed(f: ReturnType<typeof setup>) { return observeCampaignTransientRetry(events(f), retryPolicy, new Date(now).toISOString()); }

test('deterministic capped backoff, successful acquisition and replay preserve the streak; exhaustion refuses new effects', () => {
  const f = setup(2, 20, 20, 20, retryPolicy);
  const first = reserve(f, 'first'); settle(f, first, 'transient_failure');
  expect(observed(f)).toMatchObject({ consecutive_failures: 1, state: 'backoff', next_eligible_at: new Date(now + 100).toISOString() });
  const before = readAutomationBudgetStatus(f.repo, f.status.budget.automation_run_id, f.env).current.ledger_sha256;
  expect(() => reserve(f, 'too-soon')).toThrow('campaign_retry_backoff');
  expect(reserve(f, 'first')).toEqual(first);
  settle(f, first, 'transient_failure');
  expect(readAutomationBudgetStatus(f.repo, f.status.budget.automation_run_id, f.env).current.ledger_sha256).toBe(before);
  now += 100;
  settle(f, reserve(f, 'claim', 'acquisition'), 'progress');
  expect(observed(f).consecutive_failures).toBe(1);
  settle(f, reserve(f, 'second'), 'transient_failure');
  expect(observed(f).next_eligible_at).toBe(new Date(now + 150).toISOString());
  now += 150;
  settle(f, reserve(f, 'third'), 'transient_failure');
  expect(observed(f)).toMatchObject({ consecutive_failures: 3, state: 'exhausted' });
  expect(() => reserve(f, 'forbidden-claim', 'acquisition')).toThrow('campaign_retry_exhausted');
  expect(() => reserve(f, 'forbidden-dispatch')).toThrow('campaign_retry_exhausted');
  expect(readAutomationBudgetStatus(f.repo, f.status.budget.automation_run_id, f.env).current.open_reservation_sha256s).toHaveLength(0);
});

test('only completed logical work resets a streak; unknown work retains its reservation', () => {
  const f = setup(2, 20, 20, 20, retryPolicy);
  settle(f, reserve(f, 'failure'), 'transient_failure'); now += 100;
  settle(f, reserve(f, 'bookkeeping'), 'no_progress');
  expect(observed(f).consecutive_failures).toBe(1);
  settle(f, reserve(f, 'verified-work'), 'completed');
  expect(observed(f)).toMatchObject({ consecutive_failures: 0, state: 'eligible', next_eligible_at: null });
  reserve(f, 'unknown');
  expect(() => reserve(f, 'cannot-repeat')).toThrow('reconciliation_required');
  expect(readAutomationBudgetStatus(f.repo, f.status.budget.automation_run_id, f.env).current.open_reservation_sha256s).toHaveLength(1);
});

test('missing policy preserves grant bytes for inspection, while malformed authored policy fails closed', () => {
  const grant = authorization();
  expect(validateProgramAuthorization(grant)).toEqual(grant);
  expect(() => sealProgramAuthorization({ ...grant, campaign: { ...grant.campaign!, transient_retry: { ...retryPolicy, maximum_backoff_ms: 99 } } })).toThrow('below initial');
  expect(() => sealProgramAuthorization({ ...grant, campaign: { ...grant.campaign!, transient_retry: { ...retryPolicy, max_consecutive_failures: 0 } } })).toThrow();
});
