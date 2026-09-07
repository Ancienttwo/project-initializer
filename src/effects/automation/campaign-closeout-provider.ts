import { providerIntegrationFromJson } from '../publication/publication-receipt';
import { execFileSync, spawnSync } from 'child_process';
import { automationDigest, type CampaignAutomationBudgetReservationV1 } from '../../core/automation/budget';
import { canonicalMessageDigest } from '../../core/messages/mechanics';
import { closeoutProviderRequestDigest, validateCampaignCloseoutProviderRequest, type CampaignCloseoutProviderRequest, type CampaignCloseoutProviderReceipt } from '../../core/automation/campaign-closeout';
import type { IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import { runGithubCommand, type GithubCommandRunner } from '../external-sources/github';
import { automationStoreNow } from './clock';
import { readPlanningRecord, persistPlanningRecord, withCampaignPlanningLock } from './campaign-planning-store';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import { readAutomationBudgetStatus, reserveCampaignProviderBudget, recordCampaignProviderOutcome, reconcileAutomationReservation, type BeginCampaignBudgetStepInput } from './budget-store';

interface PhaseResult { readonly returned: boolean; readonly stdout: string; readonly detail: string | null }
export interface StoredCloseoutProviderRequests {
  readonly kind: 'repo-harness-campaign-closeout-intent';
  readonly provider_requests: Readonly<Record<string, CampaignCloseoutProviderRequest>>;
}

/** Only the transaction's already-persisted request may cross this two-call boundary. */
export function runCampaignCloseoutProviderAttempt(input: {
  readonly root: string; readonly intent: IssueBatchIntentV1; readonly closeout_key: string; readonly request_key: string;
  readonly step: BeginCampaignBudgetStepInput; readonly step_admission_sha256: string;
  readonly github_runner?: GithubCommandRunner;
  readonly crash_hook?: (phase: string) => void;
}): CampaignCloseoutProviderReceipt {
  return withCampaignPlanningLock(input.root, input.intent, () => {
    const authority = requireCampaignPlanningAuthority(input.root, input.intent, input.step.env);
    if (authority.policy.mode !== 'active') throw new Error('closeout mutation requires active campaign authority');
    const stored = readPlanningRecord<StoredCloseoutProviderRequests>(input.root, input.intent, input.closeout_key);
    if (stored?.kind !== 'repo-harness-campaign-closeout-intent' || !Object.hasOwn(stored.provider_requests, input.request_key)) throw new Error('closeout request has no persisted intent');
    const request = validateCampaignCloseoutProviderRequest(stored.provider_requests[input.request_key]!);
    if (request.operation !== 'git_ref_delete_attempt' && request.repository !== input.intent.provider_repository) throw new Error('closeout Provider repository differs');
    if (input.step.repo_root !== input.root || input.step.intent_sha256 !== input.intent.intent_sha256
      || input.step.campaign_id !== input.intent.campaign_id || input.step.group_number !== input.intent.group_number) throw new Error('closeout budget step differs');
    const digest = closeoutProviderRequestDigest(request);
    const key = (phase: string) => canonicalMessageDigest({ closeout: input.closeout_key, request: input.request_key, digest, phase }).slice(7);
    const prior = readPlanningRecord<CampaignCloseoutProviderReceipt>(input.root, input.intent, key('receipt'));
    const reservation = readPlanningRecord<CampaignAutomationBudgetReservationV1>(input.root, input.intent, key('reservation'))
      ?? reserveCampaignProviderBudget({ ...input.step, step_admission_sha256: input.step_admission_sha256,
        operation: request.operation, request_sha256: digest, idempotency_key: key('admission') }).reservation;
    persistPlanningRecord(input.root, input.intent, key('reservation'), reservation);
    const settle = (receipt: CampaignCloseoutProviderReceipt) => {
      if (receipt.request_sha256 !== digest || receipt.reservation_sha256 !== reservation.reservation_sha256) throw new Error('closeout receipt binding differs');
      if (receipt.mutation_returned) recordCampaignProviderOutcome({ repo_root: input.root, reservation, outcome: 'returned', result_sha256: automationDigest(receipt), env: input.step.env });
      else reconcileAutomationReservation({ repo_root: input.root, reservation, resolution: 'reconciled_reserved', outcome: 'completed',
        reason: 'exact mandatory readback confirms mutation; unknown original response charged at reserved upper bound',
        evidence_refs: [{ ref: `controller-run:${reservation.automation_run_id}`, sha256: automationDigest(receipt) }], env: input.step.env });
    };
    if (prior) { settle(prior); return prior; }
    const phase = (name: 'mutation' | 'readback', invoke: (timeout: number) => PhaseResult): PhaseResult => {
      const result = readPlanningRecord<PhaseResult>(input.root, input.intent, key(`${name}-result`));
      if (result) return result;
      if (readPlanningRecord(input.root, input.intent, key(`${name}-started`))) {
        return { returned: false, stdout: '', detail: 'started call has no durable result; no resend' };
      }
      const status = readAutomationBudgetStatus(input.root, reservation.automation_run_id, input.step.env);
      const remaining = Date.parse(reservation.deadline_at) - Date.parse(automationStoreNow());
      if (status.stop_receipt || remaining <= 0 || status.current.open_reservation_sha256s.length !== 1
        || status.current.open_reservation_sha256s[0] !== reservation.reservation_sha256) throw new Error('closeout reserved phase is stopped or no longer owned');
      persistPlanningRecord(input.root, input.intent, key(`${name}-started`), { reservation_sha256: reservation.reservation_sha256, request_sha256: digest, phase: name });
      input.crash_hook?.(`after_${name}_started`);
      let observed: PhaseResult;
      try { observed = invoke(Math.min(remaining, 30_000)); }
      catch (error) { observed = { returned: false, stdout: '', detail: error instanceof Error ? error.message : String(error) }; }
      persistPlanningRecord(input.root, input.intent, key(`${name}-result`), observed);
      input.crash_hook?.(`after_${name}`);
      return observed;
    };
    const github = (args: string[], timeout: number): PhaseResult => ({ returned: true,
      stdout: (input.github_runner ?? runGithubCommand)(args, { timeout_ms: timeout, max_buffer: 2 * 1024 * 1024 }).stdout, detail: null });
    const git = (args: string[], timeout: number): PhaseResult => {
      if (request.operation !== 'git_ref_delete_attempt' || automationDigest(execFileSync('git', ['remote', 'get-url', request.remote], { cwd: input.root, encoding: 'utf8' }).trim()) !== request.remote_url_sha256) throw new Error('closeout remote configuration changed');
      const result = spawnSync('git', args, { cwd: input.root, encoding: 'utf8', timeout, maxBuffer: 2 * 1024 * 1024 });
      return { returned: result.status === 0 && !result.error, stdout: result.stdout ?? '', detail: result.error?.message ?? (result.status === 0 ? null : result.stderr) };
    };
    const mutation = phase('mutation', timeout => request.operation === 'git_ref_delete_attempt'
      ? git(['push', `--force-with-lease=${request.ref}:${request.expected_oid}`, request.remote, `:${request.ref}`], timeout)
      : request.operation === 'github_comment_attempt'
        ? github(['api', '--method', 'POST', `repos/${request.repository}/issues/${request.issue_number}/comments`, '-f', `body=${request.body}`], timeout)
        : github(['api', '--method', 'PATCH', `repos/${request.repository}/issues/${request.issue_number}`, '-f', 'state=closed', '-f', `state_reason=${request.disposition}`], timeout));
    const readback = phase('readback', timeout => request.operation === 'git_ref_delete_attempt'
      ? git(['ls-remote', '--refs', request.remote, request.ref], timeout)
      : github(['api', '--method', 'GET', `repos/${request.repository}/issues/${request.issue_number}${request.operation === 'github_comment_attempt' ? '/comments?per_page=100' : ''}`], timeout));
    if (!readback.returned) throw new Error('closeout readback is unknown; reservation remains unresolved');
    let confirmed: boolean;
    if (request.operation === 'git_ref_delete_attempt') confirmed = readback.stdout.trim() === '';
    else {
      const value = JSON.parse(readback.stdout);
      confirmed = request.operation === 'github_comment_attempt'
        ? Array.isArray(value) && value.filter(item => item && typeof item.id === 'number' && item.body === request.body).length === 1
        : value && value.number === request.issue_number && value.state === 'closed' && value.state_reason === request.disposition;
    }
    if (!confirmed) throw new Error('closeout readback does not confirm its exact mutation; no resend');
    const receipt: CampaignCloseoutProviderReceipt = { operation: request.operation, request_sha256: digest,
      reservation_sha256: reservation.reservation_sha256, mutation_returned: mutation.returned,
      readback_stdout: readback.stdout, observed_at: automationStoreNow() };
    persistPlanningRecord(input.root, input.intent, key('receipt'), receipt);
    input.crash_hook?.('after_receipt');
    settle(receipt);
    return receipt;
  });
}

/** Both reconcile observations use the same budget executor and Provider decoder. */
export function createCampaignCloseoutIntegrationObserver(input: {
  readonly root: string; readonly intent: IssueBatchIntentV1;
  readonly budget_read: GithubCommandRunner;
  readonly deadline_at: string;
}) {
  const [owner, name] = input.intent.provider_repository.split('/');
  if (!owner || !name || input.intent.provider_repository.split('/').length !== 2) throw new Error('invalid closeout repository');
  return (repoRoot: string, prNumber: number) => {
    if (repoRoot !== input.root || !Number.isSafeInteger(prNumber) || prNumber < 1) throw new Error('closeout observation identity differs');
    const response = input.budget_read(['api', 'graphql', '-f',
      'query=query($owner:String!,$name:String!,$number:Int!){repository(owner:$owner,name:$name){id pullRequest(number:$number){number url headRefOid headRefName baseRefName baseRefOid body createdAt state mergedAt mergeCommit{oid}}}}',
      '-f', `owner=${owner}`, '-f', `name=${name}`, '-F', `number=${prNumber}`], campaignCloseoutReadOptions(input.deadline_at));
    const value = JSON.parse(response.stdout);
    if (value.errors || typeof value.data?.repository?.id !== 'string') throw new Error('Provider repository integration observation failed');
    return providerIntegrationFromJson(value.data.repository.id, value.data.repository.pullRequest, prNumber);
  };
}

export function createCampaignCloseoutFetch(binding: Parameters<typeof reserveCampaignProviderBudget>[0]) {
  return (args: readonly string[]) => {
    if (args[0] !== 'fetch') throw new Error('closeout observation requires git fetch');
    const reserved = reserveCampaignProviderBudget({ ...binding, operation: 'git_read', request_sha256: automationDigest(args) });
    if (reserved.disposition !== 'reserved') throw new Error('closeout fetch was already admitted; reconcile before retry');
    const remaining = Date.parse(reserved.reservation.deadline_at) - Date.parse(automationStoreNow());
    if (remaining <= 0) throw new Error('closeout fetch deadline elapsed');
    const result = spawnSync('git', [...args], { cwd: binding.repo_root, encoding: 'utf8', timeout: Math.min(remaining, 30_000), maxBuffer: 2 * 1024 * 1024 });
    if (result.error || result.status === null) throw new Error('closeout fetch outcome is unknown');
    recordCampaignProviderOutcome({ repo_root: binding.repo_root, reservation: reserved.reservation,
      outcome: result.status === 0 ? 'returned' : 'read_failed', result_sha256: automationDigest({ status: result.status, stdout: result.stdout, stderr: result.stderr }), env: binding.env });
    if (result.status !== 0) throw new Error('closeout fetch failed');
  };
}

export function campaignCloseoutReadOptions(deadline: string) {
  const remaining = Date.parse(deadline) - Date.parse(automationStoreNow());
  if (!Number.isFinite(remaining) || remaining <= 0) throw new Error('closeout observation deadline elapsed');
  return { timeout_ms: Math.min(remaining, 30_000), max_buffer: 2 * 1024 * 1024 };
}
