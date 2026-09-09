> **Archived**: 2026-09-10 00:02
> **Related Plan**: plans/archive/plan-20260909-2347-campaign-execution-environment.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260910-0002
> **Archive Projection V1**: `plans/plan-20260909-2347-campaign-execution-environment.md` => `plans/archive/plan-20260909-2347-campaign-execution-environment.md`
> **Archive Projection V1**: `tasks/notes/20260909-2347-campaign-execution-environment.notes.md` => `tasks/archive/notes-20260910-0002-campaign-execution-environment.md`
> **Archive Projection V1**: `tasks/contracts/20260909-2347-campaign-execution-environment.contract.md` => `tasks/archive/contract-20260910-0002-campaign-execution-environment.md`
> **Archive Projection V1**: `tasks/reviews/20260909-2347-campaign-execution-environment.review.md` => `tasks/archive/review-20260910-0002-campaign-execution-environment.md`

# Implementation Notes: campaign-execution-environment

> **Status**: Active
> **Plan**: plans/archive/plan-20260909-2347-campaign-execution-environment.md
> **Contract**: tasks/archive/contract-20260910-0002-campaign-execution-environment.md
> **Review**: tasks/archive/review-20260910-0002-campaign-execution-environment.md
> **Last Updated**: 2026-09-09 23:47
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:f4d3d4a2c0fe49341a6506c4b3130e8f171da5927d3fb99ae06cc3fb3c249281`

## Design Decisions

- Keep command supply in the immutable image and native dependency resolution in the target lockfile; no runtime mount or provider authority changes.

## Deviations From Plan Or Spec

- The no-model target install identified default HOME cache ENOSPC; explicitly place cache under ignored node_modules rather than raising containment limits. jq is a source-proven verify-sprint prerequisite and belongs in the image.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Shared dependency mount | Rejected | Would expand containment authority and retain platform coupling. |
| Explicit target cache | Selected | Uses the already authorized writable workspace and preserves tmpfs limits. |

- Change Assessment routes the deploy surface to runtime_readback; the oracle is the declared environment test plus protected container results, not a manual waiver.

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
