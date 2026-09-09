import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { withExclusiveDirectoryLock } from '../locking/exclusive-directory-lock';
import { projectionDeclaredWrites, sameAcceptedArchitectureChange, type ProjectionDeclaredWriteV1, type ProjectionResultV1 } from '../../core/architecture/projection';
import type { AcceptedArchitectureChangeReferenceV1 } from 'archctx-contracts';

export const ARCHITECTURE_PROJECTION_RUNTIME_ROOT = '.ai/harness/architecture-projection';
const LOCK_PATH = `${ARCHITECTURE_PROJECTION_RUNTIME_ROOT}/locks/store`;
const MAX_ATTEMPTS = 3;
/** Reclaim margin past the provider bound. A dead Stop owner cannot be
 * reclaimed while its orphaned provider may still be running, so the stale
 * window derives from the same resolved policy timeout the provider runs
 * under rather than a second constant. */
const RUNNING_STALE_MARGIN_MS = 30_000;

export function architectureProjectionRunningStaleMs(projectionTimeoutMs: number): number {
  return projectionTimeoutMs + RUNNING_STALE_MARGIN_MS;
}

/** Recorded on the reclaimed record so a claim shape that predates the
 * persisted attempt budget is visible instead of silently accepted. */
export const LEGACY_ATTEMPT_BUDGET_NOTE = 'claim without a persisted attempt budget; stale window derived from the current policy timeout';

/** The claim this process holds was reclaimed or replaced, so it may neither
 * publish a receipt nor drive the record's failure transition. */
export class ArchitectureProjectionOwnershipError extends Error {
  constructor(readonly jobId: string, message: string) {
    super(message);
    this.name = 'ArchitectureProjectionOwnershipError';
  }
}

export type ProjectionJobFailureKind = 'preflight' | 'reconciliation' | 'host-budget' | 'process' | 'timeout' | 'stale-snapshot' | 'invalid-result' | 'refresh' | 'permanent' | 'lost-ownership';

export interface ArchitectureProjectionJobV1 {
  schemaVersion: 'repo-harness.architecture-projection-job/v1';
  jobId: string;
  status: 'pending' | 'running';
  sourceEventIds: string[];
  sourceKeys: string[];
  changedPaths: string[];
  acceptedChange?: AcceptedArchitectureChangeReferenceV1;
  attempt: number;
  createdAt: string;
  updatedAt: string;
  ownerPid?: number;
  /** Budget resolved from the policy timeout at claim time. Recovery compares
   * against this persisted deadline so a later policy edit cannot shorten a
   * live attempt's lease. Absent on a legacy record and on a claim taken while
   * the policy could not be resolved. */
  attemptTimeoutMs?: number;
  attemptDeadlineAt?: string;
  lastFailure?: { kind: ProjectionJobFailureKind; message: string; at: string };
}

export interface ArchitectureProjectionReceiptV1 {
  schemaVersion: 'repo-harness.architecture-projection-receipt/v1';
  jobId: string;
  sourceEventIds: string[];
  sourceKeys: string[];
  changedPaths: string[];
  acceptedChange?: AcceptedArchitectureChangeReferenceV1;
  attempt: number;
  completedAt: string;
  /** The provider's verbatim answer for the attempt that closed this job. */
  result: ProjectionResultV1;
  /**
   * Every projection-owned write committed under this jobId, including a write an earlier
   * attempt committed before losing its owner. Consumers that gate on "the projection
   * wrote nothing" read this, never `result.files`: a retry that reaches the provider's
   * fixed point reports `noop` with no files even when the job did write.
   */
  declaredWrites: ProjectionDeclaredWriteV1[];
  refreshReceiptDigests: string[];
}

export interface ArchitectureProjectionDeadLetterV1 {
  schemaVersion: 'repo-harness.architecture-projection-dead-letter/v1';
  job: ArchitectureProjectionJobV1;
  failedAt: string;
  failure: { kind: ProjectionJobFailureKind; message: string };
}

