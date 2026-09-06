import { afterEach, expect, test } from 'bun:test';
import { execFileSync, spawnSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AutomationBudgetStoreError, ensureCampaignAuthoringBudget, reserveAutomationBudget, appendAutomationUsage, readAutomationBudgetStatus } from '../../src/effects/automation/budget-store';
import { resolveGitCommonDirectory } from '../../src/effects/git/common-directory';
import { readyFixture } from '../helpers/campaign-acquisition-fixture';
import { runCampaignAcquisition } from '../../src/effects/automation/campaign-acquisition';
import { bindCampaignWorker } from '../../src/effects/automation/campaign-worker';
import { readTaskAutomationAttemptCurrent } from '../../src/effects/engineers/automation-attempt-store';
import { readPlanningRecord } from '../../src/effects/automation/campaign-planning-store';
import { canonicalMessageDigest } from '../../src/core/messages/mechanics';
import { processSprintDependencies, releaseSprintCommand } from '../../src/effects/state/coordination-sprint';
import type { WorkPackageRetryPolicyV1 } from '../../src/core/engineers/scheduling';

const roots: string[] = [];
afterEach(() => { roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })); });
async function acquired(requiredReview = false, retryPolicy?: WorkPackageRetryPolicyV1, twoEngineers = false) {
  const f = await readyFixture(twoEngineers, requiredReview, retryPolicy); roots.push(f.root, f.home);
  const result = runCampaignAcquisition(f.executeInput);
  if (!('worker_handoff' in result) || !result.worker_handoff || !result.envelope) throw new Error(JSON.stringify(result));
  roots.push(result.envelope.worktree_path);
  const handoff = readPlanningRecord<{ acquired: { offer: { work_package_id: string; work_package_revision: string } } }>(f.root, f.intent, canonicalMessageDigest({ dispatch: result.worker_handoff.dispatch_id, part: 'handoff' }).slice(7))!;
  return { ...f, result: { ...result, worker_handoff: result.worker_handoff, envelope: result.envelope }, handoff, worktree: result.envelope.worktree_path };
}

test('real acquired contract worker writes once and binds its explicit result to the existing attempt', async () => {
  const f = await acquired(); const selector = join(f.worktree, 'selector.json');
  writeFileSync(selector, JSON.stringify(f.result.worker_handoff));
  const worker = "printf written > src/index.ts; printf '{\"outcome\":\"completed\",\"evidence_paths\":[\"src/index.ts\"]}\\n' > \"$CONTRACT_RUN_ATTEMPT_RESULT\"";
  const args = [join(import.meta.dir, '../../scripts/contract-run.ts'), 'run', '--repo', f.worktree, '--contract', f.result.envelope.plan.contract_path,
    '--campaign-handoff', 'selector.json', '--worker-command', worker, '--verifier-command', 'test -f src/index.ts', '--out', '.ai/harness/worker-test', '--json'];
  const run = () => spawnSync(process.execPath, args, { cwd: f.worktree, env: f.env, encoding: 'utf8' });
  const first = run(); expect(first.status, first.stderr + first.stdout).toBe(0);
  expect(readFileSync(join(f.worktree, 'src/index.ts'), 'utf8')).toBe('written');
  const final = JSON.parse(first.stdout).campaign_attempt;
  expect(final.outcome).toBe('completed');
  const offer = f.handoff.acquired.offer;
  expect(readTaskAutomationAttemptCurrent(f.root, offer.work_package_id, offer.work_package_revision)).toMatchObject({ attempt_count: 1, last_outcome: 'completed' });
  writeFileSync(join(f.worktree, 'src/index.ts'), 'preserved');
  args[0] = join(import.meta.dir, '../../assets/templates/helpers/contract-run.ts');
  const replay = run(); expect(replay.status, replay.stderr).toBe(0);
  expect(JSON.parse(replay.stdout).campaign_attempt).toEqual(final);
  expect(readFileSync(join(f.worktree, 'src/index.ts'), 'utf8')).toBe('preserved');
  expect(existsSync(join(f.worktree, '.ai/harness/acceptance-receipt.json'))).toBe(false);
}, 60_000);

