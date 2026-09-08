import { validateCampaignRevisionRequest, validateCampaignRevisionResult, revisionEvidenceForObservation, type CampaignRevisionResultV2 } from '../../core/automation/campaign-revision-observation';
import { execFileSync } from 'child_process';
import { readStoredProgramAuthorization } from './grant-store';
import { resolve } from 'path';
import { canonicalMessageDigest, messageSha256 } from '../../core/messages/mechanics';
import { automationDigest, type CampaignAutomationBudgetReservationV1 } from '../../core/automation/budget';
import { CampaignFreshAuditError } from '../../core/automation/campaign-fresh-audit';
import { readCampaignBrowserSessionEvidence, type CampaignBrowserSessionEvidenceV1 } from '../../core/automation/campaign-browser-session';
import { withCampaignRevisionAdmission, readCampaignRevisionRecord, persistCampaignRevisionRecord } from './development-campaign-store';
import { readCampaignExternalSourcesPolicyAtRevision, readDevelopmentCampaignPolicyAtRevision } from './development-campaign-policy';
import { requireManualGithubPolicy } from '../external-sources/policy';
import { ensureCampaignAuthoringBudget, reserveCampaignRevisionObservationBudget, appendAutomationUsage } from './budget-store';
import type { IssueAuthoringDependencies, IssueAuthoringBrowserResult } from './gpt-pro-issue-authoring';

interface RevisionBrowserResult extends IssueAuthoringBrowserResult {
  readonly output?: string;
  readonly meta: IssueAuthoringBrowserResult['meta'] & { readonly providerSessionId?: string; readonly oracle?: { readonly networkCapture?: unknown; readonly conversationCapture?: unknown } };
}
function refuse(message: string): never {
  throw new CampaignFreshAuditError('campaign_audit_reconciliation_required', message);
}

