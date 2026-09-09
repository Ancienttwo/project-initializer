# Implementation Notes: campaign-acceptance-preflight

> **Status**: Active
> **Plan**: plans/plan-20260910-0431-campaign-acceptance-preflight.md
> **Contract**: tasks/contracts/20260910-0431-campaign-acceptance-preflight.contract.md
> **Review**: tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md
> **Last Updated**: 2026-09-10 04:31
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:310bb26127d5dc68baccd21365ab61cfd63059d2f8f519196a78dc854293c7d8`

## Design Decisions

- Reuse switch-plan for activation after Fleet proof validation; authoring projection is not part of acquisition.

## Deviations From Plan Or Spec

- Final codex-plugin review identified removal of review initialization without an availability check. Reproduced against ae213ada, then added canonical metadata preflight before claim and in the fresh worktree, plus missing and uncommitted-only review regression cases. This is the same admission/activation boundary; no second provider review is requested.
- The authority-freeze unit fixture injects its metadata preflight dependency alongside its synthetic offer, preserving the claim-control and negative authority assertions; the real CLI fixtures exercise the canonical helper.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| New activation mode in plan-to-todo | Rejected | Existing switch-plan already owns the two ignored pointers. |
| New metadata parser | Rejected | verify-contract exposes its canonical static checks without acceptance execution. |

## Open Questions

- None.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Original semantic reviewer P2 is resolved by the named regressions; original transcript is retained in the runtime cross-review result.
- Promoted boundary and evidence to docs/researches/20260910-campaign-acceptance-preflight.md.
