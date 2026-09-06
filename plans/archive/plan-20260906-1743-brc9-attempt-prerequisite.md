> **Archived**: 2026-09-06 19:15
> **Related Plan**: plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-1915
> **Archive Projection V1**: `plans/plan-20260906-1743-brc9-attempt-prerequisite.md` => `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-1743-brc9-attempt-prerequisite.notes.md` => `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1743-brc9-attempt-prerequisite.contract.md` => `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1743-brc9-attempt-prerequisite.review.md` => `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`

# Plan: BRC9 prerequisite: closed Task outcomes and retry fence

> **Status**: Archived
> **Created**: 20260906-1743
> **Slug**: brc9-attempt-prerequisite
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Closed attempt outcomes and mutation-side retry admission
> **Rollback Surface**: Existing attempt records and retry authority; no new store
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
> **Task Review**: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`

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

- Active plan: `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`
- Sprint contract: `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
- Sprint review: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`
- Implementation notes: `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md`.

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
- Contract file: `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`
- Review file: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`
- Implementation notes file: `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Existing attempt records and retry authority; no new store
- **Verification boundary**: Closed attempt outcomes and mutation-side retry admission
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-1743-brc9-attempt-prerequisite.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1915-brc9-attempt-prerequisite.md`, `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md`, and `tasks/archive/notes-20260906-1915-brc9-attempt-prerequisite.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1915-brc9-attempt-prerequisite.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Existing attempt records and retry authority; no new store

## Captured Planning Output

## Goal
Deliver the independently usable #287 prerequisite for BRC9: a closed Task attempt outcome contract including not_reproducible, and write-time enforcement of existing retry eligibility. This is an upstream prerequisite work-package, not completion of the consume-only BRC9 sprint row.

## P1 — Map
The core authority is src/core/engineers/automation-attempt.ts. The only durable writer is src/effects/engineers/automation-attempt-store.ts, serialized by work-package lock in the Git common directory. Engineer scheduling reads its current projection and the generic automation controller writes attempts through the same API. The BRC9 sprint requires no automatic retry for user/permanent blockers and a closed result set. Existing WorkPackageRetryPolicyV1 owns retryable classes and deterministic backoff; it must remain the sole retry policy.

## P2 — Trace
Task execution supplies a real Claim/Lease/WorkPackage/controller/dispatch identity to recordTaskAutomationAttemptStart. Same identity is replayed. A new identity currently checks only an unfinished prior attempt and max count, then persists; it does not call observeRetryEligibility, so it can bypass backoff or a terminal outcome even though the read model says retry_forbidden. Completion goes through completeTaskAutomationAttempt/buildTaskAutomationAttempt, which currently lacks a runtime closed-outcome membership check. The current projection validator also does not validate last_outcome membership. The TypeScript union lacks not_reproducible.

## P3 — Decision
Use one exported readonly outcome tuple in the owning core module as both the TypeScript union source and the runtime membership authority. The existing duplicated outcome list in src/core/engineers/scheduling.ts must consume that tuple so Engineer offer validation accepts exactly the same vocabulary. Add not_reproducible as an evidenced, non-retryable terminal outcome. Validate outcome membership in the builder and current validator, and reject started at the completion boundary; preserve existing valid record bytes and digest calculations. Validate the supplied retry policy with the existing validateWorkPackageRetryPolicy before either start or completion mutates the store; completion derives the next eligible timestamp and must not persist an invalid backoff. Before a new attempt is persisted, call the existing observeRetryEligibility under the existing lock, using input.started_at and the durable current for that exact revision. Keep exact-identity replay first, so a replay neither consumes another attempt nor fails because the completed result is terminal. Fail with the existing closed eligibility reason for any state other than eligible. Do not add a retry algorithm, lifecycle command, store, identity translator or schema fallback.

## Scope
- src/core/engineers/automation-attempt.ts
- src/core/engineers/scheduling.ts
- src/effects/engineers/automation-attempt-store.ts
- tests/unit/issue-287-automation-attempt.test.ts
- docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md
- Exact plan/contract/review/notes artifacts, tasks/todos.md, generated docs/architecture/ projection as required.
No budget vectors, campaign counters, provider calls, BRC9 acquisition wiring, authoring attempt identity, Task/Lease identity changes, or automatic publication are part of this slice. No dependencies or services are added.

## Compatibility and authority
Existing valid outcomes and stored hashes are unchanged. Unknown outcomes were never part of the contract and must fail closed, not migrate into a guessed classification. not_reproducible cannot be configured as a retryable failure class. Task attempts still require actual Task/WorkPackage/Claim/Lease/controller/dispatch identity; pre-adoption authoring remains a separate upstream prerequisite and must not use invented task identity. A work-package revision reset keeps the existing revision-scoped behavior.

## Task Breakdown
- [x] Add pre-fix guards proving unknown outcomes are accepted today and a new start can bypass terminal/backoff state; capture failing evidence before production edits.
- [x] Implement the single outcome authority and locked eligibility fence without changing exact replay behavior or persisted record format.
- [x] Verify all supported outcomes, unknown outcome rejection, not_reproducible completion/replay, user/permanent/completed terminal refusal, transient backoff before/at eligibility time, exhausted and unresolved attempts, unchanged bytes after refusal, invalid retry policy, Engineer offer/current outcome round-trip, and cross-process same-identity replay.
- [ ] Run focused tests and six root integrity checks; freeze, perform check review and canonical acceptance, then finish the upstream package. BRC9 remains pending until the remaining #282/campaign-attempt prerequisites land.

## Verification
Use tests/unit/issue-287-automation-attempt.test.ts for core and real durable store behavior, tests/unit/issue-279-automation-controller-run.test.ts for the actual controller caller, and tests/unit/issue-280-acquire-next.test.ts for scheduler consumption; run check:type and check:state-boundaries. Include all six root integrity checks. No local full-suite criterion is justified by this bounded upstream contract change; remote required CI remains a release gate.

## Tradeoffs and 10x behavior
A caller-only eligibility check is rejected because the public writer can bypass it and concurrent starts must be fenced under the owner lock. Reusing observeRetryEligibility preserves one retry policy and adds only a bounded current read/evaluation under the existing lock. At 10x attempt count, the existing linear attempt-file scan and shared work-package lock dominate; this slice adds no new persistent counter or index. Reject malformed durable authority rather than repairing it from prose.

## Rollback
Revert the guard and outcome addition only before new not_reproducible records are issued. After issuance, retain those records and require an explicit operator migration/release decision before reverting the closed outcome vocabulary; do not rewrite terminal evidence. No other authority or schema is migrated in this package.

## Completion
Publish a verified upstream contract before BRC9 consumes it. Keep the sprint BRC9 row pending and record which prerequisite subset is now available. Subsequent work must separately settle campaign-specific limits, step/provider reservation composition and pre-adoption identity in the existing budget authority.

## Preflight evidence
/tmp/brc9-attempt-preflight.jsonl proves that current read-side retry_forbidden for user/permanent failures and retry_backoff for a transient failure still allow a second write-side attempt, and that unexpected_outcome is persisted and read back. This is disposable test state, not real Task/Lease authority. The production writer/reader contract is the owning boundary being repaired.

## Runtime flow

Verified Task/WorkPackage/Claim/Lease/controller/dispatch context
  -> attempt store work-package lock
     -> exact-identity replay (no new write)
     -> existing retry-policy validator and core eligibility evaluator
     -> append attempt + identity record + derived current
  -> Engineer offer validator consumes the same outcome vocabulary
  -> existing controller consumes eligibility and dispatch evidence

The core attempt module imports scheduling types only; scheduling may import the shared outcome tuple without a runtime import cycle. No API key, account, service or external dependency is added; existing Git/Bun tools were exercised by the preflight.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Add pre-fix guards proving unknown outcomes are accepted today and a new start can bypass terminal/backoff state; capture failing evidence before production edits.
- [x] Implement the single outcome authority and locked eligibility fence without changing exact replay behavior or persisted record format.
- [x] Verify all supported outcomes, unknown outcome rejection, not_reproducible completion/replay, user/permanent/completed terminal refusal, transient backoff before/at eligibility time, exhausted and unresolved attempts, unchanged bytes after refusal, invalid retry policy, Engineer offer/current outcome round-trip, and cross-process same-identity replay.
- [ ] Run focused tests and six root integrity checks; freeze, perform check review and canonical acceptance, then finish the upstream package. BRC9 remains pending until the remaining #282/campaign-attempt prerequisites land.
