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
import { ensureCampaignAuthoringBudget, reserveAutomationBudget, appendAutomationUsage, readAutomationUsageForResult, readAutomationBudgetStatus } from './budget-store';
import { automationStoreNow } from './clock';
import type { CampaignAcquisitionInput } from './campaign-acquisition';
import { readLease } from '../state/coordination-lease-store';
import { LeaseLivenessStoreError, readLeaseLiveness, renewLeaseLiveness } from '../state/coordination-lease-liveness-store';

import { campaignRuntimeRecordKey, type CampaignCodexInvocation } from '../../core/automation/campaign-runtime';
import { prepareCampaignCodexInvocation, assertCampaignInvocationExecutable, observeCampaignCodexTerminal, parseCampaignVerifierResponse } from './campaign-runtime';

type Acquisition = Extract<ScheduledEngineerAcquireResult, { ok: true }>;
export interface CampaignWorkerSelector {
  readonly repo_root: string;
  readonly campaign_id: string;
  readonly group_number: number;
  readonly intent_sha256: string;
  readonly dispatch_id: string;
}
export interface CampaignWorkerHandoff {
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
export type CampaignWorkerFinal = { contract_run: CampaignContractRunResult; outcome: Exclude<TaskAutomationAttemptOutcome, 'started'>; ended_at: string; runtime_effect_id: string; evidence_refs: string[]; result_sha256: string; reservation: ReturnType<typeof reserveAutomationBudget>; evidence: { path: string; sha256: string }[] };
export interface CampaignWorkerChildObservation {
  readonly role: 'worker' | 'verifier';
  readonly command: string;
  readonly exit_code: number | null;
  readonly stdout_path: string;
  readonly stderr_path: string;
  readonly timed_out?: boolean;
  readonly process_group_quiescence?: { readonly scope: 'posix_process_group' | 'unsupported'; readonly state: 'quiescent' | 'active' | 'unknown' };
  readonly renewal_failure?: string;
  readonly output_sha256?: { readonly stdout: string; readonly stderr: string };
  readonly output_complete?: boolean;
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
  const handoff: CampaignWorkerHandoff = { selector, host: input.host, session_id: input.session_id, authorization_id: input.authorization_id, acquired,
    contract_sha256: digest(file(acquired.envelope.worktree_path, acquired.envelope.plan.contract_path)) };
  withCampaignPlanningLock(root, intent, () => {
    persistPlanningRecord(root, intent, key(dispatch, 'handoff'), handoff);
    const policy = requireCampaignPlanningAuthority(root, intent, input.env).grant.campaign?.liveness_policy;
    if (!policy) throw new Error('campaign dispatch requires an explicit controller liveness policy');
    let armed = false;
    try { readLeaseLiveness(root, acquired.envelope.task_id, { claim_id: acquired.envelope.claim_id, lease_generation: acquired.envelope.generation }); armed = true; }
    catch (error) { if (!(error instanceof LeaseLivenessStoreError) || error.code !== 'liveness_not_found') throw error; }
    if (!armed) {
      const owner = readLease(root, acquired.envelope.task_id).record;
      if (!owner || owner.claim_id !== acquired.envelope.claim_id || owner.generation !== acquired.envelope.generation) throw new Error('campaign acquisition lost its Lease before liveness arm');
      renewLeaseLiveness({ repo_root: root, owner, policy, owner_id: dispatch, observed_at: new Date().toISOString(), requested_ttl_ms: policy.maximum_ttl_ms,
        binding_generation: acquired.offer.binding_generation, runtime_effect_id: canonicalMessageDigest({ dispatch_id: dispatch, role: 'worker' }), expected_current_sha256: null });
    }
  });
  return Object.freeze(selector);
}

export function readCampaignWorkerHandoff(value: unknown) {
  const selector = value as CampaignWorkerSelector;
  if (!selector || !exact(Object.keys(selector).sort(), ['campaign_id', 'dispatch_id', 'group_number', 'intent_sha256', 'repo_root'])
    || typeof selector.repo_root !== 'string' || !isAbsolute(selector.repo_root) || !/^sha256:[a-f0-9]{64}$/.test(selector.dispatch_id)) throw new Error('invalid campaign worker selector');
  const root = realpathSync(selector.repo_root);
  const intent = readIssueBatchIntent(root, selector.campaign_id, selector.group_number, selector.intent_sha256);
  const handoff = readPlanningRecord<CampaignWorkerHandoff>(root, intent, key(selector.dispatch_id, 'handoff'));
  if (!handoff || !exact(handoff.selector, selector)) throw new Error('campaign worker handoff is not stored');
  return { selector, root, intent, handoff };
}

/** The selector identifies stored authority; no field in the input file grants ownership. */
export function bindCampaignWorker(input: {
  readonly selector: unknown; readonly worktree: string; readonly contract: string;
  readonly worker_command: string; readonly verifier_command: string; readonly provider?: 'codex-exec'; readonly env?: NodeJS.ProcessEnv;
  readonly crash_hook?: (boundary: 'after_final') => void;
}) {
  const { selector, root, intent, handoff } = readCampaignWorkerHandoff(input.selector);
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
  const livenessPolicy = authority.grant.campaign?.liveness_policy;
  const request = { dispatch_id: selector.dispatch_id, contract_sha256: handoff.contract_sha256, worker_command: input.worker_command, verifier_command: input.verifier_command, ...(input.provider ? { provider: input.provider } : {}) };
  const read = <T>(part: string) => readPlanningRecord<T>(root, intent, key(selector.dispatch_id, part));
  const persist = (part: string, value: unknown) => withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, key(selector.dispatch_id, part), value));
  const priorLaunch = read<{ request: typeof request; started_at: string }>('launch');
  if (priorLaunch && !exact(priorLaunch.request, request)) throw new Error('campaign worker replay changes its launch request');
  const priorFinal = read<CampaignWorkerFinal>('final');
  if (priorLaunch && !priorFinal) throw new Error('campaign worker launch requires reconciliation; replay cannot spawn again');
  if (!priorFinal && (!livenessPolicy || livenessPolicy.renewal_actor_kind !== 'controller')) throw new Error('campaign dispatch requires an explicit controller liveness policy');
  const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority.grant, env: input.env }).budget;
  const controllerRun = `sha256:${budget.automation_run_id}`;
  const settleFinal = (final: CampaignWorkerFinal) => settleCampaignFinal({ root, selector, handoff, final, env: input.env });
  if (priorFinal) {
    settleFinal(priorFinal);
    return { replay: priorFinal, selector, deadline_at: budget.deadline_at, renewal_interval_ms: null, prepareChild: (_role: 'worker' | 'verifier', _prompt: string): CampaignCodexInvocation => { throw new Error('completed campaign worker cannot prepare a child'); }, renew: () => { throw new Error('completed campaign worker cannot renew'); }, beforeChild: () => { throw new Error('completed campaign worker cannot spawn'); }, afterChild: (_observation: CampaignWorkerChildObservation) => null, finish: (_resultPath: string, _contractRun: CampaignContractRunResult) => priorFinal };
  }
  if (!livenessPolicy || livenessPolicy.renewal_actor_kind !== 'controller') throw new Error('campaign dispatch requires an explicit controller liveness policy');
  const launch = { request, started_at: new Date().toISOString() };
  let attemptStarted = false;
  let reservation: ReturnType<typeof reserveAutomationBudget> | null = null;
  const admittedRoles = new Set<'worker' | 'verifier'>();
  const observations: CampaignWorkerChildObservation[] = [];
  const invocations = new Map<'worker' | 'verifier', CampaignCodexInvocation>();
  const assertNotRetired = () => { if (read('retired')) throw new Error('campaign dispatch controller has been retired'); };
  const runtimeKey = (role: 'worker' | 'verifier', phase: 'intent' | 'started' | 'terminal') => campaignRuntimeRecordKey(selector.dispatch_id, role, phase);
  let activeRole: 'worker' | 'verifier' | null = null;
  let verifierVerdict: 'pass' | 'fail' | null = null;
  const renewUnderLock = () => {
    assertNotRetired();
    validate();
    if (!activeRole || !admittedRoles.has(activeRole)) throw new Error('campaign renewal requires its admitted child');
    const owner = readLease(root, work.task_id).record;
    if (!owner || owner.claim_id !== work.claim_id || owner.generation !== work.generation) throw new Error('campaign renewal lost its Lease generation');
    let currentSha: string | null = null;
    try { currentSha = readLeaseLiveness(root, work.task_id, { claim_id: work.claim_id, lease_generation: work.generation }).current.current_sha256; }
    catch (error) { if (!(error instanceof LeaseLivenessStoreError) || error.code !== 'liveness_not_found') throw error; }
    return renewLeaseLiveness({ repo_root: root, owner, policy: livenessPolicy, owner_id: selector.dispatch_id,
      observed_at: new Date().toISOString(), requested_ttl_ms: livenessPolicy.maximum_ttl_ms,
      binding_generation: offer.binding_generation, runtime_effect_id: canonicalMessageDigest({ dispatch_id: selector.dispatch_id, role: activeRole }), expected_current_sha256: currentSha });
  };
  const renew = () => withCampaignPlanningLock(root, intent, renewUnderLock);
  return {
    replay: null, selector, deadline_at: budget.deadline_at, renewal_interval_ms: livenessPolicy.renewal_interval_ms, renew,
    prepareChild(role: 'worker' | 'verifier', prompt: string): CampaignCodexInvocation {
      if (input.provider !== 'codex-exec') throw new Error('campaign provider mode is not selected');
      validate();
      const invocation = prepareCampaignCodexInvocation({ repo_root: root, worktree: work.worktree_path, prompt_path: prompt, env: input.env,
        identity: { dispatch_id: selector.dispatch_id, role, task_id: work.task_id, task_revision: work.task_revision, claim_id: work.claim_id, lease_generation: work.generation, binding_generation: offer.binding_generation } });
      withCampaignPlanningLock(root, intent, () => {
        assertNotRetired();
        persistPlanningRecord(root, intent, runtimeKey(role, 'intent'), invocation);
      });
      invocations.set(role, invocation);
      return invocation;
    },
    beforeChild(role: 'worker' | 'verifier', command: string) {
      withCampaignPlanningLock(root, intent, () => {
      assertNotRetired();
      validate();
      const invocation = invocations.get(role);
      if (input.provider && !invocation) throw new Error('campaign Codex invocation intent is missing');
      if (invocation) assertCampaignInvocationExecutable(invocation);
      if (admittedRoles.has(role) || command !== (role === 'worker' ? request.worker_command : request.verifier_command)) throw new Error('campaign worker child identity differs');
      if (role === 'worker') {
        {
          if (read('launch')) throw new Error('campaign worker launch already claimed');
          reservation = reserveAutomationBudget({ repo_root: root, automation_run_id: budget.automation_run_id, expected_budget_sha256: budget.budget_sha256,
          idempotency_key: key(selector.dispatch_id, 'attempt'), operation: offer.attempt_count > 0 ? 'retry_attempt' : 'dispatch_attempt',
          unit_kind: 'execute', unit_id: offer.work_package_id, attempt: offer.attempt_count + 1, provider: input.provider ? 'codex' : null, env: input.env });
          // Refused admission publishes no launch; an admitted launch fences every child.
          persistPlanningRecord(root, intent, key(selector.dispatch_id, 'launch'), launch);
        }
      } else if (!reservation || observations.length !== 1 || observations[0]?.role !== 'worker' || observations[0].exit_code !== 0) {
        throw new Error('campaign verifier requires its admitted and observed worker');
      }
      const current = readAutomationBudgetStatus(root, budget.automation_run_id, input.env);
      if (!reservation || current.budget.budget_sha256 !== reservation.budget_sha256
        || !current.current.open_reservation_sha256s.includes(reservation.reservation_sha256)) throw new Error('campaign attempt reservation is no longer current and open');
      if (Date.parse(automationStoreNow()) >= Date.parse(reservation.deadline_at)) throw new Error('campaign attempt deadline expired before child');
      admittedRoles.add(role);
      activeRole = role;
      persistPlanningRecord(root, intent, key(selector.dispatch_id, `runtime-${role}`), { dispatch_id: selector.dispatch_id, role, runtime_effect_id: canonicalMessageDigest({ dispatch_id: selector.dispatch_id, role }), claim_id: work.claim_id, lease_generation: work.generation, binding_generation: offer.binding_generation });
      if (!attemptStarted) {
        recordTaskAutomationAttemptStart({ repo_root: root, repository_id: offer.repository_id, sprint_path: offer.sprint_path,
          task_id: work.task_id, task_revision: work.task_revision, work_package_id: offer.work_package_id, work_package_revision: offer.work_package_revision,
          engineer_id: offer.engineer_id, binding_generation: offer.binding_generation, claim_id: work.claim_id, lease_generation: work.generation,
          controller_run_id: controllerRun, dispatch_id: selector.dispatch_id, budget_revision: `sha256:${budget.budget_sha256}`,
          policy: offer.retry_policy, first_eligible_at: offer.eligible_since, started_at: launch.started_at });
        attemptStarted = true;
      }
      renewUnderLock();
      if (invocation) persistPlanningRecord(root, intent, runtimeKey(role, 'started'), { invocation_sha256: invocation.invocation_sha256, identity: invocation.identity, started_at: new Date().toISOString() });
      });
    },
    afterChild(observation: CampaignWorkerChildObservation) {
      if (!reservation || !admittedRoles.has(observation.role) || activeRole !== observation.role
        || observation.command !== (observation.role === 'worker' ? request.worker_command : request.verifier_command)) throw new Error('campaign child has no current exact invocation reservation');
      const evidence = { observation, stdout_sha256: digest(file(work.worktree_path, observation.stdout_path)), stderr_sha256: digest(file(work.worktree_path, observation.stderr_path)) };
      const invocation = invocations.get(observation.role);
      const terminal = invocation ? observeCampaignCodexTerminal({ invocation, worktree: work.worktree_path, ...observation }) : null;
      if (terminal) withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, runtimeKey(observation.role, 'terminal'), terminal));
      persist(`child-${observation.role}`, evidence);
      if (terminal?.state === 'unknown') throw new Error(`campaign provider termination is unknown; reservation remains unresolved: ${terminal.reason}`);
      observations.push(observation);
      activeRole = null;
      if (observation.renewal_failure) throw new Error(`campaign Lease renewal failed; reconciliation required: ${observation.renewal_failure}`);
      if (observation.exit_code === null || observation.timed_out === true) throw new Error('campaign child process outcome is unknown; reservation remains unresolved');
      const verdict = terminal && observation.role === 'verifier' ? parseCampaignVerifierResponse(terminal.final_response!) : null;
      if (verdict) verifierVerdict = verdict.verdict;
      return verdict;

    },
    finish(resultPath: string, contractRun: CampaignContractRunResult) {
      return withCampaignPlanningLock(root, intent, () => {
      assertNotRetired();
      validate();
      if ((contractRun.status !== 'pass' && contractRun.status !== 'fail')
        || (contractRun.status === 'pass' ? contractRun.failure_class !== null : typeof contractRun.failure_class !== 'string' || contractRun.failure_class.length === 0)) throw new Error('campaign worker requires the actual contract-run status');
      if (!attemptStarted) throw new Error('campaign worker never started an admitted attempt');
      const resultBytes = file(work.worktree_path, resultPath);
      const result = JSON.parse(resultBytes.toString('utf8')) as { outcome: Exclude<TaskAutomationAttemptOutcome, 'started'>; evidence_paths: string[] };
      if (!exact(Object.keys(result).sort(), ['evidence_paths', 'outcome']) || result.outcome === ('started' as string)
        || !AUTOMATION_ATTEMPT_OUTCOMES.includes(result.outcome) || !Array.isArray(result.evidence_paths) || result.evidence_paths.length === 0
        || result.evidence_paths.some(path => typeof path !== 'string')) throw new Error('campaign worker requires an explicit closed attempt result with evidence');
      if (input.provider && (verifierVerdict === null || verifierVerdict === 'fail' && contractRun.status === 'pass')) throw new Error('campaign final conflicts with the provider verifier verdict');
      if (observations.length !== 2 || observations[0]?.role !== 'worker' || observations[1]?.role !== 'verifier' || observations.some(item => item.exit_code !== 0)) throw new Error('campaign worker result lacks successful worker and verifier process evidence');
      const evidence = result.evidence_paths.map(path => ({ path, sha256: digest(file(work.worktree_path, path)) }));
      if (!reservation) throw new Error('campaign final lacks its admitted attempt');
      const final = { reservation, contract_run: { ...contractRun }, outcome: result.outcome, ended_at: new Date().toISOString(), result_sha256: digest(resultBytes), evidence,
        runtime_effect_id: canonicalMessageDigest({ request, contract_run: contractRun, worker: read('child-worker'), verifier: read('child-verifier'), result_sha256: digest(resultBytes) }),
        evidence_refs: [canonicalMessageDigest({ result_sha256: digest(resultBytes), evidence }), ...observations.map(item => canonicalMessageDigest({ ...item }))] };
      persistPlanningRecord(root, intent, key(selector.dispatch_id, 'final'), final);
      input.crash_hook?.('after_final');
      settleFinal(final);
      return final;
      });
    },
  };
}

