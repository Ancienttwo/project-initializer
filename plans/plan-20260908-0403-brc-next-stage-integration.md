# Plan: BRC next-stage accepted package integration

> **Status**: Executing
> **Created**: 20260908-0403
> **Slug**: brc-next-stage-integration
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260908-0403-brc-next-stage-integration.md`; after execution revert branch `codex/brc-next-stage-integration` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md`
> **Task Review**: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md`
> **Implementation Notes**: `tasks/notes/20260908-0403-brc-next-stage-integration.notes.md`

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

- Active plan: `plans/plan-20260908-0403-brc-next-stage-integration.md`
- Sprint contract: `tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md`
- Sprint review: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md`
- Implementation notes: `tasks/notes/20260908-0403-brc-next-stage-integration.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-0403-brc-next-stage-integration.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-0403-brc-next-stage-integration.md`.

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
- Contract file: `tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md`
- Review file: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md`
- Implementation notes file: `tasks/notes/20260908-0403-brc-next-stage-integration.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-0403-brc-next-stage-integration.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260908-0403-brc-next-stage-integration.md`; after execution revert branch `codex/brc-next-stage-integration` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-0403-brc-next-stage-integration.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-0403-brc-next-stage-integration.contract.md`, `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md`, and `tasks/notes/20260908-0403-brc-next-stage-integration.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-0403-brc-next-stage-integration.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260908-0403-brc-next-stage-integration.md`; after execution revert branch `codex/brc-next-stage-integration` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Integrate the already accepted BRC authoring/snapshot alignment and default-model/GitHub activation packages in an isolated main-based worktree, then establish the current model-free campaign verification baseline for BRC14/BRC15. User has stopped additional BRC6a probes and explicitly directed moving to the next stage. Do not launch GPT, use old budgets, downgrade exact-version, modify main WIP, or install/release.

## P1/P2/P3
P1: main33c5012e retains independent readiness WIP. Accepted alignment1f9be5cb and provider522aa04b (tree equals60d4b4dd) are separate branches with overlapping gpt-pro-issue-authoring.ts, issue-batch-adoption.ts and tests; their source deltas need one combined candidate before later audit/canary work. BRC14-readiness4889507e is historical research, not a source branch to merge.
P2: campaign authorization -> frozen capability registry + complete snapshot policy -> issue-authoring browser input with user-default model and GitHub app -> exact Oracle descriptor/session observation -> issue adoption. Combine alignment's schema contract with provider's model-free/app activation fields. Inspect conflicts by semantics, preserve tests from both. Do not use labels or answers as revision/model authority.
P3: Integrate accepted branches without rereviewing their old boundaries. Test combined affected flows and review only merge resolutions/new delta. The fresh main-based worktree protects readiness edits. There is no new API or dependency. At10x, unverified exact-version gates still block active admission; integration does not remove them. No old acceptance is relabeled as covering the new combined subject.

## Scope
Merge codex/brc15a-adoption-alignment and codex/brc15a-provider-verification-evidence into this contract worktree. Own only their existing changed paths, integration research, plan/contract/review/notes/todos, architecture projections. BRC14 map is read-only input for the next work package; no empty audit receipt or semantic placeholder is introduced. Record user decision to stop BRC6a probes and move forward.

## Verification
Focused tests: tests/effects/gpt-pro-issue-authoring.test.ts, tests/unit/issue-batch-reconcile.test.ts, tests/unit/development-campaign-policy.test.ts, tests/effects/development-campaign-store.test.ts, tests/cli/development-campaign.test.ts, tests/cli/chatgpt-browser.test.ts, tests/unit/oracle-session-evidence.test.ts. Named suites cover both overlapping authoring/adoption paths and descriptor/default/browser transport behavior. Run typecheck and six required integrity checks. No full suite or real provider. Freeze and perform one integration-only /check acceptance; archive with --no-merge.

## Task Breakdown
- [ ] Merge the two accepted packages and resolve only combined-scope conflicts.
- [ ] Verify the combined authoring/default/app/provider contract without GPT.
- [ ] Record next-stage boundary, acceptance and archive while preserving main WIP.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Merge the two accepted packages and resolve only combined-scope conflicts.
- [ ] Verify the combined authoring/default/app/provider contract without GPT.
- [ ] Record next-stage boundary, acceptance and archive while preserving main WIP.
