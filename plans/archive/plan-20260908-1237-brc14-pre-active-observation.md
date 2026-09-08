> **Archived**: 2026-09-08 13:11
> **Related Plan**: plans/archive/plan-20260908-1237-brc14-pre-active-observation.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1311
> **Archive Projection V1**: `plans/plan-20260908-1237-brc14-pre-active-observation.md` => `plans/archive/plan-20260908-1237-brc14-pre-active-observation.md`
> **Archive Projection V1**: `tasks/notes/20260908-1237-brc14-pre-active-observation.notes.md` => `tasks/archive/notes-20260908-1311-brc14-pre-active-observation.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1237-brc14-pre-active-observation.contract.md` => `tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1237-brc14-pre-active-observation.review.md` => `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md`

# Plan: BRC14 pre-active revision observation

> **Status**: Archived
> **Created**: 20260908-1237
> **Slug**: brc14-pre-active-observation
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Pre-active provider observation has admission and replay without authoring or active state
> **Rollback Surface**: Revert observation entry while retaining immutable private evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md`
> **Task Review**: `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1311-brc14-pre-active-observation.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260908-1237-brc14-pre-active-observation.md`
- Sprint contract: `tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md`
- Sprint review: `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md`
- Implementation notes: `tasks/archive/notes-20260908-1311-brc14-pre-active-observation.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1237-brc14-pre-active-observation.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1237-brc14-pre-active-observation.md`.

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
- Contract file: `tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md`
- Review file: `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md`
- Implementation notes file: `tasks/archive/notes-20260908-1311-brc14-pre-active-observation.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1237-brc14-pre-active-observation.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert observation entry while retaining immutable private evidence
- **Verification boundary**: Pre-active provider observation has admission and replay without authoring or active state
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1237-brc14-pre-active-observation.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1311-brc14-pre-active-observation.md`, `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md`, and `tasks/archive/notes-20260908-1311-brc14-pre-active-observation.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1311-brc14-pre-active-observation.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert observation entry while retaining immutable private evidence

## Captured Planning Output

## Goal
Provide a budgeted, immutable, read-only first-group revision observation before active adoption exists. This captures actual Oracle transport/session evidence without claiming trusted revision or accepting a group.

## P1 Map
Campaign grant/store owns identity and lifecycle; core/effect budget owns all provider reservations; Oracle wrapper already retains private raw SSE. Current group audit requires published adoption and completed cleanup, while active admission is disabled. A new pre-active observation is the missing entry, independent of authoring intent and group audit.

## P2 Trace
campaign observe-revision -> exact campaign authorization and current initial target/policy/profile -> immutable request -> existing campaign budget reservation -> fresh default-model GitHub consult with capture -> immutable result -> completed usage settlement or unresolved reservation. Replay consumes stored result without provider I/O. Stopped campaigns and target/profile drift refuse before reservation. No authoring intent, Task, publication or lifecycle advancement is created.

## P3 Decision
Add observe_revision to the existing campaign reservation union with group_number=1, intent_sha256=null and request_sha256. Its real request replaces the absent authoring intent; it is excluded only from authoring intent/round accounting, while global provider limits and unresolved reservation gates apply unchanged. Do not mint a second ledger or fake an intent. Add one campaign CLI subcommand and one effect, retaining immutable request/result in the existing campaign store. Completed records always report revision_evidence=unavailable: a raw stream is not a semantic receipt. Active gate remains closed. At 10x volume the existing provider budget and 64MiB capture limit bind first.

## Scope
Source: src/core/automation/budget.ts, src/effects/automation/budget-store.ts, src/effects/automation/development-campaign-store.ts, new src/effects/automation/campaign-revision-observation.ts, src/cli/commands/campaign.ts. Tests: focused observation and budget union/ledger cases plus directly affected campaign callers identified by TypeScript. Documentation: existing BRC14 research and canonical task artifacts. No dependency, config, model override, new storage authority, provider semantic parser or active admission change.

## Authorization and runtime boundary
Owner approved BRC14 fresh readonly evidence capture with a new budget and then instructed continued implementation of this pre-active entry. Build and verify this entry before consuming that budget. A real invocation may target only the already authorized disposable repository and fixed revision, use explicit GitHub activation/current model, and have a fresh one-invocation budget. Keep old stopped campaigns/grants and BRC6a completion untouched. Actual capture is transport observation, never completed-group acceptance. No active campaign, GitHub write or global installation.

## Verification
Focused tests cover allowed initial states without an authoring intent; wrong/stopped/later state, expired grant/target/profile mismatch; admission before I/O; one provider charge and zero authoring rounds; same-call replay including crash after result before settlement; unknown/failed outcomes blocking both same and changed requests; concurrency; fresh session/GitHub evidence and raw capture retention without revision promotion. Run budget and authoring/audit regression plus TypeScript and the six root integrity commands. No full suite: named contracts and typecheck cover the union extension. Freeze before canonical prepare acceptance and independent check; retain immutable evidence rather than rerun.

## Task Breakdown
- [x] Implement pre-active revision observation with existing campaign budget and immutable request/result.
- [x] Verify refusal, replay, budget and default-session boundaries; document actual scope and pass independent acceptance.

## Completion
Archive this bounded package with contract-worktree finish --no-merge; main has unrelated WIP. Raw live evidence is private and a later semantic receipt must derive from actual tool request/results, never an invented DTO. Reverting this package leaves prior capture and active gate behavior intact; retained observations are historical evidence.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Implement pre-active revision observation with existing campaign budget and immutable request/result.
- [x] Verify refusal, replay, budget and default-session boundaries; document actual scope and pass independent acceptance.


## Observed entrypoint correction

The authorized fixed canary commit uses finite issue-number selection, so campaign start correctly refuses its incomplete Issue snapshot. Revision observation reads no Issue list. Its sole input authority is therefore the anchored ProgramAuthorization digest (`--authorization-sha256`), even before campaign creation; any existing campaign is only an additional state/ownership constraint. This preserves the existing campaign-start guard and fixed remote commit. Request/result persistence may precede campaign definition, and subsequent creation must use the same grant. The campaign mutation lock serializes final state validation, reservation and initiation of the provider promise; no lock spans the await. Budget reservation is the in-flight boundary for a later stop.
