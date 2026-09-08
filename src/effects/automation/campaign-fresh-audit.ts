import { execFileSync } from 'child_process';
import { canonicalMessageDigest, messageSha256 } from '../../core/messages/mechanics';
import { automationDigest, type ProgramAuthorizationV1, type CampaignAutomationBudgetReservationV1 } from '../../core/automation/budget';
import { assertCampaignCleanupReceipt, campaignCloseoutKey } from '../../core/automation/campaign-closeout';
import {
  campaignGroupProgress,
  CampaignFreshAuditError,
  auditInvalid,
  sealCampaignGroupSnapshot,
  validateCampaignGroupSnapshot,
  campaignAuditAnswerSchema,
  parseCampaignAuditAnswer,
  sealCampaignFreshAuditObservation,
  validateCampaignFreshAuditObservation,
  type CampaignGroupSnapshotV1,
  type CampaignFreshAuditObservationV1,
} from '../../core/automation/campaign-fresh-audit';
import type { IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import type { DevelopmentCampaignDefinitionV1, DevelopmentCampaignEventV1 } from '../../core/automation/development-campaign';
import { readDevelopmentCampaignStatus, appendDevelopmentCampaignEvent, readExactAuthorityBinding } from './development-campaign-store';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import { readPlanningRecord, persistPlanningRecord, withCampaignPlanningLock, storedPlanningIntents } from './campaign-planning-store';
import { listIssueAuthoringSessions, readIssueBatchIntent } from './issue-batch-store';
import { ensureCampaignAuthoringBudget, reserveCampaignAuthoringBudget, appendAutomationUsage } from './budget-store';
import type { IssueAuthoringBrowserInput, IssueAuthoringDependencies, IssueAuthoringBrowserResult } from './gpt-pro-issue-authoring';

const git = (root: string, args: string[]) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const key = (kind: string, value: unknown) => canonicalMessageDigest({ kind, value }).slice(7);
function oneIntent(root: string, campaignId: string, group: number): IssueBatchIntentV1 {
  const values = storedPlanningIntents(root).filter((i) => i.campaign_id === campaignId && i.group_number === group);
  if (values.length !== 1) auditInvalid('group has no unique intent');
  return values[0]!;
}
function grant(root: string, campaign: DevelopmentCampaignDefinitionV1, env?: NodeJS.ProcessEnv): ProgramAuthorizationV1 {
  const authority = readExactAuthorityBinding(root, campaign, env ?? process.env);
  if (Date.parse(authority.expires_at) <= Date.now()) auditInvalid('audit authorization is stale');
  return authority;
}

export function buildCampaignGroupSnapshot(root: string, intent: IssueBatchIntentV1, env?: NodeJS.ProcessEnv): CampaignGroupSnapshotV1 {
  const status = readDevelopmentCampaignStatus(root, intent.campaign_id, env),
    authority = grant(root, status.campaign, env);
  const progress = campaignGroupProgress(status.events, authority.campaign!.group_count);
  if (progress.group_number !== intent.group_number || !['group_running', 'group_auditing'].includes(status.current.state))
    auditInvalid('audit requires the current running or auditing group');
  const { manifest, publication, target } = requireCampaignPlanningAuthority(root, intent, env);
  const issues = manifest.receipt.issues,
    unfilled = manifest.receipt.unfilled_slots;
  const partition = [...issues.map((i) => i.slot), ...unfilled].sort();
  if (
    JSON.stringify(partition) !== JSON.stringify(intent.slots) ||
    new Set(partition).size !== partition.length ||
    JSON.stringify([...manifest.slots.map((s) => s.slot)].sort()) !== JSON.stringify(issues.map((i) => i.slot).sort())
  )
    auditInvalid('adoption does not partition every declared slot');
  const slots = intent.slots.map((slot) => {
    if (unfilled.includes(slot))
      return { slot, disposition: 'unfilled' as const, task_id: null, cleanup_sha256: null, merge_commit_sha: null };
    const task = manifest.slots.find((s) => s.slot === slot)!;
    const receipt = readPlanningRecord<Record<string, unknown>>(root, intent, campaignCloseoutKey(task.task_id, 'complete'));
    assertCampaignCleanupReceipt(receipt, task.task_id);
    const disposition = receipt!.disposition as 'completed' | 'not_planned';
    const merge = disposition === 'completed' ? (receipt!.integration as { merge_commit_sha: string }).merge_commit_sha : null;
    if (merge)
      try {
        git(root, ['merge-base', '--is-ancestor', merge, target]);
      } catch {
        auditInvalid('cleanup merge is not an ancestor of final main');
      }
    return { slot, disposition, task_id: task.task_id, cleanup_sha256: canonicalMessageDigest({ ...receipt! }), merge_commit_sha: merge };
  });
  return sealCampaignGroupSnapshot({
    campaign_id: intent.campaign_id,
    group_number: intent.group_number,
    intent_sha256: intent.intent_sha256,
    provider_repository: intent.provider_repository,
    target_ref: intent.target_ref,
    expected_final_main_sha: target,
    adoption_sha256: manifest.receipt.receipt_sha256,
    publication_sha256: canonicalMessageDigest({ ...publication }),
    slots,
  });
}
export function persistCampaignGroupSnapshot(root: string, intent: IssueBatchIntentV1, snapshot: CampaignGroupSnapshotV1): void {
  validateCampaignGroupSnapshot(snapshot);
  withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, snapshot.snapshot_sha256.slice(7), snapshot));
}
export function readCampaignAuditSnapshot(root: string, intent: IssueBatchIntentV1, digest: string): CampaignGroupSnapshotV1 {
  if (!/^sha256:[a-f0-9]{64}$/.test(digest)) auditInvalid('audit snapshot reference is invalid');
  const snapshot = validateCampaignGroupSnapshot(readPlanningRecord(root, intent, digest.slice(7)));
  if (
    snapshot.snapshot_sha256 !== digest ||
    snapshot.intent_sha256 !== intent.intent_sha256 ||
    snapshot.campaign_id !== intent.campaign_id ||
    snapshot.group_number !== intent.group_number
  )
    auditInvalid('audit snapshot belongs to another group');
  return snapshot;
}