for (const mode of ['headroom', 'last', 'exhausted']) test(mode === 'exhausted'
  ? 'repair exhaustion refuses a real later Task attempt before its worker child'
  : mode === 'last' ? 'the last authorized repair completes both children and replays without another charge'
  : 'a real later Task attempt consumes one repair cycle and replay consumes none', async () => {
  const exhausted = mode === 'exhausted';
  const last = mode === 'last';
  const f = await acquired(false, { max_automated_attempts: 2, retryable_failure_classes: ['transient_failure'],
    backoff: { kind: 'fixed', initial_seconds: 1, maximum_seconds: 1 }, attention_after_seconds: 60,
    revision_reset: 'reset_on_work_package_revision' }, true);
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
  const repairs = () => readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current.consumed.repair_cycles;
  const run = (worktree: string, selector: unknown, contract: string, outcome: string) => {
    writeFileSync(join(worktree, 'selector.json'), JSON.stringify(selector));
    const command = `printf attempted > src/index.ts; printf '{"outcome":"${outcome}","evidence_paths":["src/index.ts"]}\\n' > "$CONTRACT_RUN_ATTEMPT_RESULT"`;
    return spawnSync(process.execPath, [join(import.meta.dir, '../../scripts/contract-run.ts'), 'run', '--repo', worktree,
      '--contract', contract, '--campaign-handoff', 'selector.json', '--worker-command', command,
      '--verifier-command', 'test -f src/index.ts', '--out', '.ai/harness/retry-test', '--json'], { cwd: worktree, env: f.env, encoding: 'utf8' });
  };
  const first = run(f.worktree, f.result.worker_handoff, f.result.envelope.plan.contract_path, 'transient_failure');
  expect(first.status, first.stdout + first.stderr).toBe(0);
  expect(repairs()).toBe(0);
  expect(releaseSprintCommand({ claimId: f.result.envelope.claim_id }, processSprintDependencies(f.root)).exitCode).toBe(0);
  // Model explicit operator cleanup of the disposable failed attempt before fresh acquisition.
  const branch = execFileSync('git', ['branch', '--show-current'], { cwd: f.worktree, encoding: 'utf8' }).trim();
  execFileSync('git', ['worktree', 'remove', '--force', f.worktree], { cwd: f.root });
  execFileSync('git', ['branch', '-D', branch], { cwd: f.root });
  await Bun.sleep(1100);
  const second = runCampaignAcquisition({ ...f.executeInput, idempotency_key: 'real-retry' });
  if (!('worker_handoff' in second) || !second.worker_handoff || !second.envelope) throw new Error(JSON.stringify(second));
  expect(second.envelope.task_id).toBe(f.result.envelope.task_id);
  roots.push(second.envelope.worktree_path);
  if (exhausted || last) {
    for (let index = 0; index < f.authorization.budget.max_repair_cycles - (last ? 1 : 0); index++) {
      const reservation = reserveAutomationBudget({ repo_root: f.root, automation_run_id: budget.automation_run_id,
        expected_budget_sha256: budget.budget_sha256, idempotency_key: `fixture-prior-repair-${index}`, operation: 'retry',
        unit_kind: 'execute', unit_id: 'fixture-other-task', attempt: index + 1, provider: null, env: f.env });
      appendAutomationUsage({ repo_root: f.root, reservation, outcome: 'progress', evidence_refs: [{ ref: 'fixture:prior-repair', sha256: 'a'.repeat(64) }], env: f.env });
    }
  }
  const retry = run(second.envelope.worktree_path, second.worker_handoff, second.envelope.plan.contract_path, 'completed');
  if (exhausted) {
    expect(retry.status, retry.stdout + retry.stderr).not.toBe(0);
    expect(readFileSync(join(second.envelope.worktree_path, 'src/index.ts'), 'utf8')).toBe('export {};\n');
    expect(readTaskAutomationAttemptCurrent(f.root, f.handoff.acquired.offer.work_package_id, f.handoff.acquired.offer.work_package_revision)).toMatchObject({ attempt_count: 1, last_outcome: 'transient_failure' });
    return;
  }
  expect(retry.status, retry.stdout + retry.stderr).toBe(0);
  expect(repairs()).toBe(last ? f.authorization.budget.max_repair_cycles : 1);
  expect(readTaskAutomationAttemptCurrent(f.root, f.handoff.acquired.offer.work_package_id, f.handoff.acquired.offer.work_package_revision)).toMatchObject({ attempt_count: 2, last_outcome: 'completed' });
  const replay = run(second.envelope.worktree_path, second.worker_handoff, second.envelope.plan.contract_path, 'completed');
  expect(replay.status, replay.stderr).toBe(0);
  expect(repairs()).toBe(last ? f.authorization.budget.max_repair_cycles : 1);
}, 60_000);