function settleCampaignFinal(input: {
  root: string; selector: CampaignWorkerSelector; handoff: CampaignWorkerHandoff; final: CampaignWorkerFinal; env?: NodeJS.ProcessEnv;
}): void {
  const { root, selector, handoff, final } = input;
  const offer = handoff.acquired.offer;
  const work = handoff.acquired.envelope;
  if (!final.reservation) throw new Error('campaign worker final lacks its complete attempt reservation; reconciliation required');
  const settlement = { repo_root: root, reservation: final.reservation,
    evidence_refs: [{ ref: `campaign-worker:${selector.dispatch_id}:result`, sha256: final.result_sha256 }], env: input.env };
  if (!readAutomationUsageForResult(settlement)) appendAutomationUsage({ ...settlement,
    outcome: final.outcome === 'transient_failure' ? 'transient_failure'
      : final.contract_run.status === 'pass' && (final.outcome === 'completed' || final.outcome === 'not_reproducible') ? 'completed' : 'no_progress',
  });
  recordTaskAutomationAttemptOutcome({ repo_root: root,
    work_package_id: offer.work_package_id, work_package_revision: offer.work_package_revision, policy: offer.retry_policy,
    identity_sha256: attemptIdentity({ claim_id: work.claim_id, lease_generation: work.generation,
      controller_run_id: `sha256:${final.reservation.automation_run_id}`, dispatch_id: selector.dispatch_id }),
    outcome: final.outcome, ended_at: final.ended_at, runtime_effect_id: final.runtime_effect_id, evidence_refs: final.evidence_refs });
}

/** Recovery may consume an existing final only after its next-generation envelope is durable and live. */
export function settleRecoveredCampaignWorkerFinal(selectorValue: unknown, env?: NodeJS.ProcessEnv): CampaignWorkerFinal | null {
  const { selector, root, intent, handoff } = readCampaignWorkerHandoff(selectorValue);
  requireCampaignPlanningAuthority(root, intent, env);
  const recovered = readPlanningRecord<{ envelope: Acquisition['envelope']; receipt: Acquisition['receipt'] }>(root, intent, key(selector.dispatch_id, 'recovered'));
  if (!recovered || recovered.envelope.task_id !== handoff.acquired.envelope.task_id || recovered.envelope.generation !== handoff.acquired.envelope.generation + 1) {
    throw new Error('campaign final recovery requires its persisted next generation');
  }
  validateFleetWorkEnvelope(root, recovered.envelope, env);
  validateClaimActorReceiptLive(root, recovered.receipt, recovered.envelope);
  const final = readPlanningRecord<CampaignWorkerFinal>(root, intent, key(selector.dispatch_id, 'final'));
  if (!final) return null;
  settleCampaignFinal({ root, selector, handoff, final, env });
  return final;
}
