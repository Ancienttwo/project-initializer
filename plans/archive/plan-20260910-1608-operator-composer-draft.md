> **Outcome**: Completed
> **Archive Scope**: standard profile single-plan local delivery; strict contract receipt flow is not applicable

# Plan: Operator Task Message draft recovery

> **Status**: Completed
> **Created**: 20260910-1608
> **Slug**: operator-composer-draft
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Browser remount identity and original-fence recovery, focused operator tests, typecheck/build and root integrity checks
> **Rollback Surface**: Revert the scoped browser/test/doc diff; no server state or API migration
> **Workflow Profile**: standard
> **Execution Mode**: inline
> **Substantive Change SHA256**: `sha256:305ba544f6ad944547930ed7c023cc8831e2ca628a0ba32b989d242e40d83d10`

## Scope and decision

User approved this slice on 2026-09-10, then confirmed browser-local storage and original-fence restoration. Implement refresh/crash recovery only. Existing panel-close protection remains. No backend scratch route, diff surface, queue, workflow authority, dependency, or public action.

P1: `src/operator-web/App.tsx` owns Composer body, message identity, frozen fence, and the sole Task Message write affordance. `i18n.ts` owns visible copy. Existing interaction tests own UI behavior. `docs/researches/20260901-operator-board-audit-hardening.md` records the boundary.

P2: A user edit synchronously saves body/message_id/fence to localStorage under the existing repository/task key. Remount restores that exact record and opens the composer. POST still uses the existing send validation. Ambiguous/rejected sends retain the record; acknowledged success or explicit emptying removes it. Explicit rebind/new-id actions update the saved identity together with the body.

P3: Store only browser editor state; the server remains authority for stale task/claim/generation rejection. Validate the stored shape without inventing missing values; malformed/read/write failure shows a recovery warning. Use existing App.tsx functions, no new helper file or dependencies. Same-origin localStorage is shared between tabs: latest edit wins for one task. At 10x abandoned drafts, browser storage quota fails first; surface save failure and preserve in-memory text. No cross-tab merge or retention subsystem in this slice.

## Scope paths

- src/operator-web/App.tsx
- src/operator-web/i18n.ts
- tests/operator-web/operator-interactions.test.tsx
- docs/researches/20260901-operator-board-audit-hardening.md
- this plan and ignored tasks/current.md projection

## Acceptance and verification

- Exact body/message_id/original fence survive remount, including stale owner/revision and ambiguous send.
- Repository/task keys isolate drafts; no automatic send on restore.
- Valid acknowledgement clears saved text; failed sends preserve it; explicit rebind updates the persisted fence.
- Malformed or unavailable storage is visible without manufacturing a draft identity; UTF-8 limit and existing send guards remain.
- Run `bun test tests/operator-web tests/effects/operator-write-boundary.test.ts --timeout 60000`, `bun run check:type`, `bun run build:operator-web`, and the six root Required Checks. These cover browser lifecycle/transport/route-count and repo integrity; no full-suite trigger exists.
- Waza check review consumes this diff and focused evidence. Keep local changes reviewable; no commit/push/deploy requested.

## Task Breakdown

- [x] Prove refresh loss and add recovery/identity/isolation/error regressions.
- [x] Implement localStorage restoration in existing composer and localized warnings.
- [x] Record the invariant, run focused verification and root checks, and review the final diff.
- [x] Close acceptance after architecture projection job `job-30196b4bc7b27fefb73022c6` completes and the strict architecture check passes.

## Approved projection recovery follow-through

The user approved diagnosis/recovery of the remaining projection timeout. The first provider RPC (`listProjectionPriorCommittedApplies`) calls `openSession`, which computes a generic worktree digest before querying the journal. Installed archctx 0.5.9 includes `.ai/harness` in this digest; the current ignored runtime evidence is 31,971.8 MiB in 10,590 files. A timed RPC leaves the snapshot count unchanged, and an in-flight daemon sample shows synchronous file reads and SHA-256, confirming the unnecessary scan before journal lookup. Read-only projection check also timed out, excluding the projection write itself as the initiating cause.

