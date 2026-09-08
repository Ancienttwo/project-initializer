# Campaign independent supervision

Managed campaign invocations use a pinned local Docker image and a Linux Docker 28.3.2 daemon (API 1.51). The image PID1 owns an absolute deadline and drops the workload to the host non-root UID/GID with no capabilities. Namespace exit terminates detached descendants. The immutable root filesystem, exact bind inventory, read-only common Git mount, resource limits, no restart policy and daemon configuration are checked before start and again at terminal readback.

The account-level `repoHarnessHome(process.env)/campaign-containers/<uuid>` is the controller authority. It is canonicalized and must not overlap any mount source, including the optional exact auth file. A handle or modified worktree Git pointer cannot select another authority root. Request, created, start, terminal and interruption records are atomically published without overwrite. The controller hashes the streams held in memory; `contract-run` writes only copies into the worktree through descriptors opened before launch. The terminal consumer validates the protected original request, dispatch/claim/generations, invocation arguments, probe receipt and terminal stream hashes. Replacing worktree logs and local summaries does not replace that authority.

Controller-loss recovery consumes the original expired invocation and daemon inactivity. It never starts a container or invents provider output. An interruption settlement remains reconciliation-required; recorded final settlement and retirement remain available. This protocol cutover does not add a legacy host receipt reader.

`BRC_CAMPAIGN_IMAGE` is an exact local image ID; `BRC_CAMPAIGN_AUTH_FILE` is optional operator input. The controller's existing `REPO_HARNESS_HOME` selects host storage and must be inherited consistently by recovery processes. The Docker socket and host journal are not mounted. Codex model/effort selection remains the existing role configuration; this integration does not introduce a model override.

Production active admission remains closed after revision and budget validation. This integration is not BRC14/BRC15 real campaign acceptance and does not change Owner's BRC6a closeout. No real provider execution is used by the model-free tests: they substitute a synthetic executable; the real Codex binary is invoked only with `--version` or cancelled before start.

The source and packaged contract-run helper must remain byte-identical. Docker tests cover actual worker/verifier Git execution, mount visibility, simultaneous post-exit log/summary replacement, identity substitution, symlink/FIFO attacks, detached descendants, deadlines, cancellation, controller loss and atomic interruption publication. Offline readback tests use the preserved Docker 28.3.2 fixture directly against the production validator.

## PR #360 delta and remaining acceptance boundary

The post-archive delta at 22b9032c keeps containment fixtures outside Linux /tmp, including the fixture home that owns execution worktrees. Only these fixtures select /var/tmp on Linux; ordinary adoption fixtures retain their default. Production containment restrictions are unchanged. The newly added extensionless path-array exemption also rejects unknown high-entropy path segments through the existing redaction pass.

The three affected lifecycle/closeout files passed in a no-network Linux test container: 37 passed, one nested-Docker case skipped, zero failed. The evidence/projection regression set passed 43 tests. The skipped case and sixteen Docker supervision checks retain their original image-enabled baseline identities; neither the baseline AcceptanceReceipt nor these offline results prove current live campaign readiness. See tasks/reviews/20260908-brc354-ci-delta.review.md for exact evidence references.

Recovery acceptance currently covers an already persisted invocation, exact-container inactivity, original deadline and no-restart settlement. Controller loss before durable invocation publication is not established by that evidence. Successful container/journal retention also needs an explicit cleanup contract compatible with later exact-container readback; unconditional removal would invalidate that recovery dependency. These were the outstanding boundaries at PR #360; the following closeout defines their fail-closed and retention contracts. Active remains disabled and BRC14/BRC15 live acceptance remains outstanding.


## Preparation loss and retention contract

Before the first asynchronous preparation step, the campaign controller publishes an immutable `preparing` record bound to dispatch, role, task/revision, claim, lease/binding generations and the original bounded deadline. Retirement and preparation share the planning lock. A duplicate preparation cannot restart a probe; retirement prevents new preparation. The invocation remains the executable authority and is published only after the protected probe and workload handles exist.

A preparation record without its complete invocation is unresolved supervision. Reclaim never treats a missing `started` record as inactivity in this state, and reconciliation refuses before settlement or ownership change. A complete invocation without `started` also needs the existing expired-deadline interruption proof. This is fail-closed crash handling, not reconstruction of missing provider output or a promise of automatic recovery from partial preparation. The active gate remains closed.

Container retention is deliberate until the original deadline has expired. The explicit operator command is:

```sh
bun scripts/cleanup-campaign-container.ts <absolute-protected-journal-directory>
```

The operator selects one existing journal under the configured account-level harness home; the command reads its immutable `created` handle rather than accepting a supplied Docker name or digest. It verifies request/daemon/container identity, original expiry and inactivity, then atomically publishes the interruption proof before removing that exact container without force. It reads absence back from the same daemon and publishes a cleanup receipt. Configuration drift, live state, missing created authority and unavailable Docker all refuse deletion. A crash after removal is retryable from the retained interruption record without re-running the workload or creating terminal output.

Protected request, configuration, created, start, terminal, interruption and cleanup records are retained; there is no TTL deletion or broad prune. Later terminal/recovery consumers keep reading those same immutable proofs even after container removal. Container cleanup grants no dispatch settlement, Lease reclaim, worktree deletion or release authority. Partial preparation lacking a complete handle stays operator-attention-required; filesystem/name scanning cannot manufacture its missing invocation authority. Journal storage grows with invocations and remains the explicit storage tradeoff until a separately authorized evidence archival policy exists.

The closeout regressions include real controller SIGKILL at protected probe/workload request and created publication, and immediately before/after planning invocation publication. They exercise actual reclaim/reconciliation consumers and retain the original simultaneous log/summary substitution tests. Cleanup tests cover original deadline refusal, CLI removal, terminal-consumer equality after both containers are removed, interruption replay after removal/publication loss and configuration-drift refusal.
