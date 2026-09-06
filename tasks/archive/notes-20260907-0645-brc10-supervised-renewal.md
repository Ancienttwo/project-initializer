> **Archived**: 2026-09-07 06:45
> **Related Plan**: plans/archive/plan-20260907-0557-brc10-supervised-renewal.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0645
> **Archive Projection V1**: `plans/plan-20260907-0557-brc10-supervised-renewal.md` => `plans/archive/plan-20260907-0557-brc10-supervised-renewal.md`
> **Archive Projection V1**: `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md` => `tasks/archive/notes-20260907-0645-brc10-supervised-renewal.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md` => `tasks/archive/contract-20260907-0645-brc10-supervised-renewal.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md` => `tasks/archive/review-20260907-0645-brc10-supervised-renewal.md`

# Implementation Notes: brc10-supervised-renewal

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0557-brc10-supervised-renewal.md
> **Contract**: tasks/archive/contract-20260907-0645-brc10-supervised-renewal.md
> **Review**: tasks/archive/review-20260907-0645-brc10-supervised-renewal.md
> **Last Updated**: 2026-09-07 05:57
> **Lifecycle**: notes

## Decisions and boundaries

- The current campaign grant owns renewal policy; its absence refuses new execution without changing historical grants.
- The runner observes only its owned process group. Provider terminal state remains unknown and no automatic reclaim consumes this slice.
- A reused output directory is cleared of the previous bounded result before the next invocation, so a killed supervisor cannot supply stale quiescence evidence.
- Parent ownership is validated before liveness policy, preserving the existing refusal boundary while both remain before acquisition effects.

## Remaining BRC10 work

Full provider terminal authority, journal-based recovery and reclaimed-worktree re-entry remain pending in `plans/plan-20260907-0554-brc10-lifecycle.md`. This slice does not close the Sprint row.

## Evidence and promotion

The owning contract declares the canonical checks; `.ai/harness/checks/latest.json` is the materialized acceptance input. Durable behavior and limits are recorded in `docs/researches/20260907-brc10-supervised-renewal.md`.

The missing-index proof candidate was reconciled through the existing deterministic command after indexing and materializing current projections; reconciliation receipt `sha256:da951802d4fd9ca7edf2950676ad2be74f657c8f61b489b2e383ec9f078337ec` records an empty noop proof. No architecture gate was changed.

## Blocking policy serialization correction

- root_cause: `src/core/state/lease-liveness.ts:107` compared JSON property order with builder order; canonical grant storage sorts nested keys, so an unchanged authenticated policy failed on readback.
- repro: `bun test --timeout 60000 tests/unit/brc10-supervised-renewal.test.ts`
- regression_guard: `tests/unit/brc10-supervised-renewal.test.ts` covers reordered valid policy and rejects stale values, forged digest and extra keys.
- pre_fix_failure_artifact: `.ai/harness/runs/brc10-liveness-policy-pre-fix.log` records 2 pass / 1 fail and `PRE_FIX_EXIT=1`.

This is the first directly blocking out-of-scope correction. Exact field validation and the builder-owned digest remain authoritative; no stored policy is rewritten or inferred. A second out-of-scope discovery stops this package for disposition.
## Publication evidence

> **Substantive Change SHA256**: `sha256:c961204e64ded2134d1ecbbafa5919948ae461597f133b1276ffdf8c674c401c`

The archived package is bound to the direct/merge-base publication range from `188ae3529695623022c015c0cae0f7ec0b1304a4`. Source and tests are unchanged from the accepted subject; this metadata does not claim full BRC10 completion.

## PR CI observation correction

PR #337 CI `34065120741`, subject `22e009e6fd401d0fc51fe79c041c5f5a4e42ca65`, failed only the new `real supervised campaign child renews while alive and persists scoped quiescence` test. All three MCP platforms passed. The Test log reported `LeaseLivenessStoreError: lease liveness pointer is stale` at the concurrent polling read in `tests/effects/campaign-worker.test.ts`; the remaining test files passed. This is failed CI evidence, not a full-suite pass for that subject.

Root Cause Evidence:
- `root_cause`: The test read the generation projection and task pointer without the Task lock while the real child updated them under that lock. The store intentionally rejects a pointer/current mismatch; the observer could straddle a valid renewal.
- `regression_guard`: The existing real-child renewal test retains its while-alive observation, minimum renewal sequence, generation and scoped quiescence assertions. Its polling read now shares the writer's Task lock, making the multi-file snapshot coherent without swallowing conflict errors.
- `pre_fix_failure_artifact`: GitHub Actions run `34065120741`, Test/CI gate, `2026-09-06T22:58:12Z`, `tests/effects/campaign-worker.test.ts:42` (local copy `/tmp/brc10-renew-ci-failed.log`).
- `behavioral_delta`: Test-only snapshot synchronization; no production behavior or provider/Lease authority change.

Targeted verification: `bun test tests/effects/campaign-worker.test.ts --test-name-pattern 'real supervised campaign child renews' --timeout 60000` passed (1 test, 7 assertions). The earlier semantic review and canonical acceptance remain evidence for their original subject. This post-acceptance CI correction is limited to the polling observer; required repository integrity checks and subsequent PR CI validate the corrected publication subject. No local full suite is warranted for the test-only lock correction.

> **Substantive Change SHA256**: `sha256:2c35eeb1c742ae55dffed660dba8058fe35814b148a548d65279fea978a02e1b`

The correction is bound to the complete PR publication range from `188ae3529695623022c015c0cae0f7ec0b1304a4`. Existing archived evidence is eligible in that range because this package adds it; an incremental working-tree check does not admit an edit to an already archived artifact as new workflow evidence.
