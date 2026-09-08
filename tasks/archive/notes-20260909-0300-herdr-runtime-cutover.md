> **Archived**: 2026-09-09 03:00
> **Related Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260909-0300
> **Archive Projection V1**: `plans/plan-20260909-0125-herdr-runtime-cutover.md` => `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/notes/20260909-0125-herdr-runtime-cutover.notes.md` => `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0125-herdr-runtime-cutover.contract.md` => `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0125-herdr-runtime-cutover.review.md` => `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`

# Implementation Notes: herdr-runtime-cutover

> **Status**: Active
> **Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Contract**: tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md
> **Review**: tasks/archive/review-20260909-0300-herdr-runtime-cutover.md
> **Last Updated**: 2026-09-09 01:25
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:a8d884f26ab9a443978f3ed64cdef8719e9c65b885818891a6b797301656ab4f`

## Design Decisions

- One atomic cutover covers runtime contracts, hosting and readiness; no intermediate release requires a runtime its host cannot use.
- The shared Herdr CLI helper serves two existing consumers and removes inherited routing before explicit-session invocation. No npm dependency is added.
- Herdr exposes pane PID but no server PID. The spawning caller records OS identity; pane shell parent and host identity preserve the existing cleanup fence.
- `agent prompt` success is not receipt authority. Timeout and unexpected errors remain ambiguous and are not retried.
- Upstream evidence: herdrdev/herdr b99002ac99b09e00b4ca692436cb15a6b0d676f1, src/app/api/agents.rs and src/app/api/panes.rs; installed CLI 0.9.0. Live CLI success envelopes have id/result, no ok boolean; pane run succeeds with empty stdout.

## Tradeoffs

One server per review adds memory/startup cost but keeps task cleanup ownership narrow. Extra panes prevent server stop. A generated launcher is required to exec the existing host without shell input timing or user startup files. Existing tmux sessions must be drained before updating; public enum and session metadata changes deliberately have no steady-state translator.

## Evidence

Durable mechanics and upgrade procedure: docs/researches/20260909-herdr-runtime-cutover.md. Runtime logs and canonical verification remain under .ai/harness/checks and runs. Deterministic providers do not prove real-model semantic judgment.

## Frozen verification checkpoint

Canonical verification report `.ai/harness/checks/herdr-verification.latest.json` passed runtime-contracts, review-lifecycle, readiness-guidance-adoption, typecheck, deploy-sql, task-workflow, project-state, adoption-dry-run, helper-mirrors and reference-mirrors. Architecture-sync remains blocked on two unresolved semantic candidates despite current projection apply returning noop. Task-sync required the substantive digest recorded above. No full suite was run: named tests cover all modified contracts and both real Herdr consumers. AcceptanceReceipt is not yet recorded.

## Remaining acceptance boundary

Implementation checkpoint: 3dc1809b. Main is now clean and synchronized at 4893cf82; its earlier base_ref_unsynchronized condition is resolved. This worktree has not merged that campaign-only change.

Architecture gate readback after commit: provider ready, pending/running/dead_letters zero, human_actions=2, blocking=2, uncommitted=0. Projection apply returned noop after the generated-file snapshot drift. Exact stale retirement refused first because candidate head was current, and after commit because reconciliation requires an empty noop with no unresolved evidence. Do not delete candidate state or weaken this gate. The outstanding signal IDs are sha256:8740bd01c26dbcf04d7b0424617c6cc5e5b677509dd71d78ac091f8180d7014c and sha256:83cc088c8dcbb6292261d3df7ed18d8fceb7eb3651ee3ed043c8eac7bf6e2a7a.

Next bounded slice: resolve the architecture projection candidate reconciliation against the current deterministic projection, then prepare typed acceptance and finish this contract worktree. This is an architecture workflow issue; no transport changes or broad retesting are justified by it. The four longer passing checks now use their recorded baseline execution IDs plus a current git diff guard over all implementation/test/dependency inputs. Required integrity checks remain current. No release, global installation or active-session migration has occurred.

Final bounded report `.ai/harness/checks/herdr-final-verification.latest.json`: 8 current checks and 4 baseline-with-delta checks passed; only architecture-sync failed. Snapshot remained unchanged during execution. The current runtime-input diff guard passed. Architecture diagnostics: `.ai/harness/runs/verification-vx-808cb12f537d444fadac.log`.

## Approved closure continuation

Owner approved reconciliation, formal acceptance and merge. Integrated main e9794576 (architecture recovery and archctx 0.5.8) in merge 91b2cb52. The only merge conflict was generated projection manifest; restored the coherent main projection before regeneration from the combined model. This avoids manually merging projection authority.

Observed pressure point: check-mode returned planned with only a manifest update after HEAD changed; retire-stale correctly requires empty noop. Apply/accept the current projection, retire the old exact candidates before any new commit, then preserve receipts and finish. No reconciliation gate relaxation is needed. Readiness/adoption and type checks are current after the integrated dependency/helper changes; runtime/review baseline reuse is narrowed to exact unchanged consumers and their tests. Added focused architecture provider/acceptance tests; no full suite.

## Architecture closure evidence

The current worktree daemon was still 0.5.7 after dependency install; the official `archctx daemon upgrade` replaced only this worktree runtime and status confirmed 0.5.8 compatibility. Accepted current signal ae227b54b962f63d67dcdebc38e1ecb2a25704311f07f4a5be3246dbf2d5fdfc under user:20260909-herdr-closure-approved. Receipt digest: sha256:1dd1272b7eca66b7c5b8ff39ef21523e22b3154ac230b58c51077bfda9e20a47.

The approved refresh also wrote the canonical context map and local Agent context. A following apply refreshed only manifest provenance to those new source inputs. Both exact old candidates then retired successfully through the unchanged strict-noop proof gate. Durable receipts remain under `.ai/harness/architecture-projection/{acceptance-receipts,stale-retirement-receipts}`. No manual candidate deletion or reconciliation code change occurred. The context map is added to scope as a deterministic refresh output; generated AGENTS/CLAUDE context is excluded from the runtime code equality guard and covered by current integrity checks.

> **Substantive Change SHA256**: `sha256:40725cd10c86ac871778336485615983d35d0e4fc6a743102cee2ff999f405ba`

Architecture-sync now passes: ready, human_actions=0, blocking=0. The earlier blocker entries above are historical; current next action is prepared verification, one configured semantic review, then receipt-bound finish.

Prepared verification checkpoint run-20260909T020741-11157: all 14 executable checks and 19 contract criteria passed, with a stable snapshot. Preparation stopped only because the generated Change Assessment declaration had no oracles. Added explicit path-to-existing-check mappings without changing checks or risk selection. Readiness/adoption run vx-d6529d135f554685b93d is retained with current full implementation/config/dependency equality against tree da80bd25324cf6ec62f7c8507cdaa445b40390c7. No runtime source changed.

## Review finding and root cause evidence

- Root cause: server process creation preceded server.json publication without durable server-start intent. Missing server metadata therefore incorrectly meant no server for status and cancellation.
- Reproduction: `ambiguous server startup cannot report successful closure` failed before the fix because closeClaudeReview resolved instead of rejecting; captured at /tmp/herdr-startup-prefixed.log.
- Fix: write server-start intent before process creation; unresolved intent refuses cancellation/closed status. Caught metadata publication failures kill and reap the still-owned ChildProcess, then record session-bound closure proof. No guessed PID or endpoint cleanup is introduced.
- Regression: both interrupted ownership and real-Herdr metadata publication failure passed (2 tests, 10 assertions); full review lifecycle and all required gates are being revalidated on the repaired subject.

The official plugin review is complete and preserved verbatim in the review artifact. Its medium severity maps to P2, but parent elected to repair it because false closure violated the migration invariant. Do not run another external reviewer or claim its original opinion covered this delta. Final owner acceptance must bind the verified repaired subject.

> **Substantive Change SHA256**: `sha256:cfb14461f993afacaa2947afc9080a6cdfb501307fe468468b9c31946e052eae`

Full repaired review lifecycle and real transport development run passed: 21 tests, 107 assertions. Architecture apply completed with no new refresh signal. Final prepared verification retains the unchanged notification and installation baselines and runs the changed review lifecycle current.

Final repair verification run-20260909T022528-28966 passed all 20 contract criteria. Main subsequently advanced to b4712412 with a non-overlapping Oracle version pin, its tests and archived evidence; integrated it to preserve target history. Herdr source and tests remain identical to repair 6a3563eb. The repaired lifecycle execution is retained with its explicit unchanged-input guard, and readiness baseline excludes only the identified independent upstream Oracle files. Owner acceptance remains pending; no second external review or source change.

Owner explicitly approved the repaired subject and merge in the current conversation. Recorded UserWaiverGrant and owner AcceptanceReceipt successfully. During closeout origin/main advanced to 0b0c0a60 (#369), so preserved the verified main projection checkpoint on this branch, synchronized main, and integrated the non-overlapping campaign change. The six incoming campaign files receive focused current verification; Herdr repair equality against 6a3563eb passes. Rebind the same owner approval to the refreshed combined evidence; no new Herdr design or source changes.
