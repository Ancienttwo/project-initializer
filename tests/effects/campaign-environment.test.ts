import { test, expect } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { prepareCampaignContainer, runCampaignContainer } from '../../src/effects/automation/campaign-container';

const image = process.env.BRC_TEST_CONTAINER_IMAGE;
test.skipIf(!image)('campaign image supplies the real packaged harness and trusted helper without host tools or credentials', async () => {
  const root = realpathSync(mkdtempSync(join(process.platform === 'linux' ? '/var/tmp' : tmpdir(), 'campaign-env-')));
  let id: string | undefined;
  try {
    execFileSync('git', ['init', '-q', root]);
    const deadline = Date.now() + 30000;
    const container = await prepareCampaignContainer({ root, worktree: root, common_git_dir: join(root, '.git'), image: image!,
      identity: { kind: 'environment-test', id: randomUUID() }, writable: false, probe: true, deadline_ms: deadline,
      argv: ['/bin/sh', '-ec', 'jq --version; repo-harness --version; repo-harness run verify-sprint -- --help'] });
    id = container.container_id;
    const result = await runCampaignContainer(container, deadline);
    expect(result.inactive).toBe(true);
    expect(result.exit_code, result.stderr).toBe(0);
    expect(result.stdout).toContain('0.18.0');
    expect(result.stdout).toContain('prepare-acceptance');
  } finally {
    if (id) execFileSync('docker', ['rm', id], { stdio: 'pipe' });
    rmSync(root, { recursive: true, force: true });
  }
}, 40000);

test('operator preflight rejects an invalid deadline before container preparation', () => {
  const result = Bun.spawnSync([process.execPath, 'scripts/run-campaign-preflight.ts', '--worktree', '.',
    '--image', 'sha256:' + 'a'.repeat(64), '--timeout-ms', '0', '--', '/bin/true'], { cwd: join(import.meta.dir, '../..') });
  expect(result.exitCode).not.toBe(0);
  expect(new TextDecoder().decode(result.stderr)).toContain('timeout must be');
});

test.skipIf(!image)('operator preflight preserves a command failure and mounts no credentials', () => {
  const root = realpathSync(mkdtempSync(join(process.platform === 'linux' ? '/var/tmp' : tmpdir(), 'campaign-preflight-')));
  let id: string | undefined;
  try {
    execFileSync('git', ['init', '-q', root]);
    const result = Bun.spawnSync([process.execPath, 'scripts/run-campaign-preflight.ts', '--worktree', root,
      '--image', image!, '--timeout-ms', '20000', '--', '/bin/sh', '-c', 'echo denied >&2; exit 7'],
      { cwd: join(import.meta.dir, '../..'), timeout: 30000 });
    const terminal = JSON.parse(new TextDecoder().decode(result.stdout));
    id = terminal.container.container_id;
    expect(result.exitCode).toBe(1);
    expect(terminal).toMatchObject({ exit_code: 7, inactive: true, output_complete: true, termination_cause: 'completed' });
    expect(terminal.stderr).toContain('denied');
    const inspected = JSON.parse(execFileSync('docker', ['inspect', id!], { encoding: 'utf8' }))[0];
    expect(inspected.Mounts.every((m: { RW: boolean; Destination: string }) => !m.RW && m.Destination !== '/run/codex-auth.json')).toBe(true);
    expect(inspected.HostConfig.NetworkMode).toBe('none');
  } finally {
    if (id) execFileSync('docker', ['rm', id], { stdio: 'pipe' });
    rmSync(root, { recursive: true, force: true });
  }
}, 35000);
