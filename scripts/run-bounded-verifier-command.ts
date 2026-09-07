#!/usr/bin/env bun
import { closeSync, openSync, writeFileSync, writeSync } from 'fs';
import { createHash } from 'crypto';
import { spawn } from 'child_process';

type Result = {
  output_sha256?: { stdout: string; stderr: string };
  output_complete?: boolean;
  duration_ms: number;
  timed_out: boolean;
  exit_code: number;
  signal: NodeJS.Signals | null;
  process_group_quiescence: { scope: 'posix_process_group' | 'unsupported'; state: 'quiescent' | 'active' | 'unknown' };
};

function usage(): never {
  process.stderr.write('Usage: run-bounded-verifier-command.ts --deadline-ms <epoch-ms> --log <path> [--stderr-log <path>] --result <path> -- <command> [args...]\n');
  process.exit(2);
}

const argv = process.argv.slice(2);
const separator = argv.indexOf('--');
if (separator < 0 || separator === argv.length - 1) usage();

function option(name: string): string {
  const index = argv.slice(0, separator).indexOf(name);
  if (index < 0 || index + 1 >= separator) usage();
  return argv[index + 1];
}

const deadlineMs = Number(option('--deadline-ms'));
const logPath = option('--log');
const resultPath = option('--result');
const stderrPath = argv.slice(0, separator).includes('--stderr-log') ? option('--stderr-log') : null;
const command = argv[separator + 1];
const args = argv.slice(separator + 2);
if (!Number.isFinite(deadlineMs)) usage();

// How long to keep re-polling process-group absence after a forced (deadline
// or signal) SIGKILL before giving up. SIGKILL delivery is not synchronous:
// the OS needs a moment to actually reap the group, so treating the instant
// the signal is *sent* as proof the group is gone lets a surviving
// descendant (this command was spawned `detached: true`, its own separate
// process group) outlive this wrapper undetected.
const FORCED_TERMINATION_CONFIRM_MS = 500;

// A verification command must observe the project's real behaviour in a clean
// environment. The package-dispatched helper mechanism injects `REPO_HARNESS_*`
// wiring (helper source path, target repo root, trusted tool binaries) into its
// child, and that set inherits all the way down verify-sprint -> verify-contract
// -> a nested test run, where it can silently override a fixture's own repo
// root or tool resolution. Strip the whole prefix -- not a curated subset --
// so harness-internal wiring never reaches the command under verification.
// This runner reads no `REPO_HARNESS_*` variable itself.
function scrubHarnessEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const scrubbed: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('REPO_HARNESS_')) continue;
    scrubbed[key] = value;
  }
  return scrubbed;
}

const startedAt = Date.now();
let timedOut = false;
let terminating = false;
let forcedTerminationSent = false;
let forcedTerminationConfirmDeadlineMs = 0;
let forceTermination: Promise<void> | undefined;
const logFd = openSync(logPath, 'w');
const stderrFd = stderrPath === null ? logFd : openSync(stderrPath, 'w');
const child = spawn(command, args, {
  detached: process.platform !== 'win32',
  stdio: stderrPath === null ? ['ignore', logFd, stderrFd] : ['ignore', 'pipe', 'pipe'],
  env: scrubHarnessEnv(process.env),
});

const stdoutHash = createHash('sha256');
const stderrHash = createHash('sha256');
let outputError = false;
let outputClosed = false;
const closed = new Promise<void>(resolve => child.once('close', () => { outputClosed = true; resolve(); }));
if (stderrPath !== null) {
  for (const [stream, fd, hash] of [[child.stdout!, logFd, stdoutHash], [child.stderr!, stderrFd, stderrHash]] as const) {
    stream.on('data', (bytes: Buffer) => {
      hash.update(bytes);
      try { let offset = 0; while (offset < bytes.length) offset += writeSync(fd, bytes, offset, bytes.length - offset); }
      catch { outputError = true; beginTermination(); }
    });
    stream.on('error', () => { outputError = true; });
  }
}

function terminate(signal: NodeJS.Signals): void {
  if (!child.pid) return;
  try {
    if (process.platform === 'win32') child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch {
    // The whole group already exited.
  }
}

function processGroupExists(): boolean {
  if (!child.pid || process.platform === 'win32') return false;
  try {
    process.kill(-child.pid, 0);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ESRCH') return false;
    if (code === 'EPERM') return true;
    throw error;
  }
}

async function waitForProcessGroupQuiescence(): Promise<void> {
  while (processGroupExists()) {
    // A forced SIGKILL was already sent; give the OS a bounded confirmation
    // window to actually reap the group instead of trusting
    // forcedTerminationSent alone (that flag flips the instant the signal is
    // *sent*, not once the group is actually gone). Only give up -- and
    // proceed as though quiescent -- once that window has elapsed too.
    if (forcedTerminationSent && Date.now() >= forcedTerminationConfirmDeadlineMs) return;
    await Bun.sleep(10);
  }
}

function beginTermination(): void {
  if (terminating) return;
  terminating = true;
  terminate('SIGTERM');
  forceTermination = new Promise((resolve) => {
    setTimeout(() => {
      // Address the original process group even when its leader already
      // exited; a TERM-resistant descendant may still own the group.
      terminate('SIGKILL');
      forcedTerminationSent = true;
      forcedTerminationConfirmDeadlineMs = Date.now() + FORCED_TERMINATION_CONFIRM_MS;
      resolve();
    }, 500);
  });
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) {
  process.on(signal, () => {
    beginTermination();
  });
}

const remainingMs = Math.max(0, deadlineMs - Date.now());
const deadlineTimer = setTimeout(() => {
  timedOut = true;
  beginTermination();
}, remainingMs);

const leaderCompletion = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) => {
  child.once('error', () => resolve({ code: 127, signal: null }));
  child.once('exit', (code, signal) => resolve({ code, signal }));
});
const completion = await leaderCompletion.then(async (result) => {
  await waitForProcessGroupQuiescence();
  return result;
});

if (stderrPath !== null && !outputClosed) {
  let streamTimer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([closed, new Promise<void>(resolve => { streamTimer = setTimeout(resolve, Math.max(0, deadlineMs - Date.now())); })]);
  if (streamTimer) clearTimeout(streamTimer);
  if (!outputClosed) { timedOut = true; outputError = true; child.stdout?.destroy(); child.stderr?.destroy(); beginTermination(); }
}
clearTimeout(deadlineTimer);
if (forceTermination) await forceTermination;
closeSync(logFd);
if (stderrFd !== logFd) closeSync(stderrFd);
const result: Result = {
  ...(stderrPath !== null ? { output_sha256: { stdout: `sha256:${stdoutHash.digest('hex')}`, stderr: `sha256:${stderrHash.digest('hex')}` }, output_complete: outputClosed && !outputError } : {}),
  duration_ms: Date.now() - startedAt,
  timed_out: timedOut,
  exit_code: timedOut ? 124 : completion.code ?? 1,
  signal: completion.signal,
  process_group_quiescence: process.platform === 'win32' || !child.pid
    ? { scope: 'unsupported', state: 'unknown' }
    : { scope: 'posix_process_group', state: processGroupExists() ? 'active' : 'quiescent' },
};
writeFileSync(resultPath, `${JSON.stringify(result)}\n`);
process.exit(result.exit_code);
