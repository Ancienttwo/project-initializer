# Plan: Campaign acquisition cap preserves completion

> **Status**: Executing
> **Created**: 20260910-0159
> **Slug**: campaign-acquisition-cap
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260910-0159-campaign-acquisition-cap.md`; after execution revert branch `codex/campaign-acquisition-cap` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md`
> **Task Review**: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md`
> **Implementation Notes**: `tasks/notes/20260910-0159-campaign-acquisition-cap.notes.md`

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

- Active plan: `plans/plan-20260910-0159-campaign-acquisition-cap.md`
- Sprint contract: `tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md`
- Sprint review: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md`
- Implementation notes: `tasks/notes/20260910-0159-campaign-acquisition-cap.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260910-0159-campaign-acquisition-cap.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260910-0159-campaign-acquisition-cap.md`.

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
- Contract file: `tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md`
- Review file: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md`
- Implementation notes file: `tasks/notes/20260910-0159-campaign-acquisition-cap.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260910-0159-campaign-acquisition-cap.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260910-0159-campaign-acquisition-cap.md`; after execution revert branch `codex/campaign-acquisition-cap` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260910-0159-campaign-acquisition-cap.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260910-0159-campaign-acquisition-cap.contract.md`, `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md`, and `tasks/notes/20260910-0159-campaign-acquisition-cap.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260910-0159-campaign-acquisition-cap.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260910-0159-campaign-acquisition-cap.md`; after execution revert branch `codex/campaign-acquisition-cap` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Keep a campaign's successful acquisition cap without stopping the already acquired task's worker, verifier, and completion observations.

## P1 / P2 / P3
Budget-store owns serialized reservation admission, durable consumption and global stop receipts. Core budget evaluator already rejects consumed+reserved increments above a cap. commitUsage/exhaustionRefusal instead globally stop at acquisition equality, preventing all later operations. Real model-free probe /tmp/brc-acquisition-cap-probe.log proves limit1/consumed1 seals budget_exhausted and dispatch_attempt is refused. Restrict the change to typed campaign authorizations: acquisition equality is not global exhaustion; refused acquisition increments do not persist a global stop. All other metric/deadline/refusal semantics and non-campaign exhaustion remain unchanged. Historical stop receipts remain authoritative and are never reopened. At 10x concurrent callers, the existing exclusive lock and operation-derived reservations still serialize and enforce the cap; I/O latency remains the first scaling bottleneck.

## Scope
src/effects/automation/budget-store.ts; new tests/effects/campaign-acquisition-cap.test.ts; required workflow and durable research. Existing accepted PR385 source/tests remain baseline. No cap increase, grant revival, new campaign/provider call in this repair, no global budget semantic change.

## Task Breakdown
- [ ] Add deterministic model-free regression covering capped acquisition, subsequent dispatch/provider progress, extra acquisition refusal, unchanged counters, and retained other-metric stops.
- [ ] Apply campaign-only acquisition exhaustion/admission correction under existing locks; preserve historical receipts and non-campaign behavior.
- [ ] Run named campaign and budget store/core/contention regressions, typecheck and six integrity checks through canonical acceptance.
- [ ] Review final delta, record receipt, finish workflow and update PR385 with exact CI and image rebind requirements.

## Rollback
Revert this bounded acquisition-cap delta. Existing stopped grants remain stopped; never migrate their receipts.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Add deterministic model-free regression covering capped acquisition, subsequent dispatch/provider progress, extra acquisition refusal, unchanged counters, and retained other-metric stops.
- [ ] Apply campaign-only acquisition exhaustion/admission correction under existing locks; preserve historical receipts and non-campaign behavior.
- [ ] Run named campaign and budget store/core/contention regressions, typecheck and six integrity checks through canonical acceptance.
- [ ] Review final delta, record receipt, finish workflow and update PR385 with exact CI and image rebind requirements.
