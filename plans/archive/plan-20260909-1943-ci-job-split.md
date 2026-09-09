> **Archived**: 2026-09-09 20:16
> **Related Plan**: plans/archive/plan-20260909-1943-ci-job-split.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260909-2016
> **Archive Projection V1**: `plans/plan-20260909-1943-ci-job-split.md` => `plans/archive/plan-20260909-1943-ci-job-split.md`
> **Archive Projection V1**: `tasks/notes/20260909-1943-ci-job-split.notes.md` => `tasks/archive/notes-20260909-2016-ci-job-split.md`
> **Archive Projection V1**: `tasks/contracts/20260909-1943-ci-job-split.contract.md` => `tasks/archive/contract-20260909-2016-ci-job-split.md`
> **Archive Projection V1**: `tasks/reviews/20260909-1943-ci-job-split.review.md` => `tasks/archive/review-20260909-2016-ci-job-split.md`

# Plan: Run CI governance and functional checks independently

> **Status**: Archived
> **Created**: 20260909-1943
> **Slug**: ci-job-split
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: merge_boundary
> **Verification Boundary**: CI lane regression and protected aggregate readback
> **Rollback Surface**: Revert the CI lane split PR
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260909-2016-ci-job-split.md`
> **Task Review**: `tasks/archive/review-20260909-2016-ci-job-split.md`
> **Implementation Notes**: `tasks/archive/notes-20260909-2016-ci-job-split.md`

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

- Active plan: `plans/archive/plan-20260909-1943-ci-job-split.md`
- Sprint contract: `tasks/archive/contract-20260909-2016-ci-job-split.md`
- Sprint review: `tasks/archive/review-20260909-2016-ci-job-split.md`
- Implementation notes: `tasks/archive/notes-20260909-2016-ci-job-split.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260909-2016-ci-job-split.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260909-1943-ci-job-split.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260909-1943-ci-job-split.md`.

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
- Contract file: `tasks/archive/contract-20260909-2016-ci-job-split.md`
- Review file: `tasks/archive/review-20260909-2016-ci-job-split.md`
- Implementation notes file: `tasks/archive/notes-20260909-2016-ci-job-split.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260909-2016-ci-job-split.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260909-1943-ci-job-split.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert the CI lane split PR
- **Verification boundary**: CI lane regression and protected aggregate readback
- **Review/acceptance boundary**: `tasks/archive/review-20260909-2016-ci-job-split.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: merge_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260909-1943-ci-job-split.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260909-2016-ci-job-split.md`, `tasks/archive/review-20260909-2016-ci-job-split.md`, and `tasks/archive/notes-20260909-2016-ci-job-split.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260909-2016-ci-job-split.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert the CI lane split PR

## Captured Planning Output

## Goal

Separate hosted CI governance and functional/package execution so governance failure cannot suppress functional diagnostics. Keep Required / CI as the sole protected aggregate and require every dependency to succeed.

## Scope

Own .github/workflows/ci.yml, scripts/check-ci.sh, tests/check-ci-job-split.test.ts, tasks/lessons.md and this slice's workflow artifacts. Preserve MCP matrix, all existing checks, local/release no-argument complete gate, runtime pins and permissions. No release, policy bump, manifest writer fix or provider lease change.

## Design

P1: CI calls scripts/check-ci.sh; the script owns governance, tests and package smoke in sequence. Branch protection requires only Required / CI. Existing ci-run-tests.sh owns test iteration.
P2: task-sync exits nonzero under set -e before run_bun_tests; the new regression reproduces absence of functional execution. Two independent job invocations eliminate that scheduling dependency.
P3: add validated all/governance/functional lane selection to the single existing script; no-argument local/release execution preserves its existing order. Governance owns diff-base resolution and hygiene; Test owns pinned Herdr, functional tests and package checks. Aggregate always runs and rejects failure/cancelled/skipped. At 10x suite size functional runtime remains the bottleneck; test sharding is outside this slice.

## Task Breakdown

- [ ] Implement independent CI lanes and preserve all current checks.
- [ ] Verify lane failures, all 64 aggregate status combinations and required repository checks; review diff and land PR after CI succeeds.

## Evidence Contract

- State/progress path: this plan and its task contract.
- Verification evidence: focused CI tests plus the six required repository checks; GitHub CI on the PR head.
- Evaluator rubric: governance failure cannot prevent functional invocation; aggregate reports success only when every dependency succeeds; no omitted check or protection change.
- Stop condition: three fix rounds per issue or a second out-of-scope failure; never bypass Required / CI.
- Rollback surface: revert the CI lane split PR.

## Verification

Focused tests: tests/check-ci-job-split.test.ts, tests/check-ci-preflight-order.test.ts, tests/check-ci-isolate-aggregation.test.ts, tests/bootstrap-files.test.ts. Required integrity checks from AGENTS.md. Local full suite is not warranted for lane-only orchestration; hosted CI retains its full existing coverage.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Implement independent CI lanes and preserve all current checks.
- [ ] Verify lane failures, all 64 aggregate status combinations and required repository checks; review diff and land PR after CI succeeds.
