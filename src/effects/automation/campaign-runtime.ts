import { accessSync, constants, lstatSync, readFileSync, realpathSync } from 'fs';
import { delimiter, isAbsolute, join, relative, resolve } from 'path';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { canonicalMessageDigest } from '../../core/messages/mechanics';
import { validateCampaignCodexInvocation, type CampaignCodexInvocation, type CampaignRuntimeIdentity } from '../../core/automation/campaign-runtime';
import { parseCodexExecStructuredOutput } from '../collaboration/provider-output-adapter';

function bytesSha(bytes: string | Buffer): string { return `sha256:${createHash('sha256').update(bytes).digest('hex')}`; }
function regular(root: string, path: string): Buffer {
  const absolute = resolve(root, path);
  if (isAbsolute(path) || relative(root, absolute).startsWith('..') || !lstatSync(absolute).isFile()
    || lstatSync(absolute).isSymbolicLink() || relative(realpathSync(root), realpathSync(absolute)).startsWith('..')) {
    throw new Error('campaign invocation requires a contained regular file');
  }
  return readFileSync(absolute);
}
function codexOnPath(env: NodeJS.ProcessEnv): string {
  for (const directory of (env.PATH ?? '').split(delimiter)) {
    if (!directory) continue;
    try {
      const executable = realpathSync(join(directory, process.platform === 'win32' ? 'codex.exe' : 'codex'));
      if (!lstatSync(executable).isFile()) continue;
      accessSync(executable, constants.X_OK);
      return executable;
    } catch { /* Continue the host PATH search; no alternate provider is selected. */ }
  }
  throw new Error('campaign Codex executable is unavailable on host PATH');
}

/** Called by the actual contract-run invocation boundary before child admission. */
export function prepareCampaignCodexInvocation(input: {
  repo_root: string; worktree: string; prompt_path: string; identity: CampaignRuntimeIdentity; env?: NodeJS.ProcessEnv;
}): CampaignCodexInvocation {
  const root = realpathSync(input.repo_root);
  const profileRef = `.codex/agents/${input.identity.role === 'worker' ? 'fast-worker' : 'gatekeeper'}.toml`;
  const profileBytes = regular(root, profileRef);
  execFileSync('git', ['ls-files', '--error-unmatch', '--', profileRef], { cwd: root, stdio: 'ignore' });
  const profile = Bun.TOML.parse(profileBytes.toString('utf8')) as Record<string, unknown>;
  const sandbox: CampaignCodexInvocation['sandbox'] = input.identity.role === 'worker' ? 'workspace-write' : 'read-only';
  if (profile.sandbox_mode !== sandbox || typeof profile.model !== 'string' || !profile.model
    || typeof profile.model_reasoning_effort !== 'string' || !profile.model_reasoning_effort
    || typeof profile.developer_instructions !== 'string' || !profile.developer_instructions) {
    throw new Error('campaign Codex role configuration is incomplete or has the wrong sandbox');
  }
  const prompt = regular(realpathSync(input.worktree), input.prompt_path);
  const executable = codexOnPath(input.env ?? process.env);
  const version = execFileSync(executable, ['--version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (!/^codex-cli \d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(version)) throw new Error('campaign Codex version is not an exact CLI version');
  const instructions = profile.developer_instructions + (input.identity.role === 'verifier'
    ? '\n\nCampaign invocation response contract: this replaces the generic opening-line format. Return only exact JSON {"verdict":"pass|fail","review":"Markdown evidence and findings"}. Consume the supplied canonical prepared evidence; do not run a second suite. Remain read-only.' : '');
  const argv = ['exec', '--json', '--ephemeral', '--ignore-user-config', '--strict-config', '--sandbox', sandbox,
    '--model', profile.model, '-c', `model_reasoning_effort=${JSON.stringify(profile.model_reasoning_effort)}`,
    '-c', `developer_instructions=${JSON.stringify(instructions)}`, prompt.toString('utf8')];
  const body = { protocol: 1 as const, kind: 'repo-harness-campaign-codex-invocation' as const, identity: input.identity,
    executable, executable_sha256: bytesSha(readFileSync(executable)), executable_version: version,
    profile_ref: profileRef, profile_sha256: bytesSha(profileBytes), prompt_sha256: bytesSha(prompt), model: profile.model,
    sandbox, argv: Object.freeze(argv) };
  return Object.freeze({ ...body, invocation_sha256: canonicalMessageDigest(body) });
}

export function assertCampaignInvocationExecutable(invocation: CampaignCodexInvocation): void {
  validateCampaignCodexInvocation(invocation);
  if (realpathSync(invocation.executable) !== invocation.executable
    || bytesSha(readFileSync(invocation.executable)) !== invocation.executable_sha256) {
    throw new Error('campaign Codex executable changed after invocation admission');
  }
}

export function observeCampaignCodexTerminal(input: {
  invocation: CampaignCodexInvocation; worktree: string; stdout_path: string; stderr_path: string;
  exit_code: number | null; timed_out?: boolean;
  output_sha256?: { stdout: string; stderr: string }; output_complete?: boolean;
  process_group_quiescence?: { scope: string; state: string };
}) {
  const invocation = validateCampaignCodexInvocation(input.invocation);
  const stdout = regular(realpathSync(input.worktree), input.stdout_path);
  const stderr = regular(realpathSync(input.worktree), input.stderr_path);
  let provider: ReturnType<typeof parseCodexExecStructuredOutput> | null = null;
  let reason: string | null = null;
  try { provider = parseCodexExecStructuredOutput(stdout.toString('utf8')); }
  catch (error) { reason = error instanceof Error ? error.message : String(error); }
  if (input.output_complete !== true || input.output_sha256?.stdout !== bytesSha(stdout) || input.output_sha256?.stderr !== bytesSha(stderr)) reason = 'provider output differs from the supervised streams';
  const quiescence = input.process_group_quiescence ?? { scope: 'unsupported', state: 'unknown' };
  if (input.exit_code !== 0 || input.timed_out) reason = 'provider process did not exit successfully';
  if (quiescence.scope !== 'posix_process_group' || quiescence.state !== 'quiescent') reason = 'local process group is not proven quiescent';
  if (provider?.operation_types.some(type => !['agent_message', 'reasoning', 'command_execution', 'file_change', 'todo_list', 'error'].includes(type))) {
    reason = 'provider turn includes an operation outside the managed terminal evidence scope';
  }
  const body = { protocol: 1 as const, kind: 'repo-harness-campaign-codex-terminal' as const,
    invocation_sha256: invocation.invocation_sha256, identity: invocation.identity,
    stdout_sha256: bytesSha(stdout), stderr_sha256: bytesSha(stderr), exit_code: input.exit_code,
    timed_out: input.timed_out === true, process_group_quiescence: quiescence,
    final_response: provider?.final_response ?? null, provider_thread_id: provider?.thread_id ?? null, terminal_event_sha256: provider?.terminal_event_sha256 ?? null,
    state: reason === null && provider !== null ? 'terminal' as const : 'unknown' as const, reason };
  return Object.freeze({ ...body, terminal_sha256: canonicalMessageDigest(body) });
}

export function parseCampaignVerifierResponse(text: string): { verdict: 'pass' | 'fail'; review: string } {
  const value = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 2
    || !Object.hasOwn(value, 'verdict') || !Object.hasOwn(value, 'review')
    || !['pass', 'fail'].includes(value.verdict) || typeof value.review !== 'string' || !value.review.trim()) {
    throw new Error('campaign verifier must return an explicit verdict and review');
  }
  return Object.freeze({ verdict: value.verdict, review: value.review });
}