export interface ArchitectureProjectionQueueStateV1 {
  schemaVersion: 'repo-harness.architecture-projection-queue-state/v1';
  pending: number;
  running: number;
  receipts: number;
  deadLetters: number;
  oldestPendingJobId: string | null;
  oldestDeadLetterJobId: string | null;
}

function directory(kind: 'pending' | 'running' | 'receipts' | 'dead-letter'): string {
  return `${ARCHITECTURE_PROJECTION_RUNTIME_ROOT}/${kind}`;
}

function pathFor(repoRoot: string, kind: 'pending' | 'running' | 'receipts' | 'dead-letter', jobId: string): string {
  return join(repoRoot, directory(kind), `${jobId}.json`);
}

function atomicJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  renameSync(temp, path);
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function names(repoRoot: string, kind: 'pending' | 'running' | 'receipts' | 'dead-letter'): string[] {
  try { return readdirSync(join(repoRoot, directory(kind))).filter((name) => name.endsWith('.json')).sort(); }
  catch { return []; }
}

function jobsByCreatedAt(repoRoot: string, kind: 'pending' | 'running'): ArchitectureProjectionJobV1[] {
  return names(repoRoot, kind)
    .map((name) => readJson<ArchitectureProjectionJobV1>(join(repoRoot, directory(kind), name)))
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.jobId.localeCompare(right.jobId));
}

function deadLettersByFailedAt(repoRoot: string): ArchitectureProjectionDeadLetterV1[] {
  return names(repoRoot, 'dead-letter')
    .map((name) => readJson<ArchitectureProjectionDeadLetterV1>(join(repoRoot, directory('dead-letter'), name)))
    .sort((left, right) => left.failedAt.localeCompare(right.failedAt) || left.job.jobId.localeCompare(right.job.jobId));
}

function normalizedIdentity(sourceEventIds: readonly string[], changedPaths: readonly string[]): { events: string[]; paths: string[] } {
  return {
    events: [...new Set(sourceEventIds)].sort(),
    paths: [...new Set(changedPaths)].sort(),
  };
}

export function architectureProjectionJobId(sourceEventIds: readonly string[], changedPaths: readonly string[], acceptedChange?: AcceptedArchitectureChangeReferenceV1): string {
  const { events, paths } = normalizedIdentity(sourceEventIds, changedPaths);
  const digest = createHash('sha256').update(JSON.stringify({ sourceEventIds: events, changedPaths: paths, ...(acceptedChange ? { acceptedChange } : {}) })).digest('hex');
  return `job-${digest.slice(0, 24)}`;
}

export function architectureProjectionJobState(
  repoRoot: string,
  jobId: string,
): 'missing' | 'pending' | 'running' | 'receipt' | 'dead-letter' {
  const root = realpathSync(repoRoot);
  return withExclusiveDirectoryLock(root, LOCK_PATH, () => {
    for (const [kind, state] of [
      ['pending', 'pending'], ['receipts', 'receipt'], ['running', 'running'], ['dead-letter', 'dead-letter'],
    ] as const) if (existsSync(pathFor(root, kind, jobId))) return state;
    return 'missing';
  });
}

export function readArchitectureProjectionReceipt(
  repoRoot: string,
  jobId: string,
): ArchitectureProjectionReceiptV1 | null {
  if (!/^job-[a-f0-9]{24}$/.test(jobId)) return null;
  const root = realpathSync(repoRoot);
  return withExclusiveDirectoryLock(root, LOCK_PATH, () => {
    const path = pathFor(root, 'receipts', jobId);
    return existsSync(path) ? readJson<ArchitectureProjectionReceiptV1>(path) : null;
  });
}

