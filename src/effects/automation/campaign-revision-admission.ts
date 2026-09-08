import { resolve } from 'path';
import { CampaignPlanningError } from '../../core/automation/campaign-planning';
import { automationDigest } from '../../core/automation/budget';
import { validateCampaignRevisionRequest, validateCampaignRevisionResult } from '../../core/automation/campaign-revision-observation';
import { validateIssueBatchIntent, type IssueBatchIntentV1 } from '../../core/automation/issue-batch';
import { readCampaignRevisionRecord, readDevelopmentCampaignStatus, readExactAuthorityBinding } from './development-campaign-store';
import { readIssueBatchIntent } from './issue-batch-store';
import { resolveCampaignGroupBaseline } from './campaign-fresh-audit';
import { readCampaignExternalSourcesPolicyAtRevision, readDevelopmentCampaignPolicyAtRevision } from './development-campaign-policy';
import { requireManualGithubPolicy } from '../external-sources/policy';
import { readAutomationBudget, readAutomationBudgetStatus, readAutomationUsageForResult } from './budget-store';

/** New work consumes the original observation and its real ledger; this never mints admission. */
export function requireCampaignActiveAdmission(repoRoot: string, candidate: IssueBatchIntentV1, env: NodeJS.ProcessEnv = process.env): void {
  try {
    const root = resolve(repoRoot);
    validateIssueBatchIntent(candidate);
    const intent = readIssueBatchIntent(root,candidate.campaign_id,candidate.group_number,candidate.intent_sha256);
    const status = readDevelopmentCampaignStatus(root, intent.campaign_id, env);
    const grant = readExactAuthorityBinding(root, status.campaign, env);
    const requireThat = (ok: unknown) => { if (!ok) throw new Error('campaign revision admission binding differs'); };
    requireThat(['group_preparing','group_running'].includes(status.current.state));
    requireThat(intent.repository_id === grant.repository_id && intent.target_ref === grant.target_ref
      && intent.chrome_profile_directory === grant.campaign!.chrome_profile_directory
      && intent.base_main_sha === resolveCampaignGroupBaseline(root,status.campaign,status.events,intent.group_number,env));
    requireThat(readDevelopmentCampaignPolicyAtRevision(root,intent.base_main_sha).mode === 'active');
    const policy = requireManualGithubPolicy(readCampaignExternalSourcesPolicyAtRevision(root,grant.target_revision));
    const request = validateCampaignRevisionRequest(readCampaignRevisionRecord(root,intent.campaign_id,'request'));
    const result = validateCampaignRevisionResult(readCampaignRevisionRecord(root,intent.campaign_id,'result'),request);
    requireThat(request.authorization_sha256 === grant.authorization_sha256 && request.campaign_id === intent.campaign_id
      && request.repository_id === grant.repository_id && request.target_ref === grant.target_ref && request.target_revision === grant.target_revision
      && request.provider_repository === policy.github.repository && request.provider_repository === intent.provider_repository
      && request.profile_directory === grant.campaign!.chrome_profile_directory && result.browser_session?.repo_root === root
      && result.revision_evidence === 'verified');
    const reservation = result.reservation;
    const original = readAutomationBudget(root,reservation.budget_sha256,env);
    requireThat(original.authorization.authorization_sha256 === grant.authorization_sha256
      && original.automation_run_id === reservation.automation_run_id && original.repository_id === grant.repository_id);
    const usage = readAutomationUsageForResult({repo_root:root,reservation,read_only:true,
      evidence_refs:[{ref:`revision-observation:${result.request_sha256}`,sha256:automationDigest(result)}],env});
    requireThat(usage?.outcome === 'progress');
    const current = readAutomationBudgetStatus(root,reservation.automation_run_id,env);
    const now = Date.now();
    requireThat(now < Date.parse(grant.expires_at) && now < Date.parse(current.budget.deadline_at));
    requireThat(current.budget.authorization.authorization_sha256 === grant.authorization_sha256
      && current.current.state === 'active' && current.stop_receipt === null
      && !current.current.open_reservation_sha256s.includes(reservation.reservation_sha256));
  } catch (error) {
    throw new CampaignPlanningError('human_attention_required',
      `trusted exact revision readback cannot admit active work: ${(error as Error).message}`);
  }
}
