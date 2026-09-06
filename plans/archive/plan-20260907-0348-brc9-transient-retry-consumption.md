> **Archived**: 2026-09-07 04:59
> **Related Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260907-0459
> **Archive Projection V1**: `plans/plan-20260907-0348-brc9-transient-retry-consumption.md` => `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260907-0348-brc9-transient-retry-consumption.notes.md` => `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0348-brc9-transient-retry-consumption.contract.md` => `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0348-brc9-transient-retry-consumption.review.md` => `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`

# Plan: BRC9 campaign transient retry consumption

> **Status**: Archived
> **Created**: 20260907-0348
> **Slug**: brc9-transient-retry-consumption
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC9 — Campaign budget 与 attempt receipts（消费 #282/#287 子集）
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Campaign transient streak, replay and pre-effect refusal
> **Rollback Surface**: Revert source; retain immutable grants, reservations and usage evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
> **Task Review**: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`
> **Implementation Notes**: `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`

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

- Active plan: `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`
- Sprint contract: `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
- Sprint review: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`
- Implementation notes: `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`.

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
- Contract file: `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
- Review file: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`
- Implementation notes file: `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert source; retain immutable grants, reservations and usage evidence
- **Verification boundary**: Campaign transient streak, replay and pre-effect refusal
- **Review/acceptance boundary**: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`, `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`, and `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert source; retain immutable grants, reservations and usage evidence

## Captured Planning Output

# BRC9 campaign transient retry consumption

## P1 Map
ProgramAuthorizationCampaignV1 in src/core/automation/budget.ts owns campaign authorization. budget-store.ts admits generic acquisition/dispatch and campaign provider leaves under the existing shared budget lock. campaign-worker.ts produces verified Task outcomes; campaign-provider-execution.ts owns typed GithubAdapterError observations. #287 retains per-Task retry eligibility. No new store, counter file, runner, credential or cleanup mechanism is needed.

## P2 Trace
A verified worker transient_failure currently closes its two usage reservations as no_progress and writes the typed Task attempt afterward; the campaign ledger cannot observe its transient streak. A typed GitHub read failure currently becomes provider_failure without distinguishing temporary network/deadline/rate-limit failure. Later acquisition and provider reservations check global arithmetic but no campaign transient policy. Change these owning outcome boundaries, then evaluate the immutable existing usage events before each new admission. Completed result replay must close its own pending complete attempt usage without launching a child.

## P3 Decision
Add an explicitly authored campaign transient_retry policy (max_consecutive_failures, initial_backoff_ms, maximum_backoff_ms) to the existing grant schema. Absence is inspectable but cannot authorize new campaign effects; no default, translator, re-mint, or rewrite of stored grants. Existing immutable records remain unchanged. Add transient_failure to the existing usage outcome vocabulary, preserving provider-failure arithmetic. Fold streak and last failure timestamp from the existing ledger. Only verified completed/not_reproducible Task results and completed authoring work reset the streak; read success, acquisition success, no-progress and bookkeeping do not. Backoff is deterministic capped exponential, based on durable observation time. Missing policy, exhausted streak and pending backoff have explicit refusal codes before new side effects; exact replay and reconciliation remain available. Keep per-Task permanent/user blockers and retry limits unchanged.

Retain the complete attempt reservation until campaign-worker finish validates the explicit result and both child observations. Persist the immutable final result before settling that usage; replay completes settlement and the existing Task attempt without child effects. Unknown result keeps its reservation. Classify only existing typed GitHub network/deadline/rate_limit failures as transient; other typed failures retain provider_failure and unknown mutation outcomes stay unresolved. Do not infer planner semantics or parse prose.

Rejected: a second retry counter/store and a wrapper campaign step around generic worker reservations. They duplicate authority or violate the existing active-step invariant. At 10x ledger length, folding remains linear under the current lock; existing budget bounds cap work. No index/cache or lock redesign is justified here.

## Scope and Files
Production: src/core/automation/budget.ts; src/effects/automation/budget-store.ts; src/effects/automation/campaign-worker.ts; src/effects/automation/campaign-provider-execution.ts. Tests: existing budget core/store, campaign provider/step/worker/acquisition/authoring/adoption tests and their grant fixtures; one focused transient-policy regression file if independent fixtures are needed. Documentation: dedicated research, generated architecture projection, this package artifacts. No BRC10, BRC6a, automatic lease release, cleanup, scheduler redesign or external canary. Missing grant policy requires the operator to mint a new explicitly authorized campaign, never an automatic grant rewrite.

## Verification
Use real store/worker/provider fixtures to prove transient charge, exact replay, crash after final persistence, unresolved outcomes, no reset on successful read/acquisition, verified-completion reset, deterministic backoff, exhausted refusal before claim/dispatch/provider invocation, and user/permanent blockers. Preserve red/green development evidence. Final named checks include affected campaign and budget files, #287 retry policy, type/state-boundaries and the six repository integrity checks. No unconditional local full suite: named tests exercise each changed authority and consumer; Required CI retains its complete matrix. Freeze implementation and integrate repair accounting before canonical prepare; one formal review consumes its evidence, followed by exact receipt, canonical finish, final publication digest check and push. This final integration package owns whole BRC9 row closure only after its acceptance matrix covers every required budget dimension and previously published consumer. Existing receipts remain bound to their original subjects; current named integration evidence binds this final subject.

## Task Breakdown
- [ ] Add explicit policy validation, immutable-ledger transient fold and admission refusals with core/store regressions.
- [ ] Wire verified worker and typed provider outcomes, preserving replay and unknown reservations; update explicit grant fixtures.
- [ ] Integrate repair package, document current authority and run the frozen named verification plan.
- [ ] Record one semantic review and exact acceptance; canonical finish and validate final publication before push.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Add explicit policy validation, immutable-ledger transient fold and admission refusals with core/store regressions.
- [ ] Wire verified worker and typed provider outcomes, preserving replay and unknown reservations; update explicit grant fixtures.
- [ ] Integrate repair package, document current authority and run the frozen named verification plan.
- [ ] Record one semantic review and exact acceptance; canonical finish and validate final publication before push.

## Whole BRC9 acceptance boundary

The user explicitly authorized all BRC9 completion. This final package consumes the independent repair publication and all prior accepted budget/heartbeat/worker/adoption/acquisition packages. The Source Ref now binds the actual BRC9 Sprint row, so canonical finish may close that row only after the final named verification and receipt. Prior partial packages retain their historical scope and evidence. No BRC10 or BRC6a work is absorbed. The dedicated research document contains the final requirement-to-test mapping.
