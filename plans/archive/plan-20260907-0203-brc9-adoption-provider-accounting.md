> **Archived**: 2026-09-07 03:11
> **Related Plan**: plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260907-0311
> **Archive Projection V1**: `plans/plan-20260907-0203-brc9-adoption-provider-accounting.md` => `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0203-brc9-adoption-provider-accounting.notes.md` => `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0203-brc9-adoption-provider-accounting.contract.md` => `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0203-brc9-adoption-provider-accounting.review.md` => `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`

# Plan: BRC9 adoption provider accounting

> **Status**: Archived
> **Created**: 20260907-0203
> **Slug**: brc9-adoption-provider-accounting
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Exact terminal readonly continuation and real adoption provider accounting
> **Rollback Surface**: Revert adoption read consumer and terminal successor protocol together
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`
> **Task Review**: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`
> **Implementation Notes**: `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`

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

- Active plan: `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md`
- Sprint contract: `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`
- Sprint review: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`
- Implementation notes: `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md`.

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
- Contract file: `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`
- Review file: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`
- Implementation notes file: `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert adoption read consumer and terminal successor protocol together
- **Verification boundary**: Exact terminal readonly continuation and real adoption provider accounting
- **Review/acceptance boundary**: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`, `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`, and `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert adoption read consumer and terminal successor protocol together

## Captured Planning Output

# BRC9 adoption provider accounting and terminal continuation

## Decision

Integrate committed main ce5e42d3 only; preserve its five unrelated dirty documents. Budget active adoption's pre-seal snapshot, post-seal drift probe and unpublished-adoption recovery probe through the existing campaign ledger. Preserve two distinct proof contracts:

1. Strict terminal: `readCampaignAuthoringBudgetTerminal` and `verifyCampaignAuthoringBudgetTerminal` require `terminal.ledger_sha256` to equal the current complete ledger. Shadow retains final observation inside its active step and completion plus seal under one lock. Any later ledger change, including a completed same-group GitHub read, makes the old terminal fail strict read/verify and shadow replay.
2. Active readonly continuation: `readCampaignAuthoringReadonlyContinuation` and `verifyCampaignAuthoringReadonlyContinuation` validate the original terminal as an exact historical seal, plus a quiescent same-group/intent readonly successor chain. The result separately binds `current_ledger_sha256` and `completion_event_sha256s`; adoption persists it as `readonly_continuation`. The old terminal proves only the sealing point, never the current complete ledger. Challenge, authoring, mutation, generic acquisition/dispatch/retry, unrelated groups and unresolved work reject this continuation.

Both proofs consume the same authoritative ledger. No second counter, replacement terminal, compatibility alias or fallback is introduced.

## P1/P2/P3

P1: campaignGroupLedger includes only initial/fill_missing/edit_issue authoring reservations and events; it counts all campaign unresolved provider leaves. Terminal already blocks further authoring. adoptIssueBatch currently observes before seal, after seal and during publication recovery without the campaign provider executor. Adding ledger events to these reads makes the exact current-ledger terminal check fail. Current tests intentionally require post-seal source drift rejection and recovery after a failed post-seal probe.

P2: active challenge -> pre-seal observation step admission -> per-call provider reservation/result/usage -> immutable snapshot recovery evidence -> step completion -> authoring seal -> post-seal budgeted observation -> source comparison -> explicit active readonly-continuation verification -> adoption receipt with separate continuation proof -> publication. Unpublished-receipt recovery completes its own durable observation bookkeeping, verifies active continuation, performs a fresh budgeted probe, compares source revisions and verifies again before publication. Unknown external outcomes retain their reservation. An old snapshot never substitutes for the required fresh probe. Shadow continues through its unchanged strict terminal consumer.

P3: only the active continuation verifier scans the validated ledger for a unique exact sealed prefix and validates subsequent step/leaf bindings against the seal's group/intent and current budget. Only github_read plus its admission/completion are allowed; an open reservation or active step prevents continuation acceptance. Strict terminal read/verify still requires current full-ledger equality. At 10x history the continuation adds a linear scan to the existing linear ledger validation; no second counter or index authority is justified.

## Scope

Production: src/effects/automation/issue-batch-adoption.ts, src/effects/automation/budget-store.ts, src/effects/automation/issue-batch-store.ts only if an immutable observation evidence primitive is needed. Reuse existing campaign provider executor and group record store. Tests: tests/effects/issue-batch-adoption.test.ts, tests/unit/campaign-authoring-budget-prerequisite.test.ts and narrowly necessary adoption fixtures. Durable docs: docs/researches/20260907-brc9-adoption-provider-accounting.md, architecture projections and own workflow artifacts. No transient policy, worker dispatch, BRC10 or whole-row completion.

## Verification

Red controls establish the unbudgeted active provider call and interrupted publication-recovery ordering. A post-seal read must continue to invalidate strict terminal freshness; that rejection is not a bug to remove. Green controls pair strict shadow rejection with explicit active continuation success, and cover provider cap refusal, invalid prefixes/successors, unresolved work, drift and durable-result recovery. Named adoption, terminal and provider neighbors plus type and integrity checks cover the delta. Preserve the earlier 29-test integration pass only as its original pre-alignment baseline. Freeze the integration target before final prepare; no repeated local full suite.

## Task Breakdown

- [ ] Prove missing real provider accounting and current read-suffix rejection.
- [ ] Add explicit active readonly-continuation proof while preserving shared strict full-ledger equality.
- [ ] Wire observation admission, per-call accounting and immutable recovery evidence through adoption.
- [ ] Verify drift, replay, quota and forbidden successor controls.
- [ ] Freeze integrated target, prepare, review and accept this partial package.
- [ ] Canonical finish; retain BRC9 pending for remaining campaign-wide transient policy and whole-row acceptance.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Prove missing real provider accounting and current read-suffix rejection.
- [ ] Add explicit active readonly-continuation proof while preserving shared strict full-ledger equality.
- [ ] Wire observation admission, per-call accounting and immutable recovery evidence through adoption.
- [ ] Verify drift, replay, quota and forbidden successor controls.
- [ ] Freeze integrated target, prepare, review and accept this partial package.
- [ ] Canonical finish; retain BRC9 pending for remaining campaign-wide transient policy and whole-row acceptance.