/** Newest durable receipt by completion time; the manual publication entry's provider authority. */
export function latestArchitectureProjectionReceipt(repoRoot: string): ArchitectureProjectionReceiptV1 | null {
  const root = realpathSync(repoRoot);
  return withExclusiveDirectoryLock(root, LOCK_PATH, () =>
    names(root, 'receipts')
      .map((name) => readJson<ArchitectureProjectionReceiptV1>(join(root, directory('receipts'), name)))
      .sort((left, right) => left.completedAt.localeCompare(right.completedAt) || left.jobId.localeCompare(right.jobId))
      .at(-1) ?? null,
  );
}

export function architectureProjectionDeadLetterForSourceKeys(
  repoRoot: string,
  sourceKeys: readonly string[],
): ArchitectureProjectionDeadLetterV1 | null {
  const requested = new Set(sourceKeys);
  if (requested.size === 0) return null;
  const root = realpathSync(repoRoot);
  return withExclusiveDirectoryLock(root, LOCK_PATH, () =>
    deadLettersByFailedAt(root).find((entry) => entry.job.sourceKeys.some((sourceKey) => requested.has(sourceKey))) ?? null,
  );
}

export function enqueueArchitectureProjectionJob(
  repoRoot: string,
  sourceEventIds: readonly string[],
  sourceKeys: readonly string[],
  changedPaths: readonly string[],
  now = new Date(),
  acceptedChange?: AcceptedArchitectureChangeReferenceV1,
): ArchitectureProjectionJobV1 | null {
  if (sourceEventIds.length !== sourceKeys.length) {
    throw new Error('architecture projection source event ids and keys must have equal length');
  }
  const deliveryBySource = new Map<string, string>();
  for (let index = 0; index < sourceKeys.length; index += 1) {
    const key = sourceKeys[index]!;
    const eventId = sourceEventIds[index]!;
    const prior = deliveryBySource.get(key);
    if (prior && prior !== eventId) throw new Error(`architecture projection source key has multiple delivery ids: ${key}`);
    deliveryBySource.set(key, eventId);
  }
  const { events, paths } = normalizedIdentity(sourceEventIds, changedPaths);
  const keys = [...new Set(sourceKeys)].sort();
  if (events.length === 0 || keys.length === 0 || paths.length === 0) return null;
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    if (names(repoRoot, 'running').length > 0) return null;
    const existing = jobsByCreatedAt(repoRoot, 'pending')[0];
    if (existing) {
      if (JSON.stringify(existing.acceptedChange ?? null) !== JSON.stringify(acceptedChange ?? null)) {
        throw new Error('architecture projection pending job accepted change mismatch');
      }
      const currentDeliveries = existing.sourceKeys.map((key) => deliveryBySource.get(key));
      if (currentDeliveries.every((eventId): eventId is string => eventId !== undefined)) {
        const refreshedIds = [...new Set(currentDeliveries)].sort();
        if (JSON.stringify(refreshedIds) !== JSON.stringify(existing.sourceEventIds)) {
          const refreshed = { ...existing, sourceEventIds: refreshedIds, updatedAt: now.toISOString() };
          atomicJson(pathFor(repoRoot, 'pending', existing.jobId), refreshed);
          return refreshed;
        }
      }
      return existing;
    }
    const id = architectureProjectionJobId(events, paths, acceptedChange);
    for (const kind of ['running', 'receipts', 'dead-letter'] as const) {
      const path = pathFor(repoRoot, kind, id);
      if (existsSync(path)) return kind === 'running' ? readJson<ArchitectureProjectionJobV1>(path) : null;
    }
    const timestamp = now.toISOString();
    const job: ArchitectureProjectionJobV1 = {
      schemaVersion: 'repo-harness.architecture-projection-job/v1',
      jobId: id,
      status: 'pending',
      sourceEventIds: events,
      sourceKeys: keys,
      changedPaths: paths,
      ...(acceptedChange ? { acceptedChange } : {}),
      attempt: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    atomicJson(pathFor(repoRoot, 'pending', id), job);
    return job;
  });
}

/** Reclaim time of a running claim. The persisted attempt deadline is the
 * authority; only a record written before that field existed falls back to the
 * current policy timeout, and that fallback is recorded on the reclaimed job. */
