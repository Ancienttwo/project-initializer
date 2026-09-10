# Plan: Explicit stale registry cleanup

> **Status**: Done
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary

## Scope and authorization

Owner requests removal of obsolete test registrations and a logic fix or cleanup command; explicitly declines backup. Preserve repository files and valid/uncertain registrations. Isolated branch codex/registry-prune from 8a33faed. Standard workflow: this plan owns progress; no separate contract/notes scaffolding.

## P1 / P2 / P3

- Map: src/effects/repo-registry.ts owns strict authority parsing, mutation locking, atomic writes and authorizationRevision. src/cli/commands/fleet.ts owns fleet operator commands; the board reads all registered rows.
- Trace: historical init test subprocess environment lost HOME/REPO_HARNESS_HOME, registering temporary repos in real home. Deleted paths persist in registry and fail board lstat. Existing init regression guard covers that producer bug. Live inventory: 1039 registrations, 1029 absent paths, all source init.
- Decision: add fleet prune with read-only default, explicit --apply and expected registry revision, optional exact repo-id scope. Only ENOENT is removable; present paths and other probe errors remain. Reprobe under the existing registry mutation lock, atomically write retained entries and bump authorization revision once. No backup, repo deletion, hidden board filtering, automatic cleanup or change to init semantics. At 10x registry size synchronous path probing is the first limit; this bounded operator action adds no background service.

## Task Breakdown

- [x] Add prune effect/CLI and focused regression tests.
- [x] Preview and apply only confirmed missing temporary registrations; read back registry and board.
- [x] Run focused and required integrity checks; record durable result and delivery state.

## Verification

Focused: registry prune CLI tests, registry authority tests, init environment regression, fleet board tests; check:type. Required: check:hooks, check:helpers, check-deploy-sql-order, check-architecture-sync, check-task-sync, check-task-workflow --strict, inspect-project-state and init --dry-run. No full suite: named registry/board/init tests cover the affected shared authority. Test no-op byte preservation, stale revision refusal, invalid registry refusal, exact scoped removal, one revision bump and non-ENOENT preservation.

## Promotion Gate

- **Merge/PR unit**: Explicit registry pruning command and safety tests.
- **Rollback surface**: Revert new command/effect; no existing repository files are modified by prune.
- **Verification boundary**: Disposable registry mutation and real operator cleanup readback.
- **Review/acceptance boundary**: Frozen scoped diff and focused/integrity evidence.
- **High-risk surface**: Account registry authorization; preserve locks, strict parsing and revision fence.
- **Why not checklist row**: Independent operator mutation with a bounded validation surface.

## Evidence Contract

- **State/progress path**: This plan's Task Breakdown.
- **Verification evidence**: Commands above and acceptance notes below.
- **Evaluator rubric**: Only confirmed absent selected records are removed, no repo data deletion or backup, unknown/present paths retained, malformed/stale authority rejected.
- **Stop condition**: Live cleanup readback and named tests/checks pass.
- **Rollback surface**: Code revert; user explicitly declines a live registry backup.

> **Substantive Change SHA256**: `sha256:c9ca8ea886607fef2b906205fc7e16ea00a16ae26720685ce1ae3828906591c0`

## Acceptance Notes

- `bun test tests/cli/registry-prune.test.ts tests/cli/registry.test.ts`: 21 pass. Fleet board tests: 15 pass. Existing init npx environment regression: 1 pass. New tests rerun after a literal-type correction: 3 pass. Typecheck passes.
- Required integrity checks pass; task-sync bound to final substantive digest. Full suite not run for the scoped reason above. Parent reviewed the final CLI/effect diff against lock, strict parsing, revision and no-op invariants.
- Live cleanup used the tested CLI with exact selected IDs and preview revision. Removed 1028 absent temporary init registrations, then one absent arch-context worktree after confirming it was not a registered Git worktree. Registry now retains 10 existing paths and zero absent paths. No backup per Owner instruction; no repository files deleted.
- Live Operator HTTP readback at /api/v1/fleet/snapshot: sequence 3, 10 repositories, 2 unreadable. The remaining arch-context and salesko-new failures are repo_board_unavailable; their existing directories were retained. These are separate board-observation faults, not stale registrations, and were not fixed in this slice.
- Durable operator semantics: docs/researches/registry-prune.md. The new command is committed on the isolated branch; no global installation or release is claimed.
