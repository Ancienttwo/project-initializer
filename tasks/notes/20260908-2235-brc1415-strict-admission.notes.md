# Implementation Notes: brc1415-strict-admission

> **Status**: Active
> **Plan**: plans/plan-20260908-2235-brc1415-strict-admission.md
> **Contract**: tasks/contracts/20260908-2235-brc1415-strict-admission.contract.md
> **Review**: tasks/reviews/20260908-2235-brc1415-strict-admission.review.md
> **Last Updated**: 2026-09-08 22:35
> **Lifecycle**: notes

## Design Decisions

- ...

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| ... | ... | ... |

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

## Admission boundary decision

The current main baseline passed 63 tests. The prepared guard-only change passed 25 tests before adding the adoption consumer assertion. That added assertion exposed the fixture's intentionally unverified authoring session before browser binding, not a production regression. The final assertion preserves that independent refusal and proves zero external calls and unchanged ledger/Git after strict admission succeeds. Real authoring/worker acceptance remains pending a new disposable target and budget.

Final local prepare passed all 14 checks/assertions, including revised 25-case regression, typecheck, runtime source equality and six integrity checks. The first architecture entry only generated missing worktree output and stopped before tests; retry passed. Evidence binding requires committing the newly created contract. Live target/budget authorization and explicit activation-boundary resolution remain pending.
