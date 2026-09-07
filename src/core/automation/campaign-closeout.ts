import type { CampaignIssueAdoptionV1 } from './issue-batch-adoption';
import { validatePublicationIntegrationObservation } from '../publication/publication-lifecycle';
import { canonicalMessageDigest } from '../messages/mechanics';
import { automationDigest, type CampaignCloseoutOperation } from './budget';

export type CampaignCloseoutProviderRequest = { readonly protocol: 1 } & (
  | { readonly operation: 'github_comment_attempt'; readonly repository: string; readonly issue_number: number; readonly body: string }
  | { readonly operation: 'github_close_attempt'; readonly repository: string; readonly issue_number: number; readonly disposition: 'completed' | 'not_planned' }
  | { readonly operation: 'git_ref_delete_attempt'; readonly remote: string; readonly ref: string; readonly expected_oid: string; readonly remote_url_sha256: string }
);

export function validateCampaignCloseoutProviderRequest(value: CampaignCloseoutProviderRequest): CampaignCloseoutProviderRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.protocol !== 1) throw new Error('closeout request must be an object');
  const fields = value.operation === 'github_comment_attempt' ? ['protocol', 'operation', 'repository', 'issue_number', 'body']
    : value.operation === 'github_close_attempt' ? ['protocol', 'operation', 'repository', 'issue_number', 'disposition']
      : value.operation === 'git_ref_delete_attempt' ? ['protocol', 'operation', 'remote', 'ref', 'expected_oid', 'remote_url_sha256'] : null;
  if (!fields || Object.keys(value).sort().join(',') !== fields.sort().join(',')) throw new Error('closeout request fields are invalid');
  if (value.operation === 'git_ref_delete_attempt') {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value.remote) || !value.ref.startsWith('refs/heads/')
      || /[\s\0~^:?*\[\\]/u.test(value.ref) || value.ref.includes('..') || value.ref.includes('@{')
      || !/^[a-f0-9]{40,64}$/.test(value.expected_oid) || !/^[a-f0-9]{64}$/.test(value.remote_url_sha256)) throw new Error('closeout ref identity is invalid');
  } else {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value.repository)
      || !Number.isSafeInteger(value.issue_number) || value.issue_number < 1) throw new Error('closeout Issue identity is invalid');
    if (value.operation === 'github_comment_attempt' ? typeof value.body !== 'string' || !value.body.trim()
      : !['completed', 'not_planned'].includes(value.disposition)) throw new Error('closeout mutation is invalid');
  }
  return Object.freeze({ ...value });
}

export function closeoutProviderRequestDigest(request: CampaignCloseoutProviderRequest): string {
  return automationDigest(validateCampaignCloseoutProviderRequest(request));
}

export interface CampaignCloseoutProviderReceipt {
  readonly operation: CampaignCloseoutOperation;
  readonly request_sha256: string;
  readonly reservation_sha256: string;
  readonly mutation_returned: boolean;
  readonly readback_stdout: string;
  readonly readback_reservation_sha256: string;
  readonly readback_generation: number;
  readonly observed_at: string;
}

export function campaignCloseoutKey(identity: string, phase: string): string {
  return canonicalMessageDigest({ closeout: identity, phase }).slice(7);
}

/** Semantic local decision; its exact files must be covered by verified acceptance. */
export interface CampaignNotPlannedDecisionV1 {
  readonly protocol: 1;
  readonly kind: 'repo-harness-campaign-not-planned-decision';
  readonly campaign_id: string;
  readonly group_number: number;
  readonly intent_sha256: string;
  readonly provider_issue_id: string;
  readonly source_observation_sha256: string;
  readonly disposition: 'not_planned';
  readonly tasks: readonly { readonly task_id: string; readonly task_revision: string; readonly slot: string }[];
  readonly falsifier: { readonly command: string; readonly exit_code: number; readonly observation: string; readonly artifact_path: string; readonly artifact_sha256: string };
}

export function validateCampaignNotPlannedDecision(value: unknown): CampaignNotPlannedDecisionV1 {
  const exact = (value: unknown, fields: string[]): Record<string, unknown> => {
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join(',') !== fields.sort().join(',')) throw new Error('not_planned decision fields differ');
    return value as Record<string, unknown>;
  };
  const record = exact(value, ['protocol', 'kind', 'campaign_id', 'group_number', 'intent_sha256', 'provider_issue_id', 'source_observation_sha256', 'disposition', 'tasks', 'falsifier']);
  if (record.protocol !== 1 || record.kind !== 'repo-harness-campaign-not-planned-decision' || record.disposition !== 'not_planned'
    || typeof record.campaign_id !== 'string' || !record.campaign_id.trim() || ![1, 2, 3].includes(record.group_number as number)
    || typeof record.provider_issue_id !== 'string' || !record.provider_issue_id.trim()
    || typeof record.intent_sha256 !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(record.intent_sha256)
    || typeof record.source_observation_sha256 !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(record.source_observation_sha256)
    || !Array.isArray(record.tasks) || !record.tasks.length) throw new Error('not_planned decision identity is invalid');
  for (const task of record.tasks) {
    const row = exact(task, ['task_id', 'task_revision', 'slot']);
    if (typeof row.task_id !== 'string' || !/^[a-f0-9]{64}$/.test(row.task_id) || typeof row.task_revision !== 'string'
      || !/^[a-f0-9]{64}$/.test(row.task_revision) || typeof row.slot !== 'string' || !row.slot.trim()) throw new Error('not_planned Task identity is invalid');
  }
  if (new Set(record.tasks.map(task => task.task_id)).size !== record.tasks.length) throw new Error('not_planned Tasks are duplicated');
  const falsifier = exact(record.falsifier, ['command', 'exit_code', 'observation', 'artifact_path', 'artifact_sha256']);
  if (typeof falsifier.command !== 'string' || !falsifier.command.trim() || typeof falsifier.observation !== 'string' || !falsifier.observation.trim()
    || !Number.isSafeInteger(falsifier.exit_code) || typeof falsifier.artifact_path !== 'string' || !falsifier.artifact_path.trim()
    || typeof falsifier.artifact_sha256 !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(falsifier.artifact_sha256)) throw new Error('not_planned falsifier is incomplete');
  return value as CampaignNotPlannedDecisionV1;
}

