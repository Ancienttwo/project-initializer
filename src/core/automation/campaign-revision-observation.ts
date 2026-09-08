import { automationDigest, validateAutomationReservation, CAMPAIGN_AUTOMATION_RESERVATION_KIND, type CampaignAutomationBudgetReservationV1 } from './budget';
import { messageSha256 } from '../messages/mechanics';
import { validateCampaignBrowserSessionEvidence, type CampaignBrowserSessionEvidenceV1 } from './campaign-browser-session';
import { readCampaignRevisionEvidence } from './campaign-revision-evidence';
import type { IssueAuthoringSessionV2 } from './issue-batch';

export interface CampaignRevisionRequestV2 {
  readonly protocol: 2;
  readonly kind: 'repo-harness-campaign-revision-observation-request';
  readonly campaign_id: string; readonly authorization_sha256: string;
  readonly repository_id: string; readonly provider_repository: string;
  readonly target_ref: string; readonly target_revision: string;
  readonly profile_dir: string; readonly profile_directory: string;
  readonly prompt: string; readonly prompt_sha256: string;
}
export interface CampaignRevisionResultV2 {
  readonly protocol: 2;
  readonly kind: 'repo-harness-campaign-revision-observation-result';
  readonly request_sha256: string;
  readonly reservation: CampaignAutomationBudgetReservationV1;
  readonly session_ref: string; readonly provider_session_ref: string | null;
  readonly browser_status: IssueAuthoringSessionV2['browser_status'];
  readonly browser_session: CampaignBrowserSessionEvidenceV1 | null;
  readonly network_capture: unknown; readonly conversation_capture: unknown;
  readonly answer_sha256: string; readonly output: string | null;
  readonly revision_evidence: 'verified' | 'unavailable';
}
function requireThat(ok: unknown): asserts ok { if (!ok) throw new Error('revision observation contract differs'); }
function exact(value: unknown, keys: string[]): Record<string, unknown> {
  requireThat(value && typeof value === 'object' && !Array.isArray(value));
  requireThat(JSON.stringify(Object.keys(value).sort()) === JSON.stringify(keys.sort()));
  return value as Record<string, unknown>;
}
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const digest = (v: unknown): boolean => typeof v === 'string' && /^sha256:[a-f0-9]{64}$/.test(v);
export function validateCampaignRevisionRequest(value: unknown): CampaignRevisionRequestV2 {
  const r = exact(value, ['protocol','kind','campaign_id','authorization_sha256','repository_id','provider_repository','target_ref','target_revision','profile_dir','profile_directory','prompt','prompt_sha256']);
  requireThat(r.protocol === 2 && r.kind === 'repo-harness-campaign-revision-observation-request');
  requireThat(['campaign_id','repository_id','profile_dir','profile_directory','prompt'].every(k => text(r[k])));
  requireThat(typeof r.authorization_sha256 === 'string' && /^[a-f0-9]{64}$/.test(r.authorization_sha256));
  requireThat(typeof r.provider_repository === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(r.provider_repository));
  requireThat(typeof r.target_ref === 'string' && /^refs\/heads\/.+/.test(r.target_ref));
  requireThat(typeof r.target_revision === 'string' && /^[a-f0-9]{40}$/.test(r.target_revision));
  requireThat(r.prompt_sha256 === messageSha256(r.prompt as string));
  return value as CampaignRevisionRequestV2;
}
export function revisionEvidenceForObservation(request: CampaignRevisionRequestV2, result: CampaignRevisionResultV2) {
  const session = result.browser_session;
  if (result.browser_status !== 'completed' || !session || result.output === null) return null;
  return readCampaignRevisionEvidence(result.conversation_capture, {
    providerSessionId: session.provider_session_ref, connectorId: session.plugin_id.slice(7),
    repository: request.provider_repository, ref: request.target_ref, commit: request.target_revision,
    prompt: request.prompt, answer: result.output,
  });
}
export function validateCampaignRevisionResult(value: unknown, request: CampaignRevisionRequestV2): CampaignRevisionResultV2 {
  validateCampaignRevisionRequest(request);
  const r = exact(value, ['protocol','kind','request_sha256','reservation','session_ref','provider_session_ref','browser_status','browser_session','network_capture','conversation_capture','answer_sha256','output','revision_evidence']);
  requireThat(r.protocol === 2 && r.kind === 'repo-harness-campaign-revision-observation-result' && r.request_sha256 === automationDigest(request));
  requireThat(text(r.session_ref) && (r.provider_session_ref === null || text(r.provider_session_ref)) && digest(r.answer_sha256));
  requireThat(['completed','running','recoverable','incomplete_capture','failed','cancelled','dry_run'].includes(String(r.browser_status)));
  requireThat(r.output === null || (typeof r.output === 'string' && Buffer.byteLength(r.output) <= 2*1024*1024 && r.answer_sha256 === messageSha256(r.output)));
  const reservation = validateAutomationReservation(r.reservation as CampaignAutomationBudgetReservationV1);
  requireThat(reservation.kind === CAMPAIGN_AUTOMATION_RESERVATION_KIND);
  const c = (reservation as CampaignAutomationBudgetReservationV1).campaign_context;
  requireThat(reservation.operation === 'provider_invocation' && reservation.provider === 'gpt-pro'
    && reservation.unit_kind === 'execute' && reservation.unit_id === `${request.campaign_id}:revision-observation`
    && reservation.attempt === 1 && reservation.idempotency_key === r.request_sha256
    && c.campaign_id === request.campaign_id && c.group_number === 1 && c.operation === 'observe_revision'
    && c.intent_sha256 === null && c.step_admission_sha256 === null && c.request_sha256 === r.request_sha256);
  if (r.browser_session !== null) {
    const session = validateCampaignBrowserSessionEvidence(r.browser_session);
    requireThat(r.browser_status === 'completed' && session.session_ref === r.session_ref && session.provider_session_ref === r.provider_session_ref
      && session.source_session_ref === null && session.parent_provider_session_ref === null
      && session.profile_dir === request.profile_dir && session.profile_directory === request.profile_directory);
  }
  const result = value as CampaignRevisionResultV2;
  requireThat(r.revision_evidence === (revisionEvidenceForObservation(request,result) ? 'verified' : 'unavailable'));
  return result;
}
