import { assertStoppedAdoptedResumeEligible, assertReplaceableStoppedSuccessor, assertResumedAuthoringTarget, bindAdoptedResume, resolveEffectiveContinuation, validateAdoptedResumeSource, type AdoptedResumeSource, type ContinuationReplacementBasis } from './campaign-authoring-resume';
import { readCampaignProtectionAtRevision } from './campaign-protection';
import { campaignAutomationRunId } from '../../core/automation/campaign-authoring-budget';
import { campaignGithubPrompt, readCampaignBrowserSessionEvidence } from '../../core/automation/campaign-browser-session';
import { resolveCampaignGroupAuthoringContext } from './campaign-fresh-audit';
import { readCampaignCapabilityIdsAtRevision } from './campaign-capability-registry';
import { issueBatchMetadataAuthoringSchema, ISSUE_BATCH_METADATA_KIND } from '../../core/automation/issue-batch-reconcile';
import { resolve } from 'path';

import { automationDigest, type ProgramAuthorizationV1 } from '../../core/automation/budget';
import { ensureCampaignAuthoringBudget, reserveCampaignAuthoringBudget, appendAutomationUsage, readAutomationBudgetStatus, readCampaignBudgetLedger } from './budget-store';

import { messageSha256 } from '../../core/messages/mechanics';
import {
  buildIssueAuthoringSession,
  buildIssueBatchIntent,
  renderIssueBatchMarker,
  type IssueAuthoringOperation,
  type IssueAuthoringSessionV2,
  type IssueBatchIntentV1,
  type IssueBatchSlot,
} from '../../core/automation/issue-batch';
import { assertAuthorityBinding, readDevelopmentCampaignStatus, readExactAuthorityBinding } from './development-campaign-store';
import { readDevelopmentCampaignPolicyAtRevision, readCampaignExternalSourcesPolicyAtRevision } from './development-campaign-policy';
import { requireManualGithubPolicy } from '../external-sources/policy';
import { assertIssueAuthoringSourceSession, readExistingIssueBatchIntent, readIssueBatchAdoptionArtifact, persistIssueAuthoringSession, persistIssueBatchIntent, readIssueBatchIntent } from './issue-batch-store';

export class GptProIssueAuthoringError extends Error {
  constructor(readonly code: 'issue_authoring_invalid' | 'issue_authoring_state_invalid' | 'issue_authoring_profile_mismatch' | 'issue_authoring_reconciliation_required', message: string) {
    super(message);
    this.name = 'GptProIssueAuthoringError';
  }
}

export interface IssueAuthoringBrowserInput {
  readonly repoRoot: string;
  readonly title: string;
  readonly prompt: string;
  readonly provider: 'oracle';
  readonly chatgptApp: null;
  readonly requireSecretScan: true;
  readonly captureNetworkEvidence?: true;
  readonly captureConversationEvidence?: true;
  readonly gitleaksBin?: string;
  readonly profileDir: string;
  readonly profileDirectory: string;
  readonly dryRun: boolean;
}

export interface IssueAuthoringBrowserResult {
  readonly sessionId: string;
  readonly status: IssueAuthoringSessionV2['browser_status'];
  readonly meta: { readonly model: { readonly verified?: boolean } };
}

// The caller supplies browser I/O; the effect owns authorization, ordering and persistence.
export interface IssueAuthoringDependencies<Result extends IssueAuthoringBrowserResult> {
  readonly readBinding: (repoRoot: string) => {
    readonly path: string;
    readonly binding?: { readonly profileDir: string; readonly profileDirectory?: string };
    readonly error?: string;
  };
  readonly consult: (input: IssueAuthoringBrowserInput) => Promise<Result>;
  readonly followup: (input: IssueAuthoringBrowserInput & { readonly sessionId: string }) => Promise<Result>;
  readonly now?: () => string;
}

export interface StartIssueBatchAuthoringInput {
  readonly repo_root: string;
  readonly campaign_id: string;
  readonly group_number: number;
  readonly env?: NodeJS.ProcessEnv;
  readonly dry_run?: boolean;
  readonly gitleaks_bin?: string;
  readonly step_admission_sha256?: string | null;
  readonly resume_from?: unknown;
}

