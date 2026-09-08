import { homedir, userInfo } from 'os';
import { realpathSync } from 'fs';
import { acquireExclusiveDirectoryLock, type ExclusiveDirectoryLockHandle } from '../../effects/locking/exclusive-directory-lock';

export function withRuntimeHostTransactionLock<T>(
  env: NodeJS.ProcessEnv | undefined,
  run: (lock: ExclusiveDirectoryLockHandle) => T,
): T {
  // Resolve the protected root with the same precedence as runtime mutations.
  // A partial injected env must not make the lock fall back to a different HOME.
  const home = process.platform === 'win32'
    ? userInfo().homedir
    : env?.HOME ?? process.env.HOME ?? homedir();
  const lock = acquireExclusiveDirectoryLock(
    realpathSync(home),
    '.repo-harness/transactions/global-runtime.lock',
    { reclaimStaleOwner: true },
  );
  try {
    lock.assertOwned();
    return run(lock);
  } finally {
    lock.release();
  }
}

