> **Archived**: 2026-09-07 02:05
> **Related Plan**: plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0205
> **Archive Projection V1**: `plans/plan-20260907-0149-brc15a-shadow-provider-budget.md` => `plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md`
> **Archive Projection V1**: `tasks/notes/20260907-0149-brc15a-shadow-provider-budget.notes.md` => `tasks/archive/notes-20260907-0205-brc15a-shadow-provider-budget.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md` => `tasks/archive/contract-20260907-0205-brc15a-shadow-provider-budget.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md` => `tasks/archive/review-20260907-0205-brc15a-shadow-provider-budget.md`

# Implementation Notes: brc15a-shadow-provider-budget

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0149-brc15a-shadow-provider-budget.md
> **Contract**: tasks/archive/contract-20260907-0205-brc15a-shadow-provider-budget.md
> **Review**: tasks/archive/review-20260907-0205-brc15a-shadow-provider-budget.md
> **Last Updated**: 2026-09-07 01:49
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:d1da1b55215b5bcfb4b481a76787418b984e31e91396d2de347a2f3a96187da2`

## Design Decisions

- Shadow final observations precede seal under an active budget step; active publication is unchanged.

## Deviations From Plan Or Spec

- Same run-lock completion plus terminal was added as an optional seal input rather than a second public finalization API.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Post-terminal charged read | Reject | It necessarily invalidates an exact full-ledger terminal. |
| Authoring session epoch | Reject | Sessions are not the budget authority. |

## Open Questions

- None.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promoted to `docs/researches/20260907-brc15a-shadow-provider-budget.md`.
- Promote to harness asset files only after verification across more than one task or fixture.
