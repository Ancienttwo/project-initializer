> **Archived**: 2026-09-08 17:06
> **Related Plan**: plans/archive/plan-20260908-0420-brc-host-containment.md
> **Outcome**: Superseded
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1706
> **Archive Projection V1**: `plans/plan-20260908-0420-brc-host-containment.md` => `plans/archive/plan-20260908-0420-brc-host-containment.md`
> **Archive Projection V1**: `tasks/notes/20260908-0420-brc-host-containment.notes.md` => `tasks/archive/notes-20260908-1706-brc-host-containment.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0420-brc-host-containment.contract.md` => `tasks/archive/contract-20260908-1706-brc-host-containment.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0420-brc-host-containment.review.md` => `tasks/archive/review-20260908-1706-brc-host-containment.md`

# Plan: BRC Docker containment and bounded preparation

> **Status**: Archived
> **Artifact Level**: work-package
> **Verification Boundary**: Typed pre-start containment and model-free Docker adapter tests
> **Rollback Surface**: New Docker carrier files; campaign runtime remains unconnected
> **Promotion Reason**: risk_boundary
> **Execution State**: User-approved field-level repair and adapter verification; historical three-round count retained
> **Branch**: codex/brc-host-containment
> **Base**: 38c26b2ada6a3071df40745b8eed6e06315695b6
> **Workflow Profile**: standard; this plan is the sole active artifact

## Goal
Resolve #342 command inactivity through a Docker-owned process boundary and complete the host preparation portion of #346. BRC6a trusted revision admission remains unchanged; #346 cannot close until its independent combined-admission criterion passes.

## P1 / P2
The managed path is campaign-worker.prepareChild -> prepareCampaignCodexInvocation -> contract-run.runChild -> observeCampaignCodexTerminal -> recovery/closeout. Current POSIX process-group evidence excludes detached descendants. The version probe shares the deadline but shares this containment defect. The actual tracked worker and gatekeeper profiles require workspace writes and Git reads respectively. The canonical admission function still unconditionally rejects new active work.

## Decision and invariants
Use Docker as the sole managed campaign carrier, as approved by the user. No native fallback and no admission bypass. One exact precreated container per version probe or provider invocation; persist container identity and immutable configuration outside the writable worktree before start. A fixed local image supplies Codex and a native C PID1 deadline watchdog (root with only SETUID/SETGID; supplementary groups and workload capabilities cleared before exec); the workload runs with a different non-root UID and no capabilities. Use external sandbox semantics explicitly, retaining role-specific mount permissions. Namespace termination is proven from daemon inspect of the exact container, never Docker client exit or process-group disappearance. Unknown provider operations remain fail-closed.

The watchdog must remain effective after controller death. Docker API calls have bounded deadlines and output; create/start uncertainty retains a durable handle for reconciliation. Kill and inspect are cleanup operations with a separate finite window, never renewed execution budget. No automatic container removal before a persisted terminal receipt. Resource cost at 10x is bounded per invocation; daemon capacity can reject admission, not weaken isolation.

## Scope
Core invocation/terminal contract, campaign runtime and worker consumers, contract-run and helper mirror, fixed container image/watchdog, focused host/role/deadline/replay regressions, operational documentation. Preserve existing budget authority and BRC6a fence. No model calls during host canaries, no remote mutations from fixtures, no full local suite without an uncovered integration risk.

## Task Breakdown
- [x] Verify exact issue requirements and isolate worktree from unrelated WIP.
- [x] Prove detached process termination and read-only mount denial on available Docker daemon without a model.
- [ ] Freeze and implement container/watchdog contract and bounded daemon supervision.
- [ ] Integrate probe, worker/verifier invocation and terminal consumers without native fallback.
- [ ] Cover controller death, expired deadline, cancellation, output flood, detached descendants, config/identity drift, unsupported operations and replay boundaries.
- [ ] Run focused tests, typecheck, helper consistency and required repository-integrity checks on frozen implementation.
- [ ] Record exact acceptance boundary, submit PR and close only issues whose criteria actually pass.

