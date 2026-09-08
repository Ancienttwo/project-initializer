> **Archived**: 2026-09-09 01:57
> **Related Plan**: plans/archive/plan-20260909-0130-architecture-drift-recovery.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260909-0157
> **Archive Projection V1**: `plans/plan-20260909-0130-architecture-drift-recovery.md` => `plans/archive/plan-20260909-0130-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/notes/20260909-0130-architecture-drift-recovery.notes.md` => `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0130-architecture-drift-recovery.contract.md` => `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0130-architecture-drift-recovery.review.md` => `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`

# Plan: Architecture drift cursor transactions and recovery; archctx 0.5.8

> **Status**: Archived
> **Created**: 20260909-0130
> **Slug**: architecture-drift-recovery
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Cross-process cursor acknowledgement and persistent batch recovery
> **Rollback Surface**: architecture drift cursor writers and version pins
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`
> **Task Review**: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`
> **Implementation Notes**: `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan-or-waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260909-0130-architecture-drift-recovery.md`
- Sprint contract: `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`
- Sprint review: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`
- Implementation notes: `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260909-0130-architecture-drift-recovery.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260909-0130-architecture-drift-recovery.md`.

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
- Contract file: `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`
- Review file: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`
- Implementation notes file: `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260909-0157-architecture-drift-recovery.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260909-0130-architecture-drift-recovery.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: architecture drift cursor writers and version pins
- **Verification boundary**: Cross-process cursor acknowledgement and persistent batch recovery
- **Review/acceptance boundary**: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260909-0130-architecture-drift-recovery.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260909-0157-architecture-drift-recovery.md`, `tasks/archive/review-20260909-0157-architecture-drift-recovery.md`, and `tasks/archive/notes-20260909-0157-architecture-drift-recovery.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260909-0157-architecture-drift-recovery.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: architecture drift cursor writers and version pins

## Captured Planning Output

## Goal
Upgrade archctx and archctx-contracts to 0.5.8 and repair architecture drift recovery F1-F3 plus preservation of pending suffix after external acknowledgement.

## P1 / P2
The shared cursor is written by legacy cascade, Stop archctx success, manual archctx drain, and publication acknowledgement. Legacy alone currently holds the directory lock. Historical batch validation resolves all paths against current files; stale empty lock recovery is disabled. Cursor mismatch replaces pending work without coverage evidence.

## Decision
Use the existing lock for all cursor writes with expected-cursor compare under lock. Keep a private held-lock writer to avoid recursion. Retain pending suffix across external cursor advancement, drain it without rewinding the new cursor, and then observe the current range. Validate historical relative paths lexically and validate each pending path against live filesystem before delivery. Opt into existing stale-empty reclaim protocol; do not modify generic locking semantics.
No new dependencies, scheduling, fsync protocol, npm publication, or unrelated cleanup. User subsequently approved latest-main integration and bounded real downstream validation after source acceptance. Keep historical 0.5.7 evidence historical.

## Task Breakdown
- [ ] Reproduce F1 concurrency, F2 symlink prefix, F3 empty lock, and uncovered suffix loss in permanent focused regression tests.
- [ ] Apply shared cursor transaction and bounded recovery fixes, including Stop and CLI callers.
- [ ] Complete 0.5.8 exact pins across dependencies, runtime policy, generators, and fixtures.
- [ ] Run focused drift, publication, lock, Stop/CLI and provider tests plus required repository checks; document red-green evidence and limits.
- [ ] Record durable recovery contract and task evidence; retain source and installed-runtime evidence; follow the approved bounded downstream validation.

## Verification
Focused tests cover all changed cursor callers, publication contention, pending suffix recovery, symlink safety, empty/dead/live lock ownership, and dependency handshake. Run repository integrity checks specified in AGENTS.md. No full suite: named tests cover the shared boundary. Installed candidate validation is isolated and bounded, never against the user's cursor or backlog.

## Risks and scale
Lock contention fails closed for caller retry. Pending suffix is retained absent proof of coverage. Existing per-path side effects remain at-least-once. At 10x scale full-batch JSON writes remain the first known cost; no optimization without measurement.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Reproduce F1 concurrency, F2 symlink prefix, F3 empty lock, and uncovered suffix loss in permanent focused regression tests.
- [ ] Apply shared cursor transaction and bounded recovery fixes, including Stop and CLI callers.
- [ ] Complete 0.5.8 exact pins across dependencies, runtime policy, generators, and fixtures.
- [ ] Run focused drift, publication, lock, Stop/CLI and provider tests plus required repository checks; document red-green evidence and limits.
- [ ] Record durable recovery contract and task evidence; retain source and installed-runtime evidence; follow the approved bounded downstream validation.

## Approved Integration Follow-through

User approved latest-main integration and bounded real downstream recovery. Preserve original downstream cursor/backlog snapshots before mutation; observe actual installed source and multiple windows. No npm release is implied.