test('stale Lease fails before an acquired worker can bind or invoke', async () => {
  const f = await acquired();
  expect(releaseSprintCommand({ claimId: f.result.envelope.claim_id }, processSprintDependencies(f.root)).exitCode).toBe(0);
  expect(() => bindCampaignWorker({ selector: f.result.worker_handoff, worktree: f.worktree, contract: f.result.envelope.plan.contract_path,
    worker_command: 'touch forbidden', verifier_command: 'true', env: f.env })).toThrow();
  expect(existsSync(join(f.worktree, 'forbidden'))).toBe(false);
}, 60_000);

test('a claimed launch without completion cannot spawn on replay or change its commands', async () => {
  const f = await acquired(); const input = { selector: f.result.worker_handoff, worktree: f.worktree, contract: f.result.envelope.plan.contract_path,
    worker_command: 'true', verifier_command: 'true', env: f.env };
  bindCampaignWorker(input);
  expect(() => bindCampaignWorker(input)).toThrow('reconciliation');
  expect(() => bindCampaignWorker({ ...input, worker_command: 'false' })).toThrow('changes its launch request');
}, 60_000);

function workerInput(f: Awaited<ReturnType<typeof acquired>>) {
  return { selector: f.result.worker_handoff, worktree: f.worktree, contract: f.result.envelope.plan.contract_path,
    worker_command: 'true', verifier_command: 'true', env: f.env };
}
function observedChild(f: Awaited<ReturnType<typeof acquired>>, role: 'worker' | 'verifier') {
  mkdirSync(join(f.worktree, '.ai/harness/process'), { recursive: true });
  const path = `.ai/harness/process/${role}.log`; writeFileSync(join(f.worktree, path), 'observed process output');
  return { role, command: 'true', exit_code: 0, stdout_path: path, stderr_path: path };
}

test('unknown process and timeout observations never settle the external reservation', async () => {
  const f = await acquired(); const worker = bindCampaignWorker(workerInput(f));
  worker.beforeChild('worker', 'true');
  expect(() => worker.afterChild({ ...observedChild(f, 'worker'), exit_code: 124, timed_out: true })).toThrow('unknown');
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current.open_reservation_sha256s).toHaveLength(1);
  expect(() => bindCampaignWorker(workerInput(f))).toThrow('reconciliation');
}, 60_000);

test('missing explicit result leaves the started attempt unavailable for blind replay', async () => {
  const f = await acquired(); const worker = bindCampaignWorker(workerInput(f));
  for (const role of ['worker', 'verifier'] as const) { worker.beforeChild(role, 'true'); worker.afterChild(observedChild(f, role)); }
  expect(() => worker.finish('missing-result.json', { status: 'pass', failure_class: null })).toThrow();
  const offer = f.handoff.acquired.offer;
  expect(readTaskAutomationAttemptCurrent(f.root, offer.work_package_id, offer.work_package_revision)).toMatchObject({ attempt_count: 1, last_outcome: 'started' });
  expect(() => bindCampaignWorker(workerInput(f))).toThrow('reconciliation');
}, 60_000);

test('final evidence recovers attempt completion without another host action', async () => {
  const f = await acquired(); const worker = bindCampaignWorker(workerInput(f));
  for (const role of ['worker', 'verifier'] as const) { worker.beforeChild(role, 'true'); worker.afterChild(observedChild(f, role)); }
  const attempts = join(resolveGitCommonDirectory(f.root), 'repo-harness/engineer-attempts');
  const before = join(f.home, 'started-attempts'); cpSync(attempts, before, { recursive: true });
  writeFileSync(join(f.worktree, 'result.json'), JSON.stringify({ outcome: 'completed', evidence_paths: ['src/index.ts'] }));
  const final = worker.finish('result.json', { status: 'pass', failure_class: null });
  // Preserve the producer's final evidence, restore only the downstream attempt
  // store to model a crash before its completion transaction.
  rmSync(attempts, { recursive: true }); cpSync(before, attempts, { recursive: true });
  const recovered = bindCampaignWorker(workerInput(f));
  expect(recovered.replay).toEqual(final);
  const offer = f.handoff.acquired.offer;
  expect(readTaskAutomationAttemptCurrent(f.root, offer.work_package_id, offer.work_package_revision)?.last_outcome).toBe('completed');
  expect(() => recovered.beforeChild('worker', 'true')).toThrow('cannot spawn');
}, 60_000);

