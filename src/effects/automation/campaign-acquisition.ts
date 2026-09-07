import { requireCampaignActiveAdmission } from './campaign-revision-admission';
import { createCampaignWorkerHandoff } from './campaign-worker';
import { canonicalMessageBytes, canonicalMessageDigest } from '../../core/messages/mechanics';
import { CampaignPlanningError } from '../../core/automation/campaign-planning';
import { resolveEngineerPrincipal } from '../engineers/principal';
import { acquireNextScheduledEngineerTask, type AcquireNextScheduledEngineerTaskResult } from '../engineers/scheduling-acquire-next';
import { readClaimActorReceipt, validateClaimActorReceiptLive } from '../engineers/claim-actor-store';
import { validateFleetWorkEnvelope } from '../fleet/acquire';
import { readLease } from '../state/coordination-lease-store';
import { processSprintDependencies, releaseSprintCommand } from '../state/coordination-sprint';
import type { ScheduledEngineerAcquireResult } from '../engineers/scheduling-acquire';
import { readIssueBatchIntent } from './issue-batch-store';
import { readPlanningRecord, persistPlanningRecord, withCampaignPlanningLock } from './campaign-planning-store';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import type { CampaignPlanningStepInput } from './campaign-planning';
import type { IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import type { EngineerPrincipalV1 } from '../../core/engineers/principal-claim';
import type { GenericAutomationBudgetReservationV1 } from '../../core/automation/budget';
import { withDevelopmentCampaignLock } from './development-campaign-store';
import { ensureCampaignAuthoringBudget, reserveAutomationBudget, appendAutomationUsage } from './budget-store';
import { ExclusiveLockContentionError } from '../locking/exclusive-directory-lock';

export interface CampaignAcquisitionInput extends Omit<CampaignPlanningStepInput, 'result'> {
  readonly authorization_id: string;
}

/** Serialize acquisition transactions, not worker execution. Budget owns all arithmetic. */
function budgetedAcquisition(input: CampaignAcquisitionInput, intent: IssueBatchIntentV1, principal: EngineerPrincipalV1, invoke: () => AcquireNextScheduledEngineerTaskResult): AcquireNextScheduledEngineerTaskResult | { readonly admission_busy: true } {
  let entered = false;
  try {
    return withDevelopmentCampaignLock(input.repo_root, intent.campaign_id, () => {
    entered = true;
    const root = input.repo_root;
    const authority = requireCampaignPlanningAuthority(root, intent, input.env);
    if (authority.policy.mode !== 'active') throw new CampaignPlanningError('human_attention_required', 'campaign acquisition is no longer active');
    const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority.grant, env: input.env }).budget;
    const request = { principal, session_id: input.session_id, authorization_id: input.authorization_id };
    let cursor = canonicalMessageDigest({ operation: 'campaign-acquisition-budget', intent_sha256: intent.intent_sha256, key: input.idempotency_key });
    const persist = (key: string, value: unknown) => withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, key, value));
    for (;;) {
      const admissionKey = canonicalMessageDigest({ cursor, part: 'admission' }).slice(7);
      const resultKey = canonicalMessageDigest({ cursor, part: 'result' }).slice(7);
      const admission = readPlanningRecord<{ request: typeof request; reservation: GenericAutomationBudgetReservationV1 }>(root, intent, admissionKey);
      if (admission && canonicalMessageBytes(admission.request) !== canonicalMessageBytes(request)) throw new CampaignPlanningError('human_attention_required', 'acquisition key names a different authenticated request');
      let result = readPlanningRecord<AcquireNextScheduledEngineerTaskResult>(root, intent, resultKey);
      const replay = result !== null;
      if (admission && !result) throw new CampaignPlanningError('human_attention_required', 'campaign acquisition requires reconciliation before another effect');
      if (!admission && result) throw new CampaignPlanningError('human_attention_required', 'campaign acquisition result has no admission');
      const reservation = admission?.reservation ?? reserveAutomationBudget({ repo_root: root, automation_run_id: budget.automation_run_id,
        expected_budget_sha256: budget.budget_sha256, idempotency_key: cursor, operation: 'acquisition', unit_kind: 'execute',
        unit_id: `${intent.campaign_id}:group:${intent.group_number}`, attempt: 1, provider: null, env: input.env });
      if (!result) {
        persist(admissionKey, { request, reservation });
        // Exceptions leave the durable admission unresolved. A missing return is not a failed acquisition proof.
        result = invoke();
        persist(resultKey, result);
      }
      const definitive = result.ok || ['engineer_no_eligible_offer', 'engineer_offer_stale', 'engineer_concurrency_unavailable', 'claim_actor_receipt_failed', 'engineer_acquire_next_conflict'].includes(result.error);
      if (definitive) appendAutomationUsage({ repo_root: root, reservation, outcome: result.ok ? 'progress' : 'no_progress',
        evidence_refs: [{ ref: `campaign-acquisition:${resultKey}`, sha256: canonicalMessageDigest({ result }).slice(7) }], env: input.env });
      if (!replay || result.ok || result.error !== 'engineer_no_eligible_offer') return result;
      // acquire-next deliberately does not cache idle. Each later try receives its own reservation,
      // chained to the prior observed result, while completed acquisitions replay without spending.
      cursor = canonicalMessageDigest({ previous: cursor, result });
    }
    });
  } catch (error) {
    // Only contention before admission is idle. An inner lock failure may follow an effect and must remain unresolved.
    if (!entered && error instanceof ExclusiveLockContentionError && error.kind === 'timeout') return { admission_busy: true };
    throw error;
  }
}

