# Plan: Resume bounded architecture drift delivery

> **Status**: Complete
> **Substantive Change SHA256**: `sha256:bab85e5b78a375c3daaca27b153443f069b23e8aefa4c0a0f98caca8c378c601`
> **Created**: 20260908-2331
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Interrupted Stop and manual drain resume without losing backlog
> **Rollback Surface**: Architecture drift state and two drain callers

## Goal
Resume legacy architecture drift after a bounded Stop deadline without discarding committed backlog or replaying completed paths.

## Scope
Architecture drift state, Stop and manual drain callers, focused regressions, and durable architecture documentation. Preserve configured archctx behavior and the existing tracked model. No provider adoption, cursor reset, release, or downstream repository mutation.

## P1 / P2 / P3
Stop and manual drain compute git cursor-to-HEAD plus worktree paths, then run the disabled-provider cascade sequentially. Cursor advancement occurs only after the entire loop, so timeout restarts at the first path. Persist a frozen pending batch and acknowledge each completed cascade under the existing directory lock. Advance only to that batch's HEAD after completion. Later commits remain in the next git range. Failure retains the current item; at 10x scale throughput remains bounded by subprocess cost but retries make forward progress. Do not add a batch CLI or semantic priority classifier.

## Task Breakdown
- [x] Reproduce repeated Stop starvation with deterministic budget and real helper subprocesses.
- [x] Persist resumable cascade progress shared by Stop and manual drain; cover interruption, new commits, malformed state and cursor changes.
- [x] Run focused drift, Stop, projection and mutation tests plus required repository integrity checks; document the retry contract and inspect the final diff.

## Verification
Use named focused tests and the six root integrity checks. No full suite: the affected surface is the drift delivery state and its two callers. Verify the old implementation fails the new starvation regression.

## Failure and rollback
Keep Git cursor acknowledgement separate from per-path completion. Never delete backlog or synthesize architecture output. Revert the source change to roll back; pending state is ignored by the former implementation and the unchanged cursor permits replay.

## Interfaces and dependencies
One ignored versioned pending-batch state file, using existing directory locking. No public settings, external dependencies, API keys or provider changes. Fragile assumption: each path's complete cascade is an acknowledgement; interrupted path may repeat. Phases are sequential and one isolated WT owns the fix.

## Acceptance Notes

- Base: `46405ed9`; isolated `codex/architecture-drift-resume` worktree. Current upstream model is tracked and policy already selects archctx; no model deletion or downstream adoption was performed.
- Root Cause Evidence — symptom: repeated bounded Stop never reaches the source-file tail; trigger: more per-path cascade work than the 20-second deadline; cause: cursor acknowledgement followed the entire loop without durable partial progress; proof: the new Stop regression failed before the fix with three `a.test.ts` deliveries instead of `a.test.ts`, `b.test.ts`, `z-source.ts`.
- Focused baseline: drift, Stop, restamp publication, projection orchestration/provider and mutation-observed tests: 141 pass, 0 fail (26.07s). After exclusive temporary-file writes and the CLI regression were added, drift and Stop delta coverage: 54 pass, 0 fail (9.62s). TypeScript `tsc --noEmit`: pass. No full-suite requirement or uncovered cross-module integration risk was observed.
- The 1592-path deterministic-budget regression converged in 80 windows with no completed-path replay. The real source CLI regression verifies a failed helper produces exit 1, retry produces exit 0 and disabled-provider JSON, and only the failed path repeats.
- Quick check review: both per-path drain callers now use the same locked progress owner; no additional loop sites found. Interrupted follow-ups remain unacknowledged; a newer Git cursor cannot be rewound by the pending batch. No new dependency or production source file. The shared helper protects two actual consumers; its ignored pending-state file is required for restart continuity. This plan records acceptance; the durable invariant is in architecture docs and tasks/lessons.md.
- Scope boundary: code is verified locally in the requested WT. No installed global runtime update, downstream backlog drain, remote push or release is claimed.
- Required integrity: deploy SQL order, architecture sync, strict task workflow, project-state inspection and init dry-run passed; task sync is bound to the substantive digest above.
