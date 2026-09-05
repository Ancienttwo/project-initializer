# Persistent Claude review in tmux: protocol proof and integration boundary

## Decision and scope

The first approved slice was a live, isolated two-round experiment. The subsequent approved work-package implements the production lifecycle described below. The experiment establishes that Claude Code can remain in one process inside a tmux pane, review two different code subjects with retained conversation context, produce a separate structured result for each round, and exit on explicit cleanup without disturbing other panes.

The user accepts tmux as a repository-wide runtime prerequisite. The production implementation now connects required readiness, persistent review rounds and the existing AcceptanceReceipt authority; the earlier experiment remains baseline evidence only.

Prefer persistent `stream-json` for the first host-managed integration: its round completion signal was observed directly. A readable pane can show round identity, tool/activity events and findings. It is not the native Claude TUI; native interactive review with a narrow result-submit tool and hook notification remains untested.

## P1: boundaries observed before implementation

- `src/core/review/cross-review.ts` currently admits only `codex` and `codex-plugin`. Installed user-level `references/claude-mode.md` still describes a Claude provider; that installed document does not establish an executable repository provider.
- `src/effects/engineers/agent-runtime-adapters/tmux-cli-agent.ts` implements `notify_inbox` and `wake_for_offer` for an existing endpoint. Both the product spec and the adapter keep endpoint creation and message bodies outside that boundary.
- `src/effects/engineers/agent-runtime-effect-store.ts` owns the persisted effect chain and exact Engineer Binding fences. Task leases, message receipts, provider observations and acceptance remain separate authorities.
- `scripts/check-agent-tooling.sh` has no tmux prerequisite entry. `.ai/harness/policy.json` has the existing runtime adapters disabled.
- `scripts/acceptance-receipt.ts` and the existing verifier own acceptance. The fixture result below is provider/probe evidence, not an AcceptanceReceipt or permission to merge.

## P2: live experiment

Environment: macOS, tmux `3.7c`, Claude Code `2.1.258`, existing local Claude authentication. The probe used an independently named tmux server with an empty tmux configuration, a temporary directory, a reviewer pane and a separate sentinel pane. Six existing user panes were observed before and after without modification.

The pane ran a small Bun host that spawned one detached Claude child, retained its stdin across both rounds, consumed stdout as NDJSON and printed readable activity into the pane. The child had no built-in repository tools or MCP servers; both complete fixture versions were embedded in the inputs. User/project settings, hooks and session persistence were disabled for isolation. Authentication was inherited without copying credentials into evidence. This does not prove integration with normal project hooks, MCP tools or session recovery.

Invocation flags:

```text
claude -p --input-format stream-json --output-format stream-json --verbose
  --session-id <uuid> --no-session-persistence
  --tools '' --permission-mode dontAsk
  --strict-mcp-config --mcp-config '{"mcpServers":{}}'
  --setting-sources '' --settings '{"disableAllHooks":true}'
  --disable-slash-commands --no-chrome --json-schema <schema>
```

Each input was one newline-terminated JSON document. Stdin stayed open after each submission and after the second result:

```json
{"type":"user","session_id":"<uuid>","parent_tool_use_id":null,"message":{"role":"user","content":"<round identity and complete code subject>"}}
```

The result schema required `round_id`, `subject_sha256`, `remembered_marker`, `verdict` and `findings`. Each finding required `id`, `status` and `evidence`. The probe consumed only successful `type=result` events with `is_error=false`, the expected `session_id` and a valid `structured_output`. No screen text, assistant prose or transcript fallback supplied a verdict.

The fixture contract was inclusive clamping of finite numbers with `lower <= upper`:

| Round | Complete function body | Live review result |
|---|---|---|
| 1 | `return Math.min(lower, Math.max(upper, value));` | FAIL; `clamp-bounds` reported as new, with concrete wrong outputs |
| 2 | `return Math.min(upper, Math.max(lower, value));` | PASS; the same finding reported resolved, with current input/output evidence |

