import { spawn } from 'child_process';
import { constants, closeSync, existsSync, fsyncSync, linkSync, unlinkSync, lstatSync, mkdirSync, openSync, readFileSync, realpathSync, writeFileSync } from 'fs';
import { basename, dirname, isAbsolute, join } from 'path';
import { randomUUID } from 'crypto';
import { repoHarnessHome } from '../repo-registry';
import { canonicalMessageDigest } from '../../core/messages/mechanics';

import { assertContainment, buildContainmentSpec, encodeContainmentCreate, frozenConfiguration as configuration } from '../../core/automation/campaign-containment';
const CLEANUP_MS = 5000;
const API_BYTES = 65536;
import type { CampaignContainer } from '../../core/automation/campaign-containment';
export type { CampaignContainer } from '../../core/automation/campaign-containment';
export interface CampaignContainerResult {
  exit_code: number; timed_out: boolean; started: boolean;
  termination_cause: 'completed' | 'deadline' | 'cancelled' | 'output_error';
  signal: NodeJS.Signals | null; output_complete: boolean;
  stdout: string; stderr: string; container: CampaignContainer;
  inactive: boolean; receipt_sha256: string;
}
/** Account-owned control storage is never selected by a worker-supplied handle or Git pointer. */
export function campaignContainerJournalRoot(): string {
  const directory = join(repoHarnessHome(), 'campaign-containers');
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  return realpathSync(directory);
}
function assertUnMounted(directory: string, sources: string[]): void {
  for (const source of sources) {
    const canonical = realpathSync(source);
    if (directory === canonical || directory.startsWith(canonical + '/') || canonical.startsWith(directory + '/')) {
      throw new Error('container journal overlaps a worker mount');
    }
  }
}
function assertJournal(directory: string): void {
  const parent = campaignContainerJournalRoot();
  if (!/^[a-f0-9-]{36}$/.test(basename(directory)) || dirname(directory) !== parent
    || realpathSync(directory) !== directory) throw new Error('container journal is outside protected host storage');
}
function save(directory: string, phase: string, value: unknown): void {
  const temporary = join(directory, `.${phase}.${randomUUID()}.tmp`);
  const fd = openSync(temporary, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | constants.O_NOFOLLOW, 0o600);
  try {
    try { writeFileSync(fd, JSON.stringify(value)); fsyncSync(fd); } finally { closeSync(fd); }
    // link publishes complete bytes atomically and refuses to overwrite existing authority.
    linkSync(temporary, join(directory, `${phase}.json`));
    const parent = openSync(directory, constants.O_RDONLY);
    try { fsyncSync(parent); } finally { closeSync(parent); }
  } finally { unlinkSync(temporary); }
}