The bounded fix belongs in archctx's journal-read method, with a regression proving that reading prior commits does not initialize a repository session. Preserve public worktree-digest semantics, timeout policy, runtime evidence and unrelated WIP. Use an isolated archctx worktree and retain exact source/package evidence before local integration. Public release/push is not part of this approval.

## Approved checkpoint storage repair

The user explicitly added checkpoint duplication/cleanup repair. P1: Stop publishes the entire accepted-event projection; only the last-published marker is a live checkpoint authority. Recovery views carry provenance, not a checkpoint reference chain. The append-only event ledger and blobs remain the audit authority. P2: every changed accepted set creates a new full-history directory, while publication only cleans staging/same-ID corruption; 1,970 copies consumed 30.927 GiB. P3: retain exactly the current complete checkpoint, publish/collect under the existing exclusive directory lock with file/directory/marker fsync before deletion, and leave the ledger/blobs untouched. A common optimistic reader takes immutable bytes from the marker it observed; if collection races the read, it reacquires only a demonstrably changed marker, otherwise fails closed. The standalone helper gets a deterministic projection of that same reader, following the existing capability-helper projection precedent.

The cache is a current recovery projection, not a historical snapshot archive. Collection deletes only owned `chk-<64 hex>` directories containing only expected regular machine/human files (including a subset left by interrupted deletion); unrelated files, symlinks and staging are preserved. Re-publishing an unchanged valid current checkpoint avoids staging/writing it again. A validated source invocation applies this same collector to existing local duplicates after tests pass. At 10x event volume, the one current full checkpoint and full-ledger fold grow linearly; accumulated historical copies no longer multiply disk usage. No event compaction/schema migration, daemon timeout change, or public release is included.

Additional scope: `src/effects/evidence/checkpoint-store.ts`, shared `checkpoint-snapshot.ts`, `scripts/recovery-view-cli.ts`, `scripts/sync-helper-sources.ts`, generated `assets/templates/helpers/recovery-view-cli.ts`, checkpoint/recovery/helper projection tests (`tests/evidence-checkpoint.test.ts`, `tests/evidence-recovery-materializer.test.ts`, `tests/helper-scripts.test.ts`, `tests/unit/helper-projection-drift.test.ts`), and `docs/researches/20260910-checkpoint-cache-retention.md`.

- [x] Capture a failing bounded-storage regression, implement serialized publish/collection and the shared concurrent reader.
- [x] Verify checkpoint atomicity, marker failures, unchanged-set writes, concurrent collection, helper projection, and preservation of raw events.
- [x] Collect existing owned duplicates, verify the current checkpoint, then finish the architecture acceptance boundary.

Focused coverage: checkpoint, recovery materializer, projection drift, helper projection tests; `bun run check:type`, root required checks, and a concurrent reader/publisher process probe. No full-suite trigger exists.

## Promotion Gate

- **Merge/PR unit**: Browser-only draft recovery with interaction regressions and invariant documentation.
- **Rollback surface**: Revert this scoped diff; no server data migration.
- **Verification boundary**: Exact identity through browser remount plus existing single-write-route assertion.
- **Review/acceptance boundary**: Waza standard review and targeted check results recorded in this plan.
- **High-risk surface**: Stored JSON must not inject identity or silently replace a stale fence; existing transport/server remain authoritative.
- **Why not checklist row**: Final edit-time resolver selected standard and required an approved work-package; no existing active plan owns this scope.

## Evidence Contract

- **State/progress path**: This plan's Task Breakdown and acceptance results; tasks/current.md is its ignored read model.
- **Verification evidence**: Exact substantive diff digest above and the commands/results below.
- **Evaluator rubric**: Original body/id/fence survive remount; typed errors and the sole server write route are preserved.
- **Stop condition**: Implementation and review complete; required checks pass or their concrete unresolved gap is retained here before stopping.
- **Rollback surface**: Revert the four owned source/test/doc paths and this plan only.

## Acceptance results

