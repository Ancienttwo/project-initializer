# Implementation Notes: campaign-acceptance-preflight

> **Status**: Active
> **Plan**: plans/plan-20260910-0431-campaign-acceptance-preflight.md
> **Contract**: tasks/contracts/20260910-0431-campaign-acceptance-preflight.contract.md
> **Review**: tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md
> **Last Updated**: 2026-09-10 04:31
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:9f62ca85180788771850a7ed03b08d2091075dbb9ddc2040072febe002ee2e53`

## Design Decisions

- Reuse switch-plan for activation after Fleet proof validation; authoring projection is not part of acquisition.

## Deviations From Plan Or Spec

- None recorded.

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

- Promoted boundary and evidence to docs/researches/20260910-campaign-acceptance-preflight.md.
