import { afterEach, describe, expect, test } from 'bun:test';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { projectionResultReceiptDigest, type ArchitectureProjectionPolicy, type ProjectionRequestV1, type ProjectionResultV1 } from '../src/core/architecture/projection';
import { runMutationObserved, readPendingPostEditEvents } from '../src/cli/hook/mutation-observed';
import { drainArchitectureProjectionJobs } from '../src/effects/architecture/projection-orchestrator';
import {
  claimNextArchitectureProjectionJob,
  enqueueArchitectureProjectionJob,
  readArchitectureProjectionReceipt,
  recoverAbandonedArchitectureProjectionJobs,
} from '../src/effects/architecture/projection-jobs';
import type { ArchctxProcessResult, RunArchctxProcess } from '../src/effects/architecture/archctx-provider';

/**
 * A projection attempt whose repo-harness owner died (host kill or provider
 * timeout) can still have committed its ChangeSet inside the archctx daemon:
 * the durable evidence for job-ca58d5a7da32ca18d1e23f15 is an archctx journal
 * entry committed at 09:29:58.858Z that wrote
 * docs/architecture/.projection-manifest.json, against a repo-harness receipt
 * for the same jobId that records attempt 2, status noop, files [].
 *
 * Invariant under test: a durable receipt must declare every
 * projection-owned write made under its own jobId. The retry's fixed-point
 * `noop` may not erase the previous attempt's committed write.
 */
const MANIFEST_PATH = 'docs/architecture/.projection-manifest.json';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const digest = (token: string) => `sha256:${token.repeat(64).slice(0, 64)}` as const;
const policy: ArchitectureProjectionPolicy = { provider: 'archctx', applyMode: 'automatic', failureGate: 'advisory', requiredVersion: '0.5.8', timeoutMs: 120_000 };

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'repo-harness-late-write-'));
  roots.push(root);
  const repoRoot = join(root, 'repo');
  const consumerRoot = join(root, 'consumer');
  mkdirSync(join(repoRoot, '.ai/harness'), { recursive: true });
  mkdirSync(join(repoRoot, '.archcontext/model/nodes'), { recursive: true });
  mkdirSync(join(repoRoot, 'src'), { recursive: true });
  mkdirSync(join(consumerRoot, 'node_modules/archctx/bin'), { recursive: true });
  writeFileSync(join(repoRoot, '.ai/harness/policy.json'), `${JSON.stringify({ architecture: { projection_provider: 'archctx', projection_apply: 'automatic', projection_version: '0.5.8', projection_timeout_ms: 120000 } })}\n`);
  writeFileSync(join(repoRoot, '.archcontext/model/nodes/root.yaml'), `schemaVersion: archcontext.node/v2
kind: capability
id: capability.test.root
name: Root
summary: Root capability.
responsibilities:
  - Own runtime tests.
status: active
source:
  include:
    - src/**
extensions:
  lspProfile: ts
  verification: []
  contractFiles:
    agents: AGENTS.md
    claude: CLAUDE.md
`);
  writeFileSync(join(repoRoot, 'src/index.ts'), 'export const value = 1;\n');
  writeFileSync(join(repoRoot, 'AGENTS.md'), '# agents\n');
  writeFileSync(join(repoRoot, 'CLAUDE.md'), '# claude\n');
  writeFileSync(join(consumerRoot, 'node_modules/archctx/package.json'), `${JSON.stringify({ name: 'archctx', version: '0.5.8', engines: { node: '>=22.22 <26' }, bin: { archctx: './bin/archctx' } })}\n`);
  writeFileSync(join(consumerRoot, 'node_modules/archctx/bin/archctx'), '#!/bin/sh\nexit 1\n');
  chmodSync(join(consumerRoot, 'node_modules/archctx/bin/archctx'), 0o755);
  execFileSync('git', ['init'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'late-write@example.com'], { cwd: repoRoot });
  execFileSync('git', ['config', 'user.name', 'LateWrite'], { cwd: repoRoot });
  execFileSync('git', ['add', '.'], { cwd: repoRoot });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: repoRoot, stdio: 'ignore' });
  const collector = { getRepoRoot: () => repoRoot, getWorktreeOwnership: () => ({ current: repoRoot, owner: null, ownedByCurrent: false }), getActivePlanMarker: () => null };
  return { repoRoot, consumerRoot, collector };
}

function capabilities(): ArchctxProcessResult {
  return { status: 0, signal: null, stderr: '', stdout: JSON.stringify({
    schemaVersion: 'archcontext.capabilities/v1',
    package: { name: 'archctx', version: '0.5.8' },
    protocols: { projectionRequest: 'archcontext.projection-request/v1', projectionResult: 'archcontext.projection-result/v2', architectureRefreshSignal: 'archcontext.architecture-refresh-signal/v1' },
    renderers: { architectureDocs: 'archcontext.docs-renderer/v4', agentContext: 'archcontext.agent-context-renderer/v1' },
    features: ['architecture-docs-renderer-v2', 'architecture-refresh-signal-v1', 'projection-apply-receipt-v1', 'projection-protocol-v2'],
  }) };
}

