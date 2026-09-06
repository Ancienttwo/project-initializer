# Implementation Notes: brc10-reclaim-time-boundary

> **Status**: Active
> **Plan**: plans/plan-20260907-0507-brc10-reclaim-time-boundary.md
> **Contract**: tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md
> **Review**: tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md
> **Last Updated**: 2026-09-07 05:07
> **Lifecycle**: notes

## Decision

The input receipt is historical evidence; its observation timestamp must stay immutable. The consumer revalidates historical bytes against current owner/evidence, then independently evaluates eligibility at actual consumption time. Reusing the old clock as the current clock would hide clock regression and is rejected. No schema, policy default or alternate owner store is introduced.

## Root Cause Evidence

- root_cause: automaticReclaimLease reclassifies with a fresh classified_at and compares the full digest against the historical receipt; elapsed time alone changes that digest.
- repro: bun test --timeout 60000 tests/unit/brc10-reclaim-time-boundary.test.ts
- regression_guard: tests/unit/brc10-reclaim-time-boundary.test.ts
- pre_fix_failure_artifact: .ai/harness/checks/brc10-reclaim-time-boundary.pre-fix.log (2 pass, 3 fail, PRE_FIX_EXIT=1).

## Acceptance boundary

This is an independently reviewable BRC10 prerequisite, not whole-row BRC10 completion. BRC9 final CI 34059698519 passed on 2b611fc9 before this product correction. Later campaign wiring must establish actual liveness policy and process quiescence authority; command exit, PID or prompt identity is not proof that descendants stopped.

User explicitly delegated acceptance and PR merge for BRC10–15. Real canary target/profile selection remains pending; this prerequisite has no external mutation other than its authorized PR delivery.

Development checks: new regression plus existing #286 suites pass, 13 tests / 39 assertions. The real-process barrier proves competing consumers see the same receipt and exactly one succeeds.
