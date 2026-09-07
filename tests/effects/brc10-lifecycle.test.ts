import { afterEach, expect, test } from 'bun:test';
import { rmSync, writeFileSync, readFileSync, mkdirSync, chmodSync } from 'fs';
import { join } from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { readPlanningRecord } from '../../src/effects/automation/campaign-planning-store';
import { campaignRuntimeRecordKey } from '../../src/core/automation/campaign-runtime';
import { readyFixture } from '../helpers/campaign-acquisition-fixture';
import { runCampaignAcquisition } from '../../src/effects/automation/campaign-acquisition';
import { bindCampaignWorker } from '../../src/effects/automation/campaign-worker';
import { retireCampaignDispatch, observeCampaignReclaimEligibility, recoverCampaignDispatch } from '../../src/effects/automation/campaign-recovery';
import { ensureCampaignAuthoringBudget, readAutomationBudgetStatus } from '../../src/effects/automation/budget-store';
import { readLease } from '../../src/effects/state/coordination-lease-store';
import { readLeaseLiveness } from '../../src/effects/state/coordination-lease-liveness-store';
import { readClaimTokenForTask } from '../../src/effects/state/coordination-claim-token';
import { readClaimActorReceipt } from '../../src/effects/engineers/claim-actor-store';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
async function acquired() {
  const f = await readyFixture(); roots.push(f.root, f.home);
  const result = runCampaignAcquisition(f.executeInput);
  if (!('worker_handoff' in result) || !result.worker_handoff || !result.envelope) throw new Error(JSON.stringify(result));
  roots.push(result.envelope.worktree_path);
  const input = { selector: result.worker_handoff, host: f.executeInput.host, session_id: f.executeInput.session_id, env: f.env };
  return { ...f, envelope: result.envelope, input };
}

test('acquisition arms liveness and retirement fences a previously bound controller', async () => {
  const f = await acquired();
  expect(readLeaseLiveness(f.root, f.envelope.task_id).current.lease_generation).toBe(f.envelope.generation);
  const controller = bindCampaignWorker({ selector: f.input.selector, worktree: f.envelope.worktree_path,
    contract: f.envelope.plan.contract_path, worker_command: 'true', verifier_command: 'true', env: f.env });
  retireCampaignDispatch(f.input);
  expect(() => controller.beforeChild('worker', 'true')).toThrow('retired');
  expect(() => controller.renew()).toThrow('retired');
  const receipt = observeCampaignReclaimEligibility({ ...f.input, now: () => new Date(Date.now() + 60_000) });
  expect(receipt.classification).toBe('reclaimable');
  expect(receipt.evidence.controller_terminal).toBe(true);
  expect(receipt.evidence.runtime_effect_inactive).toBe(true);
}, 60_000);

test('recovery resumes every persisted boundary without a new worktree or second generation', async () => {
  const f = await acquired();
  const now = () => new Date(Date.now() + 60_000);
  const source = join(f.envelope.worktree_path, 'src/index.ts');
  writeFileSync(source, 'preserved dirty work\n');
  const boundaries = ['after_intent', 'after_lease_write', 'after_bind', 'after_token', 'after_actor', 'after_recovered'] as const;
  let newClaim: string | undefined;
  for (const boundary of boundaries) {
    expect(() => recoverCampaignDispatch({ ...f.input, now, crash_hook: point => { if (point === boundary) throw new Error(`crash:${point}`); } })).toThrow(`crash:${boundary}`);
    const owner = readLease(f.root, f.envelope.task_id).record!;
    if (boundary !== 'after_intent') {
      newClaim ??= owner.claim_id;
      expect(owner.claim_id).toBe(newClaim!);
      expect(owner.generation).toBe(f.envelope.generation + 1);
    }
    expect(readFileSync(source, 'utf8')).toBe('preserved dirty work\n');
  }
  const resumed = recoverCampaignDispatch({ ...f.input, now });
  expect(resumed.envelope.claim_id).toBe(newClaim!);
  expect(resumed.envelope.worktree_path).toBe(f.envelope.worktree_path);
  expect(resumed.envelope.branch).toBe(f.envelope.branch);
  expect(readClaimTokenForTask(f.envelope.worktree_path, f.envelope.task_id)).toMatchObject({ outcome: 'found', token: { claim_id: newClaim } });
  expect(readClaimActorReceipt(f.root, f.envelope.task_id, newClaim!)).toEqual(resumed.receipt);
}, 60_000);

