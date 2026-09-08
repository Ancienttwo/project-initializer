import { canonicalMessageDigest } from '../../src/core/messages/mechanics';
import { campaignContainerDirectory, campaignContainerJournalRoot, cleanupCampaignContainer, reconcileCampaignContainer } from '../../src/effects/automation/campaign-container';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, realpathSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { createHash, randomUUID } from 'crypto';
import { execFileSync } from 'child_process';
import { prepareCampaignCodexInvocation, executeCampaignCodexInvocation, observeCampaignCodexTerminal, parseCampaignVerifierResponse } from '../../src/effects/automation/campaign-runtime';
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
    const journals = campaignContainerJournalRoot();
    try { for (const entry of readdirSync(journals)) {
      const request = JSON.parse(readFileSync(join(journals, entry, 'request.json'), 'utf8'));
      if (request.expected.fields['Config.WorkingDir'] !== root) continue;
      const present = Bun.spawnSync(['docker', '--host', request.endpoint, 'container', 'ls', '--all', '--filter', `name=^/${request.name}$`, '--format', '{{.ID}}'], { timeout: 5000 });
      if (present.exitCode !== 0) throw new Error('runtime fixture container inventory failed');
      if (new TextDecoder().decode(present.stdout).trim()) {
        const result = Bun.spawnSync(['docker', '--host', request.endpoint, 'rm', '-f', request.name], { timeout: 5000 });
        if (result.exitCode !== 0) throw new Error('runtime fixture container cleanup failed');
      }
      rmSync(join(journals, entry), { recursive: true, force: true });
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
if(process.argv.includes('--version')){
  const setting=JSON.parse(fs.readFileSync('probe-fixture.json','utf8'));
  if(setting.mode==='missing')process.exit(0);
  if(setting.mode==='invalid'){console.log('not-a-version');process.exit(0)}
  if(setting.mode==='flood'){setInterval(()=>process.stdout.write('x'.repeat(65536)),1)}
  else if(setting.mode==='hang'||setting.mode==='cancel'){setInterval(()=>{},1000)}
  else if(setting.mode==='descendant'){
    process.on('SIGTERM',()=>{});
    const child=cp.spawn(process.execPath,['-e',"process.on('SIGTERM',()=>{});setInterval(()=>{},1000)"],{detached:true,stdio:'ignore'});child.unref();
    console.log('descendant-started');setInterval(()=>{},1000);
  }else{console.log('codex-cli 0.153.4');process.exit(0)}
  return;
}
const git=args=>cp.execFileSync('/usr/bin/git',['-c','safe.directory='+process.cwd(),...args],{encoding:'utf8'});
git(['status','--short','--branch','-uall']);const head=git(['rev-parse','HEAD']).trim();
const role=JSON.parse(fs.readFileSync('probe-fixture.json','utf8')).role;
if(role==='worker'){
  cp.execFileSync(process.execPath,['--test','command-fixture.test.cjs'],{stdio:'pipe'});
  fs.writeFileSync('prepared.json',JSON.stringify({head,passed:true}));
}else{require('node:assert/strict').deepEqual(JSON.parse(fs.readFileSync('prepared.json','utf8')),{head,passed:true})}
let writable=true;try{fs.writeFileSync('runtime-marker','x')}catch(e){if(e.code!=='EROFS')throw e;writable=false}
if(process.argv.at(-1)==='attack-symlink'){fs.renameSync('logs','old-logs');fs.symlinkSync(process.cwd()+'/.git/host-only','logs')}
if(process.argv.at(-1)==='attack-fifo'){fs.unlinkSync('logs/worker.stdout.log');cp.execFileSync('/usr/bin/mkfifo',['logs/worker.stdout.log'])}
const facts=JSON.stringify({writable,head,controlVisible:fs.existsSync(${JSON.stringify(campaignContainerJournalRoot())})});
const text=role==='verifier'?JSON.stringify({verdict:'pass',review:facts}):facts;
const operation=process.argv.at(-1)==='unknown-operation'?'unmanaged_fixture_operation':'command_execution';
for(const event of [{type:'thread.started',thread_id:'model-free'}, {type:'item.completed',item:{id:'git',type:operation,status:'completed',exit_code:0}}, {type:'item.completed',item:{id:'message',type:'agent_message',text}}, {type:'turn.completed',usage:{input_tokens:0,cached_input_tokens:0,output_tokens:0}}])console.log(JSON.stringify(event));
`);
    baseTag = `repo-harness-test-base:${randomUUID()}`;
    execFileSync('docker', ['tag', baseImage!, baseTag], { timeout: 5000 });
    writeFileSync(join(buildRoot, 'Dockerfile'), `FROM ${baseTag}\nRUN rm /usr/local/bin/codex\nCOPY --chmod=755 codex /usr/local/bin/codex\n`);
    modelFreeImage = execFileSync('docker', ['build', '-q', buildRoot], { encoding: 'utf8', timeout: 60000, maxBuffer: 1024 * 1024 }).trim();
  }, 65000);
  function fixture(role: 'worker' | 'verifier', image = modelFreeImage) {
    const root = realpathSync(mkdtempSync(join(process.platform === 'linux' ? '/var/tmp' : tmpdir(), 'brc-runtime-'))); roots.push(root);
    git(root, 'init', '-q'); mkdirSync(join(root, '.codex/agents'), { recursive: true });
    for (const name of ['fast-worker', 'gatekeeper']) {
      const path = `.codex/agents/${name}.toml`;
      writeFileSync(join(root, path), readFileSync(join(import.meta.dir, '../..', path)));
    }
    writeFileSync(join(root, 'command-fixture.test.cjs'), "require('node:test')('arithmetic',()=>require('node:assert/strict').equal(2+2,4));");
    writeFileSync(join(root, 'probe-fixture.json'), JSON.stringify({ mode: 'normal', role }));
    git(root, 'add', '.codex/agents', 'command-fixture.test.cjs');
    git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'tracked actual role profile');
    if (role === 'verifier') writeFileSync(join(root, 'prepared.json'), JSON.stringify({ head: git(root, 'rev-parse', 'HEAD').toString().trim(), passed: true }));
    writeFileSync(join(root, 'prompt'), 'No model fixture');
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
    const profileBytes = readFileSync(join(f.root, invocation.profile_ref), 'utf8');
    const profile = Bun.TOML.parse(profileBytes) as Record<string, string>;
    expect(invocation.profile_sha256).toBe(sha(profileBytes));
    expect(invocation.model).toBe(profile.model);
    expect(invocation.argv).toContain(`model_reasoning_effort=${JSON.stringify(profile.model_reasoning_effort)}`);
    expect(JSON.parse(invocation.argv.find(arg => arg.startsWith('developer_instructions='))!.slice('developer_instructions='.length)))
      .toStartWith(String(profile.developer_instructions));
    const child = await runChild(role, 'codex-exec:' + role, f.root, f.root, { REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../..') }, f.input.deadline_ms, undefined, invocation);
    expect(child.exit_code).toBe(0);
    const result = { ...child, stdout: readFileSync(join(f.root, child.stdout_path), 'utf8'), stderr: readFileSync(join(f.root, child.stderr_path), 'utf8'), receipt_sha256: child.container_receipt_sha256! };
    writeFileSync(join(f.root, 'stdout'), result.stdout); writeFileSync(join(f.root, 'stderr'), result.stderr);
    const input = { invocation, worktree: f.root, stdout_path: 'stdout', stderr_path: 'stderr', exit_code: result.exit_code,
      timed_out: result.timed_out, termination_cause: result.termination_cause, output_complete: result.output_complete,
      output_sha256: { stdout: sha(result.stdout), stderr: sha(result.stderr) }, container_receipt_sha256: result.receipt_sha256 };
    const observed = observeCampaignCodexTerminal(input);
    expect(observed.state).toBe('terminal'); expect(observed.runtime_effect_inactive).toBe(true);
    const facts = JSON.parse(role === 'worker' ? observed.final_response! : parseCampaignVerifierResponse(observed.final_response!).review);
    expect(facts.writable).toBe(role === 'worker');
    expect(facts.controlVisible).toBe(false);
    expect(facts.head).toBe(git(f.root, 'rev-parse', 'HEAD').toString().trim());
    expect(observeCampaignCodexTerminal({ ...input, container_receipt_sha256: sha('forged') }).runtime_effect_inactive).toBeNull();
    expect(observeCampaignCodexTerminal({ ...input, termination_cause: 'cancelled' }).runtime_effect_inactive).toBeNull();
    await expect(executeCampaignCodexInvocation(invocation, f.root)).rejects.toThrow('already been admitted');
  }, 30000);
  test('actual worker then gatekeeper consumes prepared evidence and retains both terminals after cleanup', async () => {
    const f = fixture('worker');
    const completed = [];
    for (const role of ['worker', 'verifier'] as const) {
      writeFileSync(join(f.root, 'probe-fixture.json'), JSON.stringify({ mode: 'normal', role }));
      const invocation = await prepareCampaignCodexInvocation({ ...f.input, identity: { ...f.input.identity, role } });
      const child = await runChild(role, 'codex-exec:' + role, f.root, f.root,
        { REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../..') }, f.input.deadline_ms, undefined, invocation);
      const input = { invocation, worktree: f.root, ...child };
      const terminal = observeCampaignCodexTerminal(input);
      expect(terminal.state).toBe('terminal'); expect(terminal.runtime_effect_inactive).toBe(true);
      if (role === 'verifier') expect(parseCampaignVerifierResponse(terminal.final_response!).verdict).toBe('pass');
      completed.push({ input, terminal });
    }
    while (Date.now() < f.input.deadline_ms) await Bun.sleep(20);
    for (const { input, terminal } of completed) {
      for (const handle of [input.invocation.container, input.invocation.probe.container]) {
        await cleanupCampaignContainer(handle.directory);
        expect((await reconcileCampaignContainer(handle)).inactive).toBe(true);
      }
      expect(observeCampaignCodexTerminal(input)).toEqual(terminal);
    }
  }, 30000);
  test('actual command output with an unknown provider operation cannot authorize inactivity', async () => {
    const f = fixture('worker'); writeFileSync(join(f.root, 'prompt'), 'unknown-operation');
    const invocation = await prepareCampaignCodexInvocation(f.input);
    const child = await runChild('worker', 'codex-exec:worker', f.root, f.root,
      { REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../..') }, f.input.deadline_ms, undefined, invocation);
    expect(child.exit_code).toBe(0);
    const observed = observeCampaignCodexTerminal({ invocation, worktree: f.root, ...child });
    expect(observed.supervision_proven).toBe(true);
    expect(observed.state).toBe('unknown'); expect(observed.runtime_effect_inactive).toBeNull();
  }, 30000);

  for (const role of ['worker', 'verifier'] as const) {
    for (const mode of ['hang', 'descendant', 'flood', 'missing', 'invalid', 'exhaust', 'cancel', 'expired'] as const) {
      test(`${role} version preparation ${mode} is bounded and cannot create a workload`, async () => {
        const f = fixture(role);
        f.input.deadline_ms = mode === 'expired' ? Date.now() - 1 : Date.now() + 8000;
        writeFileSync(join(f.root, 'probe-fixture.json'), JSON.stringify({ mode }));
        const common = realpathSync(join(f.root, '.git'));
        const probeDirectory = campaignContainerDirectory(common, { ...f.input.identity, phase: 'version' });
        const workloadDirectory = campaignContainerDirectory(common, f.input.identity);
        const env = { ...process.env };
        if (mode === 'exhaust') {
          const realDocker = Bun.which('docker'); expect(realDocker).not.toBeNull();
          const bin = mkdtempSync(join(buildRoot, 'deadline-'));
          // Delay the first post-probe Docker call. The probe itself must have completed successfully.
          writeFileSync(join(bin, 'docker'), `#!${process.execPath}\n
            if(require('fs').existsSync(${JSON.stringify(join(probeDirectory, 'terminal.json'))}))
              await Bun.sleep(Math.max(0,${f.input.deadline_ms}-Date.now()+1000));
            const result=Bun.spawnSync([${JSON.stringify(realDocker)},...process.argv.slice(2)],{stdout:'inherit',stderr:'inherit'});
            process.exit(result.exitCode);`, { mode: 0o755 });
          env.PATH = bin + ':' + process.env.PATH;
        }
        // A separate process owns preparation so a synchronous hang cannot disable the watchdog.
        const code = `import {prepareCampaignCodexInvocation} from ${JSON.stringify(join(import.meta.dir, '../../src/effects/automation/campaign-runtime.ts'))};
          try {await prepareCampaignCodexInvocation(${JSON.stringify(f.input)}); console.log(JSON.stringify({admitted:true}));}
          catch(error){console.log(JSON.stringify({admitted:false,error:error.message}));}`;
        const child = Bun.spawn([process.execPath, '-e', code], { env, stdout: 'pipe', stderr: 'pipe' });
        const watchdog = setTimeout(() => child.kill('SIGKILL'), 15000);
        try {
          const streams = Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);
          if (mode === 'cancel') {
            while (!existsSync(join(probeDirectory, 'start.json')) && Date.now() < f.input.deadline_ms) await Bun.sleep(20);
            expect(existsSync(join(probeDirectory, 'start.json'))).toBe(true);
            const handle = JSON.parse(readFileSync(join(probeDirectory, 'created.json'), 'utf8'));
            let running = false;
            while (!running && Date.now() < f.input.deadline_ms) {
              running = JSON.parse(execFileSync('docker', ['--host', handle.endpoint, 'inspect', handle.container_id], { encoding: 'utf8', timeout: 5000 }))[0].State.Running;
              if (!running) await Bun.sleep(20);
            }
            expect(running).toBe(true);
            child.kill('SIGTERM');
          }
          const exit = await child.exited; const [stdout, stderr] = await streams;
          expect(exit, stderr).toBe(0);
          const result = JSON.parse(stdout);
          expect(result.admitted).toBe(false); expect(result.error).toBeString();
          expect(Date.now()).toBeLessThan(f.input.deadline_ms + 7000);
          expect(existsSync(workloadDirectory)).toBe(false);
          if (mode === 'expired') {
            expect(result.error).toContain('deadline expired');
            expect(existsSync(probeDirectory)).toBe(false);
          } else {
            expect(existsSync(join(probeDirectory, 'terminal.json')), result.error).toBe(true);
            const handle = JSON.parse(readFileSync(join(probeDirectory, 'created.json'), 'utf8'));
            const inspected = JSON.parse(execFileSync('docker', ['--host', handle.endpoint, 'inspect', handle.container_id], { encoding: 'utf8', timeout: 5000 }))[0];
            expect(inspected.State.Running).toBe(false); expect(inspected.State.Pid).toBe(0);
            const terminal = JSON.parse(readFileSync(join(probeDirectory, 'terminal.json'), 'utf8'));
            expect(terminal.inactive).toBe(true);
            if (mode === 'missing' || mode === 'invalid') expect(result.error).toContain('not an exact CLI version');
            if (mode === 'descendant') expect(terminal.stdout_sha256).toBe(canonicalMessageDigest({ bytes: 'descendant-started\n' }));
            if (mode === 'exhaust') {
              expect(terminal.stdout_sha256).toBe(canonicalMessageDigest({ bytes: 'codex-cli 0.153.4\n' }));
              expect(terminal.exit_code).toBe(0); expect(terminal.output_complete).toBe(true);
              expect(terminal.termination_cause).toBe('completed');
            }
            if (mode === 'flood') expect(terminal.output_complete).toBe(false);
            if (mode === 'cancel') expect(terminal.termination_cause).toBe('cancelled');
          }
        } finally { clearTimeout(watchdog); child.kill('SIGKILL'); await child.exited; }
      }, 22000);
    }
  }

  test('post-exit replacement of both logs and local summaries cannot forge terminal authority', async () => {
    const f = fixture('worker'); const invocation = await prepareCampaignCodexInvocation(f.input);
    const child = await runChild('worker', 'codex-exec:worker', f.root, f.root,
      { REPO_HARNESS_PACKAGE_ROOT: join(import.meta.dir, '../..') }, f.input.deadline_ms, undefined, invocation);
    // Explicit barrier: runChild has returned, but the production terminal consumer has not run.
    expect(observeCampaignCodexTerminal({ invocation, worktree: f.root, ...child }).state).toBe('terminal');
    for (const field of ['dispatch_id', 'claim_id', 'lease_generation', 'binding_generation'] as const) {
      const { invocation_sha256: _, ...body } = invocation;
      const identity = { ...body.identity, [field]: typeof body.identity[field] === 'number' ? 99 : field === 'dispatch_id' ? 'sha256:' + 'b'.repeat(64) : 'replaced' };
      const changed = { ...body, identity };
      const substituted = { ...changed, invocation_sha256: canonicalMessageDigest(changed) };
      expect(() => validateCampaignCodexInvocation(substituted)).not.toThrow();
      expect(observeCampaignCodexTerminal({ invocation: substituted, worktree: f.root, ...child }).supervision_proven).toBe(false);
    }
    const original = readFileSync(join(f.root, child.stdout_path), 'utf8');
    const forged = original.replace('model-free', 'forged-thread');
    writeFileSync(join(f.root, child.stdout_path), forged);
    const replacement = { ...child, output_sha256: { stdout: sha(forged), stderr: sha('') } };
    writeFileSync(join(f.root, 'worker.bounded-result.json'), JSON.stringify(replacement));
    const observed = observeCampaignCodexTerminal({ invocation, worktree: f.root, ...replacement });
    expect(observed.state).toBe('unknown'); expect(observed.supervision_proven).toBe(false);
    expect(observed.runtime_effect_inactive).toBeNull();
    for (const handle of [invocation.container, invocation.probe.container]) {
      const request = JSON.parse(readFileSync(join(handle.directory, 'request.json'), 'utf8'));
      for (const mount of request.expected.mounts) {
        expect(handle.directory === mount.Source || handle.directory.startsWith(mount.Source + '/')).toBe(false);
      }
    }
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
    const child = Bun.spawn([process.execPath, '-e', code], { env: { ...process.env }, stdout: 'pipe', stderr: 'pipe' });
    const timer = setTimeout(() => child.kill('SIGKILL'), 20000);
    try {
      const streams = Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text()]);
      const exit = await child.exited; const [stdout, stderr] = await streams;
      expect(exit, stderr).toBe(0); expect(JSON.parse(stdout).exit_code).toBe(0);
    } finally { clearTimeout(timer); child.kill('SIGKILL'); await child.exited; }
  }, 40000);

});
