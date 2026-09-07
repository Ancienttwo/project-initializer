import type { BrowserSessionMeta, BrowserSessionStatus } from '../../src/cli/chatgpt-browser/types';
import { readCampaignBrowserSessionEvidence } from '../../src/core/automation/campaign-browser-session';
export function campaignBrowserMetadata(input: { repoRoot: string; sessionId: string; profileDir: string; profileDirectory: string; sourceSessionId?: string; status?: BrowserSessionStatus }): BrowserSessionMeta {
  const at = '2026-09-05T00:00:00.000Z';
  const providerId = `oracle-${input.sessionId}`;
  const parent = input.sourceSessionId ? `oracle-${input.sourceSessionId}` : undefined;
  return {
    version: 1, engine: 'chatgpt-browser', provider: 'oracle', repo: input.repoRoot, sessionId: input.sessionId,
    status: input.status ?? 'completed', createdAt: at, updatedAt: at, model: { verified: false },
    providerSessionId: providerId, ...(input.sourceSessionId ? { sourceSessionId: input.sourceSessionId, parentProviderSessionId: parent } : {}),
    browser: { mode: 'manual-login', transport: 'copy_profile', chatgptUrl: 'https://chatgpt.com/', chatgptApp: 'GitHub', profileDir: input.profileDir, profileDirectory: input.profileDirectory },
    oracle: { observation: { source: 'oracle-session-metadata', sessionId: providerId, parentSessionId: parent ?? null,
      appSelection: { status: 'selected', app: 'GitHub', pluginId: 'plugin:github', source: 'chatgpt-composer-pill', capturedAt: at } } },
    input: { promptPath: 'prompt.md', files: [], followups: 0 }, output: { outputPath: 'output.md', transcriptPath: 'transcript.md', artifactsDir: 'artifacts', artifacts: [] },
    diagnostics: { dryRun: false, reattachable: false, lastCaptureAt: at },
  };
}
export function campaignSessionEvidence(sessionId: string, sourceSessionId: string | null = null, repoRoot = '/repo', profileDir = '/profiles', profileDirectory = 'Profile 1') {
  const meta = campaignBrowserMetadata({ sessionId, repoRoot, profileDir, profileDirectory, ...(sourceSessionId ? { sourceSessionId } : {}) });
  return readCampaignBrowserSessionEvidence({ sessionId, status: 'completed', meta }, { repoRoot, profileDir, profileDirectory, sourceSessionId, parentProviderSessionId: sourceSessionId ? `oracle-${sourceSessionId}` : null })!;
}
