# Plan: Bounded hook telemetry with retained-history consumers

> **Status**: Superseded
> **Created**: 20260906-1721
> **Slug**: hook-telemetry-retention
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Concurrent append rotation and both retained-history readers
> **Rollback Surface**: Revert storage writer and reader changes together; retain archive files
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1721-hook-telemetry-retention.md`
> **Task Review**: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1721-hook-telemetry-retention.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-1721-hook-telemetry-retention.md`
- Sprint contract: `tasks/archive/contract-20260906-1721-hook-telemetry-retention.md`
- Sprint review: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md`
- Implementation notes: `tasks/archive/notes-20260906-1721-hook-telemetry-retention.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1721-hook-telemetry-retention.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-1721-hook-telemetry-retention.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-1721-hook-telemetry-retention.md`.

## Approach
### Strategy
Use the captured planning output below as the execution source of truth.

### Trade-offs
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Captured plan | Preserves the approved Codex Plan or Waza think decision | Requires the captured text to be concrete enough to execute | Use |

## Detailed Design
### File Changes
| File | Action | Description |
|------|--------|-------------|
| See captured planning output | Follow | Implement only the approved scope named below |

### Code Snippets
See captured planning output.

### Data Flow
See captured planning output.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Captured plan lacks enough detail | Medium | Execution may need clarification | Stop before implementation if the captured output contradicts repo rules or lacks concrete file targets |

## Task Contracts
- Contract file: `tasks/archive/contract-20260906-1721-hook-telemetry-retention.md`
- Review file: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md`
- Implementation notes file: `tasks/archive/notes-20260906-1721-hook-telemetry-retention.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1721-hook-telemetry-retention.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-1721-hook-telemetry-retention.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert storage writer and reader changes together; retain archive files
- **Verification boundary**: Concurrent append rotation and both retained-history readers
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-1721-hook-telemetry-retention.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1721-hook-telemetry-retention.md`, `tasks/archive/review-20260906-1721-hook-telemetry-retention.md`, and `tasks/archive/notes-20260906-1721-hook-telemetry-retention.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert storage writer and reader changes together; retain archive files

## Captured Planning Output

## Goal
Bound hook telemetry storage while preserving a useful cross-session history and both existing report consumers. The user approved this deferred goal for pre-release preparation.

## P1 Map
event-telemetry.ts appends one JSONL record per hook to runs/hook-events.jsonl. hook-dispatch-diet-report and run-harness-profile-benchmark read it as one unbounded file. The existing exclusive-directory lock provides safe owner-based recovery; the telemetry sink is non-authoritative and write failure cannot change hook safety.

## P2 Trace
Every finalize appends another record. The real log now exceeds 168 MB. Reports read and split the complete file. Splitting only readers or rotating without changing consumers would respectively leave storage unbounded or silently discard historical samples from reports.

## P3 Decision
Keep the current active filename and record protocol. Before append, rotate a full 8 MiB active file by atomic rename into a dedicated hook-events archive directory. Serialize only rotation/retention/snapshot file opening using the existing exclusive directory lock; append remains O_APPEND and never truncates an inode, so a writer already holding an old file descriptor finishes into its archive. Keep at most 32 archive segments and 256 MiB of archived bytes, removing only oldest exact-owned segment filenames; no age policy or operator settings. A pre-existing oversized log within the archive budget is preserved on first rotation. Both readers consume retained archive segments plus active through one file iterator, keeping their existing protocol validation. Open all file descriptors while holding the rotation lock and read them afterward so pruning cannot invalidate an already selected snapshot. An explicit custom report log path remains one file. No new dependency, CLI, provider, or alternate authority. At 10x volume rotation occurs more often and retained time coverage shrinks; the byte/count caps keep storage and report input bounded. Publish retention semantics in the architecture and report evidence, without changing metric meaning.

## Scope
src/effects/hook-event-log.ts; src/cli/hook/event-telemetry.ts; scripts/hook-dispatch-diet-report.ts; scripts/run-harness-profile-benchmark.ts; named telemetry/reader tests; docs/architecture/global-hook-runtime.md; docs/researches/20260906-release-todo-hardening.md; task evidence. Do not mutate the live 168 MB log or other agents' worktrees; installation owner activates the new writer.

## Task Breakdown
- [x] Capture failing rotation and retained-history reader regressions before changing production source.
- [x] Add bounded rename-based retention with symlink/foreign-file protection and reuse the existing lock; wire writer and both readers.
- [x] Verify active plus archived records, count/byte pruning, missing/custom logs, concurrent appends and rotation, failure isolation, protocol rejection, and report metrics.
- [x] Run named runtime/reader checks, type/bundle/package checks and six integrity checks; synchronize docs and move only the owned todo into implementation evidence.

## Verification
Focused tests: telemetry storage regression; tests/unit/hrd-08-event-telemetry-and-benchmark.test.ts; tests/hook-dispatch-diet-report.test.ts; tests/harness-benchmark-matrix.test.ts; tests/hook-runtime.test.ts; tests/hook-runtime-characterization.test.ts. Full product suite is unnecessary because the record protocol and dispatch behavior are unchanged and both readers are named. Six root integrity checks and build:hook-bundle cover packaging and repository projections.

## Rollback
Revert the storage helper, writer, and both reader integrations together. Archived evidence remains readable JSONL; no live log migration runs in this task. Pruned cache history is intentionally unrecoverable under the new documented retention policy.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Capture failing rotation and retained-history reader regressions before changing production source.
- [x] Add bounded rename-based retention with symlink/foreign-file protection and reuse the existing lock; wire writer and both readers.
- [x] Verify active plus archived records, count/byte pruning, missing/custom logs, concurrent appends and rotation, failure isolation, protocol rejection, and report metrics.
- [x] Run named runtime/reader checks, type/bundle/package checks and six integrity checks; synchronize docs and move only the owned todo into implementation evidence.

Implementation is included in the user-approved release integration contract `tasks/contracts/20260906-1732-checks-artifact-repair.contract.md`; this historical slice does not claim separate external acceptance.
