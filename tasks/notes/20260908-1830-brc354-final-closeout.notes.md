# BRC354 closeout decisions

## Design Decisions

Preparation is a runtime effect even before worker admission. Its planning marker is written under the retirement lock before the first await. Unknown preparation fails closed instead of synthesizing a container identity or successful recovery.

Cleanup is operator-invoked for one existing protected journal after its original deadline. Durable interruption evidence precedes deletion. Journals remain the sole supervision authority for subsequent consumer readback; cleanup cannot reclaim a Lease or remove a worktree.

## Deviations From Plan Or Spec

None. Pre-publication loss is accepted as explicit supervision refusal, not successful automatic reconciliation. The existing active gate remains closed.

## Tradeoffs Considered

Immediate automatic removal was rejected because recovery depends on exact container readback until durable interruption publication. No TTL pruner or directory-scanning recovery authority is introduced. Missing created handles remain operator-attention-required.

## Open Questions

No new active enablement or release authority. BRC14/BRC15 live acceptance remains a separate pre-active boundary.

## Promotion Candidates

The stable loss/retention contract is recorded in docs/researches/2026-09-08-brc354-independent-supervision.md.

## Development Evidence

On main a1393e44 with only the guard added, both worker/verifier unpublished preparation tests failed with runtime_effect_inactive=true; .ai/harness/runs/brc354-pre-fix.log retains PRE_FIX_EXIT=1. After the fix they pass. Six actual Docker SIGKILL boundaries passed, and four targeted cleanup/race tests passed. These development results are not the frozen final acceptance.

> **Substantive Change SHA256**: `sha256:746d2ee729972f85d6f532ff0dc5c33b6c1d3431a082a13a0723667dfe826881`

## Final Review Preparation

Independent security and architecture passes found no introduced concrete issues across the frozen production/test diff and operator cleanup script. They ran no tests; the parent owns final executable evidence. Safety-sink review confirms exact protected journal selection, original expiry, non-force removal, durable proof before deletion and no worktree/Lease mutation.

The rebuilt npm tarball contains the cleanup script, production container module and packaged contract helper. An extracted-package smoke outside the checkout, using the existing installed dependency set and an isolated harness home, returned help=0, missing argument=2 and an untrusted directory=1. No global installation or package publication occurred.

The first acceptance preparation stopped before tests because the new worktree lacked the existing repository's CodeGraph cache. A consistent SQLite backup of that configured index was synced only in this worktree. Projection regeneration briefly changed generated metadata during snapshot capture; that failed run remains preserved. The stable check is an empty noop with unchanged flow-proof digest, allowing the existing proof-only reconciliation command to resolve the old unavailable-proof candidate without semantic approval or gate changes.
