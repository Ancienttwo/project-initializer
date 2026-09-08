import { execFileSync } from 'child_process';
import { canonicalMessageBytes, canonicalMessageDigest } from '../../core/messages/mechanics';
import { buildIssueBatchAdoption, IssueBatchAdoptionError, type IssueBatchAdoptionInput, type CampaignIssueBatchAdoptionReceiptV1 } from '../../core/automation/issue-batch-adoption';
import type { IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import { readIssueBatchAdoptionArtifact, readIssueBatchIntent, persistIssueBatchAdoptionArtifact } from './issue-batch-store';
import type { CampaignPublicationV1 } from './issue-batch-publication';

export interface ResumedIssueIdentity {
  readonly slot: string;
  readonly provider_issue_id: string;
  readonly provider_issue_url: string;
}
export interface AdoptedResumeSource {
  readonly intent: IssueBatchIntentV1;
  readonly source_session_ref: string;
  readonly issues: readonly ResumedIssueIdentity[];
}
function fail(message: string): never { throw new IssueBatchAdoptionError('issue_adoption_conflict', message); }
const same = (left: unknown, right: unknown) => canonicalMessageBytes(left as Record<string, unknown>) === canonicalMessageBytes(right as Record<string, unknown>);
function git(root: string, args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/** Rebuild historical adoption authority; it grants no authority to execute the old campaign. */
export function validateAdoptedResumeSource(root: string, source: AdoptedResumeSource, targetRevision: string): void {
  const { intent, issues } = source;
  const stored = readIssueBatchAdoptionArtifact(root, intent, 'adoption');
  const publication = readIssueBatchAdoptionArtifact(root, intent, 'publication') as unknown as CampaignPublicationV1 | null;
  if (!stored || !publication) fail('adopted resume requires published source adoption');
  const input = stored.input as IssueBatchAdoptionInput;
  const adopted = buildIssueBatchAdoption(input);
  if (!same(input.intent, intent) || adopted.receipt.authoring_session_ref !== source.source_session_ref) fail('resume source adoption session or intent differs');
  const expected = adopted.receipt.issues.map(i => ({ slot: i.slot, provider_issue_id: i.provider_issue_id,
    provider_issue_url: `https://github.com/${intent.provider_repository}/issues/${i.issue_number}` }));
  if (expected.length !== intent.slots.length || !same(expected, issues)) fail('resume Issues differ from the published source adoption');
  const manifestPath = `tasks/campaigns/${intent.campaign_id}/group-${intent.group_number}.issues.json`;
  const evidence = { terminal_sha256: input.terminal.terminal_sha256, challenge_receipt_sha256: adopted.challenge_receipt.receipt_sha256 };
  const digest = canonicalMessageDigest({ receipt: adopted.receipt, sprint_path: stored.sprint_path, policy: stored.publication_policy, evidence });
  if (publication.base_main_sha !== intent.base_main_sha || publication.manifest_path !== manifestPath || publication.projection_sha256 !== digest) fail('resume publication binding differs');
  git(root, ['merge-base', '--is-ancestor', publication.materialized_commit, targetRevision]);
  const original = git(root, ['show', `${publication.materialized_commit}:${manifestPath}`]);
  if (git(root, ['rev-parse', `${publication.materialized_commit}^`]) !== intent.base_main_sha
    || git(root, ['show', `${targetRevision}:${manifestPath}`]) !== original) fail('resume source publication is not an unchanged canonical ancestor');
  const manifest = JSON.parse(original);
  if (manifest.projection_sha256 !== digest || !same(manifest.receipt, adopted.receipt) || !same(manifest.evidence, evidence)
    || !same(manifest.slots.map((s: { task_id: string }) => s.task_id), publication.task_ids)) fail('resume canonical manifest differs');
}

/** Two immutable records link authority; neither overwrites source intent, grant or evidence. */
export function bindAdoptedResume(root: string, successor: IssueBatchIntentV1, source: AdoptedResumeSource): void {
  persistIssueBatchAdoptionArtifact(root, successor, 'resume-source', {
    campaign_id: source.intent.campaign_id, group_number: source.intent.group_number,
    intent_sha256: source.intent.intent_sha256, source_session_ref: source.source_session_ref, issues: source.issues,
  });
  // Exclusive immutable publication serializes competing successors before provider dispatch.
  persistIssueBatchAdoptionArtifact(root, source.intent, 'continuation', {
    campaign_id: successor.campaign_id, group_number: successor.group_number, intent_sha256: successor.intent_sha256,
  });
}

/** Provider output must obey the original Issue identities, even when its prompt did not. */
export function assertResumedAdoption(root: string, intent: IssueBatchIntentV1, receipt: CampaignIssueBatchAdoptionReceiptV1): void {
  const record = readIssueBatchAdoptionArtifact(root, intent, 'resume-source');
  if (!record) return;
  const source = readIssueBatchIntent(root, record.campaign_id as string, record.group_number as number, record.intent_sha256 as string);
  const binding = readIssueBatchAdoptionArtifact(root, source, 'continuation');
  if (!same(binding, { campaign_id: intent.campaign_id, group_number: intent.group_number, intent_sha256: intent.intent_sha256 })) fail('resume successor is not bound to its predecessor');
  const issues = record.issues as readonly ResumedIssueIdentity[];
  validateAdoptedResumeSource(root, { intent: source, source_session_ref: record.source_session_ref as string, issues }, intent.base_main_sha);
  for (const issue of receipt.issues) {
    const expected = issues.find(i => i.slot === issue.slot);
    if (!expected || expected.provider_issue_id !== issue.provider_issue_id
      || expected.provider_issue_url !== `https://github.com/${intent.provider_repository}/issues/${issue.issue_number}`) fail('resumed adoption contains a replacement Issue');
  }
}

/** A resumed batch already has every Issue; follow-ups may edit those identities only. */
export function assertResumedAuthoringTarget(root: string, intent: IssueBatchIntentV1, operation: string, slots: readonly string[], issueId: string | null, issueUrl: string | null): void {
  const record = readIssueBatchAdoptionArtifact(root, intent, 'resume-source');
  if (!record) return;
  const issues = record.issues as readonly ResumedIssueIdentity[];
  const target = issues.find(i => i.slot === slots[0]);
  if (operation !== 'edit_issue' || slots.length !== 1 || !target || target.provider_issue_id !== issueId || target.provider_issue_url !== issueUrl) {
    fail('resumed authoring may only edit its existing exact Issue; fill_missing cannot create replacements');
  }
}
