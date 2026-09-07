import { createHash } from 'crypto';
import { canonicalMessageDigest } from '../messages/mechanics';

export interface CampaignRuntimeIdentity {
  readonly dispatch_id: string;
  readonly role: 'worker' | 'verifier';
  readonly task_id: string;
  readonly task_revision: string;
  readonly claim_id: string;
  readonly lease_generation: number;
  readonly binding_generation: number;
}

export interface CampaignCodexInvocation {
  readonly protocol: 1;
  readonly kind: 'repo-harness-campaign-codex-invocation';
  readonly identity: CampaignRuntimeIdentity;
  readonly executable: string;
  readonly executable_sha256: string;
  readonly executable_version: string;
  readonly profile_ref: string;
  readonly profile_sha256: string;
  readonly prompt_sha256: string;
  readonly model: string;
  readonly sandbox: 'workspace-write' | 'read-only';
  readonly argv: readonly string[];
  readonly invocation_sha256: string;
}

export function campaignRuntimeRecordKey(dispatchId: string, role: CampaignRuntimeIdentity['role'], phase: 'intent' | 'started' | 'terminal'): string {
  return canonicalMessageDigest({ dispatch: dispatchId, role, phase, protocol: 'campaign-codex-invocation-v1' }).slice(7);
}

function exactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length && Object.keys(value).every(key => keys.includes(key));
}
export function validateCampaignCodexInvocation(input: unknown): CampaignCodexInvocation {
  if (!exactKeys(input, ['protocol', 'kind', 'identity', 'executable', 'executable_sha256', 'executable_version', 'profile_ref', 'profile_sha256', 'prompt_sha256', 'model', 'sandbox', 'argv', 'invocation_sha256'])
    || !exactKeys(input.identity, ['dispatch_id', 'role', 'task_id', 'task_revision', 'claim_id', 'lease_generation', 'binding_generation'])) {
    throw new Error('campaign invocation shape is invalid');
  }
  const value = input as unknown as CampaignCodexInvocation;
  const identity = input.identity as Record<string, unknown>;
  const { invocation_sha256, ...body } = value;
  const sha = (v: unknown) => typeof v === 'string' && /^sha256:[a-f0-9]{64}$/.test(v);
  if (value.protocol !== 1 || value.kind !== 'repo-harness-campaign-codex-invocation'
    || !sha(invocation_sha256) || invocation_sha256 !== canonicalMessageDigest(body)
    || !['worker', 'verifier'].includes(value.identity.role)
    || !sha(value.identity.dispatch_id)
    || ['task_id', 'task_revision', 'claim_id'].some(key => typeof identity[key] !== 'string' || !identity[key])
    || ![value.executable_sha256, value.profile_sha256, value.prompt_sha256].every(sha)
    || typeof value.executable !== 'string' || !value.executable || typeof value.executable_version !== 'string' || !value.executable_version
    || typeof value.model !== 'string' || !value.model
    || value.profile_ref !== `.codex/agents/${value.identity.role === 'worker' ? 'fast-worker' : 'gatekeeper'}.toml`
    || value.sandbox !== (value.identity.role === 'worker' ? 'workspace-write' : 'read-only')
    || !Number.isSafeInteger(value.identity.lease_generation) || value.identity.lease_generation < 1
    || !Number.isSafeInteger(value.identity.binding_generation) || value.identity.binding_generation < 1
    || !Array.isArray(value.argv) || value.argv.length !== 14 || value.argv.some(arg => typeof arg !== 'string')
    || JSON.stringify(value.argv.slice(0, 10)) !== JSON.stringify(['exec', '--json', '--ephemeral', '--ignore-user-config', '--strict-config', '--sandbox', value.sandbox, '--model', value.model, '-c'])
    || !value.argv[10]!.startsWith('model_reasoning_effort=') || value.argv[11] !== '-c' || !value.argv[12]!.startsWith('developer_instructions=')
    || `sha256:${createHash('sha256').update(value.argv[13]!).digest('hex')}` !== value.prompt_sha256) {
    throw new Error('campaign invocation identity or digest is invalid');
  }
  return value;
}
