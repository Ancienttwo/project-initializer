> **Archived**: 2026-09-09 23:00
> **Related Plan**: plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260909-2300
> **Archive Projection V1**: `plans/plan-20260909-2241-campaign-not-planned-acceptance.md` => `plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md`
> **Archive Projection V1**: `tasks/notes/20260909-2241-campaign-not-planned-acceptance.notes.md` => `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
> **Archive Projection V1**: `tasks/contracts/20260909-2241-campaign-not-planned-acceptance.contract.md` => `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md`
> **Archive Projection V1**: `tasks/reviews/20260909-2241-campaign-not-planned-acceptance.review.md` => `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`

# Plan: Consume canonical acceptance disposition in not-planned closeout

> **Status**: Archived
> **Created**: 20260909-2241
> **Slug**: campaign-not-planned-acceptance
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Canonical receipt reaches model-free not-planned closeout
> **Rollback Surface**: Revert the consumer and matching regression together
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md`
> **Task Review**: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`
> **Implementation Notes**: `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`

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

- Active plan: `plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md`
- Sprint contract: `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md`
- Sprint review: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`
- Implementation notes: `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md`.

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
- Contract file: `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md`
- Review file: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`
- Implementation notes file: `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert the consumer and matching regression together
- **Verification boundary**: Canonical receipt reaches model-free not-planned closeout
- **Review/acceptance boundary**: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260909-2241-campaign-not-planned-acceptance.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260909-2300-campaign-not-planned-acceptance.md`, `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md`, and `tasks/archive/notes-20260909-2300-campaign-not-planned-acceptance.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260909-2300-campaign-not-planned-acceptance.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert the consumer and matching regression together

## Captured Planning Output

## Decision

Consume the canonical AcceptanceReceipt disposition external_pass in campaign not_planned closeout, alongside the already supported user_waiver. Reject the noncanonical pass value and reject. Do not translate receipt shapes, weaken evidence/identity checks or add aliases.

## P1 / P2 / P3

AcceptanceReceipt owns disposition as external_pass, user_waiver or reject. The CLI verifies the receipt through the trusted helper and passes its JSON to runCampaignNotPlanned unchanged. The consumer currently checks pass instead of external_pass; the positive test injects the same incorrect pass value. Correct the consumer and positive fixture; prove noncanonical pass/reject fail before provider calls. This is the sole directly blocking out-of-scope repair permitted during BRC14/15 continuation. At 10x scale this literal protocol alignment adds no storage or calls; existing budget and provider closure remain the limits.

## Task Breakdown

- [ ] Capture model-free RED for canonical external_pass on the existing closeout fixture.
- [ ] Align consumer and add canonical/invalid disposition regression cases.
- [ ] Run focused closeout tests, typecheck and required integrity checks; review and archive the work-package.
- [ ] Require CI and merge the bounded repair before #178 close-not-planned.

## Boundaries

In scope: src/effects/automation/campaign-not-planned.ts, tests/effects/campaign-closeout.test.ts, workflow artifacts and durable research.
Out of scope: receipt schema, CLI adaptation, waivers, campaign authority, budget caps, successor recovery, provider implementations and unrelated failures.

## Verification

Focused campaign closeout tests, typecheck, required six integrity checks. No local full suite or live provider call to test the patch. PR/CI is the independent delivery boundary.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Capture model-free RED for canonical external_pass on the existing closeout fixture.
- [ ] Align consumer and add canonical/invalid disposition regression cases.
- [ ] Run focused closeout tests, typecheck and required integrity checks; review and archive the work-package.
- [ ] Require CI and merge the bounded repair before #178 close-not-planned.
