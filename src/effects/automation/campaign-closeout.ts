import { execFileSync } from 'child_process';
import { randomUUID } from 'crypto';
import { automationDigest } from '../../core/automation/budget';
import { messageSha256 } from '../../core/messages/mechanics';
import { allCampaignIssueTasksMerged, campaignIssueMembers, campaignCloseoutKey, type CampaignCloseoutProviderRequest } from '../../core/automation/campaign-closeout';
import type { WorkEnvelopeV1 } from '../fleet/acquire';
import { readLease } from '../state/coordination-lease-store';
import { cleanupExactWorktree, type ExactWorktreeCleanup } from '../state/coordination-worktree-topology';
import { resumePublicationIntegrationRelease, reconcilePublication, type ReconcilePublicationResult } from '../publication/publication-lifecycle';
import type { GithubCommandRunner } from '../external-sources/github';
import { readCompletedCampaignWorker } from './campaign-worker';
import { requireCampaignPlanningAuthority } from './campaign-planning-proof';
import { readPlanningRecord, persistPlanningRecord, withCampaignPlanningLock } from './campaign-planning-store';
import { ensureCampaignAuthoringBudget, beginCampaignBudgetStep, completeCampaignBudgetStep, readAutomationBudgetStatus } from './budget-store';
import { createCampaignProviderExecutor } from './campaign-provider-execution';
import { campaignCloseoutRemoteDestination, campaignCloseoutReadOptions, createCampaignCloseoutFetch, createCampaignCloseoutIntegrationObserver, runCampaignCloseoutProviderAttempt, type StoredCloseoutProviderRequests } from './campaign-closeout-provider';

interface CloseoutIntent extends StoredCloseoutProviderRequests {
  readonly task_id: string;
  readonly task_revision: string;
  readonly claim_id: string;
  readonly generation: number;
  readonly publication_id: string;
  readonly head_sha: string;
  readonly work: WorkEnvelopeV1;
  readonly remote: string;
  readonly remote_url_sha256: string;
}
export interface CampaignCleanupReceiptV1 {
  readonly protocol: 1;
  readonly kind: 'repo-harness-campaign-cleanup';
  readonly disposition: 'completed';
  readonly task_id: string;
  readonly task_revision: string;
  readonly publication_id: string;
  readonly provider_issue_id: string;
  readonly integration: ReconcilePublicationResult;
  readonly topology: ExactWorktreeCleanup;
}

