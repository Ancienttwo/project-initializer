> **Archived**: 2026-09-07 05:46
> **Related Plan**: plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0546
> **Archive Projection V1**: `plans/plan-20260907-0507-brc10-reclaim-time-boundary.md` => `plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md`
> **Archive Projection V1**: `tasks/notes/20260907-0507-brc10-reclaim-time-boundary.notes.md` => `tasks/archive/notes-20260907-0546-brc10-reclaim-time-boundary.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md` => `tasks/archive/contract-20260907-0546-brc10-reclaim-time-boundary.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md` => `tasks/archive/review-20260907-0546-brc10-reclaim-time-boundary.md`

# Implementation Notes: brc10-reclaim-time-boundary

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0507-brc10-reclaim-time-boundary.md
> **Contract**: tasks/archive/contract-20260907-0546-brc10-reclaim-time-boundary.md
> **Review**: tasks/archive/review-20260907-0546-brc10-reclaim-time-boundary.md
> **Last Updated**: 2026-09-07 05:07
> **Lifecycle**: notes

## Decision

The input receipt is historical evidence; its observation timestamp must stay immutable. The consumer revalidates historical bytes against current owner/evidence, then independently evaluates eligibility at actual consumption time. Reusing the old clock as the current clock would hide clock regression and is rejected. No schema, policy default or alternate owner store is introduced.

## Root Cause Evidence

- root_cause: automaticReclaimLease reclassifies with a fresh classified_at and compares the full digest against the historical receipt; elapsed time alone changes that digest.
- repro: bun test --timeout 60000 tests/unit/brc10-reclaim-time-boundary.test.ts
- regression_guard: tests/unit/brc10-reclaim-time-boundary.test.ts
- pre_fix_failure_artifact: .ai/harness/runs/brc10-reclaim-time-boundary.pre-fix.log (2 pass, 3 fail, PRE_FIX_EXIT=1).

## Acceptance boundary

This is an independently reviewable BRC10 prerequisite, not whole-row BRC10 completion. BRC9 final CI 34059698519 passed on 2b611fc9 before this product correction. Later campaign wiring must establish actual liveness policy and process quiescence authority; command exit, PID or prompt identity is not proof that descendants stopped.

User explicitly delegated acceptance and PR merge for BRC10–15. Real canary target/profile selection remains pending; this prerequisite has no external mutation other than its authorized PR delivery.

Development checks: new regression plus existing #286 suites pass, 13 tests / 39 assertions. The real-process barrier proves competing consumers see the same receipt and exactly one succeeds.
# Publication evidence

> **Substantive Change SHA256**: `sha256:975390f95e44ab3987b5d7b18fd75c2f9ea99a1d12d290e58f2ef31a145ba020`

Publication range: merge-base/direct `2b611fc93a9f2ab9e2ac1eec23599aefe1796e08` to the archived prerequisite package. This binding covers the unchanged accepted source and regression; it does not claim whole-BRC10 acceptance.
