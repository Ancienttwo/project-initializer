# Implementation Notes: brc14-active-revision-admission

> **Status**: Active
> **Plan**: plans/plan-20260908-1446-brc14-active-revision-admission.md
> **Contract**: tasks/contracts/20260908-1446-brc14-active-revision-admission.contract.md
> **Review**: tasks/reviews/20260908-1446-brc14-active-revision-admission.review.md
> **Last Updated**: 2026-09-08 14:46
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:a9479b7f38653a72b65deef2f0719bed980b3f58d7b6a83c4c479b8f483d66aa`

## Design Decisions

The existing history decoder owns revision semantics; strict protocol2 observations bind that evidence to the anchored initial campaign grant and original budget. No historical result is upgraded.

Fleet offer projection is also an active caller. Its guard must not repair budget projections, so readAutomationUsageForResult has explicit read_only mode reusing identical stored-reservation/event validation without the mutation lock or repair. Original settlement/recovery callers preserve their locked behavior.

An initial test assumed consuming the last provider allowance immediately changes budget state; the existing ledger only marks exhaustion at the next denied admission. The regression now exercises the actual denied reservation before checking stopped-budget refusal; the gate does not introduce another budget counter authority.

23 observation/identity/recovery tests and TypeScript passed before final acceptance.


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
