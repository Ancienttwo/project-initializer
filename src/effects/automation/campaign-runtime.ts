import { existsSync, lstatSync, readFileSync, realpathSync } from 'fs';
import { isAbsolute, relative, resolve } from 'path';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { canonicalMessageDigest } from '../../core/messages/mechanics';
import { validateCampaignCodexInvocation, type CampaignCodexInvocation, type CampaignRuntimeIdentity } from '../../core/automation/campaign-runtime';
import { parseCodexExecStructuredOutput } from '../collaboration/provider-output-adapter';
import { prepareCampaignContainer, runCampaignContainer, assertCampaignContainerBinding, readCampaignContainerReceipt, reconcileCampaignContainer, readCampaignContainerInterruption, reconcileCampaignContainerPreparation, campaignContainerDirectory, readCampaignContainerPreparation } from './campaign-container';

function bytesSha(bytes: string | Buffer): string { return `sha256:${createHash('sha256').update(bytes).digest('hex')}`; }
function regular(root: string, path: string): Buffer {
  const absolute = resolve(root, path);
  if (isAbsolute(path) || relative(root, absolute).startsWith('..') || !lstatSync(absolute).isFile()
    || lstatSync(absolute).isSymbolicLink() || relative(realpathSync(root), realpathSync(absolute)).startsWith('..')) {
    throw new Error('campaign invocation requires a contained regular file');
  }
  return readFileSync(absolute);
}
function git(root: string, args: string[], deadline: number): string {
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new Error('campaign preparation deadline expired');
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', timeout: Math.min(remaining, 5000), killSignal: 'SIGKILL', maxBuffer: 65536, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function commonDirectory(worktree: string, deadline: number): string {
  return realpathSync(resolve(worktree, git(worktree, ['rev-parse', '--git-common-dir'], deadline)));
}

/** The pinned image is an explicit operator input; host PATH never selects the provider. */
export async function prepareCampaignCodexInvocation(input: {
  repo_root: string; worktree: string; prompt_path: string; identity: CampaignRuntimeIdentity; deadline_ms: number; env?: NodeJS.ProcessEnv;
}): Promise<CampaignCodexInvocation> {
  if (!Number.isSafeInteger(input.deadline_ms) || Date.now() >= input.deadline_ms) throw new Error('campaign preparation deadline expired');
  const env = input.env ?? process.env;
  const image = env.BRC_CAMPAIGN_IMAGE;
  if (!image || !/^sha256:[a-f0-9]{64}$/.test(image)) throw new Error('campaign requires BRC_CAMPAIGN_IMAGE pinned to a local image ID');
  const root = realpathSync(input.repo_root), worktree = realpathSync(input.worktree);
  const common = commonDirectory(worktree, input.deadline_ms);
  const profileRef = `.codex/agents/${input.identity.role === 'worker' ? 'fast-worker' : 'gatekeeper'}.toml`;
  const profileBytes = regular(root, profileRef);
  git(root, ['ls-files', '--error-unmatch', '--', profileRef], input.deadline_ms);
  const profile = Bun.TOML.parse(profileBytes.toString('utf8')) as Record<string, unknown>;
  const workspaceAccess = input.identity.role === 'worker' ? 'read-write' as const : 'read-only' as const;
  if (profile.sandbox_mode !== (input.identity.role === 'worker' ? 'workspace-write' : 'read-only') || typeof profile.model !== 'string' || !profile.model
    || typeof profile.model_reasoning_effort !== 'string' || !profile.model_reasoning_effort
    || typeof profile.developer_instructions !== 'string' || !profile.developer_instructions) throw new Error('campaign Codex role configuration is incomplete or has the wrong sandbox');
  const prompt = regular(worktree, input.prompt_path);
  const executable = '/usr/local/bin/codex';
  const abort = new AbortController();
  const cancel = () => abort.abort();
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) process.on(signal, cancel);
  try {
    const probeContainer = await prepareCampaignContainer({ root, worktree, common_git_dir: common, image,
      identity: { ...input.identity, phase: 'version' }, argv: [executable, '--version'], deadline_ms: input.deadline_ms, writable: false, probe: true });
    const result = await runCampaignContainer(probeContainer, input.deadline_ms, abort.signal, 65536);
    if (abort.signal.aborted || result.exit_code !== 0 || result.termination_cause !== 'completed' || !result.output_complete || !result.inactive) throw new Error('campaign version probe failed');
    const version = result.stdout.trim();
    if (!/^codex-cli \d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(version)) throw new Error('campaign Codex version is not an exact CLI version');
    const instructions = profile.developer_instructions + (input.identity.role === 'verifier'
      ? '\n\nCampaign invocation response contract: this replaces the generic opening-line format. Return only exact JSON {"verdict":"pass|fail","review":"Markdown evidence and findings"}. Consume the supplied canonical prepared evidence; do not run a second suite. Remain read-only.' : '');
    // Docker owns isolation. Do not claim Codex's inner sandbox enforces these mounts.
    const sandbox = 'danger-full-access' as const;
    const argv = ['exec', '--json', '--ephemeral', '--ignore-user-config', '--strict-config', '--sandbox', sandbox,
      '--model', profile.model, '-c', `model_reasoning_effort=${JSON.stringify(profile.model_reasoning_effort)}`,
      '-c', `developer_instructions=${JSON.stringify(instructions)}`, prompt.toString('utf8')];
    if (abort.signal.aborted) throw new Error('campaign preparation cancelled');
    const container = await prepareCampaignContainer({ root, worktree, common_git_dir: common, image, identity: input.identity,
      argv: [executable, ...argv], deadline_ms: input.deadline_ms, writable: workspaceAccess === 'read-write', auth_file: env.BRC_CAMPAIGN_AUTH_FILE });
    if (abort.signal.aborted) throw new Error('campaign preparation cancelled');
    const body = { protocol: 2 as const, kind: 'repo-harness-campaign-codex-invocation' as const, identity: input.identity,
      executable, executable_version: version, container,
      probe: { container: probeContainer, receipt_sha256: result.receipt_sha256, stdout: result.stdout, stderr: result.stderr }, deadline_ms: input.deadline_ms,
      profile_ref: profileRef, profile_sha256: bytesSha(profileBytes), prompt_sha256: bytesSha(prompt), model: profile.model,
      sandbox, workspace_access: workspaceAccess, argv: Object.freeze(argv) };
    return validateCampaignCodexInvocation(Object.freeze({ ...body, invocation_sha256: canonicalMessageDigest(body) }));
  } finally { for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) process.off(signal, cancel); }
}