function attemptReclaim(job: ArchitectureProjectionJobV1, projectionTimeoutMs: number): { atMs: number; legacy: boolean } {
  const deadlineMs = job.attemptDeadlineAt === undefined ? Number.NaN : Date.parse(job.attemptDeadlineAt);
  if (Number.isFinite(deadlineMs)) return { atMs: deadlineMs + RUNNING_STALE_MARGIN_MS, legacy: false };
  const updatedAtMs = Date.parse(job.updatedAt);
  if (!Number.isFinite(updatedAtMs)) return { atMs: Number.NEGATIVE_INFINITY, legacy: true };
  return { atMs: updatedAtMs + architectureProjectionRunningStaleMs(projectionTimeoutMs), legacy: true };
}

export function recoverAbandonedArchitectureProjectionJobs(repoRoot: string, projectionTimeoutMs: number, now = new Date()): number {
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    let recovered = 0;
    for (const name of names(repoRoot, 'running')) {
      const runningPath = join(repoRoot, directory('running'), name);
      const job = readJson<ArchitectureProjectionJobV1>(runningPath);
      if (existsSync(pathFor(repoRoot, 'receipts', job.jobId))) {
        unlinkSync(runningPath);
        recovered += 1;
        continue;
      }
      const reclaim = attemptReclaim(job, projectionTimeoutMs);
      if (now.getTime() < reclaim.atMs) continue;
      const message = `running job was abandoned after attempt ${job.attempt}${reclaim.legacy ? ` (${LEGACY_ATTEMPT_BUDGET_NOTE})` : ''}`;
      const released = { ...job, ownerPid: undefined, attemptTimeoutMs: undefined, attemptDeadlineAt: undefined };
      if (job.attempt >= MAX_ATTEMPTS) {
        const failure = { kind: 'timeout' as const, message };
        atomicJson(pathFor(repoRoot, 'dead-letter', job.jobId), {
          schemaVersion: 'repo-harness.architecture-projection-dead-letter/v1',
          job: { ...released, status: 'pending', updatedAt: now.toISOString(), lastFailure: { ...failure, at: now.toISOString() } },
          failedAt: now.toISOString(),
          failure,
        } satisfies ArchitectureProjectionDeadLetterV1);
        unlinkSync(runningPath);
        recovered += 1;
        continue;
      }
      const pending = {
        ...released,
        status: 'pending' as const,
        updatedAt: now.toISOString(),
        lastFailure: { kind: 'timeout' as const, message, at: now.toISOString() },
      };
      atomicJson(pathFor(repoRoot, 'pending', job.jobId), pending);
      unlinkSync(runningPath);
      recovered += 1;
    }
    return recovered;
  });
}

/**
 * `attemptTimeoutMs` is the resolved policy timeout this attempt runs under; it
 * is persisted as the attempt's own deadline so recovery never re-derives the
 * lease from a policy value edited after the claim. `null` means the policy was
 * not resolvable for this claim (preflight failure), which persists no budget
 * and leaves the record on the legacy recovery fallback.
 */
export function claimNextArchitectureProjectionJob(
  repoRoot: string,
  attemptTimeoutMs: number | null,
  now = new Date(),
): ArchitectureProjectionJobV1 | null {
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    if (names(repoRoot, 'running').length > 0) return null;
    const pending = jobsByCreatedAt(repoRoot, 'pending')[0];
    if (!pending) return null;
    const pendingPath = pathFor(repoRoot, 'pending', pending.jobId);
    const budget = attemptTimeoutMs !== null && Number.isFinite(attemptTimeoutMs)
      ? { attemptTimeoutMs, attemptDeadlineAt: new Date(now.getTime() + attemptTimeoutMs).toISOString() }
      : { attemptTimeoutMs: undefined, attemptDeadlineAt: undefined };
    const running: ArchitectureProjectionJobV1 = {
      ...pending,
      status: 'running',
      attempt: pending.attempt + 1,
      ownerPid: process.pid,
      updatedAt: now.toISOString(),
      ...budget,
    };
    atomicJson(pathFor(repoRoot, 'running', running.jobId), running);
    unlinkSync(pendingPath);
    return running;
  });
}

