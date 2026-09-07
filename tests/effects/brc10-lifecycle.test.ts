import { afterEach, expect, test } from 'bun:test';
import { rmSync, writeFileSync, readFileSync, mkdirSync, chmodSync } from 'fs';
import { join } from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { readPlanningRecord } from '../../src/effects/automation/campaign-planning-store';
import { campaignRuntimeRecordKey } from '../../src/core/automation/campaign-runtime';
import { historicalPlanningFixture, installHistoricalBoundDispatch, installHistoricalAttempt, installHistoricalChild, installHistoricalFinal } from '../helpers/historical-campaign-lifecycle';
import { prepareCampaignCodexInvocation } from '../../src/effects/automation/campaign-runtime';
import { persistPlanningRecord } from '../../src/effects/automation/campaign-planning-store';
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
  const f = await historicalPlanningFixture(); roots.push(f.root, f.home);
  const result = installHistoricalBoundDispatch(f);
  if (!('worker_handoff' in result) || !result.worker_handoff || !result.envelope) throw new Error(JSON.stringify(result));
  roots.push(result.envelope.worktree_path);
  const input = { selector: result.worker_handoff, host: f.executeInput.host, session_id: f.executeInput.session_id, env: f.env };
  return { ...f, historical: result, envelope: result.envelope, input };
}

test('historical liveness remains observable but a no-final recovery cannot mint a generation', async () => {
  const f = await acquired();
  const before = readLease(f.root, f.envelope.task_id);
  expect(readLeaseLiveness(f.root, f.envelope.task_id).current.lease_generation).toBe(f.envelope.generation);
  expect(() => bindCampaignWorker({ selector: f.input.selector, worktree: f.envelope.worktree_path,
    contract: f.envelope.plan.contract_path, worker_command: 'true', verifier_command: 'true', env: f.env })).toThrow('trusted exact revision readback');
  expect(() => recoverCampaignDispatch(f.input)).toThrow('without a persisted final');
  expect(readLease(f.root, f.envelope.task_id)).toEqual(before);
  retireCampaignDispatch(f.input);
  const receipt = observeCampaignReclaimEligibility({ ...f.input, now: () => new Date(Date.now() + 60_000) });
  expect(receipt.classification).toBe('reclaimable');
  expect(receipt.evidence.controller_terminal).toBe(true);
  expect(receipt.evidence.runtime_effect_inactive).toBe(true);
  expect(() => recoverCampaignDispatch(f.input)).toThrow('without a persisted final');
  expect(readLease(f.root, f.envelope.task_id)).toEqual(before);
}, 60_000);

test('recovery resumes every persisted boundary without a new worktree or second generation', async () => {
  const f = await acquired();
  const env = installProviderFixture(f);
  runHistoricalProvider(f, env, 'pass', false);
  const instant = new Date(Date.now() + 60_000); const now = () => instant;
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
  installHistoricalAttempt(f, f.historical, null);
  retireCampaignDispatch(f.input);
  const instant = new Date(Date.now() + 60_000); const now = () => instant;
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).evidence.runtime_effect_inactive).toBeNull();
  expect(() => recoverCampaignDispatch({ ...f.input, now })).toThrow('without a persisted final');
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
    runHistoricalProvider(f, env, 'pass', false);
    const terminal = readPlanningRecord<any>(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, 'worker', 'terminal'));
    expect(terminal.state).toBe('terminal');
    expect(terminal.process_group_quiescence.state).toBe('quiescent');
    const path = join(f.envelope.worktree_path, 'detached-writes.txt');
    const before = readFileSync(path, 'utf8').length;
    await Bun.sleep(100);
    expect(readFileSync(path, 'utf8').length).toBeGreaterThan(before);
    retireCampaignDispatch({ ...f.input, env });
    const instant = new Date(Date.now() + 60_000); const now = () => instant;
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
  runHistoricalProvider(f, env, verdict, true);
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
  const instant = new Date(Date.now() + 60_000); const now = () => instant;
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).classification).toBe('reclaimable');
  const output = join(f.envelope.worktree_path, 'worker.stdout');
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
  installHistoricalAttempt(f, f.historical);
  writeFileSync(join(f.envelope.worktree_path, 'prompt.md'), 'Fixture prompt');
  const invocation = prepareCampaignCodexInvocation({ repo_root: f.root, worktree: f.envelope.worktree_path, prompt_path: 'prompt.md', env,
    identity: { dispatch_id: f.input.selector.dispatch_id, claim_id: f.envelope.claim_id, lease_generation: f.envelope.generation,
      task_id: f.envelope.task_id, task_revision: f.envelope.task_revision, binding_generation: f.historical.acquired.offer.binding_generation, role: 'worker' } });
  persistPlanningRecord(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, 'worker', 'intent'), invocation);
  persistPlanningRecord(f.root, f.intent, campaignRuntimeRecordKey(f.input.selector.dispatch_id, 'worker', 'started'), { invocation_sha256: invocation.invocation_sha256, identity: invocation.identity });
  retireCampaignDispatch(f.input);
  const instant = new Date(Date.now() + 60_000); const now = () => instant;
  expect(observeCampaignReclaimEligibility({ ...f.input, now }).evidence.runtime_effect_inactive).toBeNull();
  expect(() => recoverCampaignDispatch({ ...f.input, now })).toThrow('without a persisted final');
  expect(readLease(f.root, f.envelope.task_id).record!.generation).toBe(f.envelope.generation);
}, 60_000);