export function assertCampaignInvocationExecutable(invocation: CampaignCodexInvocation, worktree: string): void {
  validateCampaignCodexInvocation(invocation);
  const common = commonDirectory(worktree, Date.now() + 5000);
  assertCampaignContainerBinding(invocation.container, { common, worktree, identity: invocation.identity,
    argv: [invocation.executable, ...invocation.argv], deadline: invocation.deadline_ms, writable: invocation.workspace_access === 'read-write', probe: false });
  assertCampaignContainerBinding(invocation.probe.container, { common, worktree, identity: { ...invocation.identity, phase: 'version' },
    argv: [invocation.executable, '--version'], deadline: invocation.deadline_ms, writable: false, probe: true });
  const probe = readCampaignContainerReceipt(invocation.probe.container, invocation.probe.receipt_sha256, invocation.probe.stdout, invocation.probe.stderr);
  if (probe.exit_code !== 0 || !probe.output_complete || probe.termination_cause !== 'completed') throw new Error('campaign version receipt is not successful');
}

export async function executeCampaignCodexInvocation(invocation: CampaignCodexInvocation, worktree: string, signal?: AbortSignal) {
  assertCampaignInvocationExecutable(invocation, worktree);
  return runCampaignContainer(invocation.container, invocation.deadline_ms, signal);
}

