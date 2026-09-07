import { execFileSync } from 'child_process';
import { capabilityRegistryFromArchcontextNodes } from '../../core/capabilities/registry';
import { DevelopmentCampaignPolicyError } from './development-campaign-policy';

/** Authoring and adoption consume the same registry at the frozen campaign revision. */
export function readCampaignCapabilityIdsAtRevision(root: string, revision: string): readonly string[] {
  const git = (args: readonly string[]) => execFileSync('git', [...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(revision)) throw new DevelopmentCampaignPolicyError('campaign_policy_invalid', 'invalid capability registry revision');
  const paths = git(['ls-tree', '-r', '--name-only', revision, '.archcontext/model/nodes']).trim().split('\n').filter(p => p.endsWith('.yaml'));
  const resolution = capabilityRegistryFromArchcontextNodes(paths.map(path => ({ path, value: Bun.YAML.parse(git(['show', `${revision}:${path}`])) })), {
    repoRoot: root, isExistingDirectory: path => { try { return git(['cat-file', '-t', `${revision}:${path}`]).trim() === 'tree'; } catch { return false; } },
  });
  if (resolution.status !== 'valid' || resolution.registry.capabilities.length === 0) throw new DevelopmentCampaignPolicyError('campaign_policy_invalid', 'exact main capability registry is unavailable');
  return Object.freeze(resolution.registry.capabilities.map(c => `capability.${c.domain}.${c.name}`).sort());
}
