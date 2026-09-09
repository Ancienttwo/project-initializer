import { execFileSync } from 'child_process';
import { canonicalMessageBytes, canonicalMessageDigest } from '../../core/messages/mechanics';
import { buildIssueBatchAdoption, IssueBatchAdoptionError, type IssueBatchAdoptionInput, type CampaignIssueBatchAdoptionReceiptV1 } from '../../core/automation/issue-batch-adoption';
import type { IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import { campaignAutomationRunId } from '../../core/automation/campaign-authoring-budget';
import { listIssueAuthoringSessions, listIssueBatchJournalRecords, readIssueBatchAdoptionArtifact, readIssueBatchIntent, persistIssueBatchAdoptionArtifact } from './issue-batch-store';
import { readAutomationBudgetStatus, readCampaignAuthoringBudgetTerminal, readCampaignBudgetLedger } from './budget-store';
import { readDevelopmentCampaignStatus, readExactAuthorityBinding } from './development-campaign-store';
import { readPlanningRecord } from './campaign-planning-store';
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

/** One successor identity; the same shape names a continuation, a replacement and a superseded link. */
export interface ContinuationRef {
  readonly campaign_id: string;
  readonly group_number: number;
  readonly intent_sha256: string;
}

/** The superseded successor's own terminal evidence, by pointer: no counter is copied or re-derived. */
export interface SupersededCampaignEvidenceV1 extends ContinuationRef {
  readonly stop_event_sha256: string;
  readonly campaign_current_sha256: string;
  readonly automation_run_id: string;
  readonly budget_current_sha256: string;
  readonly ledger_sha256: string;
}

export interface ContinuationReplacementEvidenceV1 {
  readonly authoring_session_sha256s: readonly string[];
  readonly marked_slots: readonly string[];
}

export const CAMPAIGN_CONTINUATION_REPLACEMENT_KIND = 'repo-harness-campaign-continuation-replacement';

export interface CampaignContinuationReplacementV1 {
  readonly protocol: 1;
  readonly kind: typeof CAMPAIGN_CONTINUATION_REPLACEMENT_KIND;
  readonly superseded: SupersededCampaignEvidenceV1;
  readonly replacement: ContinuationRef;
  readonly evidence: ContinuationReplacementEvidenceV1;
  readonly created_at: string;
}

/** The verified basis a replacement write consumes; only `assertReplaceableStoppedSuccessor` mints it. */
export interface ContinuationReplacementBasis {
  readonly superseded: SupersededCampaignEvidenceV1;
  readonly evidence: ContinuationReplacementEvidenceV1;
}

export interface EffectiveContinuation {
  readonly effective: ContinuationRef | null;
  readonly superseded: readonly ContinuationRef[];
  readonly replacements: readonly CampaignContinuationReplacementV1[];
}

/** A bounded chain keeps one recovery lineage auditable; a longer or cyclic one is corruption. */
const MAXIMUM_CONTINUATION_HOPS = 8;

function fail(message: string): never { throw new IssueBatchAdoptionError('issue_adoption_conflict', message); }
const same = (left: unknown, right: unknown) => canonicalMessageBytes(left as Record<string, unknown>) === canonicalMessageBytes(right as Record<string, unknown>);
function git(root: string, args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
const referenceOf = (value: ContinuationRef): ContinuationRef => Object.freeze({
  campaign_id: value.campaign_id, group_number: value.group_number, intent_sha256: value.intent_sha256,
});
function supersededArtifactName(intentSha256: string): `superseded-${string}` {
  if (!/^sha256:[0-9a-f]{64}$/u.test(intentSha256)) fail('superseded intent digest is invalid');
  return `superseded-${intentSha256.slice('sha256:'.length)}`;
}
function continuationRef(record: Record<string, unknown>, label: string): ContinuationRef {
  if (typeof record.campaign_id !== 'string' || !Number.isSafeInteger(record.group_number)
    || typeof record.intent_sha256 !== 'string') fail(`${label} does not name an exact successor`);
  return Object.freeze({ campaign_id: record.campaign_id, group_number: record.group_number as number, intent_sha256: record.intent_sha256 });
}
function replacementRecord(record: Record<string, unknown>): CampaignContinuationReplacementV1 {
  if (record.protocol !== 1 || record.kind !== CAMPAIGN_CONTINUATION_REPLACEMENT_KIND || typeof record.created_at !== 'string'
    || !record.superseded || typeof record.superseded !== 'object' || !record.replacement || typeof record.replacement !== 'object'
    || !record.evidence || typeof record.evidence !== 'object') fail('continuation replacement record is invalid');
  const superseded = record.superseded as Record<string, unknown>;
  const evidence = record.evidence as Record<string, unknown>;
  if (typeof superseded.stop_event_sha256 !== 'string' || typeof superseded.campaign_current_sha256 !== 'string'
    || typeof superseded.automation_run_id !== 'string' || typeof superseded.budget_current_sha256 !== 'string'
    || typeof superseded.ledger_sha256 !== 'string') fail('continuation replacement record has no superseded terminal evidence');
  if (!Array.isArray(evidence.authoring_session_sha256s) || !Array.isArray(evidence.marked_slots)) fail('continuation replacement record has no authoring evidence');
  continuationRef(superseded, 'continuation replacement superseded');
  return record as unknown as CampaignContinuationReplacementV1;
}

/**
 * The single effective-successor resolution. Both the binder and the adoption checker read it,
 * so a replacement can never leave the writer and the reader disagreeing about who holds the
 * continuation right. An unreadable, self-inconsistent, cyclic or over-long chain fails closed.
 */
export function resolveEffectiveContinuation(root: string, source: IssueBatchIntentV1): EffectiveContinuation {
  const bound = readIssueBatchAdoptionArtifact(root, source, 'continuation');
  if (!bound) return Object.freeze({ effective: null, superseded: Object.freeze([]), replacements: Object.freeze([]) });
  let current = continuationRef(bound, 'continuation binding');
  const replacements: CampaignContinuationReplacementV1[] = [];
  const visited = new Set<string>([current.intent_sha256]);
  for (let hop = 0; hop < MAXIMUM_CONTINUATION_HOPS; hop += 1) {
    const stored = readIssueBatchAdoptionArtifact(root, source, supersededArtifactName(current.intent_sha256));
    if (!stored) {
      return Object.freeze({
        effective: current,
        superseded: Object.freeze(replacements.map((entry) => referenceOf(entry.superseded))),
        replacements: Object.freeze([...replacements]),
      });
    }
    const record = replacementRecord(stored);
    if (!same(referenceOf(record.superseded), current)) fail('continuation replacement record names another superseded successor');
    replacements.push(record);
    current = continuationRef(record.replacement as unknown as Record<string, unknown>, 'continuation replacement');
    if (visited.has(current.intent_sha256)) fail('continuation replacement chain repeats a successor');
    visited.add(current.intent_sha256);
  }
  return fail('continuation replacement chain exceeds its bounded length');
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

/** Project the exact resume request an operator would otherwise transcribe from the stored receipt. */
export function readAdoptedResumeSource(root: string, intent: IssueBatchIntentV1): AdoptedResumeSource {
  const stored = readIssueBatchAdoptionArtifact(root, intent, 'adoption');
  if (!stored) fail('adopted resume requires a stored source adoption');
  const adopted = buildIssueBatchAdoption(stored.input as IssueBatchAdoptionInput);
  return Object.freeze({
    intent,
    source_session_ref: adopted.receipt.authoring_session_ref,
    issues: Object.freeze(adopted.receipt.issues.map(i => Object.freeze({
      slot: i.slot, provider_issue_id: i.provider_issue_id,
      provider_issue_url: `https://github.com/${intent.provider_repository}/issues/${i.issue_number}`,
    }))),
  });
}

/**
 * `stopped && !adoption` is necessary, not sufficient. Every predicate reads a canonical store and
 * writes nothing: missing, corrupt or undeterminable evidence is never read as "nothing executed",
 * so a replacement can only be admitted against a provably quiescent successor.
 */
export function assertReplaceableStoppedSuccessor(root: string, superseded: IssueBatchIntentV1, env?: NodeJS.ProcessEnv): ContinuationReplacementBasis {
  const status = readDevelopmentCampaignStatus(root, superseded.campaign_id, env);
  const last = status.events.at(-1);
  if (status.current.state !== 'stopped' || !last || last.operation !== 'stop' || status.current.current_event_sha256 !== last.event_sha256) {
    fail('a replaceable successor must be formally stopped by its own last campaign event');
  }
  if (readIssueBatchAdoptionArtifact(root, superseded, 'adoption') !== null || readIssueBatchAdoptionArtifact(root, superseded, 'publication') !== null) {
    fail('a replaceable successor must have no adoption and no publication');
  }
  const grant = readExactAuthorityBinding(root, status.campaign, env ?? process.env);
  const run = campaignAutomationRunId({ repository_id: superseded.repository_id, campaign_id: superseded.campaign_id });
  const budget = readAutomationBudgetStatus(root, run, env);
  if (budget.budget.authorization.authorization_sha256 !== grant.authorization_sha256) fail('the superseded budget run is bound to another authorization');
  if (budget.current.consumed.successful_acquisitions !== 0 || budget.current.open_reservation_sha256s.length !== 0
    || budget.current.state === 'reconciliation_required' || budget.drift !== 'none') {
    fail('a replaceable successor must have no acquisition, no open reservation and no unadopted budget record');
  }
  const ledger = readCampaignBudgetLedger(root, run, env);
  if (ledger.active_step !== null || ledger.reserved_provider_calls !== 0) fail('a replaceable successor must have no active controller step and no reserved provider call');
  if (readPlanningRecord(root, superseded, 'parent') !== null) fail('a replaceable successor already opened a local planning session');
  const sessions = listIssueAuthoringSessions(root, superseded.campaign_id, superseded.group_number, superseded.intent_sha256);
  if (sessions.length === 0) fail('a replaceable successor has no authoring session evidence');
  for (const session of sessions) {
    if (session.browser_status !== 'completed' || session.verification !== 'verified') fail('a replaceable successor has an incomplete or unverified authoring session');
  }
  if (readIssueBatchAdoptionArtifact(root, superseded, 'response') !== null
    && readIssueBatchAdoptionArtifact(root, superseded, 'completed-response') === null) fail('a replaceable successor has a provider response with no completed result');
  if (readIssueBatchAdoptionArtifact(root, superseded, 'seal-sources') !== null
    && readCampaignAuthoringBudgetTerminal({ repo_root: root, automation_run_id: run, expected_budget_sha256: budget.budget.budget_sha256,
      campaign_id: superseded.campaign_id, group_number: superseded.group_number as 1 | 2 | 3, intent_sha256: superseded.intent_sha256, env }) === null) {
    fail('a replaceable successor staged an authoring seal with no budget terminal');
  }
  const settled = new Set((listIssueBatchJournalRecords(root, superseded.campaign_id, superseded.group_number, 'results') as readonly Record<string, unknown>[])
    .map((entry) => entry.reservation_sha256));
  for (const reservation of listIssueBatchJournalRecords(root, superseded.campaign_id, superseded.group_number, 'reservations') as readonly Record<string, unknown>[]) {
    if (!settled.has(reservation.reservation_sha256)) fail('a replaceable successor has a provider mutation with an unknown result');
  }
  return Object.freeze({
    superseded: Object.freeze({
      campaign_id: superseded.campaign_id, group_number: superseded.group_number, intent_sha256: superseded.intent_sha256,
      stop_event_sha256: last.event_sha256, campaign_current_sha256: status.current.current_sha256,
      automation_run_id: run, budget_current_sha256: budget.current.current_sha256, ledger_sha256: budget.current.ledger_sha256,
    }),
    evidence: Object.freeze({
      authoring_session_sha256s: Object.freeze([...sessions.map((session) => session.session_sha256)].sort()),
      marked_slots: Object.freeze([...new Set(sessions.flatMap((session) => [...session.requested_slots]))].sort()),
    }),
  });
}

/**
 * Two immutable records link authority; neither overwrites source intent, grant or evidence.
 * A replacement adds a third: the predecessor's `continuation` stays byte-for-byte, and the new
 * `superseded-<intent>` record is the only thing that moves the effective continuation forward.
 */
export function bindAdoptedResume(root: string, successor: IssueBatchIntentV1, source: AdoptedResumeSource, supersedes?: ContinuationReplacementBasis | null): void {
  const self = referenceOf(successor);
  persistIssueBatchAdoptionArtifact(root, successor, 'resume-source', {
    campaign_id: source.intent.campaign_id, group_number: source.intent.group_number,
    intent_sha256: source.intent.intent_sha256, source_session_ref: source.source_session_ref, issues: source.issues,
    ...(supersedes ? { supersedes: referenceOf(supersedes.superseded) } : {}),
  });
  if (!supersedes) {
    // Exclusive immutable publication serializes competing successors before provider dispatch.
    persistIssueBatchAdoptionArtifact(root, source.intent, 'continuation', { ...self });
    return;
  }
  const target = referenceOf(supersedes.superseded);
  const { effective } = resolveEffectiveContinuation(root, source.intent);
  // The self arm makes an interrupted replacement idempotent; it never admits a second successor.
  if (effective === null || !(same(effective, target) || same(effective, self))) fail('the superseded successor no longer holds the effective continuation');
  persistIssueBatchAdoptionArtifact(root, source.intent, supersededArtifactName(target.intent_sha256), {
    protocol: 1, kind: CAMPAIGN_CONTINUATION_REPLACEMENT_KIND,
    superseded: supersedes.superseded, replacement: self, evidence: supersedes.evidence,
    // The replacement intent's immutable creation time, so a crash-retry reproduces identical bytes.
    created_at: successor.created_at,
  });
}

/** Provider output must obey the original Issue identities, even when its prompt did not. */
export function assertResumedAdoption(root: string, intent: IssueBatchIntentV1, receipt: CampaignIssueBatchAdoptionReceiptV1): void {
  const record = readIssueBatchAdoptionArtifact(root, intent, 'resume-source');
  if (!record) return;
  const source = readIssueBatchIntent(root, record.campaign_id as string, record.group_number as number, record.intent_sha256 as string);
  const { effective } = resolveEffectiveContinuation(root, source);
  if (effective === null || !same(effective, referenceOf(intent))) fail('resume successor is not bound to its predecessor');
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
