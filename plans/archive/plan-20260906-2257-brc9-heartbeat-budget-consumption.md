> **Archived**: 2026-09-06 23:51
> **Related Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-2351
> **Archive Projection V1**: `plans/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` => `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260906-2257-brc9-heartbeat-budget-consumption.notes.md` => `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2257-brc9-heartbeat-budget-consumption.contract.md` => `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2257-brc9-heartbeat-budget-consumption.review.md` => `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`

# Plan: BRC9 heartbeat budget consumption

> **Status**: Archived
> **Created**: 20260906-2257
> **Slug**: brc9-heartbeat-budget-consumption
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Exact heartbeat admission and per-call provider budget consumption
> **Rollback Surface**: Heartbeat execution integration and immutable provider evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Task Review**: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`

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

- Active plan: `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`
- Sprint contract: `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Sprint review: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Implementation notes: `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`.

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
- Contract file: `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Review file: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Implementation notes file: `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Heartbeat execution integration and immutable provider evidence
- **Verification boundary**: Exact heartbeat admission and per-call provider budget consumption
- **Review/acceptance boundary**: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`, `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`, and `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Heartbeat execution integration and immutable provider evidence

## Captured Planning Output

# BRC9 heartbeat consumption of the campaign budget authority

## Goal and boundary

Consume the published campaign step/provider budget primitives in the existing pre-adoption heartbeat. Every heartbeat admission is charged once; every actual GitHub adapter invocation is reserved before invocation; GPT continuations bind the same admitted step. This is an independently useful verification and merge boundary inside BRC9. The Sprint row remains pending until acquisition, writable worker dispatch/attempt binding, per-task repair accounting, transient retry policy, and adoption integration are also accepted.

## P1 Map

- Baseline: cda7da08583d31c2760cf945a3cde3881dea81e1, the published #282 prerequisite. Its native review and target-bound Owner acceptance are historical baseline evidence.
- src/effects/automation/campaign-step.ts owns heartbeat decisions, immutable mutation journal and step receipts.
- src/effects/automation/budget-store.ts and src/core/automation/budget.ts own the one campaign budget ledger, step admissions/completions, unresolved external reservations and usage reconciliation.
- src/effects/automation/issue-batch-observer.ts passes a GithubCommandRunner to fetchGithubIssues; identity and each page are separate calls.
- src/effects/automation/gpt-pro-issue-authoring.ts already accepts step_admission_sha256 for continuations.
- src/effects/external-sources/github.ts owns the default typed GitHub adapter. Its existing typed failure contract remains the classification source.
- No other session owns this slice. Main publication CI remains pinned and separately observed; implementation uses a new isolated contract worktree.

## P2 Concrete trace

Today campaign step reads its journal, directly calls observeIssueBatch, optionally reserves a GPT continuation or invokes a GitHub mutation, then persists a step receipt. The new step/provider limits are not consumed by that path. A single snapshot can perform repository identity plus several page requests. Counting only snapshots would undercount calls. Persisting provider evidence in the heartbeat mutation journal would also change its optimistic journal hash during observation, so provider evidence belongs to the existing budget run store instead.

The final path is authority validation -> existing budget binding -> beginCampaignBudgetStep -> per-call reservation -> provider call -> durable provider outcome evidence -> appendAutomationUsage -> heartbeat receipt -> completeCampaignBudgetStep. Replayed completed receipts finish any interrupted completion without another provider call. An unresolved reservation or uncertain call result blocks repeated invocation.

## P3 Decision and invariants

Use the existing ledger and the existing GitHub runner injection boundary. Do not add a second counter or change authorization limits. A small internal provider execution adapter is justified by observation and mutation consumers; durable response evidence is owned by the existing budget store and carries no independent budget arithmetic. Expose the existing default GitHub runner internally so wrappers preserve its typed errors and default behavior.

Record only enforceable adapter invocations, not hidden HTTP retries or tokens. Known response receipts bind request, reservation and result digest before usage closes the reservation. If a process dies with an unknown outcome, retain the reservation and fail closed. Same-key replay never authorizes another invocation. Step receipt and completion are separate immutable writes with recoverable ordering: a stored exact heartbeat receipt can complete its existing admission; absence of a prior admission does not authorize backfilling old execution as newly verified.

Only trusted completed heartbeat outcomes update no-progress. Error handling must not fabricate progress, silently release an uncertain reservation, or retry an external mutation. Preserve BRC5 one-mutation-per-step and journal compare-and-swap behavior. At 10x polling frequency, the controller-step cap bounds admitted work; extra pagination consumes the provider-call cap one invocation at a time. Unresolved outcomes stop availability before risking duplicate effects.

