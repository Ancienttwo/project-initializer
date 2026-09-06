> **Archived**: 2026-09-07 04:23
> **Related Plan**: plans/archive/plan-20260907-0146-brc9-repair-accounting.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260907-0423
> **Archive Projection V1**: `plans/plan-20260907-0146-brc9-repair-accounting.md` => `plans/archive/plan-20260907-0146-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0146-brc9-repair-accounting.notes.md` => `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0146-brc9-repair-accounting.contract.md` => `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0146-brc9-repair-accounting.review.md` => `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`

# Plan: BRC9 per-task repair accounting

> **Status**: Archived
> **Created**: 20260907-0146
> **Slug**: brc9-repair-accounting
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Real later Task attempt consumes one repair cycle before worker dispatch
> **Rollback Surface**: Revert worker operation selection while retaining budget and attempt records
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`
> **Task Review**: `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`
> **Implementation Notes**: `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`

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

- Active plan: `plans/archive/plan-20260907-0146-brc9-repair-accounting.md`
- Sprint contract: `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`
- Sprint review: `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`
- Implementation notes: `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260907-0146-brc9-repair-accounting.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260907-0146-brc9-repair-accounting.md`.

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
- Contract file: `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`
- Review file: `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`
- Implementation notes file: `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260907-0423-brc9-repair-accounting.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260907-0146-brc9-repair-accounting.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert worker operation selection while retaining budget and attempt records
- **Verification boundary**: Real later Task attempt consumes one repair cycle before worker dispatch
- **Review/acceptance boundary**: `tasks/archive/review-20260907-0423-brc9-repair-accounting.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260907-0146-brc9-repair-accounting.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`, `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`, and `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260907-0423-brc9-repair-accounting.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert worker operation selection while retaining budget and attempt records

## Captured Planning Output

# BRC9 per-task repair accounting

## Decision and scope

Consume the existing Work Package retry policy and TaskAutomationAttempt authority when an acquired campaign worker begins a later attempt. Charge exactly one repair cycle for that attempt using the existing generic retry operation, before its first worker child; verifier invocation remains a dispatch. Initial attempts remain dispatch. Do not count worker and verifier as two repairs. This is a partial BRC9 consumer package. Campaign-wide transient policy and adoption terminal ordering remain separate and unaccepted.

## P1/P2/P3

P1: canonical Engineer offers carry attempt_count and retry_policy from the existing Task attempt projection. recordTaskAutomationAttemptStart validates eligibility, backoff and exhaustion under the Work Package lock. campaign-worker currently reserves every child as dispatch, so later real attempts never charge repair_cycles. The generic budget's retry operation already reserves one runner invocation and one repair cycle and remains the sole arithmetic authority.

P2: real acquired WorkEnvelope and ClaimActorReceipt -> immutable worker launch -> complete attempt reservation (retry_attempt iff authoritative offer attempt_count is positive) -> existing Task attempt start -> worker and verifier observations under the same reservation -> immutable explicit final -> usage settlement -> existing Task attempt completion. Same final replay executes no child and charges no new repair cycle. Budget refusal occurs before the worker/attempt side effects.

P3: no new counter, budget kind, policy default or automatic retry loop; two explicit operation vectors reserve the complete initial or repair attempt in the existing ledger. The Work Package remains the owner of retryable classes, backoff and max attempts. An eligible later acquisition uses its fresh real Claim/Lease and new handoff. Unknown process results keep the existing reservation unresolved. At 10x load the existing single unresolved reservation invariant still bounds admission; this slice does not redesign concurrency.

## File boundary

Production: src/effects/automation/campaign-worker.ts and the paired attempt vectors in src/core/automation/budget.ts. Tests: tests/effects/campaign-worker.test.ts and tests/helpers/campaign-acquisition-fixture.ts for an explicitly authored retry policy in disposable fixtures. Durable research: docs/researches/20260907-brc9-repair-accounting.md. Own plan, contract, review, notes, todos and architecture projection only.

## Verification

Real first attempt followed by its verified transient outcome, canonical release, policy-eligible reacquisition and second worker attempt: first costs zero repairs, second costs one, verifier adds no repair, replay adds none. Consume the repair allowance and prove a later worker is refused before any child invocation. Existing Task retry unit tests preserve deterministic backoff, exhaustion and permanent/user blocker behavior. Run named worker and affected acquisition tests, type and required integrity checks through frozen canonical prepare. No local full suite: named real consumers cover the changed operation selection and authority path.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Add an explicitly authored multi-attempt fixture and capture the missing real repair charge.
- [x] Reserve the complete worker/verifier attempt before either child, adding one repair cycle only for a later attempt.
- [x] Verify real retry, verifier accounting, replay and pre-child budget refusal.
- [ ] Promote the consumer invariant and freeze target for canonical prepare and acceptance.
- [ ] Canonical finish this partial package; retain whole BRC9 pending.
