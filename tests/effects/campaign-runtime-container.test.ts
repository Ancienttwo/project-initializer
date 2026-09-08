import { afterAll, afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, realpathSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { createHash, randomUUID } from 'crypto';
import { execFileSync } from 'child_process';
import { prepareCampaignCodexInvocation, executeCampaignCodexInvocation, observeCampaignCodexTerminal } from '../../src/effects/automation/campaign-runtime';
import { runChild } from '../../scripts/contract-run';
import { validateCampaignCodexInvocation } from '../../src/core/automation/campaign-runtime';

const baseImage = process.env.BRC_TEST_CONTAINER_IMAGE;
const roots: string[] = [];
let modelFreeImage: string;
let buildRoot: string;
let baseTag: string;
const sha = (bytes: string) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const git = (root: string, ...args: string[]) => execFileSync('git', args, { cwd: root, timeout: 5000, stdio: 'pipe' });
afterEach(() => {
  for (const root of roots.splice(0)) {
    const journals = join(root, '.git/repo-harness/campaign-containers');
    try { for (const entry of readdirSync(journals)) {
      const request = JSON.parse(readFileSync(join(journals, entry, 'request.json'), 'utf8'));
      const result = Bun.spawnSync(['docker', '--host', request.endpoint, 'rm', '-f', request.name], { timeout: 5000 });
      if (result.exitCode !== 0) throw new Error('runtime fixture container cleanup failed');
    } } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    rmSync(root, { recursive: true, force: true });
  }
});
afterAll(() => { if (baseTag) execFileSync('docker', ['image', 'rm', baseTag], { timeout: 5000, stdio: 'ignore' }); if (buildRoot) rmSync(buildRoot, { recursive: true, force: true }); });
describe.skipIf(!baseImage)('campaign runtime with real Docker and no provider calls', () => {
  beforeAll(() => {
    buildRoot = mkdtempSync(join(tmpdir(), 'brc-runtime-image-'));
    // The model-free executable performs real Git and filesystem operations, then emits JSONL.
    // It replaces only Codex in the pinned watchdog image; it is never production acceptance.
    writeFileSync(join(buildRoot, 'codex'), `#!/usr/local/bin/node
const fs=require('fs'), cp=require('child_process');
if(process.argv.includes('--version')){console.log('codex-cli 0.153.4');process.exit(0)}
cp.execFileSync('/usr/bin/git',['-c','safe.directory='+process.cwd(),'status','--porcelain'],{stdio:'pipe'});
let writable=true;try{fs.writeFileSync('runtime-marker','x')}catch(e){if(e.code!=='EROFS')throw e;writable=false}
if(process.argv.at(-1)==='attack-symlink'){fs.renameSync('logs','old-logs');fs.symlinkSync(process.cwd()+'/.git/host-only','logs')}
if(process.argv.at(-1)==='attack-fifo'){fs.unlinkSync('logs/worker.stdout.log');cp.execFileSync('/usr/bin/mkfifo',['logs/worker.stdout.log'])}
const text=JSON.stringify({writable});
for(const event of [{type:'thread.started',thread_id:'model-free'}, {type:'item.completed',item:{id:'git',type:'command_execution',status:'completed',exit_code:0}}, {type:'item.completed',item:{id:'message',type:'agent_message',text}}, {type:'turn.completed',usage:{input_tokens:0,cached_input_tokens:0,output_tokens:0}}])console.log(JSON.stringify(event));
`);
    baseTag = `repo-harness-test-base:${randomUUID()}`;
    execFileSync('docker', ['tag', baseImage!, baseTag], { timeout: 5000 });
    writeFileSync(join(buildRoot, 'Dockerfile'), `FROM ${baseTag}\nRUN rm /usr/local/bin/codex\nCOPY --chmod=755 codex /usr/local/bin/codex\n`);
    modelFreeImage = execFileSync('docker', ['build', '-q', buildRoot], { encoding: 'utf8', timeout: 60000, maxBuffer: 1024 * 1024 }).trim();
  }, 65000);
  function fixture(role: 'worker' | 'verifier', image = modelFreeImage) {
    const root = realpathSync(mkdtempSync(join(tmpdir(), 'brc-runtime-'))); roots.push(root);
    git(root, 'init', '-q'); mkdirSync(join(root, '.codex/agents'), { recursive: true });
    const profile = `.codex/agents/${role === 'worker' ? 'fast-worker' : 'gatekeeper'}.toml`;
    writeFileSync(join(root, profile), `model="fixture"\nsandbox_mode="${role === 'worker' ? 'workspace-write' : 'read-only'}"\nmodel_reasoning_effort="high"\ndeveloper_instructions="Fixture role"\n`);
    git(root, 'add', profile); writeFileSync(join(root, 'prompt'), 'No model fixture');
    return { root, input: { repo_root: root, worktree: root, prompt_path: 'prompt', deadline_ms: Date.now() + 20000,
      env: { BRC_CAMPAIGN_IMAGE: image }, identity: { dispatch_id: 'sha256:' + 'a'.repeat(64), role, task_id: 'task', task_revision: 'revision', claim_id: 'claim', lease_generation: 1, binding_generation: 1 } } };
  }
  test('real pinned Codex version probe shares the deadline; cancelled task makes no model call', async () => {
    const f = fixture('worker', baseImage!);
    const invocation = await prepareCampaignCodexInvocation(f.input);
    expect(invocation.executable_version).toBe('codex-cli 0.153.4');
    for (const handle of [invocation.container, invocation.probe.container]) {
      expect(JSON.parse(readFileSync(join(handle.directory, 'request.json'), 'utf8')).deadline_ms).toBe(f.input.deadline_ms);
    }
    const result = await executeCampaignCodexInvocation(invocation, f.root, AbortSignal.abort());
    expect(result.started).toBe(false); expect(result.exit_code).toBe(143); expect(result.inactive).toBe(true);
    expect(() => validateCampaignCodexInvocation({ ...invocation, protocol: 1 })).toThrow();
  }, 30000);
  for (const role of ['worker', 'verifier'] as const) test(`${role} Git command completes with exact mount permissions and inactive receipt`, async () => {
    const f = fixture(role); const invocation = await prepareCampaignCodexInvocation(f.input);
    const child = await runChild(role, 'codex-exec:' + role, f.root, f.root, { REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../..') }, f.input.deadline_ms, undefined, invocation);
    expect(child.exit_code).toBe(0);
    const result = { ...child, stdout: readFileSync(join(f.root, child.stdout_path), 'utf8'), stderr: readFileSync(join(f.root, child.stderr_path), 'utf8'), receipt_sha256: child.container_receipt_sha256! };
    writeFileSync(join(f.root, 'stdout'), result.stdout); writeFileSync(join(f.root, 'stderr'), result.stderr);
    const input = { invocation, worktree: f.root, stdout_path: 'stdout', stderr_path: 'stderr', exit_code: result.exit_code,
      timed_out: result.timed_out, termination_cause: result.termination_cause, output_complete: result.output_complete,
      output_sha256: { stdout: sha(result.stdout), stderr: sha(result.stderr) }, container_receipt_sha256: result.receipt_sha256 };
    const observed = observeCampaignCodexTerminal(input);
    expect(observed.state).toBe('terminal'); expect(observed.runtime_effect_inactive).toBe(true);
    expect(JSON.parse(observed.final_response!).writable).toBe(role === 'worker');
    expect(observeCampaignCodexTerminal({ ...input, container_receipt_sha256: sha('forged') }).runtime_effect_inactive).toBeNull();
    expect(observeCampaignCodexTerminal({ ...input, termination_cause: 'cancelled' }).runtime_effect_inactive).toBeNull();
    await expect(executeCampaignCodexInvocation(invocation, f.root)).rejects.toThrow('already been admitted');
  }, 30000);
  test('worker cannot redirect post-run host output through a changed parent directory', async () => {
    const f = fixture('worker');
    mkdirSync(join(f.root, 'logs')); mkdirSync(join(f.root, '.git/host-only'));
    writeFileSync(join(f.root, 'prompt'), 'attack-symlink');
    const invocation = await prepareCampaignCodexInvocation(f.input);
    await runChild('worker', 'codex-exec:worker', f.root, join(f.root, 'logs'), { REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../..') }, f.input.deadline_ms, undefined, invocation);
    expect(existsSync(join(f.root, '.git/host-only/worker.stdout.log'))).toBe(false);
    expect(existsSync(join(f.root, '.git/host-only/worker.stderr.log'))).toBe(false);
  }, 30000);

  test('worker FIFO replacement cannot block the controller after its deadline', async () => {
    const f = fixture('worker'); mkdirSync(join(f.root, 'logs')); writeFileSync(join(f.root, 'prompt'), 'attack-fifo');
    const invocation = await prepareCampaignCodexInvocation(f.input);
    const code = `import {runChild} from ${JSON.stringify(join(import.meta.dir, '../../scripts/contract-run.ts'))};
      const result=await runChild('worker','codex-exec:worker',${JSON.stringify(f.root)},${JSON.stringify(join(f.root, 'logs'))},
        {REPO_HARNESS_PACKAGE_ROOT:${JSON.stringify(join(import.meta.dir, '../..'))}},${f.input.deadline_ms},undefined,${JSON.stringify(invocation)});
      console.log(JSON.stringify(result));`;
    const child = Bun.spawn([process.execPath, '-e', code], { stdout: 'pipe', stderr: 'pipe' });
    const timer = setTimeout(() => child.kill('SIGKILL'), 20000);
    try {
      const streams = Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);
      const exit = await child.exited; const [stdout, stderr] = await streams;
      expect(exit, stderr).toBe(0); expect(JSON.parse(stdout).exit_code).toBe(0);
    } finally { clearTimeout(timer); child.kill('SIGKILL'); await child.exited; }
  }, 40000);

});