export interface ContinueIssueBatchAuthoringInput extends StartIssueBatchAuthoringInput {
  readonly intent_sha256: string;
  readonly source_session_ref: string;
  readonly operation: 'fill_missing' | 'edit_issue';
  readonly requested_slots: readonly IssueBatchSlot[];
  readonly provider_issue_id?: string;
  readonly provider_issue_url?: string;
}

function fail(code: GptProIssueAuthoringError['code'], message: string): never { throw new GptProIssueAuthoringError(code, message); }
function exactSlots(value: readonly IssueBatchSlot[], intent: IssueBatchIntentV1): readonly IssueBatchSlot[] {
  if (value.length === 0 || value.length > intent.slots.length || new Set(value).size !== value.length || JSON.stringify(value) !== JSON.stringify([...value].sort())
    || value.some((slot) => !intent.slots.includes(slot))) fail('issue_authoring_invalid', 'requested slots must be a sorted unique subset of the intent');
  return Object.freeze([...value]);
}

function markerExamples(intent: Pick<IssueBatchIntentV1, 'campaign_id' | 'group_number'>, slots: readonly IssueBatchSlot[]): string {
  return slots.map((slot) => `Slot ${slot}:\n${renderIssueBatchMarker(intent.campaign_id, intent.group_number, slot)}`).join('\n\n');
}

function providerIssueUrl(value: string | undefined, repository: string): string | null {
  const input = value?.trim();
  if (!input) return null;
  let parsed: URL;
  try { parsed = new URL(input); }
  catch { return null; }
  const escapedRepository = repository.split('/').map((part) => part.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')).join('/');
  const issuePath = new RegExp(`^/${escapedRepository}/issues/[1-9]\\d*$`, 'u');
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com' || parsed.port !== '' || parsed.username !== '' || parsed.password !== ''
    || parsed.search !== '' || parsed.hash !== '' || !issuePath.test(parsed.pathname)) return null;
  return parsed.toString();
}

export function buildIssueAuthoringPrompt(intent: Omit<IssueBatchIntentV1, 'prompt_sha256' | 'intent_sha256'>, operation: IssueAuthoringOperation, requestedSlots: readonly IssueBatchSlot[], providerIssueId: string | null, providerIssueUrl: string | null, capabilityIds: readonly string[], followups: readonly string[] = [], resumeAction?: string): string {
  const action = resumeAction ?? (operation === 'initial'
    ? `Create exactly one GitHub Issue for each listed slot: ${requestedSlots.join(', ')}.`
    : operation === 'fill_missing'
      ? `In the existing authoring conversation, create Issues only for these missing slots: ${requestedSlots.join(', ')}. Do not edit or duplicate any other slot.`
      : `Edit only the GitHub Issue at exact URL ${providerIssueUrl}, whose opaque GitHub database ID is exactly ${providerIssueId}. Read that exact URL first and verify its database ID is exactly ${providerIssueId}; if it differs or cannot be verified, stop without editing. Update its body with the exact marker for slot ${requestedSlots[0]}. Do not create a new Issue.`);
  return [
    'You are the GPT Pro Issue Author for a bounded repo-harness repair campaign.',
    `Target GitHub repository: ${intent.provider_repository}`,
    `Registered repository id: ${intent.repository_id}`,
    `Read exact ref ${intent.target_ref} at commit ${intent.base_main_sha}. Do not read or act on another revision.`,
    ...(followups.length ? ['Previous accepted audit follow-ups (authoring context only; retain the exact requested slots and allowed issue kinds):', JSON.stringify(followups)] : []),
    action,
    `Allowed issue kinds: ${intent.allowed_issue_kinds.join(', ')}.`,
    'You may read that exact commit and create the requested Issues, or edit only the explicitly named Issue. Do not change code, branches, PRs, labels, milestones, assignees, or close Issues.',
    'The title prefix is display-only. The body marker below is the sole slot authority. Copy it exactly; do not add hashes, digests, or extra keys inside the marker.',
    markerExamples(intent, requestedSlots),

    'Each Issue body must state the audit baseline and contain exactly one JSON fence: an opening line of ```json, JSON on following lines, and a closing line of ```. Do not use any other JSON fences in the body.',
    `The metadata object has exactly seven keys (no extra keys): protocol must be the number 1; kind must be "${ISSUE_BATCH_METADATA_KIND}"; issue_kind must be "bugfix" or "test_gap" and permitted by the allowed kinds above; primary_capability must be a non-blank string naming the actual capability; priority must be a numeric safe integer in 0–100.`,
    'depends_on_slots and suspected_paths must be arrays of non-blank strings, sorted in ascending JavaScript string order with no duplicates. Empty arrays are allowed. Do not guess missing metadata; report inability to author a valid Issue.',
    'Syntax example only: replace the capability and paths with observed facts for the Issue.',
    '```json\n' + JSON.stringify({ protocol: 1, kind: ISSUE_BATCH_METADATA_KIND, issue_kind: 'bugfix', primary_capability: 'capability.example', priority: 50, depends_on_slots: [], suspected_paths: ['src/a.ts', 'src/z.ts'] }, null, 2) + '\n```',
    `Metadata schema (use only these exact capability IDs; never invent names): ${JSON.stringify(issueBatchMetadataAuthoringSchema(capabilityIds, intent.slots))}`,

    'Do not claim success for an Issue you did not observe GitHub create or update. Return a concise action log; the local controller will independently read GitHub.',
  ].join('\n\n');
}

