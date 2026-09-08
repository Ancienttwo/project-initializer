> **Archived**: 2026-09-08 14:24
> **Related Plan**: plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-1424
> **Archive Projection V1**: `plans/plan-20260908-1350-brc14-history-revision-evidence.md` => `plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-1350-brc14-history-revision-evidence.notes.md` => `tasks/archive/notes-20260908-1424-brc14-history-revision-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md` => `tasks/archive/contract-20260908-1424-brc14-history-revision-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md` => `tasks/archive/review-20260908-1424-brc14-history-revision-evidence.md`

# Implementation Notes: brc14-history-revision-evidence

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-1350-brc14-history-revision-evidence.md
> **Contract**: tasks/archive/contract-20260908-1424-brc14-history-revision-evidence.md
> **Review**: tasks/archive/review-20260908-1424-brc14-history-revision-evidence.md
> **Last Updated**: 2026-09-08 13:50
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:7c7e76955c085331aee9e3a30b710c269fa75e60c25e4832e3db8460c45a5bbc`

## Design Decisions

- Provider history is the single revision producer. SSE remains diagnostic only; no semantic fallback.

## Deviations From Plan Or Spec

- Protocol 2 deliberately rejects old observation schemas rather than translating them. Original run evidence is retained without upgrade.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Exact commit/ref returns | Accepted | Both are complete provider-origin responses. |
| Truncated tree wrapper | Excluded | No partial-wrapper reconstruction protocol. |

## Review correction

Security review proved final/user working_turn_id contradictions were not checked. `/tmp/brc14-turn-mismatch-red.log` records the unfixed counterexample; the decoder now requires user/final/tool turn_exchange_id and working_turn_id to agree. Four focused regressions cover missing and contradictory IDs. Canonical baseline run-20260908T140716-56781 passed 14/14 before this bounded correction and remains baseline only.

The package source reference identifies its bounded research/implementation slice, rather than a whole sprint row: finishing this package must not auto-complete BRC14. Original group-loop design at plans/sprints/20260902-GPT-issues-loop.md:1168 permits accepted_with_followups to feed a next authorized group. Follow-up brief propagation and completed_with_followups terminal projection remain subsequent BRC14 work.

## Open Questions

- None.

## Accepted implementation evidence

- Oracle producer is committed at a33e5edb, built successfully. 74 focused tests across conversation capture, session storage/forwarding and CLI route rejection passed; typecheck and changed-file lint passed. No provider was invoked by these checks.
- Harness final correction 037abfb4 passed canonical run-20260908T141032-91552: 14/14, including focused protocol/effect/provider tests, typecheck and six integrity checks.
- Independent architecture/composition, security/assumption and cascade/abuse reviews passed. One security finding was fixed and independently rechecked.
- Earlier integration packages retain their accepted bfb1c105 baseline; this review covers this package delta and its current composition. No old acceptance is relabelled as a new complete BRC run.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