test('two OS recovery callers without a final cannot mint any next generation', async () => {
  const f = await acquired();
  writeFileSync(join(f.envelope.worktree_path, 'selector.json'), JSON.stringify(f.input.selector));
  const args = [process.execPath, join(import.meta.dir, '../../scripts/contract-run.ts'), 'recover', '--repo', f.envelope.worktree_path,
    '--campaign-handoff', 'selector.json', '--campaign-parent-host', f.input.host, '--campaign-parent-session', f.input.session_id, '--json'];
  const invoke = async () => {
    const child = Bun.spawn(args, { cwd: f.envelope.worktree_path, env: f.env, stdout: 'pipe', stderr: 'pipe' });
    const output = Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);
    return { exit: await child.exited, output: (await output).join('\n') };
  };
  for (const result of await Promise.all([invoke(), invoke()])) {
    expect(result.exit).not.toBe(0); expect(result.output).toContain('without a persisted final');
  }
  expect(readLease(f.root, f.envelope.task_id).record!.generation).toBe(f.envelope.generation);
}, 60_000);

test('a durable final interrupted before settlement is charged once after exact rebind', async () => {
  const f = await acquired(); const env = installProviderFixture(f);
  const worktree = f.envelope.worktree_path;
  runHistoricalProvider(f, env, 'pass', false);
  const budget = ensureCampaignAuthoringBudget({ repo_root: f.root, authorization: f.authorization, env: f.env }).budget;
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current.open_reservation_sha256s).toHaveLength(1);
  const instant = new Date(Date.now() + 60_000); const now = () => instant;
  expect(recoverCampaignDispatch({ ...f.input, now }).disposition).toBe('settled_final');
  const settled = readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current;
  expect(settled.open_reservation_sha256s).toHaveLength(0);
  recoverCampaignDispatch({ ...f.input, now });
  expect(readAutomationBudgetStatus(f.root, budget.automation_run_id, f.env).current).toEqual(settled);
}, 60_000);

/** Run model-free provider processes, then install their observed historical journal facts. */
function runHistoricalProvider(f: Awaited<ReturnType<typeof acquired>>, env: NodeJS.ProcessEnv, verdict: 'pass' | 'fail', settle: boolean) {
  const attempt = installHistoricalAttempt(f, f.historical);
  const worktree = f.envelope.worktree_path;
  for (const role of ['worker', 'verifier'] as const) {
    writeFileSync(join(worktree, `${role}.prompt.md`), 'Fixture prompt');
    const invocation = prepareCampaignCodexInvocation({ repo_root: f.root, worktree, prompt_path: `${role}.prompt.md`, env,
      identity: { dispatch_id: f.input.selector.dispatch_id, claim_id: f.envelope.claim_id, lease_generation: f.envelope.generation,
        task_id: f.envelope.task_id, task_revision: f.envelope.task_revision, binding_generation: f.historical.acquired.offer.binding_generation, role } });
    const child = spawnSync(process.execPath, [join(import.meta.dir, '../../scripts/run-bounded-verifier-command.ts'), '--deadline-ms', String(Date.now() + 10_000),
      '--log', join(worktree, `${role}.stdout`), '--stderr-log', join(worktree, `${role}.stderr`), '--result', join(worktree, `${role}.result`),
      '--', invocation.executable, ...invocation.argv], { cwd: worktree, env: { ...env, CONTRACT_RUN_ROLE: role, CONTRACT_RUN_ATTEMPT_RESULT: 'final.json' }, encoding: 'utf8' });
    expect(child.status, child.stderr).toBe(0);
    installHistoricalChild(f, f.historical, invocation, { ...JSON.parse(readFileSync(join(worktree, `${role}.result`), 'utf8')), role,
      command: `codex-exec:${role}`, stdout_path: `${role}.stdout`, stderr_path: `${role}.stderr` });
  }
  return installHistoricalFinal(f, f.historical, attempt, 'final.json', settle, { status: verdict, failure_class: verdict === 'pass' ? null : 'contract_failed' });
}

test('two OS callers settle the historical final under one recovered generation', async () => {
  const f = await acquired(); const env = installProviderFixture(f);
  runHistoricalProvider(f, env, 'pass', false);
  const instant = new Date(Date.now() + 60_000).toISOString();
  const entry = join(import.meta.dir, '../../src/effects/automation/campaign-recovery.ts');
  const invoke = async () => {
    const child = Bun.spawn([process.execPath, '-e', `
      import { recoverCampaignDispatch } from ${JSON.stringify(entry)};
      console.log(JSON.stringify(recoverCampaignDispatch({ ...${JSON.stringify(f.input)}, now: () => new Date(${JSON.stringify(instant)}) })));
    `], { cwd: f.root, env: f.env, stdout: 'pipe', stderr: 'pipe' });
    const output = Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);
    return { exit: await child.exited, output: await output };
  };
  const results = await Promise.all([invoke(), invoke()]);
  for (const result of results) expect(result.exit, result.output.join('\n')).toBe(0);
  const recovered = results.map(result => JSON.parse(result.output[0]!));
  const owner = readLease(f.root, f.envelope.task_id).record!;
  expect(owner.generation).toBe(f.envelope.generation + 1);
  expect(new Set(recovered.map(result => result.envelope.claim_id))).toEqual(new Set([owner.claim_id]));
  for (const result of recovered) expect(result.disposition).toBe('settled_final');
}, 60_000);
