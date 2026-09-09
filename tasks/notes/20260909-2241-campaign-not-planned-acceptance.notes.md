# Implementation Notes: campaign-not-planned-acceptance

> **Status**: Active
> **Plan**: plans/plan-20260909-2241-campaign-not-planned-acceptance.md
> **Contract**: tasks/contracts/20260909-2241-campaign-not-planned-acceptance.contract.md
> **Review**: tasks/reviews/20260909-2241-campaign-not-planned-acceptance.review.md
> **Last Updated**: 2026-09-09 22:41
> **Lifecycle**: notes

## Design Decisions

- Reuse the canonical receipt disposition directly. The CLI already verifies and passes the receipt unchanged; a translation layer would introduce an unnecessary second vocabulary.

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

> **Substantive Change SHA256**: `sha256:eb740d59f5960845318e5ff8075b561ad6153afb79831f9c36990c5d53dcb48e`
