# Implementation Notes: campaign-settled-resume

> **Status**: Active
> **Plan**: plans/plan-20260910-0004-campaign-settled-resume.md
> **Contract**: tasks/contracts/20260910-0004-campaign-settled-resume.contract.md
> **Review**: tasks/reviews/20260910-0004-campaign-settled-resume.review.md
> **Last Updated**: 2026-09-10 00:04
> **Lifecycle**: notes

> **Substantive Change SHA256**: `sha256:fbfde3cda45c49750a0abbc9ea4254886a3e0ff4eac4f6de3ada78c28217e1b1`

## Design Decisions

- Share source eligibility between preflight and admission; retain never-acquired recovery semantics.

## Deviations From Plan Or Spec

- Acquired-source drift checks apply only to the newly admitted acquired branch; existing zero-acquisition replacement regression remains unchanged.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Derive quiescence from retained native receipts | Accepted | Acquisition counters cannot establish inactive runtime effects. |

## Open Questions

- None.
- Security review required explicit read-only settlement lookup at the deadline boundary; focused regression passes and fails when the read-only argument is removed.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
