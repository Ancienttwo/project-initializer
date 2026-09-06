# Plan: BRC15a shadow provider budget prerequisite

> **Status**: Executing
> **Created**: 20260907-0149
> **Slug**: brc15a-shadow-provider-budget
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Shadow real observer provider admission and exact terminal recovery
> **Rollback Surface**: Revert orchestration while retaining immutable budget and outcome evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md`
> **Task Review**: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md`
> **Implementation Notes**: `tasks/notes/20260907-0149-brc15a-shadow-provider-budget.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260907-0149-brc15a-shadow-provider-budget.md`
- Sprint contract: `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md`
- Sprint review: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md`
- Implementation notes: `tasks/notes/20260907-0149-brc15a-shadow-provider-budget.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-0149-brc15a-shadow-provider-budget.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-0149-brc15a-shadow-provider-budget.md`.

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
- Contract file: `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md`
- Review file: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md`
- Implementation notes file: `tasks/notes/20260907-0149-brc15a-shadow-provider-budget.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-0149-brc15a-shadow-provider-budget.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert orchestration while retaining immutable budget and outcome evidence
- **Verification boundary**: Shadow real observer provider admission and exact terminal recovery
- **Review/acceptance boundary**: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-0149-brc15a-shadow-provider-budget.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-0149-brc15a-shadow-provider-budget.contract.md`, `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md`, and `tasks/notes/20260907-0149-brc15a-shadow-provider-budget.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-0149-brc15a-shadow-provider-budget.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert orchestration while retaining immutable budget and outcome evidence

## Captured Planning Output

# BRC15a shadow provider budget prerequisite

## Decision and scope
Implement only shadow adoption dry-run provider budget consumption. Existing actual GPT authoring/fill/edit/challenge reservations remain the authority. Reuse the campaign provider executor for each real GitHub identity and page read. This prerequisite does not complete Sprint BRC15a, run a real canary, prove exact-SHA connector access, or complete BRC9. Active publication and acquisition accounting are outside this package.

## P1/P2/P3
P1: issue-batch-adoption currently performs two unbudgeted provider observations around an immutable authoring terminal. The terminal verifier binds the entire current automation ledger. Existing campaign step admission excludes competing authoring, and provider executor reserves each adapter invocation before I/O. Authoring sessions and group ledger already own authoring progress; no new budget counters are needed.
P2: completed challenge -> authoring epoch from existing group ledger -> durable step admission -> initial snapshot -> final snapshot and source comparison -> durable per-step outcome -> completion and terminal under one budget lock -> dry-run adoption receipt. Same-epoch retry reuses exact evidence; incomplete batches complete no-progress without sealing, so a later authorized fill advances the authoring epoch. Unknown I/O retains its reservation and cannot repeat. A crash after completion but before terminal can only finish if the completion is still the latest ledger transition.
P3: Shadow checks provider sources at a point in time while the active step fences authorized authoring, then seals. This explicitly changes shadow ordering; it does not claim remote sources cannot change after that observation. Keep active post-seal refresh behavior and exact terminal freshness unchanged. No new dependencies, public commands, schemas for budget authority, or automatic retry. Per-step outcome persistence protects recovery, and an authoring-epoch read is a deterministic projection of existing evidence. At 10x scale the existing one-step/one-open-reservation policy serializes provider execution; that is the bounded cost, not a reason to add concurrency.

## File boundary
Production: src/effects/automation/budget-store.ts (read authoring epoch and atomic step/terminal finalization), src/effects/automation/issue-batch-store.ts (immutable keyed shadow outcome), src/effects/automation/issue-batch-adoption.ts (shadow orchestration), src/effects/automation/campaign-provider-execution.ts only its ownership comment if needed. A focused shadow helper may be extracted only if it keeps the active path readable; it owns orchestration, not arithmetic. Tests: tests/effects/issue-batch-adoption.test.ts, tests/effects/issue-batch-shadow-budget.test.ts, tests/effects/campaign-authoring-budget.test.ts or existing budget test owner, tests/helpers/campaign-adoption-repository.ts. Durable docs: docs/researches/20260907-brc15a-shadow-provider-budget.md, architecture projection outputs, this plan contract/review/notes and tasks/todos.md. Preserve the five audited development-document edits in the main checkout.

## Verification
First reproduce unbudgeted GitHub access with actual observeIssueBatch and a fake GithubCommandRunner in a disposable repo with real budget ledger. Verify reservations precede every identity/page call, provider cap rejects before I/O, returned/typed-error usage settles, unknown outcomes remain unresolved, replay performs zero I/O, partial/fill retry works, source title/label drift rejects, terminal covers final provider usage and completion, and crash/concurrent drift cannot create stale terminal authority. Run named adoption, authoring budget, provider executor and heartbeat regression files plus typecheck and the six repository-integrity commands from AGENTS.md. No real GPT/GitHub effects and no local full suite: these named tests cover the changed shared boundaries. Freeze then prepare acceptance and one check review.

## Task Breakdown
- [x] Capture the shadow provider-budget regression in an isolated contract worktree.
- [x] Persist shadow observation outcomes and reuse existing step/provider budget authority.
- [x] Finalize step and exact terminal under the budget lock with crash replay checks.
- [x] Verify real observer, refusal, drift, replay, partial-fill and existing active behavior.
- [ ] Promote durable evidence and complete risk-scoped acceptance for this prerequisite only.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Capture the shadow provider-budget regression in an isolated contract worktree.
- [x] Persist shadow observation outcomes and reuse existing step/provider budget authority.
- [x] Finalize step and exact terminal under the budget lock with crash replay checks.
- [x] Verify real observer, refusal, drift, replay, partial-fill and existing active behavior.
- [ ] Promote durable evidence and complete risk-scoped acceptance for this prerequisite only.
