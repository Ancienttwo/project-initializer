import { createHash } from 'crypto';
import { lstatSync, readFileSync, realpathSync } from 'fs';
import { isAbsolute, join, relative, resolve } from 'path';
import { canonicalMessageBytes, canonicalMessageDigest } from '../../core/messages/mechanics';
import { attemptIdentity, AUTOMATION_ATTEMPT_OUTCOMES, type TaskAutomationAttemptOutcome } from '../../core/engineers/automation-attempt';
import { resolveEngineerPrincipal } from '../engineers/principal';
import { readClaimActorReceipt, validateClaimActorReceiptLive } from '../engineers/claim-actor-store';
import { recordTaskAutomationAttemptStart, recordTaskAutomationAttemptOutcome } from '../engineers/automation-attempt-store';
import type { ScheduledEngineerAcquireResult } from '../engineers/scheduling-acquire';
import { validateFleetWorkEnvelope } from '../fleet/acquire';
import { readIssueBatchIntent } from './issue-batch-store';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import { persistPlanningRecord, readPlanningRecord, withCampaignPlanningLock } from './campaign-planning-store';
import { ensureCampaignAuthoringBudget, reserveAutomationBudget, appendAutomationUsage, readAutomationBudgetStatus } from './budget-store';
import { automationStoreNow } from './clock';
import type { CampaignAcquisitionInput } from './campaign-acquisition';

type Acquisition = Extract<ScheduledEngineerAcquireResult, { ok: true }>;
export interface CampaignWorkerSelector {
  readonly repo_root: string;
  readonly campaign_id: string;
  readonly group_number: number;
  readonly intent_sha256: string;
  readonly dispatch_id: string;
}
interface Handoff {
  readonly selector: CampaignWorkerSelector;
  readonly host: 'claude' | 'codex';
  readonly session_id: string;
  readonly authorization_id: string;
  readonly acquired: Acquisition;
  readonly contract_sha256: string;
}
export interface CampaignContractRunResult {
  readonly status: 'pass' | 'fail';
  readonly failure_class: string | null;
}
export interface CampaignWorkerChildObservation {
  readonly role: 'worker' | 'verifier';
  readonly command: string;
  readonly exit_code: number | null;
  readonly stdout_path: string;
  readonly stderr_path: string;
  readonly timed_out?: boolean;
}
function digest(bytes: string | Buffer): string { return createHash('sha256').update(bytes).digest('hex'); }
function key(dispatch: string, part: string): string { return canonicalMessageDigest({ dispatch, part }).slice(7); }
function exact(a: unknown, b: unknown): boolean { return canonicalMessageBytes({ value: a }) === canonicalMessageBytes({ value: b }); }
function file(root: string, path: string): Buffer {
  if (isAbsolute(path) || relative(root, resolve(root, path)).startsWith('..')) throw new Error('campaign worker evidence must be repository-relative');
  const resolved = resolve(root, path);
  if (!lstatSync(resolved).isFile() || lstatSync(resolved).isSymbolicLink() || relative(realpathSync(root), realpathSync(resolved)).startsWith('..')) throw new Error('campaign worker evidence must be a contained regular file');
  return readFileSync(resolved);
}
export function createCampaignWorkerHandoff(input: CampaignAcquisitionInput, acquired: Acquisition): CampaignWorkerSelector {
  const root = realpathSync(input.repo_root);
  const intent = readIssueBatchIntent(root, input.campaign_id, input.group_number, input.intent_sha256);
  const dispatch = canonicalMessageDigest({ operation: 'campaign-worker', intent: intent.intent_sha256, claim: acquired.envelope.claim_id, generation: acquired.envelope.generation });
  const selector = { repo_root: root, campaign_id: intent.campaign_id, group_number: intent.group_number, intent_sha256: intent.intent_sha256, dispatch_id: dispatch };
  const handoff: Handoff = { selector, host: input.host, session_id: input.session_id, authorization_id: input.authorization_id, acquired,
    contract_sha256: digest(file(acquired.envelope.worktree_path, acquired.envelope.plan.contract_path)) };
  withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, key(dispatch, 'handoff'), handoff));
  return Object.freeze(selector);
}

