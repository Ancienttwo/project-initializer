> **Archived**: 2026-09-08 19:21
> **Related Plan**: plans/archive/plan-20260908-1905-brc354-cleanup-integration.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1921
> **Archive Projection V1**: `plans/plan-20260908-1905-brc354-cleanup-integration.md` => `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`
> **Archive Projection V1**: `tasks/notes/20260908-1905-brc354-cleanup-integration.notes.md` => `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1905-brc354-cleanup-integration.contract.md` => `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1905-brc354-cleanup-integration.review.md` => `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`

# Plan: BRC354 recovery-compatible container cleanup

> **Status**: Archived
> **Created**: 20260908-1905
> **Slug**: brc354-cleanup-integration
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`; after execution revert branch `codex/brc354-cleanup-integration` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md`
> **Task Review**: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`

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

- Active plan: `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`
- Sprint contract: `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md`
- Sprint review: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`
- Implementation notes: `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1905-brc354-cleanup-integration.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`.

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
- Contract file: `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md`
- Review file: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`
- Implementation notes file: `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`; after execution revert branch `codex/brc354-cleanup-integration` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1921-brc354-cleanup-integration.md`, `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md`, and `tasks/archive/notes-20260908-1921-brc354-cleanup-integration.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1921-brc354-cleanup-integration.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-1905-brc354-cleanup-integration.md`; after execution revert branch `codex/brc354-cleanup-integration` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Complete the remaining #354 retention boundary on PR #361 commit 491ff094: remove only expired inactive exact containers while retaining protected recovery evidence.

## P1 Map
The container effect owns protected host journals; campaign-runtime and recovery consume their immutable proofs. #361 owns deterministic preparation journals and missing-created reconstruction. The supplement owns cleanupCampaignContainer, its operator script, and Docker integration coverage.

## P2 Trace
Controller SIGKILL after create but before created publication -> expired request plus exact Docker name reconstructs handle -> durable interruption -> exact non-force removal -> retained interruption and terminal readback. Unknown preparation cannot authorize removal.

## P3 Decision
Keep #361 preparation authority wholesale. Port only the previously reviewed cleanup primitive. No second preparation key or fallback. Keep all journals without TTL; at 10x volume retained journal storage grows and requires a separately authorized retention policy. No model calls, active enablement, package release, or unrelated cleanup.

## Allowed Paths
src/effects/automation/campaign-container.ts; scripts/cleanup-campaign-container.ts; tests/effects/campaign-container-live.test.ts; tests/effects/campaign-runtime-container.test.ts; docs/researches/2026-09-08-brc354-independent-supervision.md; docs/architecture/; plans/; tasks/.

## Task Breakdown
- [ ] Add exact-container cleanup and operator entrypoint on #361.
- [ ] Verify recovery then cleanup using real SIGKILL and retained readback; preserve refusal and actual consumer coverage.
- [ ] Run focused Docker, typecheck, helper parity, and six required repository checks through frozen acceptance.
- [ ] Record independent delta review and archive local acceptance; coordinate remote ownership before merging either existing PR.

## Verification
Run the two changed Docker files with pinned BRC_TEST_CONTAINER_IMAGE, check:type, check:helpers, and the six repository integrity checks. Reuse #361 preparation/lifecycle evidence only as its original baseline; this candidate runs composition and cleanup coverage. No full local suite.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Add exact-container cleanup and operator entrypoint on #361.
- [ ] Verify recovery then cleanup using real SIGKILL and retained readback; preserve refusal and actual consumer coverage.
- [ ] Run focused Docker, typecheck, helper parity, and six required repository checks through frozen acceptance.
- [ ] Record independent delta review and archive local acceptance; coordinate remote ownership before merging either existing PR.