/** Capture first-revision evidence without pretending that an active group already completed. */
export async function runCampaignRevisionObservation(input: {
  readonly repo_root: string; readonly authorization_sha256: string; readonly gitleaks_bin?: string; readonly env?: NodeJS.ProcessEnv;
}, deps: Pick<IssueAuthoringDependencies<RevisionBrowserResult>, 'readBinding' | 'consult'>) {
  const root = resolve(input.repo_root);
  const authority = readStoredProgramAuthorization(root, input.authorization_sha256, input.env);
  if (!authority.campaign || authority.merge_mode !== 'manual') refuse('revision observation requires a manual campaign grant');
  const campaignId = authority.campaign.campaign_id;
  const settle = (rawRecord: unknown, rawRequest: unknown, replayed: boolean) => {
    const request = validateCampaignRevisionRequest(rawRequest);
    const record = validateCampaignRevisionResult(rawRecord, request);
    const requestDigest = automationDigest(request);
    if (request.authorization_sha256 !== authority.authorization_sha256 || request.campaign_id !== campaignId
      || request.repository_id !== authority.repository_id || request.target_ref !== authority.target_ref || request.target_revision !== authority.target_revision
      || (record.browser_session && record.browser_session.repo_root !== root)) refuse('saved revision observation authority differs');
    if (record.request_sha256 !== requestDigest) refuse('revision observation request differs from saved result');
    if (record.browser_status !== 'completed') refuse('revision observation is unresolved; reservation retained without repeat provider I/O');
    appendAutomationUsage({ repo_root: root, reservation: record.reservation,
      outcome: record.revision_evidence === 'verified' ? 'progress' : record.browser_session && record.output !== null ? 'no_progress' : 'provider_failure',
      evidence_refs: [{ ref: `revision-observation:${requestDigest}`, sha256: automationDigest(record) }], env: input.env });
    return { request_sha256: requestDigest, observation_sha256: canonicalMessageDigest({ ...record }),
      session_ref: record.session_ref, provider_session_ref: record.provider_session_ref,
      browser_session: record.browser_session, network_capture: record.network_capture,
      revision_evidence: record.revision_evidence, replayed };
  };
  const savedRequest = readCampaignRevisionRecord<Record<string, unknown>>(root, campaignId, 'request');
  const savedResult = readCampaignRevisionRecord<CampaignRevisionResultV2>(root, campaignId, 'result');
  if (savedResult) {
    if (!savedRequest || savedRequest.authorization_sha256 !== authority.authorization_sha256 || savedRequest.campaign_id !== campaignId)
      refuse('saved revision observation belongs to another authorization');
    return settle(savedResult, savedRequest, true);
  }
  const assertCurrentTarget = () => {
    if (Date.parse(authority.expires_at) <= Date.now()) refuse('revision observation authorization expired');
    const target = execFileSync('git', ['rev-parse', '--verify', `${authority.target_ref}^{commit}`], { cwd: root, encoding: 'utf8' }).trim();
    if (target !== authority.target_revision) refuse('revision observation authorized target moved');
    return target;
  };
  const target = assertCurrentTarget();
  if (readDevelopmentCampaignPolicyAtRevision(root, target).mode === 'off') refuse('revision observation requires enabled campaign policy');
  const policy = requireManualGithubPolicy(readCampaignExternalSourcesPolicyAtRevision(root, target));
  withCampaignRevisionAdmission(root, campaignId, authority.authorization_sha256, () => undefined);
  const binding = deps.readBinding(root);
  if (binding.error || !binding.binding?.profileDir || binding.binding.profileDirectory !== authority.campaign!.chrome_profile_directory)
    refuse('revision observation browser profile differs from authorization');
  const prompt = [
    'Perform a fresh read-only revision observation using the selected GitHub app. This is pre-active evidence collection, not a completed-group audit.',
    `Repository: ${policy.github.repository}. Target ref: ${authority.target_ref}. Requested exact commit: ${authority.target_revision}.`,
    'Use GitHub to read the exact commit resource and the target branch ref resource. Return only one JSON object with observed_main_sha (the commit actually returned by the tool, or null) and summary (a string). Do not add markdown or citations to the final JSON. Do not echo the requested SHA as observed evidence; the controller verifies the original tool returns separately.',
    'Do not create, edit, close or reopen Issues. Do not change files, branches, PRs, labels or repository settings. Do not start any campaign group. The controller retains original tool transport separately and does not treat your answer as a version receipt.',
  ].join('\n\n');
  const request = {
    protocol: 2 as const, kind: 'repo-harness-campaign-revision-observation-request' as const,
    campaign_id: campaignId, authorization_sha256: authority.authorization_sha256,
    repository_id: authority.repository_id, provider_repository: policy.github.repository,
    target_ref: authority.target_ref, target_revision: authority.target_revision,
    profile_dir: binding.binding.profileDir, profile_directory: binding.binding.profileDirectory,
    prompt, prompt_sha256: messageSha256(prompt),
  };
  validateCampaignRevisionRequest(request);
  const requestDigest = automationDigest(request);
  // The fixed immutable request also rejects a changed binding under the same campaign.
  persistCampaignRevisionRecord(root, campaignId, 'request', request, authority.authorization_sha256);
  const started = withCampaignRevisionAdmission(root, campaignId, authority.authorization_sha256, () => {
    assertCurrentTarget();
    const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority, env: input.env });
    const admission = reserveCampaignRevisionObservationBudget({ repo_root: root, campaign_id: campaignId,
      automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256,
      request_sha256: requestDigest, env: input.env });
    if (admission.disposition === 'replayed') refuse('revision observation reservation is unresolved; do not repeat provider I/O');
    const pending = deps.consult({ repoRoot: root, title: `${campaignId} pre-active revision observation`, prompt,
      provider: 'oracle', chatgptApp: 'GitHub', requireSecretScan: true, captureNetworkEvidence: true, captureConversationEvidence: true,
      profileDir: binding.binding!.profileDir, profileDirectory: binding.binding!.profileDirectory!,
      gitleaksBin: input.gitleaks_bin, dryRun: false });
    return { admission, pending };
  });
  const result = await started.pending;
  const raw = result.output ?? '';
  const draft: CampaignRevisionResultV2 = { protocol: 2, kind: 'repo-harness-campaign-revision-observation-result', request_sha256: requestDigest, reservation: started.admission.reservation,
    session_ref: result.sessionId, provider_session_ref: result.meta.providerSessionId ?? null,
    browser_status: result.status, browser_session: readCampaignBrowserSessionEvidence(result, {
      repoRoot: root, profileDir: binding.binding.profileDir, profileDirectory: binding.binding.profileDirectory!,
      sourceSessionId: null, parentProviderSessionId: null }),
    network_capture: result.meta.oracle?.networkCapture ?? null, conversation_capture: result.meta.oracle?.conversationCapture ?? null, answer_sha256: messageSha256(raw),
    output: Buffer.byteLength(raw) <= 2 * 1024 * 1024 ? raw : null, revision_evidence: 'unavailable' };
  const record = validateCampaignRevisionResult({ ...draft, revision_evidence: revisionEvidenceForObservation(request, draft) ? 'verified' : 'unavailable' }, request);
  persistCampaignRevisionRecord(root, campaignId, 'result', record, authority.authorization_sha256);
  return settle(record, request, false);
}
