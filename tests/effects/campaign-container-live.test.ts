import { afterEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { prepareCampaignContainer, runCampaignContainer, reconcileCampaignContainer, type CampaignContainer } from '../../src/effects/automation/campaign-container';

const image = process.env.BRC_TEST_CONTAINER_IMAGE;
const owned: { root: string; handle?: CampaignContainer }[] = [];
afterEach(() => {
  for (const item of owned.splice(0)) {
    if (item.handle) {
      const result = Bun.spawnSync(['docker', '--host', item.handle.endpoint, 'rm', '-f', item.handle.container_id], { timeout: 5000 });
      if (result.exitCode !== 0) throw new Error('owned fixture container cleanup failed');
    }
    rmSync(item.root, { recursive: true, force: true });
  }
});
async function prepare(argv: string[], writable = false, duration = 10000) {
  const root = mkdtempSync(join(tmpdir(), 'brc-contained-test-'));
  mkdirSync(join(root, 'work')); mkdirSync(join(root, 'common'));
  const item: { root: string; handle?: CampaignContainer } = { root }; owned.push(item);
  const deadline = Date.now() + duration;
  const handle = await prepareCampaignContainer({ root, worktree: join(root, 'work'), common_git_dir: join(root, 'common'),
    argv, deadline_ms: deadline, writable, image: image!, identity: { test: 'no-provider' } });
  item.handle = handle;
  return { root, handle, deadline };
}
describe.skipIf(!image)('real Docker adapter, no provider credentials', () => {
  test('pinned Codex version traverses real pre-start validation and terminal readback', async () => {
    const f = await prepare(['/usr/local/bin/codex', '--version']);
    const result = await runCampaignContainer(f.handle, f.deadline);
    expect(result.exit_code).toBe(0); expect(result.stdout.trim()).toBe('codex-cli 0.153.4');
    expect(result.inactive).toBe(true); expect(result.output_complete).toBe(true);
    await expect(runCampaignContainer(f.handle, f.deadline)).rejects.toThrow('already been admitted');
  }, 20000);
  test('read-only worktree rejects write while child cannot signal watchdog', async () => {
    const f = await prepare(['/usr/local/bin/node', '-e', `const fs=require('fs');let denied=false;try{fs.writeFileSync('forbidden','x')}catch(e){denied=e.code==='EROFS'};let protectedInit=false;try{process.kill(1,'SIGSTOP')}catch(e){protectedInit=e.code==='EPERM'};console.log(JSON.stringify({denied,protectedInit,uid:process.getuid(),status:fs.readFileSync('/proc/self/status','utf8')}));`]);
    const result = await runCampaignContainer(f.handle, f.deadline); const output = JSON.parse(result.stdout);
    expect(result.exit_code).toBe(0); expect(output.denied).toBe(true); expect(output.protectedInit).toBe(true);
    expect(output.uid).toBe(process.getuid!()); expect(output.status).toMatch(/CapEff:\s+0000000000000000/);
    expect(output.status).toMatch(/NoNewPrivs:\s+1/); expect(existsSync(join(f.root, 'work/forbidden'))).toBe(false);
  }, 20000);
  test('detached writer cannot outlive normal namespace init exit', async () => {
    const f = await prepare(['/usr/local/bin/node', '-e', `const fs=require('fs');const child=require('child_process').spawn(process.execPath,['-e',"require('fs').writeFileSync('ready','x');setInterval(()=>require('fs').appendFileSync('marker','x'),10)"],{detached:true,stdio:'ignore'});child.unref();const timer=setInterval(()=>{if(fs.existsSync('marker')){clearInterval(timer);process.exit(0)}},10);`], true);
    const result = await runCampaignContainer(f.handle, f.deadline);
    expect(result.exit_code).toBe(0); expect(result.inactive).toBe(true);
    expect(readFileSync(join(f.root, 'work/marker')).length).toBeGreaterThan(0);
    const terminal = JSON.parse(readFileSync(join(f.handle.directory, 'terminal.json'), 'utf8'));
    expect(terminal.daemon_state.Running).toBe(false); expect(terminal.daemon_state.Pid).toBe(0);
  }, 20000);
  test('absolute deadline bounds TERM-resistant workload', async () => {
    const f = await prepare(['/usr/local/bin/node', '-e', "process.on('SIGTERM',()=>{});setInterval(()=>{},1000)"], false, 3000);
    const result = await runCampaignContainer(f.handle, f.deadline);
    expect(result.exit_code).toBe(124); expect(result.timed_out).toBe(true); expect(result.inactive).toBe(true);
  }, 20000);
  test('cancelled attach cannot turn cooperative exit into success', async () => {
    const f = await prepare(['/usr/local/bin/node', '-e', "process.on('SIGTERM',()=>process.exit(0));setInterval(()=>{},1000)"]);
    const signal = new AbortController(); const timer = setTimeout(() => signal.abort(), 1000);
    try { const result = await runCampaignContainer(f.handle, f.deadline, signal.signal); expect(result.exit_code).toBe(143); expect(result.termination_cause).toBe('cancelled'); expect(result.inactive).toBe(true); }
    finally { clearTimeout(timer); }
  }, 20000);
});

test.skipIf(!image)('real post-create resource drift rejects before workload start', async () => {
  const f = await prepare(['/usr/local/bin/codex', '--version']);
  const update = Bun.spawnSync(['docker', '--host', f.handle.endpoint, 'update', '--memory', '536870912', f.handle.container_id], { timeout: 5000 });
  expect(update.exitCode).toBe(0);
  await expect(runCampaignContainer(f.handle, f.deadline)).rejects.toThrow('HostConfig.Memory');
  expect(existsSync(join(f.handle.directory, 'start.json'))).toBe(false);
}, 20000);

test.skipIf(!image)('controller SIGKILL does not disable the independent absolute watchdog', async () => {
    const f = await prepare(['/usr/local/bin/node', '-e', "require('fs').writeFileSync('controller-ready','x');process.on('SIGTERM',()=>{});const p=require('child_process').spawn(process.execPath,['-e',\"setInterval(()=>{},1000)\"],{detached:true,stdio:'ignore'});p.unref();setInterval(()=>{},1000)"], true, 6000);
    await expect(reconcileCampaignContainer(f.handle)).rejects.toThrow('expired deadline');
    const child = Bun.spawn([process.execPath, '-e', `import { runCampaignContainer } from ${JSON.stringify(join(import.meta.dir, '../../src/effects/automation/campaign-container.ts'))}; await runCampaignContainer(${JSON.stringify(f.handle)}, ${f.deadline});`], { stdout: 'ignore', stderr: 'ignore' });
    try {
      while (!existsSync(join(f.root, 'work/controller-ready')) && Date.now() < f.deadline) await Bun.sleep(20);
      expect(existsSync(join(f.root, 'work/controller-ready'))).toBe(true);
      child.kill('SIGKILL'); await child.exited;
      while (Date.now() < f.deadline + 300) await Bun.sleep(20);
      const inspect = Bun.spawnSync(['docker', '--host', f.handle.endpoint, 'inspect', '--type', 'container', f.handle.container_id], { timeout: 5000 });
      expect(inspect.exitCode).toBe(0);
      const value = JSON.parse(new TextDecoder().decode(inspect.stdout))[0];
      expect(value.State.Running).toBe(false); expect(value.State.Pid).toBe(0); expect(value.State.ExitCode).toBe(124);
      expect(existsSync(join(f.handle.directory, 'terminal.json'))).toBe(false);
      const recovered = await reconcileCampaignContainer(f.handle);
      expect(recovered.inactive).toBe(true); expect(recovered.output_complete).toBe(false);
      expect(await reconcileCampaignContainer(f.handle)).toEqual(recovered);
      expect(existsSync(join(f.handle.directory, 'terminal.json'))).toBe(false);
      await expect(runCampaignContainer(f.handle, f.deadline)).rejects.toThrow('already been admitted');
    } finally { child.kill('SIGKILL'); await child.exited; }
  }, 15000);
test.skipIf(!image)('output flood is bounded and cannot be reported as successful complete output', async () => {
    const f = await prepare(['/usr/local/bin/node', '-e', "process.stdout.write('x'.repeat(1000000));setInterval(()=>{},1000)"]);
    const result = await runCampaignContainer(f.handle, f.deadline, undefined, 1024);
    expect(result.exit_code).toBe(125); expect(result.output_complete).toBe(false); expect(result.inactive).toBe(true);
    expect(result.stdout.length).toBeLessThanOrEqual(1024);
  }, 20000);


test.skipIf(!image)('interruption publication crash never leaves a partial authoritative receipt', async () => {
  const f = await prepare(['/usr/local/bin/codex', '--version'], false, 3000);
  while (Date.now() < f.deadline) await Bun.sleep(20);
  const code = `import * as fs from 'fs'; import { mock } from 'bun:test';
    let target; const open=fs.openSync, write=fs.writeFileSync, writeRaw=fs.writeSync;
    mock.module('fs', () => ({...fs, openSync(path,...args){const fd=open(path,...args);if(String(path).includes('interrupted'))target=fd;return fd},
      writeFileSync(fd,...args){if(fd===target){writeRaw(fd,'{');process.kill(process.pid,'SIGKILL')}return write(fd,...args)}}));
    const {reconcileCampaignContainer}=await import(${JSON.stringify(join(import.meta.dir, '../../src/effects/automation/campaign-container.ts'))});
    await reconcileCampaignContainer(${JSON.stringify(f.handle)});`;
  const child = Bun.spawn([process.execPath, '-e', code], { stdout: 'ignore', stderr: 'pipe' });
  expect(await child.exited, await new Response(child.stderr).text()).toBe(137);
  expect(readdirSync(f.handle.directory).some(name => name.includes('interrupted'))).toBe(true);
  const result = await reconcileCampaignContainer(f.handle);
  expect(result.inactive).toBe(true); expect(result.output_complete).toBe(false);
}, 15000);
