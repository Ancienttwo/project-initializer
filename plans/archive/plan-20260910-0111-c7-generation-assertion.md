> **Archived**: 2026-09-10 01:14
> **Related Plan**: plans/archive/plan-20260910-0111-c7-generation-assertion.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260910-0114
> **Archive Projection V1**: `plans/plan-20260910-0111-c7-generation-assertion.md` => `plans/archive/plan-20260910-0111-c7-generation-assertion.md`
> **Archive Projection V1**: `tasks/notes/20260910-0111-c7-generation-assertion.notes.md` => `tasks/archive/notes-20260910-0114-c7-generation-assertion.md`
> **Archive Projection V1**: `tasks/contracts/20260910-0111-c7-generation-assertion.contract.md` => `tasks/archive/contract-20260910-0114-c7-generation-assertion.md`
> **Archive Projection V1**: `tasks/reviews/20260910-0111-c7-generation-assertion.review.md` => `tasks/archive/review-20260910-0114-c7-generation-assertion.md`

# Plan: C7 structured generation assertion

> **Status**: Archived
> **Created**: 20260910-0111
> **Slug**: c7-generation-assertion
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0114-c7-generation-assertion.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260910-0111-c7-generation-assertion.md`; after execution revert branch `codex/c7-generation-assertion` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260910-0114-c7-generation-assertion.md`
> **Task Review**: `tasks/archive/review-20260910-0114-c7-generation-assertion.md`
> **Implementation Notes**: `tasks/archive/notes-20260910-0114-c7-generation-assertion.md`

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

- Active plan: `plans/archive/plan-20260910-0111-c7-generation-assertion.md`
- Sprint contract: `tasks/archive/contract-20260910-0114-c7-generation-assertion.md`
- Sprint review: `tasks/archive/review-20260910-0114-c7-generation-assertion.md`
- Implementation notes: `tasks/archive/notes-20260910-0114-c7-generation-assertion.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260910-0114-c7-generation-assertion.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260910-0111-c7-generation-assertion.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260910-0111-c7-generation-assertion.md`.

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
- Contract file: `tasks/archive/contract-20260910-0114-c7-generation-assertion.md`
- Review file: `tasks/archive/review-20260910-0114-c7-generation-assertion.md`
- Implementation notes file: `tasks/archive/notes-20260910-0114-c7-generation-assertion.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0114-c7-generation-assertion.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260910-0111-c7-generation-assertion.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260910-0111-c7-generation-assertion.md`; after execution revert branch `codex/c7-generation-assertion` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260910-0114-c7-generation-assertion.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260910-0114-c7-generation-assertion.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260910-0111-c7-generation-assertion.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260910-0114-c7-generation-assertion.md`, `tasks/archive/review-20260910-0114-c7-generation-assertion.md`, and `tasks/archive/notes-20260910-0114-c7-generation-assertion.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260910-0114-c7-generation-assertion.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260910-0111-c7-generation-assertion.md`; after execution revert branch `codex/c7-generation-assertion` or the explicitly reviewed diff.

## Captured Planning Output

## Goal

Remove the C7 read-surface test false positive when a valid digest contains the decimal representation of the forged lease generation. Preserve rejection of actual numeric/string generation values and forged execution identity strings across nested response values.

## P1 / P2 / P3

The C7 CLI test publishes a forged execution context and reads five public surfaces. Their projections correctly withhold execution_context. The test then applies string substring exclusion to serialized JSON; numeric 4242 can occur inside an unrelated legitimate SHA256. Keep runtime code untouched and compare the generation as a parsed scalar, while retaining existing UUID/digest exclusion and null execution_context checks. This is a bounded assertion repair, not a change to security authority or output schema. At larger response sizes whole-serialization substring collisions become more likely; structured traversal remains linear in payload size.

## Scope

Only tests/cli/collaboration.test.ts, focused regression evidence, workflow notes and a durable test rationale. Keep campaign recovery implementation unchanged. No runtime changes, new Issues, budget changes or full local suite.

## Task Breakdown

- [ ] Extract existing assertion into a local test helper and reproduce the exact CI hash collision deterministically.
- [ ] Compare generation as structured scalar; retain the remaining forged-identity exclusions and negative sensitivity cases.
- [ ] Run focused CLI test, typecheck and six required integrity checks, then record canonical acceptance.
- [ ] Update existing PR385 with this approved CI blocker repair; wait exact Required CI, merge and resume the authorized BRC chain.

## Verification

Focused tests/cli/collaboration.test.ts plus typecheck and six required repository checks. CI owns the complete suite; no new local full run. Preserve CI34376981934 as evidence for the previous subject and exact false positive.

## Rollback

Revert this test-only correction independently of the settled-resume product behavior.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Extract existing assertion into a local test helper and reproduce the exact CI hash collision deterministically.
- [ ] Compare generation as structured scalar; retain the remaining forged-identity exclusions and negative sensitivity cases.
- [ ] Run focused CLI test, typecheck and six required integrity checks, then record canonical acceptance.
- [ ] Update existing PR385 with this approved CI blocker repair; wait exact Required CI, merge and resume the authorized BRC chain.
