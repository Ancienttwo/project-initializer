import { readRefactorRecommendationSettings, DEFAULT_REFACTOR_RECOMMENDATIONS } from '../../effects/refactor/recommendation-settings';
import { writePrivateConfiguration } from '../installer/configuration-ownership';
import type { GlobalRuntimeStep } from './global-runtime';

export function ensureGlobalRefactorRecommendations(env: NodeJS.ProcessEnv = process.env): GlobalRuntimeStep {
  try {
    const current = readRefactorRecommendationSettings(env);
    if (!current.initialized) writePrivateConfiguration(current.path, `${JSON.stringify({ ...current.config, refactor_recommendations: DEFAULT_REFACTOR_RECOMMENDATIONS }, null, 2)}\n`, env);
    return { step: 'global refactor recommendations', status: 'ok', detail: `user decision required before execution; ${current.path}` };
  } catch (error) {
    return { step: 'global refactor recommendations', status: 'failed', detail: error instanceof Error ? error.message : String(error) };
  }
}
