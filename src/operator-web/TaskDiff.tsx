import { useEffect, useRef, useState } from 'react';
import { decodeOperatorTaskDiff, TASK_DIFF_FAILURES, type OperatorTaskDiff, type OperatorTaskDiffRequest, type TaskDiffFailure } from '../core/operator/task-diff';
import type { OperatorTranslate } from './i18n';
import type { OperatorFleetCardV1 } from './types';

export type FetchTaskDiff = (request: OperatorTaskDiffRequest, signal: AbortSignal) => Promise<OperatorTaskDiff>;
const fetchTaskDiff: FetchTaskDiff = async (request, signal) => {
  const query = new URLSearchParams({ task_revision: request.task_revision, claim_id: request.claim_id, generation: String(request.generation) });
  const response = await fetch(`/api/v1/fleet/tasks/${request.repository_id}/${request.task_id}/diff?${query}`, { signal, cache: 'no-store' });
  const value: unknown = await response.json();
  if (!response.ok) {
    const code = (value as { code?: unknown } | null)?.code;
    throw new Error(TASK_DIFF_FAILURES.includes(code as TaskDiffFailure) ? code as string : 'unavailable');
  }
  return decodeOperatorTaskDiff(value, request);
};

type View = { kind: 'idle' | 'loading' } | { kind: 'ready'; snapshot: OperatorTaskDiff } | { kind: 'error'; code: TaskDiffFailure };

/** Remounted on the entire task/claim fence, never just the card identity. */
export function TaskDiff({ card, t, read = fetchTaskDiff }: { readonly card: OperatorFleetCardV1; readonly t: OperatorTranslate; readonly read?: FetchTaskDiff }) {
  const [view, setView] = useState<View>({ kind: 'idle' });
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => { active.current?.abort(); }, []);
  const load = async () => {
    if (!card.claim_id || card.generation === null) return;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setView({ kind: 'loading' });
    const request = { repository_id: card.repository_id, task_id: card.task_id, task_revision: card.task_revision, claim_id: card.claim_id, generation: card.generation };
    try {
      const snapshot = decodeOperatorTaskDiff(await read(request, controller.signal), request);
      if (!controller.signal.aborted) setView({ kind: 'ready', snapshot });
    } catch (error) {
      if (!controller.signal.aborted) setView({ kind: 'error', code: TASK_DIFF_FAILURES.includes((error as Error).message as TaskDiffFailure) ? (error as Error).message as TaskDiffFailure : 'unavailable' });
    }
  };
  return <section className="detail-block task-diff" aria-label={t('diff.title')}>
    <h3 className="detail-eyebrow">{t('diff.title')}</h3>
    <p className="detail-quiet">{t('diff.scope')}</p>
    {!card.claim_id || card.generation === null ? <p>{t('diff.unavailable')}</p> : <button className="operator-button operator-button--secondary" type="button" onClick={() => void load()} disabled={view.kind === 'loading'}>{t(view.kind === 'loading' ? 'diff.loading' : view.kind === 'idle' ? 'diff.load' : 'diff.refresh')}</button>}
    <div aria-live="polite">
      {view.kind === 'error' && <p role="status">{t(`diff.${view.code}`)}</p>}
      {view.kind === 'ready' && <>
        <dl className="detail-list">
          <div><dt>{t('diff.base')}</dt><dd><code>{view.snapshot.target_ref} · {view.snapshot.base_sha}</code></dd></div>
          <div><dt>HEAD</dt><dd><code>{view.snapshot.branch} · {view.snapshot.head_sha}</code></dd></div>
          <div><dt>{t('diff.observed')}</dt><dd><time>{view.snapshot.observed_at}</time></dd></div>
        </dl>
        {view.snapshot.patch ? <pre className="task-diff__patch" tabIndex={0} aria-label={t('diff.patch')}>{view.snapshot.patch}</pre> : <p>{t('diff.empty')}</p>}
        {view.snapshot.untracked_paths.length > 0 && <><h4>{t('diff.untracked')}</h4><ul>{view.snapshot.untracked_paths.map(path => <li key={path}><code>{path}</code></li>)}</ul></>}
      </>}
    </div>
  </section>;
}
