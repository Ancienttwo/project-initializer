import { dirname, join } from 'path';
import { canonicalMessageDigest } from '../../core/messages/mechanics';
import type { CampaignPublicationV1 } from './issue-batch-publication';
import { resolveGitCommonDirectory } from '../git/common-directory';
import { withExclusiveDirectoryLock } from '../locking/exclusive-directory-lock';
import { readLease } from '../state/coordination-lease-store';
import { campaignTaskIntent, planningGit, requireCampaignPlanningAuthority } from './campaign-planning-proof';
import { storedPlanningIntents } from './campaign-planning-store';
import { readIssueBatchAdoptionArtifact } from './issue-batch-store';

export class CampaignCapacityError extends Error {
  constructor(readonly code: 'campaign_capacity_full' | 'campaign_capacity_unavailable', message: string) {
    super(message);
    this.name = 'CampaignCapacityError';
  }
}

/** Lease is the counter. Hold admission serialization only until the existing task claim is durable. */
export function withCampaignCapacity<T>(root: string, taskId: string, targetRef: string, env: NodeJS.ProcessEnv | undefined, claim: () => T): T {
  const intent = campaignTaskIntent(root, taskId, targetRef);
  if (!intent) return claim();
  const key = canonicalMessageDigest({ campaign_id: intent.campaign_id }).slice(7);
  return withExclusiveDirectoryLock(resolveGitCommonDirectory(root), join('repo-harness/development-campaigns/v1', 'admission-locks', `${key}.lock`), () => {
    const selected = campaignTaskIntent(root, taskId, targetRef);
    if (!selected || selected.intent_sha256 !== intent.intent_sha256) throw new CampaignCapacityError('campaign_capacity_unavailable', 'campaign membership changed before claim');
    const authority = requireCampaignPlanningAuthority(root, selected, env);
    const limit = authority.grant.campaign!.max_parallel_tasks;
    if (authority.policy.mode !== 'active' || limit > authority.policy.limits.maximum_parallel_tasks) throw new CampaignCapacityError('campaign_capacity_unavailable', 'campaign execution is disabled or exceeds current policy');
    const taskIds = new Set<string>();
    const manifests = new Set<string>();
    for (const group of storedPlanningIntents(root).filter(i => i.campaign_id === selected.campaign_id)) {
      const publication = readIssueBatchAdoptionArtifact(root, group, 'publication') as unknown as CampaignPublicationV1 | null;
      if (!publication) continue;
      const current = requireCampaignPlanningAuthority(root, group, env);
      if (current.target !== authority.target || current.grant.authorization_sha256 !== authority.grant.authorization_sha256) throw new CampaignCapacityError('campaign_capacity_unavailable', 'campaign groups disagree on execution authority');
      manifests.add(publication.manifest_path);
      for (const slot of current.manifest.slots) taskIds.add(slot.task_id);
    }
    // A deleted local group must not remove its canonical leases from the count.
    for (const path of planningGit(root, ['ls-tree', '-r', '--name-only', authority.target, 'tasks/campaigns']).split('\n').filter(p => p.endsWith('.issues.json'))) {
      const manifest = JSON.parse(planningGit(root, ['show', `${authority.target}:${path}`]));
      if ((dirname(path) === dirname(authority.publication.manifest_path) || manifest.receipt?.campaign_id === selected.campaign_id) && !manifests.has(path)) throw new CampaignCapacityError('campaign_capacity_unavailable', 'canonical campaign group authority is unavailable');
    }
    let active = 0;
    for (const id of taskIds) {
      const lease = readLease(root, id);
      if (lease.classification === 'unknown') throw new CampaignCapacityError('campaign_capacity_unavailable', 'campaign Lease state is unknown');
      if (lease.record && lease.record.state !== 'released') active++;
    }
    if (active >= limit) throw new CampaignCapacityError('campaign_capacity_full', 'campaign max_parallel_tasks is already occupied');
    return claim();
  });
}
