# Implementation Notes: brc354-preparation-recovery

> **Status**: Active
> **Plan**: plans/plan-20260908-1826-brc354-preparation-recovery.md
> **Contract**: tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md
> **Review**: tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md
> **Last Updated**: 2026-09-08 18:26
> **Lifecycle**: notes

## Design Decisions

- Continue #360 on f9e24f50 in its existing worktree. Reuse only preparation consumer logic from superseded exploratory b7d9a55d; keep #360 account-owned journal root, canonical path checks, mount-overlap validation and the kill/exit race repair unchanged.
- The existing journal namespace is addressed by a deterministic 128-bit digest of canonical common-directory and complete runtime identity. Full request/identity checks remain authoritative; an address collision refuses creation rather than borrowing another request. No new business identity or authority store is introduced.
- Persist preparation before calling runtime. Probe and workload retain separate role/phase identities. The original deadline fences delayed starts; recovery never renews it and never issues create/start. Missing request/object or daemon uncertainty remains unknown.
- A pre-launch preparation has no execution reservation. Recover it as preparation_interrupted_reconciliation_required without a final, new Claim, or invented charge. A later verifier preparation belongs to the existing attempt and consumes the established single-settlement path.
- Fix no-start reclaim observation to require protected preparation inactivity. The regression failed with reclaimable before the patch and passes after.

## Evidence

- Before: tasks/evidence/20260908-brc354-preparation-before.log (one failing actual consumer assertion, PRE_FIX_EXIT=1).
- Development: /tmp/brc354-preparation-after.log (one pass); /tmp/brc354-preparation-consumer-dev.log (two OS controller deaths, actual prepareChild and actual recovery, 23 assertions, zero failures). These use a subprocess-only historical admission mock, real Docker versions and no model workload.
- Adapter development: /tmp/brc354-preparation-adapter-dev.log. Final canonical verification separately records frozen acceptance.
- Original #360 failures and baseline receipts remain historical; new protocol behavior requires current Docker and consumer verification. No full local suite is added: named lifecycle, closeout, containment, failure, helper and runtime tests cover all modified paths.

## Remaining boundary

Container retention/cleanup is still separate. Unknown/never-created daemon objects remain conservative failures; this is not approval for active, BRC14/BRC15 live acceptance, merge or release.

- Additional development: /tmp/brc354-preparation-settlement-dev.log (one pass, 16 assertions). A verifier preparation with an existing attempt settles exactly once, retains original owner and replays without charging again.
- Pre-launch handling is restricted to missing invocations. The separate reservation-before-launch-record window after a full invocation is not reclassified as an uncharged preparation; it retains the existing fail-closed recovery path.

Follow-up scope:
> **Substantive Change SHA256**: `sha256:baa4d6c1005465cd8c3eaca2181ec4f6752cedb084a4c7ab8bf4669c879cb068`

Complete PR scope:
> **Substantive Change SHA256**: `sha256:738c6f2ef4393961100b88b49a08e9183e7b0dc155d7cd39209d1a219f0897d1`

## Frozen verification and handoff transition

All 26 contract checks passed on 6740b6e9 with the pinned image enabled: lifecycle vx-354cdd76279743f9a206 (126333 ms), Docker vx-bde4860757e842ca8d01 (91162 ms), closeout/failure vx-2c6336b1b9c14281a7b8 (109134 ms). The wrapper remained failed because Change Assessment lacked the deterministic_test oracle declaration. Add the oracle for the already executed actual reclaim regression; preserve all execution records with source/image delta checks. This is not a test waiver or a replacement full-suite claim.

During execution, remote #360 was merged by another executor as main a1393e44. `git diff --quiet f9e24f50 a1393e44` returned zero: identical trees, no implementation input drift. This approved slice continues as branch codex/brc354-preparation-recovery and a follow-up PR; it does not push into the merged #360 or reopen a duplicate task.
