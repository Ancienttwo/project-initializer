import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { RUN_SUMMARY_RETENTION_COUNT, sweepRunSummaries } from '../../src/effects/run-summary-retention';

const RUNS_DIR = '.ai/harness/runs';
const CHECKS_FILE = '.ai/harness/checks/latest.json';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), 'run-retention-'));
  roots.push(root);
  mkdirSync(join(root, RUNS_DIR), { recursive: true });
  mkdirSync(join(root, '.ai/harness/checks'), { recursive: true });
  return root;
}

/** `index` orders age: 0 is the newest. */
function seedRun(root: string, name: string, index: number): string {
  const path = join(root, RUNS_DIR, name);
  writeFileSync(path, JSON.stringify({ run_id: name }));
  const seconds = 1_600_000_000 - index * 60;
  utimesSync(path, seconds, seconds);
  return `${RUNS_DIR}/${name}`;
}

function seedChecks(root: string, body: unknown, name = 'latest.json'): void {
  writeFileSync(join(root, '.ai/harness/checks', name), JSON.stringify(body));
}

function remaining(root: string): string[] {
  return readdirSync(join(root, RUNS_DIR)).sort();
}

describe('run summary retention', () => {
  test('keeps the newest N and removes the rest', () => {
    const root = fixture();
    seedChecks(root, { status: 'pass' });
    for (let index = 0; index < 5; index++) seedRun(root, `run-${index}.json`, index);

    const result = sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 2 });

    expect(result.scanned).toBe(5);
    expect([...result.removed].sort()).toEqual([
      `${RUNS_DIR}/run-2.json`, `${RUNS_DIR}/run-3.json`, `${RUNS_DIR}/run-4.json`,
    ]);
    expect(remaining(root)).toEqual(['run-0.json', 'run-1.json']);
    expect(result.retained).toBe(2);
  });

  test('a run file pinned by a checks projection survives past the bound', () => {
    const root = fixture();
    for (let index = 0; index < 5; index++) seedRun(root, `run-${index}.json`, index);
    // The oldest entry is the one verify-sprint froze for acceptance finalization.
    seedChecks(root, { run_file: `${RUNS_DIR}/run-4.json` });

    const result = sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 1 });

    expect(result.pinned).toBe(1);
    expect(remaining(root)).toEqual(['run-0.json', 'run-4.json']);
    expect(result.removed).not.toContain(`${RUNS_DIR}/run-4.json`);
  });

  test('every checks projection in the directory contributes pins', () => {
    const root = fixture();
    for (let index = 0; index < 4; index++) seedRun(root, `run-${index}.json`, index);
    seedChecks(root, { run_file: `${RUNS_DIR}/run-3.json` });
    seedChecks(root, { run_file: `${RUNS_DIR}/run-2.json` }, 'change-assessment.latest.json');

    sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 0 });

    expect(remaining(root)).toEqual(['run-2.json', 'run-3.json']);
  });

  test('an unreadable checks projection cancels the sweep instead of widening it', () => {
    const root = fixture();
    for (let index = 0; index < 3; index++) seedRun(root, `run-${index}.json`, index);
    writeFileSync(join(root, '.ai/harness/checks/latest.json'), '{ truncated');

    expect(() => sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 0 }))
      .toThrow('unreadable checks projection cannot prove its run pin');
    expect(remaining(root)).toEqual(['run-0.json', 'run-1.json', 'run-2.json']);
  });

  test('a symlinked run entry is reported, never unlinked', () => {
    const root = fixture();
    seedChecks(root, { status: 'pass' });
    const outside = join(root, 'outside.json');
    writeFileSync(outside, '{}');
    symlinkSync(outside, join(root, RUNS_DIR, 'run-link.json'));
    seedRun(root, 'run-0.json', 0);

    const result = sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 0 });

    expect(result.skipped).toEqual(['run-link.json: not a regular file']);
    expect(existsSync(outside)).toBe(true);
    expect(remaining(root)).toEqual(['run-link.json']);
  });

  test('only .json files directly in the runs directory are candidates', () => {
    const root = fixture();
    seedChecks(root, { status: 'pass' });
    seedRun(root, 'run-0.json', 0);
    writeFileSync(join(root, RUNS_DIR, 'hook-events.jsonl'), '{}\n');
    mkdirSync(join(root, RUNS_DIR, 'bash-output'));
    writeFileSync(join(root, RUNS_DIR, 'bash-output', 'run-nested.json'), '{}');

    const result = sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 0 });

    expect(result.scanned).toBe(1);
    expect(remaining(root).sort()).toEqual(['bash-output', 'hook-events.jsonl']);
    expect(existsSync(join(root, RUNS_DIR, 'bash-output', 'run-nested.json'))).toBe(true);
  });

  test('a dry run reports the same selection without deleting', () => {
    const root = fixture();
    seedChecks(root, { status: 'pass' });
    for (let index = 0; index < 3; index++) seedRun(root, `run-${index}.json`, index);

    const result = sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE, retain: 1, dryRun: true });

    expect(result.removed.length).toBe(2);
    expect(result.reclaimedBytes).toBeGreaterThan(0);
    expect(remaining(root)).toEqual(['run-0.json', 'run-1.json', 'run-2.json']);
  });

  test('a missing runs directory is not an error', () => {
    const root = fixture();
    rmSync(join(root, RUNS_DIR), { recursive: true, force: true });
    expect(sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE }).scanned).toBe(0);
  });

  test('the default bound is the exported retention count', () => {
    const root = fixture();
    seedChecks(root, { status: 'pass' });
    for (let index = 0; index < RUN_SUMMARY_RETENTION_COUNT + 3; index++) seedRun(root, `run-${index}.json`, index);

    const result = sweepRunSummaries({ repoRoot: root, runsDir: RUNS_DIR, checksFile: CHECKS_FILE });

    expect(result.removed.length).toBe(3);
    expect(result.retained).toBe(RUN_SUMMARY_RETENTION_COUNT);
  });

  test('a runs directory outside the repository is refused', () => {
    const root = fixture();
    expect(() => sweepRunSummaries({ repoRoot: root, runsDir: '../escape', checksFile: CHECKS_FILE }))
      .toThrow('path traversal is not allowed');
  });
});
