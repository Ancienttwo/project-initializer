# Plan: BRC default-model session admission

> **Status**: Executing
> **Created**: 20260908-0556
> **Slug**: brc-default-session-admission
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Default model session evidence across authoring adoption and recovery
> **Rollback Surface**: Before execution remove `plans/plan-20260908-0556-brc-default-session-admission.md`; after execution revert branch `codex/brc-default-session-admission` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-0556-brc-default-session-admission.contract.md`
> **Task Review**: `tasks/reviews/20260908-0556-brc-default-session-admission.review.md`
> **Implementation Notes**: `tasks/notes/20260908-0556-brc-default-session-admission.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260908-0556-brc-default-session-admission.md`
- Sprint contract: `tasks/contracts/20260908-0556-brc-default-session-admission.contract.md`
- Sprint review: `tasks/reviews/20260908-0556-brc-default-session-admission.review.md`
- Implementation notes: `tasks/notes/20260908-0556-brc-default-session-admission.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-0556-brc-default-session-admission.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-0556-brc-default-session-admission.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-0556-brc-default-session-admission.md`.

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
- Contract file: `tasks/contracts/20260908-0556-brc-default-session-admission.contract.md`
- Review file: `tasks/reviews/20260908-0556-brc-default-session-admission.review.md`
- Implementation notes file: `tasks/notes/20260908-0556-brc-default-session-admission.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-0556-brc-default-session-admission.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-0556-brc-default-session-admission.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260908-0556-brc-default-session-admission.md`; after execution revert branch `codex/brc-default-session-admission` or the explicitly reviewed diff.
- **Verification boundary**: Default model session evidence across authoring adoption and recovery
- **Review/acceptance boundary**: `tasks/reviews/20260908-0556-brc-default-session-admission.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-0556-brc-default-session-admission.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-0556-brc-default-session-admission.contract.md`, `tasks/reviews/20260908-0556-brc-default-session-admission.review.md`, and `tasks/notes/20260908-0556-brc-default-session-admission.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-0556-brc-default-session-admission.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260908-0556-brc-default-session-admission.md`; after execution revert branch `codex/brc-default-session-admission` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Honor the Owner-selected default model throughout campaign authoring and adoption. Verify the actual Oracle session and selected GitHub app independently of model identity; preserve model.verified=false and the exact-revision active gate.

## P1/P2/P3
P1: Oracle exports an invocation-owned descriptor and matching session metadata. The wrapper retains providerSessionId and structured appSelection observations. Campaign persistSession and connector challenge currently consume model.verified, making default model sessions permanently inadmissible.
P2: a completed current-strategy browser result reaches persistSession with model.verified=false, then requireVerifiedIssueAuthoringSession rejects before adoption. Challenge continuation repeats the same conflation, including recovered responses. The existing response artifact and pure adoption builder must use the same session-evidence authority.
P3: replace the model predicate with one strict session/app predicate shared by initial authoring and challenge response/recovery. Require the completed Oracle result, local/provider session binding, exact repository/profile and parent linkage, descriptor-derived matching observation, and selected GitHub composer pill. Preserve all raw observations and never set model.verified=true. Retire model_verified authoring/adoption inputs in the same slice; old persisted challenge input shapes fail closed rather than translate. No public CLI, service, dependency, model override, live provider invocation, or active-admission weakening. At ten times usage, missing/stale/malformed session evidence fails before adoption rather than introducing another provider call.

## Implementation
Add one pure campaign browser-session evidence validator under src/core/automation used by authoring and adoption. Update IssueAuthoringBrowserResult and adoption dependency types to carry the evidence they actually consume. Replace challenge/adoption model_verified with session_verified derived by that validator; update all real callers, recovery paths and fixtures together. Verify source session identity for followups and preserve unknown-outcome reservations. Keep current model metadata observational. Document the distinction and retained active exact-version boundary.

## Verification
Focused regression for default model plus valid session/app evidence and negative cases: model-only proof, absent/mismatched descriptor, missing/wrong pill, foreign repository/profile/parent, incomplete terminal state. Cover initial authoring, fill/edit, challenge response, recovered challenge, pure adoption and existing campaign-step behavior. Run TypeScript and the six required integrity checks. No full suite: named producer/consumer and recovery tests cover this bounded internal contract. Freeze before one independent check, canonical prepare-acceptance and receipt, then finish without absorbing main WIP.

## Scope
src/core/automation, src/effects/automation, related browser types only if needed, focused tests/helpers, docs/researches and workflow/projection artifacts. More than eight files are expected because the internal input contract has multiple fixtures and recovery consumers. No dependency is added. The shared validator is justified by authoring and adoption as two real consumers of the same evidence invariant.

## Delivery
Continue on the isolated integration ancestry preserving 700fe3b0 and e71fb76c Owner closeout. Revert the bounded implementation commit to roll back; historical stopped grants are never migrated or resumed. This package is not BRC14 positive audit or BRC15 active canary acceptance.

## Task Breakdown
- [ ] Add failing default-session admission and evidence rejection regressions.
- [ ] Replace model authority in all authoring/adoption/recovery consumers with strict session/app evidence.
- [ ] Verify, record review and receipt, and archive this package while retaining remaining real-canary obligations.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Add failing default-session admission and evidence rejection regressions.
- [ ] Replace model authority in all authoring/adoption/recovery consumers with strict session/app evidence.
- [ ] Verify, record review and receipt, and archive this package while retaining remaining real-canary obligations.