This slice does not alter BRC6 terminal semantics. Full adoption consumption needs a separate accepted ordering change because its terminal currently binds the entire ledger, and its final provider refresh occurs after sealing. Post-adoption writable worker dispatch likewise needs a real native execution bridge: existing delegated-run is read-only, while contract-run lacks Task/Claim/Lease/dispatch identity. Neither is treated as an already available Repair worker runtime.

## File ownership

- src/effects/automation/campaign-step.ts: admitted heartbeat lifecycle and continuation forwarding.
- src/effects/automation/campaign-provider-execution.ts: new internal adapter shared by heartbeat reads and mutations; no counters or alternate authorization.
- src/effects/automation/budget-store.ts: immutable provider result evidence under the existing run lock/store safety rules.
- src/effects/external-sources/github.ts: expose the existing default runner without changing its semantics.
- tests/effects/campaign-step.test.ts and tests/unit/campaign-step-budget-prerequisite.test.ts: behavioral coverage and crash/idempotency controls.
- tests/effects/campaign-provider-execution.test.ts: new effect-boundary tests for invocation counts, evidence and replay.
- docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md and generated docs/architecture/: durable scope and architecture projection.
- The plan, contract, review and notes for this slice; tasks/todos.md only for canonical lifecycle projection.

This affects more than eight files including verification and workflow artifacts. No dependency, public CLI command, service, configuration knob, compatibility reader, or historical migration is added.

## Task Breakdown

- [x] Bind durable provider outcome evidence to exact reservations using the existing budget store.
- [x] Add the internal GitHub execution adapter; test identity/page counts, limit-before-call, typed failure, replay, unknown-outcome and evidence drift.
- [x] Integrate heartbeat admission/completion, pass the admitted digest to GPT continuations, and preserve journal CAS and one-mutation behavior.
- [x] Cover completion-write crash recovery, same-key replay, active-step rejection, exhausted budget, observer injection, authoring unknown outcomes and existing BRC5 behavior.
- [ ] Update durable research and architecture; freeze the implementation and execute the named final Verification Plan once.
- [ ] Consume final evidence through one acceptance boundary, canonical finish, push and single required CI follow-up. Keep BRC9 pending and retain the next writable-dispatch/adoption boundaries explicitly.

## Verification and acceptance

Focused behavior checks: tests/effects/campaign-provider-execution.test.ts, tests/effects/campaign-step.test.ts, tests/unit/campaign-step-budget-prerequisite.test.ts, tests/effects/issue-batch-observer.test.ts, tests/effects/gpt-pro-issue-authoring.test.ts, tests/unit/campaign-authoring-budget-prerequisite.test.ts and tests/cli/development-campaign.test.ts. Include type checking and the current root-required repository-integrity checks, including the context-map drift check introduced by #329.

The final contract must enumerate each named execution once and permit deterministic exact-input reuse. No local full suite is justified: these tests cover the changed runner boundary, ledger ownership, heartbeat decisions and both neighboring consumers. CI retains its required full gate. Canonical prepare runs after freezing; review consumes it rather than rerunning. Old prerequisite receipts remain bound to their original subjects and do not authorize this new diff.

Rollback is a normal source revert. Do not rewrite immutable runtime evidence or refund executed calls. A partially admitted execution remains explicit and requires existing reconciliation authority before further spending.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Bind durable provider outcome evidence to exact reservations using the existing budget store.
- [x] Add the internal GitHub execution adapter; test identity/page counts, limit-before-call, typed failure, replay, unknown-outcome and evidence drift.
- [x] Integrate heartbeat admission/completion, pass the admitted digest to GPT continuations, and preserve journal CAS and one-mutation behavior.
- [x] Cover completion-write crash recovery, same-key replay, active-step rejection, exhausted budget, observer injection, authoring unknown outcomes and existing BRC5 behavior.
- [ ] Update durable research and architecture; freeze the implementation and execute the named final Verification Plan once.
- [ ] Consume final evidence through one acceptance boundary, canonical finish, push and single required CI follow-up. Keep BRC9 pending and retain the next writable-dispatch/adoption boundaries explicitly.

## Integration Clarifications

- No-work idle and expired-intent returns perform no provider I/O and remain before budget admission. Existing completed heartbeat receipts can recover only their original admission.
- Target freeze and main integration are coordinated by pane %14; this package does not perform main/push.
- Source Ref is the research document because this partial package must not complete the whole BRC9 row.
