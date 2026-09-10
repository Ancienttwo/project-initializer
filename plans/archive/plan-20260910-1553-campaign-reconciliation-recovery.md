> **Archived**: 2026-09-10 18:02
> **Related Plan**: plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260910-1802
> **Archive Projection V1**: `plans/plan-20260910-1553-campaign-reconciliation-recovery.md` => `plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md`
> **Archive Projection V1**: `tasks/notes/20260910-1553-campaign-reconciliation-recovery.notes.md` => `tasks/archive/notes-20260910-1802-campaign-reconciliation-recovery.md`
> **Archive Projection V1**: `tasks/contracts/20260910-1553-campaign-reconciliation-recovery.contract.md` => `tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md`
> **Archive Projection V1**: `tasks/reviews/20260910-1553-campaign-reconciliation-recovery.review.md` => `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md`

# Plan: Recover malformed reconciliation and acknowledge expired campaign stop

> **Status**: Archived
> **Created**: 20260910-1553
> **Slug**: campaign-reconciliation-recovery
> **Planning Source**: repo-harness-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Real-store RED/GREEN tests, exact-hash dry-run, focused accounting and campaign suites, repository-integrity checks, and final source review before live recovery
> **Rollback Surface**: Revert this source slice; original live records are untouched during development, repair receipts and charges are never deleted or refunded
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md`
> **Task Review**: `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md`
> **Implementation Notes**: `tasks/archive/notes-20260910-1802-campaign-reconciliation-recovery.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from repo-harness-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md`
- Sprint contract: `tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md`
- Sprint review: `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md`
- Implementation notes: `tasks/archive/notes-20260910-1802-campaign-reconciliation-recovery.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md`.

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
- Contract file: `tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md`
- Review file: `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md`
- Implementation notes file: `tasks/archive/notes-20260910-1802-campaign-reconciliation-recovery.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert this source slice; original live records are untouched during development, repair receipts and charges are never deleted or refunded
- **Verification boundary**: Real-store RED/GREEN tests, exact-hash dry-run, focused accounting and campaign suites, repository-integrity checks, and final source review before live recovery
- **Review/acceptance boundary**: `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260910-1553-campaign-reconciliation-recovery.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260910-1802-campaign-reconciliation-recovery.md`, `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md`, and `tasks/archive/notes-20260910-1802-campaign-reconciliation-recovery.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260910-1802-campaign-reconciliation-recovery.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert this source slice; original live records are untouched during development, repair receipts and charges are never deleted or refunded

## Captured Planning Output

P1 — Map: Automation accounting is owned by src/effects/automation/budget-store.ts and src/core/automation/budget.ts; immutable reservation/reconciliation/event/stop records live under the Git common directory. src/cli/commands/automation.ts is the operator boundary. Campaign transitions are owned by src/core/automation/development-campaign.ts and persisted by development-campaign-store.ts. Continuation ownership is enforced by campaign-authoring-resume.ts; its existing stopped/quiescent/no-adoption guards remain the admission authority. Real BYOK campaign/grant/browser state is a separate operator boundary, not a test fixture.

P2 — Trace: reconcileAutomationReservation writes reconciliations/<reservation>.json before commitUsage constructs/validates its event. A prefixed evidence digest leaves a durable invalid decision and no usage event; identical replay fails schema and corrected replay conflicts. The old campaign also has an immutable expire_authorization event. Existing stop admits only NON_TERMINAL, so a formally stopped successor cannot be established after expiry. Prove both with the existing real-store test fixtures before implementation. Inspect settlement after an existing stop receipt: the returned and persisted projection must stay exhausted while the original receipt remains byte-identical.

P3 — Decision: Keep original reconciliation/expiry/stop records immutable. Validate the complete proposed usage event and exact stored reservation/preconditions before publishing a reconciliation. Reuse the resulting validated event at publication, rather than introduce a second semantic parser. Add a narrowly operator-invoked repair for an invalid evidence record: expected original byte hash, original run/reservation/reconciled_reserved resolution/reason, caller-supplied valid replacement evidence, and an immutable repair receipt. Normal reconciliation replay stays strict; valid decisions and existing usage cannot be rewritten. The repair charges the original resolution exactly once, with no refund, no new reservation/grant, and no provider call; support a zero-write dry-run and recheck under the existing run lock on apply. Preserve terminal budget projection on late settlement.

For campaign closure, prefer the existing explicit stop operation as a terminal-to-terminal acknowledgment from authorization_expired, preserving the prior expiry event and budget while keeping all terminal-to-active transitions forbidden. This retains the existing replacement schema and strict formally-stopped gate; do not introduce optional aliases, dual readers, or migrate historical replacement records merely to rename stop_event_sha256. Confirm the effect path has no provider side effect and freeze this boundary before editing. Existing completed/stopped/budget_exhausted transition behavior stays unchanged.

Tradeoffs: An append-only operator repair receipt adds one durable audit record per exceptional damaged decision; it is not an alternate charge authority. The usage event remains the sole charge. New files are only an operator regression test if existing fixtures cannot cover the CLI, a durable recovery runbook, and required workflow/evidence artifacts. No dependencies. At 10x historical run size the existing ledger fold/directory scan remains the first scaling cost; this slice adds no background scan or retries.

Scope: budget-store.ts, automation.ts, development-campaign.ts, their exact ArchContext caller selectors and deterministic architecture outputs, directly affected budget/campaign regression tests, docs/researches/20260910-reconciliation-recovery.md, and this plan's workflow artifacts. Keep the original Issue identities. Do not modify Oracle, canary live stores, grants, browser sessions, existing frozen source/image evidence, or Issue bodies while developing. No new model calls, new grants, worker/verifier reruns, bulk Issue creation, deploy, or release. Before any live recovery/source activation, produce exact-input dry-run evidence and state any remaining approval boundary. Required CI/source approval precedes consuming the repaired runtime for the live continuation.

Verification: First capture RED guards on unmodified source. Named focused suites cover budget store, budget core/contention, campaign core/store, authoring resume and affected CLI. Run typecheck plus the eight root Required Checks. Do not run the full local suite: the changed persistence/state boundaries are covered by the named suites; CI retains its existing release policy. Freeze code, run verify-sprint --prepare-acceptance once, review the final diff and use the recorded evidence. End with an exact original-state recovery dry-run and bounded next action if live authority remains pending.

## Task Breakdown
- [x] Prove invalid reconciliation persistence and terminal-stop rejection in isolated fixtures with RED regression evidence.
- [x] Validate reconciliation before persistence and provide exact-hash, append-only operator evidence repair with dry-run/replay coverage.
- [x] Permit explicit stop acknowledgment after authorization expiry and prove no reactivation plus strict continuation eligibility.
- [ ] Run focused and repository-integrity verification, review the frozen diff, and document the exact operator recovery boundary.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->
