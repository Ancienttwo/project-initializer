import { constants, existsSync, closeSync, fsyncSync, linkSync, lstatSync, mkdirSync, openSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { createHash, randomUUID } from 'crypto';
import { dirname, isAbsolute, join, relative, resolve } from 'path';
import { userInfo } from 'os';
import { fileURLToPath } from 'url';
import { acquireExclusiveDirectoryLock } from '../locking/exclusive-directory-lock';
import { markdownHeader } from '../../core/state/artifact-parsers';
import { CLAUDE_REVIEW_MAX_ROUNDS, CLAUDE_REVIEW_TIMEOUT_MS, reviewContextDigest, validateClaudeReviewResult, type ClaudeReviewContext, type ClaudeReviewRequest } from '../../core/review/claude-review';
import { acceptanceContext, authorityFingerprint, projectAcceptance, recordAcceptance, verifyAcceptance } from '../../../scripts/acceptance-receipt';

export interface ReviewSession {
  protocol: 1;
  repo_root: string;
  contract_file: string;
  contract_sha256: string;
  goal_sha256: string;
  session_id: string;
  tmux_session: string;
  tmux_bin: string;
  provider_bin: string;
}

export interface ReviewProcesses {
  host: string;
  child: string;
  child_pid: number;
  server: string;
  pane: string;
}

export interface ClaudeReviewOptions {
  repoRoot: string;
  contract: string;
  verification?: string;
  timeoutMs?: number;
  /** Internal seams used by deterministic integration tests, never exposed by CLI. */
  providerCommand?: string;
  authorityHome?: string;
  admitSession: () => void;
}

export function processIdentity(pid: number): string {
  if (!Number.isSafeInteger(pid) || pid < 1) throw new Error('claude_review_invalid_process');
  return execFileSync('ps', ['-p', String(pid), '-o', 'pid=,pgid=,lstart=,comm='], { encoding: 'utf8' }).trim();
}

export function readReviewJson<T>(path: string): T {
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try { return JSON.parse(readFileSync(fd, 'utf8')) as T; } finally { closeSync(fd); }
}

export function writeReviewJson(path: string, value: unknown, immutable = true): void {
  const temporary = `${path}.${randomUUID()}.tmp`;
  const fd = openSync(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o600);
  try { writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`); fsyncSync(fd); } finally { closeSync(fd); }
  try { if (immutable) linkSync(temporary, path); else renameSync(temporary, path); }
  finally { if (existsSync(temporary)) unlinkSync(temporary); }
  const directory = openSync(dirname(path), constants.O_RDONLY);
  try { fsyncSync(directory); } finally { closeSync(directory); }
}

function safeDirectory(root: string, path: string): void {
  const parts = relative(root, path).split('/');
  if (parts.includes('..') || isAbsolute(relative(root, path))) throw new Error('claude_review_unsafe_directory');
  let current = root;
  for (const part of parts) {
    current = join(current, part);
    try { mkdirSync(current, { mode: 0o700 }); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
    if (!lstatSync(current).isDirectory() || lstatSync(current).isSymbolicLink()) throw new Error('claude_review_unsafe_directory');
  }
}

export function reviewSessionLocation(repoRoot: string, contract: string): { root: string; dir: string; contract: string } {
  const root = realpathSync(repoRoot);
  const canonical = relative(root, resolve(root, contract));
  if (!canonical.startsWith('tasks/contracts/') || !canonical.endsWith('.contract.md') || canonical.split('/').includes('..')) {
    throw new Error('claude_review_invalid_contract_path');
  }
  const key = createHash('sha256').update(canonical).digest('hex');
  const dir = join(root, '.ai/harness/runs/claude-review', key);
  safeDirectory(root, dir);
  return { root, dir, contract: canonical };
}

export function tmux(session: ReviewSession, args: string[]): string {
  return execFileSync(session.tmux_bin, ['-L', 'repo-harness-review', ...args], { encoding: 'utf8', timeout: 10_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function assertReviewProcesses(session: ReviewSession, processes: ReviewProcesses): void {
  const pane = tmux(session, ['display-message', '-p', '-t', processes.pane, '#{pid}\t#{session_name}\t#{pane_id}\t#{pane_pid}']);
  const [serverPid, name, id, hostPid] = pane.split('\t');
  if (name !== session.tmux_session || id !== processes.pane || processIdentity(Number(serverPid)) !== processes.server
    || processIdentity(Number(hostPid)) !== processes.host || processIdentity(processes.child_pid) !== processes.child) {
    throw new Error('claude_review_process_identity_lost');
  }
}

function readSession(dir: string, root: string, contract: string): ReviewSession {
  const session = readReviewJson<ReviewSession>(join(dir, 'session.json'));
  if (session.protocol !== 1 || session.repo_root !== root || session.contract_file !== contract
    || !/^[0-9a-f-]{36}$/.test(session.session_id) || session.tmux_session !== `review-${session.session_id}`
    || !isAbsolute(session.tmux_bin) || !isAbsolute(session.provider_bin)) throw new Error('claude_review_session_identity_mismatch');
  return session;
}

function shellQuote(value: string): string { return `'${value.replace(/'/g, `'\\''`)}'`; }

function failure(dir: string): void {
  if (existsSync(join(dir, 'failure.json'))) throw new Error(`claude_review_interrupted: ${readReviewJson<{ error: string }>(join(dir, 'failure.json')).error}`);
  if (existsSync(join(dir, 'close.request.json'))) throw new Error('claude_review_session_closed');
}

async function waitFile(path: string, deadline: number, check: () => void): Promise<void> {
  let nextCheck = 0;
  while (!existsSync(path)) {
    if (Date.now() >= nextCheck) { check(); nextCheck = Date.now() + 1000; }
    if (Date.now() >= deadline) throw new Error('claude_review_wait_timeout; delivery may be ambiguous; inspect status and cancel');
    await Bun.sleep(100);
  }
}

function contextIdentity(context: Awaited<ReturnType<typeof acceptanceContext>>): ClaudeReviewContext {
  return {
    contract_file: context.contract.path, contract_sha256: authorityFingerprint(context.contract.content),
    goal_sha256: authorityFingerprint(context.goal.content), subject_sha256: context.subject.review_subject_sha256,
    verification_evidence_sha256: context.evidence.fingerprint, target_revision: context.subject.target_rev,
  };
}

function sourcePacket(root: string, paths: readonly string[], target: string): string {
  const pieces = [execFileSync('git', ['-C', root, 'diff', '--no-ext-diff', '--no-textconv', '--binary', target, '--'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })];
  for (const path of paths) {
    const file = resolve(root, path);
    if (relative(root, file).split('/').includes('..')) throw new Error('claude_review_unsafe_subject_path');
    if (!existsSync(file)) { pieces.push(`\nDeleted path: ${JSON.stringify(path)}`); continue; }
    if (lstatSync(file).isSymbolicLink() || !lstatSync(file).isFile() || !realpathSync(file).startsWith(root + '/')) throw new Error(`claude_review_unsupported_subject_entry: ${path}`);
    // Tracked content is already in the diff; read tools provide surrounding context.
    const tracked = execFileSync('git', ['-C', root, '--literal-pathspecs', 'ls-files', '--', path], { encoding: 'utf8' }).trim();
    if (tracked) continue;
    if (lstatSync(file).size > 8 * 1024 * 1024) throw new Error('claude_review_subject_too_large');
    const content = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(file));
    pieces.push(`\nComplete untracked file ${JSON.stringify(path)}:\n${content}`);
  }
  const packet = pieces.join('\n');
  if (Buffer.byteLength(packet) > 8 * 1024 * 1024) throw new Error('claude_review_subject_too_large');
  return packet;
}