/** Each call advances one persisted Task closeout; all adopted Issue members gate closure. */
export function runCampaignCloseout(input: {
  readonly selector: unknown; readonly host: 'codex' | 'claude'; readonly session_id: string;
  readonly remote: string; readonly env?: NodeJS.ProcessEnv; readonly github_runner?: GithubCommandRunner;
  readonly crash_hook?: (phase: 'after_merge_persisted') => void;
  readonly cleanup: (root: string, expected: ExactWorktreeCleanup) => unknown;
}) {
  const { root, intent, envelope: work, writable_inactive: writableInactive } = readCompletedCampaignWorker(input.selector, input.env);
  const authority = requireCampaignPlanningAuthority(root, intent, input.env);
  const parent = readPlanningRecord<{ host: string; session_id: string }>(root, intent, 'parent');
  if (authority.policy.mode !== 'active' || authority.grant.campaign?.local_parent_host !== input.host
    || parent?.host !== input.host || parent.session_id !== input.session_id) throw new Error('closeout requires the authorized local parent');
  const slot = authority.manifest.slots.find(value => value.task_id === work.task_id);
  const issue = authority.manifest.receipt.issues.find(value => value.slot === slot?.slot);
  if (!slot || !issue) throw new Error('closeout Task has no adopted Issue identity');
  const key = (phase: string) => campaignCloseoutKey(work.task_id, phase);
  const read = <T>(recordKey: string) => readPlanningRecord<T>(root, intent, recordKey);
  const save = (recordKey: string, value: unknown) => withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, recordKey, value));
  const previous = read<CampaignCleanupReceiptV1>(key('complete'));
  const git = (args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const stored = withCampaignPlanningLock(root, intent, () => {
    const prior = read<CloseoutIntent>(key('intent'));
    if (prior) {
      if (prior.claim_id !== work.claim_id || prior.generation !== work.generation || prior.remote !== input.remote) throw new Error('closeout intent owner differs');
      return prior;
    }
    const lease = readLease(root, work.task_id).record;
    if (!lease || lease.state !== 'reviewing' || !lease.current_publication
      || lease.claim_id !== work.claim_id || lease.generation !== work.generation || lease.task_revision !== work.task_revision
      || lease.execution_worktree !== work.worktree_path || lease.branch !== work.branch || lease.unit_ref !== work.unit_ref) throw new Error('closeout requires the exact reviewing publication');
    const remoteHash = automationDigest(campaignCloseoutRemoteDestination(root, input.remote));
    const request: CampaignCloseoutProviderRequest = { protocol: 1, operation: 'git_ref_delete_attempt', remote: input.remote,
      ref: `refs/heads/${work.branch}`, expected_oid: lease.current_publication.head_sha, remote_url_sha256: remoteHash };
    const created: CloseoutIntent = { kind: 'repo-harness-campaign-closeout-intent', task_id: work.task_id, task_revision: work.task_revision,
      claim_id: work.claim_id, generation: work.generation, publication_id: lease.current_publication.publication_id,
      head_sha: lease.current_publication.head_sha, work, remote: input.remote, remote_url_sha256: remoteHash,
      provider_requests: { delete: request } };
    persistPlanningRecord(root, intent, key('intent'), created);
    return created;
  });
  const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority.grant, env: input.env }).budget;
  const budgetStep = (phase: string) => {
    const step = { repo_root: root, automation_run_id: budget.automation_run_id, expected_budget_sha256: budget.budget_sha256,
      campaign_id: intent.campaign_id, group_number: intent.group_number as 1 | 2 | 3, intent_sha256: intent.intent_sha256,
      idempotency_key: `closeout:${work.task_id}:${phase}`, env: input.env };
    const admission = beginCampaignBudgetStep(step).admission;
    return { step, admission, binding: { ...step, step_admission_sha256: admission.event_sha256 } };
  };
  const completeStep = (phase: ReturnType<typeof budgetStep>, evidence: unknown) => completeCampaignBudgetStep({ repo_root: root,
    admission: phase.admission, outcome: 'progress', evidence_refs: [{ ref: `campaign-closeout:${work.task_id}`, sha256: automationDigest(evidence) }], env: input.env });
  if (previous) { completeStep(budgetStep('cleanup'), previous); return { disposition: 'complete' as const, receipt: previous }; }
  const mergeStep = budgetStep('merge');
  let integration = read<ReconcilePublicationResult>(key('merge'));
  if (!integration) {
    integration = withCampaignPlanningLock(root, intent, () => reconcilePublication({
      repo_root: root, task_id: work.task_id, expected_claim_id: work.claim_id, expected_generation: work.generation,
      publication_id: stored.publication_id, expected_head_sha: stored.head_sha, remote: stored.remote,
      fetch_target: createCampaignCloseoutFetch({ ...mergeStep.binding, operation: 'git_read', request_sha256: automationDigest({ task: work.task_id, phase: 'fetch' }), idempotency_key: `closeout-fetch:${work.task_id}` }),
      observe_integration: createCampaignCloseoutIntegrationObserver({ root, intent, deadline_at: budget.deadline_at, budget_read: createCampaignProviderExecutor(mergeStep.binding, input.github_runner).read }),
      before_integration_release: proof => {
        requireCampaignPlanningAuthority(root, intent, input.env);
        if (proof.integration_state !== 'merged' || !proof.merge_commit_sha) throw new Error('campaign closure requires an actual merged PR');
        persistPlanningRecord(root, intent, key('merge'), proof);
        input.crash_hook?.('after_merge_persisted');
      },
    }));
  }
  withCampaignPlanningLock(root, intent, () => resumePublicationIntegrationRelease({ repo_root: root, task_id: work.task_id,
    expected_claim_id: work.claim_id, expected_generation: work.generation, publication_id: stored.publication_id,
    expected_head_sha: stored.head_sha, evidence: integration!.evidence,
    authorization_fence: () => { requireCampaignPlanningAuthority(root, intent, input.env); },
  }));
  completeStep(mergeStep, integration);
  const { slots: memberSlots, members } = campaignIssueMembers({ slots: authority.manifest.slots, issues: authority.manifest.receipt.issues }, issue.provider_issue_id);
  const proofs = members.map(member => read<ReconcilePublicationResult>(campaignCloseoutKey(member.task_id, 'merge')));
  if (!allCampaignIssueTasksMerged(members.map(member => member.task_id), proofs)) return { disposition: 'waiting_issue_members' as const };
  if (!writableInactive) return { disposition: 'cleanup_pending_runtime_inactivity' as const };
  const { step, admission, binding } = budgetStep('cleanup');
  const targetKey = key('cleanup-target');
  let cleanupTarget = read<{ oid: string }>(targetKey);
  if (!cleanupTarget) {
    const ref = `refs/repo-harness/observations/closeout/${work.task_id}/${randomUUID()}`;
    createCampaignCloseoutFetch({ ...binding, operation: 'git_read', request_sha256: automationDigest({ task: work.task_id, phase: 'cleanup-fetch' }),
      idempotency_key: `closeout-current-main:${work.task_id}` })(['fetch', '--no-tags', '--no-write-fetch-head', stored.remote, `+refs/heads/${integration.evidence.target_ref}:${ref}`]);
    cleanupTarget = { oid: git(['rev-parse', `${ref}^{commit}`]) };
    for (const proof of proofs) git(['merge-base', '--is-ancestor', proof!.merge_commit_sha!, cleanupTarget.oid]);
    save(targetKey, cleanupTarget);
  }
  if (git(['rev-parse', `${integration.evidence.target_ref}^{commit}`]) !== cleanupTarget.oid) throw new Error('current local main differs from closeout observation');
  for (const proof of proofs) git(['merge-base', '--is-ancestor', proof!.merge_commit_sha!, cleanupTarget.oid]);
  const issueKey = campaignCloseoutKey(issue.provider_issue_id, 'issue-intent');
  if (!read(issueKey)) {
    const provider = createCampaignProviderExecutor(binding, input.github_runner);
    const observed = JSON.parse(provider.read(['api', '--method', 'GET', `repos/${intent.provider_repository}/issues/${issue.issue_number}`], campaignCloseoutReadOptions(budget.deadline_at)).stdout);
    if (String(observed.id) !== issue.provider_issue_id || observed.number !== issue.issue_number || observed.state !== 'open'
      || typeof observed.title !== 'string' || typeof observed.body !== 'string'
      || messageSha256(observed.title) !== issue.title_sha256 || messageSha256(observed.body) !== issue.body_sha256) throw new Error('adopted Issue source changed before closeout');
    save(issueKey, { kind: 'repo-harness-campaign-closeout-intent', provider_requests: {
      comment: { protocol: 1, operation: 'github_comment_attempt', repository: intent.provider_repository, issue_number: issue.issue_number,
        body: `Campaign: ${intent.campaign_id}\nGroup: ${intent.group_number}\nSlots: ${[...memberSlots].join(', ')}\nBase main: ${intent.base_main_sha}\nCurrent main: ${cleanupTarget.oid}\nIssue observation: ${issue.source_observation_sha256}\nDisposition: completed\nLocal acceptance: each completed worker has a passing contract result, exact budget settlement and reviewed publication.\nPublication receipts: ${proofs.map(proof => proof!.evidence.receipt_sha256).join(', ')}\nMerge commits: ${proofs.map(proof => proof!.merge_commit_sha).join(', ')}\nCloseout: ${randomUUID()}` },
      close: { protocol: 1, operation: 'github_close_attempt', repository: intent.provider_repository, issue_number: issue.issue_number, disposition: 'completed' },
    } });
  }
  for (const request_key of ['comment', 'close']) runCampaignCloseoutProviderAttempt({ root, intent, closeout_key: issueKey, request_key, step,
    step_admission_sha256: admission.event_sha256, github_runner: input.github_runner });
  runCampaignCloseoutProviderAttempt({ root, intent, closeout_key: key('intent'), request_key: 'delete', step,
    step_admission_sha256: admission.event_sha256, github_runner: input.github_runner });
  if (!integration.merge_commit_sha) throw new Error('closeout merge identity is unavailable');
  const topology: ExactWorktreeCleanup = { worktree: work.worktree_path, branch: work.branch, head_sha: stored.head_sha,
    target_ref: integration.evidence.target_ref, target_oid: cleanupTarget.oid, merge_commit_sha: integration.merge_commit_sha };
  const currentBudget = readAutomationBudgetStatus(root, budget.automation_run_id, input.env);
  if (currentBudget.stop_receipt || currentBudget.current.open_reservation_sha256s.length || Date.now() >= Date.parse(budget.deadline_at)) throw new Error('cleanup_pending: campaign is stopped or unresolved');
  requireCampaignPlanningAuthority(root, intent, input.env);
  cleanupExactWorktree(root, topology, () => input.cleanup(root, topology));
  const receipt: CampaignCleanupReceiptV1 = { protocol: 1, kind: 'repo-harness-campaign-cleanup', disposition: 'completed', task_id: work.task_id,
    task_revision: work.task_revision, publication_id: stored.publication_id, provider_issue_id: issue.provider_issue_id, integration, topology };
  save(key('complete'), receipt);
  completeStep({ step, admission, binding }, receipt);
  return { disposition: 'complete' as const, receipt };
}