function read(directory: string, phase: string): any {
  assertJournal(directory);
  const path = join(directory, `${phase}.json`);
  if (!lstatSync(path).isFile() || lstatSync(path).isSymbolicLink()) throw new Error('container journal is not a regular file');
  return JSON.parse(readFileSync(path, 'utf8'));
}
function command(args: string[], deadline: number, endpoint?: string, limit = API_BYTES, signal?: AbortSignal): Promise<{ code: number | null; stdout: string; stderr: string; complete: boolean }> {
  if (Date.now() >= deadline) return Promise.reject(new Error('container command deadline expired'));
  return new Promise((resolve, reject) => {
    const child = spawn('docker', [...(endpoint ? ['--host', endpoint] : []), ...args], {
      env: { PATH: process.env.PATH, HOME: process.env.HOME, DOCKER_API_VERSION: '1.51' }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const stdout: Buffer[] = [], stderr: Buffer[] = []; let bytes = 0; let complete = true;
    const cancel = () => { complete = false; child.kill('SIGKILL'); };
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) cancel();
    const timer = setTimeout(() => { complete = false; child.kill('SIGKILL'); }, Math.min(deadline - Date.now(), 2 ** 31 - 1));
    const append = (chunks: Buffer[], data: Buffer) => {
      bytes += data.length;
      if (bytes > limit) { complete = false; child.kill('SIGKILL'); return; }
      chunks.push(data);
    };
    child.stdout.on('data', data => append(stdout, data)); child.stderr.on('data', data => append(stderr, data));
    child.on('error', error => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(error); });
    child.on('close', code => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); resolve({ code, stdout: Buffer.concat(stdout).toString(), stderr: Buffer.concat(stderr).toString(), complete }); });
  });
}
async function api(args: string[], deadline: number, endpoint?: string): Promise<string> {
  const result = await command(args, deadline, endpoint);
  if (result.code !== 0 || !result.complete) throw new Error(`Docker ${args[0]} failed or exceeded its bound`);
  return result.stdout.trim();
}
async function inspect(handle: CampaignContainer, deadline: number): Promise<any> {
  const daemon = JSON.parse(await api(['info', '--format', '{{json .}}'], deadline, handle.endpoint));
  if (daemon.ID !== handle.daemon_id || daemon.OSType !== 'linux' || daemon.ServerVersion !== '28.3.2') throw new Error('container daemon identity changed');
  const values = JSON.parse(await api(['inspect', '--type', 'container', handle.container_id], deadline, handle.endpoint));
  const value = values[0];
  if (values.length !== 1 || value.Id !== handle.container_id || value.Image !== handle.image) throw new Error('container identity changed');
  const request = read(handle.directory, 'request');
  const { request_sha256, ...body } = request;
  if (request_sha256 !== handle.request_sha256 || canonicalMessageDigest(body) !== handle.request_sha256) throw new Error('container request journal differs');
  try {
    assertContainment({ ...request.expected, phase: {} }, value);
    if (canonicalMessageDigest(configuration(value)) !== handle.configuration_sha256) throw new Error('container configuration outside the supported expected fields changed');
  } catch (error) {
    save(handle.directory, `rejected-readback-${randomUUID()}`, { expected: request.expected, frozen: read(handle.directory, 'configuration'), response: value, reason: String(error) });
    throw error;
  }
  return value;
}
function stopped(value: any): boolean {
  return value.State.Running === false && value.State.Pid === 0 && value.State.Dead === false
    && value.State.Restarting === false && value.RestartCount === 0 && value.State.Status === 'exited';
}
export async function prepareCampaignContainer(input: {
  root: string; worktree: string; common_git_dir: string; argv: readonly string[]; deadline_ms: number;
  writable: boolean; image: string; identity: unknown; probe?: boolean; auth_file?: string;
}): Promise<CampaignContainer> {
  if (Date.now() >= input.deadline_ms) throw new Error('campaign preparation deadline expired');
  if (!/^sha256:[a-f0-9]{64}$/.test(input.image)) throw new Error('campaign requires an explicitly pinned local Docker image ID');
  const uid = process.getuid?.(), gid = process.getgid?.();
  if (!uid || !gid) throw new Error('campaign requires a non-root host UID and GID');
  const worktree = realpathSync(input.worktree), common = realpathSync(input.common_git_dir);
  // Only these roots may be mounted; the executable and watchdog stay in the immutable image.
  if (!isAbsolute(worktree) || !isAbsolute(common) || worktree === '/' || common === '/') throw new Error('invalid campaign mount roots');
  const endpointValue = JSON.parse(await api(['context', 'inspect', '--format', '{{json .Endpoints.docker.Host}}'], input.deadline_ms));
  if (typeof endpointValue !== 'string' || !endpointValue.startsWith('unix:///')) throw new Error('campaign requires a local Unix Docker endpoint');
  const socket = endpointValue.slice(7);
  const endpoint = `unix://${join(realpathSync(dirname(socket)), basename(socket))}`;
  const daemon = JSON.parse(await api(['info', '--format', '{{json .}}'], input.deadline_ms, endpoint));
  if (daemon.OSType !== 'linux' || daemon.ServerVersion !== '28.3.2' || !Array.isArray(daemon.SecurityOptions) || !daemon.SecurityOptions.includes('name=seccomp,profile=builtin') || typeof daemon.ID !== 'string' || !daemon.ID) throw new Error('campaign requires a Linux Docker daemon');
  const image = JSON.parse(await api(['image', 'inspect', input.image], input.deadline_ms, endpoint))[0];
  if (image.Id !== input.image || image.Os !== 'linux') throw new Error('campaign image is unavailable or changed');
  const directory = join(campaignContainerJournalRoot(), randomUUID());
  assertUnMounted(directory, [worktree, common, ...(input.auth_file ? [input.auth_file] : [])]);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  assertJournal(directory);
  assertUnMounted(realpathSync(directory), [worktree, common, ...(input.auth_file ? [input.auth_file] : [])]);
  const name = `repo-harness-campaign-${randomUUID()}`;
  let auth: string | undefined;
  if (input.auth_file) {
    auth = realpathSync(input.auth_file);
    if (lstatSync(input.auth_file).isSymbolicLink() || !lstatSync(auth).isFile()) throw new Error('campaign auth must be an exact regular file');
  }
  if (!lstatSync(worktree).isDirectory() || !lstatSync(common).isDirectory()) throw new Error('campaign roots must be directories');
  const spec = buildContainmentSpec({ image: input.image, image_env: image.Config.Env, worktree, common, auth,
    argv: input.argv, deadline: input.deadline_ms, uid, gid, writable: input.writable, probe: input.probe === true });
  const args = encodeContainmentCreate(spec, name);
  const request = { protocol: 1, identity: input.identity, endpoint, daemon_id: daemon.ID, name, args, expected: spec, deadline_ms: input.deadline_ms };
  const request_sha256 = canonicalMessageDigest(request);
  // A name is durable before create, so an interrupted/ambiguous create remains discoverable.
  save(directory, 'request', { ...request, request_sha256 });
  const id = await api(args, input.deadline_ms, endpoint);
  if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('Docker did not return an exact container ID');
  const value = JSON.parse(await api(['inspect', '--type', 'container', id], input.deadline_ms, endpoint))[0];
  if (value.Id !== id) throw new Error('Docker returned a different container identity');
  try { assertContainment(spec, value); }
  catch (error) { save(directory, 'rejected-inspect', { expected: spec, response: value, reason: String(error) }); throw error; }
  const handle: CampaignContainer = { protocol: 1, directory, endpoint, daemon_id: daemon.ID, image: input.image,
    container_id: id, request_sha256, configuration_sha256: canonicalMessageDigest(configuration(value)) };
  save(directory, 'configuration', configuration(value));
  save(directory, 'created', handle);
  return handle;
}

