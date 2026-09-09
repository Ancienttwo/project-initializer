> **Archived**: 2026-09-10 01:14
> **Related Plan**: plans/archive/plan-20260910-0111-c7-generation-assertion.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260910-0114
> **Archive Projection V1**: `plans/plan-20260910-0111-c7-generation-assertion.md` => `plans/archive/plan-20260910-0111-c7-generation-assertion.md`
> **Archive Projection V1**: `tasks/notes/20260910-0111-c7-generation-assertion.notes.md` => `tasks/archive/notes-20260910-0114-c7-generation-assertion.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0111-c7-generation-assertion.contract.md` => `tasks/archive/contract-20260910-0114-c7-generation-assertion.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0111-c7-generation-assertion.review.md` => `tasks/archive/review-20260910-0114-c7-generation-assertion.md`

# Implementation Notes: c7-generation-assertion

> **Status**: Active
> **Plan**: plans/archive/plan-20260910-0111-c7-generation-assertion.md
> **Contract**: tasks/archive/contract-20260910-0114-c7-generation-assertion.md
> **Review**: tasks/archive/review-20260910-0114-c7-generation-assertion.md
> **Last Updated**: 2026-09-10 01:11
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:d21c5557a4a4c54e90a149e9c33dcbacf37e07498d9c0ce37f8c30ecdabd590d`

## Design Decisions

- Numeric authority is checked as an exact parsed scalar, retaining existing long-identity substring exclusions.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Exact parsed scalar | Accepted | Decimal digits can legitimately occur inside unrelated SHA256 values. |

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
