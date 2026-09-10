/** One observation of a task's bound worktree against its canonical target. */
export interface OperatorTaskDiffRequest {
  readonly repository_id: string;
  readonly task_id: string;
  readonly task_revision: string;
  readonly claim_id: string;
  readonly generation: number;
}

export const TASK_DIFF_MAX_BYTES = 512 * 1024;
export const TASK_DIFF_MAX_UNTRACKED = 1000;
export const TASK_DIFF_FAILURES = ['unavailable', 'filters_unsupported', 'stale', 'too_large', 'busy', 'timeout'] as const;
export type TaskDiffFailure = typeof TASK_DIFF_FAILURES[number];
export interface OperatorTaskDiff extends OperatorTaskDiffRequest {
  readonly protocol: 1;
  readonly kind: 'operator_task_diff';
  readonly target_ref: string;
  readonly branch: string;
  readonly base_sha: string;
  readonly head_sha: string;
  readonly observed_at: string;
  readonly patch: string;
  readonly untracked_paths: readonly string[];
}

export function isTaskDiffRequest(value: unknown): value is OperatorTaskDiffRequest {
  if (!value || typeof value !== 'object') return false;
  const r = value as OperatorTaskDiffRequest;
  return typeof r.repository_id === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(r.repository_id)
    && typeof r.task_id === 'string' && /^[0-9a-f]{64}$/u.test(r.task_id)
    && typeof r.task_revision === 'string' && /^[0-9a-f]{64}$/u.test(r.task_revision)
    && typeof r.claim_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u.test(r.claim_id)
    && Number.isSafeInteger(r.generation) && r.generation > 0;
}

export function decodeOperatorTaskDiff(value: unknown, request: OperatorTaskDiffRequest): OperatorTaskDiff {
  const invalid = (): never => { throw new Error('Invalid task diff response'); };
  if (!isTaskDiffRequest(value)) return invalid();
  const r = value as OperatorTaskDiff;
  if (r.repository_id !== request.repository_id || r.task_id !== request.task_id
    || r.task_revision !== request.task_revision || r.claim_id !== request.claim_id || r.generation !== request.generation
    || r.protocol !== 1 || r.kind !== 'operator_task_diff'
    || typeof r.target_ref !== 'string' || !r.target_ref || r.target_ref.length > 1024
    || typeof r.branch !== 'string' || !r.branch || r.branch.length > 1024
    || typeof r.base_sha !== 'string' || !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(r.base_sha)
    || typeof r.head_sha !== 'string' || !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(r.head_sha)
    || typeof r.observed_at !== 'string' || !Number.isFinite(Date.parse(r.observed_at))
    || typeof r.patch !== 'string' || new TextEncoder().encode(r.patch).length > TASK_DIFF_MAX_BYTES
    || !Array.isArray(r.untracked_paths) || r.untracked_paths.length > TASK_DIFF_MAX_UNTRACKED
    || r.untracked_paths.some(p => typeof p !== 'string' || !p || p.startsWith('/') || p.includes('\0') || p.split('/').includes('..'))
    || new TextEncoder().encode(r.untracked_paths.join('\0')).length > TASK_DIFF_MAX_BYTES) return invalid();
  const keys = ['repository_id', 'task_id', 'task_revision', 'claim_id', 'generation', 'protocol', 'kind', 'target_ref', 'branch', 'base_sha', 'head_sha', 'observed_at', 'patch', 'untracked_paths'];
  if (Object.keys(r).length !== keys.length || Object.keys(r).some(k => !keys.includes(k))) return invalid();
  return r;
}