/** The selector identifies stored authority; no field in the input file grants ownership. */
export function bindCampaignWorker(input: {
  readonly selector: unknown; readonly worktree: string; readonly contract: string;
  readonly worker_command: string; readonly verifier_command: string; readonly env?: NodeJS.ProcessEnv;
}) {
  const selector = input.selector as CampaignWorkerSelector;
  if (!selector || !exact(Object.keys(selector).sort(), ['campaign_id', 'dispatch_id', 'group_number', 'intent_sha256', 'repo_root'])
    || typeof selector.repo_root !== 'string' || !isAbsolute(selector.repo_root) || !/^sha256:[a-f0-9]{64}$/.test(selector.dispatch_id)) throw new Error('invalid campaign worker selector');
  const root = realpathSync(selector.repo_root);
  const intent = readIssueBatchIntent(root, selector.campaign_id, selector.group_number, selector.intent_sha256);
  const handoff = readPlanningRecord<Handoff>(root, intent, key(selector.dispatch_id, 'handoff'));
  if (!handoff || !exact(handoff.selector, selector)) throw new Error('campaign worker handoff is not stored');
  const work = handoff.acquired.envelope; const offer = handoff.acquired.offer;
  if (realpathSync(input.worktree) !== realpathSync(work.worktree_path) || input.contract !== work.plan.contract_path) throw new Error('campaign worker requires its exact acquired worktree and contract');
  const validate = () => {
    const authority = requireCampaignPlanningAuthority(root, intent, input.env);
    const parent = readPlanningRecord<{ host: string; session_id: string }>(root, intent, 'parent');
    const principal = resolveEngineerPrincipal({ repo_root: root, authorization_id: handoff.authorization_id, env: input.env });
    const stored = readClaimActorReceipt(root, work.task_id, work.claim_id);
    if (authority.policy.mode !== 'active' || authority.grant.campaign?.local_parent_host !== handoff.host
      || parent?.host !== handoff.host || parent.session_id !== handoff.session_id
      || principal.engineer_id !== offer.engineer_id || principal.binding_id !== offer.binding_id || principal.binding_generation !== offer.binding_generation
      || !stored || !exact(stored, handoff.acquired.receipt)) throw new Error('campaign worker parent or Engineer authority is stale');
    validateClaimActorReceiptLive(root, stored, work);
    validateFleetWorkEnvelope(root, work, input.env);
    if (digest(file(work.worktree_path, input.contract)) !== handoff.contract_sha256) throw new Error('campaign worker projected contract changed');
    return authority;
  };
  const authority = validate();
  const request = { dispatch_id: selector.dispatch_id, contract_sha256: handoff.contract_sha256, worker_command: input.worker_command, verifier_command: input.verifier_command };
  const read = <T>(part: string) => readPlanningRecord<T>(root, intent, key(selector.dispatch_id, part));
  const persist = (part: string, value: unknown) => withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, key(selector.dispatch_id, part), value));
  const priorLaunch = read<{ request: typeof request; started_at: string }>('launch');
  if (priorLaunch && !exact(priorLaunch.request, request)) throw new Error('campaign worker replay changes its launch request');
  const priorFinal = read<{ contract_run: CampaignContractRunResult; outcome: Exclude<TaskAutomationAttemptOutcome, 'started'>; ended_at: string; runtime_effect_id: string; evidence_refs: string[]; result_sha256: string; reservation: ReturnType<typeof reserveAutomationBudget>; evidence: { path: string; sha256: string }[] }>('final');
  if (priorLaunch && !priorFinal) throw new Error('campaign worker launch requires reconciliation; replay cannot spawn again');
  const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority.grant, env: input.env }).budget;
  const controllerRun = `sha256:${budget.automation_run_id}`;
  const identity = attemptIdentity({ claim_id: work.claim_id, lease_generation: work.generation, controller_run_id: controllerRun, dispatch_id: selector.dispatch_id });
  const finishAttempt = (final: NonNullable<typeof priorFinal>) => recordTaskAutomationAttemptOutcome({ repo_root: root,
    work_package_id: offer.work_package_id, work_package_revision: offer.work_package_revision, policy: offer.retry_policy,
    identity_sha256: identity, outcome: final.outcome, ended_at: final.ended_at, runtime_effect_id: final.runtime_effect_id, evidence_refs: final.evidence_refs });
  const settleFinal = (final: NonNullable<typeof priorFinal>) => {
    if (!final.reservation) throw new Error('campaign worker final lacks its complete attempt reservation; reconciliation required');
    appendAutomationUsage({ repo_root: root, reservation: final.reservation, outcome: 'no_progress',
      evidence_refs: [{ ref: `campaign-worker:${selector.dispatch_id}:result`, sha256: final.result_sha256 }], env: input.env });
    finishAttempt(final);
  };
  if (priorFinal) {
    settleFinal(priorFinal);
    return { replay: priorFinal, selector, deadline_at: budget.deadline_at, beforeChild: () => { throw new Error('completed campaign worker cannot spawn'); }, afterChild: (_observation: CampaignWorkerChildObservation) => {}, finish: (_resultPath: string, _contractRun: CampaignContractRunResult) => priorFinal };
  }
  const launch = { request, started_at: new Date().toISOString() };
  // This exclusive immutable claim is created before any child or attempt side effect.
  withCampaignPlanningLock(root, intent, () => {
    if (read('launch')) throw new Error('campaign worker launch already claimed');
    persistPlanningRecord(root, intent, key(selector.dispatch_id, 'launch'), launch);
  });
  let attemptStarted = false;
  let reservation: ReturnType<typeof reserveAutomationBudget> | null = null;
  const admittedRoles = new Set<'worker' | 'verifier'>();
  const observations: CampaignWorkerChildObservation[] = [];
  return {
    replay: null, selector, deadline_at: budget.deadline_at,
    beforeChild(role: 'worker' | 'verifier', command: string) {
      validate();
      if (admittedRoles.has(role) || command !== (role === 'worker' ? request.worker_command : request.verifier_command)) throw new Error('campaign worker child identity differs');
      if (role === 'worker') {
        reservation = reserveAutomationBudget({ repo_root: root, automation_run_id: budget.automation_run_id, expected_budget_sha256: budget.budget_sha256,
          idempotency_key: key(selector.dispatch_id, 'attempt'), operation: offer.attempt_count > 0 ? 'retry_attempt' : 'dispatch_attempt',
          unit_kind: 'execute', unit_id: offer.work_package_id, attempt: offer.attempt_count + 1, provider: null, env: input.env });
      } else if (!reservation || observations.length !== 1 || observations[0]?.role !== 'worker' || observations[0].exit_code !== 0) {
        throw new Error('campaign verifier requires its admitted and observed worker');
      }
      const current = readAutomationBudgetStatus(root, budget.automation_run_id, input.env);
      if (!reservation || current.budget.budget_sha256 !== reservation.budget_sha256
        || !current.current.open_reservation_sha256s.includes(reservation.reservation_sha256)) throw new Error('campaign attempt reservation is no longer current and open');
      if (Date.parse(automationStoreNow()) >= Date.parse(reservation.deadline_at)) throw new Error('campaign attempt deadline expired before child');
      admittedRoles.add(role);
      if (!attemptStarted) {
        recordTaskAutomationAttemptStart({ repo_root: root, repository_id: offer.repository_id, sprint_path: offer.sprint_path,
          task_id: work.task_id, task_revision: work.task_revision, work_package_id: offer.work_package_id, work_package_revision: offer.work_package_revision,
          engineer_id: offer.engineer_id, binding_generation: offer.binding_generation, claim_id: work.claim_id, lease_generation: work.generation,
          controller_run_id: controllerRun, dispatch_id: selector.dispatch_id, budget_revision: `sha256:${budget.budget_sha256}`,
          policy: offer.retry_policy, first_eligible_at: offer.eligible_since, started_at: launch.started_at });
        attemptStarted = true;
      }
    },
    afterChild(observation: CampaignWorkerChildObservation) {
      if (!reservation || !admittedRoles.has(observation.role)) throw new Error('campaign child has no invocation reservation');
      const evidence = { observation, stdout_sha256: digest(file(work.worktree_path, observation.stdout_path)), stderr_sha256: digest(file(work.worktree_path, observation.stderr_path)) };
      persist(`child-${observation.role}`, evidence);
      observations.push(observation);
      if (observation.exit_code === null || observation.timed_out === true) throw new Error('campaign child process outcome is unknown; reservation remains unresolved');

    },
    finish(resultPath: string, contractRun: CampaignContractRunResult) {
      validate();
      if ((contractRun.status !== 'pass' && contractRun.status !== 'fail')
        || (contractRun.status === 'pass' ? contractRun.failure_class !== null : typeof contractRun.failure_class !== 'string' || contractRun.failure_class.length === 0)) throw new Error('campaign worker requires the actual contract-run status');
      if (!attemptStarted) throw new Error('campaign worker never started an admitted attempt');
      const resultBytes = file(work.worktree_path, resultPath);
      const result = JSON.parse(resultBytes.toString('utf8')) as { outcome: Exclude<TaskAutomationAttemptOutcome, 'started'>; evidence_paths: string[] };
      if (!exact(Object.keys(result).sort(), ['evidence_paths', 'outcome']) || result.outcome === ('started' as string)
        || !AUTOMATION_ATTEMPT_OUTCOMES.includes(result.outcome) || !Array.isArray(result.evidence_paths) || result.evidence_paths.length === 0
        || result.evidence_paths.some(path => typeof path !== 'string')) throw new Error('campaign worker requires an explicit closed attempt result with evidence');
      if (observations.length !== 2 || observations.some(item => item.exit_code !== 0)) throw new Error('campaign worker result lacks successful worker and verifier process evidence');
      const evidence = result.evidence_paths.map(path => ({ path, sha256: digest(file(work.worktree_path, path)) }));
      if (!reservation) throw new Error('campaign final lacks its admitted attempt');
      const final = { reservation, contract_run: { ...contractRun }, outcome: result.outcome, ended_at: new Date().toISOString(), result_sha256: digest(resultBytes), evidence,
        runtime_effect_id: canonicalMessageDigest({ request, contract_run: contractRun, worker: read('child-worker'), verifier: read('child-verifier'), result_sha256: digest(resultBytes) }),
        evidence_refs: [canonicalMessageDigest({ result_sha256: digest(resultBytes), evidence }), ...observations.map(item => canonicalMessageDigest({ ...item }))] };
      persist('final', final);
      settleFinal(final);
      return final;
    },
  };
}