export async function runCampaignContainer(handle: CampaignContainer, deadline: number, signal?: AbortSignal, limit = 16 * 1024 * 1024): Promise<CampaignContainerResult> {
  if (canonicalMessageDigest(read(handle.directory, 'created')) !== canonicalMessageDigest({ ...handle })) throw new Error('container launch handle differs from journal');
  const request = read(handle.directory, 'request');
  const { request_sha256, ...requestBody } = request;
  if (canonicalMessageDigest(requestBody) !== handle.request_sha256
    || request_sha256 !== handle.request_sha256 || deadline !== request.deadline_ms) throw new Error('container deadline or request differs');
  if (existsSync(join(handle.directory, 'start.json'))) throw new Error('container invocation has already been admitted; never restart it');
  let cause: CampaignContainerResult['termination_cause'] = signal?.aborted ? 'cancelled' : Date.now() >= deadline ? 'deadline' : 'completed';
  let output = { code: null as number | null, stdout: '', stderr: '', complete: true };
  let started = false;
  const cancel = () => { cause = 'cancelled'; };
  signal?.addEventListener('abort', cancel, { once: true });
  try {
    if (cause === 'completed') {
      const before = await inspect(handle, deadline);
      assertContainment(request.expected, before);
      if (signal?.aborted || Date.now() >= deadline) cause = signal?.aborted ? 'cancelled' : 'deadline';
      else {
        save(handle.directory, 'start', { container_id: handle.container_id, request_sha256: handle.request_sha256 });
        started = true;
        // The independent PID1 deadline survives loss of this attach client/controller.
        output = await command(['start', '--attach', handle.container_id], deadline, handle.endpoint, limit, signal);
        if (signal?.aborted) cause = 'cancelled';
        else if (!output.complete) cause = Date.now() >= deadline ? 'deadline' : 'output_error';
      }
    }
  } finally { signal?.removeEventListener('abort', cancel); }
  const cleanupDeadline = Date.now() + CLEANUP_MS;
  let value = await inspect(handle, cleanupDeadline);
  if (value.State.Running) {
    await api(['kill', '--signal', 'KILL', handle.container_id], cleanupDeadline, handle.endpoint);
    value = await inspect(handle, cleanupDeadline);
  }
  const inactive = stopped(value) || (!started && value.State.Status === 'created' && value.State.Pid === 0);
  if (!inactive) throw new Error('container namespace termination is not proven');
  const exit = cause === 'cancelled' ? 143 : cause === 'deadline' ? 124 : cause === 'output_error' ? 125 : value.State.ExitCode;
  const body = { protocol: 1, handle, started, termination_cause: cause, exit_code: exit,
    daemon_state: value.State, restart_count: value.RestartCount, inactive,
    output_complete: output.complete && (cause !== 'completed' || output.code === value.State.ExitCode),
    stdout_sha256: canonicalMessageDigest({ bytes: output.stdout }), stderr_sha256: canonicalMessageDigest({ bytes: output.stderr }) };
  const receipt_sha256 = canonicalMessageDigest(body);
  save(handle.directory, 'terminal', { ...body, receipt_sha256 });
  return { exit_code: exit, timed_out: cause === 'deadline' || exit === 124, started, termination_cause: cause,
    signal: cause === 'cancelled' ? 'SIGTERM' : null, output_complete: body.output_complete,
    stdout: output.stdout, stderr: output.stderr, container: handle, inactive, receipt_sha256 };
}