/** Shared completion shape gate; malformed journal records never unlock the next group. */
export function assertCampaignCleanupReceipt(value: unknown, taskId: string): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('cleanup receipt is invalid');
  const r = value as Record<string, unknown>;
  if (r.protocol !== 1 || r.kind !== 'repo-harness-campaign-cleanup' || r.task_id !== taskId || typeof r.task_revision !== 'string' || !/^[a-f0-9]{64}$/.test(r.task_revision)) throw new Error('cleanup receipt identity differs');
  const fields = r.disposition === 'completed' ? ['protocol', 'kind', 'disposition', 'task_id', 'task_revision', 'publication_id', 'provider_issue_id', 'integration', 'topology']
    : r.disposition === 'not_planned' ? ['protocol', 'kind', 'disposition', 'decision_sha256', 'execution_topology', 'task_id', 'task_revision'] : [];
  if (!fields.length || Object.keys(r).sort().join(',') !== fields.sort().join(',')) throw new Error('cleanup receipt fields differ');
  if (r.disposition === 'not_planned') {
    if (r.execution_topology !== null || typeof r.decision_sha256 !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(r.decision_sha256)) throw new Error('not_planned cleanup proof is invalid');
    return;
  }
  const integration = r.integration as Record<string, unknown> | null;
  if (!integration || typeof integration !== 'object' || integration.classification !== 'integrated' || integration.integration_state !== 'merged'
    || integration.attention !== null || typeof integration.merge_commit_sha !== 'string' || !/^[a-f0-9]{40}$/.test(integration.merge_commit_sha)) throw new Error('cleanup actual merge proof is invalid');
  const evidence = validatePublicationIntegrationObservation(integration.evidence);
  if (evidence.task_id !== taskId || evidence.task_revision !== r.task_revision || evidence.publication_id !== r.publication_id
    || evidence.integration_state !== 'merged' || evidence.fetched_target_oid !== integration.fetched_target_oid || evidence.observation_ref !== integration.observation_ref
    || typeof r.provider_issue_id !== 'string' || !r.provider_issue_id.trim()) throw new Error('cleanup publication proof differs');
  const topology = r.topology as Record<string, unknown> | null;
  if (!topology || typeof topology !== 'object' || Object.keys(topology).sort().join(',') !== ['worktree', 'branch', 'head_sha', 'target_ref', 'target_oid', 'merge_commit_sha'].sort().join(',')
    || typeof topology.worktree !== 'string' || !topology.worktree.trim() || typeof topology.branch !== 'string' || !topology.branch.trim()
    || topology.head_sha !== evidence.head_sha || topology.target_ref !== evidence.target_ref || typeof topology.target_oid !== 'string' || !/^[a-f0-9]{40,64}$/.test(topology.target_oid)
    || topology.merge_commit_sha !== integration.merge_commit_sha) throw new Error('cleanup topology proof differs');
}

/** Both closure dispositions use the complete immutable Issue-to-Task join. */
export function campaignIssueMembers(input: {
  readonly slots: readonly { readonly slot: string; readonly task_id: string; readonly work_package_id: string }[];
  readonly issues: readonly CampaignIssueAdoptionV1[];
}, issueId: string) {
  const issues = input.issues.filter(issue => issue.provider_issue_id === issueId);
  const issue = issues[0];
  if (!issue || issues.some(other => other.issue_number !== issue.issue_number || other.source_observation_sha256 !== issue.source_observation_sha256
    || other.title_sha256 !== issue.title_sha256 || other.body_sha256 !== issue.body_sha256)) throw new Error('Issue membership has conflicting source authority');
  const slots = new Set(issues.map(value => value.slot));
  const members = input.slots.filter(value => slots.has(value.slot));
  if (!members.length || new Set(members.map(value => value.task_id)).size !== members.length || [...slots].some(slot => !members.some(member => member.slot === slot))) throw new Error('Issue membership is incomplete');
  return { issue, slots, members };
}

export function allCampaignIssueTasksMerged(taskIds: readonly string[], proofs: readonly unknown[]): boolean {
  return taskIds.length > 0 && taskIds.length === proofs.length && proofs.every((value, index) => {
    if (!value || typeof value !== 'object') return false;
    const proof = value as Record<string, unknown>;
    if (proof.integration_state !== 'merged' || typeof proof.merge_commit_sha !== 'string' || !/^[a-f0-9]{40}$/.test(proof.merge_commit_sha)) return false;
    try { return validatePublicationIntegrationObservation(proof.evidence).task_id === taskIds[index]; }
    catch { return false; }
  });
}
