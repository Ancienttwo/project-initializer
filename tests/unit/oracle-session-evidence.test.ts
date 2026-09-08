import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, truncateSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { readOracleSessionEvidence, readOracleNetworkCapture } from '../../src/cli/chatgpt-browser/oracle-session-evidence';
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture(overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), 'oracle-evidence-')); roots.push(root);
  const path = join(root, 'handle.json');
  mkdirSync(join(root, 'sessions', 'allocated-2'), { recursive: true });
  writeFileSync(path, JSON.stringify({ protocol: 1, kind: 'oracle-session', sessionId: 'allocated-2', parentSessionId: null, ...overrides }));
  writeFileSync(join(root, 'sessions', 'allocated-2', 'meta.json'), JSON.stringify({ id: 'allocated-2', browser: { modelSelection: { strategy: 'current', resolvedLabel: '6 Pro', verified: false }, appSelection: { status: 'selected', app: 'GitHub', pluginId: 'plugin:real' } } }));
  return { root, path };
}
test('reads allocated session and observations without deriving backend verification', () => {
  const f = fixture();
  const result = readOracleSessionEvidence(f.path, f.root);
  expect(result.providerSessionId).toBe('allocated-2');
  expect(result.observation?.modelSelection).toMatchObject({ strategy: 'current', verified: false });
  expect(result).not.toHaveProperty('verified');
});
test.each([{ sessionId: '../escape' }, { parentSessionId: 'foreign' }, { protocol: 2 }, { extra: true }])('rejects malformed or misbound handles %j', overrides => {
  const f = fixture(overrides);
  expect(readOracleSessionEvidence(f.path, f.root).providerSessionId).toBeUndefined();
});
test('rejects wrong-session metadata and missing descriptor', () => {
  const f = fixture();
  writeFileSync(join(f.root, 'sessions', 'allocated-2', 'meta.json'), JSON.stringify({ id: 'another' }));
  expect(readOracleSessionEvidence(f.path, f.root).evidenceError).toContain('mismatch');
  expect(readOracleSessionEvidence(join(f.root, 'missing'), f.root).providerSessionId).toBeUndefined();
});

test('projects the exact descriptor parent for a followup', () => {
  const f = fixture({ parentSessionId: 'source-provider' });
  expect(readOracleSessionEvidence(f.path, f.root, 'source-provider').observation?.parentSessionId).toBe('source-provider');
  expect(readOracleSessionEvidence(f.path, f.root, 'foreign-provider').providerSessionId).toBeUndefined();
});

function traceFixture(status = 'captured', sessionId = 'allocated-2') {
  const f = fixture(); const path = join(f.root, 'trace.jsonl');
  const records = [
    { sequence: 1, event: 'capture_start', protocol: 1, kind: 'oracle-page-response-streams', sessionId, origin: 'https://chatgpt.com' },
    { sequence: 2, event: 'capture_end', status, streams: status === 'empty' ? 0 : 1, reasons: status === 'incomplete' ? ['stream_open'] : [] },
  ];
  writeFileSync(path, records.map(r => JSON.stringify(r)).join('\n') + '\n', { mode: 0o600 }); return { ...f, path };
}
test.each(['captured', 'empty', 'incomplete'])('retains raw transport %s without claiming revision evidence', status => {
  const f = traceFixture(status); const r = readOracleNetworkCapture(f.path, 'allocated-2', 'https://chatgpt.com');
  expect(r.status).toBe(status); expect(r.sessionId).toBe('allocated-2'); expect(r.sha256).toMatch(/^sha256:[a-f0-9]{64}$/); expect(r.bytes).toBeGreaterThan(0);
  expect(r).not.toHaveProperty('resolved_commit'); expect(r).not.toHaveProperty('verified');
});
test('capture rejects foreign or absent descriptor, malformed bytes, symlink and oversized files', () => {
  const f = traceFixture();
  expect(readOracleNetworkCapture(f.path, 'foreign', 'https://chatgpt.com').status).toBe('invalid');
  expect(readOracleNetworkCapture(f.path, undefined, 'https://chatgpt.com').status).toBe('invalid');
  expect(readOracleNetworkCapture(f.path, 'allocated-2', 'https://foreign.example').status).toBe('invalid');
  const link = join(f.root, 'link'); symlinkSync(f.path, link);
  expect(readOracleNetworkCapture(link, 'allocated-2', 'https://chatgpt.com').status).toBe('invalid');
  writeFileSync(f.path, '{truncated'); expect(readOracleNetworkCapture(f.path, 'allocated-2', 'https://chatgpt.com').status).toBe('invalid');
  truncateSync(f.path, 64 * 1024 * 1024 + 1); expect(readOracleNetworkCapture(f.path, 'allocated-2', 'https://chatgpt.com').sha256).toBeNull();
  expect(readOracleNetworkCapture(join(f.root, 'missing'), 'allocated-2', 'https://chatgpt.com').status).toBe('missing');
});
