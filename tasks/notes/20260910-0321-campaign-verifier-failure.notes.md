# Implementation Notes: campaign-verifier-failure

> **Status**: Active
> **Plan**: plans/plan-20260910-0321-campaign-verifier-failure.md
> **Contract**: tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md
> **Review**: tasks/reviews/20260910-0321-campaign-verifier-failure.review.md
> **Last Updated**: 2026-09-10 03:21
> **Lifecycle**: notes

## Design Decisions

- ...

## Deviations From Plan Or Spec

- The old controller remains retired. Actual container cleanup was completed only after its original deadline; no interruption final was manufactured. The explicit verifier rejection will be settled using merged source before the original grant expires.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| ... | ... | ... |

## Open Questions

- A fresh campaign after a known verifier rejection is authorized independently; permanent failure never grants automatic retry.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.

> **Substantive Change SHA256**: `sha256:48490e702f4e82ae9b598b1e14573ca7777d4e3e12e2a9c7e7428a2aadd4b598`
