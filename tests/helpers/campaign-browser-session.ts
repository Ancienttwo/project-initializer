import { createHash } from 'crypto';
import historyFixture from '../fixtures/campaign-revision-evidence/history.json';
import type { BrowserSessionMeta, BrowserSessionStatus } from '../../src/cli/chatgpt-browser/types';
import { readCampaignBrowserSessionEvidence } from '../../src/core/automation/campaign-browser-session';
export function campaignBrowserMetadata(input: { repoRoot: string; sessionId: string; profileDir: string; profileDirectory: string; sourceSessionId?: string; status?: BrowserSessionStatus }): BrowserSessionMeta {
  const at = '2026-09-05T00:00:00.000Z';
  const providerId = `oracle-${input.sessionId}`;
  const parent = input.sourceSessionId ? `oracle-${input.sourceSessionId}` : undefined;
  const history = structuredClone(historyFixture);
  const body = JSON.parse(history.response.body.replaceAll('connector_76869538009648d5b282a4bb21c3d157', 'github'));
  body.messages[0].content.parts = ['@github connector fixture request'];
  history.response.body = JSON.stringify(body);
  history.response.decodedBodySha256 = createHash('sha256').update(history.response.body).digest('hex');
  return {
    version: 1, engine: 'chatgpt-browser', provider: 'oracle', repo: input.repoRoot, sessionId: input.sessionId,
    status: input.status ?? 'completed', createdAt: at, updatedAt: at, model: { verified: false },
    providerSessionId: providerId, ...(input.sourceSessionId ? { sourceSessionId: input.sourceSessionId, parentProviderSessionId: parent } : {}),
    browser: { mode: 'manual-login', transport: 'copy_profile', chatgptUrl: 'https://chatgpt.com/', profileDir: input.profileDir, profileDirectory: input.profileDirectory },
    oracle: { conversationCapture: { status: 'captured', sessionId: providerId, conversationId: history.conversationId, sha256: 'sha256:' + 'f'.repeat(64), history }, observation: { source: 'oracle-session-metadata', sessionId: providerId, parentSessionId: parent ?? null } },
    input: { promptPath: 'prompt.md', files: [], followups: 0 }, output: { outputPath: 'output.md', transcriptPath: 'transcript.md', artifactsDir: 'artifacts', artifacts: [] },
    diagnostics: { dryRun: false, reattachable: false, lastCaptureAt: at },
  };
}
export function campaignSessionEvidence(sessionId: string, sourceSessionId: string | null = null, repoRoot = '/repo', profileDir = '/profiles', profileDirectory = 'Profile 1') {
  const meta = campaignBrowserMetadata({ sessionId, repoRoot, profileDir, profileDirectory, ...(sourceSessionId ? { sourceSessionId } : {}) });
  return readCampaignBrowserSessionEvidence({ sessionId, status: 'completed', meta }, { repoRoot, profileDir, profileDirectory, sourceSessionId, parentProviderSessionId: sourceSessionId ? `oracle-${sourceSessionId}` : null })!;
}
