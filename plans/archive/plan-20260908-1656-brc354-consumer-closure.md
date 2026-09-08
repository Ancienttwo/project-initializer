> **Archived**: 2026-09-08 17:14
> **Related Plan**: plans/archive/plan-20260908-1656-brc354-consumer-closure.md
> **Outcome**: Superseded
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1714
> **Archive Projection V1**: `plans/plan-20260908-1656-brc354-consumer-closure.md` => `plans/archive/plan-20260908-1656-brc354-consumer-closure.md`
> **Archive Projection V1**: `tasks/notes/20260908-1656-brc354-consumer-closure.notes.md` => `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1656-brc354-consumer-closure.contract.md` => `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1656-brc354-consumer-closure.review.md` => `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`

# Plan: BRC354 protected consumer and bounded recovery

> **Status**: Archived
> **Created**: 20260908-1656
> **Slug**: brc354-consumer-closure
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Independent containment producer and actual consumer recovery
> **Rollback Surface**: Docker carrier and managed campaign consumer cutover
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md`
> **Task Review**: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`

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

- Active plan: `plans/archive/plan-20260908-1656-brc354-consumer-closure.md`
- Sprint contract: `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md`
- Sprint review: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`
- Implementation notes: `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1656-brc354-consumer-closure.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1656-brc354-consumer-closure.md`.

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
- Contract file: `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md`
- Review file: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`
- Implementation notes file: `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1714-brc354-consumer-closure.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1656-brc354-consumer-closure.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Docker carrier and managed campaign consumer cutover
- **Verification boundary**: Independent containment producer and actual consumer recovery
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1656-brc354-consumer-closure.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1714-brc354-consumer-closure.md`, `tasks/archive/review-20260908-1714-brc354-consumer-closure.md`, and `tasks/archive/notes-20260908-1714-brc354-consumer-closure.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1714-brc354-consumer-closure.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Docker carrier and managed campaign consumer cutover

## Captured Planning Output

## Goal
Complete approved work-package A for #354 using the preserved Docker candidate at 1d0c65a787883b682a85ecb195f5cef85d884606 and accepted main d4852017f6fc5d9a5167bdf5b64eaf48f9b442c1. Stop at independently reviewable candidate and evidence, without merging, closing #354, enabling active, issuing grants, model calls, or publishing.

## P1 / P2 / P3
Carrier preparation persists identity before create; managed contract-run executes it, afterChild consumes protected terminal evidence, finish settles once, recovery reconciles the original identity. Preserve main's single-lock settlement, nonblocking descriptor handling, cancellation bounds, full-input admission regressions and CLI replay exit status. The old candidate exposes its journal through the readonly common Git mount; isolate that authority from all workload mounts and aliases. Reconcile interrupted preparation and execution without restarting or synthesizing provider output. At 10x, Docker capacity and bounded journal retention are the pressure points; reject uncertainty rather than relax isolation.

## Task Breakdown
- [ ] Integrate the preserved candidate in an isolated worktree; retain all historical failed batches and Owner closeouts.
- [ ] Prove current gaps with focused failures; isolate control storage and bind actual consumers to exact identity.
- [ ] Complete bounded create/start/controller-death recovery and actual finish(fail) replay without reexecution.
- [ ] Freeze source and verify replacement window, identity drift, role access, deadlines, cancellation, FIFO, daemon unknown and helper parity using model-free children.
- [ ] Run scoped type/integrity checks, record exact evidence and remaining gaps, commit/push review candidate and read CI.

## Verification
Use targeted containment/runtime/worker/recovery/lifecycle/admission/CLI/bounded-runner tests, real local Docker with no credentials or provider calls, helper parity, typecheck and six root required integrity checks. Historical three failed adapter rounds and three failed consumer batches remain in the preserved plan and notes; this is the explicitly approved bounded continuation, not reset evidence. No full local suite unless a concrete uncovered integration risk emerges. CI remains its own acceptance surface.

## Acceptance boundary
The protected journal must not be mounted or reachable by workload aliases or daemon permissions. Unknown daemon/create/start/output states remain conservative. One absolute workload deadline; finite separate cleanup. Tests must exercise actual runChild -> afterChild -> finish and recovery, both source and packaged helper. Active remains hard-disabled throughout. BRC6a/BRC15a stay Owner-closed; BRC14/BRC15 and package release remain unverified.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Integrate the preserved candidate in an isolated worktree; retain all historical failed batches and Owner closeouts.
- [ ] Prove current gaps with focused failures; isolate control storage and bind actual consumers to exact identity.
- [ ] Complete bounded create/start/controller-death recovery and actual finish(fail) replay without reexecution.
- [ ] Freeze source and verify replacement window, identity drift, role access, deadlines, cancellation, FIFO, daemon unknown and helper parity using model-free children.
- [ ] Run scoped type/integrity checks, record exact evidence and remaining gaps, commit/push review candidate and read CI.

## Coordination handoff

Owner steering identifies existing PR #360 as the sole delivery package. Preserve this worktree as unsubmitted WIP; do not treat its development evidence as PR #360 acceptance. See the notes for the distinct preparation gap and failed test-seam evidence.
