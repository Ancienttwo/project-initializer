import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { parseCodexExecStructuredOutput } from '../../src/effects/collaboration/provider-output-adapter';
import { createHash } from 'crypto';
import { parseCampaignVerifierResponse } from '../../src/effects/automation/campaign-runtime';
import { canonicalMessageDigest } from '../../src/core/messages/mechanics';

const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
const start = { type: 'thread.started', thread_id: 'provider-thread' };
const message = { type: 'item.completed', item: { id: 'message', type: 'agent_message', text: 'Finished.' } };
const terminal = { type: 'turn.completed', usage: { input_tokens: 10, cached_input_tokens: 0, output_tokens: 2 } };
const stream = (events: unknown[]) => events.map(event => JSON.stringify(event)).join('\n');

test('Codex terminal identity comes from the ordered provider event', () => {
  const result = parseCodexExecStructuredOutput(stream([start, message, terminal]));
  expect(result.thread_id).toBe('provider-thread');
  expect(result.terminal_event_sha256).toBe(canonicalMessageDigest({ event: terminal }));
  expect(result.operation_types).toEqual(['agent_message']);
});

test('a provider completion cannot conceal an outstanding operation', () => {
  expect(() => parseCodexExecStructuredOutput(stream([start,
    { type: 'item.started', item: { id: 'running-tool', type: 'command_execution', status: 'in_progress' } },
    message, terminal]))).toThrow('leaves an operation active');
});

test('unknown top-level provider operations cannot disappear from terminal evidence', () => {
  expect(() => parseCodexExecStructuredOutput(stream([start,
    { type: 'remote.operation.started', operation_id: 'unobserved' }, message, terminal])))
    .toThrow('unknown Codex event');
});

test('provider terminal requires ordered start and final completion with no failed turn', () => {
  for (const events of [[terminal, message, start], [start, terminal, message],
    [start, { type: 'turn.failed', error: { message: 'connection lost' } }, message, terminal]]) {
    expect(() => parseCodexExecStructuredOutput(stream(events))).toThrow('ordered successful Codex turn');
  }
});

test('operation completion needs an identity and cannot retain in-progress state', () => {
  expect(() => parseCodexExecStructuredOutput(stream([start,
    { type: 'item.completed', item: { type: 'command_execution' } }, message, terminal])))
    .toThrow('unidentified Codex operation');
  expect(() => parseCodexExecStructuredOutput(stream([start,
    { type: 'item.completed', item: { id: 'tool', type: 'command_execution', status: 'in_progress' } }, message, terminal])))
    .toThrow('completes an active operation');
});

test('bounded supervisor preserves provider stdout separately from diagnostic stderr', () => {
  const root = mkdtempSync(join(tmpdir(), 'brc10-provider-stream-')); roots.push(root);
  const stdout = join(root, 'stdout'); const stderr = join(root, 'stderr'); const result = join(root, 'result.json');
  const payload = stream([start, message, terminal]);
  const code = `process.stdout.write(${JSON.stringify(payload)}); process.stderr.write('provider diagnostic\\n');`;
  const child = Bun.spawnSync([process.execPath, join(import.meta.dir, '../../scripts/run-bounded-verifier-command.ts'),
    '--deadline-ms', String(Date.now() + 10_000), '--log', stdout, '--stderr-log', stderr, '--result', result,
    '--', process.execPath, '-e', code]);
  expect(child.exitCode, new TextDecoder().decode(child.stderr)).toBe(0);
  const proof = JSON.parse(readFileSync(result, 'utf8'));
  expect(proof.output_complete).toBe(true);
  expect(proof.output_sha256.stdout).toBe(`sha256:${createHash('sha256').update(payload).digest('hex')}`);
  expect(readFileSync(stdout, 'utf8')).toBe(payload);
  expect(readFileSync(stderr, 'utf8')).toBe('provider diagnostic\n');
  expect(parseCodexExecStructuredOutput(readFileSync(stdout, 'utf8')).thread_id).toBe('provider-thread');
  expect(JSON.parse(readFileSync(result, 'utf8')).process_group_quiescence).toEqual(process.platform === 'win32'
    ? { scope: 'unsupported', state: 'unknown' } : { scope: 'posix_process_group', state: 'quiescent' });
}, 15_000);

test('verifier authority is an explicit closed response, never an exit code or prose heuristic', () => {
  expect(parseCampaignVerifierResponse('{"verdict":"fail","review":"Criterion missing"}').verdict).toBe('fail');
  for (const value of ['PASS', '{}', '{"verdict":"pass","review":""}', '{"verdict":"approved","review":"ok"}', '{"verdict":"pass","review":"ok","extra":true}']) {
    expect(() => parseCampaignVerifierResponse(value)).toThrow();
  }
});
