> **Archived**: 2026-09-08 03:56
> **Related Plan**: plans/archive/plan-20260908-0336-brc6a-live-network-evidence.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-0356
> **Archive Projection V1**: `plans/plan-20260908-0336-brc6a-live-network-evidence.md` => `plans/archive/plan-20260908-0336-brc6a-live-network-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-0336-brc6a-live-network-evidence.notes.md` => `tasks/archive/notes-20260908-0356-brc6a-live-network-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md` => `tasks/archive/contract-20260908-0356-brc6a-live-network-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md` => `tasks/archive/review-20260908-0356-brc6a-live-network-evidence.md`

# Implementation Notes: brc6a-live-network-evidence

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-0336-brc6a-live-network-evidence.md
> **Contract**: tasks/archive/contract-20260908-0356-brc6a-live-network-evidence.md
> **Review**: tasks/archive/review-20260908-0356-brc6a-live-network-evidence.md
> **Last Updated**: 2026-09-08 03:36
> **Lifecycle**: notes

## Design Decisions

- Output is one-shot and foreground-only; unsupported remote Oracle/Gemini routes reject before dispatch.

## Deviations From Plan Or Spec

- Shared-collector real Chrome evidence and review of both lifecycle sites replace full ChatGPT execution; no disk-full fault injection is claimed. Twelve Oracle files include tests and documentation.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Session-config path persistence | Rejected | Reattachment must not reuse exclusive evidence paths |

## Open Questions

- Live ChatGPT tool-argument visibility remains unverified.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
