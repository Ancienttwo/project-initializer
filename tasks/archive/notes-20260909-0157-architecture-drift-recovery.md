> **Archived**: 2026-09-09 01:57
> **Related Plan**: plans/archive/plan-20260909-0130-architecture-drift-recovery.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260909-0157
> **Archive Projection V1**: `plans/plan-20260909-0130-architecture-drift-recovery.md` => `plans/archive/plan-20260909-0130-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/notes/20260909-0130-architecture-drift-recovery.notes.md` => `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0130-architecture-drift-recovery.contract.md` => `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0130-architecture-drift-recovery.review.md` => `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`

# Architecture drift recovery decisions

- Preserve the v1 five-field batch; lexical historical validation and live pending-path checks serve different purposes. Never reinterpret a symlink target as the frozen source path.
- An external cursor is not a coverage receipt. Finish an existing suffix without cursor rollback, then observe the newer range in a later window. If the provider stays enabled, the legacy batch remains retained until legacy recovery; it is never silently discarded.
- All four cursor consumers share the existing directory lock. The public writer requires expectedCursorSha; legacy and publication use the private writer while holding the lock. Publication performs its proof checks in the transaction.
- Empty-directory reclaim uses the existing lock protocol. Tests SIGKILL actual acquisition/release code at filesystem barriers and age only fixture directory timestamps.
- Regressions are in tests/architecture-drift-recovery.test.ts. Pre-fix evidence is .ai/harness/runs/architecture-drift-recovery/pre-fix.log (8 failures, 6 controls passed for the final regression file).
- archctx and archctx-contracts are exact-pinned to 0.5.8 across runtime, initialization and test fixtures. Existing packed 0.5.7 evidence remains historical; package-local 0.5.8 capabilities were independently read.
- No new dependency or product storage abstraction. The new test file owns isolated subprocess barriers; generic lock implementation is unchanged.
- No global installation or real downstream cursor/backlog mutation is authorized by this slice's installation hold.

> **Substantive Change SHA256**: `sha256:92864d8ad785d45324eb25384e5fbc5679d933e6d2b35d2d22a91fe30ce78848`

- One blocking test fixture adjustment: provider timeout tests previously spent the same 500 ms finding the host Node binary, so canonical runs could time out before creating the descendant PID file. Resolve the compatible Node before the timer and supply its explicit path; the provider deadline and descendant-death assertion are unchanged. Pre-fix failures: verification-vx-b8906cd775c14c63ad32.log and verification-vx-80425b00b1074b978c21.log; corrected file passed 27 tests via the package test command.
- Acceptance runs before final freeze remain failed evidence. In particular, editing the fixture while the previous run was finishing invalidated four otherwise exit-zero snapshot checks; they are not passes. Final acceptance must use the stabilized tree with no concurrent edits.

- Final prepared verification: all 35 checks passed; AcceptanceReceipt recorded and finalization passed without rerunning checks. Execution diff base was explicitly pinned to 1f1dad978a5583928956e844f66cb14c965b4766. Receipt target observation records origin/main at 4893cf82021a7b8eabfde2ed9995b7cc6532bd9c; this is a target observation, not merged-tree verification.
- Local workflow finish remains blocked by base_ref_unsynchronized: shared main is behind origin/main and contains preserved uncommitted version-pin work plus an independently changed projection manifest. Do not archive this active slice as merged or clean shared main automatically. Next slice: reconcile shared main ownership, integrate this branch, and validate the bounded integration delta before any downstream installation.

- User approved latest-main integration and bounded downstream recovery. Main dirty files were byte-verified as the duplicated dependency bump; the manifest delta contained only provenance/digest fields. Original patch preserved at .ai/harness/runs/architecture-drift-recovery/integration/main-duplicate-wip.patch before reverting duplicates and fast-forwarding main.
- Upstream campaign commit merged without source conflicts. Generated manifest and ledger timestamp were resolved to upstream, with manifest scheduled for canonical regeneration.
