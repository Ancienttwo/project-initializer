import { canonicalMessageDigest, canonicalMessageBytes } from '../../core/messages/mechanics';
import { campaignRuntimeRecordKey, type CampaignCodexInvocation } from '../../core/automation/campaign-runtime';
import type { LeaseOwnerRecord } from '../../core/state/coordination-identity';
import type { LeaseReclaimEvidenceObservation } from '../state/coordination-lease-reclaim';
import { randomUUID } from 'crypto';
import { classifyLeaseReclaim, validateLeaseReclaimEligibility } from '../../core/state/lease-liveness';
import { automaticReclaimLease } from '../state/coordination-lease-reclaim';
import { readLeaseLiveness, writeLeaseReclaimEligibility } from '../state/coordination-lease-liveness-store';
import { resolveEngineerPrincipal } from '../engineers/principal';
import { resumeReclaimedEngineerTask } from '../engineers/acquire';
import { readLease, withTaskLock } from '../state/coordination-lease-store';
import { readEngineerBindingStatus } from '../engineers/binding-store';
import { readClaimActorReceipt, validateClaimActorReceiptLive } from '../engineers/claim-actor-store';
import { readCampaignWorkerHandoff, settleRecoveredCampaignWorkerFinal, type CampaignWorkerChildObservation } from './campaign-worker';
import { observeCampaignCodexTerminal } from './campaign-runtime';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import { persistPlanningRecord, readPlanningRecord, withCampaignPlanningLock } from './campaign-planning-store';

const key = (dispatch: string, part: string) => canonicalMessageDigest({ dispatch, part }).slice(7);
const exact = (a: unknown, b: unknown) => canonicalMessageBytes({ value: a }) === canonicalMessageBytes({ value: b });
type Context = ReturnType<typeof readCampaignWorkerHandoff>;

/** Retirement is a durable admission fence, not an assertion that an OS process died. */
export function retireCampaignDispatch(input: { selector: unknown; host: 'codex' | 'claude'; session_id: string; env?: NodeJS.ProcessEnv }) {
  const context = readCampaignWorkerHandoff(input.selector);
  const { root, intent, selector } = context;
  return withCampaignPlanningLock(root, intent, () => {
    const authority = requireCampaignPlanningAuthority(root, intent, input.env);
    const parent = readPlanningRecord<{ host: string; session_id: string }>(root, intent, 'parent');
    if (authority.policy.mode !== 'active' || authority.grant.campaign?.local_parent_host !== input.host
      || parent?.host !== input.host || parent.session_id !== input.session_id) throw new Error('campaign retirement requires its authorized local parent');
    const prior = readPlanningRecord(root, intent, key(selector.dispatch_id, 'retired'));
    if (prior) return prior;
    const record = { dispatch_id: selector.dispatch_id, host: input.host, session_id: input.session_id };
    persistPlanningRecord(root, intent, key(selector.dispatch_id, 'retired'), record);
    return record;
  });
}

/** Caller holds the Task lock. No journal lock is acquired in this read path. */
function observe(context: Context, owner: LeaseOwnerRecord): LeaseReclaimEvidenceObservation {
  const { root, intent, selector, handoff } = context;
  const work = handoff.acquired.envelope;
  if (owner.task_id !== work.task_id || owner.task_revision !== work.task_revision || owner.claim_id !== work.claim_id
    || owner.generation !== work.generation) throw new Error('campaign recovery requires its exact original Lease');
  const retired = readPlanningRecord(root, intent, key(selector.dispatch_id, 'retired'));
  const launch = readPlanningRecord<{ request: { provider?: string } }>(root, intent, key(selector.dispatch_id, 'launch'));
  const roles = (['worker', 'verifier'] as const).map(role => {
    const invocation = readPlanningRecord<CampaignCodexInvocation>(root, intent, campaignRuntimeRecordKey(selector.dispatch_id, role, 'intent'));
    const started = readPlanningRecord<{ invocation_sha256: string; identity: unknown }>(root, intent, campaignRuntimeRecordKey(selector.dispatch_id, role, 'started'));
    const terminal = readPlanningRecord<ReturnType<typeof observeCampaignCodexTerminal>>(root, intent, campaignRuntimeRecordKey(selector.dispatch_id, role, 'terminal'));
    const child = readPlanningRecord<{ observation: CampaignWorkerChildObservation }>(root, intent, key(selector.dispatch_id, `child-${role}`));
    if (!started) return { role, inactive: retired && (!launch || launch.request.provider === 'codex-exec') ? true : null, invocation, started, terminal };
    if (!invocation || !terminal || !child || started.invocation_sha256 !== invocation.invocation_sha256 || !exact(started.identity, invocation.identity)
      || invocation.identity.dispatch_id !== selector.dispatch_id || invocation.identity.role !== role
      || invocation.identity.claim_id !== work.claim_id || invocation.identity.lease_generation !== work.generation
      || invocation.identity.task_id !== work.task_id || invocation.identity.task_revision !== work.task_revision
      || invocation.identity.binding_generation !== handoff.acquired.offer.binding_generation) {
      return { role, inactive: null, invocation, started, terminal };
    }
    try {
      const current = observeCampaignCodexTerminal({ invocation, worktree: work.worktree_path, ...child.observation });
      return { role, inactive: exact(current, terminal) && current.state === 'terminal' ? true : null, invocation, started, terminal };
    } catch { return { role, inactive: null, invocation, started, terminal }; }
  });
  const binding = readEngineerBindingStatus(root, handoff.acquired.offer.engineer_id, handoff.acquired.offer.engineer_contract_revision);
  const receipt = readClaimActorReceipt(root, work.task_id, work.claim_id);
  const bindingMatches = binding.current.state === 'active' && binding.current.current_binding_id === handoff.acquired.offer.binding_id
    && binding.current.binding_generation === handoff.acquired.offer.binding_generation;
  let actorMatches = false;
  if (receipt && exact(receipt, handoff.acquired.receipt)) {
    try { validateClaimActorReceiptLive(root, receipt, work); actorMatches = true; } catch { /* Stale ownership is a refusal. */ }
  }
  const publication = owner.state === 'completing' || owner.state === 'reviewing' ? owner.state : 'inactive';
  const facts = { owner, retired, roles, binding: binding.current, receipt };
  return { publication_state: publication, evidence: {
    controller_terminal: retired ? true : null,
    runtime_effect_inactive: roles.every(role => role.inactive === true) ? true : null,
    publication_inactive: publication === 'inactive', binding_generation_matches: bindingMatches, claim_actor_matches: actorMatches,
    evidence_revision: canonicalMessageDigest(facts),
  } };
}

