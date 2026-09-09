> **Archived**: 2026-09-09 20:16
> **Related Plan**: plans/archive/plan-20260909-1943-ci-job-split.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260909-2016
> **Archive Projection V1**: `plans/plan-20260909-1943-ci-job-split.md` => `plans/archive/plan-20260909-1943-ci-job-split.md`
> **Archive Projection V1**: `tasks/notes/20260909-1943-ci-job-split.notes.md` => `tasks/archive/notes-20260909-2016-ci-job-split.md`
> **Archive Projection V1**: `tasks/contracts/20260909-1943-ci-job-split.contract.md` => `tasks/archive/contract-20260909-2016-ci-job-split.md`
> **Archive Projection V1**: `tasks/reviews/20260909-1943-ci-job-split.review.md` => `tasks/archive/review-20260909-2016-ci-job-split.md`

# Task Review: ci-job-split

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260909-1943-ci-job-split.md
> **Contract**: tasks/archive/contract-20260909-2016-ci-job-split.md
> **Notes File**: tasks/archive/notes-20260909-2016-ci-job-split.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-09 19:43
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:45b1fe18acb8874a9b96f714e1d6e47887b5c7c44dd9255de3b262a289b7a151
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: d48d2eeee8e71e7014a6bee6dc36c7ae9fab1d72

## Human Review Card

- Verdict: local acceptance passed; hosted CI remains the merge gate.
- Change type: code-change (CI orchestration).
- Intended/actual substantive files: `.github/workflows/ci.yml`, `scripts/check-ci.sh`, `tests/check-ci-job-split.test.ts`.
- Commands passed: 24 focused CI tests; typecheck; six root integrity checks; `verify-sprint --prepare-acceptance` and finalization.
- Residual risk: archctx 0.5.8 can create an undeclared generated file on a fresh checkout; the separate upstream correction is arch-context PR #150. This worktree completed projection and reconciled its earlier proof-only candidate without weakening the fence.
- Rollback: revert this CI slice.

## Mode Evidence

- Selected route: standard scope review; independent hosted governance and functional invocations with a fail-closed aggregate.
- P1/P2/P3: the plan records the single CI script, governance fail-fast path, preserved no-argument local/release gate and independent hosted setup.

## Verification Evidence

- Waza `/check`: scope, full-gate preservation, setup and all 64 aggregate result combinations reviewed.
- Formal acceptance: all 15 contract verification items passed, receipt recorded, finalization reused the prepared evidence, then `contract-worktree finish --no-merge` archived the slice.
- Substantive implementation remained unchanged during this documentation correction; earlier acceptance is evidence for its stated subject, not a newly minted receipt.

## Acceptance Receipt Projection

> **Disposition**: external_pass
> **Reviewer**: Codex
> **Source**: codex-plugin
> **Actor**: not-applicable
> **Reviewed Subject SHA256**: sha256:45b1fe18acb8874a9b96f714e1d6e47887b5c7c44dd9255de3b262a289b7a151
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: d48d2eeee8e71e7014a6bee6dc36c7ae9fab1d72
> **Verification Evidence SHA256**: sha256:5d0645dfcc689b42d225b47dbe7b051c8473e4738a5abfb0913a66059fa1179a
> **Issued At**: 2026-09-09T12:14:38.860Z

- Summary: CI lanes preserve every existing check and fail closed on all 64 aggregate status combinations. All contract criteria pass; hosted CI remains required before merge.
- Findings: none

## Behavior Diff Notes

Governance failure no longer suppresses hosted functional tests. The aggregate rejects every non-success dependency. Runtime pins, MCP coverage and the complete no-argument local/release gate are preserved.

## Residual Risks / Follow-ups

Hosted CI must pass before merge. Upstream archctx publication and downstream pin adoption are separate from this CI change.