export function retryArchitectureProjectionDeadLetter(
  repoRoot: string,
  jobId: string,
  now = new Date(),
): ArchitectureProjectionJobV1 {
  if (!/^job-[a-f0-9]{24}$/.test(jobId)) throw new Error('architecture projection job id is invalid');
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    if (names(repoRoot, 'running').length > 0 || names(repoRoot, 'pending').length > 0) {
      throw new Error('architecture projection retry requires an empty pending/running queue');
    }
    const deadLetterPath = pathFor(repoRoot, 'dead-letter', jobId);
    if (!existsSync(deadLetterPath)) throw new Error(`architecture projection dead letter is missing: ${jobId}`);
    const deadLetter = readJson<ArchitectureProjectionDeadLetterV1>(deadLetterPath);
    const pending: ArchitectureProjectionJobV1 = {
      ...deadLetter.job,
      status: 'pending',
      attempt: 0,
      ownerPid: undefined,
      attemptTimeoutMs: undefined,
      attemptDeadlineAt: undefined,
      updatedAt: now.toISOString(),
      lastFailure: undefined,
    };
    atomicJson(pathFor(repoRoot, 'pending', jobId), pending);
    unlinkSync(deadLetterPath);
    return pending;
  });
}

export function completeArchitectureProjectionJob(
  repoRoot: string,
  job: ArchitectureProjectionJobV1,
  result: ProjectionResultV1,
  refreshReceiptDigests: readonly string[],
  now = new Date(),
): ArchitectureProjectionReceiptV1 {
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    const runningPath = pathFor(repoRoot, 'running', job.jobId);
    if (!existsSync(runningPath)) throw new ArchitectureProjectionOwnershipError(job.jobId, `architecture projection running job is missing: ${job.jobId}`);
    assertClaimOwner(readJson<ArchitectureProjectionJobV1>(runningPath), job);
    const receipt: ArchitectureProjectionReceiptV1 = {
      schemaVersion: 'repo-harness.architecture-projection-receipt/v1',
      jobId: job.jobId,
      sourceEventIds: job.sourceEventIds,
      sourceKeys: job.sourceKeys,
      changedPaths: job.changedPaths,
      ...(job.acceptedChange ? { acceptedChange: job.acceptedChange } : {}),
      attempt: job.attempt,
      completedAt: now.toISOString(),
      result,
      declaredWrites: projectionDeclaredWrites(result, job.attempt),
      refreshReceiptDigests: [...new Set(refreshReceiptDigests)].sort(),
    };
    atomicJson(pathFor(repoRoot, 'receipts', job.jobId), receipt);
    unlinkSync(runningPath);
    return receipt;
  });
}

