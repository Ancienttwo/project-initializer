# Plan: Proactive refactor recommendations with user execution choice

> **Status**: Executing
> **Created**: 20260911-0238
> **Slug**: proactive-refactor-recommendations
> **Planning Source**: user-approved-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: human_decision_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260911-0238-proactive-refactor-recommendations.md`; after execution revert branch `codex/proactive-refactor-recommendations` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md`
> **Task Review**: `tasks/reviews/20260911-0238-proactive-refactor-recommendations.review.md`
> **Implementation Notes**: `tasks/notes/20260911-0238-proactive-refactor-recommendations.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from user-approved-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260911-0238-proactive-refactor-recommendations.md`
- Sprint contract: `tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md`
- Sprint review: `tasks/reviews/20260911-0238-proactive-refactor-recommendations.review.md`
- Implementation notes: `tasks/notes/20260911-0238-proactive-refactor-recommendations.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260911-0238-proactive-refactor-recommendations.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260911-0238-proactive-refactor-recommendations.md`.

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
- Contract file: `tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md`
- Review file: `tasks/reviews/20260911-0238-proactive-refactor-recommendations.review.md`
- Implementation notes file: `tasks/notes/20260911-0238-proactive-refactor-recommendations.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260911-0238-proactive-refactor-recommendations.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260911-0238-proactive-refactor-recommendations.md`; after execution revert branch `codex/proactive-refactor-recommendations` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260911-0238-proactive-refactor-recommendations.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: human_decision_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260911-0238-proactive-refactor-recommendations.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260911-0238-proactive-refactor-recommendations.contract.md`, `tasks/reviews/20260911-0238-proactive-refactor-recommendations.review.md`, and `tasks/notes/20260911-0238-proactive-refactor-recommendations.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260911-0238-proactive-refactor-recommendations.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260911-0238-proactive-refactor-recommendations.md`; after execution revert branch `codex/proactive-refactor-recommendations` or the explicitly reviewed diff.

## Captured Planning Output

# Goal
Proactively surface measured refactoring opportunities to the current Agent, which explains the recommendation and asks the user whether to proceed. No proposal author, recommendation acceptance, Work Package, program, code mutation or execution is started by discovery. Implement in a separate stacked PR on the global-configuration change.

# P1 Map
The existing public refactor discover CLI enters shadow proposal authoring and requires both repo mode and activation. Its lower-level discoverRefactorCandidates reads ArchContext scan and recommendation lifecycle; execution/materialization are separate. Stop can deliver a one-shot decision block to the Agent and already shares a 20-second deferred-work deadline. Global install/update owns host preferences, while model/code facts remain local. Upstream recommendation identity/fingerprint supplies delivery identity; runtime reports live under ignored .ai/harness/runs.

# P2 Trace
Normal Stop after existing required gates -> globally enabled, deadline-bounded observation effect -> exact package-owned ArchContext scan and lifecycle readback -> complete authoritative code facts -> bounded candidate report -> one-shot Agent instruction to explain evidence/benefits/risks and request user decision. Repeated report identity is not delivered again. Explicit refactor recommendations CLI consumes the same observer without performing user execution. Existing approved-plan workflow remains the execution authority.

# P3 Decision / thesis
Observation should be proactive; investment/execution should be a user decision. Decouple read-only measured discovery from the existing execution/author activation ladder. Reuse provider parsing, lifecycle filtering, exact package version and process bounds; no heuristic opportunity detector or synthetic approval. Global recommendation settings seed once on install/update, with normal enabled defaults for absent settings and explicit disabled preserved. Keep execution refactor policy/activation intact. At 10x repositories, Stop latency and repeated nudges fail first: cap scan time, share the Stop deadline, serialize/cache scans, and deduplicate bounded delivery.

# Scope
Global configuration reader shared by architecture and recommendation settings; new refactor recommendation observer and CLI; Stop delivery seam; install/uninstall setting ownership; focused tests; specification/reference guidance and file-backed workflow artifacts. No model authoring/index creation, LLM author subprocess, automatic task/plan creation, execution activation, merge or release.

# Falsifier / cheapest proof
With execution activation off, a fixture scan yields a real structural observation and Stop asks the Agent to present it for user choice exactly once. A second Stop does not repeat it, incomplete/stale provider data never becomes a recommendation, timeout is bounded, and no execution/author/materialize API is invoked.

# Verification
Focused configuration/observer/Stop/CLI regression plus existing refactor activation/shadow/provider tests. Actual 0.5.10 two-module cycle fixture verifies low-level candidates. Run repository required integrity/type checks and init dry-run. No full-suite or benchmark matrix is required for this bounded observation feature.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Capture approved scope and contract.
- [x] Implement global observation settings, shared discovery report and CLI, one-shot Stop recommendation delivery.
- [x] Validate disabled/default behavior, deadline, dedupe, incomplete facts, two-repo settings and unchanged execution gates.
- [ ] Review changes, record evidence, submit independent stacked PR without merge/release.
