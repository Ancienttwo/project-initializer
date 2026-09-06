import { createCampaignWorkerHandoff } from './campaign-worker';
import { canonicalMessageBytes, canonicalMessageDigest } from '../../core/messages/mechanics';
import { CampaignPlanningError } from '../../core/automation/campaign-planning';
import { resolveEngineerPrincipal } from '../engineers/principal';
import { acquireNextScheduledEngineerTask } from '../engineers/scheduling-acquire-next';
import { readClaimActorReceipt, validateClaimActorReceiptLive } from '../engineers/claim-actor-store';
import { validateFleetWorkEnvelope } from '../fleet/acquire';
import { readLease } from '../state/coordination-lease-store';
import { processSprintDependencies, releaseSprintCommand } from '../state/coordination-sprint';
import type { ScheduledEngineerAcquireResult } from '../engineers/scheduling-acquire';
import { readIssueBatchIntent } from './issue-batch-store';
import { readPlanningRecord } from './campaign-planning-store';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import type { CampaignPlanningStepInput } from './campaign-planning';

export interface CampaignAcquisitionInput extends Omit<CampaignPlanningStepInput, 'result'> {
  readonly authorization_id: string;
}

export function runCampaignAcquisition(input: CampaignAcquisitionInput, acquire = acquireNextScheduledEngineerTask) {
  const root = input.repo_root;
  const intent = readIssueBatchIntent(root, input.campaign_id, input.group_number, input.intent_sha256);
  const authority = requireCampaignPlanningAuthority(root, intent, input.env);
  if (input.host !== authority.grant.campaign!.local_parent_host || !input.session_id?.trim() || input.session_id.length > 256) throw new CampaignPlanningError('human_attention_required', 'execution requires the authorized local parent host and session');
  if (!input.idempotency_key || input.idempotency_key.length > 512) throw new CampaignPlanningError('human_attention_required', 'execution requires a bounded idempotency key');
  if (authority.policy.mode === 'shadow') return { action: 'idle' as const, reason: 'shadow campaign cannot acquire workers' };
  const parent = readPlanningRecord<{ host: string; session_id: string }>(root, intent, 'parent');
  if (!parent || parent.host !== input.host || parent.session_id !== input.session_id) throw new CampaignPlanningError('human_attention_required', 'execution session does not own this group planning');
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
  const acquired = acquire({
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
