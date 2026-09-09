# Implementation Notes: projection-timeout

> **Status**: Active
> **Plan**: plans/plan-20260909-1853-projection-timeout.md
> **Contract**: tasks/contracts/20260909-1853-projection-timeout.contract.md
> **Review**: tasks/reviews/20260909-1853-projection-timeout.review.md
> **Last Updated**: 2026-09-09 18:53
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:9965c617536747b4c4043c3b5e82b7dabd695f45caf8cd7100b55a4ca6b975cc`

## Design Decisions

- The running-job reclaim window is a derivation, not a constant: `recoverAbandonedArchitectureProjectionJobs`
  now takes the resolved `policy.timeoutMs` from `drainArchitectureProjectionJobs` and computes
  `architectureProjectionRunningStaleMs(timeoutMs) = timeoutMs + 30_000`. The prior
  `RUNNING_STALE_MS = 150_000` constant would have reclaimed live jobs once the provider bound
  passed 120s, and keeping it as a second tunable would have created a second timeout authority.
- Only the validator upper bound moves to 600000; the default stays 120000 so downstream policy
  seeds in `scripts/` and `assets/templates/` stay a valid untouched default.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Raise `RUNNING_STALE_MS` to a new constant | Rejected | Two timeout authorities that can drift apart |
| Derive the stale window from the resolved policy timeout | Chosen | One source of truth; the reclaim window follows whatever bound the provider actually runs under |
| Raise the shipped default timeout to 300000 | Rejected | The long bound is a property of this repo's projection size, not of every generated repo |

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
