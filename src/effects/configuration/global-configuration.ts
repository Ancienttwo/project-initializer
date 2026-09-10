import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, join } from 'node:path';

/** One host configuration document; typed consumers validate their own section. */
export function readGlobalConfiguration(env: NodeJS.ProcessEnv = process.env): { path: string; config: Record<string, unknown> } {
  const home = env.HOME ?? process.env.HOME ?? homedir();
  if (!isAbsolute(home)) throw new Error('global configuration requires an absolute HOME');
  const path = join(home, '.repo-harness', 'config.json');
  let value: unknown;
  try { value = JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new Error(`Invalid global configuration at ${path}: ${error instanceof Error ? error.message : String(error)}`);
    value = {};
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Global configuration must be an object: ${path}`);
  return { path, config: value as Record<string, unknown> };
}