function context(input: StartIssueBatchAuthoringInput, readBinding: IssueAuthoringDependencies<IssueAuthoringBrowserResult>['readBinding']) {
  const repoRoot = resolve(input.repo_root);
  const status = readDevelopmentCampaignStatus(repoRoot, input.campaign_id, input.env);
  if (status.current.state !== 'group_preparing') fail('issue_authoring_state_invalid', 'issue authoring requires campaign state group_preparing');
  const authorization = assertAuthorityBinding(repoRoot, status.campaign, input.env ?? process.env);
  if (authorization.campaign === null) fail('issue_authoring_invalid', 'campaign authorization payload is missing');
  if (input.group_number < 1 || input.group_number > authorization.campaign.group_count) fail('issue_authoring_invalid', 'group_number exceeds campaign authorization');
  const externalPolicy = requireManualGithubPolicy(readCampaignExternalSourcesPolicyAtRevision(repoRoot, status.campaign.target_revision));
  const bindingResult = readBinding(repoRoot);
  if (bindingResult.error || !bindingResult.binding?.profileDir || !bindingResult.binding.profileDirectory) fail('issue_authoring_profile_mismatch', `ChatGPT browser binding is unavailable: ${bindingResult.error ?? bindingResult.path}`);
  if (bindingResult.binding.profileDirectory !== authorization.campaign.chrome_profile_directory) fail('issue_authoring_profile_mismatch', 'ChatGPT browser profile does not match the campaign authorization');
  const { baseMain, followups } = resolveCampaignGroupAuthoringContext(repoRoot, status.campaign, status.events, input.group_number, input.env);
  if (readDevelopmentCampaignPolicyAtRevision(repoRoot, baseMain).mode === 'active') readCampaignProtectionAtRevision(repoRoot, baseMain);
  return { repoRoot, status, authorization, externalPolicy, binding: bindingResult.binding, baseMain, followups };
}

function browserInput(repoRoot: string, prompt: string, profileDir: string, profileDirectory: string, input: StartIssueBatchAuthoringInput): IssueAuthoringBrowserInput {
  return {
    repoRoot, title: `${input.campaign_id} group ${input.group_number} issue authoring`, prompt: campaignGithubPrompt(prompt),
    provider: 'oracle', chatgptApp: null, requireSecretScan: true, captureConversationEvidence: true, gitleaksBin: input.gitleaks_bin,
    profileDir, profileDirectory, dryRun: input.dry_run === true,
  };
}

function persistSession(repoRoot: string, intent: IssueBatchIntentV1, operation: IssueAuthoringOperation, requestedSlots: readonly IssueBatchSlot[], providerIssueId: string | null, sourceSessionRef: string | null, result: IssueAuthoringBrowserResult, createdAt: string, profileDir: string): IssueAuthoringSessionV2 {
  const parent = sourceSessionRef === null ? null : assertIssueAuthoringSourceSession(repoRoot, intent.campaign_id, intent.group_number, intent.intent_sha256, sourceSessionRef).browser_evidence;
  const evidence = readCampaignBrowserSessionEvidence(result, { repoRoot, profileDir, profileDirectory: intent.chrome_profile_directory, sourceSessionId: sourceSessionRef, parentProviderSessionId: parent?.provider_session_ref ?? null });
  return persistIssueAuthoringSession(repoRoot, intent.campaign_id, intent.group_number, buildIssueAuthoringSession({
    intent_sha256: intent.intent_sha256, operation, requested_slots: requestedSlots, provider_issue_id: providerIssueId,
    session_ref: result.sessionId, source_session_ref: sourceSessionRef, browser_status: result.status,
    browser_evidence: evidence, created_at: createdAt,
  }));
}