test('a raw command launch never becomes provider-terminal evidence after retirement', async () => {
  const f = await acquired();
  const controller = bindCampaignWorker({ selector: f.input.selector, worktree: f.envelope.worktree_path,
    contract: f.envelope.plan.contract_path, worker_command: 'true', verifier_command: 'true', env: f.env });
  controller.beforeChild('worker', 'true');
  retireCampaignDispatch(f.input);
  const now = () => new Date(Date.now() + 60_000);
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).evidence.runtime_effect_inactive).toBeNull();
  expect(() => recoverCampaignDispatch({ ...f.input, now })).toThrow('not reclaimable');
  expect(readLease(f.root, f.envelope.task_id).record!.generation).toBe(f.envelope.generation);
}, 60_000);

function installProviderFixture(f: Awaited<ReturnType<typeof acquired>>, finalVerdict: 'pass' | 'fail' = 'pass', detachedCommand = false) {
  const profiles = join(f.root, '.codex/agents'); mkdirSync(profiles, { recursive: true });
  for (const [name, sandbox] of [['fast-worker', 'workspace-write'], ['gatekeeper', 'read-only']]) {
    writeFileSync(join(profiles, `${name}.toml`), `model = "fixture-model"\nsandbox_mode = "${sandbox}"\nmodel_reasoning_effort = "high"\ndeveloper_instructions = "Fixture role"\n`);
  }
  execFileSync('git', ['add', '--', '.codex/agents/fast-worker.toml', '.codex/agents/gatekeeper.toml'], { cwd: f.root });
  const bin = join(f.home, 'fixture-bin'); mkdirSync(bin);
  const executable = join(bin, 'codex');
  writeFileSync(executable, `#!${process.execPath}
import { writeFileSync } from 'fs';
import { spawn } from 'child_process';
if (process.argv.includes('--version')) { console.log('codex-cli 1.0.0'); process.exit(0); }
const role = process.env.CONTRACT_RUN_ROLE;
if (${detachedCommand} && role === 'worker') {
  const child = spawn(process.execPath, ['-e', "const fs = require('fs'); const timer = setInterval(() => fs.appendFileSync('detached-writes.txt', 'x'), 20); setTimeout(() => { clearInterval(timer); }, 30000);"], { detached: true, stdio: 'ignore' });
  writeFileSync('detached.pid', String(child.pid)); child.unref();
}
if (role === 'worker') writeFileSync(process.env.CONTRACT_RUN_ATTEMPT_RESULT, JSON.stringify({ outcome:'completed', evidence_paths:['src/index.ts'] }));
const text = role === 'verifier' ? JSON.stringify({ verdict:${JSON.stringify(finalVerdict)}, review:'Fixture review' }) : 'Worker finished';
console.error('fixture diagnostic');
for (const event of [{type:'thread.started',thread_id:'fixture-'+role}, ...(${detachedCommand} && role === 'worker' ? [{type:'item.completed',item:{id:'command',type:'command_execution',status:'completed',exit_code:0}}] : []), {type:'item.completed',item:{id:'message',type:'agent_message',text}}, {type:'turn.completed',usage:{input_tokens:10,cached_input_tokens:0,output_tokens:2}}]) console.log(JSON.stringify(event));
`);
  chmodSync(executable, 0o700);
  return { ...f.env, PATH: `${bin}:${process.env.PATH}` };
}

