> **Archived**: 2026-09-08 05:15
> **Related Plan**: plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-0515
> **Archive Projection V1**: `plans/plan-20260908-0418-brc14-fresh-audit-runtime.md` => `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md`
> **Archive Projection V1**: `tasks/notes/20260908-0418-brc14-fresh-audit-runtime.notes.md` => `tasks/archive/notes-20260908-0515-brc14-fresh-audit-runtime.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0418-brc14-fresh-audit-runtime.contract.md` => `tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0418-brc14-fresh-audit-runtime.review.md` => `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md`

# Plan: BRC14 fresh audit runtime and ordered groups

> **Status**: Archived
> **Created**: 20260908-0418
> **Slug**: brc14-fresh-audit-runtime
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md`; after execution revert branch `codex/brc14-fresh-audit-runtime` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md`
> **Task Review**: `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-0515-brc14-fresh-audit-runtime.md`

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

- Active plan: `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md`
- Sprint contract: `tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md`
- Sprint review: `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md`
- Implementation notes: `tasks/archive/notes-20260908-0515-brc14-fresh-audit-runtime.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md`.

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
- Contract file: `tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md`
- Review file: `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md`
- Implementation notes file: `tasks/archive/notes-20260908-0515-brc14-fresh-audit-runtime.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md`; after execution revert branch `codex/brc14-fresh-audit-runtime` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-0515-brc14-fresh-audit-runtime.md`, `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md`, and `tasks/archive/notes-20260908-0515-brc14-fresh-audit-runtime.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-0515-brc14-fresh-audit-runtime.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-0418-brc14-fresh-audit-runtime.md`; after execution revert branch `codex/brc14-fresh-audit-runtime` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Implement BRC14 fresh audit runtime and ordered group admission on the accepted67d3e858 integration. Preserve user-default UI model and GitHub selection. No additional BRC6a probes or GPT calls in this implementation/test slice.

## P1/P2/P3
P1: campaign event store owns lifecycle CAS; group authoring owns intent baseline; issue-batch store owns immutable group artifacts; cleanup records own per-Task completion; budget-store owns provider admission. Current generic accept_group lacks an audit consumer and authoring uses initial campaign revision for all groups.
P2: Read current group from canonical prepare/accept events -> bind complete adoption/slot/cleanup snapshot to current target -> prepare fresh-session audit request under a distinct audit provider reservation -> retain validated output/session as immutable observation -> shared store checks current group and audit provenance before accept/next group/complete. Authoring gets baseline from the same accepted-group resolver. Missing trusted revision authority yields unverified and no advancement; no caller-authored receipt can override the existing active-admission guard.
P3: Reuse current locks, canonical digests and browser consult (not followup); no dependency, separate budget or transport. Audit call consumes provider budget but not authoring rounds. Keep real exact-version acceptance pending while source and model-free regression paths are implemented. At10x the group_count limit and missing proof fail closed; no Group4, invisible retry or rollback.

## Scope
Core audit protocol/group projection; group snapshot/observation store and budgeted fresh audit executor; campaign shared transition consumer; authoring group/baseline; audit budget operation; existing campaign CLI subcommand; focused tests and docs/architecture workflow. Base includes accepted next-stage integration; preserve main WIP and foreign brc-host worktree. No release/install/GitHub writes/new GPT calls.

## Verification
Focused core audit, effect audit, campaign-store, authoring, audit-budget and campaign CLI checks plus type and six required integrity commands. Real provider proof is not claimed by fakes. Freeze one source subject and use one /check acceptance. No full suite. Archive with --no-merge.

## Task Breakdown
- [x] Implement complete group snapshot and fresh audit observation/protocol.
- [x] Wire audit budget, CLI, lifecycle acceptance and authoring group baseline.
- [ ] Verify model-free failure/sequencing/accounting cases, document actual limits and archive.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Implement complete group snapshot and fresh audit observation/protocol.
- [x] Wire audit budget, CLI, lifecycle acceptance and authoring group baseline.
- [ ] Verify model-free failure/sequencing/accounting cases, document actual limits and archive.
