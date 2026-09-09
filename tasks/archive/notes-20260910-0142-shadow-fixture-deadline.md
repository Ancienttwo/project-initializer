> **Archived**: 2026-09-10 01:42
> **Related Plan**: plans/archive/plan-20260910-0138-shadow-fixture-deadline.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260910-0142
> **Archive Projection V1**: `plans/plan-20260910-0138-shadow-fixture-deadline.md` => `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/notes/20260910-0138-shadow-fixture-deadline.notes.md` => `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0138-shadow-fixture-deadline.contract.md` => `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0138-shadow-fixture-deadline.review.md` => `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`

# Implementation Notes: shadow-fixture-deadline

> **Status**: Active
> **Plan**: plans/archive/plan-20260910-0138-shadow-fixture-deadline.md
> **Contract**: tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md
> **Review**: tasks/archive/review-20260910-0142-shadow-fixture-deadline.md
> **Last Updated**: 2026-09-10 01:38
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:b72ad0819b228a26f29fb0751a63f72f7c70ebe497eed47c2de600aef5b57fc1`

## Design Decisions

- Preserve the shared1000ms default; only the real-ledger shadow suite uses its existing20-second test window.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Per-fixture deadline override | Accepted | Isolates filesystem latency from stale-terminal semantics without weakening product timeout gates. |

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
