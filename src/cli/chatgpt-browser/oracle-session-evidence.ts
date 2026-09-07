import { lstatSync, readFileSync } from 'fs';
import { join } from 'path';

export interface OracleSessionEvidence {
  providerSessionId?: string;
  observation?: {
    source: 'oracle-session-metadata';
    sessionId: string;
    parentSessionId: string | null;
    modelSelection?: unknown;
    appSelection?: unknown;
    thinkingSelection?: unknown;
  };
  evidenceError?: string;
}

function readJson(path: string): Record<string, unknown> {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1024 * 1024) throw new Error('invalid evidence file');
  const value: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid evidence object');
  return value as Record<string, unknown>;
}

/** The invocation owns the descriptor path; console output never supplies session identity. */
export function readOracleSessionEvidence(path: string, oracleHome: string, parentSessionId?: string): OracleSessionEvidence {
  try {
    const handle = readJson(path);
    if (handle.protocol !== 1 || handle.kind !== 'oracle-session'
      || typeof handle.sessionId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(handle.sessionId)
      || handle.parentSessionId !== (parentSessionId ?? null)
      || Object.keys(handle).some(key => !['protocol', 'kind', 'sessionId', 'parentSessionId'].includes(key))) throw new Error('invalid session descriptor');
    const metadata = readJson(join(oracleHome, 'sessions', handle.sessionId, 'meta.json'));
    if (metadata.id !== handle.sessionId) throw new Error('session metadata identity mismatch');
    const browser = metadata.browser;
    const observation = browser && typeof browser === 'object' && !Array.isArray(browser) ? browser as Record<string, unknown> : {};
    return {
      providerSessionId: handle.sessionId,
      observation: {
        source: 'oracle-session-metadata', sessionId: handle.sessionId, parentSessionId: handle.parentSessionId as string | null,
        modelSelection: observation.modelSelection,
        appSelection: observation.appSelection,
        thinkingSelection: observation.thinkingSelection,
      },
    };
  } catch (error) {
    return { evidenceError: error instanceof Error ? error.message : String(error) };
  }
}
