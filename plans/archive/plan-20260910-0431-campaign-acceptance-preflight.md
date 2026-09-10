> **Archived**: 2026-09-10 11:55
> **Related Plan**: plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260910-1155
> **Archive Projection V1**: `plans/plan-20260910-0431-campaign-acceptance-preflight.md` => `plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md`
> **Archive Projection V1**: `tasks/notes/20260910-0431-campaign-acceptance-preflight.notes.md` => `tasks/archive/notes-20260910-1155-campaign-acceptance-preflight.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0431-campaign-acceptance-preflight.contract.md` => `tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0431-campaign-acceptance-preflight.review.md` => `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md`

# Plan: Validate campaign contracts and preserve acquired workflow artifacts

> **Status**: Archived
> **Created**: 20260910-0431
> **Slug**: campaign-acceptance-preflight
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Model-free acquire to canonical acceptance preflight without changing business scope
> **Rollback Surface**: Revert one campaign admission and Fleet activation repair PR
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md`
> **Task Review**: `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md`
> **Implementation Notes**: `tasks/archive/notes-20260910-1155-campaign-acceptance-preflight.md`

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

- Active plan: `plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md`
- Sprint contract: `tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md`
- Sprint review: `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md`
- Implementation notes: `tasks/archive/notes-20260910-1155-campaign-acceptance-preflight.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md`.

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
- Contract file: `tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md`
- Review file: `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md`
- Implementation notes file: `tasks/archive/notes-20260910-1155-campaign-acceptance-preflight.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert one campaign admission and Fleet activation repair PR
- **Verification boundary**: Model-free acquire to canonical acceptance preflight without changing business scope
- **Review/acceptance boundary**: `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260910-0431-campaign-acceptance-preflight.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260910-1155-campaign-acceptance-preflight.md`, `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md`, and `tasks/archive/notes-20260910-1155-campaign-acceptance-preflight.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260910-1155-campaign-acceptance-preflight.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert one campaign admission and Fleet activation repair PR

## Captured Planning Output

P1: Campaign planning admission consumes runCampaignPlanningPreflight, whose trusted contract-run helper validates the authored brief and Root Cause Evidence but omits metadata enforced later by verify-contract. Fleet acquisition uses defaultStart then defaultProject; its plan-to-todo helper initializes authoring artifacts and rewrites plan/review/notes/todos. Canonical verify-sprint examines the entire worktree against the business allowlist.
P2: The real original Issue177 contract omitted evidence_requirements.benchmark yet admission passed. Acquire then rewrote four committed workflow metadata files before the worker started. The worker corrected README and passed all three regressions, but canonical acceptance rejected both the missing declaration and out-of-scope projection writes. The exact failed run and immutable contract remain in the retained canary worktree; no prior dispatch may be rebound.
P3: Add a read-only metadata preflight mode to the existing canonical verify-contract helper, reusing its Evidence Requirements parser, Verification Plan validator, profile and Root Cause Evidence checks; it executes no command or exit criteria and cannot produce acceptance reports. Campaign admission consumes this trusted mode before accepting the brief. Metadata preflight requires an explicitly declared authored review artifact; Fleet runs the same preflight before claim and in the fresh worktree before bind/token publication. Reuse the existing trusted switch-plan helper for Fleet acquire after its plan/contract proof has been verified; activate local ignored pointers without rewriting tracked workflow artifacts. Normal authoring projection keeps existing behavior. Do not expand worker allowed_paths, exempt arbitrary workflow edits, add a second parser, or alter campaign budget/recovery authority.
Verification: model-free negatives for missing/malformed benchmark, malformed Verification Plan and attempted commands during preflight; real Fleet acquire followed by canonical verify-sprint proves a business-only edit passes scope while an actual protected-path mutation still fails before command execution. Cover source and packaged helpers, CLI planning, affected contract/worktree helpers, typecheck and six required integrity commands. No full local suite; CI retains its required suite.
Scale/tradeoff: metadata validation adds a bounded local helper invocation before admission. At 10x task volume subprocess startup is the first cost; there is no extra model/provider spend, no new persistent authority, and no silent fallback.
Acceptance: one repair PR, exact Required CI and merge. Only then refresh the container and perform no-auth full-path preflight against the actual target before any newly authorized real campaign execution. Preserve original Issues177/178 and all stopped campaign evidence.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: Validate campaign contracts and preserve acquired workflow artifacts
