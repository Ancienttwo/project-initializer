> **Archived**: 2026-09-10 23:48
> **Related Plan**: plans/archive/plan-20260910-2225-operator-task-diff.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260910-2348
> **Archive Projection V1**: `plans/plan-20260910-2225-operator-task-diff.md` => `plans/archive/plan-20260910-2225-operator-task-diff.md`
> **Archive Projection V1**: `tasks/notes/20260910-2225-operator-task-diff.notes.md` => `tasks/archive/notes-20260910-2348-operator-task-diff.md`
> **Archive Projection V1**: `tasks/contracts/20260910-2225-operator-task-diff.contract.md` => `tasks/archive/contract-20260910-2348-operator-task-diff.md`
> **Archive Projection V1**: `tasks/reviews/20260910-2225-operator-task-diff.review.md` => `tasks/archive/review-20260910-2348-operator-task-diff.md`

# Plan: Operator task worktree diff

> **Status**: Archived
> **Created**: 20260910-2225
> **Slug**: operator-task-diff
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: task worktree authority, HTTP read and UI
> **Rollback Surface**: endpoint and task detail component
> **Planning Source**: waza-think

## Goal

Show the selected task's current execution worktree changes in the operator detail pane, on demand and read-only. Compare against the canonical target ref resolved at observation time, with explicit target ref/base commit/HEAD and observation time. This is a worktree comparison, not an attribution of every line to the task or a task-start snapshot.

## P1 / P2 / P3

Browser task identity and claim fence -> registered repository -> canonical sprint task -> live bound lease -> Git worktree topology and shared common directory -> bounded Git diff -> strict response decoder -> task detail. The lease owns execution_worktree, branch, target_ref; it does not own a task-start commit. Keep this reader independent of legacy worktree start metadata. Task Message remains the only browser write route.

Use native Git with external diff and text conversion disabled. No dependencies. Load only on demand, cap concurrent reads and output, cancel on disconnect/deadline/shutdown, run synchronous authority reads outside the HTTP event loop. Recheck authority after reading; refuse stale or missing bindings. Show tracked patch and explicitly separate untracked filenames (contents not loaded). Large diffs fail clearly, never truncate into an apparently complete result. At 10x demand, bounded admission returns busy; at 10x diff size, byte limit refuses the read.

## Scope

One read-only GET endpoint, shared payload contract, reader and worker, one detail component with existing translations/styles, focused real-Git/HTTP/UI tests, and operator research documentation. No write route, editing, commit/merge, history service, TeamAI integration, or Vibe dependency.

## Task Breakdown

- [x] Implement fenced bounded task worktree diff reader and API.
- [x] Add on-demand task detail with loading, empty, unavailable and error states.
- [x] Verify Git identity/fence, bounds, route security, UI stale-response handling and rendering.
- [x] Run typecheck, operator build and required repository integrity checks; record evidence and promote durable behavior documentation.

## Verification

Focused task diff effect tests, operator server tests, operator web task diff interactions; bun run check:type; bun run build:operator-web. Required integrity: check:hooks, check:helpers, check-deploy-sql-order, check-architecture-sync, check-task-sync, check-task-workflow --strict, inspect-project-state and init --dry-run. No full suite: affected boundaries are covered by named focused tests and this is not a release.

## Acceptance

Only the task's authoritative linked worktree can be read. Base and HEAD are explicit; untracked-only worktrees are not reported clean. A changed task/claim or replaced worktree fails closed. Existing Task Message remains the sole write route. No public release is part of this slice.

## Promotion Gate

- **Merge/PR unit**: one read-only task worktree diff feature.
- **Rollback surface**: remove the GET, payload reader and detail component together.
- **Verification boundary**: real Git authority, HTTP worker and browser state.
- **Review/acceptance boundary**: the whole diff must preserve the single-write invariant.
- **High-risk surface**: machine-local filesystem access must stay task-bound.
- **Why not checklist row**: independent cross-capability feature and verification unit.

## Evidence Contract

- **State/progress path**: this plan's Task Breakdown and verification record.
- **Verification evidence**: named focused tests, build/typecheck and eight integrity commands.
- **Evaluator rubric**: explicit base/head, valid task-bound tree, no writes, clear refusal, escaped text and stale response cancellation.
- **Stop condition**: implementation and scoped verification complete; release excluded.
- **Rollback surface**: revert only this feature's source, tests and documentation.

## Verification Record

> **Substantive Change SHA256**: `sha256:49e74eb6545369f36147845eb3a5661d907bc0ed77a5ccb51048aa0282636a0d`

- Development/final focused tests: 38 passing across `tests/effects/operator-task-diff.test.ts`, `tests/cli/operator-serve.test.ts`, `tests/operator-web/operator-task-diff.test.tsx` (10.86 s). The real HTTP worker path is exercised against a registered read-only temporary Git worktree.
- Existing operator regressions: 173 passing across operator interactions/UI, operator web types and structural write-boundary tests (1.61 s). These remain valid after the bounded follow-up changes to the UUID validator, button class and additional focused tests; final targeted tests cover that delta.
- `bun run check:type` and `bun run build:operator-web`: passing. Built bundle was opened in Chrome with synthetic snapshot/diff fixtures; load, explicit base/HEAD, patch text, scroll and untracked names were visually inspected. This visual fixture is separate from the real HTTP worker test.
- Integrity: hooks, helpers, SQL ordering, architecture sync, project-state inspection and init dry-run pass. Workflow validation passes after filling the plan Evidence Contract and Promotion Gate. Task sync binds the final digest above.
- No dependency or version changes. Six new implementation/test files are required for the shared payload, read authority, worker isolation, display lifecycle and focused effect/UI verification. Existing server, UI integration, translations, style, route tests and research entrypoint contain their owning changes.
- Delivery boundary: implementation is isolated on `codex/operator-task-diff`, based on `9cc12bac18084293dda466364b02bd1c3734f21c`. Existing primary worktree changes and the 0.19 release worktree remain untouched. No public release is included.

## Delivery

Implementation and local verification are complete. The branch remains isolated for integration because the primary worktree has existing composer/checkpoint edits. Public merge and release are not reported as complete.

## Merge acceptance and security correction

The user authorized merge. The exact main policy requires an AcceptanceReceipt and local seal. Review proved configured Git clean filters and fsmonitor can execute commands through the GET reader; `state resolve --operation security` raises this correction to strict. Keep this same work-package, freeze the contract below, reproduce first, then reject configured external filters and disable fsmonitor without changing comparison semantics.

> **Task Contract**: `tasks/archive/contract-20260910-2348-operator-task-diff.md`
