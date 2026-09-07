> **Archived**: 2026-09-08 02:51
> **Related Plan**: plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-0251
> **Archive Projection V1**: `plans/plan-20260908-0205-brc15a-provider-verification-evidence.md` => `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-0205-brc15a-provider-verification-evidence.notes.md` => `tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0205-brc15a-provider-verification-evidence.contract.md` => `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0205-brc15a-provider-verification-evidence.review.md` => `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md`

# Plan: BRC15a structured Oracle session and effort evidence

> **Status**: Archived
> **Created**: 20260908-0205
> **Slug**: brc15a-provider-verification-evidence
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Exact provider session and observed Pro effort producer-consumer contract
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`; after execution revert branch `codex/brc15a-provider-verification-evidence` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md`
> **Task Review**: `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md`

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

- Active plan: `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`
- Sprint contract: `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md`
- Sprint review: `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md`
- Implementation notes: `tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`.

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
- Contract file: `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md`
- Review file: `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md`
- Implementation notes file: `tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`; after execution revert branch `codex/brc15a-provider-verification-evidence` or the explicitly reviewed diff.
- **Verification boundary**: Exact provider session and observed Pro effort producer-consumer contract
- **Review/acceptance boundary**: `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-0251-brc15a-provider-verification-evidence.md`, `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md`, and `tasks/archive/notes-20260908-0251-brc15a-provider-verification-evidence.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-0251-brc15a-provider-verification-evidence.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-0205-brc15a-provider-verification-evidence.md`; after execution revert branch `codex/brc15a-provider-verification-evidence` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Honor the user-selected ChatGPT default and explicitly activate GitHub before campaign authoring. Preserve unverified model and exact-revision boundaries. Produce structured Oracle session/observation evidence in the same work-package after the connector submission boundary is proven.

## P1/P2/P3
P1: authoring supplies BrowserConsultInput; wrapper already supports chatgptApp and fails before submission when Oracle lacks --browser-app. Oracle candidate has no app selector. Its promptComposer appends text and owns the final send boundary for both browser paths.
P2: initial/fill/edit currently inject gpt-5.5-pro. Remove model entirely and pass chatgptApp=GitHub. Oracle selects the existing GitHub menu entry via composer-plus-btn, then confirms an actual ecosystemMention inline-selection pill in prompt-textarea. Reconfirm after prompt insertion before send. A plain prompt mention is never selection evidence.
P3: reuse user UI defaults with no model/thinking override. Keep model.verified=false; app activation proves UI selection only, not Connector invocation or exact-SHA. Missing/ambiguous/disabled app or lost pill fails before send. No automatic alternative transport or automatic GPT probe. UI selectors observed using CUA on 2026-09-08; no prompt sent. At 10x runs, browser DOM drift remains the first failure and stops submission.

## Scope
repo-harness authoring, browser provider/session tests and docs; Oracle candidate CLI/config/app selection/prompt submission and focused tests. More than eight files across two repositories because the existing config and browser send paths are separate. No dependency or service is added. Each new source file owns either the app DOM action or provider descriptor interface; tests guard their submission/evidence boundaries.

## Verification
First run default-model/Connector regression red. Oracle tests must prove missing app, duplicate entries, disabled entries, fabricated text, and lost pill prevent sending; selected app survives prompt insertion. Run focused browser/authoring tests, type/build, and six repo integrity checks. No full suite or GPT calls. Structured descriptor tests cover session collisions, malformed handles, mismatches and no log fallback; effort observation cannot establish backend model identity.

## Delivery
Independent Oracle candidate commit; repo package is completed through prepare/acceptance/finish without dirty-main merge. Preserve completed alignment receipt; integrate its delta serially later. BRC6a/BRC14/BRC15a/BRC15 are not marked done from these tests.

## Task Breakdown
- [x] Remove authoring model/thinking injection and explicitly require GitHub activation for initial/fill/edit.
- [x] Implement Oracle GitHub selection and pre-send confirmation with focused regression evidence.
- [x] Export exact provider session handle and preserve structured observations without upgrading verification.
- [ ] Run scoped verification, record review and finish the package preserving main WIP.
