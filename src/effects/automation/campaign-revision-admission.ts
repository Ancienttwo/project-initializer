import { CampaignPlanningError } from '../../core/automation/campaign-planning';

/** Content challenges have no trusted revision producer; they cannot admit new active work. */
export function requireCampaignActiveAdmission(): void {
  throw new CampaignPlanningError('human_attention_required',
    'trusted exact revision readback is unavailable; active campaign admission is disabled');
}
