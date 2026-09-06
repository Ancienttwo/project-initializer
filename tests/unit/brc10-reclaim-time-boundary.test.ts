import { describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { buildLeaseOwnerRecord } from '../../src/core/state/coordination-identity';
import { buildLeaseLivenessPolicy } from '../../src/core/state/lease-liveness';
import { createLeaseDirectory, readLease, writeLeaseOwnerDurably } from '../../src/effects/state/coordination-lease-store';
import { renewLeaseLiveness } from '../../src/effects/state/coordination-lease-liveness-store';
import { automaticReclaimLease, observeLeaseReclaimEligibility } from '../../src/effects/state/coordination-lease-reclaim';
const task = 'a'.repeat(64);
const evidence = { controller_terminal: true, runtime_effect_inactive: true, publication_inactive: true, binding_generation_matches: true, claim_actor_matches: true, evidence_revision: `sha256:${'c'.repeat(64)}` } as const;
const policy = buildLeaseLivenessPolicy({ renewal_interval_ms: 1000, maximum_ttl_ms: 10000, renewal_actor_kind: 'controller', required_evidence_sources: ['controller', 'runtime_effect', 'publication', 'binding'], unproven_behavior: 'require_attention' });
function setup() {
  const root = mkdtempSync(join(tmpdir(), 'brc10-reclaim-'));
  spawnSync('git', ['init', '-q'], { cwd: root });
  const owner = buildLeaseOwnerRecord({ claimId: 'old', taskId: task, taskRevision: 'b'.repeat(64), sprintPath: 'plans/sprints/task.md', targetRef: 'main', generation: 1, sessionId: 'old-session', sourceWorktree: '/old' });
  createLeaseDirectory(root, task); writeLeaseOwnerDurably(root, task, owner);
  renewLeaseLiveness({ repo_root: root, owner, policy, owner_id: 'controller', observed_at: '2026-09-07T00:00:00.000Z', requested_ttl_ms: 1000, binding_generation: 1, runtime_effect_id: null, expected_current_sha256: null });
  const receipt = observeLeaseReclaimEligibility({ repo_root: root, task_id: task, evidence, publication_state: 'inactive', now: () => new Date('2026-09-07T00:00:02.000Z') });
  return { root, receipt };
}
function input(root: string, receipt: ReturnType<typeof setup>['receipt']) {
  return { repo_root: root, receipt, session_id: 'new-session', source_worktree: '/new', reason: 'terminal-execution', observe_evidence: () => ({ evidence, publication_state: 'inactive' as const }), now: () => new Date('2026-09-07T00:00:03.000Z'), new_claim_id: () => 'new' };
}
describe('BRC10 reclaim receipt time boundary', () => {
  test('consumes unchanged evidence at a later clock without weakening generation replay', () => {
    const { root, receipt } = setup();
    try {
      const next = automaticReclaimLease(input(root, receipt));
      expect(next.generation).toBe(2);
      expect(readLease(root, task).record?.claim_id).toBe('new');
      expect(() => automaticReclaimLease(input(root, receipt))).toThrow();
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  test('refuses changed evidence values even when an observer repeats the revision digest', () => {
    const { root, receipt } = setup();
    try {
      expect(() => automaticReclaimLease({ ...input(root, receipt), observe_evidence: () => ({ evidence: { ...evidence, runtime_effect_inactive: false }, publication_state: 'inactive' }) })).toThrow();
      expect(readLease(root, task).record?.claim_id).toBe('old');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  test('rejects forged receipt timestamps, publication recovery and clock regression', () => {
    const { root, receipt } = setup();
    try {
      expect(() => automaticReclaimLease(input(root, { ...receipt, classified_at: '2026-09-07T00:00:01.000Z' }))).toThrow();
      expect(() => automaticReclaimLease({ ...input(root, receipt), observe_evidence: () => ({ evidence, publication_state: 'completing' }) })).toThrow();
      expect(() => automaticReclaimLease({ ...input(root, receipt), now: () => new Date('2026-09-07T00:00:01.500Z') })).toThrow();
      expect(readLease(root, task).record?.claim_id).toBe('old');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
  test('two independent reclaimers consume the same receipt exactly once', async () => {
    const { root, receipt } = setup();
    const effect = fileURLToPath(new URL('../../src/effects/state/coordination-lease-reclaim.ts', import.meta.url));
    const script = `import { existsSync, writeFileSync } from 'fs';
      import { automaticReclaimLease } from ${JSON.stringify(effect)};
      const [root, receiptText, evidenceText, name] = process.argv.slice(1);
      writeFileSync(root + '/' + name + '.ready', 'ready');
      const deadline = Date.now() + 10000;
      while (!existsSync(root + '/go')) { if (Date.now() > deadline) process.exit(3); await Bun.sleep(5); }
      try { automaticReclaimLease({ repo_root: root, receipt: JSON.parse(receiptText), session_id: name,
        source_worktree: '/new-' + name, reason: 'race', new_claim_id: () => name,
        observe_evidence: () => ({ evidence: JSON.parse(evidenceText), publication_state: 'inactive' }),
        now: () => new Date('2026-09-07T00:00:03.000Z') }); process.exit(0); }
      catch { process.exit(2); }`;
    const children = ['one', 'two'].map(name => Bun.spawn([process.execPath, '-e', script, root, JSON.stringify(receipt), JSON.stringify(evidence), name], { stdout: 'pipe', stderr: 'pipe' }));
    try {
      const deadline = Date.now() + 10000;
      while (!['one', 'two'].every(name => existsSync(join(root, name + '.ready')))) {
        if (Date.now() > deadline) throw new Error('reclaimers did not reach barrier');
        await Bun.sleep(5);
      }
      writeFileSync(join(root, 'go'), 'go');
      expect((await Promise.all(children.map(child => child.exited))).sort()).toEqual([0, 2]);
      expect(readLease(root, task).record?.generation).toBe(2);
      expect(['one', 'two']).toContain(readLease(root, task).record?.claim_id);
    } finally { for (const child of children) child.kill(); await Promise.all(children.map(child => child.exited)); rmSync(root, { recursive: true, force: true }); }
  });
  test('after durable owner write, crash replay cannot mint a third generation', () => {
    const { root, receipt } = setup();
    try {
      expect(() => automaticReclaimLease({ ...input(root, receipt), crash_hook: () => { throw new Error('injected after write'); } })).toThrow('injected after write');
      expect(readLease(root, task).record?.generation).toBe(2);
      expect(() => automaticReclaimLease(input(root, receipt))).toThrow();
      expect(readLease(root, task).record?.generation).toBe(2);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
