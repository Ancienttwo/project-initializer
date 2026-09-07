# BRC13 Issue closure and exact cleanup

Status: implementation in progress; not accepted or merged.

The implementation uses the existing campaign planning journal, one automation budget store, publication reconciliation and contract-worktree cleanup. The transaction starts from a durable completed worker antecedent and the current reviewing Lease. It joins canonical adoption slots to immutable Issue ids; every mapped Task must supply actual merged-PR evidence before the Issue closes.

## Authority boundaries

- `campaign-worker.ts`: original or recovered WorkEnvelope and ClaimActor antecedent, exact final budget settlement, and the existing runtime inactivity observer.
- `publication-receipt.ts`: one decoder for actual Provider mergeCommit, shared by ordinary and campaign-budgeted observations.
- `publication-lifecycle.ts`: freshly fetched target, exact publication identity, actual merge reachability, persisted integration and reviewing Lease release. The campaign consuming proof is persisted before release.
- `campaign-not-planned.ts`: committed typed falsifier decision, exact canonical acceptance verification, and proof that all Issue members remained non-admitted during planning. Generic not_reproducible labels are insufficient.
- `campaign-closeout-provider.ts`: persisted mutation intent, two-call reservation, immutable started/result phases, mandatory readback, no repeat unknown mutation.
- `coordination-worktree-topology.ts`: shared bind/cleanup barrier, live worktree identity and foreign Lease checks.
- `contract-worktree.sh`: expected worktree/head/target/merge inputs, worktree removal followed by local expected-OID ref deletion.
- `development-campaign-store.ts`: shared audit/next-group admission refuses published Tasks without cleanup receipts.

A receipt describing Provider completion does not establish that detached commands stopped writing. BRC10's unknown inactivity remains unknown during BRC13 cleanup; this transaction does not invent containment. Dirty work and moved refs also remain pending.

The current readback window for an Issue comment is 100 comments. An unconfirmed bounded observation keeps the reservation unresolved and never licenses a duplicate comment. Real campaign activation and BRC6a trusted revision readback are separate gates.

Verification and remaining implementation details are owned by `tasks/contracts/20260907-1224-brc13-closeout.contract.md` and its notes. No production campaign, Issue mutation or user worktree cleanup was executed while developing this package; external effects in the tests use disposable Git repositories and Provider fixtures.
