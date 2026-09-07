# Plan: BRC15a authoring to adoption contract alignment

> **Status**: Executing
> **Created**: 20260908-0143
> **Slug**: brc15a-adoption-alignment
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Real canary regressions across prompt, model evidence and complete snapshot admission
> **Rollback Surface**: Before execution remove `plans/plan-20260908-0143-brc15a-adoption-alignment.md`; after execution revert branch `codex/brc15a-adoption-alignment` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md`
> **Task Review**: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md`
> **Implementation Notes**: `tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md`

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

- Active plan: `plans/plan-20260908-0143-brc15a-adoption-alignment.md`
- Sprint contract: `tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md`
- Sprint review: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md`
- Implementation notes: `tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-0143-brc15a-adoption-alignment.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-0143-brc15a-adoption-alignment.md`.

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
- Contract file: `tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md`
- Review file: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md`
- Implementation notes file: `tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-0143-brc15a-adoption-alignment.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260908-0143-brc15a-adoption-alignment.md`; after execution revert branch `codex/brc15a-adoption-alignment` or the explicitly reviewed diff.
- **Verification boundary**: Real canary regressions across prompt, model evidence and complete snapshot admission
- **Review/acceptance boundary**: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-0143-brc15a-adoption-alignment.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-0143-brc15a-adoption-alignment.contract.md`, `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md`, and `tasks/notes/20260908-0143-brc15a-adoption-alignment.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-0143-brc15a-adoption-alignment.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260908-0143-brc15a-adoption-alignment.md`; after execution revert branch `codex/brc15a-adoption-alignment` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Repair the observed authoring-to-adoption contract failures without reclassifying the previous canary or issuing another provider grant.

## P1/P2/P3
Existing prompt emits only metadata field names; parser requires integer priority and sorted unique arrays, and adoption resolves exact-revision capability IDs. Freeze a shared exact-revision capability reader for authoring and adoption; include parser-derived metadata requirements and that registry in every initial/fill/edit prompt. Reject unresolvable authority before provider reservation. Keep strict metadata validation; no coercion of P1 or capability aliases.
The external GitHub labels-selection path already lists all Issue pages; batch marker matching owns campaign selection. Explicit issue-number snapshots cannot prove absence and are rejected by the observer. Move this requirement to campaign start before external authoring; document the supported complete-page setup without mutating the existing canary target.
Trace model verification from exact Oracle session metadata into BrowserSessionMeta and persisted IssueAuthoringSession. Consume only provider-owned, exact-model and required-effort verified evidence, bound to the exact session; never infer success from output text or patch old receipts. Freeze the exact correction after the bounded source trace; if the provider lacks required authority keep that sub-boundary fail closed and record the missing producer.

## Scope
Code: campaign authoring metadata contract and exact capability reader, campaign start policy, browser Oracle model verification projection and directly affected callers/tests. Durable report and this plan/contract/review/notes. Preserve main WIP and original canary evidence. No GPT call, new grant, active repair, Issue edit/close, release or broad unrelated refactor.

## Verification
First capture deterministic red regressions for real schema omission and preflight ordering, plus the verified model projection case if the necessary authority exists. Test initial and continuation prompts, exact-revision registry drift, malformed authority, unsupported selection before provider I/O, and model/effort mismatches. Run affected focused tests and six repository integrity checks; no full suite because named boundary tests cover the delta. Freeze before final prepare-acceptance and consume that evidence for one review.

## Delivery
Isolated codex/brc15a-adoption-alignment worktree from main. Preserve existing evaluation package independently. Record limits of local evidence; BRC15a remains pending real re-validation and user investment acceptance. At 10x capability count prompt grows linearly; do not truncate the authority catalog silently, and fail closed on unavailable registry.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC15a authoring to adoption contract alignment
