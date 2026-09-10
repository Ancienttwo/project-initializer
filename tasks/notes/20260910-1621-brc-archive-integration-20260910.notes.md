# Implementation Notes: inactive branch consolidation

> **Status**: Active
> **Plan**: plans/plan-20260910-1621-brc-archive-integration-20260910.md
> **Contract**: tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md
> **Review**: tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md
> **Last Updated**: 2026-09-10
> **Lifecycle**: notes

## Design Decisions

- The user's cleanup scope excludes exactly the primary Operator checkout and campaign-reconciliation-recovery. The older frozen preflight checkout is now included.
- Preserve all original commit identities with history merges. PR #360 and #363 supersession evidence justifies keeping the current production tree; replaying predecessor trees would revert protected host-journal and recovery behavior.
- Commit seven pending historical files on their owning inactive heads before consolidation. Old projection manifests and stale active workflow states remain recoverable from those parents, with explicit links in the consolidation research.
- Bring forward unique BRC6a evidence and readiness snapshots as dated history. Current BRC13/BRC14/BRC15a implementation and authorization documents remain the current authority.

## Deviations From Plan Or Spec

- None. History-only merge strategy implements the planned current-main conflict disposition.

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
