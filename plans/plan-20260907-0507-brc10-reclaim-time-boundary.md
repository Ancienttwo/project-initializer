# Plan: BRC10 prerequisite: consume reclaim receipts across observation time

> **Status**: Executing
> **Created**: 20260907-0507
> **Slug**: brc10-reclaim-time-boundary
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260907-brc10-readiness.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Lease reclaim receipt timing and concurrent generation transition
> **Rollback Surface**: Existing reclaim consumer; no schema migration
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md`
> **Task Review**: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md`
> **Implementation Notes**: `tasks/notes/20260907-0507-brc10-reclaim-time-boundary.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260907-brc10-readiness.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260907-0507-brc10-reclaim-time-boundary.md`
- Sprint contract: `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md`
- Sprint review: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md`
- Implementation notes: `tasks/notes/20260907-0507-brc10-reclaim-time-boundary.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-0507-brc10-reclaim-time-boundary.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-0507-brc10-reclaim-time-boundary.md`.

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
- Contract file: `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md`
- Review file: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md`
- Implementation notes file: `tasks/notes/20260907-0507-brc10-reclaim-time-boundary.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-0507-brc10-reclaim-time-boundary.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Existing reclaim consumer; no schema migration
- **Verification boundary**: Lease reclaim receipt timing and concurrent generation transition
- **Review/acceptance boundary**: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-0507-brc10-reclaim-time-boundary.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-0507-brc10-reclaim-time-boundary.contract.md`, `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md`, and `tasks/notes/20260907-0507-brc10-reclaim-time-boundary.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-0507-brc10-reclaim-time-boundary.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Existing reclaim consumer; no schema migration

## Captured Planning Output

## Why
BRC10 must consume #286 across separate observation and effect calls. Existing automaticReclaimLease reclassifies using the later clock, then compares the complete digest including classified_at, so a valid receipt cannot survive elapsed time. Current tests hide this by injecting one fixed clock.

## Goal
Make the existing reclaim consumer validate the historical receipt and re-check live eligibility at the actual consumption time, preserving every identity/evidence fence and atomic generation change. Establish two-process reclaim and crash recovery evidence before campaign wiring.

## Scope
Owning core/effect lease reclaim modules, their unit/process tests, isolated BRC10 research, task artifacts and generated architecture manifest only. No campaign product wiring, policy defaults, takeover evidence inference or BRC10 whole-row completion.

## Architecture and Decision
Use validateLeaseReclaimEligibility for the input receipt. Under the existing Task lock read the exact current owner and renewal; check task revision/claim/generation/renewal/evidence revision. Recreate the historical receipt at its recorded classified_at against current observed evidence and require byte/digest equality. Classify separately at fresh now and require reclaimable, reject clock regression. Use existing stealLeaseRecord and durable owner writer. This preserves receipt tamper rejection while removing elapsed time as an accidental identity field. No new dependency/store/API is needed. At 10x contention the Task lock remains the serialization boundary; it cannot weaken evidence requirements.

## Task Breakdown
- Reproduce changed-clock refusal on unchanged evidence; capture a failing regression before source changes.
- Apply historical receipt validation and independent fresh eligibility revalidation under the existing Task lock.
- Prove all evidence/identity/publication drift remains refused; add actual two-process race and after-owner-write crash replay tests.
- Run the three #286 suites and required integrity checks, record canonical acceptance, open a PR, wait required CI and merge without moving unrelated work.

## Verification
Focused #286 lease-liveness/store/reclaim suites and named new process regression; TypeScript and six repository integrity checks. Full local suite is unnecessary for this bounded API fix; PR required CI retains its full gate. One canonical prepare after code freeze; exact-context evidence reused.

## Acceptance
User explicitly authorized autonomous acceptance and PR merge for BRC10–15. This is a directly required BRC10 prerequisite package with its own rollback and review boundary, not fulfillment of the BRC10 sprint row. Source Ref points to the independent BRC10 research document.

## Rollback
Revert the package commit; persisted Lease and receipt schemas remain unchanged. No live Lease mutation is part of development or verification.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC10 prerequisite: consume reclaim receipts across observation time
