import { readGlobalConfiguration } from '../configuration/global-configuration';

export const DEFAULT_REFACTOR_RECOMMENDATIONS = { enabled: true } as const;
export function readRefactorRecommendationSettings(env: NodeJS.ProcessEnv = process.env) {
  const current = readGlobalConfiguration(env);
  const value = current.config.refactor_recommendations;
  if (value === undefined) return { ...current, initialized: false, enabled: true };
  if (value === null || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).some((key) => key !== 'enabled') || typeof (value as { enabled?: unknown }).enabled !== 'boolean') {
    throw new Error(`Invalid global refactor_recommendations: expected { enabled: boolean } at ${current.path}`);
  }
  return { ...current, initialized: true, enabled: (value as { enabled: boolean }).enabled };
}
