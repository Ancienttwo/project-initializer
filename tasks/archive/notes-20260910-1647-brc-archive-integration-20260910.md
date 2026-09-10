> **Archived**: 2026-09-10 16:47
> **Related Plan**: plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260910-1647
> **Archive Projection V1**: `plans/plan-20260910-1621-brc-archive-integration-20260910.md` => `plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md`
> **Archive Projection V1**: `tasks/notes/20260910-1621-brc-archive-integration-20260910.notes.md` => `tasks/archive/notes-20260910-1647-brc-archive-integration-20260910.md`
> **Archive Projection V1**: `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md` => `tasks/archive/contract-20260910-1647-brc-archive-integration-20260910.md`
> **Archive Projection V1**: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md` => `tasks/archive/review-20260910-1647-brc-archive-integration-20260910.md`

# Implementation Notes: inactive branch consolidation

> **Status**: Active
> **Plan**: plans/archive/plan-20260910-1621-brc-archive-integration-20260910.md
> **Contract**: tasks/archive/contract-20260910-1647-brc-archive-integration-20260910.md
> **Review**: tasks/archive/review-20260910-1647-brc-archive-integration-20260910.md
> **Last Updated**: 2026-09-10
> **Lifecycle**: notes

## Design Decisions

- The user's cleanup scope excludes exactly the primary Operator checkout and campaign-reconciliation-recovery. The older frozen preflight checkout is now included.
- Preserve all original commit identities with history merges. PR #360 and #363 supersession evidence justifies keeping the current production tree; replaying predecessor trees would revert protected host-journal and recovery behavior.
- Commit seven pending historical files on their owning inactive heads before consolidation. Old projection manifests and stale active workflow states remain recoverable from those parents, with explicit links in the consolidation research.
- Bring forward unique BRC6a evidence and readiness snapshots as dated history. Current BRC13/BRC14/BRC15a implementation and authorization documents remain the current authority.

## Deviations From Plan Or Spec

- History-only merge strategy implements the planned current-main conflict disposition. Work-package acceptance covers the integration candidate; authorized remote publication and directory deletion follow only after that gate.
- A new worktree initially lacked the repository-required CodeGraph index. Initial projection produced a proof-only candidate; after local index initialization, deterministic projection returned noop. Reconcile that exact setup-generated signal before final verification, without changing any product or architecture file.

- The user reprioritized visible cleanup while final review was running. After all eight checks passed, pushed the exact integration commit and read back its remote SHA, then removed 19 inactive local branch refs, 18 worktree directories, and two legacy remote BRC refs. All 20 saved source heads remain ancestors of the remote integration commit. Main publication and removal of this temporary integration worktree remain the final follow-through.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Replay old runtime trees | Reject | Later accepted commits supersede their authority and fixtures. |
| Delete unmerged refs directly | Reject | The user requested merge before cleanup. |
| Preserve ancestry plus selected historical docs | Use | Retains every byte while avoiding production or workflow regression. |

## Open Questions

- None. Publication and cleanup are covered by the user's explicit instruction.

## Evidence Links

- Durable provenance: docs/researches/20260910-inactive-branch-consolidation.md
- Prepared checks: .ai/harness/checks/latest.json
- Run snapshots: .ai/harness/runs/
