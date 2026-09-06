import { afterAll, describe, expect, test } from 'bun:test';
import { createHash } from 'crypto';
import { mkdtempSync, realpathSync, rmSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

import {
  buildAutomationBudget,
  chainAutomationLedgerDigest,
  sealCampaignBudgetStepEvent,
  sealProgramAuthorization,
  sealCampaignAutomationReservation,
  type ProgramAuthorizationV1,
} from '../../src/core/automation/budget';
import {
  beginCampaignBudgetStep,
  publishAutomationBudget,
  completeCampaignBudgetStep,
  reserveCampaignProviderBudget,
  readCampaignBudgetLedger,
  AUTOMATION_BUDGET_STORE_RELATIVE_ROOT,
  appendAutomationUsage,
  ensureCampaignAuthoringBudget,
  readAutomationBudgetStatus,
  reconcileAutomationReservation,
  reserveCampaignAuthoringBudget,
} from '../../src/effects/automation/budget-store';
import { projectAutomationBudgetSlice } from '../../src/core/automation/projection';
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
function evidence(f: ReturnType<typeof setup>) {
  return [{ ref: `controller-run:${f.status.budget.automation_run_id}`, sha256: hex('actual-step-outcome') }];
}
function finish(f: ReturnType<typeof setup>, admission: ReturnType<typeof beginCampaignBudgetStep>['admission'], outcome: 'progress' | 'no_progress' = 'progress') {
  return completeCampaignBudgetStep({ repo_root: f.repo, admission, outcome, evidence_refs: evidence(f), env: f.env });
}
function provider(f: ReturnType<typeof setup>, admission: ReturnType<typeof beginCampaignBudgetStep>['admission'], key: string) {
  return reserveCampaignProviderBudget({ ...stepInput(f, key), step_admission_sha256: admission.event_sha256,
    operation: 'github_read', request_sha256: hex(key) });
}
function settle(f: ReturnType<typeof setup>, reservation: ReturnType<typeof provider>['reservation']) {
  return appendAutomationUsage({ repo_root: f.repo, reservation, outcome: 'completed', evidence_refs: evidence(f), env: f.env });
}
function runPath(f: ReturnType<typeof setup>) {
  return join(f.repo, '.git', AUTOMATION_BUDGET_STORE_RELATIVE_ROOT, 'runs', f.status.budget.automation_run_id);
}

describe('campaign step/provider budget composition', () => {
  test.each(['authorization_id', 'budget_sha256'] as const)('foreign step %s fails closed on recovery', (field) => {
      const f = setup();
      const before = readFileSync(join(runPath(f), 'current.json'), 'utf8');
      const admission = beginCampaignBudgetStep(stepInput(f)).admission;
      const completion = finish(f, admission);
      const { event_id: _id, event_sha256: _sha, ...body } = admission;
      const forged = sealCampaignBudgetStepEvent({ ...body, [field]: field === 'authorization_id' ? 'foreign-authorization' : hex('unpublished-budget') });
      const { event_id: _completionId, event_sha256: _completionSha, ...completionBody } = completion;
      const forgedCompletion = sealCampaignBudgetStepEvent({ ...completionBody,
        authorization_id: forged.authorization_id, budget_sha256: forged.budget_sha256,
        admission_sha256: forged.event_sha256,
        previous_ledger_sha256: chainAutomationLedgerDigest(admission.previous_ledger_sha256, forged.event_sha256),
      });
      const names = readdirSync(join(runPath(f), 'events'));
      const eventPath = join(runPath(f), 'events', names.find(name => name.endsWith('-admission.json'))!);
      writeFileSync(eventPath, JSON.stringify(forged));
      writeFileSync(join(runPath(f), 'events', names.find(name => name.endsWith('-completion.json'))!), JSON.stringify(forgedCompletion));
      writeFileSync(join(runPath(f), 'current.json'), before);
      expect(() => readAutomationBudgetStatus(f.repo, admission.automation_run_id, f.env)).toThrow(/campaign step.*(authorization|budget)/);
      expect(readFileSync(join(runPath(f), 'current.json'), 'utf8')).toBe(before);
  });

  test('board refuses a mixed snapshot when a writer changes events or held reservations', async () => {
    for (const mutation of ['step', 'reservation']) {
      const f = setup();
      const admission = mutation === 'reservation' ? beginCampaignBudgetStep(stepInput(f)).admission : null;
      const { env: _env, ...request } = stepInput(f, 'race');
      const store = join(import.meta.dir, '../../src/effects/automation/budget-store.ts');
      const child = Bun.spawn([process.execPath, '-e', `
        import fs from 'fs';
        import { mock } from 'bun:test';
        const original = fs.readdirSync;
        let triggered = false;
        mock.module('fs', () => ({ ...fs, readdirSync: (...args) => {
          const entries = original(...args);
          if (!triggered && String(args[0]) === ${JSON.stringify(join(runPath(f), 'reconciliations'))}) {
            triggered = true;
            const input = ${JSON.stringify(request)};
            const admission = ${JSON.stringify(admission)};
            if (admission === null) beginCampaignBudgetStep(input);
            else reserveCampaignProviderBudget({ ...input, operation: 'github_read', request_sha256: ${JSON.stringify(hex('race'))}, step_admission_sha256: admission.event_sha256 });
          }
          return entries;
        } }));
        const { beginCampaignBudgetStep, reserveCampaignProviderBudget, readAutomationBudgetBoardSlice } = await import(${JSON.stringify(store)});
        let error = null;
        try { readAutomationBudgetBoardSlice(${JSON.stringify(f.repo)}, ${JSON.stringify(f.status.budget.automation_run_id)}); }
        catch (e) { error = e.message; }
        const fresh = readAutomationBudgetBoardSlice(${JSON.stringify(f.repo)}, ${JSON.stringify(f.status.budget.automation_run_id)});
        console.log(JSON.stringify({ triggered, error, fresh }));
      `], { env: f.env, stdout: 'pipe', stderr: 'pipe' });
      const [exit, output, errors] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
      expect(errors).toBe('');
      expect(exit).toBe(0);
      const result = JSON.parse(output);
      expect(result.triggered).toBe(true);
      expect(result.error).toContain('campaign budget changed during board read');
      expect(result.fresh.metrics.find((m: { metric: string }) => m.metric === 'controller_steps').consumed).toBe(1);
      expect(result.fresh.open_reservation_count).toBe(mutation === 'reservation' ? 1 : 0);
    }
  });

  test('revision waits for active step completion and preserves consumption afterward', () => {
    const f = setup();
    const first = beginCampaignBudgetStep(stepInput(f));
    const previous = f.status.budget;
    const revised = buildAutomationBudget({
      automation_run_id: previous.automation_run_id,
      goal_id: previous.goal_id, goal_revision: previous.goal_revision,
      repository_id: previous.repository_id, engineer_id: null, claim_id: null,
      authorization: previous.authorization, contract_sha256: null, contract_limits: null,
      metric_support: previous.metric_support, unattended: true, created_by: previous.created_by,
      created_at: new Date().toISOString(), supersedes_sha256: previous.budget_sha256, revision: 2,
    });
    const before = readFileSync(join(runPath(f), 'current.json'), 'utf8');
    expect(() => publishAutomationBudget({ repo_root: f.repo, budget: revised, env: f.env })).toThrow('active campaign step');
    expect(readFileSync(join(runPath(f), 'current.json'), 'utf8')).toBe(before);
    finish(f, first.admission);
    publishAutomationBudget({ repo_root: f.repo, budget: revised, env: f.env });
    const second = beginCampaignBudgetStep({ ...stepInput(f, 'step-2'), expected_budget_sha256: revised.budget_sha256 });
    finish(f, second.admission);
    expect(readCampaignBudgetLedger(f.repo, previous.automation_run_id, f.env)).toEqual({
      controller_steps: 2, provider_calls: 0, reserved_provider_calls: 0, active_step: null,
    });
  });

  test('one step admits a read then authoring without nested unresolved reservations', () => {
    const f = setup();
    const input = stepInput(f);
    const first = beginCampaignBudgetStep(input);
    expect(first.disposition).toBe('admitted');
    expect(beginCampaignBudgetStep(input)).toEqual({ ...first, disposition: 'replayed' });
    const read = provider(f, first.admission, 'read-identity');
    expect(read.disposition).toBe('reserved');
    settle(f, read.reservation);
    const author = reserveCampaignAuthoringBudget({ ...stepInput(f, 'author'), operation: 'initial', step_admission_sha256: first.admission.event_sha256 });
    settle(f, author.reservation);
    expect(readAutomationBudgetStatus(f.repo, input.automation_run_id, f.env).current.open_reservation_sha256s).toEqual([]);
    const completed = finish(f, first.admission);
    expect(finish(f, first.admission)).toEqual(completed);
    expect(beginCampaignBudgetStep(input).disposition).toBe('replayed');
    expect(readCampaignBudgetLedger(f.repo, input.automation_run_id, f.env)).toEqual({ controller_steps: 1, provider_calls: 2, reserved_provider_calls: 0, active_step: null });
  });

  test('different step and standalone provider cannot bypass an unfinished step', () => {
    const f = setup();
    const first = beginCampaignBudgetStep(stepInput(f));
    const before = readFileSync(join(runPath(f), 'current.json'), 'utf8');
    expect(() => beginCampaignBudgetStep(stepInput(f, 'step-2'))).toThrow('reconciliation_required');
    expect(() => reserveCampaignAuthoringBudget({ ...stepInput(f, 'standalone'), operation: 'initial' })).toThrow('active campaign step');
    expect(readFileSync(join(runPath(f), 'current.json'), 'utf8')).toBe(before);
    finish(f, first.admission);
    expect(() => provider(f, first.admission, 'late-call')).toThrow('active campaign step');
  });

  test('unknown leaf blocks calls and completion until exact not-started reconciliation', () => {
    const f = setup();
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    const first = provider(f, step, 'unknown-call');
    expect(provider(f, step, 'unknown-call').disposition).toBe('replayed');
    expect(() => provider(f, step, 'another-call')).toThrow('reconciliation_required');
    expect(() => finish(f, step)).toThrow('reconciliation');
    reconcileAutomationReservation({ repo_root: f.repo, reservation: first.reservation,
      resolution: 'reconciled_not_started', reason: 'adapter was not invoked', outcome: 'no_progress', evidence_refs: evidence(f), env: f.env });
    const retry = provider(f, step, 'unknown-call');
    expect(retry.disposition).toBe('reserved');
    expect(retry.reservation.attempt).toBe(2);
    settle(f, retry.reservation);
    finish(f, step);
    expect(readCampaignBudgetLedger(f.repo, step.automation_run_id, f.env).provider_calls).toBe(1);
  });

  test('step cap allows its final admitted leaf and completion, then refuses a new step', () => {
    const f = setup(2, 8, 1, 8);
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    const call = provider(f, step, 'last-step-call');
    settle(f, call.reservation);
    finish(f, step);
    expect(() => beginCampaignBudgetStep(stepInput(f, 'over-cap'))).toThrow('controller_steps');
    const status = readAutomationBudgetStatus(f.repo, step.automation_run_id, f.env);
    expect(status.stop_receipt?.triggering_metric).toBe('controller_steps');
    expect(status.stop_receipt?.consumed).toBe(1);
    expect(beginCampaignBudgetStep(stepInput(f)).disposition).toBe('replayed');
  });

  test('a multi-call snapshot stops before the adapter call that exceeds its cap, then can complete', () => {
    const f = setup(2, 8, 4, 2);
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    const invoked: string[] = [];
    const run = (key: string) => {
      const admission = provider(f, step, key);
      if (admission.disposition !== 'reserved') throw new Error('replay cannot invoke');
      invoked.push(key);
      settle(f, admission.reservation);
    };
    run('repository-identity'); run('page-1');
    expect(() => run('page-2')).toThrow('provider_calls');
    expect(invoked).toEqual(['repository-identity', 'page-1']);
    finish(f, step, 'no_progress');
    expect(readCampaignBudgetLedger(f.repo, step.automation_run_id, f.env).active_step).toBeNull();
    expect(readAutomationBudgetStatus(f.repo, step.automation_run_id, f.env).stop_receipt?.triggering_metric).toBe('provider_calls');
  });

  test('only a completed step updates the no-progress streak', () => {
    const f = setup();
    const first = beginCampaignBudgetStep(stepInput(f)).admission;
    finish(f, first, 'no_progress');
    const second = beginCampaignBudgetStep(stepInput(f, 'second')).admission;
    settle(f, provider(f, second, 'successful-read').reservation);
    expect(readAutomationBudgetStatus(f.repo, first.automation_run_id, f.env).current.consecutive_no_progress_steps).toBe(1);
    finish(f, second, 'no_progress');
    expect(readAutomationBudgetStatus(f.repo, first.automation_run_id, f.env).current.consecutive_no_progress_steps).toBe(2);
  });

  test('completion replay rejects changed outcome or evidence without changing current', () => {
    const f = setup();
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    finish(f, step);
    const before = readFileSync(join(runPath(f), 'current.json'), 'utf8');
    expect(() => finish(f, step, 'no_progress')).toThrow('changes its outcome');
    expect(() => completeCampaignBudgetStep({ repo_root: f.repo, admission: step, outcome: 'progress', evidence_refs: [], env: f.env })).toThrow('changes its outcome');
    expect(readFileSync(join(runPath(f), 'current.json'), 'utf8')).toBe(before);
  });

  test('event before current crash refolds admission and completion without charging a second step', () => {
    const f = setup();
    const path = join(runPath(f), 'current.json');
    const before = readFileSync(path);
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    const admitted = readFileSync(path);
    writeFileSync(path, before);
    expect(readAutomationBudgetStatus(f.repo, step.automation_run_id, f.env).drift).toBe('unfolded_event');
    expect(beginCampaignBudgetStep(stepInput(f)).disposition).toBe('replayed');
    finish(f, step);
    writeFileSync(path, admitted);
    expect(readAutomationBudgetStatus(f.repo, step.automation_run_id, f.env).drift).toBe('unfolded_event');
    expect(readCampaignBudgetLedger(f.repo, step.automation_run_id, f.env).controller_steps).toBe(1);
    expect(readCampaignBudgetLedger(f.repo, step.automation_run_id, f.env).active_step).toBeNull();
  });

  test('deleting a counted admission cannot forgive spend or leave a valid completion', () => {
    const f = setup();
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    finish(f, step);
    const directory = join(runPath(f), 'events');
    const admission = readdirSync(directory).find(name => name.endsWith('-admission.json'))!;
    unlinkSync(join(directory, admission));
    expect(() => readAutomationBudgetStatus(f.repo, step.automation_run_id, f.env)).toThrow();
  });

  test('a group cannot replace its bound intent after completing a step', () => {
    const f = setup();
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    finish(f, step);
    expect(() => beginCampaignBudgetStep({ ...stepInput(f, 'changed-intent'), intent_sha256: intent('other') })).toThrow('different intent');
  });
});


describe('campaign budget closed boundaries', () => {
  test('grant limits reject missing, zero and non-integer values', () => {
    const grant = authorization();
    for (const field of ['max_controller_steps', 'max_provider_calls'] as const) {
      for (const value of [undefined, 0, -1, 1.5]) {
        const campaign = { ...grant.campaign!, [field]: value };
        if (value === undefined) delete campaign[field];
        expect(() => sealProgramAuthorization({ ...grant, campaign } as unknown as ProgramAuthorizationV1)).toThrow();
      }
    }
  });

  test('completion requires closed outcome and nonempty evidence before any write', () => {
    const f = setup();
    const admission = beginCampaignBudgetStep(stepInput(f)).admission;
    const before = readFileSync(join(runPath(f), 'current.json'), 'utf8');
    expect(() => completeCampaignBudgetStep({ repo_root: f.repo, admission, outcome: 'progress', evidence_refs: [], env: f.env })).toThrow('requires exact evidence');
    expect(() => completeCampaignBudgetStep({ repo_root: f.repo, admission, outcome: 'unknown' as 'progress', evidence_refs: evidence(f), env: f.env })).toThrow('outcome is invalid');
    expect(readFileSync(join(runPath(f), 'current.json'), 'utf8')).toBe(before);
  });

  test('provider cannot spend under another admission or change a request on replay', () => {
    const f = setup();
    const admission = beginCampaignBudgetStep(stepInput(f)).admission;
    const before = readFileSync(join(runPath(f), 'current.json'), 'utf8');
    expect(() => reserveCampaignProviderBudget({ ...stepInput(f, 'foreign'), step_admission_sha256: hex('foreign'), operation: 'github_read', request_sha256: hex('request') })).toThrow('active campaign step');
    expect(readFileSync(join(runPath(f), 'current.json'), 'utf8')).toBe(before);
    const first = provider(f, admission, 'exact-call');
    expect(() => reserveCampaignProviderBudget({ ...stepInput(f, 'exact-call'), step_admission_sha256: admission.event_sha256, operation: 'github_read', request_sha256: hex('different-request') })).toThrow('changes its bound operation context');
    expect(first.reservation.campaign_context.step_admission_sha256).toBe(admission.event_sha256);
  });

  test('stored campaign reservations reject mismatched provider and absent GitHub step binding', () => {
    const f = setup();
    const step = beginCampaignBudgetStep(stepInput(f)).admission;
    const { reservation } = provider(f, step, 'wire-call');
    expect(() => sealCampaignAutomationReservation({ ...reservation, provider: 'gpt-pro' })).toThrow('provider does not match');
    expect(() => sealCampaignAutomationReservation({ ...reservation,
      campaign_context: { ...reservation.campaign_context, step_admission_sha256: null },
    })).toThrow('requires campaign step admission');
  });

  test('operator projection reports independent consumed and held counts from the same ledger', () => {
    const f = setup(2, 8, 4, 5);
    const admission = beginCampaignBudgetStep(stepInput(f)).admission;
    provider(f, admission, 'held-call');
    const status = readAutomationBudgetStatus(f.repo, admission.automation_run_id, f.env);
    const slice = projectAutomationBudgetSlice({ budget: status.budget, current: status.current,
      stop_receipt: status.stop_receipt, drift: status.drift, observed_at: new Date().toISOString(),
      campaign_ledger: readCampaignBudgetLedger(f.repo, admission.automation_run_id, f.env) });
    expect(slice.metrics.find(metric => metric.metric === 'controller_steps')).toEqual({ metric: 'controller_steps', enforced: true, limit: 4, consumed: 1, reserved: 0, remaining: 3 });
    expect(slice.metrics.find(metric => metric.metric === 'provider_calls')).toEqual({ metric: 'provider_calls', enforced: true, limit: 5, consumed: 0, reserved: 1, remaining: 4 });
    expect(() => projectAutomationBudgetSlice({ budget: status.budget, current: status.current, stop_receipt: status.stop_receipt,
      drift: status.drift, observed_at: new Date().toISOString() })).toThrow('requires its validated ledger');
  });

  test('late completion records an incurred outcome after the deadline without spending again', async () => {
    const f = setup();
    const admission = beginCampaignBudgetStep(stepInput(f)).admission;
    const store = join(import.meta.dir, '../../src/effects/automation/budget-store.ts');
    const clock = join(import.meta.dir, '../../src/effects/automation/budget-store.internal.ts');
    const child = Bun.spawn([process.execPath, '-e', `
      import { completeCampaignBudgetStep, readCampaignBudgetLedger } from ${JSON.stringify(store)};
      import { __setAutomationClockForTests } from ${JSON.stringify(clock)};
      __setAutomationClockForTests(() => new Date(${JSON.stringify(Date.parse(f.status.budget.deadline_at) + 1000)}));
      const event = completeCampaignBudgetStep(${JSON.stringify({ repo_root: f.repo, admission, outcome: 'no_progress', evidence_refs: evidence(f) })});
      console.log(JSON.stringify(event));
    `], { env: { ...f.env, REPO_HARNESS_TEST_CLOCK_SEAM: '1' }, stdout: 'pipe', stderr: 'pipe' });
    const [exit, output, errors] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
    expect(errors).toBe('');
    expect(exit).toBe(0);
    expect(JSON.parse(output).admission_sha256).toBe(admission.event_sha256);
  });

  test('cross-process same identity charges one step, and different identities cannot race admission', async () => {
    for (const sameKey of [true, false]) {
      const f = setup();
      const store = join(import.meta.dir, '../../src/effects/automation/budget-store.ts');
      const spawn = (key: string) => {
        const { env: _env, ...request } = stepInput(f, key);
        return Bun.spawn([process.execPath, '-e', `
        import { beginCampaignBudgetStep } from ${JSON.stringify(store)};
        try { console.log(JSON.stringify(beginCampaignBudgetStep(${JSON.stringify(request)}))); }
        catch (error) { console.error(error.message); process.exit(1); }
      `], { env: f.env, stdout: 'pipe', stderr: 'pipe' });
      };
      const children = [spawn('race-a'), spawn(sameKey ? 'race-a' : 'race-b')];
      const results = await Promise.all(children.map(async child => ({
        exit: await child.exited, output: await new Response(child.stdout).text(), error: await new Response(child.stderr).text(),
      })));
      expect(results.map(result => result.exit).sort()).toEqual(sameKey ? [0, 0] : [0, 1]);
      expect(results.filter(result => result.exit === 0).map(result => JSON.parse(result.output).disposition).sort()).toEqual(sameKey ? ['admitted', 'replayed'] : ['admitted']);
      if (!sameKey) expect(results.find(result => result.exit !== 0)!.error).toContain('reconciliation_required');
      expect(readCampaignBudgetLedger(f.repo, f.status.budget.automation_run_id, f.env).controller_steps).toBe(1);
    }
  });
});
