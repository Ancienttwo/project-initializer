import { mkdirSync, realpathSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { artifactRepairPath, validArtifactRepair, validRepairReason, type ArtifactRepairReceipt } from '../../core/state/artifact-repair';
import { acquireExclusiveDirectoryLock } from '../locking/exclusive-directory-lock';
import { readText, repoPath } from './collect-state-inputs';
import { resolveEffectiveState } from './resolve-effective-state';

/** Audits a single failing artifact snapshot; it never replaces verification evidence. */
export function recordArtifactRepair(repoRoot: string, reason: string): ArtifactRepairReceipt {
  if (!validRepairReason(reason)) throw new Error('artifact repair requires a nonblank reason of at most 1024 characters');
  const root = realpathSync(repoRoot);
  const lock = acquireExclusiveDirectoryLock(root, '.ai/harness/state/artifact-repair.lock', { reclaimStaleEmptyDirectory: true });
  try {
    const state = resolveEffectiveState(root, Date.now(), { targetPaths: [], operationKind: 'inspect' });
    if (state.blockers.length !== 1 || state.blockers[0] !== 'checks_artifact_invalid'
      || state.checks.freshness !== 'fresh' || !state.checks.path || !state.contract
      || !state.authoritative_plan || !['approved', 'executing'].includes(state.authoritative_plan.status)) {
      throw new Error('artifact repair requires an executable active contract and only a fresh missing_artifact failure');
    }
    const context = {
      contract_path: state.contract.path,
      contract_sha256: state.source_hashes[state.contract.path]!,
      checks_sha256: state.source_hashes[state.checks.path]!,
      subject_revision: state.subject_revision,
    };
    const checksText = readText(root, state.checks.path);
    const path = artifactRepairPath(checksText);
    if (!path || !context.contract_sha256 || !context.checks_sha256) throw new Error('artifact repair context is unavailable');
    const prior = readText(root, path);
    if (prior !== null) {
      if (!validArtifactRepair(prior, context) || JSON.parse(prior).reason !== reason) throw new Error('artifact repair receipt conflicts with this request');
      return JSON.parse(prior) as ArtifactRepairReceipt;
    }
    const receipt: ArtifactRepairReceipt = {
      protocol: 1, kind: 'repo-harness-artifact-repair', failure_class: 'missing_artifact', ...context,
      reason, issued_at: new Date().toISOString(),
    };
    const destination = repoPath(root, path);
    mkdirSync(dirname(destination), { recursive: true, mode: 0o700 });
    const confirm = resolveEffectiveState(root, Date.now(), { targetPaths: [], operationKind: 'inspect' });
    if (confirm.state_revision !== state.state_revision) throw new Error('artifact repair context changed before issuance');
    lock.assertOwned();
    writeFileSync(repoPath(root, path), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    return receipt;
  } finally { lock.release(); }
}