## Verification
Model-free real Docker canaries establish namespace and mount behavior. Focused Bun tests cover adapter and existing campaign runtime/worker/recovery/closeout consumers. Required integrity checks: deploy SQL order, architecture sync, task sync, strict task workflow, inspect-project-state, init dry-run. Typecheck and helper mirror check cover shared contract updates. Existing CI remains required. BRC6a normal trusted admission is explicitly unverified and must not be replaced with fixture admission.

## Rollback
Revert this work-package as one unit before enabling campaigns. Existing persisted protocol evidence is not rewritten or reclassified as container evidence.

## Current implementation and evidence

Only new files exist in this worktree: this plan, `deploy/campaign-container/Dockerfile`, `deploy/campaign-container/campaign-init.c`, and `src/effects/automation/campaign-container.ts`. The adapter is an unfinished prototype; no existing invocation, admission, recovery or closeout consumer imports it. It has not been committed, submitted or accepted.

The native PID1 is built with `-Wall -Wextra -Werror`. It clears supplementary groups, sets all workload UID/GID slots, clears effective/permitted/inheritable/ambient capabilities, requires no-new-privileges, then executes an absolute command. It owns a monotonic deadline as well as an absolute wall deadline and exits to trigger PID namespace teardown. This code still needs its adversarial regression matrix and acceptance review.

Observed model-free evidence on Docker Desktop Linux 28.3.2:

- Node image `sha256:66bb8d36ae1ddd72199ed235a089904874ca4079ee517936ca3adb80506a75c1`: detached writer ran; exact container `50f1a630be2611c79bad1192cc1ce76744f48e1e7688f4ec9cc9a7ffa06e663b` was killed; inspect reported Running=false, Pid=0, ExitCode=137. Marker bytes were 2 at stop and remained 2 after observation. The container was removed after the probe.
- Read-only bind rejected a write with EROFS, exit 1, no marker. This is a filesystem canary, not a paid campaign.
- The pinned Codex 0.153.4 / Bun / Git image built successfully. Direct Docker start of the native PID1 returned `codex-cli 0.153.4`, exit 0, stopped/Pid 0. That earlier image used `/tmp/codex`, causing a CLI helper-alias warning; the current build uses `/home/campaign/.codex`, but its full adapter path has not passed.
- Current built image: `sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523` (local ARM64 image; not a portability claim).

## Blocking readback defect and stop boundary

The complete adapter still rejects `container identity or configuration changed`, most recently in the pre-start inspect call (`runCampaignContainer`). Three configuration repair/verification rounds did not yield a passing adapter run. The user-provided AGENTS rule caps fail/fix/reverify at three rounds per issue, so implementation and test iteration stopped here.

One actual Docker transition was isolated: `HostConfig.OomKillDisable` changes from false to null when task creation occurs; both represent the non-disabled default, and the candidate projection handles only those two values. This does not fully explain the latest pre-start mismatch, and it is not recorded as a confirmed complete root cause. A separate startup failure from local logging compression with max-file=1 was corrected to max-file=2. A Bun realpath socket limitation was addressed by resolving the socket parent and retaining the exact daemon identity check.

Next bounded step: retain the complete raw before/after inspect documents for one created container, identify the exact remaining differing field or identity, and freeze the immutable-versus-runtime projection before any further integration. Do not remove the digest check to make the run pass.

Remaining work includes typed closed Docker schemas (prototype currently has dynamic JSON), cancellation/error reconciliation, durable crash replay, role integration and all focused/integrity checks. No full Bun suite, typecheck, repository-integrity acceptance, real model invocation, trusted admission or complete lifecycle has passed for this work-package. #342 and #346 remain open; BRC6a remains unchanged.

## External authority references

