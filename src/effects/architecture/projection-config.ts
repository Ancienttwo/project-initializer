import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { readArchitectureProjectionPolicy, type ArchitectureProjectionPolicy } from '../../core/architecture/projection';

/** Execution preferences belong to the host; project policy never overrides them. */
export function architectureProjectionConfigPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(env.HOME ?? process.env.HOME ?? homedir(), '.repo-harness', 'config.json');
}

export const DEFAULT_GLOBAL_ARCHITECTURE = {
  projection_provider: 'archctx',
  projection_apply: 'automatic',
  projection_failure_gate: 'advisory',
  projection_timeout_ms: 120_000,
} as const;

export function readGlobalArchitectureConfiguration(env: NodeJS.ProcessEnv = process.env): {
  path: string; config: Record<string, unknown>; initialized: boolean; policy: ArchitectureProjectionPolicy;
} {
  const path = architectureProjectionConfigPath(env);
  let config: unknown;
  try { config = JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new Error(`Invalid global architecture configuration at ${path}: ${error instanceof Error ? error.message : String(error)}`);
    config = {};
  }
  if (config === null || typeof config !== 'object' || Array.isArray(config)) throw new Error(`Global configuration must be an object: ${path}`);
  const value = config as Record<string, unknown>;
  if (value.architecture !== undefined) {
    const settings = value.architecture;
    if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) throw new Error(`Global architecture configuration must be an object: ${path}`);
    const fields = settings as Record<string, unknown>;
    const allowed = new Set(['projection_provider', 'projection_apply', 'projection_failure_gate', 'projection_timeout_ms']);
    for (const key of Object.keys(fields)) if (!allowed.has(key)) throw new Error(`Unknown global architecture setting ${key}: ${path}`);
    if (fields.projection_failure_gate !== undefined && fields.projection_failure_gate !== 'advisory' && fields.projection_failure_gate !== 'strict') throw new Error(`Invalid global projection_failure_gate: ${path}`);
    if (fields.projection_timeout_ms !== undefined && (!Number.isInteger(fields.projection_timeout_ms) || (fields.projection_timeout_ms as number) < 1000 || (fields.projection_timeout_ms as number) > 600000)) throw new Error(`Invalid global projection_timeout_ms: ${path}`);
    if (fields.projection_provider !== 'archctx' && fields.projection_provider !== 'disabled') throw new Error(`Invalid global projection_provider: ${path}`);
    if (fields.projection_apply !== 'automatic' && fields.projection_apply !== 'manual' && fields.projection_apply !== 'disabled') throw new Error(`Invalid global projection_apply: ${path}`);
  }
  try {
    return { path, config: value, initialized: value.architecture !== undefined, policy: readArchitectureProjectionPolicy(value) };
  } catch (error) { throw new Error(`Invalid global architecture configuration at ${path}: ${error instanceof Error ? error.message : String(error)}`); }
}

export function loadArchitectureProjectionPolicy(env: NodeJS.ProcessEnv = process.env): ArchitectureProjectionPolicy {
  return readGlobalArchitectureConfiguration(env).policy;
}