export async function runClaudeReviewRound(options: ClaudeReviewOptions) {
  const { root, dir, contract } = reviewSessionLocation(options.repoRoot, options.contract);
  const lock = acquireExclusiveDirectoryLock(root, relative(root, join(dir, 'caller.lock')), { waitTimeoutMs: 1, reclaimStaleOwner: true });
  try {
    failure(dir);
    const timeout = options.timeoutMs ?? CLAUDE_REVIEW_TIMEOUT_MS;
    if (!Number.isSafeInteger(timeout) || timeout < 1 || timeout > CLAUDE_REVIEW_TIMEOUT_MS) throw new Error('claude_review_invalid_timeout');
    const verification = options.verification ?? '.ai/harness/checks/latest.json';
    const context = await acceptanceContext({ root, contract, verification });
    if (context.policy.reviewer !== 'Claude') throw new Error('claude_review_requires_claude_acceptance_policy');
    const identity = contextIdentity(context);
    let session: ReviewSession;
    if (!existsSync(join(dir, 'session.json'))) {
      const tmuxBin = Bun.which('tmux');
      const providerBin = options.providerCommand ? realpathSync(options.providerCommand) : Bun.which('claude');
      if (!tmuxBin || !providerBin) throw new Error('claude_review_requires_tmux_and_claude');
      execFileSync(tmuxBin, ['-V'], { timeout: 5000 });
      options.admitSession();
      const id = randomUUID();
      session = { protocol: 1, repo_root: root, contract_file: contract, contract_sha256: identity.contract_sha256,
        goal_sha256: identity.goal_sha256, session_id: id, tmux_session: `review-${id}`, tmux_bin: tmuxBin, provider_bin: providerBin };
      writeReviewJson(join(dir, 'session.json'), session);
      const host = fileURLToPath(new URL('./claude-review-host.ts', import.meta.url));
      try {
        tmux(session, ['new-session', '-d', '-s', session.tmux_session, '-c', root,
          `exec ${shellQuote(process.execPath)} ${shellQuote(host)} ${shellQuote(dir)}`]);
        tmux(session, ['set-window-option', '-t', session.tmux_session + ':0', 'remain-on-exit', 'off']);
        await waitFile(join(dir, 'processes.json'), Date.now() + 15_000, () => failure(dir));
      } catch (error) {
        if (!existsSync(join(dir, 'failure.json'))) writeReviewJson(join(dir, 'failure.json'), { error: `startup: ${String(error)}` });
        throw error;
      }
    } else session = readSession(dir, root, contract);
    if (session.contract_sha256 !== identity.contract_sha256 || session.goal_sha256 !== identity.goal_sha256) throw new Error('claude_review_contract_or_goal_changed');
    const processes = readReviewJson<ReviewProcesses>(join(dir, 'processes.json'));
    assertReviewProcesses(session, processes);
    let round = 1;
    for (; round <= CLAUDE_REVIEW_MAX_ROUNDS && existsSync(join(dir, `request-${round}.json`)); round++) {
      const previous = readReviewJson<ClaudeReviewRequest>(join(dir, `request-${round}.json`));
      if (!existsSync(join(dir, `accepted-${round}.json`))) throw new Error('claude_review_ambiguous_round; pending or unrecorded result must not be replayed');
      if (previous.context.subject_sha256 === identity.subject_sha256) throw new Error('claude_review_duplicate_subject');
    }
    if (round > CLAUDE_REVIEW_MAX_ROUNDS) throw new Error('claude_review_round_budget_exhausted');
    const request: ClaudeReviewRequest = { round, round_id: randomUUID(), session_id: session.session_id,
      context: identity, context_sha256: reviewContextDigest(identity), timeout_ms: timeout, prompt: '' };
    request.prompt = [
      'Act as an independent read-only acceptance reviewer. Review the complete current subject against its goal, contract and prepared verification evidence. Do not edit files or invoke other reviewers. Return only the required structured review result.',
      `Echo this exact identity: ${JSON.stringify({ round_id: request.round_id, session_id: session.session_id, subject_sha256: identity.subject_sha256, context_sha256: request.context_sha256 })}`,
      'PASS is permitted only when the current subject satisfies the contract and has no unresolved P0/P1 findings. Otherwise return FAIL. Findings use stable IDs; each prior finding must be marked resolved or open with current evidence; new problems use new IDs. A previous verdict is not evidence for the current code.',
      `CONTRACT:\n${context.contract.content}`, `GOAL:\n${context.goal.content}`,
      `PREPARED VERIFICATION:\n${context.verification.content}`,
      `CURRENT SOURCE:\n${sourcePacket(root, context.subject.paths, context.subject.target_rev)}`,
    ].join('\n\n');
    if (Buffer.byteLength(request.prompt) > 10 * 1024 * 1024) throw new Error('claude_review_context_too_large');
    const recheck = await acceptanceContext({ root, contract, verification });
    if (reviewContextDigest(contextIdentity(recheck)) !== request.context_sha256) throw new Error('claude_review_context_changed_before_submit');
    lock.assertOwned(); assertReviewProcesses(session, processes);
    writeReviewJson(join(dir, `request-${round}.json`), request);
    await waitFile(join(dir, `result-${round}.json`), Date.now() + timeout + 2000, () => { failure(dir); assertReviewProcesses(session, processes); });
    failure(dir); assertReviewProcesses(session, processes); lock.assertOwned();
    const result = readReviewJson<unknown>(join(dir, `result-${round}.json`));
    const output = validateClaudeReviewResult(result, request);
    if (round > 1) {
      const previousRequest = readReviewJson<ClaudeReviewRequest>(join(dir, `request-${round - 1}.json`));
      const previous = validateClaudeReviewResult(readReviewJson(join(dir, `result-${round - 1}.json`)), previousRequest);
      for (const finding of previous.findings) {
        const current = output.findings.find(item => item.id === finding.id);
        if (!current || current.status === 'new') throw new Error('claude_review_previous_finding_unaddressed');
      }
    }
    const receipt = await recordAcceptance({ root, authorityHome: options.authorityHome ?? userInfo().homedir, contract, verification,
      disposition: output.verdict === 'PASS' ? 'external_pass' : 'reject', reviewer: 'Claude', source: 'claude-review', actor: null,
      summary: output.summary, findings: output.findings.filter(finding => finding.status !== 'resolved').map(({ severity, message }) => ({ severity, message })),
      expectedContext: request.context });
    writeReviewJson(join(dir, `accepted-${round}.json`), { result_sha256: createHash('sha256').update(JSON.stringify(result)).digest('hex'), receipt });
    const review = markdownHeader(context.contract.content, 'Review File');
    if (review) projectAcceptance(resolve(root, review), receipt);
    return { status: output.verdict === 'PASS' ? 'accepted' : 'rejected', round, session_id: session.session_id,
      child_pid: processes.child_pid, pane: processes.pane, attach: `tmux -L repo-harness-review attach -t ${session.tmux_session}`, output, receipt };
  } finally { lock.release(); }
}

