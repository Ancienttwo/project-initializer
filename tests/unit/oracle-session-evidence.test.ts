import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { readOracleSessionEvidence } from '../../src/cli/chatgpt-browser/oracle-session-evidence';
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
