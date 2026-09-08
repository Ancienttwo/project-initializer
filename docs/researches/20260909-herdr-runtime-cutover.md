# Herdr runtime cutover

## Decision and ownership

Herdr replaces the tmux runtime prerequisite, peer terminal guidance, closed
notification executor and persistent Claude reviewer terminal hosting. New code
must not add tmux features or select tmux when Herdr is absent. Existing user
sessions are not stopped by installation or by this change.

Herdr 0.9.0 is the minimum supported CLI contract. The implementation uses the
installed schema and upstream herdrdev/herdr at
`b99002ac99b09e00b4ca692436cb15a6b0d676f1`: `src/app/api/agents.rs`,
`src/api/schema/agents.rs`, `src/app/api/panes.rs`, `src/session.rs`, and the
`docs/next/website/src/content/docs/agent-automation.mdx` documentation.

## Notifications

`herdr-cli-agent` replaces the public adapter/provider identifier. The Host
resolves each current binding to an explicit named Herdr session and a unique
live Agent name. The Host must not reuse that name for a different binding.
The shared CLI helper removes inherited Herdr socket/context variables so a
calling pane cannot silently retarget an explicit session.

The executor submits only the existing bounded opaque control reference with
`agent prompt`. It does not start endpoints, introduce a dispatcher, submit
message bodies or interpret terminal text. The CLI call has a 10-second bound.
A valid `agent_prompted` response for the resolved name records transport
acceptance. Missing/blocked/not-ready targets fail without terminal input.
Timeout, malformed output or an unrecognized failure remains `unknown` because
input may already have been written; the executor never retries or selects
another transport. Task/Module receipts and controller-step receipts still own
effect success. Herdr's lifecycle wait is not an individual message ACK.

## Persistent reviewer

One task/worktree review session owns a uniquely named headless Herdr server.
A private generated config disables update checks and Agent restore; its shell
launcher execs the existing Bun review host without user shell startup files.
The CLI returns the pane ID; the host records its inherited pane context.

Herdr's process-info exposes the pane shell PID, not server identity. The caller
records the spawned server PID and OS PID/group/start/executable identity.
Before review operations, the host must match the pane shell PID, its OS parent
must be that server, and the provider must retain its recorded identity.
The provider continues to use the existing read-only stream-json protocol,
request/result files, startup serialization, three-round budget and exact
AcceptanceReceipt. No provider/model defaults change in this migration.

A durable server-start intent is written before spawning. If the caller dies before
server identity publication, cancellation refuses to claim closure and status stays
`cleanup_pending`. A caught publication failure kills and reaps only the caller-owned
child before recording server closure; a mismatched closure proof cannot clear an
unresolved intent.

Close shuts down the provider and host, then stops the exact recorded server
only once its workspace list is empty. A live extra pane blocks server cleanup;
it is preserved for inspection. A missing host permits explicit cancellation of
only the identity-checked detached provider. Server identity mismatch refuses
cleanup before signalling a replacement. Provider closure and server closure
are separate evidence: status reports `cleanup_pending` until server cleanup
is recorded. Repeated close can finish that cleanup without resubmitting work.
The existing POSIX process-group requirement remains; Windows users need WSL.

## Upgrade and rollback

1. Freeze new tmux work and finish or explicitly cancel existing review sessions
   using the previous repo-harness version. Keep its binary available until those
   sessions are drained; new protocol-2 review metadata does not read protocol 1.
2. Install Herdr >=0.9.0 and run `repo-harness setup check`. The required runtime
   is `runtime.herdr`; tmux presence no longer satisfies readiness.
3. For repositories with Agent Runtime configured, update the exact adapter key
   to `herdr-cli-agent` while preserving its intended mode. Retire old live
   effects and explicitly rebind endpoints/re-record capability observations
   through the existing owner workflows. Do not translate opaque endpoints,
   claims, receipts or persisted historical effects in place. Historical tmux
   runtime records are unsupported by the new reader; retain them as archived
   evidence outside the active runtime store after owner-approved drain.
4. Refresh managed global guidance using the normal installer/update flow.
   It contains one Herdr path and never falls back to terminal keystrokes in tmux.
5. Rollback requires draining the new owned reviewer sessions before reverting
   the cutover and restoring the old runtime configuration. No automatic dual
   reader, alias, policy migration or session recovery is provided.

The self-host Agent Runtime remains off. No running user session, global
installation, remote branch or published release is changed by local tests.

## Verification boundaries

`tests/herdr-transport.test.ts` runs a real Herdr server and a deterministic
raw-input process under a recognized executable name. It checks busy-state
submission, bracketed multi-line Unicode input, blocked/closed peers and
fresh-connection reads without replay. It does not claim actual Codex execution.

`tests/claude-review.test.ts` runs real Herdr with a deterministic stream-json
provider and the real acceptance writer. It checks same-child FAIL/repair/PASS,
stale/duplicate/ambiguous rounds, concurrent calls, provider crash/deadline,
startup cancellation, lost-host cleanup, server identity mismatch and sentinel
isolation. These tests establish lifecycle/receipt mechanics, not model judgment.
Readiness, rendering, adoption dry-run/apply and shared enum consumers have
focused regressions. At ten times concurrent reviews, per-server/provider memory
and startup cost are the likely limit; no new scheduler is introduced.