export function completeArchitectureProjectionDeadLetterAcceptance(
  repoRoot: string,
  jobId: string,
  expectedChangedPaths: readonly string[],
  acceptedChange: AcceptedArchitectureChangeReferenceV1,
  result: ProjectionResultV1,
  refreshReceiptDigests: readonly string[],
  now = new Date(),
): ArchitectureProjectionReceiptV1 {
  if (!/^job-[a-f0-9]{24}$/.test(jobId)) throw new Error('architecture projection acceptance job id is invalid');
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    const receiptPath = pathFor(repoRoot, 'receipts', jobId);
    if (existsSync(receiptPath)) {
      const existing = readJson<ArchitectureProjectionReceiptV1>(receiptPath);
      if (!existing.acceptedChange || !sameAcceptedArchitectureChange(existing.acceptedChange, acceptedChange)
        || existing.changedPaths.join('\0') !== expectedChangedPaths.join('\0')
        || existing.result.receiptDigest !== result.receiptDigest) {
        throw new Error(`architecture projection acceptance receipt conflicts with completed job: ${jobId}`);
      }
      const residualDeadLetterPath = pathFor(repoRoot, 'dead-letter', jobId);
      if (existsSync(residualDeadLetterPath)) {
        const residual = readJson<ArchitectureProjectionDeadLetterV1>(residualDeadLetterPath);
        if (residual.job.jobId !== jobId
          || residual.job.changedPaths.join('\0') !== expectedChangedPaths.join('\0')) {
          throw new Error(`architecture projection acceptance residual dead letter identity mismatch: ${jobId}`);
        }
        unlinkSync(residualDeadLetterPath);
      }
      return existing;
    }
    const deadLetterPath = pathFor(repoRoot, 'dead-letter', jobId);
    if (!existsSync(deadLetterPath)) throw new Error(`architecture projection acceptance dead letter is missing: ${jobId}`);
    const deadLetter = readJson<ArchitectureProjectionDeadLetterV1>(deadLetterPath);
    if (deadLetter.job.changedPaths.join('\0') !== expectedChangedPaths.join('\0')) {
      throw new Error(`architecture projection acceptance dead letter changed paths mismatch: ${jobId}`);
    }
    const receipt: ArchitectureProjectionReceiptV1 = {
      schemaVersion: 'repo-harness.architecture-projection-receipt/v1',
      jobId,
      sourceEventIds: deadLetter.job.sourceEventIds,
      sourceKeys: deadLetter.job.sourceKeys,
      changedPaths: deadLetter.job.changedPaths,
      acceptedChange,
      attempt: deadLetter.job.attempt,
      completedAt: now.toISOString(),
      result,
      declaredWrites: projectionDeclaredWrites(result, deadLetter.job.attempt),
      refreshReceiptDigests: [...new Set(refreshReceiptDigests)].sort(),
    };
    atomicJson(receiptPath, receipt);
    unlinkSync(deadLetterPath);
    return receipt;
  });
}

export function completeArchitectureProjectionDeadLetterReconciliation(
  repoRoot: string,
  jobId: string,
  expectedChangedPaths: readonly string[],
  result: ProjectionResultV1,
  now = new Date(),
): ArchitectureProjectionReceiptV1 {
  if (!/^job-[a-f0-9]{24}$/.test(jobId)) throw new Error('architecture projection reconciliation job id is invalid');
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    const receiptPath = pathFor(repoRoot, 'receipts', jobId);
    if (existsSync(receiptPath)) {
      const existing = readJson<ArchitectureProjectionReceiptV1>(receiptPath);
      if (existing.acceptedChange
        || existing.changedPaths.join('\0') !== expectedChangedPaths.join('\0')
        || existing.result.receiptDigest !== result.receiptDigest) {
        throw new Error(`architecture projection reconciliation receipt conflicts with completed job: ${jobId}`);
      }
      const residualDeadLetterPath = pathFor(repoRoot, 'dead-letter', jobId);
      if (existsSync(residualDeadLetterPath)) {
        const residual = readJson<ArchitectureProjectionDeadLetterV1>(residualDeadLetterPath);
        if (residual.job.jobId !== jobId
          || residual.job.acceptedChange
          || residual.job.changedPaths.join('\0') !== expectedChangedPaths.join('\0')) {
          throw new Error(`architecture projection reconciliation residual dead letter identity mismatch: ${jobId}`);
        }
        unlinkSync(residualDeadLetterPath);
      }
      return existing;
    }
    const deadLetterPath = pathFor(repoRoot, 'dead-letter', jobId);
    if (!existsSync(deadLetterPath)) throw new Error(`architecture projection reconciliation dead letter is missing: ${jobId}`);
    const deadLetter = readJson<ArchitectureProjectionDeadLetterV1>(deadLetterPath);
    if (deadLetter.job.acceptedChange
      || deadLetter.job.changedPaths.join('\0') !== expectedChangedPaths.join('\0')) {
      throw new Error(`architecture projection reconciliation dead letter identity mismatch: ${jobId}`);
    }
    const receipt: ArchitectureProjectionReceiptV1 = {
      schemaVersion: 'repo-harness.architecture-projection-receipt/v1',
      jobId,
      sourceEventIds: deadLetter.job.sourceEventIds,
      sourceKeys: deadLetter.job.sourceKeys,
      changedPaths: deadLetter.job.changedPaths,
      attempt: deadLetter.job.attempt,
      completedAt: now.toISOString(),
      result,
      declaredWrites: projectionDeclaredWrites(result, deadLetter.job.attempt),
      refreshReceiptDigests: [],
    };
    atomicJson(receiptPath, receipt);
    unlinkSync(deadLetterPath);
    return receipt;
  });
}

