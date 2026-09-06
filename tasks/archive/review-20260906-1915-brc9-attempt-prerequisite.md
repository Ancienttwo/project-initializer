> **Archived**: 2026-09-06 19:15
> **Related Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260906-1915
> **Archive Projection V1**: `plans/plan-20260906-1743-brc9-attempt-prerequisite.md` => `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-1743-brc9-attempt-prerequisite.notes.md` => `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1743-brc9-attempt-prerequisite.contract.md` => `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1743-brc9-attempt-prerequisite.review.md` => `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`

# Task Review: brc9-attempt-prerequisite

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Contract**: tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md
> **Notes File**: tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-06 17:43
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:92a977d9a8cf07c48eb2286d01b251b9b2d778505c64025947bae0a1a109d199
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 4c6e59784cb5ae0b2c46e387586cc1630e37a030

## Human Review Card

- Verdict: owner-approved integration of the previously externally reviewed implementation; repaired-target CI passed; canonical publication is the remaining step.
- Change type: bugfix and upstream closed-outcome prerequisite.
- Intended and actual source paths: src/core/engineers/automation-attempt.ts, src/core/engineers/scheduling.ts, src/effects/engineers/automation-attempt-store.ts.
- Regression path: tests/unit/issue-287-automation-attempt.test.ts. Research and deterministic architecture projection accompany the implementation.
- Result: new attempt identities obey existing retry eligibility under the writer lock; exact replay remains read-only; closed outcomes include non-retryable not_reproducible.
- Rollback: preserve all existing evidence. A rollback after issuing not_reproducible records requires an explicit migration/release decision.

## Mode Evidence

- Parent review traced the public attempt writer, current projection, Engineer validation and actual controller caller. It checked validation order, policy ownership, exact replay, concurrency and fail-closed dispatch behavior.
- Native security and architecture children were rejected by role routing before reading code. They provided no independent findings or passes.
- One official codex-plugin review covered the complete selected final diff and returned approve with zero findings. It used the prepared evidence and ran no tests.
- No new dependency, storage format, ledger, provider call or Task/Lease authority was introduced. The shared outcome tuple replaces the duplicated scheduling list and serves both runtime consumers.

## Verification Evidence

- Pre-fix: /tmp/brc9-attempt-before.txt, 4 pass / 11 fail, PRE_FIX_EXIT=1, captured before production edits.
- Development: 16/16 attempt tests, 21/21 controller/acquire-next tests, typecheck pass.
- Canonical prepare: run-20260906T175639-10979, 24/24, including six root integrity checks and three focused suites.
- Official review: /tmp/brc9-attempt-official-review.json; exact subject and target are recorded below.
- Finalization: /tmp/brc9-attempt-finalize.txt, completed without rerunning verification.
- No local full suite was run or claimed.

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:92a977d9a8cf07c48eb2286d01b251b9b2d778505c64025947bae0a1a109d199
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 4c6e59784cb5ae0b2c46e387586cc1630e37a030
> **Verification Evidence SHA256**: sha256:6c880390403abe8a0c46f8cc7a942c99db3d5806bce7d2fb297224bd0eaee7cc
> **Issued At**: 2026-09-06T11:15:09.261Z

- Summary: Owner explicitly approved integration closeout after the accepted d67acc3f implementation and approved proceeding with upstream target integration. Target is now 322d7cde; production, regression test and research bytes match the official f8812317 review. Only generated architecture provenance and digests changed, with unchanged semantic state and output digests. New-target canonical preparation passed 24/24. This grant records owner acceptance for integration; it does not relabel the earlier external review or waive required CI.
- Findings: none

## Residual Risks / Follow-ups

- Main CI run 34025058232 failed in nine test files after the concurrent verification lifecycle cutover. The previous BRC8 characterization correction passed in that run. The cutover owner in pane %20 is repairing the missing helper groups and contract/fixture consumers; the user-authorized handoff was sent from pane %14.
- This worktree remains isolated until the required upstream integration/CI boundary is satisfied. No BRC9 publication or whole-sprint completion is claimed.
- Remaining BRC9 prerequisites must expose campaign limits and pre-adoption attempt identity through the existing #282/#287 authority. This slice implements neither a second budget authority nor an authoring Task substitute.

## Target integration evidence

Target advanced from 879c9bfd to 322d7cde. Product/test/research bytes are unchanged from the official review. Ordinary architecture projection changed provenance/digests only, preserving semantic state and rendered output digests. New-target canonical prepare run-20260906T182709-55475 passed 24/24; finalization ran no tests. The current projection records owner acceptance from the user's explicit integration approval; the original official review is historical evidence, not a provider pass for the new subject. Repaired-target CI: 34027338609, pending at this checkpoint.

## Repaired target CI

Verified live: 4c6e59784cb5ae0b2c46e387586cc1630e37a030 / run 34028703586 completed success, including Test, all three MCP matrix jobs and Required / CI. Actual target delta contains only tests/helper-scripts.test.ts and the verification research document. This is a CI pass for that upstream target, not a full-suite pass for the BRC9 candidate. The BRC9 product/test/research content remains unchanged from its official review; current target binding is recorded by the Acceptance Receipt Projection.