test('campaign invocation budget exhaustion refuses the child before attempt start', async () => {
  const f = await acquired(); const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
  for (let n = 0; n <= budget.effective_limits.max_runner_invocations; n++) {
    if (readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current.state === 'budget_exhausted') break;
    try {
    const reservation = reserveAutomationBudget({ repo_root: f.root, automation_run_id: budget.automation_run_id, expected_budget_sha256: budget.budget_sha256,
      idempotency_key: `fixture-dispatch-${n}`, operation: 'dispatch', unit_kind: 'execute', unit_id: 'campaign-1', attempt: 1, provider: null, env: f.env });
    appendAutomationUsage({ repo_root: f.root, reservation, outcome: 'no_progress', evidence_refs: [{ ref: 'fixture:observed-dispatch', sha256: 'a'.repeat(64) }], env: f.env });
    } catch (error) {
      if (!(error instanceof AutomationBudgetStoreError) || !['budget_limit_exceeded', 'budget_exhausted'].includes(error.refusal?.refusal_code ?? '')) throw error;
    }
  }
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current.state).toBe('budget_exhausted');
  const worker = bindCampaignWorker(workerInput(f));
  expect(() => worker.beforeChild('worker', 'true')).toThrow();
  const offer = f.handoff.acquired.offer;
  expect(readTaskAutomationAttemptCurrent(f.root, offer.work_package_id, offer.work_package_revision)).toBeNull();
}, 60_000);


test('selector forgery and changed projected contract fail before launch', async () => {
  const f = await acquired(); const input = workerInput(f);
  expect(() => bindCampaignWorker({ ...input, selector: { ...f.result.worker_handoff, dispatch_id: `sha256:${'0'.repeat(64)}` } })).toThrow('not stored');
  const contractPath = join(f.worktree, input.contract); const contract = readFileSync(contractPath);
  writeFileSync(contractPath, Buffer.concat([contract, Buffer.from('\nUnauthorized contract change\n')]));
  expect(() => bindCampaignWorker(input)).toThrow('contract changed');
  writeFileSync(contractPath, contract);
  expect(bindCampaignWorker(input).replay).toBeNull();
}, 60_000);


test('missing required Review File stays failed on exact campaign replay without another child', async () => {
  const f = await acquired(true);
  writeFileSync(join(f.worktree, 'selector.json'), JSON.stringify(f.result.worker_handoff));
  const worker = "printf written > src/index.ts; printf '{\"outcome\":\"completed\",\"evidence_paths\":[\"src/index.ts\"]}' > \"$CONTRACT_RUN_ATTEMPT_RESULT\"";
  const args = [join(import.meta.dir, '../../scripts/contract-run.ts'), 'run', '--repo', f.worktree, '--contract', f.result.envelope.plan.contract_path,
    '--campaign-handoff', 'selector.json', '--worker-command', worker, '--verifier-command', 'true', '--out', '.ai/harness/missing-review-test', '--json'];
  const run = () => spawnSync(process.execPath, args, { cwd: f.worktree, env: f.env, encoding: 'utf8' });
  const first = run(); expect(first.status, first.stderr).toBe(1);
  expect(JSON.parse(first.stdout)).toMatchObject({ status: 'fail', failure_class: 'missing_review' });
  writeFileSync(join(f.worktree, 'src/index.ts'), 'preserved');
  args[0] = join(import.meta.dir, '../../assets/templates/helpers/contract-run.ts');
  const replay = run(); expect(replay.status, replay.stderr).toBe(1);
  expect(JSON.parse(replay.stdout)).toMatchObject({ status: 'fail', failure_class: 'missing_review' });
  expect(readFileSync(join(f.worktree, 'src/index.ts'), 'utf8')).toBe('preserved');
}, 60_000);
