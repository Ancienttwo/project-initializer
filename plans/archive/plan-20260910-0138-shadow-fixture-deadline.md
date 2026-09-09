> **Archived**: 2026-09-10 01:42
> **Related Plan**: plans/archive/plan-20260910-0138-shadow-fixture-deadline.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260910-0142
> **Archive Projection V1**: `plans/plan-20260910-0138-shadow-fixture-deadline.md` => `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/notes/20260910-0138-shadow-fixture-deadline.notes.md` => `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0138-shadow-fixture-deadline.contract.md` => `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0138-shadow-fixture-deadline.review.md` => `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`

# Plan: Shadow ledger fixture deadline

> **Status**: Archived
> **Created**: 20260910-0138
> **Slug**: shadow-fixture-deadline
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`; after execution revert branch `codex/shadow-fixture-deadline` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`
> **Task Review**: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`
> **Implementation Notes**: `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`
- Sprint contract: `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`
- Sprint review: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`
- Implementation notes: `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260910-0138-shadow-fixture-deadline.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`.

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
- Contract file: `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`
- Review file: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`
- Implementation notes file: `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`; after execution revert branch `codex/shadow-fixture-deadline` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260910-0142-shadow-fixture-deadline.md`, `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md`, and `tasks/archive/notes-20260910-0142-shadow-fixture-deadline.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260910-0142-shadow-fixture-deadline.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260910-0138-shadow-fixture-deadline.md`; after execution revert branch `codex/shadow-fixture-deadline` or the explicitly reviewed diff.

## Captured Planning Output

## Goal

Make the shadow-budget ledger regression deterministic under CI filesystem latency without changing runtime deadlines or real campaign budgets.

## P1 / P2 / P3

The shadow suite uses the real observer and real reservation/usage stores around a modeled GitHub runner. Shared fixture policy fixes GitHub deadline at1000ms. CI34381786394 failed before the stale-terminal assertions because fsync-backed provider accounting exceeded that window. Add an optional fixture-only deadline, retain the default for other consumers, and select20000ms for shadow ledger tests (same bound as their test timeout). Inject one1100ms modeled read into the existing stale-terminal regression so the old fixture fails deterministically and the corrected test still asserts stale ledger rejection and unchanged provider call count. No product source or deadline gate changes.

## Scope

Only tests/helpers/campaign-adoption-repository.ts, tests/effects/issue-batch-shadow-budget.test.ts and required workflow/evidence documentation. This is the single directly blocking extra following approved C7 correction. A second independent issue stops work.

## Task Breakdown

- [ ] Capture deterministic pre-fix deadline failure with the existing stale-terminal regression.
- [ ] Parameterize fixture deadline and select a bounded shadow-ledger test window.
- [ ] Verify shadow-budget and deadline adapter coverage, typecheck and six required integrity checks.
- [ ] Complete canonical acceptance and update PR385; wait exact Required CI before BRC continuation.

## Rollback

Revert this fixture-only change independently of campaign recovery and C7 test correction.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Capture deterministic pre-fix deadline failure with the existing stale-terminal regression.
- [ ] Parameterize fixture deadline and select a bounded shadow-ledger test window.
- [ ] Verify shadow-budget and deadline adapter coverage, typecheck and six required integrity checks.
- [ ] Complete canonical acceptance and update PR385; wait exact Required CI before BRC continuation.
