# Notes: evidence-gc-retention

## Why the pin set exists

The obvious retention rule for `.ai/harness/runs/*.json` is "keep the newest N".
That rule is wrong here, and the reason is not visible from the runs directory.

`scripts/verify-sprint.sh:1009` writes a frozen acceptance snapshot into the same
directory that `stop-handler.ts:436` writes Stop summaries into, and lines
913-937 read that exact file back at finalization through `.run_file` in a checks
projection. Both filenames start with `run-`, so no filename rule separates the
frozen snapshot from disposable Stop history. Deleting the snapshot leaves an
acceptance that cannot finalize and has no operator exit.

The asymmetry decides the failure mode: unbounded growth has a recovery path
(`repo-harness run evidence-gc`), a stranded acceptance does not. So an
unreadable checks projection cancels the whole sweep rather than narrowing the
pin set.

## Why the sweep is fail-open at the Stop call site but fail-closed in the helper

Stop already treats checkpoint publication as best-effort for the same reason:
reclaiming disk must never be the thing that fails a Stop. The helper is
operator-invoked, so it reports and exits non-zero instead.

## Deviation from the plan

The plan placed the module at `src/effects/harness/run-summary-retention.ts`.
It landed at `src/effects/run-summary-retention.ts`, next to `hook-event-log.ts`
-- the module that already owns retention for the other unbounded file in the
same directory. A new `harness/` directory would have separated the two owners
of one surface for no gain.

## Open question

`runs/hook-events.jsonl.archive` holds up to 256 MB per repository and was
measured at 216 MB here. That is the declared bound working as designed, and the
operator decided this round not to change it. Revisit only if per-repository
telemetry retention becomes a real cost across many repositories.

> **Substantive Change SHA256**: `sha256:3a6be62693421c5b443d265115b07f2531dbe1aaae0ab36e5f34069db4572feb`
