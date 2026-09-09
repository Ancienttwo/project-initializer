import { readCampaignCapturedConversation } from './campaign-revision-evidence';
import { canonicalMessageDigest } from '../messages/mechanics';
/** Session ownership and captured Connector calls are independent of backend model identity. */
export function campaignGithubPrompt(prompt: string): string { return `@GitHub ${prompt}`; }
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


/** Read invocation-owned history, never a composer label or the model's answer. */
function githubInvocation(meta: Record<string, unknown>): { pluginId: string; capturedAt: string } | null {
  try {
    if (!nonempty(meta.providerSessionId)) return null;
    const captured = readCampaignCapturedConversation(object(meta.oracle)?.conversationCapture, meta.providerSessionId);
    if (!captured) return null;
    const {history, body, messages} = captured;
    const final = messages.find(m => m!.id === body.current_node), finalMeta = object(final?.metadata);
    if (object(final?.author)?.role !== 'assistant' || final?.status !== 'finished_successfully' || final.end_turn !== true
      || !nonempty(finalMeta?.turn_exchange_id) || finalMeta.working_turn_id !== finalMeta.turn_exchange_id) return null;
    const turn = finalMeta.turn_exchange_id;
    const users = messages.filter(m => object(m!.author)?.role === 'user');
    const user = users.at(-1), userMeta = object(user?.metadata), content = object(user?.content);
    if (userMeta?.turn_exchange_id !== turn || userMeta.working_turn_id !== turn || content?.content_type !== 'text'
      || !Array.isArray(content.parts) || content.parts.length !== 1 || typeof content.parts[0] !== 'string'
      || !content.parts[0].startsWith('@GitHub ')) return null;
    const connectors = new Set<string>();
    for (const message of messages) {
      const author = object(message!.author), metadata = object(message!.metadata), resource = object(metadata?.invoked_resource);
      if (author?.role !== 'tool' || author.name !== 'api_tool.call_tool' || metadata?.turn_exchange_id !== turn) continue;
      if (resource?.app_name !== 'GitHub') continue;
      if (message!.status !== 'finished_successfully' || metadata.working_turn_id !== turn
        || resource.api_tool_version !== 'v2' || resource.publish_status !== 'published' || typeof resource.resource_uri !== 'string') return null;
      const segments = resource.resource_uri.split('/');
      if (segments[0] !== '' || !segments[1] || segments.length < 3) return null;
      const citation = object(metadata.citation_metadata);
      if (citation && citation.__connector_id !== segments[1]) return null;
      connectors.add(segments[1]);
    }
    if (connectors.size !== 1) return null;
    return { pluginId: `plugin:${[...connectors][0]}`, capturedAt: history.capturedAt as string };
  } catch { return null; }
}

function isVerifiedCampaignBrowserSession(value: unknown, binding: CampaignBrowserSessionBinding): boolean {
  const result = object(value);
  const meta = object(result?.meta);
  const browser = object(meta?.browser);
  const oracle = object(meta?.oracle);
  const observation = object(oracle?.observation);

  if (result?.status !== 'completed' || meta?.status !== 'completed'
    || !nonempty(result.sessionId) || result.sessionId !== meta.sessionId
    || meta.provider !== 'oracle' || meta.engine !== 'chatgpt-browser' || meta.repo !== binding.repoRoot
    || browser?.transport !== 'copy_profile' || browser.profileDir !== binding.profileDir || browser.profileDirectory !== binding.profileDirectory
    || !nonempty(meta.providerSessionId)
    || oracle?.evidenceError !== undefined || observation?.source !== 'oracle-session-metadata'
    || observation.sessionId !== meta.providerSessionId) return false;
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
  const app = githubInvocation(meta);
  if (!app) return null;
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
