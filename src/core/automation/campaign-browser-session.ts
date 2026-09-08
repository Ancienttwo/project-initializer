import { canonicalMessageDigest } from '../messages/mechanics';
/** Session ownership and app selection are independent of backend model identity. */
export interface CampaignBrowserSessionBinding {
  readonly repoRoot: string;
  readonly profileDirectory: string;
  readonly profileDir: string;
  readonly sourceSessionId: string | null;
  readonly parentProviderSessionId: string | null;
}
function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function nonempty(value: unknown): value is string { return typeof value === 'string' && value.trim().length > 0; }

function isVerifiedCampaignBrowserSession(value: unknown, binding: CampaignBrowserSessionBinding): boolean {
  const result = object(value);
  const meta = object(result?.meta);
  const browser = object(meta?.browser);
  const oracle = object(meta?.oracle);
  const observation = object(oracle?.observation);
  const app = object(observation?.appSelection);
  if (result?.status !== 'completed' || meta?.status !== 'completed'
    || !nonempty(result.sessionId) || result.sessionId !== meta.sessionId
    || meta.provider !== 'oracle' || meta.engine !== 'chatgpt-browser' || meta.repo !== binding.repoRoot
    || browser?.transport !== 'copy_profile' || browser.profileDir !== binding.profileDir || browser.profileDirectory !== binding.profileDirectory
    || browser.chatgptApp !== 'GitHub' || !nonempty(meta.providerSessionId)
    || oracle?.evidenceError !== undefined || observation?.source !== 'oracle-session-metadata'
    || observation.sessionId !== meta.providerSessionId
    || app?.status !== 'selected' || app.app !== 'GitHub' || app.source !== 'chatgpt-composer-pill'
    || !nonempty(app.pluginId) || !app.pluginId.startsWith('plugin:') || app.pluginId.length <= 7
    || !nonempty(app.capturedAt) || !Number.isFinite(Date.parse(app.capturedAt))) return false;
  if (binding.sourceSessionId === null) {
    return binding.parentProviderSessionId === null && meta.sourceSessionId === undefined && meta.parentProviderSessionId === undefined && observation.parentSessionId === null;
  }
  return meta.sourceSessionId === binding.sourceSessionId && nonempty(meta.parentProviderSessionId)
    && meta.parentProviderSessionId === observation.parentSessionId && meta.parentProviderSessionId === binding.parentProviderSessionId;
}

export interface CampaignBrowserSessionEvidenceV1 {
  readonly protocol: 1;
  readonly kind: 'repo-harness-campaign-browser-session-evidence';
  readonly session_ref: string;
  readonly provider_session_ref: string;
  readonly source_session_ref: string | null;
  readonly parent_provider_session_ref: string | null;
  readonly repo_root: string;
  readonly profile_directory: string;
  readonly profile_dir: string;
  readonly source: 'oracle-session-metadata';
  readonly app: 'GitHub';
  readonly plugin_id: string;
  readonly captured_at: string;
  readonly evidence_sha256: string;
}

export function readCampaignBrowserSessionEvidence(value: unknown, binding: CampaignBrowserSessionBinding): CampaignBrowserSessionEvidenceV1 | null {
  if (!isVerifiedCampaignBrowserSession(value, binding)) return null;
  const result = object(value)!;
  const meta = object(result.meta)!;
  const app = object(object(object(meta.oracle)!.observation)!.appSelection)!;
  const basis = { protocol: 1 as const, kind: 'repo-harness-campaign-browser-session-evidence' as const,
    session_ref: result.sessionId as string, provider_session_ref: meta.providerSessionId as string,
    source_session_ref: binding.sourceSessionId, parent_provider_session_ref: binding.parentProviderSessionId,
    repo_root: binding.repoRoot, profile_directory: binding.profileDirectory, profile_dir: binding.profileDir, source: 'oracle-session-metadata' as const,
    app: 'GitHub' as const, plugin_id: app.pluginId as string, captured_at: app.capturedAt as string };
  return Object.freeze({ ...basis, evidence_sha256: canonicalMessageDigest(basis) });
}

export function validateCampaignBrowserSessionEvidence(value: unknown): CampaignBrowserSessionEvidenceV1 {
  const v = object(value);
  const fail = (): never => { throw new Error('campaign browser session evidence is invalid'); };
  if (!v || v.protocol !== 1 || v.kind !== 'repo-harness-campaign-browser-session-evidence'
    || v.source !== 'oracle-session-metadata' || v.app !== 'GitHub'
    || !['session_ref', 'provider_session_ref', 'repo_root', 'profile_directory', 'profile_dir', 'plugin_id', 'captured_at'].every(k => nonempty(v[k]))
    || !(v.plugin_id as string).startsWith('plugin:') || (v.plugin_id as string).length <= 7
    || !Number.isFinite(Date.parse(v.captured_at as string))
    || !((v.source_session_ref === null && v.parent_provider_session_ref === null)
      || (nonempty(v.source_session_ref) && nonempty(v.parent_provider_session_ref)))) return fail();
  const { evidence_sha256, ...basis } = v;
  const keys = ['protocol','kind','session_ref','provider_session_ref','source_session_ref','parent_provider_session_ref','repo_root','profile_directory','profile_dir','source','app','plugin_id','captured_at'];
  if (JSON.stringify(Object.keys(basis).sort()) !== JSON.stringify(keys.sort()) || evidence_sha256 !== canonicalMessageDigest(basis)) return fail();
  return Object.freeze({ ...v }) as unknown as CampaignBrowserSessionEvidenceV1;
}
