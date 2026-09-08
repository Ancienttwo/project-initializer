> **Archived**: 2026-09-08 18:56
> **Related Plan**: plans/archive/plan-20260908-1830-brc354-final-closeout.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1856
> **Archive Projection V1**: `plans/plan-20260908-1830-brc354-final-closeout.md` => `plans/archive/plan-20260908-1830-brc354-final-closeout.md`
> **Archive Projection V1**: `tasks/notes/20260908-1830-brc354-final-closeout.notes.md` => `tasks/archive/notes-20260908-1856-brc354-final-closeout.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1830-brc354-final-closeout.contract.md` => `tasks/archive/contract-20260908-1856-brc354-final-closeout.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1830-brc354-final-closeout.review.md` => `tasks/archive/review-20260908-1856-brc354-final-closeout.md`

# Plan: BRC354 preparation fencing and recovery-safe cleanup

> **Status**: Archived
> **Created**: 20260908-1830
> **Slug**: brc354-final-closeout
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1856-brc354-final-closeout.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260908-1830-brc354-final-closeout.md`; after execution revert branch `codex/brc354-final-closeout` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1856-brc354-final-closeout.md`
> **Task Review**: `tasks/archive/review-20260908-1856-brc354-final-closeout.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1856-brc354-final-closeout.md`

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

- Active plan: `plans/archive/plan-20260908-1830-brc354-final-closeout.md`
- Sprint contract: `tasks/archive/contract-20260908-1856-brc354-final-closeout.md`
- Sprint review: `tasks/archive/review-20260908-1856-brc354-final-closeout.md`
- Implementation notes: `tasks/archive/notes-20260908-1856-brc354-final-closeout.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1856-brc354-final-closeout.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1830-brc354-final-closeout.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1830-brc354-final-closeout.md`.

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
- Contract file: `tasks/archive/contract-20260908-1856-brc354-final-closeout.md`
- Review file: `tasks/archive/review-20260908-1856-brc354-final-closeout.md`
- Implementation notes file: `tasks/archive/notes-20260908-1856-brc354-final-closeout.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1856-brc354-final-closeout.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1830-brc354-final-closeout.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-1830-brc354-final-closeout.md`; after execution revert branch `codex/brc354-final-closeout` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1856-brc354-final-closeout.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1856-brc354-final-closeout.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1830-brc354-final-closeout.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1856-brc354-final-closeout.md`, `tasks/archive/review-20260908-1856-brc354-final-closeout.md`, and `tasks/archive/notes-20260908-1856-brc354-final-closeout.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1856-brc354-final-closeout.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-1830-brc354-final-closeout.md`; after execution revert branch `codex/brc354-final-closeout` or the explicitly reviewed diff.

## Captured Planning Output

## P1 / P2 / P3
PR #360 main a1393e44 owns Docker supervision outside worker mounts. prepareChild runs version probe and creates the execution container before publishing the invocation; recovery currently treats absence of started as inactivity after retirement. Record preparation before any async Docker effects and refuse inactivity or settlement when preparation lacks its complete bound invocation. No output, identity or inactivity is reconstructed from partial journals. Existing persisted-invocation recovery remains supported.

Successful containers are retained for exact daemon readback. Add one explicit operator-invoked cleanup operation for an exact protected created handle, only after the original deadline and after durable interruption evidence establishes inactivity. Remove only that stopped container without force; keep the protected journal so subsequent consumers can verify the same immutable receipt. No background collector or worktree cleanup is authorized by this operation. At 10x volume, retained host journals and operator cleanup frequency are the first storage limit.

## Scope
- Fence preparation with a durable exact-role/claim/generation/deadline marker before Docker side effects. Fail closed at every loss window before complete invocation publication; never restart to repair missing authority.
- Add bounded exact-container cleanup and document durable journal retention and replay behavior.
- Test actual controller SIGKILL boundaries and real reclaim/recovery consumers using model-free fixtures; retain simultaneous log/summary replacement, identity, output and helper regressions.
- Preserve BRC6a and active admission guards. No provider calls, model changes, package release, global installation or unrelated worktree cleanup.

## Task Breakdown
- [ ] Capture original regression failures and implement preparation fencing plus exact-container cleanup.
- [ ] Freeze code and run focused model-free Docker/lifecycle tests, TypeScript, source/helper parity, and six required integrity checks through canonical acceptance.
- [ ] Review once against the issue criteria, update durable docs and deferred ledger, create PR, consume required CI, merge and close #354 with precise evidence.

## Verification
Use existing pinned local campaign image sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 and Docker 28.3.2. No live Codex inference. Named focused regression tests cover the changed recovery/cleanup boundary plus original actual-consumer isolation. No local full suite; required remote CI remains the merge gate.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Capture original regression failures and implement preparation fencing plus exact-container cleanup.
- [ ] Freeze code and run focused model-free Docker/lifecycle tests, TypeScript, source/helper parity, and six required integrity checks through canonical acceptance.
- [ ] Review once against the issue criteria, update durable docs and deferred ledger, create PR, consume required CI, merge and close #354 with precise evidence.
