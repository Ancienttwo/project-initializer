> **Archived**: 2026-09-08 19:29
> **Related Plan**: plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-1929
> **Archive Projection V1**: `plans/plan-20260908-1851-worktree-cleanup-closeout.md` => `plans/archive/plan-20260908-1851-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/notes/20260908-1851-worktree-cleanup-closeout.notes.md` => `tasks/archive/notes-20260908-1929-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1851-worktree-cleanup-closeout.contract.md` => `tasks/archive/contract-20260908-1929-worktree-cleanup-closeout.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1851-worktree-cleanup-closeout.review.md` => `tasks/archive/review-20260908-1929-worktree-cleanup-closeout.md`

# Worktree cleanup closeout decisions

- Publication is committed before cleanup. A cleanup refusal returns 1 but preserves the merged outcome and SHA; the recovery action is the existing single-slug cleanup command.
- Batch items run in an unguarded subshell with errexit restored. An if/OR-wrapped subshell would suppress errexit inside existing scaffold-discard helpers and could continue after a failed mutation; the parent captures status with errexit temporarily disabled.
- Locks are checked before scaffold handling and in single cleanup, including dry-run. Unreadable batch status is retained, not advertised as cleanable. Existing single-cleanup gitdir repair remains intact.
- No dependency or product abstraction added. The plan, contract, review and notes are required workflow artifacts for this separately verifiable slice; product changes stay in existing files and mirrored templates.
- Pre-fix evidence: .ai/harness/runs/worktree-cleanup-closeout-red.log, 9 fail / 0 pass, PRE_FIX_EXIT=1. The locked-finish fixture published its feature but returned 0, while dirty/locked batch fixtures failed continuation/reporting assertions.
- Development verification: initial corrected behavior exposed an assertion detail (Git show-ref without --quiet returns 128 for missing refs); use --quiet to assert the documented presence/absence exit convention. No product logic changed for that test correction.
- Final verification uses the contract's named focused tests and six repository integrity checks; no full suite, remote action or historical worktree deletion.


- Review correction: clean-but-locked worktrees now appear as retained with a locked reason in SessionStart. The new fixture failed before the classification change and passed after it; .ai/harness/runs/worktree-cleanup-session-lock-{red,green}.log. Updated the obsolete whole-batch-abort comment.
- The existing publication failure fixture now expects nonzero incomplete closeout and checks the published SHA; its old exit-0 assertion was the retired behavior, not a product regression.

> **Substantive Change SHA256**: `sha256:65d7b64cae6ef8366fc42f7b1f1eb64feb9998478d85e463c5ae22e219805bed`

## Verified implementation and remaining closeout

- Final prepared verification: `.ai/harness/runs/run-20260908T191439-43791-20260908-1851-worktree-cleanup-closeout.json`, status pass, 12/12 executable checks and 25/25 total contract assertions. Formal Codex acceptance receipt recorded with subject `sha256:fca7ab4d2aaf956bcdd6deefd8bbcf6deff541a8325827ed7afc2a18193aa2a0` and target `ba09b548842790dab66cdcfbebcf4003816f249e`.
- During execution origin/main advanced through PR #361 in separate campaign runtime paths. The cleanup source subject stayed identical; the final prepare binds the refreshed target. Earlier passes remain evidence only for their recorded target.
- `contract-worktree finish --no-merge` refused because local main is a1393e44 while origin/main is ba09b548. Selecting the remote gate base did not waive the verifier's recorded-base synchronization rule; it also refused with `base_ref_unsynchronized`.
- The primary worktree has unrelated uncommitted architecture projection changes. This plan excludes merging and historical cleanup; do not overwrite that WIP or bypass the gate. Implementation and acceptance are complete; workflow archival remains pending main synchronization. Task worktree and branch are intentionally retained, with no remote push or release.

## Approved synchronization and local integration

- Owner approved main synchronization and this task's closeout after the prior blocker report. The primary manifest's exact bytes are preserved at local ref `codex/preserve-main-projection-20260908`, commit `8d0e9127ac5b1c0189245d03bbe9395eb70bb946`, blob `e4e2c576f56f0f256150160713154af199680d61`; readback matched the original bytes before restoring the primary tracked file.
- Primary main fast-forwarded from a1393e44 to ba09b548 and was clean. Integrated ba09b548 into this task; the only conflict was the generated architecture manifest, resolved to upstream before canonical regeneration. All cleanup implementation and regression file bytes are unchanged.
- Existing red/green evidence and semantic review remain valid for unchanged cleanup code; final integration verification refreshes the target and required integrity evidence. This supersedes the former no-merge scope only for this task; no remote push/release or historical batch cleanup.

- Integration run at 2937544f passed all four test groups. Updating the substantive digest note while later checks ran invalidated their snapshot evidence; their exit codes were 0 but the overall run remains failed. Freeze now includes the corrected note. Retain the four successful immutable test executions with source-byte parity plus current integrity checks, as declared in the contract; do not relabel the failed run or rerun unchanged tests.
