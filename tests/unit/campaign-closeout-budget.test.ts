import { afterAll, expect, test } from 'bun:test';
import { createHash } from 'crypto';
import { mkdtempSync, realpathSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';
import { sealProgramAuthorization, campaignProviderCallReservation, campaignProviderForOperation, type ProgramAuthorizationV1, type CampaignCloseoutOperation } from '../../src/core/automation/budget';
import { beginCampaignBudgetStep, ensureCampaignAuthoringBudget, reserveCampaignProviderBudget, readCampaignBudgetLedger, recordCampaignProviderOutcome, readAutomationBudgetStatus } from '../../src/effects/automation/budget-store';
import { mintProgramAuthorization } from '../../src/effects/automation/grant-store';

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
      transient_retry: { max_consecutive_failures: 3, initial_backoff_ms: 1, maximum_backoff_ms: 4 }, issue_author: 'gpt_pro',
      local_parent_host: 'codex',
      chrome_profile_directory: 'Profile-1',
      require_fresh_main_audit: true,
    },
    issued_by: 'ancienttwo',
    issued_at: issued.toISOString(),
    expires_at: expires.toISOString(),
  });
}

function setup(rounds = 2, runnerInvocations = 8, steps = 4, calls = 8) {
  const { repo, env } = fixture();
  const grant = authorization(rounds, runnerInvocations, steps, calls);
  mintProgramAuthorization({ repo_root: repo, authorization: grant, env });
  const status = ensureCampaignAuthoringBudget({ repo_root: repo, authorization: grant, env });
  return { repo, env, grant, status };
}

function stepInput(f: ReturnType<typeof setup>, key = 'step-1') {
  return { repo_root: f.repo, automation_run_id: f.status.budget.automation_run_id,
    expected_budget_sha256: f.status.budget.budget_sha256, campaign_id: f.grant.campaign!.campaign_id,
    group_number: 1 as const, intent_sha256: intent('group-1'), idempotency_key: key, env: f.env };
}

for (const operation of ['github_comment_attempt', 'github_close_attempt', 'git_ref_delete_attempt'] as const) {
  test(`${operation} reserves mutation and verification together and retains global stop`, () => {
    const f = setup();
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    const input = { ...stepInput(f, operation), step_admission_sha256: step.event_sha256, operation, request_sha256: hex(operation) };
    const admitted = reserveCampaignProviderBudget(input);
    expect(admitted.reservation.provider).toBe(campaignProviderForOperation(operation));
    expect(campaignProviderCallReservation(operation)).toBe(2);
    expect(admitted.reservation.reserved.runner_invocations).toBe(2);
    expect(admitted.reservation.reserved.provider_failures).toBe(2);
    expect(readCampaignBudgetLedger(f.repo, f.status.budget.automation_run_id, f.env)).toMatchObject({ provider_calls: 0, reserved_provider_calls: 2 });
    expect(() => reserveCampaignProviderBudget({ ...input, operation: 'github_read', idempotency_key: 'unreserved-read' })).toThrow('reconciliation_required');
    expect(reserveCampaignProviderBudget(input).disposition).toBe('replayed');
    recordCampaignProviderOutcome({ repo_root: f.repo, reservation: admitted.reservation, outcome: 'returned', result_sha256: hex('two-fixture-responses'), env: f.env });
    expect(readCampaignBudgetLedger(f.repo, f.status.budget.automation_run_id, f.env)).toMatchObject({ provider_calls: 2, reserved_provider_calls: 0 });
    expect(readAutomationBudgetStatus(f.repo, f.status.budget.automation_run_id, f.env).current.consumed.runner_invocations).toBe(2);
  });
}

test('one remaining Provider call cannot admit a two-call closeout attempt', () => {
  const f = setup(2, 8, 4, 1);
  const step = beginCampaignBudgetStep(stepInput(f)).admission;
  expect(() => reserveCampaignProviderBudget({ ...stepInput(f, 'close'), step_admission_sha256: step.event_sha256,
    operation: 'github_close_attempt', request_sha256: hex('close') })).toThrow('limit is exhausted');
  const status = readAutomationBudgetStatus(f.repo, f.status.budget.automation_run_id, f.env);
  expect(status.current.open_reservation_sha256s).toEqual([]);
  expect(status.stop_receipt?.triggering_metric).toBe('provider_calls');
});
