> **Archived**: 2026-09-06 22:42
> **Related Plan**: plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-2242
> **Archive Projection V1**: `plans/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` => `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-2017-brc9-campaign-budget-prerequisite.notes.md` => `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2017-brc9-campaign-budget-prerequisite.contract.md` => `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2017-brc9-campaign-budget-prerequisite.review.md` => `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`

# Plan: BRC9 prerequisite: campaign step and provider budget composition

> **Status**: Archived
> **Created**: 20260906-2017
> **Slug**: brc9-campaign-budget-prerequisite
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC9 — Campaign budget 与 attempt receipts（消费 #282/#287 子集）
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Single-ledger controller step and provider reservation composition
> **Rollback Surface**: Campaign grants and immutable budget events; generic records unchanged
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Task Review**: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC9 — Campaign budget 与 attempt receipts（消费 #282/#287 子集）
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`
- Sprint contract: `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Sprint review: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Implementation notes: `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`.

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
- Contract file: `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Review file: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Implementation notes file: `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Campaign grants and immutable budget events; generic records unchanged
- **Verification boundary**: Single-ledger controller step and provider reservation composition
- **Review/acceptance boundary**: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`, `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`, and `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Campaign grants and immutable budget events; generic records unchanged

## Captured Planning Output

## Goal and authority

Land an independently usable #282 prerequisite for BRC9: exact campaign controller-step admission and provider-call limits in the existing automation budget authority. BRC9 remains the later consumer; this package must not claim that every campaign CLI branch is already budget-wired. The existing ProgramAuthorizationV1.campaign payload owns campaign-only limits, following BRC6 max_authoring_rounds_per_group. There is no second budget store, grant, Task identity or retry policy.

## P1 — Map

src/core/automation/budget.ts owns grants, reservations, usage events, ledger folding, current and stop receipts. src/effects/automation/budget-store.ts owns the Git-common run, immutable records, run lock, reconciliation and projections. src/core/automation/projection.ts exposes the budget read model. BRC6 already derives per-group authoring consumption from this ledger. Campaign heartbeat persists a separate operational journal; that journal owns provider mutation recovery, not budget arithmetic. Current ProgramBudgetLimitV1 fields serve generic automation and retain their wire format. The campaign PRD explicitly permits campaign-scoped authorization extensions.

## P2 — Trace

A heartbeat observes GitHub before choosing at most one mutation. fetchGithubIssues invokes its runner for repository identity and each page, so one snapshot is not one provider call. GPT authoring reserves in prepareBudgetedAuthoring before the heartbeat journal CAS, then records a completed session and usage. An outer unresolved budget reservation would make this existing inner admission fail because a run permits at most one unresolved reservation. The current usage outcome fold also treats every provider result as a controller-step outcome; it cannot express a multi-call step's final no-progress result.

## P3 — Decision

Add typed controller-step admission and completion events to the existing run's events ledger. Admission is an atomic local ledger charge under the existing run lock; it creates no unresolved external-effect reservation. Provider calls continue to reserve and settle individually, with at most one unresolved external-effect reservation. A single unfinished controller step owns subsequent leaf admissions; another step cannot enter until it closes. All campaign counters and the unfinished step are derived from immutable events/reservations, never independently authored current counters.

The event stream uses the existing monotonic step_index as its ledger sequence, including step admission/completion events. Usage events retain their current schema and reservation-digest filenames. New step event kinds have deterministic filenames derived from exact step identity and phase. The central reader validates the kind and sequence before folding; event_count and ledger_sha256 cover every event kind. Reservation coverage applies to usage events only; step completions must instead resolve their exact admission. Deletion, duplicate sequence, completion without admission, divergent replay, foreign run/budget/context and broken digest chains fail closed. Generic runs reject campaign step events and retain their existing valid bytes and outcome fold.

## Exact interfaces and semantics

