import { createHash } from 'crypto';

export interface ArtifactRepairContext {
  readonly contract_path: string;
  readonly contract_sha256: string;
  readonly checks_sha256: string;
  /** The resolver's subject revision includes both review subject and target revision. */
  readonly subject_revision: string;
}
export interface ArtifactRepairReceipt extends ArtifactRepairContext {
  readonly protocol: 1;
  readonly kind: 'repo-harness-artifact-repair';
  readonly failure_class: 'missing_artifact';
  readonly reason: string;
  readonly issued_at: string;
}
export function artifactHash(text: string): string {
  return `sha256:${createHash('sha256').update(text).digest('hex')}`;
}
export function artifactRepairPath(checksText: string | null): string | null {
  if (!checksText) return null;
  try {
    if (JSON.parse(checksText).failure_class !== 'missing_artifact') return null;
  } catch { return null; }
  return `.ai/harness/state/artifact-repairs/${artifactHash(checksText).slice(7)}.json`;
}
export function validRepairReason(reason: unknown): reason is string {
  return typeof reason === 'string' && reason.trim().length > 0 && reason.length <= 1024;
}
export function validArtifactRepair(text: string | null | undefined, context: ArtifactRepairContext): boolean {
  if (!text) return false;
  try {
    const receipt = JSON.parse(text) as ArtifactRepairReceipt;
    return receipt.protocol === 1 && receipt.kind === 'repo-harness-artifact-repair'
      && receipt.failure_class === 'missing_artifact' && validRepairReason(receipt.reason)
      && typeof receipt.issued_at === 'string' && Number.isFinite(Date.parse(receipt.issued_at))
      && Object.keys(receipt).sort().join(',') === 'checks_sha256,contract_path,contract_sha256,failure_class,issued_at,kind,protocol,reason,subject_revision'
      && Object.entries(context).every(([key, value]) => receipt[key as keyof ArtifactRepairReceipt] === value);
  } catch { return false; }
}
