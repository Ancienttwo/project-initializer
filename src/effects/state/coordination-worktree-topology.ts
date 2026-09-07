import { execFileSync } from 'child_process';
import { existsSync, realpathSync } from 'fs';
import { listLeaseReads } from './coordination-lease-store';
import { resolveGitCommonDirectory } from '../git/common-directory';
import { withExclusiveDirectoryLock } from '../locking/exclusive-directory-lock';

/** Bind and destructive cleanup serialize across every worktree of this clone. */
export function withWorktreeTopologyLock<T>(root: string, action: () => T): T {
  return withExclusiveDirectoryLock(resolveGitCommonDirectory(root), 'repo-harness/coordination/locks/worktree-topology.lock', action);
}

export function assertWorktreeBinding(root: string, worktree: string, branch: string): void {
  if (realpathSync(worktree) !== worktree || resolveGitCommonDirectory(root) !== resolveGitCommonDirectory(worktree)) throw new Error('execution worktree is not in this clone');
  const observed = execFileSync('git', ['symbolic-ref', '--quiet', 'HEAD'], { cwd: worktree, encoding: 'utf8' }).trim();
  if (observed !== `refs/heads/${branch}`) throw new Error('execution branch changed before bind');
}

export interface ExactWorktreeCleanup {
  readonly worktree: string;
  readonly branch: string;
  readonly head_sha: string;
  readonly target_ref: string;
  readonly target_oid: string;
  readonly merge_commit_sha: string;
}

/** The actuator runs inside the same barrier as final bind, including readback. */
export function cleanupExactWorktree(root: string, expected: ExactWorktreeCleanup, actuator: () => unknown) {
  return withWorktreeTopologyLock(root, () => {
    const git = (args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    for (const lease of listLeaseReads(root)) {
      if (!lease.record) throw new Error('cleanup has unknown Lease ownership');
      if (lease.record.execution_worktree === expected.worktree || lease.record.branch === expected.branch) throw new Error('cleanup has an active Lease reference');
    }
    if (git(['rev-parse', `${expected.target_ref}^{commit}`]) !== expected.target_oid) throw new Error('cleanup target moved');
    git(['merge-base', '--is-ancestor', expected.merge_commit_sha, expected.target_oid]);
    if (existsSync(expected.worktree)) {
      assertWorktreeBinding(root, expected.worktree, expected.branch);
      const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: expected.worktree, encoding: 'utf8' }).trim();
      if (head !== expected.head_sha) throw new Error('cleanup execution head moved');
      if (execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: expected.worktree, encoding: 'utf8' }).trim()) throw new Error('cleanup_blocked_dirty_worktree');
    }
    const result = actuator();
    if (existsSync(expected.worktree)) throw new Error('cleanup worktree removal is unproven');
    const refs = git(['for-each-ref', '--format=%(refname)', `refs/heads/${expected.branch}`]).split('\n');
    if (refs.includes(`refs/heads/${expected.branch}`)) throw new Error('cleanup branch deletion is unproven');
    return result;
  });
}
