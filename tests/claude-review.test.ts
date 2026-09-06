import { afterEach, expect, test } from 'bun:test';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { buildReviewSubject } from '../src/effects/review/diff-fingerprint';
import { assessChange, buildReviewSelectionPacket } from '../src/core/review/change-assessment';
import { claudeReviewStatus, closeClaudeReview, reviewSessionLocation, runClaudeReviewRound } from '../src/effects/review/claude-review-session';
import { verifyAcceptance } from '../scripts/acceptance-receipt';
import { reviewContextDigest, validateClaudeReviewResult, type ClaudeReviewRequest } from '../src/core/review/claude-review';

const fixtures: { root: string; home: string }[] = [];
const sentinels: string[] = [];
const contract = 'tasks/contracts/review.contract.md';
afterEach(async () => {
  for (const fixture of fixtures.splice(0)) {
    try { await closeClaudeReview({ repoRoot: fixture.root, contract, authorityHome: fixture.home }, true); } catch { /* A session may never have started. */ }
    rmSync(fixture.root, { recursive: true, force: true });
    rmSync(fixture.home, { recursive: true, force: true });
  }
  for (const name of sentinels.splice(0)) execFileSync('tmux', ['-L', 'repo-harness-claude-review', 'kill-session', '-t', name]);
});

function git(root: string, ...args: string[]) { return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function canonical(value: any): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}

function prepare(root: string) {
  const subject = buildReviewSubject(root, { targetRef: 'main' });
  const assessment = assessChange({ subject, workflowProfile: 'lite', strictCategories: [], patternNoveltyPaths: [], declaredOracles: [] });
  if (assessment.status !== 'ready') throw new Error('fixture assessment unavailable');
  const basis = { schema: 'repo-harness-change-assessment-evidence.v1', status: 'pass', assessment, selection_packet: buildReviewSelectionPacket(assessment) };
  writeFileSync(join(root, '.ai/harness/checks/latest.json'), JSON.stringify({
    source: 'verify-sprint', status: 'pass', exit_code: 0, active_plan: 'plans/plan-review.md', review_subject_sha256: subject.review_subject_sha256,
    benchmark_evidence: { status: 'not_applicable', report_sha256: 'not-applicable' },
    commands: [{ name: 'fixture-unit-check', status: 'pass', exit_code: 0 }],
    guards: ['contract', 'review', 'allowed_paths', 'change_assessment'].map(name => ({ name, status: 'pass' })),
    contract: { file: contract }, review: { file: 'tasks/reviews/review.review.md' },
    change_assessment: { ...basis, evidence_sha256: 'sha256:' + createHash('sha256').update(canonical(basis)).digest('hex') },
  }));
}

