import { spawnSync, type SpawnSyncReturns } from 'child_process';

export const HERDR_COMMAND_TIMEOUT_MS = 10_000;
export interface HerdrEndpoint { readonly session: string; readonly configPath?: string }
export type HerdrSpawn = (command: string, args: readonly string[], options: {
  readonly timeout: number; readonly env: NodeJS.ProcessEnv;
}) => SpawnSyncReturns<Buffer>;

export function herdrEnvironment(endpoint: HerdrEndpoint): NodeJS.ProcessEnv {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(endpoint.session)) throw new Error('herdr_invalid_session');
  const env = { ...process.env };
  // A CLI launched from another pane must never inherit its socket or caller identity.
  for (const name of Object.keys(env)) if (name.startsWith('HERDR_')) delete env[name];
  if (endpoint.configPath) env.HERDR_CONFIG_PATH = endpoint.configPath;
  return env;
}

export const spawnHerdr: HerdrSpawn = (command, args, options) => spawnSync(command, [...args], {
  ...options, killSignal: 'SIGKILL', shell: false, encoding: null, maxBuffer: 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
});

export function herdrCommand(endpoint: HerdrEndpoint, args: readonly string[], bin = 'herdr', spawn: HerdrSpawn = spawnHerdr) {
  return spawn(bin, ['--session', endpoint.session, ...args], { timeout: HERDR_COMMAND_TIMEOUT_MS, env: herdrEnvironment(endpoint) });
}

export function herdrResult(result: SpawnSyncReturns<Buffer>): Record<string, any> {
  if (result.error || result.status !== 0 || result.signal) throw new Error('herdr_command_failed');
  const response = JSON.parse(result.stdout.toString('utf8'));
  if (!response || typeof response.id !== 'string' || response.error || !response.result || typeof response.result !== 'object') throw new Error('herdr_invalid_response');
  return response.result;
}