The second prompt did not repeat a random marker introduced in the first prompt. Claude returned the correct marker in both structured outputs. Both results came from child PID `22926`, process start `2026-09-06 02:55:38 +0800`, session `b46c33cc-99a7-4b1c-8a7b-d16ed31344c8`. PID, parent PID, process-group ID, start time and executable were re-observed at each result. The second result arrived at `2026-09-06 02:55:59 +0800`; the same process remained alive until explicit cleanup.

Both rounds emitted `system/init`; an init event is therefore not by itself evidence of a new process or conversation. Both also returned their own `structured_output` under the same CLI-level JSON schema.

## Verification and evidence limits

The probe asserted the fixture's known defect/fix outcomes separately from protocol validation. Its protocol validator does not determine code correctness from local patterns.

After the real second result, offline mutations of the captured result verified rejection of:

- the first round's result submitted as the second round;
- a second-round result carrying the first subject hash;
- a different provider session ID;
- a missing structured output.

These are adversarial checks of the experimental validator, not tests of a production acceptance integration. Duplicate submission after host restart, simultaneous submitters, changed on-disk subjects during review, provider failure and timeout were not exercised.

At `2026-09-06 02:56:40 +0800`, an explicit cleanup request caused the host to close Claude stdin. Claude exited with code 0 without a signal. The host exited and its pane disappeared; neither process remained. The sentinel pane on the same experimental server survived. All six existing user panes retained their original pane/PID pairs. Only after asserting this isolation did the experiment remove its sentinel pane. Forced process-group termination was not needed and is not claimed as verified.

Local ignored evidence is under `.ai/harness/runs/tmux-claude-two-round-20260906/`: the exact `probe.ts`, inputs, raw NDJSON, both result documents, process metadata, `proof.json`, `cleanup.json`, `isolation.json` and the pre-cleanup readable pane capture. This cache is not a tracked authority or an acceptance gate. To reproduce locally, copy only `probe.ts` into a new temporary directory, run it with Bun inside a separately owned tmux pane, wait for `proof.json` or `failure.json`, and create `cleanup.request` in that directory. The probe requires a locally authenticated Claude CLI; it performs two live model turns. Its output files are relative to the copied script. Use a separate sentinel pane and compare existing pane identities independently before and after cleanup.