export function observeCampaignCodexTerminal(input: {
  invocation: CampaignCodexInvocation; worktree: string; stdout_path: string; stderr_path: string;
  exit_code: number | null; timed_out?: boolean;
  output_sha256?: { stdout: string; stderr: string }; output_complete?: boolean;
  process_group_quiescence?: { scope: string; state: string };
  container_receipt_sha256?: string;
  termination_cause?: string;
}) {
  const invocation = validateCampaignCodexInvocation(input.invocation);
  const stdout = regular(realpathSync(input.worktree), input.stdout_path);
  const stderr = regular(realpathSync(input.worktree), input.stderr_path);
  let provider: ReturnType<typeof parseCodexExecStructuredOutput> | null = null;
  let reason: string | null = null;
  try { provider = parseCodexExecStructuredOutput(stdout.toString('utf8')); }
  catch (error) { reason = error instanceof Error ? error.message : String(error); }
  if (input.output_complete !== true || input.output_sha256?.stdout !== bytesSha(stdout) || input.output_sha256?.stderr !== bytesSha(stderr)) reason = 'provider output differs from the supervised streams';
  let host: ReturnType<typeof readCampaignContainerReceipt> | null = null;
  try {
    assertCampaignInvocationExecutable(invocation, input.worktree);
    host = readCampaignContainerReceipt(invocation.container, input.container_receipt_sha256 ?? '', stdout.toString('utf8'), stderr.toString('utf8'));
    if (host.exit_code !== input.exit_code || host.output_complete !== input.output_complete
      || host.termination_cause !== input.termination_cause
      || (host.termination_cause === 'deadline' || host.exit_code === 124) !== (input.timed_out === true)) throw new Error('supervised outcome differs');
  } catch { host = null; reason = 'container termination receipt is not proven'; }
  if (input.exit_code !== 0 || input.timed_out) reason = 'provider process did not exit successfully';

  if (provider?.operation_types.some(type => !['agent_message', 'reasoning', 'command_execution', 'file_change', 'todo_list', 'error'].includes(type))) {
    reason = 'provider turn includes an operation outside the managed terminal evidence scope';
  }
  const runtimeEffectInactive = reason === null && provider !== null && host?.inactive === true ? true : null;
  const body = { protocol: 2 as const, kind: 'repo-harness-campaign-codex-terminal' as const,
    invocation_sha256: invocation.invocation_sha256, identity: invocation.identity,
    stdout_sha256: bytesSha(stdout), stderr_sha256: bytesSha(stderr), exit_code: input.exit_code,
    timed_out: input.timed_out === true, container_receipt_sha256: input.container_receipt_sha256 ?? null,
    termination_cause: host?.termination_cause ?? null,
    final_response: provider?.final_response ?? null, provider_thread_id: provider?.thread_id ?? null, terminal_event_sha256: provider?.terminal_event_sha256 ?? null,
    runtime_effect_inactive: runtimeEffectInactive, supervision_proven: host !== null,
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

/** Readback recovery has no provider-output authority and never restarts execution. */
export async function reconcileCampaignCodexInvocation(invocation: CampaignCodexInvocation, worktree: string) {
  assertCampaignInvocationExecutable(invocation, worktree);
  return reconcileCampaignContainer(invocation.container);
}
export function observeCampaignCodexInterruption(invocation: CampaignCodexInvocation, worktree: string) {
  assertCampaignInvocationExecutable(invocation, worktree);
  const proof = readCampaignContainerInterruption(invocation.container);
  return { invocation_sha256: invocation.invocation_sha256, identity: invocation.identity, ...proof };
}

export interface CampaignCodexPreparation {
  identity: CampaignRuntimeIdentity;
  deadline_ms: number;
}
/** Journal creation is the exclusive fence before any container create request. */
export function assertCampaignPreparationRetryable(preparation: CampaignCodexPreparation, worktree: string): void {
  const common = commonDirectory(worktree, preparation.deadline_ms);
  for (const identity of [{ ...preparation.identity, phase: 'version' }, preparation.identity]) {
    try { lstatSync(campaignContainerDirectory(common, identity)); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue;
      throw error;
    }
    throw new Error('campaign preparation has a container journal; reconciliation required');
  }
}
/** Preparation may have a probe alone or probe plus an unstarted workload. */
export async function reconcileCampaignCodexPreparation(preparation: CampaignCodexPreparation, worktree: string) {
  const common = commonDirectory(worktree, Date.now() + 5000);
  const identities = [{ ...preparation.identity, phase: 'version' }, preparation.identity];
  const proofs = [];
  for (const identity of identities) {
    const directory = campaignContainerDirectory(common, identity);
    if (!existsSync(directory)) continue;
    proofs.push(await reconcileCampaignContainerPreparation({ common, worktree, identity, deadline_ms: preparation.deadline_ms }));
  }
  if (!proofs.length) throw new Error('container preparation has no durable request; inactivity remains unknown');
  return { identity: preparation.identity, deadline_ms: preparation.deadline_ms, proofs };
}
export function observeCampaignCodexPreparationInterruption(preparation: CampaignCodexPreparation, worktree: string) {
  const common = commonDirectory(worktree, Date.now() + 5000);
  const proofs = [];
  for (const identity of [{ ...preparation.identity, phase: 'version' }, preparation.identity]) {
    const directory = campaignContainerDirectory(common, identity);
    if (!existsSync(directory)) continue;
    proofs.push(readCampaignContainerPreparation({ common, worktree, identity, deadline_ms: preparation.deadline_ms }));
  }
  if (!proofs.length) throw new Error('container preparation inactivity remains unknown');
  return { identity: preparation.identity, deadline_ms: preparation.deadline_ms, proofs };
}