/** Validate the protected host journal, never a receipt supplied in the writable worktree. */
export function assertCampaignContainerBinding(handle: CampaignContainer, input: {
  common: string; worktree: string; identity: unknown; argv: readonly string[]; deadline: number; writable: boolean; probe: boolean;
}): void {
  assertJournal(handle.directory);
  if (canonicalMessageDigest(read(handle.directory, 'created')) !== canonicalMessageDigest({ ...handle })) throw new Error('container handle differs from protected journal');
  const { request_sha256, ...request } = read(handle.directory, 'request');
  if (request_sha256 !== handle.request_sha256 || canonicalMessageDigest(request) !== handle.request_sha256
    || request.deadline_ms !== input.deadline || request.endpoint !== handle.endpoint || request.daemon_id !== handle.daemon_id
    || canonicalMessageDigest({ identity: request.identity }) !== canonicalMessageDigest({ identity: input.identity })) throw new Error('container request identity differs');
  const fields = request.expected.fields;
  const cmd = fields['Config.Cmd'];
  if (fields.Image !== handle.image || fields['Config.WorkingDir'] !== realpathSync(input.worktree)
    || !Array.isArray(cmd) || canonicalMessageDigest({ argv: cmd.slice(4) }) !== canonicalMessageDigest({ argv: input.argv })
    || cmd[0] !== String(input.deadline) || fields['HostConfig.NetworkMode'] !== (input.probe ? 'none' : 'bridge')) throw new Error('container executable or deadline differs');
  const mounts = request.expected.mounts;
  assertUnMounted(handle.directory, mounts.map((mount: { Source: string }) => mount.Source));
  const workspace = mounts.find((m: any) => m.Destination === realpathSync(input.worktree));
  const common = mounts.find((m: any) => m.Destination === realpathSync(input.common));
  if (!workspace || workspace.Source !== realpathSync(input.worktree) || workspace.RW !== input.writable
    || !common || common.Source !== realpathSync(input.common) || common.RW !== false) throw new Error('container workspace access differs');
}