function prepareBudgetedAuthoring<Result extends IssueAuthoringBrowserResult>(
  input: StartIssueBatchAuthoringInput,
  authorization: ProgramAuthorizationV1,
  intent: IssueBatchIntentV1,
  operation: IssueAuthoringOperation,
  prompt: string,
  sourceSessionRef: string | null,
  invoke: () => Promise<Result>,
  persist: (result: Result) => IssueAuthoringSessionV2,
) {
  const admission = input.dry_run === true ? null : (() => {
    const status = ensureCampaignAuthoringBudget({ repo_root: input.repo_root, authorization, env: input.env });
    return reserveCampaignAuthoringBudget({
      repo_root: input.repo_root, automation_run_id: status.budget.automation_run_id,
      expected_budget_sha256: status.budget.budget_sha256, campaign_id: intent.campaign_id,
      group_number: intent.group_number as 1 | 2 | 3, intent_sha256: intent.intent_sha256,
      step_admission_sha256: input.step_admission_sha256 ?? null,
      operation, idempotency_key: automationDigest({ intent_sha256: intent.intent_sha256, operation, prompt, source_session_ref: sourceSessionRef }), env: input.env,
    });
  })();
  if (admission?.disposition === 'replayed') {
    fail('issue_authoring_reconciliation_required', 'authoring reservation already exists; reconcile its durable result instead of repeating provider I/O');
  }
  let invoked = false;
  return Object.freeze({
    intent,
    execute: async () => {
      if (invoked) fail('issue_authoring_reconciliation_required', 'authoring admission has already been invoked');
      invoked = true;
      const result = await invoke();
      const session = persist(result);
      if (admission !== null && result.status === 'completed') {
        appendAutomationUsage({
          repo_root: input.repo_root, reservation: admission.reservation, env: input.env,
          outcome: 'progress',
          evidence_refs: [{ ref: `provider-run:${result.sessionId}`, sha256: automationDigest(session) }],
        });
      }
      return Object.freeze({ intent, session, browser: result });
    },
  });
}

