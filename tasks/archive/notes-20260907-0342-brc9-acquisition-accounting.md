> **Archived**: 2026-09-07 03:42
> **Related Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0342
> **Archive Projection V1**: `plans/plan-20260907-0116-brc9-acquisition-accounting.md` => `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0116-brc9-acquisition-accounting.notes.md` => `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0116-brc9-acquisition-accounting.contract.md` => `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0116-brc9-acquisition-accounting.review.md` => `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`

# Implementation Notes: brc9-acquisition-accounting

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Contract**: tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md
> **Review**: tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md
> **Last Updated**: 2026-09-07 01:16
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:fda6a1a7a576c4faea1f7ddbe42232548191a3b8f07bce8b7eb2a17e2bac158e`
> **Substantive Change SHA256**: `sha256:eb1143f68719fab328d76c07b8f3bbbba3bccadedc7f35a96929592d92325b68`
> **Substantive Change SHA256**: `sha256:8c7cf9f768bca3b90d32764b1f816e875eac722035c37bb4740923666652639d`

Final integrated publication delta against `07f5f744`, measured after architecture projection:

> **Substantive Change SHA256**: `sha256:92fd7910093d4dcfe21fbe13bdd58d683b3d843677be9257e9e2776ed5b959b1`

Final corrected publication against `07f5f744`, after contention fix and projection:

> **Substantive Change SHA256**: `sha256:2e0648adae0ce66660484313d53e7493c7ffdba7502f2de61fe2430eb2f29c58`

The original FAIL and corrected prepare retain their original subjects. Main integration adds the accepted shadow/active adoption packages and audit documents; acquisition and Engineer rollback production changes remain the reviewed correction. The one-review boundary requires Owner acceptance after the P1 fix, not another external review.

## Design Decisions

- Serialize only the acquisition transaction with the existing campaign mutation lock; release it before worker execution. The generic budget remains the sole arithmetic authority. A new campaign budget kind would duplicate an already supported operation.
- Store immutable request/admission and result in the existing group record store. Persist the result before usage so replay can finish an interrupted usage write without acquiring again. An admission without a result requires reconciliation.
- Chain subsequent idle attempts because canonical acquire-next deliberately does not cache no-eligible results. Successful acquisition replay reuses the original charge, including after budget exhaustion.

## Deviations From Plan Or Spec

- One directly blocking adjacent-boundary correction: formal review proved `src/effects/engineers/acquire.ts` discarded Lease readback classification and called an unknown post-acquisition state a receipt failure. Preserve `unknown` as `rollback_failed`; no new rollback mechanism or foreign-claim mutation. Scope and the Engineer acquire neighbor check were added before the source edit.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Serialize acquisition transaction | Selected | Preserves the existing unresolved-reservation invariant and concurrent live workers. |
| Admit concurrent unresolved generic reservations | Rejected | Broadens budget authority beyond this acquisition consumer. |

## Open Questions

- None.

## Evidence Links

- Integrated prepare run-20260907T032540-66097 exposed one contention failure: the second real Engineer timed out before entering the campaign admission lock. The diagnostics are `.ai/harness/runs/verification-vx-58c9785d63514cc2b723.log`; 13/14 acquisition tests passed and the other nine executable criteria passed. Only a timeout before entering that lock now returns observable idle, without reservation or acquisition. Inner lock failures and lost ownership remain errors because effects may require reconciliation.
- `/tmp/brc9-acquisition-contention-green.log`: the real two-Engineer cap test passed with `bun test --timeout 60000 tests/effects/campaign-acquisition.test.ts -t 'different authenticated Engineers share'`. `/tmp/brc9-acquisition-lock-boundary.log`: a separate process attempts acquisition while the parent holds the actual admission lock, returns idle and leaves ledger/reservations unchanged. `/tmp/brc9-acquisition-lock-type.log`: typecheck passed. An initial direct invocation omitted the repository's 60-second test timeout; that harness timeout is not product evidence.

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Pre-fix controls: `/tmp/brc9-acquisition-accounting-red.log`, two expected failures (missing successful acquisition charge and missing unresolved reservation).
- Development checks: `/tmp/brc9-acquisition-green.log` 12/12; `/tmp/brc9-acquisition-recovery.log` 1/1; `/tmp/brc9-acquisition-worker-neighbor.log` 9/9; `/tmp/brc9-acquisition-type.log` pass.
- Baseline: 80d7659207d2d7dbb3083fa0a30969651aacb9f3, CI 34047166164 passed as reported by its owner. This remains baseline evidence for that subject; named current checks cover the acquisition delta.
- Integrated target: cea2225e0ada0c9fdc383ab19974253724e3a41d. The observed upstream delta only archives the sprint-strict-queue-enforcement plan and adds its archival todo record; no production or test delta. Policy review base remains origin/main. The second digest binds the complete publication delta against this target.
- Original prepare: run-20260907T012919-8775, 14/14 with 9 executed checks, subject sha256:e5ec60e04a509d758ae0c8a601e4fb71dd46f7f98323641fca23b3b08669c4dd. Original official review FAIL is preserved verbatim in the review file. Neither is relabeled for the corrected subject.
- P1 delta: `/tmp/brc9-acquisition-unknown-lease-red.log` expected open reservation 1 / received 0; corrected `/tmp/brc9-acquisition-unknown-lease-green.log` 1/1. `/tmp/brc9-acquisition-engineer-neighbor.log` 5/5 covers own/foreign Claim compensation and principal fencing.

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