test('detached command effects remain ineligible for reclaim after provider completion', async () => {
  const f = await acquired();
  const env = installProviderFixture(f, 'pass', true);
  writeFileSync(join(f.envelope.worktree_path, 'selector.json'), JSON.stringify(f.input.selector));
  try {
    const run = spawnSync(process.execPath, [join(import.meta.dir, '../../scripts/contract-run.ts'), 'run', '--repo', f.envelope.worktree_path,
      '--contract', f.envelope.plan.contract_path, '--campaign-handoff', 'selector.json', '--campaign-provider', 'codex-exec',
      '--out', '.ai/harness/detached-provider-test', '--json'], { cwd: f.envelope.worktree_path, env, encoding: 'utf8' });
    expect(run.status, run.stdout + run.stderr).toBe(0);
    const terminal = readPlanningRecord<any>(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, 'worker', 'terminal'));
    expect(terminal.state).toBe('terminal');
    expect(terminal.process_group_quiescence.state).toBe('quiescent');
    const path = join(f.envelope.worktree_path, 'detached-writes.txt');
    const before = readFileSync(path, 'utf8').length;
    await Bun.sleep(100);
    expect(readFileSync(path, 'utf8').length).toBeGreaterThan(before);
    retireCampaignDispatch({ ...f.input, env });
    const now = () => new Date(Date.now() + 60_000);
    expect(observeCampaignReclaimEligibility({ ...f.input, env, now }).evidence.runtime_effect_inactive).toBeNull();
    expect(() => recoverCampaignDispatch({ ...f.input, env, now })).toThrow('not reclaimable');
    expect(readLease(f.root, f.envelope.task_id).record!.generation).toBe(f.envelope.generation);
  } finally {
    try { process.kill(Number(readFileSync(join(f.envelope.worktree_path, 'detached.pid'), 'utf8')), 'SIGKILL'); } catch { /* Fixture descendant may already have exited. */ }
  }
}, 60_000);

for (const verdict of ['pass', 'fail'] as const) test(`typed Codex process binds invocation evidence and consumes the explicit ${verdict} verdict`, async () => {
  const f = await acquired();
  const env = installProviderFixture(f, verdict);
  writeFileSync(join(f.envelope.worktree_path, 'selector.json'), JSON.stringify(f.input.selector));
  const run = spawnSync(process.execPath, [join(import.meta.dir, '../../scripts/contract-run.ts'), 'run', '--repo', f.envelope.worktree_path,
    '--contract', f.envelope.plan.contract_path, '--campaign-handoff', 'selector.json', '--campaign-provider', 'codex-exec',
    '--out', '.ai/harness/typed-provider-test', '--json'], { cwd: f.envelope.worktree_path, env, encoding: 'utf8' });
  expect(run.status, run.stdout + run.stderr).toBe(verdict === 'pass' ? 0 : 1);
  const manifest = JSON.parse(run.stdout);
  expect(manifest.status).toBe(verdict);
  for (const role of ['worker', 'verifier'] as const) {
    const intent = readPlanningRecord<any>(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, role, 'intent'));
    const started = readPlanningRecord<any>(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, role, 'started'));
    const terminal = readPlanningRecord<any>(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, role, 'terminal'));
    expect(started.invocation_sha256).toBe(intent.invocation_sha256);
    expect(terminal.invocation_sha256).toBe(intent.invocation_sha256);
    expect(terminal.provider_thread_id).toBe(`fixture-${role}`);
    expect(terminal.state).toBe('terminal');
    expect(intent.sandbox).toBe(role === 'worker' ? 'workspace-write' : 'read-only');
  }
  retireCampaignDispatch(f.input);
  const now = () => new Date(Date.now() + 60_000);
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).classification).toBe('reclaimable');
  const output = join(f.envelope.worktree_path, '.ai/harness/typed-provider-test/worker.stdout.log');
  const originalBytes = readFileSync(output);
  writeFileSync(output, Buffer.concat([originalBytes, Buffer.from('\n')]));
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).evidence.runtime_effect_inactive).toBeNull();
  writeFileSync(output, originalBytes);
  const recovered = recoverCampaignDispatch({ ...f.input, now });
  expect(recovered.disposition).toBe('settled_final');
  expect(recovered.final!.contract_run.status).toBe(verdict);
  expect(recoverCampaignDispatch({ ...f.input, now }).envelope.claim_id).toBe(recovered.envelope.claim_id);
}, 60_000);

test('a started typed invocation without its terminal refuses reclaim and keeps its generation', async () => {
  const f = await acquired(); const env = installProviderFixture(f);
  const controller = bindCampaignWorker({ selector: f.input.selector, worktree: f.envelope.worktree_path,
    contract: f.envelope.plan.contract_path, worker_command: 'codex-exec:worker', verifier_command: 'codex-exec:verifier', provider: 'codex-exec', env });
  writeFileSync(join(f.envelope.worktree_path, 'prompt.md'), 'Fixture prompt');
  controller.prepareChild('worker', 'prompt.md'); controller.beforeChild('worker', 'codex-exec:worker');
  retireCampaignDispatch(f.input);
  const now = () => new Date(Date.now() + 60_000);
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).evidence.runtime_effect_inactive).toBeNull();
  expect(() => recoverCampaignDispatch({ ...f.input, now })).toThrow('not reclaimable');
  expect(readLease(f.root, f.envelope.task_id).record!.generation).toBe(f.envelope.generation);
}, 60_000);