/** Called under the campaign CAS lock, after replay and expected-current validation. */
export function requireCampaignGroupTransition(
  root: string,
  campaign: DevelopmentCampaignDefinitionV1,
  events: readonly DevelopmentCampaignEventV1[],
  operation: string,
  refs: readonly string[],
  env?: NodeJS.ProcessEnv,
): void {
  if (!['prepare_group', 'begin_group_audit', 'accept_group', 'complete'].includes(operation)) return;
  const authority = grant(root, campaign, env),
    progress = campaignGroupProgress(events, authority.campaign!.group_count);
  if (operation === 'prepare_group') {
    if (progress.group_number !== progress.accepted_groups || progress.group_number >= progress.group_count)
      throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'next group is not authorized');
    if (progress.group_number > 0) requireAcceptedCampaignGroup(root, campaign, events, progress.group_number, env);
  } else if (operation === 'complete') {
    if (progress.accepted_groups !== progress.group_count)
      throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'all authorized groups must be accepted before complete');
    requireAcceptedCampaignGroup(root, campaign, events, progress.group_number, env);
  } else {
    const intent = oneIntent(root, campaign.campaign_id, progress.group_number);
    if (refs.length !== 1) auditInvalid('audit transition requires one exact group evidence reference');
    if (operation === 'begin_group_audit') {
      const snapshot = readCampaignAuditSnapshot(root, intent, refs[0]!);
      if (buildCampaignGroupSnapshot(root, intent, env).snapshot_sha256 !== snapshot.snapshot_sha256)
        auditInvalid('audit snapshot is stale');
    } else {
      const observation = readPlanningRecord<CampaignFreshAuditObservationV1>(root, intent, refs[0]!.slice(7));
      if (!observation) auditInvalid('fresh audit observation is missing');
      const snapshot = readCampaignAuditSnapshot(root, intent, observation.snapshot_sha256);
      validateCampaignFreshAuditObservation(observation, snapshot);
      if (observation.observation_sha256 !== refs[0]) auditInvalid('audit observation reference differs');
      throw new CampaignFreshAuditError('campaign_audit_unverified', 'fresh audit has no trusted exact-version evidence');
    }
  }
}
function requireAcceptedCampaignGroup(
  root: string,
  campaign: DevelopmentCampaignDefinitionV1,
  events: readonly DevelopmentCampaignEventV1[],
  group: number,
  env?: NodeJS.ProcessEnv,
): CampaignGroupSnapshotV1 {
  grant(root, campaign, env);
  const accepted = events.filter((e) => e.operation === 'accept_group')[group - 1];
  if (!accepted || accepted.evidence_refs.length !== 1) auditInvalid('previous accepted group has no exact audit reference');
  const intent = oneIntent(root, campaign.campaign_id, group),
    reference = accepted.evidence_refs[0]!;
  if (!/^sha256:[a-f0-9]{64}$/.test(reference)) auditInvalid('previous group audit reference is invalid');
  const observation = readPlanningRecord<CampaignFreshAuditObservationV1>(root, intent, reference.slice(7));
  if (!observation) auditInvalid('previous group audit observation is missing');
  const snapshot = readCampaignAuditSnapshot(root, intent, observation.snapshot_sha256);
  validateCampaignFreshAuditObservation(observation, snapshot);
  if (observation.observation_sha256 !== reference) auditInvalid('previous group audit digest differs');
  if (observation.disposition === 'unverified')
    throw new CampaignFreshAuditError('campaign_audit_unverified', 'previous group has no trusted fresh-audit revision evidence');
  return snapshot;
}

