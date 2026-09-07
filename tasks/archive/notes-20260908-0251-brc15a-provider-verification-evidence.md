> **Archived**: 2026-09-08 02:51
> **Related Plan**: plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-0251
> **Archive Projection V1**: `plans/plan-20260908-0205-brc15a-provider-verification-evidence.md` => `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-0205-brc15a-provider-verification-evidence.notes.md` => `tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0205-brc15a-provider-verification-evidence.contract.md` => `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0205-brc15a-provider-verification-evidence.review.md` => `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md`

# Implementation Notes: brc15a-provider-verification-evidence

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md
> **Contract**: tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md
> **Review**: tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md
> **Last Updated**: 2026-09-08 02:06
> **Lifecycle**: notes

## Design Decisions

- User correction makes the existing UI choice authoritative for selection. No backend identity is inferred from 6 Pro; GitHub pill and requested app are separate facts.

## Deviations From Plan Or Spec

- Added explicit GitHub app activation after user correction and the independently recorded activated README probe at 6cfac409. The readback caller was another hardcoded-model site and is corrected in the same boundary.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Keep current UI defaults | Selected | No agent model selection or second configuration authority |

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

> **Substantive Change SHA256**: `sha256:803f6df32f0a566d9a8aa2646f5e38017ac411a95cabb39a901a7ffece1bdfca`
