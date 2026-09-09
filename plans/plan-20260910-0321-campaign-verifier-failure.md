# Plan: Settle explicit supervised campaign verifier failures

> **Status**: Executing
> **Created**: 20260910-0321
> **Slug**: campaign-verifier-failure
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260910-0321-campaign-verifier-failure.md`; after execution revert branch `codex/campaign-verifier-failure` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md`
> **Task Review**: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md`
> **Implementation Notes**: `tasks/notes/20260910-0321-campaign-verifier-failure.notes.md`

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

- Active plan: `plans/plan-20260910-0321-campaign-verifier-failure.md`
- Sprint contract: `tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md`
- Sprint review: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md`
- Implementation notes: `tasks/notes/20260910-0321-campaign-verifier-failure.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260910-0321-campaign-verifier-failure.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260910-0321-campaign-verifier-failure.md`.

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
- Contract file: `tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md`
- Review file: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md`
- Implementation notes file: `tasks/notes/20260910-0321-campaign-verifier-failure.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260910-0321-campaign-verifier-failure.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260910-0321-campaign-verifier-failure.md`; after execution revert branch `codex/campaign-verifier-failure` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260910-0321-campaign-verifier-failure.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260910-0321-campaign-verifier-failure.contract.md`, `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md`, and `tasks/notes/20260910-0321-campaign-verifier-failure.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260910-0321-campaign-verifier-failure.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260910-0321-campaign-verifier-failure.md`; after execution revert branch `codex/campaign-verifier-failure` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Settle an admitted campaign attempt from its exact supervised verifier rejection when the worker result file is absent, then permit a fresh stopped-adopted continuation under the existing failure-only gates.

## P1 / P2 / P3
The real BRC worker and verifier both exited zero with complete supervised terminal evidence. The verifier's canonical response explicitly says fail; the worker omitted its result file because of the now-fixed prompt scope contradiction. campaign-worker.ts finish calls settleObservedCampaignFailureUnderLock, which skips all zero exits, then reads the missing worker artifact and throws. This leaves an open reservation despite known failed verification. Consume the existing strict parseCampaignVerifierResponse authority and the immutable worker/verifier child+invocation+terminal identities and byte hashes. Seal only controller-owned permanent_failure/verifier_rejected, never invent a worker external_blocked result or success. Existing nonzero failure settlement, grant expiry, ownership, retirement, immutable final and lock boundaries remain. Stopped-adopted resume may recognize this exact failed final with the same fully settled budget, complete inventory, released claim, retired controller, exact inactive terminal and no publication/recovery guards. No grant resurrection, counter refund or broader unknown-result recovery. The original result file stays absent. At 10x load the existing short group lock and bounded two-role evidence check remain the limiting boundary; no additional provider work is created.

## Scope
src/effects/automation/campaign-worker.ts and focused model-free lifecycle/settled-resume tests, named regression fixtures and workflow/research evidence. Existing prompt repair is a completed prerequisite on this branch. No other source repair, new runtime authority, acceptance bypass, model output synthesis, grant or budget change.

## Task Breakdown
- [ ] Capture model-free RED for supervised verifier rejection with no worker result, plus pass/malformed/missing or altered evidence refusal.
- [ ] Consume exact existing terminal evidence to settle one permanent failure and make repeated settlement byte-idempotent.
- [ ] Admit only stopped, retired, fully settled, inactive failed predecessors through existing continuation gates; preserve unrelated refusal cases.
- [ ] Run named lifecycle, settlement/resume, runner tests and required integrity; freeze, review, close workflow and merge exact passing Required CI.
- [ ] Use merged frozen source to settle the existing dispatch without executing children; release exact claim and stop campaign. Rebuild image before the single additionally authorized acquisition with remaining non-acquisition caps conserved.

## Rollback
Revert the known-verifier-failure delta; do not remove or rewrite durable dispatch/settlement records and do not restart a retired dispatch.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Capture model-free RED for supervised verifier rejection with no worker result, plus pass/malformed/missing or altered evidence refusal.
- [ ] Consume exact existing terminal evidence to settle one permanent failure and make repeated settlement byte-idempotent.
- [ ] Admit only stopped, retired, fully settled, inactive failed predecessors through existing continuation gates; preserve unrelated refusal cases.
- [ ] Run named lifecycle, settlement/resume, runner tests and required integrity; freeze, review, close workflow and merge exact passing Required CI.
- [ ] Use merged frozen source to settle the existing dispatch without executing children; release exact claim and stop campaign. Rebuild image before the single additionally authorized acquisition with remaining non-acquisition caps conserved.
