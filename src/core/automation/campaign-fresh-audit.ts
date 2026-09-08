import type { CampaignRevisionEvidence } from './campaign-revision-evidence';
import { canonicalMessageDigest } from '../messages/mechanics';
import type { DevelopmentCampaignEventV1 } from './development-campaign';

export class CampaignFreshAuditError extends Error {
  constructor(
    readonly code:
      | 'campaign_audit_invalid'
      | 'campaign_audit_unverified'
      | 'campaign_group_sequence_invalid'
      | 'campaign_audit_reconciliation_required',
    message: string,
  ) {
    super(message);
    this.name = 'CampaignFreshAuditError';
  }
}
export function auditInvalid(message: string): never {
  throw new CampaignFreshAuditError('campaign_audit_invalid', message);
}
function exact(value: unknown, fields: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).sort().join(',') !== [...fields].sort().join(','))
    auditInvalid('audit fields differ');
  return value as Record<string, unknown>;
}
const digest = (value: unknown): value is string => typeof value === 'string' && /^sha256:[a-f0-9]{64}$/.test(value);
const oid = (value: unknown): value is string => typeof value === 'string' && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(value);
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export interface CampaignGroupSnapshotV1 {
  readonly protocol: 1;
  readonly kind: 'repo-harness-campaign-group-snapshot';
  readonly campaign_id: string;
  readonly group_number: number;
  readonly intent_sha256: string;
  readonly provider_repository: string;
  readonly target_ref: string;
  readonly expected_final_main_sha: string;
  readonly adoption_sha256: string;
  readonly publication_sha256: string;
  readonly slots: readonly {
    readonly slot: string;
    readonly disposition: 'completed' | 'not_planned' | 'unfilled';
    readonly task_id: string | null;
    readonly cleanup_sha256: string | null;
    readonly merge_commit_sha: string | null;
  }[];
  readonly snapshot_sha256: string;
}
export function sealCampaignGroupSnapshot(
  input: Omit<CampaignGroupSnapshotV1, 'protocol' | 'kind' | 'snapshot_sha256'>,
): CampaignGroupSnapshotV1 {
  const basis = { protocol: 1 as const, kind: 'repo-harness-campaign-group-snapshot' as const, ...input };
  return validateCampaignGroupSnapshot({ ...basis, snapshot_sha256: canonicalMessageDigest(basis) });
}
export function validateCampaignGroupSnapshot(value: unknown): CampaignGroupSnapshotV1 {
  const r = exact(value, [
    'protocol',
    'kind',
    'campaign_id',
    'group_number',
    'intent_sha256',
    'provider_repository',
    'target_ref',
    'expected_final_main_sha',
    'adoption_sha256',
    'publication_sha256',
    'slots',
    'snapshot_sha256',
  ]);
  if (
    r.protocol !== 1 ||
    r.kind !== 'repo-harness-campaign-group-snapshot' ||
    !text(r.campaign_id) ||
    ![1, 2, 3].includes(r.group_number as number) ||
    !digest(r.intent_sha256) ||
    !text(r.provider_repository) ||
    !text(r.target_ref) ||
    !oid(r.expected_final_main_sha) ||
    !digest(r.adoption_sha256) ||
    !digest(r.publication_sha256) ||
    !Array.isArray(r.slots) ||
    !r.slots.length
  )
    auditInvalid('group snapshot identity is invalid');
  const tasks = new Set<string>();
  for (let i = 0; i < r.slots.length; i++) {
    const row = exact(r.slots[i], ['slot', 'disposition', 'task_id', 'cleanup_sha256', 'merge_commit_sha']);
    if (row.slot !== String(i + 1).padStart(2, '0') || i >= 10) auditInvalid('snapshot must cover every ordered slot');
    if (row.disposition === 'unfilled') {
      if (row.task_id !== null || row.cleanup_sha256 !== null || row.merge_commit_sha !== null)
        auditInvalid('unfilled slot contains Task evidence');
    } else {
      if (
        !['completed', 'not_planned'].includes(row.disposition as string) ||
        typeof row.task_id !== 'string' ||
        !/^[a-f0-9]{64}$/.test(row.task_id) ||
        tasks.has(row.task_id) ||
        !digest(row.cleanup_sha256)
      )
        auditInvalid('snapshot cleanup identity is invalid');
      tasks.add(row.task_id);
      if (row.disposition === 'completed' ? !oid(row.merge_commit_sha) : row.merge_commit_sha !== null)
        auditInvalid('snapshot merge proof is invalid');
    }
  }
  const { snapshot_sha256, ...basis } = r;
  if (snapshot_sha256 !== canonicalMessageDigest(basis)) auditInvalid('snapshot digest differs');
  return value as CampaignGroupSnapshotV1;
}

const AUDIT_RECOMMENDATIONS = ['accepted', 'accepted_with_followups', 'rejected'] as const;
export function campaignAuditAnswerSchema(snapshot: CampaignGroupSnapshotV1) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['protocol', 'disposition', 'observed_main_sha', 'slots', 'findings'],
    properties: {
      protocol: { const: 1 },
      disposition: { enum: AUDIT_RECOMMENDATIONS },
      observed_main_sha: { type: ['string', 'null'] },
      slots: { const: snapshot.slots.map((row) => row.slot) },
      findings: { type: 'array', items: { type: 'string', minLength: 1 } },
    },
  };
}
export interface CampaignAuditAnswerV1 {
  readonly protocol: 1;
  readonly disposition: 'accepted' | 'accepted_with_followups' | 'rejected';
  readonly observed_main_sha: string | null;
  readonly slots: readonly string[];
  readonly findings: readonly string[];
}
export function parseCampaignAuditAnswer(raw: string, snapshot: CampaignGroupSnapshotV1): CampaignAuditAnswerV1 {
  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    auditInvalid('audit answer must be one JSON object');
  }
  const r = exact(decoded, ['protocol', 'disposition', 'observed_main_sha', 'slots', 'findings']);
  if (
    r.protocol !== 1 ||
    !(AUDIT_RECOMMENDATIONS as readonly string[]).includes(r.disposition as string) ||
    (r.observed_main_sha !== null && !oid(r.observed_main_sha)) ||
    !Array.isArray(r.slots) ||
    JSON.stringify(r.slots) !== JSON.stringify(snapshot.slots.map((s) => s.slot)) ||
    !Array.isArray(r.findings) ||
    !r.findings.every(text)
  )
    auditInvalid('audit answer does not cover the exact group');
  return decoded as CampaignAuditAnswerV1;
}