- Add required positive integers max_controller_steps and max_provider_calls to ProgramAuthorizationCampaignV1. They are campaign-only grant fields sealed by the existing authorization/budget digest. Update both PRD descriptions. Non-campaign grants retain their existing field set. Old incomplete campaign grants are rejected; the operator must issue a complete grant for a new campaign/run. No inferred defaults, historical rewrites, dual readers or migration shim.
- Campaign step identity consists of automation_run_id, campaign_id, group_number, intent_sha256 and caller idempotency_key. An admission also binds authorization_id, exact budget_sha256, observed_at, step_index and event digest. No Task/Claim/Lease is fabricated. The store samples time inside its lock.
- beginCampaignBudgetStep returns a typed admitted/replayed result and its immutable admission. It checks authorization, exact revision, deadline, existing unresolved leaf reservation, active step, no-progress limit and controller-step limit before the atomic event write. Exact completed/admitted identity replay charges nothing; it never authorizes replay of an external call. A different identity while a step is unfinished is refused.
- completeCampaignBudgetStep accepts the exact admission, progress or no_progress, and non-empty exact evidence references supplied by the trusted owning controller. It validates run/revision/context and requires no unresolved leaf reservation. It writes one immutable completion event. Same outcome/evidence replay is idempotent; conflict is refused. This records an outcome, not another budget spend: it remains allowed after deadline or provider exhaustion. It never invents an outcome from elapsed time or absent receipts.
- Extend campaign reservation context with a required nullable step-admission digest. null denotes an explicitly standalone authoring/challenge invocation; it is forbidden while a step is active. A non-null digest must resolve to the current unfinished step with the same run/group/intent. Foreign, completed or missing step context fails before writes.
- reserveCampaignProviderBudget admits a single GitHub adapter call using exact run/group/intent/step identity, read/comment/close operation, request digest and idempotency key. The context is a closed provider variant, not a translation to GPT authoring. Existing reserveCampaignAuthoringBudget retains authoring operation semantics and forwards explicit step binding. Both use the same admission lock and reservation index.
- A provider call is one invocation at the harness adapter boundary: one GPT browser authoring/challenge invocation, or one GitHub runner invocation. A snapshot requires identity plus all pages and therefore multiple calls. No claim is made about invisible HTTP retries inside a browser/provider. The future BRC9 caller must reserve at each adapter invocation, not around an entire snapshot. The prerequisite tests exercise that composition with real budget persistence and a counting fake adapter.
- Provider consumption is derived from campaign provider reservations and their usage resolutions. Open reservations hold one call; observed/reconciled_observed/reconciled_reserved consume one; explicit reconciled_not_started releases it. Existing GPT initial/fill_missing/edit_issue also consume one authoring round; challenge and GitHub operations do not. Update the authoring fold to match only the closed authoring operation set, avoiding the current 'anything except challenge' shortcut.
- Controller-step consumption counts durable admissions, including unfinished steps. Completion alone updates campaign consecutive_no_progress_steps. Inner provider success neither resets nor increments that streak. Generic automation retains its usage-based streak. Reaching the step count blocks the next admission, not the already admitted step's leaf calls or completion. Provider-call exhaustion blocks the next leaf call; outcome bookkeeping remains available.
- Existing stop receipt authority reports controller_steps/provider_calls with exact limit, consumed, reserved and ledger digest. Extend its closed metric vocabulary and the operator projection; do not add a parallel stop file. The store evaluates each limit at its owning admission boundary. A stop cannot silently release claims, reservations or step identity. Reconciliation remains the existing explicit operation.
- Existing current.json remains a deterministic projection. Step/provider counts and active step are derived for the campaign status/projection from the same event stream; they are not a second mutable counter file. All mutating paths consume the same validated fold. Current drift repair can adopt an additional durable event but cannot excuse a missing event, reservation or admission.

## Data flow

campaign controller identity -> beginCampaignBudgetStep -> existing run lock + events ledger
                                        |
                                        v
provider adapter request -> existing reservation admission -> external call -> existing usage event
                                        |
                                        v
controller's actual outcome + evidence -> completeCampaignBudgetStep -> same ledger -> current/stop/operator projection

No lock is held while a provider runs. A process crash before a leaf reservation can replay the same step admission without another step charge. A crash after a leaf reservation requires existing explicit reconciliation before any further leaf call. A crash after an event but before current publication is recovered only by validated refolding.

## Scope and file ownership

Production owners: src/core/automation/budget.ts, src/core/automation/projection.ts, src/core/automation/campaign-authoring-budget.ts, src/effects/automation/budget-store.ts and src/effects/automation/gpt-pro-issue-authoring.ts. Test owners: tests/unit/issue-282-automation-budget-core.test.ts, tests/unit/issue-282-automation-budget-store.test.ts, tests/unit/issue-282-automation-budget-prd-drift.test.ts, tests/unit/campaign-authoring-budget-prerequisite.test.ts, new tests/unit/campaign-step-budget-prerequisite.test.ts, and the existing campaign authorization fixtures in tests/cli/development-campaign.test.ts, tests/effects/campaign-step.test.ts, tests/effects/development-campaign-store.test.ts, tests/effects/gpt-pro-issue-authoring.test.ts, tests/effects/issue-batch-observer.test.ts and tests/helpers/campaign-adoption-repository.ts. Documentation owners: the guarded-merge and repair-campaign PRDs, docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md, canonical task artifacts and generated architecture projection.

