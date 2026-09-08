> **Archived**: 2026-09-08 17:11
> **Related Plan**: plans/archive/plan-20260908-1627-brc354-independent-supervision.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-1711
> **Archive Projection V1**: `plans/plan-20260908-1627-brc354-independent-supervision.md` => `plans/archive/plan-20260908-1627-brc354-independent-supervision.md`
> **Archive Projection V1**: `tasks/notes/20260908-1627-brc354-independent-supervision.notes.md` => `tasks/archive/notes-20260908-1711-brc354-independent-supervision.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md` => `tasks/archive/contract-20260908-1711-brc354-independent-supervision.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md` => `tasks/archive/review-20260908-1711-brc354-independent-supervision.md`

# Independent supervision integration decisions

- Reuse `1d0c65a7` production containment components, not its old workflow state. Integrate on `d4852017` and retain the later finalization/FIFO/cancellation fixes.
- Controller authority uses the existing account-level process configuration, never a worker-selected Git path. Canonicalize the test home because macOS temporary paths may alias `/private`; explicitly inherit this configuration in spawned recovery tests because Bun snapshots child environments.
- Historical lifecycle tests model protected producer records for finalization; real Docker tests independently exercise actual producer/consumer boundaries. Neither is a real model canary.
- The Docker handoff recovery test uses a real version probe and a never-started worker container. Its observed result is reconciliation-required, charged once with no new lease owner.
- Development evidence: `/tmp/brc354-docker3.log` has 15 passes; `/tmp/brc354-spec.log` has 12 passes. The lifecycle baseline had one child-home mismatch; `/tmp/brc354-recovery-delta.log` verifies that fix and real never-started Docker recovery (2 passes). Final canonical verification owns acceptance.
- No runtime active admission change. No dependencies added. New containment core/effect own exact Docker configuration and host producer authority; the image/PID1 supplies the independent process boundary; new tests and the saved fixture exercise those actual boundaries.

> **Substantive Change SHA256**: `sha256:50a35e2971b83e9824b5c2502a8a848136cb5c89eee28ce9c242949c652edfd6`

- A stale running inspect followed by namespace exit made kill return nonzero. The controller now always requires fresh same-container inactivity readback within the original cleanup deadline. Deterministic regression failed before and passed after (`/tmp/brc354-kill-race-{before,after}.log`). Retain immutable lifecycle verification `vx-a9feb18d252440e5a024`; repeat only the Docker boundary and typecheck for this production delta.

- One directly blocking out-of-slice fix: evidence redaction treated the declared extensionless Dockerfile path as a secret-like token, invalidating the Change Assessment fingerprint after materialization. Preserve only structurally declared safe relative path-array entries; known-secret filtering remains unconditional. The exact regression failed before and all 42 event-store/projection checks passed after. Use the candidate local CLI to validate its own corrected producer; do not modify the installed global package.


## PR360 review delta: extensionless token segment

The automated P1 on cb0967fe was reproduced before the fix: the newly introduced extensionless path-array exemption persisted an unknown token segment verbatim. Restrict that new exemption to segments that do not match the existing entropy threshold; longer segments keep the existing entropy pass. This preserves Dockerfile and does not broaden or replace the historical scalar/path-extension policy.

Regression: `tests/evidence-event-store.test.ts`, test `declared extensionless path arrays still redact unknown token segments in the ledger`; `/tmp/brc360-path-token-before.log` failed before the change, and `/tmp/brc360-path-token-after.log` records 43 passing evidence/projection tests, zero failures. The before/after samples use synthetic tokens, never credentials.

The Docker/core automation/source-and-packaged-contract-run inputs remain byte-identical to d2e311f4. Retain vx-c16e467c5e8849cd8928 and vx-a9feb18d252440e5a024 with the declared delta checks; do not relabel the old complete-subject receipt for this redaction change. This remains the same one directly blocking evidence fix, not a second unrelated change.

Container retention (P2) remains a bounded follow-up before active enablement: current production recovery re-inspects a known exact container and cannot treat removal as inactivity. Adding unconditional docker rm at terminal publication would break that readback. No automatic retention/cleanup change is included in this review delta; active remains closed. Preparation before invocation publication is likewise not covered by the existing recovery acceptance.



## PR360 Linux fixture delta

CI run 34208739336 at cb0967fe passed workflow evidence checks but failed campaign-finish-failure-audit, effects/brc10-lifecycle and effects/campaign-closeout: the historical fixture placed its repository and execution worktree below Linux /tmp, a reserved container destination. macOS resolves that temporary prefix to /private/tmp and masked the conflict. Keep buildContainmentSpec unchanged; opt the historical helper into isolated home-based temporary roots for both repository and fixture home (which owns execution worktrees). Other adoption fixtures retain their original temporary placement. Existing cleanup owns both allocated roots.

CI log: /tmp/brc360-ci-cb0967fe-failed.log. Local Linux diagnostic 1 (/tmp/brc360-linux-fixture-after.log) moved only the repository and still failed worktree mounts (17 pass, 1 skip, 20 fail). Diagnostic 2 moved both roots: containment failures disappeared, but the campaign runtime image lacked the CI test prerequisite jq (29 pass, 1 skip, 8 cleanup failures). These failed records remain retained. Final linux-lifecycle uses a separate local test image built from the unchanged campaign image with jq installed; it does not change the managed workload image.

The canonical verification owns the final Linux delta result. No local full suite is needed: the three affected files trace all modified historical fixture consumers; unchanged Docker suites and production paths retain their original bounded evidence. CI retains its full-suite requirement.

> **Substantive Change SHA256**: `sha256:60cba9a0a635cfb533e7693c7e15155120674822c711e4c119e255002c311575`
