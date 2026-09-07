import { realpathSync } from 'fs';
import { execFileSync } from 'child_process';
import { randomUUID } from 'crypto';
import { automationDigest } from '../../core/automation/budget';
import { campaignIssueMembers, campaignCloseoutKey, validateCampaignNotPlannedDecision } from '../../core/automation/campaign-closeout';
import { messageSha256 } from '../../core/messages/mechanics';
import { parseAllowedPaths } from '../../core/state/artifact-parsers';
import { planningPath } from '../../core/automation/campaign-planning';
import { readLease } from '../state/coordination-lease-store';
import { withWorktreeTopologyLock } from '../state/coordination-worktree-topology';
import type { GithubCommandRunner } from '../external-sources/github';
import { readIssueBatchIntent } from './issue-batch-store';
import { planningArtifactBytes, planningResultKey, requireCampaignPlanningAuthority, type PlanningAdmission } from './campaign-planning-proof';
import { persistPlanningRecord, readPlanningRecord, withCampaignPlanningLock } from './campaign-planning-store';
import { ensureCampaignAuthoringBudget, beginCampaignBudgetStep, completeCampaignBudgetStep } from './budget-store';
import { createCampaignProviderExecutor } from './campaign-provider-execution';
import { campaignCloseoutReadOptions, runCampaignCloseoutProviderAttempt, type StoredCloseoutProviderRequests } from './campaign-closeout-provider';

export interface VerifiedCloseoutAcceptance {
  readonly protocol: number; readonly kind: string; readonly repository_root: string; readonly contract_file: string;
  readonly subject_sha256: string; readonly disposition: string; readonly reviewed_paths: readonly string[];
}

