> **Archived**: 2026-09-06 20:19
> **Related Plan**: plans/archive/plan-20260906-1732-checks-artifact-repair.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-2019
> **Archive Projection V1**: `plans/plan-20260906-1732-checks-artifact-repair.md` => `plans/archive/plan-20260906-1732-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/notes/20260906-1732-checks-artifact-repair.notes.md` => `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1732-checks-artifact-repair.contract.md` => `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1732-checks-artifact-repair.review.md` => `tasks/archive/review-20260906-2019-checks-artifact-repair.md`

# Plan: Typed verification artifact repair with scoped receipt

> **Status**: Archived
> **Created**: 20260906-1732
> **Slug**: checks-artifact-repair
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Typed failure classification and exact-contract edit authority without stop or ship waiver
> **Rollback Surface**: Revert recorder and all receipt consumers together; ignored receipts stay inert
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`
> **Task Review**: `tasks/archive/review-20260906-2019-checks-artifact-repair.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`

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

- Active plan: `plans/archive/plan-20260906-1732-checks-artifact-repair.md`
- Sprint contract: `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`
- Sprint review: `tasks/archive/review-20260906-2019-checks-artifact-repair.md`
- Implementation notes: `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-2019-checks-artifact-repair.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-1732-checks-artifact-repair.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-1732-checks-artifact-repair.md`.

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
- Contract file: `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`
- Review file: `tasks/archive/review-20260906-2019-checks-artifact-repair.md`
- Implementation notes file: `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-2019-checks-artifact-repair.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-1732-checks-artifact-repair.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert recorder and all receipt consumers together; ignored receipts stay inert
- **Verification boundary**: Typed failure classification and exact-contract edit authority without stop or ship waiver
- **Review/acceptance boundary**: `tasks/archive/review-20260906-2019-checks-artifact-repair.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-1732-checks-artifact-repair.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-2019-checks-artifact-repair.md`, `tasks/archive/review-20260906-2019-checks-artifact-repair.md`, and `tasks/archive/notes-20260906-2019-checks-artifact-repair.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-2019-checks-artifact-repair.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert recorder and all receipt consumers together; ignored receipts stay inert

## Captured Planning Output

## Goal
Distinguish verifier-declared unparseable contract artifacts from ordinary failed verification, and provide an audited, single-contract edit repair without clearing failed checks or granting Stop/ship acceptance.

## P1 Map
verify-contract/verify-sprint own failure_class. Effective State currently drops it and emits checks_failed for every fresh failed result. Existing scoped code repair is allowed by operation-readiness, but state next halts uniformly. The unrelated verification-lifecycle owner controls executable schema and verifier execution; this slice consumes its published failure_class without parsing error strings or editing that worktree.

## P2 Trace
A contract missing the YAML exit criteria causes verifier failure_class=missing_artifact. checks.latest preserves it, but projectEffectiveState collapses it into checks_failed. The agent cannot distinguish a malformed contract from a red regression through state next. Existing boolean path admission provides no persisted reason for an artifact-specific unlock.

## P3 Decision
Carry the known failure_class into failed-check state and use checks_artifact_invalid only for the producer's exact missing_artifact value. Unknown/missing classes remain checks_failed. Add `state repair-artifact --reason <reason> --json` under the existing state command: it rereads fresh authoritative failure and records an immutable typed receipt bound to active contract path/content, exact checks bytes, review subject and target revision. Store it under ignored `.ai/harness/state/artifact-repairs/` keyed by checks digest, using existing repo-contained IO and lock primitives. Effective State includes a present receipt in its evidence revision and permits only edits of that exact contract with a valid receipt; original failure stays visible and Stop/ship remain blocked. Existing contract-authorized repairs for ordinary red tests remain unchanged, and cannot use the artifact receipt. `state next` uses the existing continue_active_plan route to name the artifact-repair command before grant and the contract edit after grant; no new route or replacement acceptance authority. Missing/malformed/stale receipt fails closed. All real tests still require fresh verification afterward. New command is necessary to persist the explicitly requested audited reason; it adds no configuration or provider dependency. At 10x repair attempts immutable evidence grows by one tiny receipt per distinct checks result, not per state resolution.

## Scope
Core artifact-repair receipt schema, state types/projector/continuation and operation readiness; effect recorder and state input collection; existing state CLI adapter; focused state/guard/CLI tests; task and architecture/research documentation. No PR/BRC or verification-lifecycle worktree mutation and no global install/release.

## Task Breakdown
- [x] Prove missing_artifact currently collapses to checks_failed and state next halts; retain ordinary-failure controls.
- [x] Implement typed classification, immutable receipt recorder, freshness binding and exact-contract edit authorization.
- [x] Project an existing-route repair continuation and expose the bounded state command with explicit reason.
- [x] Verify real CLI and guard behavior: missing/invalid/stale receipts refuse, valid receipt permits only contract edits, unrelated blockers and stop/ship still refuse, and real failed tests retain ordinary repair behavior.
- [x] Run focused state/guard/command tests and six integrity checks; native security/architecture review, docs/todo closeout and reviewable commit.

## Verification
Use project-effective-state, operation-readiness, continuation-envelope, mutation-guard and focused real artifact-repair tests, plus type/state-boundary/bundle checks and six integrity commands. No full suite: the producer and execution contract remain unchanged, while named consumers cover the authorization path end to end.

## Rollback
Revert CLI/schema/effect/projector changes together. Leave immutable ignored receipts inert; never convert them into acceptance or erase historical failed checks.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Prove missing_artifact currently collapses to checks_failed and state next halts; retain ordinary-failure controls.
- [x] Implement typed classification, immutable receipt recorder, freshness binding and exact-contract edit authorization.
- [x] Project an existing-route repair continuation and expose the bounded state command with explicit reason.
- [x] Verify real CLI and guard behavior: missing/invalid/stale receipts refuse, valid receipt permits only contract edits, unrelated blockers and stop/ship still refuse, and real failed tests retain ordinary repair behavior.
- [x] Run focused state/guard/command tests and six integrity checks; native security/architecture review, docs/todo closeout and reviewable commit.

## Approved Integration Boundary

The user approved release integration of all three implemented todos. This plan now owns their single publication boundary, including both historical slice archives, the merged verifier contract migration, one frozen canonical verification bundle and one codex-plugin acceptance. Other agents retain PR/BRC and release version/publication ownership.
