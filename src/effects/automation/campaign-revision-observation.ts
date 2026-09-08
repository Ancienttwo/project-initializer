import { resolve } from 'path';
import { canonicalMessageDigest, messageSha256 } from '../../core/messages/mechanics';
import { automationDigest, type CampaignAutomationBudgetReservationV1 } from '../../core/automation/budget';
import { CampaignFreshAuditError } from '../../core/automation/campaign-fresh-audit';
import { readCampaignBrowserSessionEvidence, type CampaignBrowserSessionEvidenceV1 } from '../../core/automation/campaign-browser-session';
import { assertAuthorityBinding, readDevelopmentCampaignStatus, readCampaignRevisionRecord, persistCampaignRevisionRecord } from './development-campaign-store';
import { readCampaignExternalSourcesPolicyAtRevision } from './development-campaign-policy';
import { requireManualGithubPolicy } from '../external-sources/policy';
import { ensureCampaignAuthoringBudget, reserveCampaignRevisionObservationBudget, appendAutomationUsage } from './budget-store';
import type { IssueAuthoringDependencies, IssueAuthoringBrowserResult } from './gpt-pro-issue-authoring';

interface RevisionBrowserResult extends IssueAuthoringBrowserResult {
  readonly output?: string;
  readonly meta: IssueAuthoringBrowserResult['meta'] & { readonly providerSessionId?: string; readonly oracle?: { readonly networkCapture?: unknown } };
}
interface RevisionResult {
  readonly request_sha256: string;
  readonly reservation: CampaignAutomationBudgetReservationV1;
  readonly session_ref: string;
  readonly provider_session_ref: string | null;
  readonly browser_status: RevisionBrowserResult['status'];
  readonly browser_session: CampaignBrowserSessionEvidenceV1 | null;
  readonly network_capture: unknown;
  readonly answer_sha256: string;
  readonly output: string | null;
  readonly revision_evidence: 'unavailable';
}
function refuse(message: string): never {
  throw new CampaignFreshAuditError('campaign_audit_reconciliation_required', message);
}

/** Capture first-revision evidence without pretending that an active group already completed. */
export async function runCampaignRevisionObservation(input: {
  readonly repo_root: string; readonly campaign_id: string; readonly gitleaks_bin?: string; readonly env?: NodeJS.ProcessEnv;
}, deps: Pick<IssueAuthoringDependencies<RevisionBrowserResult>, 'readBinding' | 'consult'>) {
  const root = resolve(input.repo_root);
  const status = readDevelopmentCampaignStatus(root, input.campaign_id, input.env);
  if (!['authorized', 'group_preparing'].includes(status.current.state)
    || status.events.some(event => event.operation === 'start_group')) refuse('revision observation requires the first pre-active group');
  const authority = assertAuthorityBinding(root, status.campaign, input.env ?? process.env);
  const policy = requireManualGithubPolicy(readCampaignExternalSourcesPolicyAtRevision(root, status.campaign.target_revision));
  const binding = deps.readBinding(root);
  if (binding.error || !binding.binding?.profileDir || binding.binding.profileDirectory !== authority.campaign!.chrome_profile_directory)
    refuse('revision observation browser profile differs from authorization');
  const prompt = [
    'Perform a fresh read-only revision observation using the selected GitHub app. This is pre-active evidence collection, not a completed-group audit.',
    `Repository: ${policy.github.repository}. Target ref: ${status.campaign.target_ref}. Requested exact commit: ${status.campaign.target_revision}.`,
    'Use GitHub to inspect that exact commit and its repository tree. Report only the revision information actually returned by the tool and cite the resources you read. If the tool does not return a resolved commit, say it is unavailable; do not echo the requested SHA as observed evidence.',
    'Do not create, edit, close or reopen Issues. Do not change files, branches, PRs, labels or repository settings. Do not start any campaign group. The controller retains original tool transport separately and does not treat your answer as a version receipt.',
  ].join('\n\n');
  const request = {
    protocol: 1, kind: 'repo-harness-campaign-revision-observation-request',
    campaign_sha256: status.campaign.campaign_sha256, authorization_sha256: authority.authorization_sha256,
    repository_id: status.campaign.repository_id, provider_repository: policy.github.repository,
    target_ref: status.campaign.target_ref, target_revision: status.campaign.target_revision,
    profile_dir: binding.binding.profileDir, profile_directory: binding.binding.profileDirectory,
    prompt, prompt_sha256: messageSha256(prompt),
  };
  const requestDigest = automationDigest(request);
  // The fixed immutable request also rejects a changed binding under the same campaign.
  persistCampaignRevisionRecord(root, input.campaign_id, 'request', request);
  const settle = (record: RevisionResult, replayed: boolean) => {
    if (record.request_sha256 !== requestDigest) refuse('revision observation request differs from saved result');
    if (record.browser_status !== 'completed') refuse('revision observation is unresolved; reservation retained without repeat provider I/O');
    appendAutomationUsage({ repo_root: root, reservation: record.reservation,
      outcome: record.browser_session && record.output !== null ? 'no_progress' : 'provider_failure',
      evidence_refs: [{ ref: `revision-observation:${requestDigest}`, sha256: automationDigest(record) }], env: input.env });
    return { request_sha256: requestDigest, observation_sha256: canonicalMessageDigest({ ...record }),
      session_ref: record.session_ref, provider_session_ref: record.provider_session_ref,
      browser_session: record.browser_session, network_capture: record.network_capture,
      revision_evidence: record.revision_evidence, replayed };
  };
  const saved = readCampaignRevisionRecord<RevisionResult>(root, input.campaign_id, 'result');
  if (saved) return settle(saved, true);
  const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority, env: input.env });
  const admission = reserveCampaignRevisionObservationBudget({ repo_root: root, campaign_id: input.campaign_id,
    automation_run_id: budget.budget.automation_run_id, expected_budget_sha256: budget.budget.budget_sha256,
    request_sha256: requestDigest, env: input.env });
  if (admission.disposition === 'replayed') refuse('revision observation reservation is unresolved; do not repeat provider I/O');
  const result = await deps.consult({ repoRoot: root, title: `${input.campaign_id} pre-active revision observation`, prompt,
    provider: 'oracle', chatgptApp: 'GitHub', requireSecretScan: true, captureNetworkEvidence: true,
    profileDir: binding.binding.profileDir, profileDirectory: binding.binding.profileDirectory!,
    gitleaksBin: input.gitleaks_bin, dryRun: false });
  const raw = result.output ?? '';
  const record: RevisionResult = { request_sha256: requestDigest, reservation: admission.reservation,
    session_ref: result.sessionId, provider_session_ref: result.meta.providerSessionId ?? null,
    browser_status: result.status, browser_session: readCampaignBrowserSessionEvidence(result, {
      repoRoot: root, profileDir: binding.binding.profileDir, profileDirectory: binding.binding.profileDirectory!,
      sourceSessionId: null, parentProviderSessionId: null }),
    network_capture: result.meta.oracle?.networkCapture ?? null, answer_sha256: messageSha256(raw),
    output: raw.length <= 2 * 1024 * 1024 ? raw : null, revision_evidence: 'unavailable' };
  persistCampaignRevisionRecord(root, input.campaign_id, 'result', record);
  return settle(record, false);
}
