import { describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(import.meta.dir, '..');
const workflow = Bun.YAML.parse(readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8')) as any;

function runLane(lane: string, governanceExit: number, testExit: number) {
  const bin = mkdtempSync(join(tmpdir(), 'rh-ci-lane-'));
  try {
    writeFileSync(join(bin, 'bun'), `#!/bin/bash\nif [[ "$1" == test ]]; then echo FUNCTIONAL_TEST_EXECUTED; exit ${testExit}; fi\nexit 0\n`, { mode: 0o755 });
    writeFileSync(join(bin, 'npm'), '#!/bin/bash\nexit 0\n', { mode: 0o755 });
    writeFileSync(join(bin, 'bash'), `#!/bin/bash\nif [[ "$1" == scripts/check-task-sync.sh ]]; then echo GOVERNANCE_EXECUTED; exit ${governanceExit}; fi\nexit 0\n`, { mode: 0o755 });
    return spawnSync('/bin/bash', ['scripts/check-ci.sh', lane], {
      cwd: ROOT, encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, BUN_TEST_ISOLATE_FILES: '0', REPO_HARNESS_DIFF_BASE: 'HEAD' },
    });
  } finally {
    rmSync(bin, { recursive: true, force: true });
  }
}

describe('CI independent governance and functional lanes', () => {
  test('a governance failure does not suppress the separate functional invocation', () => {
    const governance = runLane('governance', 19, 23);
    const functional = runLane('functional', 19, 23);
    expect(governance.status).toBe(19);
    expect(governance.stdout).not.toContain('FUNCTIONAL_TEST_EXECUTED');
    expect(functional.stdout).toContain('FUNCTIONAL_TEST_EXECUTED');
    expect(functional.stdout).not.toContain('GOVERNANCE_EXECUTED');
    expect(functional.status).toBe(23);
  });

  test('successful functional lane includes package smoke without governance', () => {
    const result = runLane('functional', 19, 0);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('FUNCTIONAL_TEST_EXECUTED');
    expect(result.stdout).toContain('[ci] package dry-run');
    expect(result.stdout).not.toContain('GOVERNANCE_EXECUTED');
  });

  test('invalid lane fails before installing or checking anything', () => {
    const result = runLane('typo', 0, 0);
    expect(result.status).toBe(2);
    expect(result.stdout).not.toContain('[ci] install');
  });

  test('workflow schedules both lanes without dependencies and aggregates every job', () => {
    const { jobs } = workflow;
    expect(jobs.governance).toBeDefined();
    for (const id of ['governance', 'test']) {
      expect(jobs[id].needs).toBeUndefined();
      expect(jobs[id].if).toBeUndefined();
      expect(jobs[id]['continue-on-error']).toBeUndefined();
      const lane = id === 'test' ? 'functional' : 'governance';
      expect(jobs[id].steps.some((step: any) => step.run === `bash scripts/check-ci.sh ${lane}`)).toBe(true);
    }
    expect(jobs.required.name).toBe('Required / CI');
    expect(jobs.required.if).toBe('always()');
    expect([...jobs.required.needs].sort()).toEqual(Object.keys(jobs).filter(id => id !== 'required').sort());
  });

  test('actual aggregate shell accepts only success for every required dependency', () => {
    const required = workflow.jobs.required;
    const statuses = ['success', 'failure', 'cancelled', 'skipped'];
    expect(required.needs).toContain('governance');
    for (const governance of statuses) for (const functional of statuses) for (const matrix of statuses) {
      const results: Record<string, string> = { governance, test: functional, 'mcp-path-matrix': matrix };
      const command = required.steps[0].run.replace(/\$\{\{\s*needs\.([\w-]+)\.result\s*\}\}/g,
        (_match: string, id: string) => results[id]);
      const result = spawnSync('/bin/bash', ['-c', command], { encoding: 'utf8' });
      expect(result.status === 0).toBe(Object.values(results).every(value => value === 'success'));
    }
  });
});
