# Implementation Notes: campaign-worker-record-scope

> **Status**: Active
> **Plan**: plans/plan-20260910-0301-campaign-worker-record-scope.md
> **Contract**: tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md
> **Review**: tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md
> **Last Updated**: 2026-09-10 03:01
> **Lifecycle**: notes

## Design Decisions

- Keep repository edit authority unchanged; authorize only the current campaign output file and return out-of-scope Notes observations to the parent.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Explicit output obligation | Use | Avoid an expanded business allowlist and a parallel scope parser. |

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

> **Substantive Change SHA256**: `sha256:4a469768b810b8b010dac453c9ca121b095a17fba9f1bcd1e6a14eeaba06572b`
