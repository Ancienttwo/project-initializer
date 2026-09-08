import { execFileSync } from 'child_process';
import { canonicalMessageDigest } from '../../core/messages/mechanics';
import { CampaignPlanningError, planningPath } from '../../core/automation/campaign-planning';
import { readCampaignCapabilityRegistryAtRevision } from './campaign-capability-registry';

export const CAMPAIGN_PROTECTION_PATH = '.ai/harness/campaign-protection.json';
interface ProtectionInventory {
  protocol: 1;
  capabilities: { capability_id: string }[];
  unmapped_surfaces: { paths: string[] }[];
  unmapped_closure: { roots: string[]; exempt_paths: string[] };
}

/** Read target-owned protection and its selected capability authority at one exact revision. */
export function readCampaignProtectionAtRevision(root: string, revision: string) {
  const git = (args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const refuse = (): never => { throw new CampaignPlanningError('planning_failed', 'frozen campaign protection inventory or selected capability registry is unavailable'); };
  try {
    const { registry, inputs } = readCampaignCapabilityRegistryAtRevision(root, revision);
    const inventory = JSON.parse(git(['show', `${revision}:${CAMPAIGN_PROTECTION_PATH}`])) as ProtectionInventory;
    const paths = (value: unknown): value is string[] => Array.isArray(value)
      && value.every(p => typeof p === 'string' && planningPath(p) === p);
    if (!inventory || inventory.protocol !== 1 || !Array.isArray(inventory.capabilities)
      || !inventory.capabilities.every(c => c && typeof c.capability_id === 'string' && /^capability\.[a-z0-9-]+\.[a-z0-9-]+$/u.test(c.capability_id))
      || !Array.isArray(inventory.unmapped_surfaces) || !inventory.unmapped_surfaces.every(s => s && paths(s.paths))
      || !paths(inventory.unmapped_closure?.roots) || !paths(inventory.unmapped_closure?.exempt_paths)) return refuse();
    const authorityInputs = new Set([CAMPAIGN_PROTECTION_PATH, ...inputs]);
    const digest = canonicalMessageDigest({ inputs: [...authorityInputs].sort().map(path => ({ path, object: git(['rev-parse', `${revision}:${path}`]) })) });
    return { inventory, registry, authorityInputs, digest };
  } catch (error) {
    if (error instanceof CampaignPlanningError) throw error;
    return refuse();
  }
}
