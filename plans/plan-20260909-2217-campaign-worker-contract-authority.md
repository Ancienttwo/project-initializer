# Plan: Preserve admitted contract through campaign acquisition

> **Status**: Executing
> **Created**: 20260909-2217
> **Slug**: campaign-worker-contract-authority
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Model-free acquire projection and worker proof binding
> **Rollback Surface**: Revert contract preservation and proof consumption together
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md`
> **Task Review**: `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md`
> **Implementation Notes**: `tasks/notes/20260909-2217-campaign-worker-contract-authority.notes.md`

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

- Active plan: `plans/plan-20260909-2217-campaign-worker-contract-authority.md`
- Sprint contract: `tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md`
- Sprint review: `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md`
- Implementation notes: `tasks/notes/20260909-2217-campaign-worker-contract-authority.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260909-2217-campaign-worker-contract-authority.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260909-2217-campaign-worker-contract-authority.md`.

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
- Contract file: `tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md`
- Review file: `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md`
- Implementation notes file: `tasks/notes/20260909-2217-campaign-worker-contract-authority.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260909-2217-campaign-worker-contract-authority.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert contract preservation and proof consumption together
- **Verification boundary**: Model-free acquire projection and worker proof binding
- **Review/acceptance boundary**: `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260909-2217-campaign-worker-contract-authority.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260909-2217-campaign-worker-contract-authority.contract.md`, `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md`, and `tasks/notes/20260909-2217-campaign-worker-contract-authority.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260909-2217-campaign-worker-contract-authority.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert contract preservation and proof consumption together

## Captured Planning Output

## Decision

Preserve the admitted contract as the sole content authority across fleet projection and campaign worker binding. Existing contract files remain byte-identical; missing contracts are initialized from the canonical template. Existing templates remain invalid until authored and pass through the unchanged brief preflight. Remove the duplicate digest field from newly written handoffs; bind and launch consume the envelope plan proof using its bare-hex representation. Validate the worktree against that proof. Do not rewrite prior immutable handoffs or broaden successor recovery eligibility.

## P1 / P2 / P3

The canonical plan proof binds the authored contract before fleet acquire. The packaged plan-to-todo helper unconditionally renders a template over that contract; campaign-worker then hashes the overwritten file. This explains both incomplete_brief and the changed-contract rejection after restoring authored bytes. Protect the proof invariant at projection and consume that proof at dispatch. No new public surface, parser, dual read or compatibility migration. At 10x concurrent acquisition volume the existing lease/store locking remains the limiting surface; this patch adds no writes to shared stores.

## Task Breakdown

- [ ] Prove contract clobbering with a model-free package-only fleet acquisition regression and record RED.
- [ ] Preserve existing contracts and bind new worker handoffs to the admitted plan proof, retaining drift rejection.
- [ ] Run focused model-free tests, typecheck, helper synchronization and required repository integrity checks; record evidence and durable findings.
- [ ] Publish PR, require final-candidate CI, merge, then assess same-campaign continuation through formal recovery only.

## Verification

Focused fleet CLI, campaign worker and closeout guardrail tests; contract-run preflight regression; check:type; check:helpers; six repository required integrity checks. No full local suite. Acceptance should reuse unchanged evidence. The existing canary is separate runtime evidence and cannot pass until worker/verifier, manual merge, closeout and audit/accept complete.

## Boundaries

In scope: campaign-worker.ts, plan-to-todo.sh and its canonical helper mirror, focused tests, workflow artifacts and durable research.
Out of scope: successor eligibility, budget caps, runtime Docker infrastructure, Oracle, identity bypass, immutable store rewriting, unrelated worktrees, automatic merge, package release.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Prove contract clobbering with a model-free package-only fleet acquisition regression and record RED.
- [ ] Preserve existing contracts and bind new worker handoffs to the admitted plan proof, retaining drift rejection.
- [ ] Run focused model-free tests, typecheck, helper synchronization and required repository integrity checks; record evidence and durable findings.
- [ ] Publish PR, require final-candidate CI, merge, then assess same-campaign continuation through formal recovery only.