/** Fixed-point retry answer: the write already landed, so archctx reports noop with no files. */
function noopEnvelope(request: ProjectionRequestV1) {
  const snapshot = {
    ...request.expected,
    baseHeadSha: request.expected.headSha,
    sourceTreeDigest: digest('1'), modelDigest: digest('2'), codeGraphDigest: digest('3'), indexedWorktreeDigest: digest('4'), projectionInputDigest: digest('5'),
    rendererVersion: 'archcontext.docs-renderer/v4' as const,
    layoutVersion: 'archcontext.docs-layout/v1' as const,
    generatedFrom: { codeGraphPackage: '@colbymchenry/codegraph' as const, codeGraphVersion: '1.5.0' as const, codeGraphBinaryDigest: digest('6'), codeGraphStatus: 'ready' as const },
  };
  const body: Omit<ProjectionResultV1, 'receiptDigest'> = {
    schemaVersion: 'archcontext.projection-result/v2' as const,
    requestId: request.requestId,
    status: 'noop' as const,
    inputSnapshot: snapshot,
    outputSnapshot: snapshot,
    affectedNodeIds: [], files: [], humanActions: [], refreshSignals: [],
  };
  return { schemaVersion: 'archcontext.envelope/v1', ok: true, requestId: 'projection.run', data: { ...body, receiptDigest: projectionResultReceiptDigest(body) } };
}

/** Simulates the archctx daemon committing its ChangeSet after the CLI child was killed. */
function commitManifestOutOfBand(repoRoot: string, marker: string): void {
  mkdirSync(join(repoRoot, 'docs/architecture'), { recursive: true });
  writeFileSync(join(repoRoot, MANIFEST_PATH), `${JSON.stringify({ schemaVersion: 'archcontext.projection-manifest/v1', writtenBy: marker }, null, 2)}\n`);
}

function drain(repoRoot: string, options: Parameters<typeof drainArchitectureProjectionJobs>[1]) {
  return drainArchitectureProjectionJobs(repoRoot, { ...options, sourceEvents: readPendingPostEditEvents(repoRoot) });
}

describe('architecture projection receipt declares late provider writes', () => {
  test('records the attempt-1 manifest write when the retry answers noop', () => {
    const f = fixture();
    const root = realpathSync(f.repoRoot);
    runMutationObserved({ collector: f.collector, input: JSON.stringify({ file_path: 'src/late-write.ts', session_id: 'late-write' }) });
    let projectionCalls = 0;
    const run: RunArchctxProcess = (_binary, args) => {
      if (args[0] === 'capabilities') return capabilities();
      projectionCalls += 1;
      const request = JSON.parse(args[3]!) as ProjectionRequestV1;
      if (projectionCalls === 1) {
        // The provider CLI is killed at the timeout, but its daemon already committed the ChangeSet.
        commitManifestOutOfBand(root, request.requestId);
        return { status: null, signal: 'SIGTERM', stdout: '', stderr: 'terminated' };
      }
      return { status: 0, signal: null, stderr: '', stdout: JSON.stringify(noopEnvelope(request)) };
    };
    const options = { consumerRoot: f.consumerRoot, policy, run };

    const first = drain(root, options);
    expect(first.status).toBe('retry-pending');
    expect(first.error).toContain('signal SIGTERM');
    expect(existsSync(join(root, MANIFEST_PATH))).toBe(true);
    expect(first.queue.receipts).toBe(0);

    const second = drain(root, options);
    expect(second).toMatchObject({ status: 'succeeded', resultStatus: 'noop', acknowledgeSourceEvents: true });
    expect(projectionCalls).toBe(2);

    const receipt = readArchitectureProjectionReceipt(root, second.jobId!);
    expect(receipt).not.toBeNull();
    expect(receipt!.attempt).toBe(2);
    // The manifest written under this jobId must appear in the durable receipt.
    expect(receipt!.result.files.map((file) => file.path)).toContain(MANIFEST_PATH);
  });

  test('records the manifest write when recovery reclaims the abandoned attempt', () => {
    const f = fixture();
    const root = realpathSync(f.repoRoot);
    runMutationObserved({ collector: f.collector, input: JSON.stringify({ file_path: 'src/reclaimed-write.ts', session_id: 'reclaimed-write' }) });
    const [source] = readPendingPostEditEvents(root);
    const claimedAt = new Date('2026-09-09T09:28:49.000Z');
    const queued = enqueueArchitectureProjectionJob(root, [source!.event_id], [source!.source_key], source!.changed_paths, claimedAt);
    const running = claimNextArchitectureProjectionJob(root, policy.timeoutMs, claimedAt);
    expect(running?.jobId).toBe(queued!.jobId);
    expect(running?.attempt).toBe(1);

    // The owner process died; the orphaned archctx daemon committed the ChangeSet anyway.
    commitManifestOutOfBand(root, `repo-harness.projection.${running!.jobId}`);
    expect(recoverAbandonedArchitectureProjectionJobs(root, policy.timeoutMs, new Date('2026-09-09T09:31:20.000Z'))).toBe(1);

    let projectionCalls = 0;
    const run: RunArchctxProcess = (_binary, args) => {
      if (args[0] === 'capabilities') return capabilities();
      projectionCalls += 1;
      const request = JSON.parse(args[3]!) as ProjectionRequestV1;
      return { status: 0, signal: null, stderr: '', stdout: JSON.stringify(noopEnvelope(request)) };
    };
    const drained = drain(root, { consumerRoot: f.consumerRoot, policy, run });
    expect(drained).toMatchObject({ status: 'succeeded', resultStatus: 'noop' });
    expect(projectionCalls).toBe(1);

    const receipt = readArchitectureProjectionReceipt(root, drained.jobId!);
    expect(receipt!.attempt).toBe(2);
    expect(receipt!.result.files.map((file) => file.path)).toContain(MANIFEST_PATH);
    expect(readdirSync(join(root, '.ai/harness/architecture-projection/receipts'))).toHaveLength(1);
  });
});
