// Process-isolated unit boundary: only admission is synthetic. All finalization,
// locking, supervision, claims and budget stores below are the production code.
import { mock, expect } from 'bun:test';
import { join } from 'path';
import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, chmodSync } from 'fs';
import { execFileSync, spawnSync } from 'child_process';
mock.module('../../../src/effects/automation/campaign-revision-admission', () => ({ requireCampaignActiveAdmission() {} }));
const { historicalPlanningFixture, installHistoricalBoundDispatch, prepareHistoricalCodexInvocation, modeledContainerTerminal } = await import('../../helpers/historical-campaign-lifecycle');
const liveImage = process.env.BRC_TEST_RUNTIME_IMAGE;
if (!liveImage) {
  const runtime = await import('../../../src/effects/automation/campaign-runtime');
  mock.module('../../../src/effects/automation/campaign-runtime', () => ({ ...runtime, prepareCampaignCodexInvocation: prepareHistoricalCodexInvocation }));
}
const { runChild } = await import(process.env.BRC_TEST_HELPER === 'packaged' ? '../../../assets/templates/helpers/contract-run' : '../../../scripts/contract-run');
const { campaignContainerJournalRoot } = await import('../../../src/effects/automation/campaign-container');
const { bindCampaignWorker } = await import('../../../src/effects/automation/campaign-worker');
const { readAutomationBudgetStatus } = await import('../../../src/effects/automation/budget-store');
const { readTaskAutomationAttemptCurrent } = await import('../../../src/effects/engineers/automation-attempt-store');
const f = await historicalPlanningFixture();
const acquired = installHistoricalBoundDispatch(f); const worktree = acquired.envelope.worktree_path;
try {
  const profiles = join(f.root, '.codex/agents'); mkdirSync(profiles, { recursive: true });
  for (const [name, sandbox] of [['fast-worker', 'workspace-write'], ['gatekeeper', 'read-only']]) writeFileSync(join(profiles, `${name}.toml`), `model="fixture"\nsandbox_mode="${sandbox}"\nmodel_reasoning_effort="high"\ndeveloper_instructions="fixture"\n`);
  execFileSync('git', ['add', '.codex/agents'], { cwd: f.root });
  const bin = join(f.home, 'bin'); mkdirSync(bin);
  const codex = join(bin, 'codex'); writeFileSync(codex, '#!/bin/sh\necho codex-cli 1.0.0\n'); chmodSync(codex, 0o700);
  const env = { ...f.env, PATH: `${bin}:${process.env.PATH}`, ...(liveImage ? { BRC_CAMPAIGN_IMAGE: liveImage } : {}), REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../../..') };
  const input = { selector: acquired.worker_handoff, worktree, contract: acquired.envelope.plan.contract_path,
    worker_command: 'codex-exec:worker', verifier_command: 'codex-exec:verifier', provider: 'codex-exec' as const, env };
  const worker = bindCampaignWorker(input);
  const failure = process.argv[2];
  for (const role of ['worker', 'verifier'] as const) {
    writeFileSync(join(worktree, `${role}.prompt`), failure === 'worker_nonzero' && role === 'worker' ? 'worker_nonzero' : role === 'verifier' ? 'verifier_fail' : 'fixture');
    const deadline = Date.now() + 10000;
    const invocation = await worker.prepareChild(role, `${role}.prompt`, deadline);
    worker.beforeChild(role, input[role === 'worker' ? 'worker_command' : 'verifier_command']);
    const nonzero = failure === 'worker_nonzero' && role === 'worker';
    const text = role === 'verifier' ? JSON.stringify({ verdict: 'fail', review: 'fixture' }) : 'done';
    const events = [{ type: 'thread.started', thread_id: 'fixture' }, { type: 'item.completed', item: { id: 'message', type: 'agent_message', text } }, { type: 'turn.completed', usage: { input_tokens: 1, cached_input_tokens: 0, output_tokens: 1 } }];
    if (liveImage) {
      const observation = await runChild(role, input[role === 'worker' ? 'worker_command' : 'verifier_command'], worktree, worktree, env, deadline, undefined, invocation);
      expect(observation.exit_code).toBe(nonzero ? 7 : 0);
      worker.afterChild(observation);
    } else {
    const child = spawnSync(process.execPath, [join(import.meta.dir, '../../../scripts/run-bounded-verifier-command.ts'), '--deadline-ms', String(Date.now() + 10000),
      '--log', join(worktree, `${role}.out`), '--stderr-log', join(worktree, `${role}.err`), '--result', join(worktree, `${role}.result`), '--', process.execPath, '-e',
      nonzero ? 'process.exit(7)' : `console.log(${JSON.stringify(events.map(e => JSON.stringify(e)).join('\n'))})`], { cwd: worktree });
    expect(child.status).toBe(nonzero ? 7 : 0);
    const observed = JSON.parse(readFileSync(join(worktree, `${role}.result`), 'utf8'));
    const receipt = modeledContainerTerminal(invocation.container, readFileSync(join(worktree, `${role}.out`), 'utf8'), readFileSync(join(worktree, `${role}.err`), 'utf8'), observed);
    worker.afterChild({ ...observed, container_receipt_sha256: receipt, role, command: input[role === 'worker' ? 'worker_command' : 'verifier_command'], stdout_path: `${role}.out`, stderr_path: `${role}.err` });
    }
    if (nonzero) break;
  }
  writeFileSync(join(worktree, 'final.json'), JSON.stringify({ outcome: 'completed', evidence_paths: ['src/index.ts'] }));
  const final = worker.finish('final.json', { status: 'fail', failure_class: failure });
  expect(final.contract_run.status).toBe('fail'); expect(final.outcome).toBe('permanent_failure');
  const budget = readAutomationBudgetStatus(f.root, final.reservation.automation_run_id, env).current;
  expect(budget.open_reservation_sha256s).toHaveLength(0);
  expect(bindCampaignWorker(input).replay).toEqual(final);
  expect(readAutomationBudgetStatus(f.root, final.reservation.automation_run_id, env).current).toEqual(budget);
  expect(readTaskAutomationAttemptCurrent(f.root, acquired.acquired.offer.work_package_id, acquired.acquired.offer.work_package_revision)?.last_outcome).toBe('permanent_failure');
  console.log('actual finish(fail) settled and replayed');
} finally { const journals = campaignContainerJournalRoot(join(f.root, '.git')); if (liveImage && existsSync(journals)) for (const entry of readdirSync(journals)) { const request = JSON.parse(readFileSync(join(journals, entry, 'request.json'), 'utf8')); execFileSync('docker', ['--host', request.endpoint, 'rm', '-f', request.name], { timeout: 5000, stdio: 'ignore' }); } rmSync(journals, { recursive: true, force: true }); for (const root of [worktree, f.root, f.home]) rmSync(root, { recursive: true, force: true }); }
