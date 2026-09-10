/**
 * Retention for Stop's per-run summaries under the policy `harness.runs_dir`.
 *
 * `src/cli/hook/stop-handler.ts` writes one `${runId}.json` per Stop and, until
 * this module existed, nothing ever removed it. Its sibling
 * `hook-event-log.ts` already bounds the other unbounded file in the same
 * directory (the rotated hook telemetry log); this bounds the summaries.
 *
 * The bound is a count, not a byte budget: summaries are fixed-shape ~4 KB
 * records, so "how many runs of history" is the honest unit, and it mirrors
 * `HOOK_LOG_ARCHIVE_SEGMENTS` rather than adding a policy surface no second
 * consumer has asked for.
 *
 * The one non-obvious rule is the pin set. `scripts/verify-sprint.sh` freezes a
 * run snapshot at `--prepare-acceptance` and reads that exact file back at
 * finalization through `.run_file` in a checks projection. Both that snapshot
 * and Stop's own summaries live in this directory under the same `run-` prefix,
 * so a filename rule cannot separate them -- only the checks projections can.
 * Deleting a pinned snapshot strands an acceptance with no operator exit, so an
 * unreadable checks projection cancels the whole sweep instead of narrowing the
 * pin set: unbounded growth has a recovery path (`repo-harness run evidence-gc`),
 * a stranded acceptance does not.
 */
import { lstatSync, readdirSync, readFileSync, statSync, unlinkSync, type Dirent } from 'fs';
import { dirname, join } from 'path';
import { resolveInsideRepo } from './path-safety';

/** Runs of Stop history retained beyond the pinned set. */
export const RUN_SUMMARY_RETENTION_COUNT = 200;

export interface RunSummaryRetentionInput {
  readonly repoRoot: string;
  /** Repo-relative, as resolved by the single `harness.runs_dir` reader. */
  readonly runsDir: string;
  /** Repo-relative checks projection file; its directory is the pin source. */
  readonly checksFile: string;
  readonly retain?: number;
  readonly dryRun?: boolean;
}

export interface RunSummaryRetentionResult {
  readonly scanned: number;
  readonly pinned: number;
  readonly retained: number;
  /** Repo-relative paths removed, or that a dry run would remove. */
  readonly removed: readonly string[];
  readonly reclaimedBytes: number;
  /** Entries left alone with the reason, and any abort cause. */
  readonly skipped: readonly string[];
}

const EMPTY: RunSummaryRetentionResult = {
  scanned: 0, pinned: 0, retained: 0, removed: [], reclaimedBytes: 0, skipped: [],
};

function resolveOrThrow(repoRoot: string, relativePath: string): string {
  const result = resolveInsideRepo(repoRoot, relativePath);
  if (!result.ok || !result.path) {
    throw new Error(result.error ?? `invalid run-summary retention path: ${relativePath}`);
  }
  return result.path;
}

/**
 * Every `.run_file` a checks projection currently points at, normalized to the
 * repo-relative form the projections themselves record. Throws when any
 * projection in the directory cannot be read or parsed -- see the module doc.
 */
function pinnedRunFiles(repoRoot: string, checksDir: string): ReadonlySet<string> {
  const pinned = new Set<string>();
  let entries: readonly string[];
  try {
    entries = readdirSync(checksDir).filter(name => name.endsWith('.json'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return pinned;
    throw error;
  }
  for (const name of entries) {
    const path = join(checksDir, name);
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(path, 'utf8'));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`unreadable checks projection cannot prove its run pin: ${name}: ${detail}`);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
    const runFile = (parsed as { run_file?: unknown }).run_file;
    if (typeof runFile !== 'string' || !runFile) continue;
    const normalized = runFile.replace(/\\/g, '/').replace(/^\.\//, '');
    pinned.add(normalized);
    // A projection may record the basename-relative form when it was written
    // from inside the runs directory; pin both readings of the same datum.
    pinned.add(normalized.split('/').pop()!);
  }
  return pinned;
}

interface Candidate {
  readonly name: string;
  readonly relative: string;
  readonly absolute: string;
  readonly mtimeMs: number;
  readonly size: number;
}

/**
 * Removes run summaries outside the pinned set and the newest `retain` entries.
 * Only regular `*.json` files directly inside `runsDir` are ever considered:
 * subdirectories (`bash-output/`, coordination state) and the rotated hook
 * telemetry log own their own lifecycles.
 */
export function sweepRunSummaries(input: RunSummaryRetentionInput): RunSummaryRetentionResult {
  const retain = input.retain ?? RUN_SUMMARY_RETENTION_COUNT;
  if (retain < 0) throw new Error('run summary retention count must not be negative');
  const runsDir = resolveOrThrow(input.repoRoot, input.runsDir);
  const checksDir = resolveOrThrow(input.repoRoot, dirname(input.checksFile));

  let names: readonly string[];
  try {
    names = readdirSync(runsDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return EMPTY;
    throw error;
  }

  const pinned = pinnedRunFiles(input.repoRoot, checksDir);
  const skipped: string[] = [];
  const candidates: Candidate[] = [];
  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    const absolute = join(runsDir, name);
    let entry;
    try {
      entry = lstatSync(absolute);
    } catch {
      // Another writer removed it between readdir and stat; nothing to reclaim.
      continue;
    }
    if (!entry.isFile()) {
      skipped.push(`${name}: not a regular file`);
      continue;
    }
    candidates.push({
      name,
      relative: `${input.runsDir}/${name}`,
      absolute,
      mtimeMs: entry.mtimeMs,
      size: entry.size,
    });
  }

  const live = candidates.filter(c => pinned.has(c.relative) || pinned.has(c.name));
  const prunable = candidates
    .filter(c => !pinned.has(c.relative) && !pinned.has(c.name))
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  const obsolete = prunable.slice(retain);
  const removed: string[] = [];
  let reclaimedBytes = 0;
  for (const candidate of obsolete) {
    if (input.dryRun) {
      removed.push(candidate.relative);
      reclaimedBytes += candidate.size;
      continue;
    }
    try {
      // Re-stat under the same no-follow rule the scan used: a symlink swapped
      // in after the scan must not authorize an unlink outside the runs tree.
      const current = lstatSync(candidate.absolute);
      if (!current.isFile()) {
        skipped.push(`${candidate.name}: not a regular file`);
        continue;
      }
      unlinkSync(candidate.absolute);
      removed.push(candidate.relative);
      reclaimedBytes += candidate.size;
    } catch (error) {
      skipped.push(`${candidate.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    scanned: candidates.length,
    pinned: live.length,
    retained: candidates.length - removed.length,
    removed,
    reclaimedBytes,
    skipped,
  };
}

/** Bytes currently held by a checkpoint directory, for gc reporting only. */
export function directoryBytes(path: string): number {
  let total = 0;
  let entries: readonly Dirent[];
  try {
    entries = readdirSync(path, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) { total += directoryBytes(child); continue; }
    if (!entry.isFile()) continue;
    try { total += statSync(child).size; } catch { /* removed mid-scan */ }
  }
  return total;
}