test('two OS recovery callers mint only one next generation and CLI reports unfinished reconciliation', async () => {
  const f = await acquired();
  writeFileSync(join(f.envelope.worktree_path, 'selector.json'), JSON.stringify(f.input.selector));
  const expires = Date.parse(readLeaseLiveness(f.root, f.envelope.task_id).current.expires_at);
  await Bun.sleep(Math.max(0, expires - Date.now() + 50));
  const args = [process.execPath, join(import.meta.dir, '../../scripts/contract-run.ts'), 'recover', '--repo', f.envelope.worktree_path,
    '--campaign-handoff', 'selector.json', '--campaign-parent-host', f.input.host, '--campaign-parent-session', f.input.session_id, '--json'];
  const invoke = async () => {
    const child = Bun.spawn(args, { cwd: f.envelope.worktree_path, env: f.env, stdout: 'pipe', stderr: 'pipe' });
    const stdout = new Response(child.stdout).text(); const stderr = new Response(child.stderr).text();
    return { exit: await child.exited, stdout: await stdout, stderr: await stderr };
  };
  const results = await Promise.all([invoke(), invoke()]);
  const successfulRecoveries = results.filter(result => result.stdout.trim().startsWith('{')).map(result => JSON.parse(result.stdout));
  expect(successfulRecoveries.length, JSON.stringify(results)).toBeGreaterThan(0);
  const owner = readLease(f.root, f.envelope.task_id).record!;
  expect(owner.generation).toBe(f.envelope.generation + 1);
  expect(new Set(successfulRecoveries.map(result => result.envelope.claim_id))).toEqual(new Set([owner.claim_id]));
  for (const result of results) expect(result.exit).toBe(1);
  const replay = await invoke();
  expect(JSON.parse(replay.stdout).envelope.claim_id).toBe(owner.claim_id);
  expect(JSON.parse(replay.stdout).disposition).toBe('reconciliation_required');
}, 60_000);

test('a durable final interrupted before settlement is charged once after exact rebind', async () => {
  const f = await acquired(); const env = installProviderFixture(f);
  const worktree = f.envelope.worktree_path;
  const controller = bindCampaignWorker({ selector: f.input.selector, worktree, contract: f.envelope.plan.contract_path,
    worker_command: 'codex-exec:worker', verifier_command: 'codex-exec:verifier', provider: 'codex-exec', env,
    crash_hook: () => { throw new Error('interrupted-after-final'); } });
  for (const role of ['worker', 'verifier'] as const) {
    writeFileSync(join(worktree, `${role}.prompt.md`), 'Fixture prompt');
    const invocation = controller.prepareChild(role, `${role}.prompt.md`);
    controller.beforeChild(role, `codex-exec:${role}`);
    const child = spawnSync(process.execPath, [join(import.meta.dir, '../../scripts/run-bounded-verifier-command.ts'), '--deadline-ms', String(Date.now() + 10_000),
      '--log', join(worktree, `${role}.stdout`), '--stderr-log', join(worktree, `${role}.stderr`), '--result', join(worktree, `${role}.result`),
      '--', invocation.executable, ...invocation.argv], { cwd: worktree, env: { ...env, CONTRACT_RUN_ROLE: role, CONTRACT_RUN_ATTEMPT_RESULT: 'final.json' }, encoding: 'utf8' });
    expect(child.status, child.stderr).toBe(0);
    controller.afterChild({ ...JSON.parse(readFileSync(join(worktree, `${role}.result`), 'utf8')), role, command: `codex-exec:${role}`, stdout_path: `${role}.stdout`, stderr_path: `${role}.stderr` });
  }
  expect(() => controller.finish('final.json', { status: 'pass', failure_class: null })).toThrow('interrupted-after-final');
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current.open_reservation_sha256s).toHaveLength(1);
  const now = () => new Date(Date.now() + 60_000);
  expect(recoverCampaignDispatch({ ...f.input, now }).disposition).toBe('settled_final');
  const settled = readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current;
  expect(settled.open_reservation_sha256s).toHaveLength(0);
  recoverCampaignDispatch({ ...f.input, now });
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current).toEqual(settled);
}, 60_000);
