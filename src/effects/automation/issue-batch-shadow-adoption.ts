import { automationDigest } from '../../core/automation/budget';
import { IssueBatchAdoptionError } from '../../core/automation/issue-batch-adoption';
import type { IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import { reconcileIssueBatchSlots, type ReconcileIssueBatchSlotsInput } from '../../core/automation/issue-batch-reconcile';
import {
  beginCampaignBudgetStep, completeCampaignBudgetStep, readAutomationBudgetStatus, readCampaignAuthoringProgress,
  readCampaignAuthoringBudgetTerminal, sealCampaignAuthoringBudget, type CampaignAuthoringTerminalBindingInput,
} from './budget-store';
import { createCampaignProviderExecutor } from './campaign-provider-execution';
import { IssueBatchObserverError, observeIssueBatch, type IssueBatchObservationSnapshotV1 } from './issue-batch-observer';
import { persistIssueBatchAdoptionArtifact, readIssueBatchAdoptionArtifact, withIssueBatchSealSources } from './issue-batch-store';
import type { GithubCommandRunner } from '../external-sources/github';

type Prior = Pick<ReconcileIssueBatchSlotsInput, 'prior_observations' | 'repair_exhausted_slots'>;
type ShadowOutcome = { admission_sha256: string; epoch_sha256: string } & (
  { outcome: 'progress'; snapshot: IssueBatchObservationSnapshotV1; final_snapshot: IssueBatchObservationSnapshotV1; reason: 'authoring_completed' | 'authoring_exhausted' }
  | { outcome: 'no_progress'; message: string; failure_receipt: unknown }
);
function fail(message: string): never { throw new IssueBatchAdoptionError('issue_adoption_reconciliation_required', message); }

/** Shadow is a point-in-time observation; the active step fences authorized authoring until seal. */
export function observeShadowAdoption(input: {
  binding: CampaignAuthoringTerminalBindingInput; intent: IssueBatchIntentV1; prior: Prior;
  observe?: typeof observeIssueBatch; runner?: GithubCommandRunner; now: () => Date;
  validate: (snapshot: IssueBatchObservationSnapshotV1) => 'complete' | 'partial';
}) {
  const { binding, intent } = input;
  const progress = readCampaignAuthoringProgress(binding);
  if (progress.held_rounds) fail('shadow authoring outcome requires reconciliation');
  const step = { ...binding, idempotency_key: automationDigest({ kind: 'shadow-adoption', intent: intent.intent_sha256,
    epoch: progress.epoch_sha256, prior: input.prior }) };
  const artifact = `shadow-${step.idempotency_key}` as const;
  let stored = readIssueBatchAdoptionArtifact(binding.repo_root, intent, artifact) as ShadowOutcome | null;
  if (!stored && readCampaignAuthoringBudgetTerminal(binding)) fail('sealed shadow has no admitted observation evidence');
  const { admission, disposition } = beginCampaignBudgetStep({ ...step, replay_only: stored !== null });
  if (readCampaignAuthoringProgress(binding).epoch_sha256 !== progress.epoch_sha256) fail('authoring epoch changed before shadow admission');
  if (!stored) {
    if (disposition === 'replayed') fail('shadow observation was admitted without a durable result; reconciliation required');
    const provider = createCampaignProviderExecutor({ ...step, step_admission_sha256: admission.event_sha256 }, input.runner);
    const observe = () => (input.observe ?? observeIssueBatch)({ repo_root: binding.repo_root, intent, env: binding.env, now: input.now, runner: provider.read });
    let snapshot: IssueBatchObservationSnapshotV1 | null = null;
    try {
      snapshot = observe();
      const outcome = input.validate(snapshot);
      if (outcome !== 'complete' && progress.completed_rounds !== progress.max_rounds) fail('partial adoption requires exhausted authoring rounds');
      const finalSnapshot = observe();
      input.validate(finalSnapshot);
      reconcileIssueBatchSlots({ intent, snapshot_receipt: finalSnapshot.receipt, observations: finalSnapshot.observations,
        prior_observations: snapshot.observations, repair_exhausted_slots: input.prior.repair_exhausted_slots, current_main_sha: intent.base_main_sha });
      if (JSON.stringify(finalSnapshot.observations.map(o => o.source_revision).sort()) !== JSON.stringify(snapshot.observations.map(o => o.source_revision).sort())) fail('provider sources changed during shadow observation');
      stored = { admission_sha256: admission.event_sha256, epoch_sha256: progress.epoch_sha256, outcome: 'progress',
        snapshot, final_snapshot: finalSnapshot, reason: outcome === 'complete' ? 'authoring_completed' : 'authoring_exhausted' };
    } catch (error) {
      // The adapter may wrap unknown exceptions. Only the budget ledger proves that no leaf remains unresolved.
      if (!(error instanceof IssueBatchAdoptionError || error instanceof IssueBatchObserverError)
        || readAutomationBudgetStatus(binding.repo_root, binding.automation_run_id, binding.env).current.open_reservation_sha256s.length) throw error;
      stored = { admission_sha256: admission.event_sha256, epoch_sha256: progress.epoch_sha256, outcome: 'no_progress',
        message: error.message, failure_receipt: error instanceof IssueBatchObserverError ? error.receipt : snapshot };
    }
    persistIssueBatchAdoptionArtifact(binding.repo_root, intent, artifact, { ...stored });
  }
  if (stored.admission_sha256 !== admission.event_sha256 || stored.epoch_sha256 !== progress.epoch_sha256) fail('shadow snapshot admission or epoch differs');
  const evidence = [{ ref: `shadow-adoption:${admission.event_sha256}`, sha256: automationDigest(stored) }];
  if (stored.outcome === 'no_progress') {
    completeCampaignBudgetStep({ ...binding, admission, outcome: 'no_progress', evidence_refs: evidence });
    fail(stored.message);
  }
  if (stored.outcome !== 'progress') fail('shadow outcome is invalid');
  const outcome = input.validate(stored.snapshot); input.validate(stored.final_snapshot);
  if (stored.reason !== (outcome === 'complete' ? 'authoring_completed' : 'authoring_exhausted')) fail('stored shadow terminal reason differs');
  const sealSources = { source_revisions: stored.snapshot.observations.map(o => o.source_revision).sort() };
  if (JSON.stringify(stored.final_snapshot.observations.map(o => o.source_revision).sort()) !== JSON.stringify(sealSources.source_revisions)) fail('stored shadow source revisions differ');
  const terminal = withIssueBatchSealSources(binding.repo_root, intent, sealSources,
    () => readCampaignAuthoringBudgetTerminal(binding),
    () => sealCampaignAuthoringBudget({ ...binding, reason: stored.reason, step_completion: { admission, outcome: 'progress', evidence_refs: evidence } }));
  return { snapshot: stored.snapshot, finalSnapshot: stored.final_snapshot, terminal, artifact };
}
