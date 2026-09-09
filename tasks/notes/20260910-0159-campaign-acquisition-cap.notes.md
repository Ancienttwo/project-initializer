# Implementation Notes: campaign-acquisition-cap

> **Status**: Active
> **Plan**: plans/plan-20260910-0159-campaign-acquisition-cap.md
> **Contract**: tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md
> **Review**: tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md
> **Last Updated**: 2026-09-10 01:59
> **Lifecycle**: notes

## Design Decisions

- Campaign acquisition capacity is an admission limit; all subsequent operations retain their existing per-operation budgets.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Campaign-only correction | Use | Preserve non-campaign stop semantics and all historical receipts. |

## Open Questions

- None.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.

> **Substantive Change SHA256**: `sha256:910627173b6d62cfd00524e07e1fc4d0c2f46cd5f6ceddfacae2dd5a63675028`
