> **Archived**: 2026-09-08 14:33
> **Related Plan**: plans/archive/plan-20260908-1425-brc14-followup-handoff.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1433
> **Archive Projection V1**: `plans/plan-20260908-1425-brc14-followup-handoff.md` => `plans/archive/plan-20260908-1425-brc14-followup-handoff.md`
> **Archive Projection V1**: `tasks/notes/20260908-1425-brc14-followup-handoff.notes.md` => `tasks/archive/notes-20260908-1433-brc14-followup-handoff.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1425-brc14-followup-handoff.contract.md` => `tasks/archive/contract-20260908-1433-brc14-followup-handoff.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1425-brc14-followup-handoff.review.md` => `tasks/archive/review-20260908-1433-brc14-followup-handoff.md`

# Plan: BRC14 follow-up handoff and terminal state

> **Status**: Archived
> **Created**: 20260908-1425
> **Slug**: brc14-followup-handoff
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260908-brc14-provider-history-evidence.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Follow-up prompt authority and canonical terminal outcome
> **Rollback Surface**: Revert new event and prompt paths; preserve recorded audit evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1433-brc14-followup-handoff.md`
> **Task Review**: `tasks/archive/review-20260908-1433-brc14-followup-handoff.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1433-brc14-followup-handoff.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260908-brc14-provider-history-evidence.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260908-1425-brc14-followup-handoff.md`
- Sprint contract: `tasks/archive/contract-20260908-1433-brc14-followup-handoff.md`
- Sprint review: `tasks/archive/review-20260908-1433-brc14-followup-handoff.md`
- Implementation notes: `tasks/archive/notes-20260908-1433-brc14-followup-handoff.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1433-brc14-followup-handoff.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1425-brc14-followup-handoff.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1425-brc14-followup-handoff.md`.

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
- Contract file: `tasks/archive/contract-20260908-1433-brc14-followup-handoff.md`
- Review file: `tasks/archive/review-20260908-1433-brc14-followup-handoff.md`
- Implementation notes file: `tasks/archive/notes-20260908-1433-brc14-followup-handoff.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1433-brc14-followup-handoff.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1425-brc14-followup-handoff.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert new event and prompt paths; preserve recorded audit evidence
- **Verification boundary**: Follow-up prompt authority and canonical terminal outcome
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1433-brc14-followup-handoff.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1425-brc14-followup-handoff.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1433-brc14-followup-handoff.md`, `tasks/archive/review-20260908-1433-brc14-followup-handoff.md`, and `tasks/archive/notes-20260908-1433-brc14-followup-handoff.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1433-brc14-followup-handoff.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert new event and prompt paths; preserve recorded audit evidence

## Captured Planning Output

# BRC14 follow-up handoff and terminal state

## P1/P2/P3
Existing design plans/sprints/20260902-GPT-issues-loop.md:1168 requires prior accepted_with_followups findings in the next authorized authoring brief and completed_with_followups after the last group. The verified observation is already immutable and referenced by accept_group; requireAcceptedCampaignGroup currently drops it and returns only snapshot. Authoring hashes its generated prompt before provider budget admission. Lifecycle complete currently always maps to completed.

Preserve observations as the only findings authority. Return the validated observation alongside snapshot internally; retain SHA-only resolveCampaignGroupBaseline for planning/observer consumers and add a narrow authoring context projection returning baseline and prior findings. Both initial and continuation prompt paths consume that projection before hashing/admission. Empty Group 1 context is intrinsic, not missing-authority fallback.

Add explicit complete_with_followups operation and completed_with_followups terminal state to the canonical campaign event protocol; guard both completion operations against the final verified audit disposition and exact authorized group count. Do not infer disposition from findings length. Update cleanup admission and group progression to recognize the explicit operation. Read-only status continues folding the historical event chain without checking present grant freshness. Existing completed records remain their recorded state; do not migrate or reinterpret them.

This adds one canonical operation/state because the existing design requires a distinct persisted terminal outcome. No new dependencies, registry, service or separate findings store. The narrow projection has a distinct authoring consumer; shared verifier continues guarding all next-group and completion callers. At 10x authoring volume prompt size from raw findings is the first limitation; preserve existing provider/budget bounds, do not summarize model-owned findings locally.

## Scope
src/core/automation/{development-campaign,campaign-fresh-audit}.ts; src/effects/automation/{campaign-fresh-audit,gpt-pro-issue-authoring,development-campaign-store}.ts; focused tests, architecture projections, durable research and workflow artifacts. Worktree remains isolated. Do not change active admission, invoke models, create Issues, reset budgets, merge main, release or mark BRC14/BRC15 complete.

## Task Breakdown
- [x] Bind next-group authoring prompt to previous verified accepted audit findings, preserving baseline-only callers.
- [x] Persist distinct completion operation/state with exact final disposition and group-count guards.
- [x] Test provider-bound prompt text/hash, last-group completion mismatch, replay/terminal refusal and unchanged read-only status.
- [x] Freeze, run focused tests/typecheck and six integrity checks, independent delta review, archive without completing sprint row or merging main.

## Verification
Focused campaign-fresh-audit, gpt-pro-issue-authoring, development-campaign-core/store/CLI tests; TypeScript; SQL order, architecture sync, task sync, strict workflow, inspect-project-state and init dry-run. No full suite: named boundaries cover changed event enum, consumer prompts, state folding and completion guard. No real provider tests. Baseline 01c28fee retains prior evidence; this package verifies only its delta.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Bind next-group authoring prompt to previous verified accepted audit findings, preserving baseline-only callers.
- [x] Persist distinct completion operation/state with exact final disposition and group-count guards.
- [x] Test provider-bound prompt text/hash, last-group completion mismatch, replay/terminal refusal and unchanged read-only status.
- [x] Freeze, run focused tests/typecheck and six integrity checks, independent delta review, archive without completing sprint row or merging main.