/** A new run obtains new provider evidence; stopped source artifacts remain historical. */
function resumeAuthoringAction(input: StartIssueBatchAuthoringInput, slots: readonly IssueBatchSlot[], repository: string): { action: string; adoptedSource?: AdoptedResumeSource; supersedes?: ContinuationReplacementBasis } | undefined {
  if (input.resume_from === undefined) return undefined;
  const raw = input.resume_from;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) fail('issue_authoring_invalid', 'resume_from must be an object');
  const request = raw as Record<string, unknown>;
  const keys = Object.keys(request).sort().join(',');
  if ((keys !== 'campaign_id,group_number,intent_sha256,issues,source_session_ref'
    && keys !== 'campaign_id,group_number,intent_sha256,issues,source_session_ref,supersedes')
    || typeof request.campaign_id !== 'string' || request.campaign_id === input.campaign_id
    || !Number.isSafeInteger(request.group_number) || typeof request.intent_sha256 !== 'string'
    || typeof request.source_session_ref !== 'string' || !Array.isArray(request.issues)) fail('issue_authoring_invalid', 'resume_from fields are invalid');
  const supersedesRequest = request.supersedes === undefined ? null : (() => {
    const value = request.supersedes;
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('issue_authoring_invalid', 'resume supersedes must be an object');
    const entry = value as Record<string, unknown>;
    if (Object.keys(entry).sort().join(',') !== 'campaign_id,group_number,intent_sha256'
      || typeof entry.campaign_id !== 'string' || entry.campaign_id === input.campaign_id || entry.campaign_id === request.campaign_id
      || !Number.isSafeInteger(entry.group_number) || typeof entry.intent_sha256 !== 'string') fail('issue_authoring_invalid', 'resume supersedes fields are invalid');
    return { campaign_id: entry.campaign_id, group_number: entry.group_number as number, intent_sha256: entry.intent_sha256 };
  })();
  const old = readIssueBatchIntent(input.repo_root, request.campaign_id, request.group_number as number, request.intent_sha256);
  // Eligibility is decided from canonical stores before any write, reservation or provider dispatch.
  const supersededIntent = supersedesRequest === null ? null
    : readIssueBatchIntent(input.repo_root, supersedesRequest.campaign_id, supersedesRequest.group_number, supersedesRequest.intent_sha256);
  if (supersededIntent !== null && (supersededIntent.repository_id !== old.repository_id
    || supersededIntent.provider_repository !== old.provider_repository
    || JSON.stringify(supersededIntent.slots) !== JSON.stringify(old.slots))) fail('issue_authoring_invalid', 'resume supersedes names another repository scope');
  const supersedes = supersededIntent === null ? undefined : assertReplaceableStoppedSuccessor(input.repo_root, supersededIntent, input.env);
  const source = assertIssueAuthoringSourceSession(input.repo_root, old.campaign_id, old.group_number, old.intent_sha256, request.source_session_ref);
  const status = readDevelopmentCampaignStatus(input.repo_root, old.campaign_id, input.env);
  const grant = readExactAuthorityBinding(input.repo_root, status.campaign, input.env ?? process.env);
  const run = campaignAutomationRunId({ repository_id: old.repository_id, campaign_id: old.campaign_id });
  const budget = readAutomationBudgetStatus(input.repo_root, run, input.env);
  const ledger = readCampaignBudgetLedger(input.repo_root, run, input.env);
  const next = readDevelopmentCampaignStatus(input.repo_root, input.campaign_id, input.env);
  const publication = readIssueBatchAdoptionArtifact(input.repo_root, old, 'publication');
  const adopted = publication !== null;
  if (adopted) assertStoppedAdoptedResumeEligible(input.repo_root, old, input.env);
  if (old.repository_id !== next.campaign.repository_id || old.provider_repository !== repository
    || old.target_ref !== next.campaign.target_ref || source.verification !== 'verified'
    || (adopted ? status.current.state !== 'stopped'
      : status.current.state !== 'group_preparing' || budget.current.state !== 'budget_exhausted' || !budget.stop_receipt)
    || budget.budget.authorization.authorization_sha256 !== grant.authorization_sha256
    || budget.current.open_reservation_sha256s.length !== 0 || ledger.active_step !== null
    || JSON.stringify(old.slots) !== JSON.stringify(slots)) fail('issue_authoring_invalid', 'resume requires a verified quiescent predecessor: exhausted pre-adoption or stopped settled publication, with identical repository scope');
  /**
   * Issue identity and last confirmed remote modification are two data with two authorities: the
   * source adoption still decides slot, database ID and URL, while every superseded chain link
   * whose verified sessions marked a slot contributes the marker that slot may currently carry.
   */
  const markerLinks = supersedes
    ? (() => {
      // Most recent first. A retry after an interrupted replacement already finds its own link in
      // the chain, so the requested successor is prepended only when the chain does not carry it.
      const links = [...resolveEffectiveContinuation(input.repo_root, old).replacements].reverse()
        .map((entry) => ({ intent_sha256: entry.superseded.intent_sha256, campaign_id: entry.superseded.campaign_id,
          group_number: entry.superseded.group_number, marked_slots: entry.evidence.marked_slots }));
      if (!links.some((link) => link.intent_sha256 === supersedes.superseded.intent_sha256)) {
        links.unshift({ intent_sha256: supersedes.superseded.intent_sha256, campaign_id: supersedes.superseded.campaign_id,
          group_number: supersedes.superseded.group_number, marked_slots: supersedes.evidence.marked_slots });
      }
      return links;
    })()
    : [];
  const targets = request.issues.map((rawIssue: unknown) => {
    if (!rawIssue || typeof rawIssue !== 'object' || Array.isArray(rawIssue)) fail('issue_authoring_invalid', 'resume issue must be an object');
    const issue = rawIssue as Record<string, unknown>;
    if (Object.keys(issue).sort().join(',') !== 'provider_issue_id,provider_issue_url,slot'
      || typeof issue.slot !== 'string' || typeof issue.provider_issue_id !== 'string' || !issue.provider_issue_id.trim()
      || typeof issue.provider_issue_url !== 'string') fail('issue_authoring_invalid', 'resume issue fields are invalid');
    const url = providerIssueUrl(issue.provider_issue_url, repository);
    if (!url) fail('issue_authoring_invalid', 'resume issue URL is outside the authorized repository');
    const slot = issue.slot as IssueBatchSlot;
    return { slot: issue.slot, provider_issue_id: issue.provider_issue_id, provider_issue_url: url,
      previous_markers: [
        ...markerLinks.filter((link) => link.marked_slots.includes(slot)).map((link) => renderIssueBatchMarker(link.campaign_id, link.group_number, slot)),
        renderIssueBatchMarker(old.campaign_id, old.group_number, slot),
      ] };
  });
  if (JSON.stringify(targets.map(t => t.slot)) !== JSON.stringify(slots)
    || new Set(targets.map(t => t.provider_issue_id)).size !== targets.length
    || new Set(targets.map(t => t.provider_issue_url)).size !== targets.length) fail('issue_authoring_invalid', 'resume must name each slot once with unique exact Issue identities');
  const adoptedSource = adopted ? { intent: old, source_session_ref: source.session_ref, issues: targets.map(({ previous_markers, ...issue }) => issue) } : undefined;
  if (adoptedSource) validateAdoptedResumeSource(input.repo_root, adoptedSource, next.campaign.target_revision);
  return { adoptedSource, supersedes, action: `Source intent: ${old.intent_sha256}; source session: ${source.session_sha256}; terminal evidence: ${adopted ? status.current.current_sha256 : budget.stop_receipt!.stop_receipt_sha256}.${supersedes ? ` Superseded successor: ${supersedes.superseded.campaign_id} intent ${supersedes.superseded.intent_sha256}.` : ''} Resume only these existing Issues from the stopped campaign. Do not create any Issue. Before any edit, read every exact URL and verify its opaque GitHub database ID equals the manifest entry, then verify that the body contains exactly one repo-harness-campaign marker and that this marker is one of that entry's previous_markers; report which one you observed. If a body carries any other marker, no marker, more than one marker, or cannot be read, stop without editing that Issue. Then re-audit the new exact baseline and update only these Issues, replacing their old markers with the new slot markers and using the current metadata schema. Preserve their scope; if it is no longer valid, report inability instead of inventing a replacement.\n${JSON.stringify(targets)}` };
}

