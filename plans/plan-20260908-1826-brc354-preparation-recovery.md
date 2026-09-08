# Plan: BRC354 pre-invocation preparation recovery

> **Status**: Executing
> **Created**: 20260908-1826
> **Slug**: brc354-preparation-recovery
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Pre-invocation controller death and actual recovery consumer
> **Rollback Surface**: Revert follow-up on f9e24f50
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md`
> **Task Review**: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md`
> **Implementation Notes**: `tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md`

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

- Active plan: `plans/plan-20260908-1826-brc354-preparation-recovery.md`
- Sprint contract: `tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md`
- Sprint review: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md`
- Implementation notes: `tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-1826-brc354-preparation-recovery.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-1826-brc354-preparation-recovery.md`.

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
- Contract file: `tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md`
- Review file: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md`
- Implementation notes file: `tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-1826-brc354-preparation-recovery.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert follow-up on f9e24f50
- **Verification boundary**: Pre-invocation controller death and actual recovery consumer
- **Review/acceptance boundary**: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-1826-brc354-preparation-recovery.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-1826-brc354-preparation-recovery.contract.md`, `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md`, and `tasks/notes/20260908-1826-brc354-preparation-recovery.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-1826-brc354-preparation-recovery.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert follow-up on f9e24f50

## Captured Planning Output

## Goal
Continue PR #360 from f9e24f50. Recover the original supervised preparation when the controller dies before invocation publication; retain closed active admission, original identity/deadline and no-restart recovery.

## P1 / P2 / P3
The runtime prepares a probe and workload container before campaign-worker persists invocation. Container request names are durable but random journal addresses are not discoverable from the original Claim. Recovery requires invocation and otherwise misses preparation; the no-start observation must not declare inactivity while a probe remains unproven.
Use an identity-derived address within the existing protected journal root, immutable pre-create requests, and a preparation marker before runtime effects. Recover a lost create response only by its pre-persisted name and exact request/configuration. Missing objects/requests and daemon uncertainty stay unknown. Reconcile after the original deadline, never create/start, and never reconstruct provider output. A pre-launch preparation has no execution reservation: return a reconciliation-required disposition without inventing a budget charge or new owner. When an attempt exists, settle once via existing final path.
This adds no business authority or provider fallback. Old final settlement remains supported. At 10x load journal retention remains the separately recorded bottleneck; this slice does not implement cleanup.

## Task Breakdown
- [ ] Capture current regression at preparation/consumer boundary.
- [ ] Integrate deterministic journal address and pre-create recovery without reverting #360 host boundary or kill race.
- [ ] Persist preparation before side effects and connect recovery, observation, settlement.
- [ ] Verify identity drift, missing/unknown, duplicate preparation, lost-create response, probe controller death and actual consumer replay using no-model Docker and deterministic fixtures.
- [ ] Freeze source, run named affected checks and repository integrity; retain raw results and independent review boundaries in #360.

## Scope
No active enablement, model calls, grants, global install, merge or package release. No unrelated changes. Historical failures and original accepted baselines remain intact.

## Evidence Contract
- State/progress path: this plan and its contract.
- Verification evidence: exact source and named no-model regressions, before/after logs, typecheck, helper parity and root integrity.
- Evaluator rubric: no workload recreation; exact original identity and deadline; consumer cannot reclaim from missing proof; settlement replay single charge.
- Stop condition: three failed fix/reverify rounds per issue; any second out-of-scope fault.
- Rollback surface: revert this follow-up from f9e24f50, active stays closed.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Capture current regression at preparation/consumer boundary.
- [ ] Integrate deterministic journal address and pre-create recovery without reverting #360 host boundary or kill race.
- [ ] Persist preparation before side effects and connect recovery, observation, settlement.
- [ ] Verify identity drift, missing/unknown, duplicate preparation, lost-create response, probe controller death and actual consumer replay using no-model Docker and deterministic fixtures.
- [ ] Freeze source, run named affected checks and repository integrity; retain raw results and independent review boundaries in #360.
