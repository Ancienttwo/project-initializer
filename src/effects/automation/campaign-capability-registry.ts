import { execFileSync } from 'child_process';
import { capabilityRegistryFromArchcontextNodes, normalizeCapabilityPath, parseCapabilityRegistry } from '../../core/capabilities/registry';
import { DevelopmentCampaignPolicyError } from './development-campaign-policy';

/** Authoring and adoption consume only the selected authority at the frozen revision. */
export function readCampaignCapabilityIdsAtRevision(root: string, revision: string): readonly string[] {
  const git = (args: readonly string[]) => execFileSync('git', [...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const fail = (message: string): never => { throw new DevelopmentCampaignPolicyError('campaign_policy_invalid', message); };
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(revision)) fail('invalid capability registry revision');
  try {
    const policy = JSON.parse(git(['show', `${revision}:.ai/harness/policy.json`]));
    const configured = policy.context?.capability_source;
    const source = configured === undefined ? 'registry' : configured;
    let resolution;
    if (source === 'registry') {
      const configuredPath = policy.context?.capability_registry_file;
      const path = configuredPath === undefined ? '.ai/context/capabilities.json' : configuredPath;
      if (typeof path !== 'string' || normalizeCapabilityPath(path, root) !== path) fail('invalid capability registry path');
      resolution = parseCapabilityRegistry(git(['show', `${revision}:${path}`]), { declared: true, repoRoot: root });
    } else if (source === 'archcontext') {
      const paths = git(['ls-tree', '-r', '--name-only', revision, '.archcontext/model/nodes']).trim().split('\n').filter(p => p.endsWith('.yaml'));
      resolution = capabilityRegistryFromArchcontextNodes(paths.map(path => ({ path, value: Bun.YAML.parse(git(['show', `${revision}:${path}`])) })), {
        repoRoot: root, isExistingDirectory: path => { try { return git(['cat-file', '-t', `${revision}:${path}`]).trim() === 'tree'; } catch { return false; } },
      });
    } else return fail('unknown capability source');
    if (resolution.status !== 'valid' || resolution.registry.capabilities.length === 0) return fail('exact main capability registry is unavailable');
    return Object.freeze(resolution.registry.capabilities.map(c => `capability.${c.domain}.${c.name}`).sort());
  } catch (error) {
    if (error instanceof DevelopmentCampaignPolicyError) throw error;
    throw new DevelopmentCampaignPolicyError('campaign_policy_invalid', 'exact main capability registry is unavailable', error);
  }
}