/** No execution is inferred: every member must have an immutable non-admitted planning result. */
export function runCampaignNotPlanned(input: {
  readonly root: string; readonly artifact_path: string; readonly contract_path: string;
  readonly host: 'codex' | 'claude'; readonly session_id: string; readonly env?: NodeJS.ProcessEnv;
  readonly verify_acceptance: (root: string, contract: string) => VerifiedCloseoutAcceptance;
  readonly github_runner?: GithubCommandRunner;
}) {
  const root = realpathSync(input.root);
  const bytes = planningArtifactBytes(root, input.artifact_path);
  const decision = validateCampaignNotPlannedDecision(JSON.parse(bytes));
  const intent = readIssueBatchIntent(root, decision.campaign_id, decision.group_number, decision.intent_sha256);
  const authority = requireCampaignPlanningAuthority(root, intent, input.env);
  const parent = readPlanningRecord<{ host: string; session_id: string }>(root, intent, 'parent');
  if (authority.policy.mode !== 'active' || parent?.host !== input.host || parent.session_id !== input.session_id
    || authority.grant.campaign?.local_parent_host !== input.host) throw new Error('not_planned requires its authorized local parent');
  const { issue, slots, members } = campaignIssueMembers({ slots: authority.manifest.slots, issues: authority.manifest.receipt.issues }, decision.provider_issue_id);
  if (issue.source_observation_sha256 !== decision.source_observation_sha256) throw new Error('not_planned Issue observation differs');
  if (members.length !== decision.tasks.length) throw new Error('not_planned decision omits Issue Tasks');
  const requireNoExecution = () => {
    for (const member of members) {
      const task = decision.tasks.find(value => value.task_id === member.task_id && value.slot === member.slot);
      const planning = readPlanningRecord<PlanningAdmission>(root, intent, planningResultKey(member.task_id));
      if (!task || !planning || planning.job.task_revision !== task.task_revision || planning.job.observation_sha256 !== decision.source_observation_sha256
        || planning.result.outcome !== 'not_reproducible' || planning.proof !== null || planning.binding_id !== null
        || readLease(root, member.task_id).classification !== 'available') throw new Error('not_planned lacks an exact non-executing planning outcome');
    }
  };
  const key = campaignCloseoutKey(issue.provider_issue_id, 'not-planned');
  const stored = readPlanningRecord<StoredCloseoutProviderRequests & { decision_sha256: string; acceptance: VerifiedCloseoutAcceptance }>(root, intent, key);
  if (stored && stored.decision_sha256 !== messageSha256(bytes)) throw new Error('not_planned decision changed');
  if (!stored) {
    const artifact = planningPath(decision.falsifier.artifact_path);
    if (messageSha256(planningArtifactBytes(root, artifact)) !== decision.falsifier.artifact_sha256) throw new Error('falsifier artifact changed');
    const contract = planningArtifactBytes(root, input.contract_path);
    const allowed = parseAllowedPaths(contract);
    if (!allowed.includes(input.artifact_path) || !allowed.includes(artifact)) throw new Error('local acceptance contract does not name exact decision and falsifier paths');
    for (const path of [input.artifact_path, artifact]) {
      if (execFileSync('git', ['show', `HEAD:${path}`], { cwd: root, encoding: 'utf8' }) !== planningArtifactBytes(root, path)) throw new Error('not_planned evidence must be committed exact bytes');
    }
    const acceptance = input.verify_acceptance(root, input.contract_path);
    if (acceptance.protocol !== 2 || acceptance.kind !== 'repo-harness-acceptance-receipt' || acceptance.repository_root !== root
      || acceptance.contract_file !== input.contract_path || !['pass', 'user_waiver'].includes(acceptance.disposition)
      || !acceptance.reviewed_paths.includes(input.artifact_path) || !acceptance.reviewed_paths.includes(artifact)) throw new Error('not_planned local acceptance is not bound to both evidence artifacts');
    if (planningArtifactBytes(root, input.artifact_path) !== bytes || messageSha256(planningArtifactBytes(root, artifact)) !== decision.falsifier.artifact_sha256) throw new Error('not_planned evidence changed during acceptance');
    withCampaignPlanningLock(root, intent, () => {
      requireNoExecution();
      persistPlanningRecord(root, intent, key, { kind: 'repo-harness-campaign-closeout-intent', decision_sha256: messageSha256(bytes), decision, acceptance,
        provider_requests: {
          comment: { protocol: 1, operation: 'github_comment_attempt', repository: intent.provider_repository, issue_number: issue.issue_number,
            body: `Campaign: ${intent.campaign_id}\nGroup: ${intent.group_number}\nSlots: ${[...slots].join(', ')}\nBase main: ${intent.base_main_sha}\nIssue observation: ${issue.source_observation_sha256}\nDisposition: not_planned\nFalsifier: ${decision.falsifier.command}\nExit: ${decision.falsifier.exit_code}\nObservation: ${decision.falsifier.observation}\nEvidence: ${artifact} ${decision.falsifier.artifact_sha256}\nLocal acceptance: ${acceptance.disposition} ${acceptance.subject_sha256}\nCloseout: ${randomUUID()}` },
          close: { protocol: 1, operation: 'github_close_attempt', repository: intent.provider_repository, issue_number: issue.issue_number, disposition: 'not_planned' },
        } });
    });
  }
  const budget = ensureCampaignAuthoringBudget({ repo_root: root, authorization: authority.grant, env: input.env }).budget;
  const step = { repo_root: root, automation_run_id: budget.automation_run_id, expected_budget_sha256: budget.budget_sha256, campaign_id: intent.campaign_id,
    group_number: intent.group_number as 1 | 2 | 3, intent_sha256: intent.intent_sha256, idempotency_key: `not-planned:${issue.provider_issue_id}`, env: input.env };
  const admission = beginCampaignBudgetStep(step).admission;
  const readbackKey = campaignCloseoutKey(issue.provider_issue_id, 'not-planned-source');
  if (!readPlanningRecord(root, intent, readbackKey)) {
    const read = createCampaignProviderExecutor({ ...step, step_admission_sha256: admission.event_sha256 }, input.github_runner, 'refresh').read;
    const value = JSON.parse(read(['api', '--method', 'GET', `repos/${intent.provider_repository}/issues/${issue.issue_number}`], campaignCloseoutReadOptions(budget.deadline_at)).stdout);
    if (String(value.id) !== issue.provider_issue_id || value.number !== issue.issue_number || value.state !== 'open' || typeof value.title !== 'string'
      || typeof value.body !== 'string' || messageSha256(value.title) !== issue.title_sha256 || messageSha256(value.body) !== issue.body_sha256) throw new Error('not_planned Issue source drifted');
    withCampaignPlanningLock(root, intent, () => persistPlanningRecord(root, intent, readbackKey, { source_sha256: automationDigest(value) }));
  }
  requireNoExecution();
  for (const request_key of ['comment', 'close']) runCampaignCloseoutProviderAttempt({ root, intent, closeout_key: key, request_key,
    step, step_admission_sha256: admission.event_sha256, github_runner: input.github_runner });
  const receipt = { protocol: 1, kind: 'repo-harness-campaign-cleanup', disposition: 'not_planned', decision_sha256: messageSha256(bytes), execution_topology: null };
  withCampaignPlanningLock(root, intent, () => withWorktreeTopologyLock(root, () => {
    requireNoExecution();
    for (const task of decision.tasks) persistPlanningRecord(root, intent, campaignCloseoutKey(task.task_id, 'complete'), { ...receipt, task_id: task.task_id, task_revision: task.task_revision });
  }));
  completeCampaignBudgetStep({ repo_root: root, admission, outcome: 'progress', evidence_refs: [{ ref: `campaign-not-planned:${issue.provider_issue_id}`, sha256: automationDigest(receipt) }], env: input.env });
  return { disposition: 'complete' as const, receipt };
}
