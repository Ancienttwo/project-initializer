> **Archived**: 2026-09-06 04:41
> **Related Plan**: plans/archive/plan-20260906-0428-claude-startup-cancel.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-0441
> **Archive Projection V1**: `plans/plan-20260906-0428-claude-startup-cancel.md` => `plans/archive/plan-20260906-0428-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/notes/20260906-0428-claude-startup-cancel.notes.md` => `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0428-claude-startup-cancel.contract.md` => `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0428-claude-startup-cancel.review.md` => `tasks/archive/review-20260906-0441-claude-startup-cancel.md`

# Plan: Fix Claude reviewer startup cancellation

> **Status**: Archived
> **Created**: 20260906-0428
> **Slug**: claude-startup-cancel
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Real tmux startup and cancellation ownership regressions
> **Rollback Surface**: Startup cancellation bugfix unit
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`
> **Task Review**: `tasks/archive/review-20260906-0441-claude-startup-cancel.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`

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

- Active plan: `plans/archive/plan-20260906-0428-claude-startup-cancel.md`
- Sprint contract: `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`
- Sprint review: `tasks/archive/review-20260906-0441-claude-startup-cancel.md`
- Implementation notes: `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-0441-claude-startup-cancel.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-0428-claude-startup-cancel.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-0428-claude-startup-cancel.md`.

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
- Contract file: `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`
- Review file: `tasks/archive/review-20260906-0441-claude-startup-cancel.md`
- Implementation notes file: `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-0441-claude-startup-cancel.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-0428-claude-startup-cancel.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Startup cancellation bugfix unit
- **Verification boundary**: Real tmux startup and cancellation ownership regressions
- **Review/acceptance boundary**: `tasks/archive/review-20260906-0441-claude-startup-cancel.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-0428-claude-startup-cancel.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-0441-claude-startup-cancel.md`, `tasks/archive/review-20260906-0441-claude-startup-cancel.md`, and `tasks/archive/notes-20260906-0441-claude-startup-cancel.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-0441-claude-startup-cancel.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Startup cancellation bugfix unit

## Captured Planning Output

## Goal
Fix explicit cancellation after Claude reviewer startup fails before processes.json is published, without granting acceptance or signalling unowned processes.

## Design
The session caller and host serialize bootstrap against cancellation with a startup directory lock. The host publishes spawn intent before creating a child. A cancelled bootstrap never starts a child. A proven no-child startup failure permits an explicit cancelled terminal record; missing or ambiguous ownership after spawn intent fails closed with a specific error. Existing identity-fenced metadata cleanup remains the owner once processes.json exists. No restart, admission reset, model change or other review findings belong to this slice.

## Verification Boundary
Real tmux lifecycle regressions including spawn failure, delayed bootstrap cancellation, ambiguous ownership refusal and existing sentinel isolation; named type/helper/reference and six repository integrity checks. No full suite: all changed runtime paths live in the existing lifecycle test module.

## Rollback Surface
Revert the startup/cancel code and its focused regressions as one bugfix unit.

## Task Breakdown
- [x] Reproduce pre-metadata cancellation failure with a real host and record root cause evidence.
- [x] Implement startup/cancel serialization and proof-based cancellation; add ownership regressions.
- [x] Run focused lifecycle and required integrity checks, update durable lifecycle documentation and close the deferred item.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Reproduce pre-metadata cancellation failure with a real host and record root cause evidence.
- [x] Implement startup/cancel serialization and proof-based cancellation; add ownership regressions.
- [x] Run focused lifecycle and required integrity checks, update durable lifecycle documentation and close the deferred item.