- Linux namespace-init termination guarantee: https://man7.org/linux/man-pages/man7/pid_namespaces.7.html
- Capabilities and UID transition semantics: https://man7.org/linux/man-pages/man7/capabilities.7.html
- Docker run/namespace/isolation contract: https://docs.docker.com/reference/cli/docker/container/run/
- Codex 0.153.4 Linux sandbox boundary: https://raw.githubusercontent.com/openai/codex/rust-v0.153.4/codex-rs/linux-sandbox/README.md

## Authorized bounded diagnosis (original retry count retained)

The user authorized a diagnostic stage after the three-round stop: use saved responses or one bounded credential-free create/inspect collection; no workload start, production integration, merge or admission weakening. This stage is complete. See `docs/researches/2026-09-08-brc-container-readback-diagnosis.md` and the saved offline fixture/test.

Confirmed: top-level `Mounts` swaps array order between reads of the same created container. All destination-keyed mount facts remain identical. Offline candidate normalizes only this order, rejects duplicate/unknown mount shapes, and retains strict authorized inventory/access and watchdog/security counterexamples. Runtime adapter bytes remain unchanged. Integration is still paused; the old three-round count was not reset.

Dependency update: the user reports BRC6a verified feasible. The old statement that no producer was available describes the earlier baseline; the new evidence must be read before making a current formal-admission conclusion. This diagnostic task neither implements BRC6a nor closes #346.

## Evidence Contract

- State/progress path: This plan and its projected task contract own the approved adapter slice.
- Verification evidence: .ai/harness/runs/brc-host-diagnosis/approved-adapter-final.log; focused offline/live tests, typecheck and repository integrity.
- Evaluator rubric: Expected spec precedes Docker create; all mounts and watchdog/security constraints must match; order-only differences pass and unsafe mutations reject.
- Stop condition: Approved adapter slice passes targeted verification; campaign integration and issue closure remain separate unfinished work.
- Rollback surface: Revert newly introduced container core/effect, image and focused test files as one unit.

## Promotion Gate

- Merge/PR unit: Explicit Docker host containment carrier and its pre-start authorization check.
- Rollback surface: New carrier files, with no current campaign callers switched.
- Verification boundary: Saved Docker readback regression plus real model-free Docker probe, mount, deadline, cancellation and descendant cases.
- Review/acceptance boundary: Targeted adapter evidence cannot be used as full campaign or BRC6a acceptance.
- High-risk surface: Writable namespace isolation and workload admission.
- Why not checklist row: Independently testable host authority boundary with its own rollback surface.

## Approved adapter repair result

The user approved the diagnosed minimum repair. Runtime mount comparison and authorization-derived complete pre-start spec checks are implemented. Frozen offline plus real credential-free Docker tests pass: 19 tests, 59 assertions. Typecheck passes. No existing campaign consumer imports the adapter yet. The original three-round record remains intact; these checks belong to the approved diagnosed slice.

Next work is campaign invocation/probe integration and controller-crash reconciliation, followed by validation against the current BRC6a receipt. Do not close either issue from adapter-only evidence.

## Approved consumer integration

The user approved wiring the existing carrier through campaign probe, worker/verifier and recovery evidence. The contract scope now includes these consumers. One absolute deadline and existing attempt budget remain authoritative. Protocol cutover rejects historical native invocation as container proof. Formal BRC6a evidence is being located independently; the admission fence stays intact.

## Consumer integration stop

Consumer wiring is implemented as uncommitted WIP but acceptance is incomplete. Three failed verification batches triggered the local three-round stop. See the notes for exact logs, path hashes, failed checks and the bounded next slice. No fourth repair/reverify cycle, issue closure, merge or full BRC run. BRC6a feasibility was located; no provider-origin resolved-commit receipt was found.

## Authorized continuation

The user explicitly requested continuation after the stop report. Retain all prior failed batches; fix the identified test registration/outer harness bounds first, freeze source during process tests, then continue the existing controller-crash recovery slice. Workload deadlines, admission and issue closure criteria remain unchanged.
