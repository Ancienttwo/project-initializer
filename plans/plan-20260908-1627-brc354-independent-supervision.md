# Plan: BRC354 independent supervision integration

> **Status**: Executing
> **Created**: 20260908-1627
> **Slug**: brc354-independent-supervision
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260908-1627-brc354-independent-supervision.md`; after execution revert branch `codex/brc354-independent-supervision` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md`
> **Task Review**: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md`
> **Implementation Notes**: `tasks/notes/20260908-1627-brc354-independent-supervision.notes.md`

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

- Active plan: `plans/plan-20260908-1627-brc354-independent-supervision.md`
- Sprint contract: `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md`
- Sprint review: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md`
- Implementation notes: `tasks/notes/20260908-1627-brc354-independent-supervision.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-1627-brc354-independent-supervision.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-1627-brc354-independent-supervision.md`.

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
- Contract file: `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md`
- Review file: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md`
- Implementation notes file: `tasks/notes/20260908-1627-brc354-independent-supervision.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-1627-brc354-independent-supervision.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260908-1627-brc354-independent-supervision.md`; after execution revert branch `codex/brc354-independent-supervision` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-1627-brc354-independent-supervision.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md`, `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md`, and `tasks/notes/20260908-1627-brc354-independent-supervision.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260908-1627-brc354-independent-supervision.md`; after execution revert branch `codex/brc354-independent-supervision` or the explicitly reviewed diff.

## Captured Planning Output

# Independent campaign supervision integration

## Goal
Complete #354's execution evidence boundary using the existing Docker containment implementation. A worker must not be able to replace the authority used to authenticate its logs or terminal inactivity. Keep production active admission closed and do not run model calls or an active campaign.

## P1 / P2 / P3
Current main invokes host Codex through contract-run's bounded supervisor and consumes worker-writable runDir logs plus bounded-result.json. The preserved codex/brc-host-containment candidate already implements Docker PID1 deadlines, pinned-image execution, container identity/configuration readback and recovery, but it is not integrated with current main and stores its journal in the mounted common Git directory. Reuse that implementation; move authority into the existing host repo-harness home outside every container mount and bind consumers to the trusted root. Preserve #358 finalization/FIFO/cancellation fixes. At greater concurrency, container resource limits and bounded API/output/deadlines remain the first capacity limit; do not add another orchestration service.

## Scope
- Integrate existing containment source, image/PID1, runtime invocation v2, contract-run source/packaged helper, worker terminal and recovery consumers from preserved candidate.
- Keep request/created/start/terminal/interruption journals outside all mounted roots, with exact invocation/dispatch/claim/generation checks. Reject an untrusted/overlapping control path before workload start.
- Actual consumer rejects replaced logs and worktree-local forged summaries against the independently held host receipt. Missing or interrupted evidence cannot invent successful output.
- Preserve cleanup/retirement and no-restart recovery, immutable image, exact daemon configuration, read-only common Git/verifier mounts, and no Docker socket access.
- Retain existing active refusal. No model selection changes, new provider calls, campaign activation, package release or unrelated cleanup.

## Task Breakdown
1. Integrate existing Docker candidate into an isolated worktree based on main, resolving only the known worker/runtime/helper boundaries.
2. Prove and repair control-store isolation and actual consumer tamper rejection; add model-free barrier and recovery regressions.
3. Run focused native and credential-free Docker tests, required repository checks, and source/packaged parity. Record original failures and final evidence without rerunning old probes.
4. Review the bounded diff, publish the PR, consume required new-head CI and merge when accepted. Preserve all other worktrees.

## Verification
- Model-free runtime/containment tests, actual caller and terminal consumer, explicit post-exit/pre-consumption replacement window, altered identity/result, symlink/exit/output mismatch, deadline/cancel/controller loss and idempotent recovery.
- Credential-free Docker synthetic workloads and Codex --version only; use the existing pinned local image and daemon. No Codex exec/model requests.
- Typecheck, helper parity and six repository-integrity checks. Use existing historical lifecycle/finalization tests to ensure legitimate recovery remains possible.
- No local full suite; remote CI remains the merge requirement. Expensive final verification uses canonical prepare-acceptance once frozen.

## Completion Boundary
#354 is accepted only when the actual producer/consumer boundary and protected host evidence pass. BRC14/BRC15 live acceptance remains separate and unfulfilled. Rollback is this isolated integration commit; no data migration or compatibility reader is added.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC354 independent supervision integration