/** Fresh audit result with separately verified provider revision provenance. */
export interface CampaignFreshAuditObservationV2 {
  readonly protocol: 2;
  readonly kind: 'repo-harness-campaign-fresh-audit-observation';
  readonly snapshot_sha256: string;
  readonly session_ref: string;
  readonly provider_session_ref: string | null;
  readonly prompt_sha256: string;
  readonly answer_sha256: string;
  readonly recommendation: CampaignAuditAnswerV1;
  readonly disposition: 'unverified' | CampaignAuditAnswerV1['disposition'];
  readonly revision_evidence: CampaignRevisionEvidence | null;
  readonly observed_at: string;
  readonly observation_sha256: string;
}
export function sealCampaignFreshAuditObservation(
  input: Omit<CampaignFreshAuditObservationV2, 'protocol' | 'kind' | 'disposition' | 'observation_sha256'>,
): CampaignFreshAuditObservationV2 {
  const basis = {protocol:2 as const,kind:'repo-harness-campaign-fresh-audit-observation' as const,...input,
    disposition: input.revision_evidence ? input.recommendation.disposition : 'unverified' as const};
  return {...basis,observation_sha256:canonicalMessageDigest(basis)};
}
export function validateCampaignFreshAuditObservation(value: unknown, snapshot: CampaignGroupSnapshotV1): CampaignFreshAuditObservationV2 {
  const r=exact(value,['protocol','kind','snapshot_sha256','session_ref','provider_session_ref','prompt_sha256','answer_sha256','recommendation','disposition','revision_evidence','observed_at','observation_sha256']);
  if(r.protocol!==2 || r.kind!=='repo-harness-campaign-fresh-audit-observation' || r.snapshot_sha256!==snapshot.snapshot_sha256
    || !text(r.session_ref) || (r.provider_session_ref!==null && !text(r.provider_session_ref)) || !digest(r.prompt_sha256) || !digest(r.answer_sha256)
    || typeof r.observed_at!=='string' || !Number.isFinite(Date.parse(r.observed_at))) auditInvalid('audit observation binding is invalid');
  const recommendation=parseCampaignAuditAnswer(JSON.stringify(r.recommendation),snapshot);
  if(r.revision_evidence===null) { if(r.disposition!=='unverified')auditInvalid('missing revision evidence'); }
  else {
    const e=exact(r.revision_evidence,['protocol','kind','provider_session_ref','conversation_id','turn_id','connector_id','repository','ref','commit_sha','tree_sha','history_sha256','capture_sha256','prompt_sha256','answer_sha256','commit_message_id','ref_message_id','evidence_sha256']);
    const {evidence_sha256,...basis}=e;
    if(e.protocol!==1 || e.kind!=='repo-harness-campaign-revision-evidence' || evidence_sha256!==canonicalMessageDigest(basis)
      || e.provider_session_ref!==r.provider_session_ref || !text(e.provider_session_ref) || !text(e.conversation_id) || !text(e.turn_id) || !text(e.connector_id)
      || !text(e.commit_message_id) || !text(e.ref_message_id) || e.commit_message_id===e.ref_message_id || !oid(e.tree_sha)
      || !digest(e.history_sha256) || !digest(e.capture_sha256) || e.prompt_sha256!==r.prompt_sha256 || e.answer_sha256!==r.answer_sha256
      || e.repository!==snapshot.provider_repository || e.ref!==snapshot.target_ref || e.commit_sha!==snapshot.expected_final_main_sha
      || recommendation.observed_main_sha!==e.commit_sha || r.disposition!==recommendation.disposition) auditInvalid('audit revision evidence differs');
  }
  const {observation_sha256,...basis}=r;
  if(observation_sha256!==canonicalMessageDigest(basis))auditInvalid('audit observation digest differs');
  return value as CampaignFreshAuditObservationV2;
}
export function campaignAuditAccepted(observation: CampaignFreshAuditObservationV2): boolean {
  return observation.revision_evidence!==null && ['accepted','accepted_with_followups'].includes(observation.disposition);
}

/** Group identity is a deterministic projection of the canonical lifecycle. */
export function campaignGroupProgress(events: readonly DevelopmentCampaignEventV1[], groupCount: number) {
  if (![1, 2, 3].includes(groupCount))
    throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'invalid authorized group count');
  let prepared = 0,
    accepted = 0;
  for (const event of events) {
    if (event.operation === 'prepare_group') {
      if (prepared !== accepted || prepared >= groupCount)
        throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'group preparation skipped or exceeded authorization');
      prepared++;
    }
    if (event.operation === 'accept_group') {
      if (prepared !== accepted + 1)
        throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'group acceptance is out of order');
      accepted++;
    }
    if (['complete', 'complete_with_followups'].includes(event.operation) && accepted !== groupCount)
      throw new CampaignFreshAuditError('campaign_group_sequence_invalid', 'campaign completed before all authorized groups');
  }
  return { group_number: prepared, accepted_groups: accepted, group_count: groupCount };
}