function fixture(mode = 'normal') {
  const root = mkdtempSync(join(tmpdir(), 'rh-claude-session-'));
  const home = mkdtempSync(join(tmpdir(), 'rh-claude-authority-'));
  fixtures.push({ root, home });
  git(root, 'init', '-b', 'main'); git(root, 'config', 'user.name', 'Review Test'); git(root, 'config', 'user.email', 'review@test.invalid');
  for (const dir of ['.ai/harness/checks', 'tasks/contracts', 'tasks/reviews', 'plans']) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, '.gitignore'), '.ai/harness/checks/\n.ai/harness/runs/\nprovider\n');
  writeFileSync(join(root, '.ai/harness/policy.json'), JSON.stringify({ worktree_strategy: { review_base: 'main' }, merge_gate: { enabled: true, rule: 'fixture' } }));
  writeFileSync(join(root, 'source.ts'), 'export const value = 0;\n');
  git(root, 'add', '.'); git(root, 'commit', '-m', 'base'); git(root, 'checkout', '-b', 'codex/review');
  writeFileSync(join(root, 'source.ts'), 'export const value = 1;\n');
  writeFileSync(join(root, contract), '# Review contract\n\n> **Status**: Active\n> **Owner**: Codex\n> **Plan**: plans/plan-review.md\n> **Review File**: tasks/reviews/review.review.md\n\n## Acceptance Policy\n\n```json\n{"protocol":1,"reviewer":"Claude","user_waiver":"forbidden"}\n```\n\n## Change Assessment\n\n```json\n{"protocol":1,"oracles":[]}\n```\n');
  writeFileSync(join(root, 'plans/plan-review.md'), '# Review test\n\n> **Status**: Executing\n');
  writeFileSync(join(root, 'tasks/reviews/review.review.md'), '# Review\n');
  git(root, 'add', '.'); git(root, 'commit', '-m', 'candidate');
  const provider = join(root, 'provider');
  writeFileSync(provider, `#!${process.execPath}\nimport {createInterface} from 'readline';\nimport {writeFileSync} from 'fs';\nlet count=0;\nconst mode=${JSON.stringify(mode)};\nconst reader=createInterface({input:process.stdin});\nreader.on('line',async line=>{\n const message=JSON.parse(line); count++;\n const identity=JSON.parse(message.message.content.match(/Echo this exact identity: (.+)/)[1]);\n if(mode==='hang') return;\n if(mode==='crash') process.exit(2);\n if(mode==='slow') await Bun.sleep(800);\n if(mode==='stale') writeFileSync('source.ts','export const value = 999;\\n');\n const pass=count>1;\n const output={...identity,verdict:pass?'PASS':'FAIL',summary:pass?'Corrected fixture':'Fixture requires repair',findings:[{id:'F1',severity:'P1',status:pass?'resolved':'new',message:'Concrete fixture evidence'}]};\n if(mode==='wrong-session') output.session_id='wrong';
 if(mode==='omit-finding' && pass) output.findings=[];
 if(mode==='wrong-subject') output.subject_sha256='sha256:wrong';
 if(mode==='conflicting-pass') output.verdict='PASS';\n console.log(JSON.stringify({type:'result',subtype:'success',is_error:false,session_id:message.session_id,structured_output:output}));\n});\nreader.on('close',()=>process.exit(0));\n`);
  chmodSync(provider, 0o700);
  prepare(root);
  let admissions = 0;
  return { root, home, options: { repoRoot: root, contract, authorityHome: home, providerCommand: provider,
    timeoutMs: 5000, admitSession: () => { admissions++; } }, admissions: () => admissions };
}

test('same child/session performs two rounds, records real receipt, rejects stale/duplicate subjects and closes precisely', async () => {
  const f = fixture();
  const sentinel = `sentinel-${Date.now()}`;
  execFileSync('tmux', ['-L', 'repo-harness-claude-review', 'new-session', '-d', '-s', sentinel, 'sleep 120']); sentinels.push(sentinel);
  const before = execFileSync('tmux', ['-L', 'repo-harness-claude-review', 'list-panes', '-a', '-F', '#{pane_id} #{pane_pid}'], { encoding: 'utf8' });
  const first = await runClaudeReviewRound(f.options);
  expect(first.status).toBe('rejected');
  await expect(closeClaudeReview(f.options)).rejects.toThrow();
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('duplicate_subject');
  writeFileSync(join(f.root, 'source.ts'), 'export const value = 2;\n'); prepare(f.root);
  const second = await runClaudeReviewRound(f.options);
  expect(second.status).toBe('accepted');
  expect(second.child_pid).toBe(first.child_pid); expect(second.session_id).toBe(first.session_id);
  expect(f.admissions()).toBe(1);
  expect((await verifyAcceptance({ root: f.root, authorityHome: f.home, contract })).subject_sha256).toBe(second.receipt.subject_sha256);
  writeFileSync(join(f.root, 'source.ts'), 'export const value = 3;\n');
  await expect(closeClaudeReview(f.options)).rejects.toThrow('stale');
  writeFileSync(join(f.root, 'source.ts'), 'export const value = 2;\n');
  await closeClaudeReview(f.options);
  for (let i = 0; i < 30; i++) { try { process.kill(second.child_pid, 0); await Bun.sleep(100); } catch { break; } }
  expect(() => process.kill(second.child_pid, 0)).toThrow();
  expect(claudeReviewStatus(f.root, contract).status).toBe('closed');
  const after = execFileSync('tmux', ['-L', 'repo-harness-claude-review', 'list-panes', '-a', '-F', '#{pane_id} #{pane_pid}'], { encoding: 'utf8' });
  for (const line of before.trim().split('\n')) expect(after).toContain(line);
}, 30_000);

test('stale source while reviewer runs cannot write an acceptance receipt or trigger replay', async () => {
  const f = fixture('stale');
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('stale');
  prepare(f.root);
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('ambiguous_round');
  expect(f.admissions()).toBe(1);
  const dir = reviewSessionLocation(f.root, contract).dir;
  expect(existsSync(join(dir, 'accepted-1.json'))).toBe(false);
}, 20_000);

