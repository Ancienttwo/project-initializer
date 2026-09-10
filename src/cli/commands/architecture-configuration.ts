import { DEFAULT_GLOBAL_ARCHITECTURE, readGlobalArchitectureConfiguration } from '../../effects/architecture/projection-config';
import { writePrivateConfiguration } from '../installer/configuration-ownership';
import type { GlobalRuntimeStep } from './global-runtime';

export function ensureGlobalArchitectureProjection(env: NodeJS.ProcessEnv = process.env): GlobalRuntimeStep {
  try {
    const current = readGlobalArchitectureConfiguration(env);
    if (!current.initialized) {
      writePrivateConfiguration(current.path, `${JSON.stringify({ ...current.config, architecture: DEFAULT_GLOBAL_ARCHITECTURE }, null, 2)}\n`, env);
    }
    return {
      step: 'global architecture projection', status: 'ok',
      detail: current.initialized ? `using ${current.path}` : `configured ${current.path}: archctx / automatic`,
    };
  } catch (error) {
    return { step: 'global architecture projection', status: 'failed', detail: error instanceof Error ? error.message : String(error) };
  }
}