export async function startIssueBatchAuthoring<Result extends IssueAuthoringBrowserResult>(input: StartIssueBatchAuthoringInput, deps: Pick<IssueAuthoringDependencies<Result>, 'readBinding' | 'consult' | 'now'>) {
  const value = context(input, deps.readBinding);
  const existing = input.resume_from === undefined ? null : readExistingIssueBatchIntent(value.repoRoot, input.campaign_id, input.group_number);
  // Recompute all authority and prompt fields; only the immutable creation time is reused.
  const createdAt = existing?.created_at ?? (deps.now ?? (() => new Date().toISOString()))();
  const slots = Object.freeze(Array.from({ length: value.authorization.campaign!.issues_per_group }, (_, index) => String(index + 1).padStart(2, '0') as IssueBatchSlot));
  const draft = {
    campaign_id: input.campaign_id, group_number: input.group_number,
    repository_id: value.status.campaign.repository_id, provider_repository: value.externalPolicy.github.repository,
    target_ref: value.status.campaign.target_ref, base_main_sha: value.baseMain,
    slots, allowed_issue_kinds: value.authorization.campaign!.allowed_issue_kinds,
    authoring_policy_sha256: value.externalPolicy.policy_revision,
    authoring_parent: value.authorization.campaign!.local_parent_host,
    gpt_pro_transport: 'oracle_browser' as const, browser_transport: 'copy_profile' as const,
    chrome_profile_directory: value.authorization.campaign!.chrome_profile_directory,
    created_at: createdAt, expires_at: value.authorization.expires_at,
  };
  const resume = resumeAuthoringAction(input, slots, value.externalPolicy.github.repository);
  const prompt = buildIssueAuthoringPrompt({ ...draft, protocol: 1, kind: 'repo-harness-issue-batch-intent' }, 'initial', slots, null, null, readCampaignCapabilityIdsAtRevision(value.repoRoot, draft.base_main_sha), value.followups, resume?.action);
  const intent = buildIssueBatchIntent({ ...draft, prompt_sha256: messageSha256(prompt) });
  persistIssueBatchIntent(value.repoRoot, intent);
  if (resume?.adoptedSource) bindAdoptedResume(value.repoRoot, intent, resume.adoptedSource, resume.supersedes);
  return prepareBudgetedAuthoring(input, value.authorization, intent, 'initial', prompt, null,
    () => deps.consult(browserInput(value.repoRoot, prompt, value.binding.profileDir, value.binding.profileDirectory!, input)),
    (result) => persistSession(value.repoRoot, intent, 'initial', slots, null, null, result, createdAt, value.binding.profileDir),
  ).execute();
}

