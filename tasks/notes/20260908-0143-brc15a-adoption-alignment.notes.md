# Implementation Notes: brc15a-adoption-alignment

> **Status**: Active
> **Plan**: plans/plan-20260908-0143-brc15a-adoption-alignment.md
> **Contract**: tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md
> **Review**: tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md
> **Last Updated**: 2026-09-08 01:44
> **Lifecycle**: notes

## Design Decisions

- The approved fallback for missing provider authority applies: no Pro effort result is persisted by Oracle; retain unverified and record the producer seam in the research entrypoint.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Copy model picker verified | Rejected | Does not prove Pro effort or an exact provider session join. |

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
