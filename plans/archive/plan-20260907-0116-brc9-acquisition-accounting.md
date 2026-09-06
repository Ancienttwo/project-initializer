> **Archived**: 2026-09-07 03:42
> **Related Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260907-0342
> **Archive Projection V1**: `plans/plan-20260907-0116-brc9-acquisition-accounting.md` => `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0116-brc9-acquisition-accounting.notes.md` => `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0116-brc9-acquisition-accounting.contract.md` => `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0116-brc9-acquisition-accounting.review.md` => `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`

# Plan: BRC9 acquisition accounting

> **Status**: Archived
> **Created**: 20260907-0116
> **Slug**: brc9-acquisition-accounting
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Real acquisition budget admission, crash and replay
> **Rollback Surface**: Revert source and retain immutable admission and budget records
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
> **Task Review**: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`
> **Implementation Notes**: `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`

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

- Active plan: `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`
- Sprint contract: `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
- Sprint review: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`
- Implementation notes: `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`.

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
- Contract file: `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
- Review file: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`
- Implementation notes file: `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert source and retain immutable admission and budget records
- **Verification boundary**: Real acquisition budget admission, crash and replay
- **Review/acceptance boundary**: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`, `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`, and `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert source and retain immutable admission and budget records

## Captured Planning Output

# BRC9 acquisition accounting

## Decision and scope

Connect the real campaign acquisition effect to the existing automation budget. Keep the campaign acquisition path's canonical EngineerOffer selection, capacity fencing, fresh worktree and live receipt validation. This is a partial BRC9 package; repair/transient policy and adoption terminal ordering remain required subsequent work. No new root command, budget kind, metric authority, dependency or automatic retry is introduced.

## P1/P2/P3

P1: campaign CLI calls runCampaignAcquisition directly, bypassing the generic controller's acquisition reservation. acquire-next already persists pending/completed receipts and deliberately permits an idle key to try again later. Campaign capacity serializes Claim admission, while live workers run concurrently. The existing budget supports generic acquisition reservations and derives successful_acquisitions from the actual outcome.

P2: local-parent and Engineer authority -> campaign transaction lock -> immutable acquisition admission -> existing budget reserve -> canonical acquire-next -> immutable result -> budget usage -> live handoff. A cached result settles any interrupted usage write before replay. An admission without a result refuses further effects; thrown/unknown effects and rollback_failed never settle as no-progress. Definitive no-eligible results permit a subsequent acquisition under a new chained admission identity, while successful same-key replay never charges again. Conflicting principal/session input fails before spending.

P3: serialize only the bounded acquisition transaction using the existing campaign lock, released before worker execution. Preserve BRC8 parallel worker capacity; do not broaden the budget's unresolved-reservation policy. At 10x load admission throughput is serialized, but active worker capacity is unchanged. The immutable request/result chain lives in the existing group record store and does not own arithmetic. A crash retains budget authority and requires reconciliation instead of a blind retry. Existing pre-budget successful acquisitions cannot be silently retroactively admitted.

## File boundary

Production: src/effects/automation/campaign-acquisition.ts. Tests: tests/effects/campaign-acquisition.test.ts, tests/helpers/campaign-acquisition-fixture.ts only if fixture parameters are necessary. Durable docs: docs/researches/20260907-brc9-acquisition-accounting.md; docs/architecture projection outputs and this plan's contract/review/notes/todos. No BRC10 implementation or whole BRC9 completion binding.

## Verification

Real acquisition regression proves success increments exactly once; replay after budget exhaustion returns the same owned acquisition without effect; next acquisition is refused before Claim. Existing two-process capacity regression proves a winner and idle loser, then same idle key acquires after release. Unknown injected post-acquisition failure leaves an open reservation and a subsequent invocation executes zero effects. Named acquisition/worker tests, type, helper parity where relevant, SQL, architecture, task sync, strict workflow, project state and init dry-run cover this bounded change. Freeze before canonical prepare; no local full suite because each changed boundary has named behavior checks. One formal review and exact acceptance precede installed canonical finish.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Capture current acquisition-budget failure with regression tests.
- [x] Persist and serialize acquisition admission/result around the existing budget and acquisition effects.
- [x] Verify replay, idle retry, budget refusal, parallel capacity and crash behavior.
- [ ] Promote durable boundaries, freeze, prepare, review and accept this partial package.
- [ ] Canonical finish and single CI follow-through; continue remaining BRC9 consumers.
