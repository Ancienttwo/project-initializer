import { randomUUID } from 'crypto';
import { resolve } from 'path';
import { assertReclaimReceiptCurrent, classifyLeaseReclaim, validateLeaseReclaimEligibility, type LeaseReclaimEligibilityReceiptV1, type LeaseReclaimEvidenceV1 } from '../../core/state/lease-liveness';
import { stealLeaseRecord, type LeaseOwnerRecord } from '../../core/state/coordination-identity';
import { readLeaseLiveness, writeLeaseReclaimEligibility } from './coordination-lease-liveness-store';
import { readLease, withTaskLock, writeLeaseOwnerDurably } from './coordination-lease-store';

export interface LeaseReclaimEvidenceObservation {
  readonly evidence: LeaseReclaimEvidenceV1;
  readonly publication_state: 'inactive' | 'completing' | 'reviewing';
}

export interface AutomaticLeaseReclaimInput {
  readonly repo_root: string;
  readonly receipt: LeaseReclaimEligibilityReceiptV1;
  readonly session_id: string;
  readonly source_worktree: string;
  readonly reason: string;
  readonly observe_evidence: (owner: LeaseOwnerRecord) => LeaseReclaimEvidenceObservation;
  readonly now?: () => Date;
  readonly new_claim_id?: () => string;
  readonly crash_hook?: (boundary: 'after_lease_write') => void;
}

/**
 * Consume one evidence-gated reclaim receipt under the same task lock as every
 * Lease mutation. Evidence is observed again inside the lock and must reproduce
 * the exact receipt before the ordinary generation-incrementing steal is used.
 */
export function automaticReclaimLease(input: AutomaticLeaseReclaimInput): LeaseOwnerRecord {
  const repoRoot = resolve(input.repo_root);
  const receipt = validateLeaseReclaimEligibility(input.receipt);
  return withTaskLock(repoRoot, receipt.task_id, () => {
    const read = readLease(repoRoot, input.receipt.task_id);
    if (read.record === null) throw new Error(`lease reclaim cannot read current owner: ${read.classification}`);
    const owner = read.record;
    const liveness = readLeaseLiveness(repoRoot, owner.task_id);
    const observed = input.observe_evidence(owner);
    const classifiedAt = (input.now ?? (() => new Date()))().toISOString();
    const basis = { renewal: liveness.renewal, task_revision: owner.task_revision, evidence: observed.evidence, publication_state: observed.publication_state };
    // Preserve the observation identity while checking eligibility at consumption time.
    const historical = classifyLeaseReclaim({ ...basis, classified_at: receipt.classified_at });
    const fresh = classifyLeaseReclaim({ ...basis, classified_at: classifiedAt });
    assertReclaimReceiptCurrent(input.receipt, { task_revision: owner.task_revision, claim_id: owner.claim_id, lease_generation: owner.generation, renewal_sha256: liveness.renewal.renewal_sha256, evidence_revision: observed.evidence.evidence_revision });
    if (historical.receipt_sha256 !== receipt.receipt_sha256) throw new Error('lease reclaim evidence changed under the Lease lock');
    if (Date.parse(classifiedAt) < Date.parse(receipt.classified_at) || fresh.classification !== 'reclaimable') throw new Error('lease reclaim is not eligible at consumption time');
    const transition = stealLeaseRecord(owner, { expectedClaimId: owner.claim_id, reason: `automatic-reclaim:${input.reason}:${input.receipt.receipt_sha256}`, newClaimId: (input.new_claim_id ?? randomUUID)(), sessionId: input.session_id, sourceWorktree: input.source_worktree });
    if (!transition.ok) throw new Error(transition.error);
    writeLeaseOwnerDurably(repoRoot, owner.task_id, transition.record); input.crash_hook?.('after_lease_write'); return transition.record;
  });
}

export function observeLeaseReclaimEligibility(input: { readonly repo_root: string; readonly task_id: string; readonly evidence: LeaseReclaimEvidenceV1; readonly publication_state: 'inactive' | 'completing' | 'reviewing'; readonly now?: () => Date }): LeaseReclaimEligibilityReceiptV1 {
  return withTaskLock(resolve(input.repo_root), input.task_id, () => {
    const read = readLease(input.repo_root, input.task_id); if (read.record === null) throw new Error(`lease reclaim cannot read current owner: ${read.classification}`);
    const liveness = readLeaseLiveness(input.repo_root, input.task_id);
    const receipt = classifyLeaseReclaim({ renewal: liveness.renewal, task_revision: read.record.task_revision, classified_at: (input.now ?? (() => new Date()))().toISOString(), evidence: input.evidence, publication_state: input.publication_state });
    writeLeaseReclaimEligibility(input.repo_root, receipt); return receipt;
  });
}