export function runCampaignAcquisition(input: CampaignAcquisitionInput, acquire = acquireNextScheduledEngineerTask) {
  const root = input.repo_root;
  const intent = readIssueBatchIntent(root, input.campaign_id, input.group_number, input.intent_sha256);
  const authority = requireCampaignPlanningAuthority(root, intent, input.env);
  if (input.host !== authority.grant.campaign!.local_parent_host || !input.session_id?.trim() || input.session_id.length > 256) throw new CampaignPlanningError('human_attention_required', 'execution requires the authorized local parent host and session');
  if (!input.idempotency_key || input.idempotency_key.length > 512) throw new CampaignPlanningError('human_attention_required', 'execution requires a bounded idempotency key');
  if (authority.policy.mode === 'shadow') return { action: 'idle' as const, reason: 'shadow campaign cannot acquire workers' };
  requireCampaignActiveAdmission();
  const parent = readPlanningRecord<{ host: string; session_id: string }>(root, intent, 'parent');
  if (!parent || parent.host !== input.host || parent.session_id !== input.session_id) throw new CampaignPlanningError('human_attention_required', 'execution session does not own this group planning');
  if (!authority.grant.campaign?.liveness_policy || authority.grant.campaign.liveness_policy.renewal_actor_kind !== 'controller') throw new CampaignPlanningError('human_attention_required', 'campaign execution requires an explicit controller liveness policy');
  const principal = resolveEngineerPrincipal({ repo_root: root, authorization_id: input.authorization_id, env: input.env });
  const validateHandoff = (acquired: Extract<ScheduledEngineerAcquireResult, { ok: true }>) => {
    const currentPrincipal = resolveEngineerPrincipal({ repo_root: root, authorization_id: input.authorization_id, env: input.env });
    if (canonicalMessageBytes({ ...currentPrincipal }) !== canonicalMessageBytes({ ...principal })) throw new CampaignPlanningError('human_attention_required', 'Engineer principal changed during acquisition');
    const receipt = readClaimActorReceipt(root, acquired.envelope.task_id, acquired.envelope.claim_id);
    if (!receipt || canonicalMessageBytes({ ...receipt }) !== canonicalMessageBytes({ ...acquired.receipt }) || receipt.engineer_id !== principal.engineer_id || receipt.binding_id !== principal.binding_id) throw new CampaignPlanningError('human_attention_required', 'acquisition lacks its authenticated stored ClaimActorReceipt');
    validateClaimActorReceiptLive(root, receipt, acquired.envelope);
    validateFleetWorkEnvelope(root, acquired.envelope, input.env);
    if (requireCampaignPlanningAuthority(root, intent, input.env).policy.mode !== 'active') throw new CampaignPlanningError('human_attention_required', 'campaign execution is no longer active');
  };
  let acceptedFresh = false;
  const acquired = budgetedAcquisition(input, intent, principal, () => {
    const result = acquire({
    repo_root: root, principal, session_id: input.session_id, env: input.env,
    idempotency_key: canonicalMessageDigest({ operation: 'campaign-acquisition', intent_sha256: intent.intent_sha256, key: input.idempotency_key }),
    filters: { task_ids: authority.manifest.slots.map(slot => slot.task_id) },
    accept_acquired: result => {
      try {
        validateHandoff(result);
        acceptedFresh = true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const work = result.envelope;
        try {
          const live = readLease(root, work.task_id);
          if (live.classification === 'unknown') throw new Error('own Lease state is unknown');
          const lease = live.record;
          if (lease && lease.claim_id === work.claim_id && lease.generation === work.generation
            && lease.state === 'bound' && lease.execution_worktree === work.worktree_path
            && lease.branch === work.branch && lease.unit_ref === work.unit_ref) {
            const released = releaseSprintCommand({ claimId: work.claim_id }, processSprintDependencies(root));
            if (released.exitCode !== 0) throw new Error(released.stderr || released.stdout);
          } else if (lease?.claim_id === work.claim_id) {
            throw new Error('own Lease no longer matches the acquired handoff');
          }
        } catch (rollbackError) {
          return { ok: false, error: 'rollback_failed', message: `${message}; own-claim release failed: ${String(rollbackError)}; residual worktree: ${work.worktree_path}` };
        }
        return { ok: false, error: 'claim_actor_receipt_failed', message };
      }
    },
    });
    if (result.ok && !acceptedFresh) throw new CampaignPlanningError('human_attention_required', 'unbudgeted acquisition replay requires reconciliation');
    return result;
  });
  if ('admission_busy' in acquired) return { action: 'idle' as const, reason: 'campaign acquisition admission lock is occupied' };
  if (!acquired.ok) {
    const fleet = acquired.error === 'fleet_acquire_failed' ? acquired.fleet : undefined;
    if (acquired.error === 'engineer_no_eligible_offer' || fleet && !fleet.ok && fleet.error === 'fleet_acquire_failed' && fleet.fleet?.error === 'no_eligible_task') return { action: 'idle' as const, reason: 'no eligible campaign task or campaign capacity is occupied' };
    return acquired;
  }
  // A replay may already be running in a worker; reject stale authority without releasing it.
  if (!acceptedFresh) validateHandoff(acquired);
  return {
    action: 'dispatch' as const, envelope: acquired.envelope, receipt: acquired.receipt,
    worker_handoff: createCampaignWorkerHandoff(input, acquired),
    instructions: [
      'The local parent host starts the acquired worker through contract-run run --campaign-handoff <selector-json-file>; save worker_handoff as that selector. The selector only names the stored handoff.',
      'Use the envelope worktree and contract allowed_paths; preserve the admitted repair scope. Stop when claim authority is lost.',
      'Use the existing contract-worktree and ship-worktrees workflow for verification and manual publication. These instructions do not create task ownership.',
    ],
  };
}
