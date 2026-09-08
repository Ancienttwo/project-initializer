> **Archived**: 2026-09-09 00:12
> **Related Plan**: plans/archive/plan-20260909-0010-mcp-uninstall-merge.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260909-0012
> **Archive Projection V1**: `plans/plan-20260909-0010-mcp-uninstall-merge.md` => `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/notes/20260909-0010-mcp-uninstall-merge.notes.md` => `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0010-mcp-uninstall-merge.contract.md` => `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0010-mcp-uninstall-merge.review.md` => `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`

# Plan: Merge accepted MCP uninstall

> **Status**: Archived
> **Created**: 20260909-0010
> **Slug**: mcp-uninstall-merge
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: merge_boundary
> **Verification Boundary**: Current main integration of accepted MCP bytes
> **Rollback Surface**: Single local publication commit
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`
> **Task Review**: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`
> **Implementation Notes**: `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`

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

- Active plan: `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md`
- Sprint contract: `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`
- Sprint review: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`
- Implementation notes: `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260909-0010-mcp-uninstall-merge.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260909-0010-mcp-uninstall-merge.md`.

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
- Contract file: `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`
- Review file: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`
- Implementation notes file: `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Single local publication commit
- **Verification boundary**: Current main integration of accepted MCP bytes
- **Review/acceptance boundary**: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: merge_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`, `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`, and `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Single local publication commit

## Captured Planning Output

## Goal
Publish the already accepted MCP setup uninstall into current main after the user's explicit merge approval. Preserve the previously sealed archive and the independent architecture drift fix on main.

## Approach
Implementation and test bytes are unchanged from accepted f3b96cfd. Rebase onto synchronized main fe35f0a9 is conflict-free. The prior no-merge workflow is archived and immutable, so use this integration contract to bind the existing focused verification to the current base. No new product feature, dependency, refactor or broad review. Existing two specialist passes and installed-package smoke remain implementation baseline evidence.

## Verification
Reuse the bounded MCP/setup/registry and configuration tests, typecheck, and six mandatory repository checks; no full suite. Record current-base acceptance, run contract-worktree finish --merge, read back main and clean only the task worktree/branch. No package release.

## Task Breakdown
- [ ] Bind current-base integration verification and existing review evidence without changing MCP implementation.
- [ ] Merge to main through the local seal, read back publication and clean this task worktree.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Bind current-base integration verification and existing review evidence without changing MCP implementation.
- [ ] Merge to main through the local seal, read back publication and clean this task worktree.