export function claudeReviewStatus(repoRoot: string, contractPath: string) {
  const { root, dir, contract } = reviewSessionLocation(repoRoot, contractPath);
  if (!existsSync(join(dir, 'session.json'))) return { status: 'absent' };
  const session = readSession(dir, root, contract);
  const closed = existsSync(join(dir, 'closed.json'));
  let error: string | null = null;
  let processes: ReviewProcesses | null = null;
  if (!closed) {
    try { processes = readReviewJson<ReviewProcesses>(join(dir, 'processes.json')); assertReviewProcesses(session, processes); failure(dir); }
    catch (caught) { error = String(caught); }
  }
  const rounds = Array.from({ length: CLAUDE_REVIEW_MAX_ROUNDS }, (_, i) => i + 1).filter(i => existsSync(join(dir, `request-${i}.json`)))
    .map(round => ({ round, submitted: true, result_saved: existsSync(join(dir, `result-${round}.json`)), receipt_saved: existsSync(join(dir, `accepted-${round}.json`)) }));
  return { status: closed ? 'closed' : error ? 'interrupted' : rounds.some(r => !r.receipt_saved) ? 'pending' : 'idle',
    session_id: session.session_id, processes, rounds, error, attach: `tmux -L repo-harness-review attach -t ${session.tmux_session}` };
}