export function prepareIssueBatchAuthoringContinuation<Result extends IssueAuthoringBrowserResult>(input: ContinueIssueBatchAuthoringInput, deps: Pick<IssueAuthoringDependencies<Result>, 'readBinding' | 'followup' | 'now'>) {
  const value = context(input, deps.readBinding);
  const intent = readIssueBatchIntent(value.repoRoot, input.campaign_id, input.group_number, input.intent_sha256);
  if (intent.repository_id !== value.status.campaign.repository_id || intent.provider_repository !== value.externalPolicy.github.repository
    || intent.target_ref !== value.status.campaign.target_ref || intent.base_main_sha !== value.baseMain
    || intent.chrome_profile_directory !== value.authorization.campaign!.chrome_profile_directory) fail('issue_authoring_invalid', 'issue batch intent binding is stale');
  const source = assertIssueAuthoringSourceSession(value.repoRoot, input.campaign_id, input.group_number, intent.intent_sha256, input.source_session_ref);
  if (!source.browser_evidence) fail('issue_authoring_state_invalid', 'source session evidence is required before continuing authoring');
  if (source.browser_evidence.repo_root !== value.repoRoot || source.browser_evidence.profile_dir !== value.binding.profileDir
    || source.browser_evidence.profile_directory !== value.binding.profileDirectory) fail('issue_authoring_profile_mismatch', 'source session profile binding differs from current authoring binding');
  const requested = exactSlots(input.requested_slots, intent);
  const providerIssueId = input.operation === 'edit_issue' ? input.provider_issue_id?.trim() || null : null;
  const locator = input.operation === 'edit_issue' ? providerIssueUrl(input.provider_issue_url, intent.provider_repository) : null;
  if (input.operation === 'edit_issue' && (requested.length !== 1 || providerIssueId === null || locator === null)) fail('issue_authoring_invalid', 'edit_issue requires one slot, provider_issue_id, and an exact provider_issue_url');
  if (input.operation === 'fill_missing' && (input.provider_issue_id !== undefined || input.provider_issue_url !== undefined)) fail('issue_authoring_invalid', 'fill_missing forbids provider_issue_id and provider_issue_url');
  assertResumedAuthoringTarget(value.repoRoot, intent, input.operation, requested, providerIssueId, locator);
  const prompt = buildIssueAuthoringPrompt(intent, input.operation, requested, providerIssueId, locator, readCampaignCapabilityIdsAtRevision(value.repoRoot, intent.base_main_sha), value.followups);
  return prepareBudgetedAuthoring(input, value.authorization, intent, input.operation, prompt, input.source_session_ref,
    () => deps.followup({
      ...browserInput(value.repoRoot, prompt, value.binding.profileDir, value.binding.profileDirectory!, input),
      sessionId: input.source_session_ref,
    }),
    (result) => persistSession(value.repoRoot, intent, input.operation, requested, providerIssueId, input.source_session_ref, result, (deps.now ?? (() => new Date().toISOString()))(), value.binding.profileDir),
  );
}

export async function continueIssueBatchAuthoring<Result extends IssueAuthoringBrowserResult>(input: ContinueIssueBatchAuthoringInput, deps: Pick<IssueAuthoringDependencies<Result>, 'readBinding' | 'followup' | 'now'>) {
  return prepareIssueBatchAuthoringContinuation(input, deps).execute();
}