This deliberately exceeds eight files because the exact campaign grant contract has multiple existing fixture consumers. There are no new dependencies, services, CLIs, credentials or configuration installations. The only new source-of-truth record types are the two step ledger events; both protect the cross-module admission/outcome invariant. The new test file isolates the real store composition boundary.

Excluded: BRC9 CLI/controller integration across planning/acquisition/dispatch, per-task repair accounting, transient-failure streak, pre-adoption attempt outcome protocol, new retry policy, full suite, worker dispatch changes, lifecycle redesign, new Task/Lease schemas and automatic publication behavior. These remain explicit active sprint prerequisites, not implicit implementation room.

## Task Breakdown

- [ ] Extend exact campaign grant and event/context types with closed validators and deterministic folding; preserve non-campaign wire bytes and generic semantics.
- [ ] Implement locked step admission/completion and provider admission in the existing store, integrating drift detection, replay, reconciliation, authoring sealing and stop projection.
- [ ] Forward explicit step identity through the existing authoring preparation boundary and update complete campaign fixtures; do not wire the campaign controller in this upstream package.
- [ ] Prove real-store step -> provider -> authoring -> completion composition, crash windows, concurrent admissions, limits and unchanged generic behavior with named focused checks.
- [ ] Freeze implementation, perform the required check/review and canonical exact-target acceptance, promote durable conclusions, canonical finish and publish. Keep BRC9 pending.

## Verification boundary

Named behavior coverage: new campaign-step-budget-prerequisite tests; issue-282 core/store/e2e/PRD-drift tests; campaign-authoring-budget-prerequisite tests; GPT authoring and campaign-step effect tests; campaign adoption boundary tests where changed context is consumed; existing generic issue-279 controller tests. Run typecheck and state-boundaries plus the six root integrity checks. The final contract lists each executable once in its JSON Verification Plan. No local full-suite criterion is justified: this slice's cross-module contracts have named producer/store/projection/consumer tests. Required remote CI remains a release gate.

Required negative cases: controller-step exact replay before/after completion; different step while active; same key changed context; late completion after deadline and provider stop; missing/malformed grant fields; provider cap at the exact last call; a multi-page read never invoking beyond cap; two successive leaf calls in one step; unknown leaf blocking further spend; explicit not-started reconciliation and retry; no-progress streak unaffected by inner progress; max step cap does not strand final admitted step; missing event/admission/reservation corruption; each event/current crash window; cross-process concurrent same/new keys; closed authoring operation count; generic records/projection unchanged.

## Tradeoff, scale and rollback

The minimal alternative of holding one outer step reservation is rejected because the existing inner authoring admission demonstrably refuses it. Allowing multiple unresolved reservations would weaken recovery and is not part of this package. Typed local admission/outcome events preserve one unresolved external call while accounting for the real controller unit.

At 10x ledger size, validated event scanning and the existing per-run lock dominate. Do not add an independent cache or incremental counter authority in this slice. If that measured cost becomes limiting, a later indexed projection must still prove the same complete ledger digest and missing-record invariants.

Before any new campaign grant/events are issued, revert the package normally. After issuance, retain immutable evidence and stop those campaigns before rollback; an operator must explicitly choose a subsequent release/migration contract. Never rewrite ledger history or reopen an old incomplete grant. Generic runs do not require migration.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Extend exact campaign grant and event/context types with closed validators and deterministic folding; preserve non-campaign wire bytes and generic semantics.
- [ ] Implement locked step admission/completion and provider admission in the existing store, integrating drift detection, replay, reconciliation, authoring sealing and stop projection.
- [ ] Forward explicit step identity through the existing authoring preparation boundary and update complete campaign fixtures; do not wire the campaign controller in this upstream package.
- [ ] Prove real-store step -> provider -> authoring -> completion composition, crash windows, concurrent admissions, limits and unchanged generic behavior with named focused checks.
- [ ] Freeze implementation, perform the required check/review and canonical exact-target acceptance, promote durable conclusions, canonical finish and publish. Keep BRC9 pending.
