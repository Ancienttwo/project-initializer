import { afterEach, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, unlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { acquireExclusiveDirectoryLock } from '../src/effects/locking/exclusive-directory-lock';
import { acknowledgeArchitectureProjectionPublication, advanceArchitectureDriftCursor, computeArchitectureDriftChangedSet, drainArchitectureDriftCascade, readArchitectureDriftCursor } from '../src/cli/hook/architecture-drift';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function git(root: string, ...args: string[]) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}
function fixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'drift-recovery-'))); roots.push(root);
  git(root, 'init', '-b', 'main'); git(root, 'config', 'user.email', 'test@example.com'); git(root, 'config', 'user.name', 'test');
  writeFileSync(join(root, '.gitignore'), '.ai/\n');
  for (const path of ['a.ts', 'z.ts']) writeFileSync(join(root, path), path);
  git(root, 'add', '.'); git(root, 'commit', '-m', 'seed');
  return root;
}
const batchPath = (root: string) => join(root, '.ai/harness/state/architecture-drift-cascade.json');
const lock = '.ai/harness/state/architecture-drift-cascade.lock';
const budget = { deadlineMs: 20_000, nowMs: () => 0 };
function partial(root: string) {
  const changed = { ...computeArchitectureDriftChangedSet(root), paths: ['a.ts', 'z.ts'] };
  let clock = 0;
  expect(() => drainArchitectureDriftCascade(root, changed, () => { clock = 1; }, { deadlineMs: 1, nowMs: () => clock })).toThrow('deadline exhausted');
  expect(JSON.parse(readFileSync(batchPath(root), 'utf8')).completed).toBe(1);
  return changed;
}
function publication(root: string) {
  mkdirSync(join(root, 'docs/architecture'), { recursive: true });
  writeFileSync(join(root, 'docs/architecture/.projection-manifest.json'), '{}\n');
  git(root, 'add', '.'); git(root, 'commit', '-m', 'publication', '-m', 'Source-Worktree-Head: ' + git(root, 'rev-parse', 'HEAD'));
  return git(root, 'rev-parse', 'HEAD');
}
test('completed symlink prefix cannot starve the pending tail', () => {
  const root = fixture(); const changed = partial(root);
  unlinkSync(join(root, 'a.ts')); symlinkSync('z.ts', join(root, 'a.ts'));
  const calls: string[] = [];
  drainArchitectureDriftCascade(root, changed, path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts']);
});
test('pending symlink keeps its offset and does not silently deliver its target', () => {
  const root = fixture(); const changed = partial(root);
  unlinkSync(join(root, 'z.ts')); symlinkSync('a.ts', join(root, 'z.ts'));
  const calls: string[] = [];
  expect(() => drainArchitectureDriftCascade(root, changed, path => { calls.push(path); }, budget)).toThrow();
  expect(calls).toEqual([]);
  expect(JSON.parse(readFileSync(batchPath(root), 'utf8')).completed).toBe(1);
});
test('publication cannot discard an uncovered pending suffix or rewind its cursor', () => {
  const root = fixture(); partial(root);
  const head = publication(root); acknowledgeArchitectureProjectionPublication(root, head);
  const fresh = computeArchitectureDriftChangedSet(root);
  expect(fresh.paths).toEqual([]);
  const calls: string[] = [];
  drainArchitectureDriftCascade(root, fresh, path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts']);
  expect(readArchitectureDriftCursor(root)?.head_sha).toBe(head);
});
for (const phase of ['creation', 'release']) test('recovers a stale empty lock after ' + phase + ' crash', () => {
  const root = fixture();
  mkdirSync(join(root, '.ai/harness/state'), { recursive: true });
  const result = spawnSync(process.execPath, ['-e', `
    import fs from 'node:fs';
    import { mock } from 'bun:test';
    const root = ${JSON.stringify(root)}; const lock = ${JSON.stringify(lock)};
    const target = root + '/' + lock; const phase = ${JSON.stringify(phase)};
    mock.module('fs', () => ({ ...fs,
      mkdirSync: (...args) => { const result = fs.mkdirSync(...args); if (phase === 'creation' && args[0] === target) process.kill(process.pid, 'SIGKILL'); return result; },
      unlinkSync: (...args) => { const result = fs.unlinkSync(...args); if (phase === 'release' && String(args[0]).startsWith(target + '/')) process.kill(process.pid, 'SIGKILL'); return result; },
    }));
    const { acquireExclusiveDirectoryLock } = await import(${JSON.stringify(join(import.meta.dir, '../src/effects/locking/exclusive-directory-lock.ts'))});
    const held = acquireExclusiveDirectoryLock(root, lock); held.release();
  `], { encoding: 'utf8' });
  expect(result.signal).toBe('SIGKILL');
  expect(readdirSync(join(root, lock))).toEqual([]);
  const stale = new Date(Date.now() - 60_000); utimesSync(join(root, lock), stale, stale);
  const calls: string[] = [];
  drainArchitectureDriftCascade(root, { ...computeArchitectureDriftChangedSet(root), paths: ['z.ts'] }, path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts']);
});
test('never reclaims a live owner even with an old directory timestamp', () => {
  const root = fixture();
  const held = acquireExclusiveDirectoryLock(root, lock);
  try {
    const stale = new Date(Date.now() - 60_000); utimesSync(join(root, lock), stale, stale);
    expect(() => drainArchitectureDriftCascade(root, computeArchitectureDriftChangedSet(root), () => { throw new Error('must not deliver'); }, budget)).toThrow('timed out');
    held.assertOwned();
  } finally { held.release(); }
});
test('publication obeys the cascade lock in a different process', () => {
  const root = fixture(); const head = publication(root);
  const held = acquireExclusiveDirectoryLock(root, lock);
  try {
    const result = spawnSync(process.execPath, ['-e', `import { acknowledgeArchitectureProjectionPublication } from ${JSON.stringify(join(import.meta.dir, '../src/cli/hook/architecture-drift.ts'))}; acknowledgeArchitectureProjectionPublication(${JSON.stringify(root)}, ${JSON.stringify(head)});`], { encoding: 'utf8', timeout: 10_000 });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('timed out');
    expect(readArchitectureDriftCursor(root)).toBeNull();
    held.assertOwned();
  } finally { held.release(); }
  expect(acknowledgeArchitectureProjectionPublication(root, head).cursorSha).toBe(head);
});
test('final cursor rename serializes publication acknowledgement across processes', () => {
  const root = fixture(); const head = publication(root);
  const module = join(import.meta.dir, '../src/cli/hook/architecture-drift.ts');
  const result = spawnSync(process.execPath, ['-e', `
    import fs from 'node:fs';
    import { mock } from 'bun:test';
    import { spawnSync } from 'node:child_process';
    const original = fs.renameSync;
    let contender;
    mock.module('fs', () => ({ ...fs, renameSync: (from, to) => {
      if (String(to).endsWith('architecture-drift-cursor.json')) {
        contender = spawnSync(process.execPath, ['-e', ${JSON.stringify(`import { acknowledgeArchitectureProjectionPublication } from ${JSON.stringify(module)}; acknowledgeArchitectureProjectionPublication(${JSON.stringify(root)}, ${JSON.stringify(head)});`)}], { encoding: 'utf8', timeout: 10000 });
      }
      return original(from, to);
    }}));
    const drift = await import(${JSON.stringify(module)});
    drift.drainArchitectureDriftCascade(${JSON.stringify(root)}, { ...drift.computeArchitectureDriftChangedSet(${JSON.stringify(root)}), headSha: ${JSON.stringify(git(root, 'rev-parse', 'HEAD^'))}, paths: ['a.ts'] }, () => {}, { deadlineMs: 20000, nowMs: () => 0 });
    console.log(JSON.stringify({ status: contender?.status, stderr: contender?.stderr, cursor: drift.readArchitectureDriftCursor(${JSON.stringify(root)})?.head_sha }));
  `], { encoding: 'utf8', timeout: 15000 });
  expect(result.status).toBe(0);
  const observation = JSON.parse(result.stdout);
  expect(observation.status).toBe(1);
  expect(observation.stderr).toContain('timed out');
  expect(observation.cursor).toBe(git(root, 'rev-parse', 'HEAD^'));
  acknowledgeArchitectureProjectionPublication(root, head);
  expect(readArchitectureDriftCursor(root)?.head_sha).toBe(head);
});

test('a stale projection acknowledgement cannot overwrite a newer cursor', () => {
  const root = fixture();
  const old = computeArchitectureDriftChangedSet(root);
  const head = publication(root);
  acknowledgeArchitectureProjectionPublication(root, head);
  expect(() => advanceArchitectureDriftCursor(root, old.headSha!, old.cursorSha)).toThrow('cursor changed');
  expect(readArchitectureDriftCursor(root)?.head_sha).toBe(head);
});
test('historical path traversal is rejected even in the completed prefix', () => {
  const root = fixture(); partial(root);
  const batch = JSON.parse(readFileSync(batchPath(root), 'utf8'));
  batch.paths[0] = '../escape.ts'; writeFileSync(batchPath(root), JSON.stringify(batch));
  expect(() => drainArchitectureDriftCascade(root, computeArchitectureDriftChangedSet(root), () => { throw new Error('must not deliver'); }, budget)).toThrow('invalid architecture drift cascade batch');
});

test('deleting a completed prefix still drains its tail and observes the deletion next', () => {
  const root = fixture(); const changed = partial(root);
  unlinkSync(join(root, 'a.ts'));
  const calls: string[] = [];
  drainArchitectureDriftCascade(root, changed, path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts']);
  expect(computeArchitectureDriftChangedSet(root).paths).toContain('a.ts');
});
test('an external cursor retains old suffix and leaves the new commit for the next window', () => {
  const root = fixture(); partial(root);
  const published = publication(root); acknowledgeArchitectureProjectionPublication(root, published);
  writeFileSync(join(root, 'new.ts'), 'new'); git(root, 'add', '.'); git(root, 'commit', '-m', 'later source');
  const current = git(root, 'rev-parse', 'HEAD');
  const calls: string[] = [];
  drainArchitectureDriftCascade(root, computeArchitectureDriftChangedSet(root), path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts']);
  expect(readArchitectureDriftCursor(root)?.head_sha).toBe(published);
  drainArchitectureDriftCascade(root, computeArchitectureDriftChangedSet(root), path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts', 'new.ts']);
  expect(readArchitectureDriftCursor(root)?.head_sha).toBe(current);
});
test('fresh empty lock remains protected until the stale threshold', () => {
  const root = fixture(); mkdirSync(join(root, lock), { recursive: true });
  expect(() => drainArchitectureDriftCascade(root, computeArchitectureDriftChangedSet(root), () => { throw new Error('must not deliver'); }, budget)).toThrow('timed out');
  expect(readdirSync(join(root, lock))).toEqual([]);
});
test('dead published owner is reclaimed without deleting unrelated lock state', () => {
  const root = fixture();
  const result = spawnSync(process.execPath, ['-e', `import { acquireExclusiveDirectoryLock } from ${JSON.stringify(join(import.meta.dir, '../src/effects/locking/exclusive-directory-lock.ts'))}; acquireExclusiveDirectoryLock(${JSON.stringify(root)}, ${JSON.stringify(lock)}); process.kill(process.pid, 'SIGKILL');`], { encoding: 'utf8' });
  expect(result.signal).toBe('SIGKILL');
  expect(readdirSync(join(root, lock))).toHaveLength(1);
  const calls: string[] = [];
  drainArchitectureDriftCascade(root, { ...computeArchitectureDriftChangedSet(root), paths: ['z.ts'] }, path => { calls.push(path); }, budget);
  expect(calls).toEqual(['z.ts']);
});
