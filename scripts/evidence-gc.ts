#!/usr/bin/env bun
/**
 * Reclaim obsolete harness evidence in a repository the Stop path can no longer
 * heal on its own.
 *
 * Both classes this command touches already have a retention owner that runs
 * automatically: `checkpoint-store.ts` prunes superseded checkpoints inside every
 * successful publish, and `run-summary-retention.ts` bounds Stop's summaries on
 * every Stop. This command exists for the repositories those owners never reach
 * -- a worktree whose ledger is gone (publication quietly skips), a repository
 * that stopped running the harness, or an operator who wants the space back now
 * rather than at the next Stop. It applies the same policies, never its own.
 */
import { readdirSync } from "fs";
import { basename, dirname, join, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";

type CheckpointStoreModule = typeof import("../src/effects/evidence/checkpoint-store");
type RunSummaryRetentionModule = typeof import("../src/effects/run-summary-retention");
type RecoveryMaterializerModule = typeof import("../src/effects/evidence/recovery-materializer");

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = basename(SCRIPT_DIR) === "helpers"
  && basename(dirname(SCRIPT_DIR)) === "templates"
  && basename(dirname(dirname(SCRIPT_DIR))) === "assets"
  ? resolve(SCRIPT_DIR, "../../..")
  : resolve(SCRIPT_DIR, "..");

async function load<T>(...segments: readonly string[]): Promise<T> {
  return await import(pathToFileURL(join(PACKAGE_ROOT, ...segments)).href) as T;
}

function usage(): string {
  return [
    "usage: evidence-gc.ts [--repo <path>] [--dry-run] [--format text|json]",
    "",
    "Removes superseded evidence checkpoints and Stop run summaries beyond the",
    "retention bound. Only Stop's own summaries are ever removed; acceptance",
    "snapshots and verification execution records are left to their owners.",
  ].join("\n");
}

function parseArgs(argv: readonly string[]): { repo: string; dryRun: boolean; format: "text" | "json" } {
  let repo = process.cwd();
  let dryRun = false;
  let format: "text" | "json" = "text";
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]!;
    if (arg === "--dry-run") { dryRun = true; continue; }
    if (arg === "--repo" || arg === "--format") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      if (arg === "--repo") repo = value;
      else {
        if (value !== "text" && value !== "json") throw new Error("--format accepts text or json");
        format = value;
      }
      index++;
      continue;
    }
    throw new Error(`unexpected argument: ${arg}`);
  }
  return { repo: resolve(repo), dryRun, format };
}

/**
 * Bytes held by checkpoint directories the current marker does not name. The
 * naming rule comes from the store itself; only the "how much" is local. This
 * remains a reporting upper bound: the store additionally leaves any directory
 * holding an unexpected child, so a dry run may name more than a prune reclaims.
 */
function supersededCheckpoints(
  checkpointsDir: string,
  currentId: string | null,
  isCheckpointDirectoryName: (name: string) => boolean,
  sizeOf: (path: string) => number,
): { count: number; bytes: number } {
  let count = 0;
  let bytes = 0;
  let entries: readonly string[];
  try {
    entries = readdirSync(checkpointsDir);
  } catch {
    return { count, bytes };
  }
  for (const name of entries) {
    if (name === currentId || !isCheckpointDirectoryName(name)) continue;
    count++;
    bytes += sizeOf(join(checkpointsDir, name));
  }
  return { count, bytes };
}

function human(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
  return `${value.toFixed(1)} ${units[unit]}`;
}

async function main(argv: readonly string[]): Promise<number> {
  let options: ReturnType<typeof parseArgs>;
  try {
    options = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`evidence-gc: ${error instanceof Error ? error.message : String(error)}\n${usage()}\n`);
    return 2;
  }

  const checkpointStore = await load<CheckpointStoreModule>("src", "effects", "evidence", "checkpoint-store.ts");
  const retention = await load<RunSummaryRetentionModule>("src", "effects", "run-summary-retention.ts");
  const recovery = await load<RecoveryMaterializerModule>("src", "effects", "evidence", "recovery-materializer.ts");

  const errors: string[] = [];

  // Reuse the single `harness.runs_dir` reader rather than adding a second
  // policy reading of the same datum.
  const paths = recovery.buildRecoveryContext(options.repo, null, process.env).paths;

  const checkpointsDir = checkpointStore.resolveCheckpointsDir(options.repo);
  const before = retention.directoryBytes(checkpointsDir);
  let checkpointsRemoved = 0;
  let checkpointBytes = 0;
  try {
    if (options.dryRun) {
      const current = checkpointStore.resolveLastPublishedCheckpoint(options.repo);
      // A missing marker keeps every checkpoint: the store refuses to delete the
      // last durable copy when it cannot prove which one is live.
      if (current.found) {
        const superseded = supersededCheckpoints(
          checkpointsDir,
          current.resolved.checkpointId,
          checkpointStore.isCheckpointDirectoryName,
          retention.directoryBytes,
        );
        checkpointsRemoved = superseded.count;
        checkpointBytes = superseded.bytes;
      }
    } else {
      const result = checkpointStore.pruneCheckpointCache(options.repo);
      checkpointsRemoved = result.removed;
      checkpointBytes = Math.max(0, before - retention.directoryBytes(checkpointsDir));
      for (const entry of result.skipped) errors.push(`checkpoint ${entry}`);
    }
  } catch (error) {
    errors.push(`checkpoints: ${error instanceof Error ? error.message : String(error)}`);
  }

  let summaries: Awaited<ReturnType<RunSummaryRetentionModule["sweepRunSummaries"]>> | null = null;
  try {
    summaries = retention.sweepRunSummaries({
      repoRoot: options.repo,
      runsDir: paths.runsDir,
      dryRun: options.dryRun,
    });
    for (const entry of summaries.skipped) errors.push(`run summary ${entry}`);
  } catch (error) {
    errors.push(`run summaries: ${error instanceof Error ? error.message : String(error)}`);
  }

  const reclaimed = checkpointBytes + (summaries?.reclaimedBytes ?? 0);
  const report = {
    repo: options.repo,
    dry_run: options.dryRun,
    checkpoints: { removed: checkpointsRemoved, reclaimed_bytes: checkpointBytes },
    run_summaries: {
      scanned: summaries?.scanned ?? 0,
      foreign: summaries?.foreign ?? 0,
      removed: summaries?.removed.length ?? 0,
      reclaimed_bytes: summaries?.reclaimedBytes ?? 0,
      retention_count: retention.RUN_SUMMARY_RETENTION_COUNT,
    },
    reclaimed_bytes: reclaimed,
    errors,
  };

  if (options.format === "json") {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    const verb = options.dryRun ? "reclaimable" : "reclaimed";
    process.stdout.write([
      `evidence-gc ${options.repo}${options.dryRun ? " (dry run)" : ""}`,
      `  checkpoints:   ${checkpointsRemoved} ${options.dryRun ? "superseded" : "removed"}, ${human(checkpointBytes)} ${verb}`,
      `  run summaries: ${summaries?.removed.length ?? 0} of ${summaries?.scanned ?? 0} removed `
        + `(newest ${retention.RUN_SUMMARY_RETENTION_COUNT} kept; `
        + `${summaries?.foreign ?? 0} non-Stop records left to their own owners), `
        + `${human(summaries?.reclaimedBytes ?? 0)} ${verb}`,
      `  total:         ${human(reclaimed)} ${verb}`,
      ...errors.map((entry) => `  ! ${entry}`),
    ].join("\n") + "\n");
  }

  return errors.length > 0 ? 1 : 0;
}

process.exit(await main(process.argv.slice(2)));