The public [streaming-input documentation](https://code.claude.com/docs/en/agent-sdk/streaming-vs-single-mode) describes a long-lived session. The [CLI reference](https://code.claude.com/docs/en/cli-reference) documents streaming input/output and session flags. The direct CLI behavior above is a version-specific live observation, not inferred solely from the SDK documentation.

## P3: production integration constraints

1. Put process creation, round submission and owned-resource cleanup at a host-managed boundary. Keep the existing notification adapter's bounded control references and inbox authority; do not add full prompt bodies to its current operations.
2. Bind the owned tmux server instance, pane, actual child process identity/start time, provider session and current runtime generation. A live pane may contain only a shell, and a reused PID or pane ID is insufficient ownership proof. The temporary probe does not implement durable ownership or restart reconciliation.
3. Serialize rounds per reviewer. Bind every submitted subject and returned result to the task/worktree, current round and exact reviewed code. A retained conversation is context, never evidence that a previous PASS applies to a new subject.
4. Preserve structured evidence before cleanup and let the existing verifier own acceptance. Round completion, task acceptance and process cleanup are three separate events. Missing results or ambiguous delivery stay incomplete; do not automatically replay a potentially completed round.
5. Reuse the existing task/lease/binding and message state when integrating the board and handoff. The board may project process activity and offer terminal navigation; a pane dying does not release a Lease or complete a Task. Handoff references the binding authority rather than authoring another copy.
6. Retain the same reviewer for bounded repair rounds. `--fork-session` inherits history and is not a clean independent review. Do not add an unconditional final reviewer or use a local diff-hunk heuristic to decide whether a finding is semantically resolved.
7. At ten times the concurrent tasks, resource consumption from idle Claude processes and ambiguous delivery/recovery pressure appear before tmux pane creation becomes the bottleneck. Limits should consume existing attempt/budget and lifecycle authority; no new scheduler is justified by this experiment.

## Production implementation

- `src/core/review/claude-review.ts` owns the provider schema, identity validation and three-round bound.
- `src/effects/review/claude-review-session.ts` owns serialized submission, exact acceptance-context fencing, receipt association, status and owned cleanup; `claude-review-host.ts` owns the persistent stream and readable activity pane.
- `src/cli/commands/claude-review.ts` exposes round/status/close/cancel and consumes the existing semantic-review circuit admission once per session.
- `scripts/acceptance-receipt.ts` keeps acceptance authority and checks the caller's frozen expected context before recording. Its packaged helper is a deterministic projection.
- `scripts/check-agent-tooling.sh` requires executable tmux with a valid version result for both hosts. Existing setup projection reports `runtime.tmux`; package installation remains operator-owned.

The provider uses built-in Read/Grep/Glob only, with inherited MCP servers, hooks and skills disabled. Tracked changes are embedded as a Git diff; untracked text is included in full. Read tools supply surrounding source. Subject identity is checked before delivery and after the provider result, so old context never substitutes for current verification.

Deterministic integration tests use a controllable provider with a real tmux host and the real acceptance writer. They cover same-process FAIL/repair/PASS, stale code, concurrent/duplicate/ambiguous delivery, malformed identities, contradictory PASS, missing prior findings, three-round exhaustion, provider crash/deadline, receipt-gated close and detached-child cleanup after host death. A sentinel pane must survive cleanup. These tests prove transport/authority behavior, not Claude's semantic judgment.

Explicit close runs after verification and before worktree finish. The task's
contract/goal cannot change within a session; interrupted and closed sessions
have no automatic replay or replacement. Board navigation, automatic worktree
attachment and session recovery remain deferred. Idle process memory and unknown
delivery remain the first scale limit; no second scheduler or task authority was
introduced.


## Production-path live evidence

On 2026-09-06, the actual `claude-review round` CLI reviewed a separate Git
fixture twice using real `verify-sprint --prepare-acceptance` reports. The
contract required `increment(input)` to return `input + 1`; a deliberately weak
file-existence machine criterion left semantic correctness to the reviewer.
Claude rejected `return input` with finding `F-001`, then accepted the corrected
body and marked that same finding resolved. Both rounds used PID `29805` and
session `cfa5e09a-1611-4a1f-917b-7bb5aa161fee`, with distinct subject digests.
The actual protected receipt writer recorded reject then external_pass.

Final `verify-sprint` consumed the receipt without rerunning machine checks.
`claude-review close` returned `termination: stdin-eof`, exit code 0 with no
signal; independent process/pane readback confirmed the child and owned pane
were gone while the sentinel remained. The fixture used no provider executable
or authority-home test seam. Raw source-bound reports, requests, provider events,
results, pane capture and `live-proof.json` are retained in ignored runtime cache
`.ai/harness/runs/claude-review-production-fixture/`. This live proof establishes
the production transport/acceptance/cleanup path; it is not acceptance for the
repo-harness implementation diff itself.

## Startup cancellation ownership

Explicit cancellation now serializes with bootstrap on `startup.lock`. New
sessions declare that startup protocol; a delayed host observes a cancelled
bootstrap before spawning. The host records spawn intent before the spawn
call and records no-child evidence only when spawn fails without a PID. This
lets cancellation close a proven pre-spawn failure without reading nonexistent
`processes.json` or granting acceptance. The regression first failed with
ENOENT on the unfixed host and passed after the fix using a real tmux pane.

Missing metadata is not proof of absence: a session without recorded startup
serialization, or spawn intent without no-child evidence, returns
`claude_review_startup_ownership_unknown` and requires ownership inspection.
No closed record or acceptance is synthesized in those ambiguous states.
Normal process metadata still selects the existing identity-fenced cleanup.
Real tmux regression coverage includes delayed startup after cancellation,
startup lock contention, mismatched no-child proof and sentinel preservation.