export function readCampaignContainerReceipt(handle: CampaignContainer, receipt: string, stdout: string, stderr: string) {
  const value = read(handle.directory, 'terminal');
  const { receipt_sha256, ...body } = value;
  if (receipt !== receipt_sha256 || receipt !== canonicalMessageDigest(body)
    || canonicalMessageDigest(value.handle) !== canonicalMessageDigest({ ...handle }) || value.inactive !== true
    || value.stdout_sha256 !== canonicalMessageDigest({ bytes: stdout }) || value.stderr_sha256 !== canonicalMessageDigest({ bytes: stderr })
    || typeof value.started !== 'boolean' || typeof value.output_complete !== 'boolean' || !Number.isInteger(value.exit_code)
    || !['completed', 'deadline', 'cancelled', 'output_error'].includes(value.termination_cause)
    || !(stopped({ State: value.daemon_state, RestartCount: value.restart_count })
      || value.started === false && value.daemon_state.Running === false && value.daemon_state.Status === 'created' && value.daemon_state.Pid === 0)) throw new Error('container terminal receipt differs or lacks inactivity proof');
  return { exit_code: value.exit_code as number, started: value.started as boolean, output_complete: value.output_complete as boolean,
    termination_cause: value.termination_cause as CampaignContainerResult['termination_cause'], inactive: true as const };
}

/** Expiry fences any delayed start; this observation never runs, restarts or kills a workload. */
export async function reconcileCampaignContainer(handle: CampaignContainer): Promise<ReturnType<typeof readCampaignContainerInterruption>> {
  const request = read(handle.directory, 'request');
  const { request_sha256, ...body } = request;
  if (request_sha256 !== handle.request_sha256 || canonicalMessageDigest(body) !== handle.request_sha256
    || !Number.isSafeInteger(request.deadline_ms) || Date.now() < request.deadline_ms) throw new Error('container reconciliation requires the original expired deadline');
  if (canonicalMessageDigest(read(handle.directory, 'created')) !== canonicalMessageDigest({ ...handle })) throw new Error('container reconciliation handle differs');
  if (existsSync(join(handle.directory, 'interrupted.json'))) return readCampaignContainerInterruption(handle);
  const value = await inspect(handle, Date.now() + CLEANUP_MS);
  if (!stopped(value) && !(value.State.Status === 'created' && value.State.Running === false && value.State.Pid === 0
    && value.State.Dead === false && value.State.Restarting === false && value.RestartCount === 0)) throw new Error('container inactivity is not proven');
  const proof = { protocol: 1, kind: 'repo-harness-campaign-container-interruption', handle, deadline_ms: request.deadline_ms,
    daemon_state: value.State, restart_count: value.RestartCount, inactive: true, output_complete: false };
  try { save(handle.directory, 'interrupted', { ...proof, receipt_sha256: canonicalMessageDigest(proof) }); }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
  return readCampaignContainerInterruption(handle);
}

/** An interruption proves only namespace inactivity. It cannot reconstruct a provider result. */
export function readCampaignContainerInterruption(handle: CampaignContainer) {
  const { receipt_sha256, ...body } = read(handle.directory, 'interrupted');
  const request = read(handle.directory, 'request');
  if (body.protocol !== 1 || body.kind !== 'repo-harness-campaign-container-interruption'
    || receipt_sha256 !== canonicalMessageDigest(body) || canonicalMessageDigest(body.handle) !== canonicalMessageDigest({ ...handle })
    || body.deadline_ms !== request.deadline_ms || !Number.isSafeInteger(body.deadline_ms) || Date.now() < body.deadline_ms
    || body.inactive !== true || body.output_complete !== false
    || !(stopped({ State: body.daemon_state, RestartCount: body.restart_count })
      || body.daemon_state.Status === 'created' && body.daemon_state.Running === false && body.daemon_state.Pid === 0
        && body.daemon_state.Dead === false && body.daemon_state.Restarting === false && body.restart_count === 0)) throw new Error('container interruption proof differs');
  return { receipt_sha256: receipt_sha256 as string, container_id: handle.container_id, deadline_ms: body.deadline_ms as number,
    inactive: true as const, output_complete: false as const };
}
