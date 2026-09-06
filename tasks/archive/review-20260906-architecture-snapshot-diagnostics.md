> **Archived**: 2026-09-06
> **Outcome**: Completed diagnostic slice
> **Lifecycle**: review

# Architecture snapshot drift diagnostics

> **Status**: Completed
> **Scope**: approved bounded diagnostic slice
> **Verification Profile**: standard; focused behavior and repository-integrity checks
> **Substantive Change SHA256**: `sha256:6e7c593f15c1d04e97f453f50bf95e24e833105928b624d0ce719fa0f7f54d25`

## Root Cause Evidence

- root_cause: `src/effects/architecture/archctx-provider.ts` discarded the file inventory used by `captureArchitectureProjectionSnapshot`; `runArchitectureProjection` therefore reported aggregate mismatches without locating changed inputs. This is a diagnostic defect, not proof of a provider exclusion mismatch.
- repro: `bun test --timeout 60000 tests/architecture-projection-provider.test.ts --test-name-pattern 'snapshot paths|pre-provider drift|bounds snapshot diagnostics'`.
- regression_guard: the four named provider regression cases above, plus the existing committed-apply/receipt-delivery/noop lifecycle test.
- pre_fix_failure_artifact: `/tmp/rh-snapshot-diag-red.log` records 0 pass / 4 fail on the unfixed implementation; each new case failed because no diagnostic was emitted.

## Boundary and Review

- Production owner: `src/effects/architecture/archctx-provider.ts`; no schema, ignore policy, retry, writer ownership, or receipt acceptance change.
- Same traversal supplies the unchanged digest and in-memory diagnostic inventory. No dependency or persistence file was added.
- Pre-call path attribution requires a locally captured request inventory. Serialized requests report unknown inventory explicitly.
- At 10x repository size, file hashing remains linear; one additional pre-call capture is required. Diagnostic output retains at most 20 paths. Weak references avoid retaining completed request inventories indefinitely.
- Sibling sweep: CLI, orchestration, acceptance and refactor consumers all use this provider boundary; no second diagnostic implementation is needed. Existing apply reconciliation and refresh delivery counters remain asserted.
- Durable reasoning: `docs/researches/20260906-verification-execution-dataflow.md#architecture-snapshot-drift-observations`.

## Verification

- Focused provider/orchestration/acceptance/refactor regressions: 80 pass, 0 fail, 388 assertions.
- Typecheck: passed.
- All six repository-integrity checks passed; init dry-run reported zero operations. Final full-diff inspection found no blocking issue. This is parent-agent verification, not an external acceptance receipt.
- No local full suite: the named checks cover the changed snapshot/diagnostic and receipt-consumer behavior; CI retains its own required gate.