- Base: `3c570360543fe5b93378bec81c2a7d4f68f10663`; local uncommitted implementation.
- Pre-change regression: remount test failed because the textarea/body was absent.
- `bun test tests/operator-web tests/effects/operator-write-boundary.test.ts --timeout 60000`: 114 pass, 0 fail, 636 assertions. Includes 4 new recovery tests and extended explicit-rebind persistence assertions.
- `bun run check:type` and `bun run build:operator-web`: pass.
- Required deploy SQL ordering, project-state inspection and init dry run: pass; init planned zero operations.
- Waza standard base review and bounded independent security review: pass for the browser draft scope; no new dependency or backend route. Existing identity rotation, stale rebind, submit and input-change sites all update the same saved record.
- `check-architecture-sync.sh`: failed because this plan/test edit triggered durable architecture projection job `job-30196b4bc7b27fefb73022c6`; the automatic host budget yielded it to pending. One explicit `bun src/cli/index.ts architecture-projection drain --json` attempt then timed out after 116483ms and returned `retry-pending`, pending=1/running=0/deadLetters=0, acknowledgeSourceEvents=false. Provider handshake reports ready, but apply completion is unverified. Preserve this concrete acceptance gap without changing timeout policy or blindly retrying.
- Task-sync now passes with this diff-bound evidence. Task-workflow initially requested the required plan sections and a fresh local resume packet; both have been supplied through the canonical plan and prepare-handoff helper.

## Checkpoint repair verification

- Root cause guards were observed failing before fixes: unbounded snapshots, absent durability barrier, and partial unlink left forever.
- Focused checkpoint/recovery/projection/helper baseline: 52 pass, 284 assertions. Final one-line partial-GC delta: all 26 checkpoint tests pass, 148 assertions; typecheck passes.
- Real process probe after final delta: two writers, 50 publications, 83 successful concurrent reads, zero errors, one retained checkpoint.
- Helper regression selection: 11 pass, 276 assertions. Hook/helper projections, deploy SQL ordering, project-state audit and init dry run pass.
- Local package builder and isolated installed helper/store smoke passed before the final partial-GC delta; final package readback remains to refresh. No public release or global runtime replacement is claimed.

## Local completion

- Final source base: `16f6581f55f89277d9cff315cca439fbfcc5128a`. Concurrent main advance from `3c570360` contained only unrelated research/archive artifacts; no source or test inputs changed. Original focused evidence remains applicable to the unchanged implementation; final installed-package and GC delta checks also passed.
- Final local tarball: `/tmp/repo-harness-retention-package/repo-harness-0.19.0.tgz`; rebuilt after the partial-GC fix, isolated install and standalone helper/store smoke passed (4 publications, one checkpoint, exact current ID in handoff). Global runtime was not replaced.
- Real cleanup: 1,972 old directories removed, zero skipped. 33,324,519,549 bytes became 39,028,687 bytes; reclaimed 33,285,490,862 bytes. The existing 81,345,127-byte ledger prefix and current checkpoint ID were unchanged. Receipt: `.ai/harness/runs/checkpoint-retention-cleanup.json`.
- Projection job `job-30196b4bc7b27fefb73022c6` succeeded/applied and acknowledged its source event. Queue pending/running/dead-letter all zero. Its generated manifest is retained in `docs/architecture/.projection-manifest.json`.
- Root checks: hook/helper projection, deploy SQL ordering, strict architecture-sync, task-sync, strict task-workflow, project-state audit and init dry run all passed. No full suite was required.
- Security and architecture review plus adversarial passes found a missing durability barrier and non-resumable partial cleanup; both were fixed with pre-fix failing regressions. Same-ID corrupt repair's transient unavailability was confirmed to be pre-existing fail-closed behavior, outside this retention change.
- archctx source fix remains in the isolated `codex/projection-journal-read` worktree. Its declared checks and local Node package probe pass; contract event binding/official semantic receipt and public consumer delivery remain separate, unperformed boundaries.
- Local implementation/cleanup is complete. Public release, global runtime update, commit/push and formal strict archctx workflow closeout were not part of this local delivery.
