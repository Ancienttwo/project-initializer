import type { OperatorTaskDiffRequest } from '../../core/operator/task-diff';
import { OperatorTaskDiffError, readOperatorTaskDiff } from './task-diff';

self.onmessage = (event: MessageEvent<OperatorTaskDiffRequest & { readonly env?: NodeJS.ProcessEnv }>) => {
  try { self.postMessage({ ok: true, snapshot: readOperatorTaskDiff(event.data) }); }
  catch (error) { self.postMessage({ ok: false, code: error instanceof OperatorTaskDiffError ? error.code : 'unavailable' }); }
};
