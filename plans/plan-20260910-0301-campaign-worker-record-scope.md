# Plan: Align worker record instructions with write scope

> **Status**: Executing
> **Created**: 20260910-0301
> **Slug**: campaign-worker-record-scope
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260910-0301-campaign-worker-record-scope.md`; after execution revert branch `codex/campaign-worker-record-scope` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md`
> **Task Review**: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md`
> **Implementation Notes**: `tasks/notes/20260910-0301-campaign-worker-record-scope.notes.md`

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

- Active plan: `plans/plan-20260910-0301-campaign-worker-record-scope.md`
- Sprint contract: `tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md`
- Sprint review: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md`
- Implementation notes: `tasks/notes/20260910-0301-campaign-worker-record-scope.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260910-0301-campaign-worker-record-scope.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260910-0301-campaign-worker-record-scope.md`.

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
- Contract file: `tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md`
- Review file: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md`
- Implementation notes file: `tasks/notes/20260910-0301-campaign-worker-record-scope.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260910-0301-campaign-worker-record-scope.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260910-0301-campaign-worker-record-scope.md`; after execution revert branch `codex/campaign-worker-record-scope` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260910-0301-campaign-worker-record-scope.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260910-0301-campaign-worker-record-scope.contract.md`, `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md`, and `tasks/notes/20260910-0301-campaign-worker-record-scope.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260910-0301-campaign-worker-record-scope.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260910-0301-campaign-worker-record-scope.md`; after execution revert branch `codex/campaign-worker-record-scope` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Remove the observed contradiction between contract business writable paths and mandatory worker record instructions.

## P1 / P2 / P3
scripts/contract-run.ts and its shipped mirror generate the final worker task packet. It currently requires Notes and campaign-attempt-result writes while declaring only contract business paths writable and stopping on any other write. Actual BRC worker refused all edits and emitted no result; verifier rejected unchanged README and controller retained unresolved reservation. Keep business writable paths and delegation unchanged. Notes outside those paths must be reported in final response for the parent, not appended by the worker. The runner-owned exact campaign result file is an explicit output obligation of the selected campaign runtime, distinct from repository edit authority. Authorize only that exact generated path, including blocked outcomes, without authorizing arbitrary notes, review, plan, contract or policy mutations. Canonical verification command retains its existing controlled output behavior. Existing stop receipts and replay rejection remain unchanged.

## Scope
scripts/contract-run.ts, assets/templates/helpers/contract-run.ts, tests/contract-run.test.ts, model-free campaign rendered packet coverage if available, required workflow/research. No new provider invocation, cap increase, retry/recovery broadening, missing context-file repair, or acceptance bypass.

## Task Breakdown
- [ ] Prove existing generated Notes instruction contradicts a narrow writable allowlist with model-free dry-run.
- [ ] Make Notes writes conditional on explicit write scope and declare exact runner-owned campaign result output authority.
- [ ] Verify rendered packets, one execution-boundary clause, script mirror, typecheck and required integrity.
- [ ] Complete review/acceptance, publish bounded PR and preserve unresolved BRC runtime evidence for owner budget decision.

## Rollback
Revert generated worker record instruction delta; no live dispatch or historical receipt migration.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Prove existing generated Notes instruction contradicts a narrow writable allowlist with model-free dry-run.
- [ ] Make Notes writes conditional on explicit write scope and declare exact runner-owned campaign result output authority.
- [ ] Verify rendered packets, one execution-boundary clause, script mirror, typecheck and required integrity.
- [ ] Complete review/acceptance, publish bounded PR and preserve unresolved BRC runtime evidence for owner budget decision.
