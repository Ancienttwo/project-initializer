# Implementation Notes: campaign-acceptance-preflight

> **Status**: Active
> **Plan**: plans/plan-20260910-0431-campaign-acceptance-preflight.md
> **Contract**: tasks/contracts/20260910-0431-campaign-acceptance-preflight.contract.md
> **Review**: tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md
> **Last Updated**: 2026-09-10 04:31
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:0b9f593b7fc277a3434baffc533814fb15edc27c6847fc5a3cba6d99b38b5403`

## Design Decisions

- Reuse switch-plan for activation after Fleet proof validation; authoring projection is not part of acquisition.

## Deviations From Plan Or Spec

- CI run 34406126201 on 0251c8d1 failed because the shared historical campaign fixture omitted canonical benchmark/review metadata, and the Fleet verification path could not resolve its hook CLI in a clean runtime. Outer diff environment variables were ruled out by a passing controlled run. Reopened this unpublished work-package; the first directly blocking additional source fix binds the protected helper to its own package hook CLI. A copied Bun executable excludes the ambient global hook: the permanent existing Fleet guard failed before that binding and passed afterward. The security delta passed; no second external semantic review is used. The named historical lifecycle consumers are now included in final verification. Original CI and local 0251 acceptance remain evidence for their exact subjects.

- Final codex-plugin review identified removal of review initialization without an availability check. Reproduced against ae213ada, then added canonical metadata preflight before claim and in the fresh worktree, plus missing and uncommitted-only review regression cases. This is the same admission/activation boundary; no second provider review is requested.
- The authority-freeze unit fixture injects its metadata preflight dependency alongside its synthetic offer, preserving the claim-control and negative authority assertions; the real CLI fixtures exercise the canonical helper.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| New activation mode in plan-to-todo | Rejected | Existing switch-plan already owns the two ignored pointers. |
| New metadata parser | Rejected | verify-contract exposes its canonical static checks without acceptance execution. |

## Open Questions

- None.

## Evidence Links

- Failed exact-head CI: https://github.com/Ancienttwo/repo-harness/actions/runs/34406126201
- Packaged hook regression RED: tasks/evidence/campaign-packaged-hook-pre-fix.log; GREEN: the isolated-Bun Fleet acquisition test retains its business acceptance and out-of-scope rejection assertions.

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Original semantic reviewer P2 is resolved by the named regressions; original transcript is retained in the runtime cross-review result.
- Promoted boundary and evidence to docs/researches/20260910-campaign-acceptance-preflight.md.