test('explicit cancel cleans the exact detached provider after its host dies', async () => {
  const f = fixture();
  const first = await runClaudeReviewRound(f.options);
  const status = claudeReviewStatus(f.root, contract) as { processes: { host: string } };
  const hostPid = Number(status.processes.host.trim().split(/\s+/)[0]);
  process.kill(hostPid, 'SIGKILL');
  await Bun.sleep(200);
  await closeClaudeReview(f.options, true);
  expect(() => process.kill(first.child_pid, 0)).toThrow();
  expect(claudeReviewStatus(f.root, contract).status).toBe('closed');
}, 20_000);

test.each(['wrong-session', 'wrong-subject', 'conflicting-pass', 'crash', 'hang'])('%s fails closed; explicit cancel remains available', async mode => {
  const f = fixture(mode);
  f.options.timeoutMs = 400;
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow();
  expect(claudeReviewStatus(f.root, contract).status).toBe('interrupted');
  const dir = reviewSessionLocation(f.root, contract).dir;
  expect(existsSync(join(dir, 'accepted-1.json'))).toBe(false);
  await closeClaudeReview(f.options, true);
  expect(claudeReviewStatus(f.root, contract).status).toBe('closed');
}, 20_000);

test('concurrent submission is refused without sending a second provider turn', async () => {
  const f = fixture('slow');
  const running = runClaudeReviewRound(f.options);
  await Bun.sleep(50);
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('exclusive lock');
  await running;
  const dir = reviewSessionLocation(f.root, contract).dir;
  expect(existsSync(join(dir, 'request-2.json'))).toBe(false);
  expect(JSON.parse(readFileSync(join(dir, 'result-1.json'), 'utf8')).structured_output.verdict).toBe('FAIL');
}, 20_000);


test('a continuation must account for prior findings and cannot be replayed after omission', async () => {
  const f = fixture('omit-finding');
  await runClaudeReviewRound(f.options);
  writeFileSync(join(f.root, 'source.ts'), 'export const value = 2;\n'); prepare(f.root);
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('previous_finding_unaddressed');
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('ambiguous_round');
  expect(existsSync(join(reviewSessionLocation(f.root, contract).dir, 'accepted-2.json'))).toBe(false);
}, 20_000);

test('three rounds share one admission and a fourth changed subject is refused', async () => {
  const f = fixture();
  const first = await runClaudeReviewRound(f.options);
  for (let round = 2; round <= 3; round++) {
    writeFileSync(join(f.root, 'source.ts'), `export const value = ${round};\n`); prepare(f.root);
    const result = await runClaudeReviewRound(f.options);
    expect(result.child_pid).toBe(first.child_pid);
    expect(result.round).toBe(round);
  }
  writeFileSync(join(f.root, 'source.ts'), 'export const value = 4;\n'); prepare(f.root);
  await expect(runClaudeReviewRound(f.options)).rejects.toThrow('round_budget_exhausted');
  expect(f.admissions()).toBe(1);
  expect(existsSync(join(reviewSessionLocation(f.root, contract).dir, 'request-4.json'))).toBe(false);
}, 20_000);


test('schema enums reject array coercion instead of accepting malformed provider data', () => {
  const context = { contract_file: contract, contract_sha256: 'contract', goal_sha256: 'goal', subject_sha256: 'subject', verification_evidence_sha256: 'evidence', target_revision: 'target' };
  const request: ClaudeReviewRequest = { round: 1, round_id: 'round', session_id: 'session', context, context_sha256: reviewContextDigest(context), prompt: '', timeout_ms: 1 };
  const output = { round_id: request.round_id, session_id: request.session_id, subject_sha256: context.subject_sha256, context_sha256: request.context_sha256, verdict: 'FAIL', summary: 'Review', findings: [{ id: 'F1', severity: 'P1', status: 'new', message: 'Evidence' }] };
  const event = { type: 'result', subtype: 'success', is_error: false, session_id: request.session_id, structured_output: output };
  expect(validateClaudeReviewResult(event, request).verdict).toBe('FAIL');
  for (const mutate of [
    (value: any) => { value.structured_output.verdict = ['FAIL']; },
    (value: any) => { value.structured_output.findings[0].severity = ['P1']; },
    (value: any) => { value.structured_output.findings[0].status = ['new']; },
  ]) {
    const malformed = structuredClone(event); mutate(malformed);
    expect(() => validateClaudeReviewResult(malformed, request)).toThrow('malformed');
  }
});