export function observeCampaignReclaimEligibility(input: { selector: unknown; env?: NodeJS.ProcessEnv; now?: () => Date }) {
  const context = readCampaignWorkerHandoff(input.selector);
  requireCampaignPlanningAuthority(context.root, context.intent, input.env);
  // The producer reads actual journal/runtime/binding/publication facts; callers supply no booleans.
  return withTaskLock(context.root, context.handoff.acquired.envelope.task_id, () => {
    const owner = readLease(context.root, context.handoff.acquired.envelope.task_id).record;
    if (!owner) throw new Error('campaign recovery Lease is unavailable');
    const observed = observe(context, owner);
    const liveness = readLeaseLiveness(context.root, owner.task_id);
    const receipt = classifyLeaseReclaim({ renewal: liveness.renewal, task_revision: owner.task_revision,
      classified_at: (input.now ?? (() => new Date()))().toISOString(), evidence: observed.evidence, publication_state: observed.publication_state });
    writeLeaseReclaimEligibility(context.root, receipt);
    return receipt;
  });
}

interface RecoveryIntent {
  dispatch_id: string; previous_claim_id: string; previous_generation: number; next_claim_id: string;
  session_id: string; bound_at: string; receipt_json: string;
}

/** One persisted intent owns steal, exact rebind, token, and actor publication across crashes. */
export function recoverCampaignDispatch(input: {
  selector: unknown; host: 'claude' | 'codex'; session_id: string; env?: NodeJS.ProcessEnv;
  now?: () => Date;
  crash_hook?: (boundary: 'after_intent' | 'after_lease_write' | 'after_bind' | 'after_token' | 'after_actor' | 'after_recovered') => void;
}) {
  retireCampaignDispatch(input);
  const context = readCampaignWorkerHandoff(input.selector);
  const { root, intent, selector, handoff } = context;
  const previous = handoff.acquired.envelope;
  return withCampaignPlanningLock(root, intent, () => {
    requireCampaignPlanningAuthority(root, intent, input.env);
    const principal = resolveEngineerPrincipal({ repo_root: root, authorization_id: handoff.authorization_id, env: input.env });
    let recovery = readPlanningRecord<RecoveryIntent>(root, intent, key(selector.dispatch_id, 'recovery-intent'));
    if (!recovery) {
      const receipt = observeCampaignReclaimEligibility(input);
      if (receipt.classification !== 'reclaimable') throw new Error(`campaign dispatch is not reclaimable: ${receipt.classification}`);
      recovery = { dispatch_id: selector.dispatch_id, previous_claim_id: previous.claim_id, previous_generation: previous.generation,
        next_claim_id: randomUUID(), session_id: input.session_id, bound_at: (input.now ?? (() => new Date()))().toISOString(), receipt_json: JSON.stringify(receipt) };
      persistPlanningRecord(root, intent, key(selector.dispatch_id, 'recovery-intent'), recovery);
    }
    if (recovery.dispatch_id !== selector.dispatch_id || recovery.previous_claim_id !== previous.claim_id || recovery.previous_generation !== previous.generation
      || recovery.session_id !== input.session_id) throw new Error('campaign recovery intent differs');
    // Preserve the owning receipt's signed JSON bytes inside the canonical planning journal.
    const receipt = validateLeaseReclaimEligibility(JSON.parse(recovery.receipt_json));
    input.crash_hook?.('after_intent');
    const current = readLease(root, previous.task_id).record;
    if (current?.claim_id === previous.claim_id && current.generation === previous.generation) {
      automaticReclaimLease({ repo_root: root, receipt, session_id: input.session_id, source_worktree: previous.worktree_path,
        reason: `campaign-dispatch:${selector.dispatch_id}`, observe_evidence: owner => observe(context, owner),
        now: input.now, new_claim_id: () => recovery!.next_claim_id, crash_hook: input.crash_hook });
    } else if (!current || current.claim_id !== recovery.next_claim_id || current.generation !== previous.generation + 1) {
      throw new Error('campaign recovery lost its original or reserved next generation');
    }
    const recovered = resumeReclaimedEngineerTask({ repo_root: root, principal, previous, previous_receipt: handoff.acquired.receipt,
      claim_id: recovery.next_claim_id, receipt, session_id: recovery.session_id, bound_at: recovery.bound_at,
      env: input.env, crash_hook: input.crash_hook });
    persistPlanningRecord(root, intent, key(selector.dispatch_id, 'recovered'), recovered);
    input.crash_hook?.('after_recovered');
    const final = settleRecoveredCampaignWorkerFinal(selector, input.env);
    return { ...recovered, final, disposition: final ? 'settled_final' as const : 'reconciliation_required' as const };
  });
}
