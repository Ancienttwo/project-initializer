import { afterEach, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { buildLeaseLivenessPolicy, validateLeaseLivenessPolicy } from '../../src/core/state/lease-liveness';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const runner = fileURLToPath(new URL('../../scripts/run-bounded-verifier-command.ts', import.meta.url));

test('liveness policy survives canonical grant key ordering without accepting changed policy or digest', () => {
  const policy = buildLeaseLivenessPolicy({ renewal_interval_ms: 1000, maximum_ttl_ms: 6000, renewal_actor_kind: 'controller', required_evidence_sources: ['controller', 'runtime_effect'], unproven_behavior: 'require_attention' });
  const transported = Object.fromEntries(Object.entries(policy).sort(([a], [b]) => a.localeCompare(b)));
  expect(validateLeaseLivenessPolicy(transported)).toEqual(policy);
  expect(() => validateLeaseLivenessPolicy({ ...transported, maximum_ttl_ms: 7000 })).toThrow();
  expect(() => validateLeaseLivenessPolicy({ ...transported, policy_sha256: 'sha256:' + '0'.repeat(64) })).toThrow();
  expect(() => validateLeaseLivenessPolicy({ ...transported, invented: true })).toThrow();
});

test('supervisor reports only its observed process-group scope after descendants finish', async () => {
  const root = mkdtempSync(join(tmpdir(), 'brc10-supervisor-')); roots.push(root);
  const result = join(root, 'result.json'); const marker = join(root, 'descendant-finished');
  const descendant = `await Bun.sleep(500); await Bun.write(${JSON.stringify(marker)}, 'done');`;
  const script = `Bun.spawn([process.execPath, '-e', ${JSON.stringify(descendant)}], { stdin: 'ignore', stdout: 'inherit', stderr: 'inherit' }); process.exit(0);`;
  const child = Bun.spawn([process.execPath, runner, '--deadline-ms', String(Date.now() + 5000), '--log', join(root, 'log'), '--result', result, '--', process.execPath, '-e', script], { stdout: 'ignore', stderr: 'pipe' });
  const stderr = new Response(child.stderr).text();
  expect(await child.exited, await stderr).toBe(0);
  const receipt = JSON.parse(readFileSync(result, 'utf8'));
  if (process.platform === 'win32') {
    expect(receipt.process_group_quiescence).toEqual({ scope: 'unsupported', state: 'unknown' });
    await Bun.sleep(700);
  } else {
    expect(existsSync(marker)).toBe(true);
    expect(receipt.duration_ms).toBeGreaterThanOrEqual(500);
    expect(receipt.process_group_quiescence).toEqual({ scope: 'posix_process_group', state: 'quiescent' });
  }
}, 10_000);

test('forced termination reports observed scope without claiming remote provider inactivity', async () => {
  const root = mkdtempSync(join(tmpdir(), 'brc10-timeout-')); roots.push(root);
  const result = join(root, 'result.json');
  const child = Bun.spawn([process.execPath, runner, '--deadline-ms', String(Date.now() + 300), '--log', join(root, 'log'), '--result', result,
    '--', process.execPath, '-e', "process.on('SIGTERM', () => {}); await Bun.sleep(10000);"], { stdout: 'ignore', stderr: 'pipe' });
  const stderr = new Response(child.stderr).text();
  expect(await child.exited, await stderr).toBe(124);
  const receipt = JSON.parse(readFileSync(result, 'utf8'));
  expect(receipt.timed_out).toBe(true);
  expect(receipt).not.toHaveProperty('runtime_effect_inactive');
  expect(receipt.process_group_quiescence).toEqual(process.platform === 'win32'
    ? { scope: 'unsupported', state: 'unknown' } : { scope: 'posix_process_group', state: 'quiescent' });
}, 10_000);