export function failArchitectureProjectionJob(
  repoRoot: string,
  job: ArchitectureProjectionJobV1,
  failure: { kind: ProjectionJobFailureKind; message: string },
  now = new Date(),
): { state: 'pending' | 'dead-letter'; job: ArchitectureProjectionJobV1 } {
  return withExclusiveDirectoryLock(repoRoot, LOCK_PATH, () => {
    const runningPath = pathFor(repoRoot, 'running', job.jobId);
    if (!existsSync(runningPath)) throw new ArchitectureProjectionOwnershipError(job.jobId, `architecture projection running job is missing: ${job.jobId}`);
    assertClaimOwner(readJson<ArchitectureProjectionJobV1>(runningPath), job);
    const failed: ArchitectureProjectionJobV1 = {
      ...job,
      status: 'pending',
      attempt: failure.kind === 'preflight' || failure.kind === 'reconciliation' || failure.kind === 'host-budget' ? Math.max(0, job.attempt - 1) : job.attempt,
      ownerPid: undefined,
      attemptTimeoutMs: undefined,
      attemptDeadlineAt: undefined,
      updatedAt: now.toISOString(),
      lastFailure: { ...failure, at: now.toISOString() },
    };
    if (failure.kind !== 'preflight' && failure.kind !== 'reconciliation' && failure.kind !== 'host-budget' && (failure.kind === 'permanent' || failed.attempt >= MAX_ATTEMPTS)) {
      const deadLetter: ArchitectureProjectionDeadLetterV1 = {
        schemaVersion: 'repo-harness.architecture-projection-dead-letter/v1',
        job: failed,
        failedAt: now.toISOString(),
        failure,
      };
      atomicJson(pathFor(repoRoot, 'dead-letter', job.jobId), deadLetter);
      unlinkSync(runningPath);
      return { state: 'dead-letter', job: failed };
    }
    atomicJson(pathFor(repoRoot, 'pending', job.jobId), failed);
    unlinkSync(runningPath);
    return { state: 'pending', job: failed };
  });
}

function assertClaimOwner(persisted: ArchitectureProjectionJobV1, claimed: ArchitectureProjectionJobV1): void {
  if (
    persisted.status !== 'running'
    || persisted.jobId !== claimed.jobId
    || persisted.attempt !== claimed.attempt
    || persisted.ownerPid !== claimed.ownerPid
  ) {
    throw new ArchitectureProjectionOwnershipError(
      claimed.jobId,
      `architecture projection running claim no longer belongs to this process: ${claimed.jobId}`,
    );
  }
}

export function architectureProjectionQueueState(repoRoot: string): ArchitectureProjectionQueueStateV1 {
  const root = realpathSync(repoRoot);
  return withExclusiveDirectoryLock(root, LOCK_PATH, () => {
    const pending = jobsByCreatedAt(root, 'pending');
    const deadLetters = deadLettersByFailedAt(root);
    return {
      schemaVersion: 'repo-harness.architecture-projection-queue-state/v1',
      pending: pending.length,
      running: names(root, 'running').length,
      receipts: names(root, 'receipts').length,
      deadLetters: deadLetters.length,
      oldestPendingJobId: pending[0]?.jobId ?? null,
      oldestDeadLetterJobId: deadLetters[0]?.job.jobId ?? null,
    };
  });
}