export async function closeClaudeReview(options: Pick<ClaudeReviewOptions, 'repoRoot' | 'contract' | 'authorityHome'>, cancel = false) {
  const { root, dir, contract } = reviewSessionLocation(options.repoRoot, options.contract);
  const session = readSession(dir, root, contract);
  if (existsSync(join(dir, 'closed.json'))) return readReviewJson(join(dir, 'closed.json'));
  const processes = readReviewJson<ReviewProcesses>(join(dir, 'processes.json'));
  // The host owns the child and may still be available to clean an exited provider.
  let hostAvailable = false;
  try {
    const pane = tmux(session, ['display-message', '-p', '-t', processes.pane, '#{pid}\t#{session_name}\t#{pane_pid}']).split('\t');
    hostAvailable = pane[1] === session.tmux_session && processIdentity(Number(pane[0])) === processes.server && processIdentity(Number(pane[2])) === processes.host;
  } catch { /* An exited host can leave its detached provider alive. Only explicit cancel handles that case. */ }
  if (!hostAvailable) {
    if (!cancel) throw new Error('claude_review_cleanup_identity_lost');
    // A changed PPID after reparenting is not a new process; PID, group, start time and executable remain fenced.
    const alive = () => {
      try { process.kill(processes.child_pid, 0); } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ESRCH') return false; throw error; }
      if (processIdentity(processes.child_pid) !== processes.child) throw new Error('claude_review_cleanup_child_identity_lost');
      return true;
    };
    if (!existsSync(join(dir, 'close.request.json'))) writeReviewJson(join(dir, 'close.request.json'), { cancel: true, session_id: session.session_id });
    for (const signal of ['SIGTERM', 'SIGKILL'] as const) {
      if (!alive()) break;
      process.kill(-processes.child_pid, signal);
      const deadline = Date.now() + 4000;
      while (alive() && Date.now() < deadline) await Bun.sleep(100);
    }
    if (alive()) throw new Error('claude_review_cleanup_incomplete');
    // Never kill a pane after losing its host identity: it may now belong to the user.
    writeReviewJson(join(dir, 'closed.json'), { session_id: session.session_id, cancelled: true, termination: 'orphan-owned-group', host_available: false });
    return readReviewJson(join(dir, 'closed.json'));
  }
  if (!cancel) {
    const receipt = await verifyAcceptance({ root, authorityHome: options.authorityHome ?? userInfo().homedir, contract });
    const completed = Array.from({ length: CLAUDE_REVIEW_MAX_ROUNDS }, (_, i) => i + 1).filter(i => existsSync(join(dir, `accepted-${i}.json`)));
    if (!completed.length) throw new Error('claude_review_no_accepted_round');
    const accepted = readReviewJson<{ receipt: unknown }>(join(dir, `accepted-${completed.at(-1)}.json`));
    if (JSON.stringify(accepted.receipt) !== JSON.stringify(receipt)) throw new Error('claude_review_acceptance_mismatch');
  }
  if (!existsSync(join(dir, 'close.request.json'))) writeReviewJson(join(dir, 'close.request.json'), { cancel, session_id: session.session_id });
  await waitFile(join(dir, 'closed.json'), Date.now() + 15_000, () => {});
  return readReviewJson(join(dir, 'closed.json'));
}
