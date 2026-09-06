> **Archived**: 2026-09-06 17:24
> **Related Plan**: plans/archive/plan-20260906-1702-brc8-ci-characterization.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-1724
> **Archive Projection V1**: `plans/plan-20260906-1702-brc8-ci-characterization.md` => `plans/archive/plan-20260906-1702-brc8-ci-characterization.md`
> **Archive Projection V1**: `tasks/notes/20260906-1702-brc8-ci-characterization.notes.md` => `tasks/archive/notes-20260906-1724-brc8-ci-characterization.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1702-brc8-ci-characterization.contract.md` => `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1702-brc8-ci-characterization.review.md` => `tasks/archive/review-20260906-1724-brc8-ci-characterization.md`

# Plan: BRC8 CI characterization control alignment

> **Status**: Archived
> **Created**: 20260906-1702
> **Slug**: brc8-ci-characterization
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: BRC0 canonical Claim control and prompt negatives remain enforced
> **Rollback Surface**: One test-only assertion, no runtime or schema changes
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md`
> **Task Review**: `tasks/archive/review-20260906-1724-brc8-ci-characterization.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1724-brc8-ci-characterization.md`

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

- Active plan: `plans/archive/plan-20260906-1702-brc8-ci-characterization.md`
- Sprint contract: `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md`
- Sprint review: `tasks/archive/review-20260906-1724-brc8-ci-characterization.md`
- Implementation notes: `tasks/archive/notes-20260906-1724-brc8-ci-characterization.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-1702-brc8-ci-characterization.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-1702-brc8-ci-characterization.md`.

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
- Contract file: `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md`
- Review file: `tasks/archive/review-20260906-1724-brc8-ci-characterization.md`
- Implementation notes file: `tasks/archive/notes-20260906-1724-brc8-ci-characterization.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1724-brc8-ci-characterization.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-1702-brc8-ci-characterization.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: One test-only assertion, no runtime or schema changes
- **Verification boundary**: BRC0 canonical Claim control and prompt negatives remain enforced
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1724-brc8-ci-characterization.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-1702-brc8-ci-characterization.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md`, `tasks/archive/review-20260906-1724-brc8-ci-characterization.md`, and `tasks/archive/notes-20260906-1724-brc8-ci-characterization.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1724-brc8-ci-characterization.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: One test-only assertion, no runtime or schema changes

## Captured Planning Output

## Goal
Restore the BRC0 prompt-versus-Claim characterization control after BRC8 added typed Fleet admission failure handling. Preserve all canonical authority bytes and negative prompt assertions.

## P1/P2/P3
P1: tests/characterization/repair-campaign-authority-freeze.test.ts injects a claim spy; src/effects/fleet/acquire.ts owns acquisition result handling. No production changes are required.
P2: the canonical control reaches claim, whose spy throws __spy__claim; BRC8 capacity admission catches it and returns {ok:false,error:authorization_stale,message:__spy__claim}. CI run 34022628870 and local /tmp/brc8-ci-characterization-before.txt reproduce the obsolete toThrow assertion. The subsequent calls==[claim] assertion and negative prompt assertions remain the behavioral oracle.
P3: replace only the obsolete thrown-error expectation with the exact typed failure result; preserve call tracing, no-mutation assertions and all frozen bytes. No schema, dependency, runtime semantics, or migration change. At 10x scale there is no added runtime cost.

## Scope
One test control assertion; task artifacts and durable BRC8 verification note. No BRC9 implementation or upstream budget contract expansion.

## Task Breakdown
- [ ] Update the control to assert the actual typed failure and retain the exact claim-call trace and all negatives.
- [ ] Run the full characterization file and six repository integrity checks; inspect the final test-only delta.
- [ ] Prepare canonical targeted acceptance, review the frozen delta, and finish through installed contract-worktree before publication.

## Verification
bun test --timeout 60000 tests/characterization/repair-campaign-authority-freeze.test.ts
All six AGENTS repository integrity checks. Full CI run 34022628870 is baseline evidence with exactly one failing file; all other files passed on 2fbd9060. This test-only assertion adaptation requires its complete characterization file, not another local full suite. Remote required CI remains a separate release gate.

## Rollback
Revert the single test assertion update; no data migration or side effects.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Update the control to assert the actual typed failure and retain the exact claim-call trace and all negatives.
- [ ] Run the full characterization file and six repository integrity checks; inspect the final test-only delta.
- [ ] Prepare canonical targeted acceptance, review the frozen delta, and finish through installed contract-worktree before publication.