export function resolveCampaignAuthorizedTarget(
  root: string,
  campaign: DevelopmentCampaignDefinitionV1,
  events: readonly DevelopmentCampaignEventV1[],
  env?: NodeJS.ProcessEnv,
): string {
  const authority = grant(root, campaign, env),
    progress = campaignGroupProgress(events, authority.campaign!.group_count);
  if (progress.accepted_groups === 0) return campaign.target_revision;
  return requireAcceptedCampaignGroup(root, campaign, events, progress.accepted_groups, env).expected_final_main_sha;
}
export function resolveCampaignGroupBaseline(
  root: string,
  campaign: DevelopmentCampaignDefinitionV1,
  events: readonly DevelopmentCampaignEventV1[],
  group: number,
  env?: NodeJS.ProcessEnv,
): string {
  const authority = grant(root, campaign, env),
    progress = campaignGroupProgress(events, authority.campaign!.group_count);
  if (group !== progress.group_number || group < 1 || group > progress.group_count)
    throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'authoring must use the current lifecycle group');
  if (group === 1) return campaign.target_revision;
  return requireAcceptedCampaignGroup(root, campaign, events, group - 1, env).expected_final_main_sha;
}

export interface RunCampaignFreshAuditInput {
  readonly repo_root: string;
  readonly campaign_id: string;
  readonly group_number: number;
  readonly intent_sha256: string;
  readonly idempotency_key: string;
  readonly gitleaks_bin?: string;
  readonly env?: NodeJS.ProcessEnv;
}
export interface AuditBrowserResult extends IssueAuthoringBrowserResult {
  readonly output?: string;
  readonly meta: IssueAuthoringBrowserResult['meta'] & { readonly providerSessionId?: string; readonly oracle?: { readonly networkCapture?: unknown } };
}
export async function runCampaignFreshAudit(
  input: RunCampaignFreshAuditInput,
  deps: Pick<IssueAuthoringDependencies<AuditBrowserResult>, 'readBinding' | 'consult' | 'now'>,
) {
  const root = input.repo_root,
    intent = readIssueBatchIntent(root, input.campaign_id, input.group_number, input.intent_sha256);
  if (!input.idempotency_key.trim()) auditInvalid('audit idempotency key is required');
  const attemptKey = key('fresh-audit-attempt', input.idempotency_key),
    previous = readPlanningRecord<{
      snapshot_sha256: string;
      observation_sha256: string;
      reservation: CampaignAutomationBudgetReservationV1;
    }>(root, intent, attemptKey);
  if (previous) {
    const snapshot = readCampaignAuditSnapshot(root, intent, previous.snapshot_sha256);
    const observation = validateCampaignFreshAuditObservation(
      readPlanningRecord(root, intent, previous.observation_sha256.slice(7)),
      snapshot,
    );
    appendAutomationUsage({
      repo_root: root,
      reservation: previous.reservation,
      outcome: 'no_progress',
      evidence_refs: [{ ref: `audit-observation:${observation.observation_sha256.slice(7)}`, sha256: automationDigest(observation) }],
      env: input.env,
    });
    return { snapshot, observation, replayed: true };
  }
  const status = readDevelopmentCampaignStatus(root, input.campaign_id, input.env),
    authority = grant(root, status.campaign, input.env);
  const binding = deps.readBinding(root);
  if (binding.error || !binding.binding?.profileDir || binding.binding.profileDirectory !== authority.campaign!.chrome_profile_directory)
    auditInvalid('audit browser profile differs from authorization');
  const snapshot = buildCampaignGroupSnapshot(root, intent, input.env);
  persistCampaignGroupSnapshot(root, intent, snapshot);
  if (status.current.state === 'group_running')
    appendDevelopmentCampaignEvent({
      repo_root: root,
      campaign_id: input.campaign_id,
      operation: 'begin_group_audit',
      expected_current_sha256: status.current.current_sha256,
      idempotency_key: key('audit-begin', snapshot.snapshot_sha256),
      evidence_refs: [snapshot.snapshot_sha256],
      observed_at: (deps.now ?? (() => new Date().toISOString()))(),
      env: input.env,
    });
  const prompt = [
    'Perform a fresh read-only GitHub main audit for this complete campaign group. Use the selected GitHub app. Do not create, edit, close or reopen Issues. Do not change repository files. Do not start another group.',
    `Group snapshot: ${JSON.stringify(snapshot)}`,
    `Issue mapping: ${JSON.stringify(requireCampaignPlanningAuthority(root, intent, input.env).manifest.receipt.issues)}`,
    `Read the exact expected_final_main_sha. Include every slot, including unfilled/not_planned. Return only one JSON object matching this schema: ${JSON.stringify(campaignAuditAnswerSchema(snapshot))}. Use actual observed SHA only when returned by the tool; otherwise null. Do not infer version evidence from this prompt. The local controller independently evaluates version authority.`,
  ].join('\n\n');
  withCampaignPlanningLock(root, intent, () =>
    persistPlanningRecord(root, intent, key('audit-request', attemptKey), {
      snapshot_sha256: snapshot.snapshot_sha256,
      prompt_sha256: messageSha256(prompt),
    }),
  );
  const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority, env: input.env });
  const admission = reserveCampaignAuthoringBudget({
    repo_root: root,
    automation_run_id: budget.budget.automation_run_id,
    expected_budget_sha256: budget.budget.budget_sha256,
    campaign_id: input.campaign_id,
    group_number: input.group_number as 1 | 2 | 3,
    intent_sha256: intent.intent_sha256,
    operation: 'audit',
    idempotency_key: automationDigest({ attemptKey, intent: intent.intent_sha256 }),
    env: input.env,
  });
  if (admission.disposition === 'replayed')
    throw new CampaignFreshAuditError(
      'campaign_audit_reconciliation_required',
      'audit reservation has no settled observation; do not repeat provider I/O',
    );
  const browserInput: IssueAuthoringBrowserInput = {
    repoRoot: root,
    title: `${input.campaign_id} group ${input.group_number} fresh audit`,
    prompt,
    provider: 'oracle',
    chatgptApp: 'GitHub',
    requireSecretScan: true,
    captureNetworkEvidence: true,
    gitleaksBin: input.gitleaks_bin,
    profileDir: binding.binding.profileDir,
    profileDirectory: binding.binding.profileDirectory!,
    dryRun: false,
  };
  const result = await deps.consult(browserInput);
  if (result.status !== 'completed')
    throw new CampaignFreshAuditError(
      'campaign_audit_reconciliation_required',
      'audit provider is not terminal-completed; reservation retained',
    );
  const raw = result.output ?? '';
  const rawRecord = {
    session_ref: result.sessionId,
    answer_sha256: messageSha256(raw),
    network_capture: result.meta.oracle?.networkCapture ?? null,
    output: raw.length <= 2 * 1024 * 1024 ? raw : null,
  };
  withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, key('audit-answer', attemptKey), rawRecord));
  let observation: CampaignFreshAuditObservationV1;
  try {
    if (raw.length > 2 * 1024 * 1024) auditInvalid('audit answer exceeds bound');
    if (
      storedPlanningIntents(root)
        .filter((i) => i.campaign_id === intent.campaign_id)
        .flatMap((i) => listIssueAuthoringSessions(root, i.campaign_id, i.group_number))
        .some((s) => s.session_ref === result.sessionId || s.source_session_ref === result.sessionId)
    )
      auditInvalid('audit reused an authoring session');
    const recommendation = parseCampaignAuditAnswer(raw, snapshot);
    observation = sealCampaignFreshAuditObservation({
      snapshot_sha256: snapshot.snapshot_sha256,
      session_ref: result.sessionId,
      provider_session_ref: result.meta.providerSessionId ?? null,
      answer_sha256: messageSha256(raw),
      recommendation,
      observed_at: (deps.now ?? (() => new Date().toISOString()))(),
    });
    validateCampaignFreshAuditObservation(observation, snapshot);
  } catch (error) {
    appendAutomationUsage({
      repo_root: root,
      reservation: admission.reservation,
      outcome: 'provider_failure',
      evidence_refs: [{ ref: `audit-answer:${attemptKey}`, sha256: automationDigest(rawRecord) }],
      env: input.env,
    });
    throw error;
  }
  withCampaignPlanningLock(root, intent, () => {
    persistPlanningRecord(root, intent, observation.observation_sha256.slice(7), observation);
    persistPlanningRecord(root, intent, attemptKey, {
      snapshot_sha256: snapshot.snapshot_sha256,
      observation_sha256: observation.observation_sha256,
      reservation: admission.reservation,
    });
  });
  appendAutomationUsage({
    repo_root: root,
    reservation: admission.reservation,
    outcome: 'no_progress',
    evidence_refs: [{ ref: `audit-observation:${observation.observation_sha256.slice(7)}`, sha256: automationDigest(observation) }],
    env: input.env,
  });
  return { snapshot, observation, replayed: false };
}
