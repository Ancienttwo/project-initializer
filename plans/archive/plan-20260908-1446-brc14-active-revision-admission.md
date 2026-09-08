> **Archived**: 2026-09-08 15:08
> **Related Plan**: plans/archive/plan-20260908-1446-brc14-active-revision-admission.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-1508
> **Archive Projection V1**: `plans/plan-20260908-1446-brc14-active-revision-admission.md` => `plans/archive/plan-20260908-1446-brc14-active-revision-admission.md`
> **Archive Projection V1**: `tasks/notes/20260908-1446-brc14-active-revision-admission.notes.md` => `tasks/archive/notes-20260908-1508-brc14-active-revision-admission.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1446-brc14-active-revision-admission.contract.md` => `tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1446-brc14-active-revision-admission.review.md` => `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md`

# Plan: BRC14 formal revision evidence admission

> **Status**: Archived
> **Created**: 20260908-1446
> **Slug**: brc14-active-revision-admission
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260908-brc14-provider-history-evidence.md
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Exact revision and observed budget settlement across active entrypoints
> **Rollback Surface**: Revert code without rewriting immutable observations or budgets
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md`
> **Task Review**: `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-1508-brc14-active-revision-admission.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260908-brc14-provider-history-evidence.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260908-1446-brc14-active-revision-admission.md`
- Sprint contract: `tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md`
- Sprint review: `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md`
- Implementation notes: `tasks/archive/notes-20260908-1508-brc14-active-revision-admission.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-1446-brc14-active-revision-admission.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-1446-brc14-active-revision-admission.md`.

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
- Contract file: `tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md`
- Review file: `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md`
- Implementation notes file: `tasks/archive/notes-20260908-1508-brc14-active-revision-admission.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-1446-brc14-active-revision-admission.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert code without rewriting immutable observations or budgets
- **Verification boundary**: Exact revision and observed budget settlement across active entrypoints
- **Review/acceptance boundary**: `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-1446-brc14-active-revision-admission.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-1508-brc14-active-revision-admission.md`, `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md`, and `tasks/archive/notes-20260908-1508-brc14-active-revision-admission.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-1508-brc14-active-revision-admission.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert code without rewriting immutable observations or budgets

## Captured Planning Output

# BRC14 formal revision observation and active admission

## P1/P2/P3
The accepted history producer at Oracle a33e5edb and harness decoder at integration 01325a31 exist. Pre-active observation still saves revision_evidence=unavailable and SSE only; requireCampaignActiveAdmission has no identity parameters and always refuses. Existing anchored grant, immutable request/result store and observed usage ledger are the authorities to compose. Each active caller already owns an intent; completed worker replay and planning failure closeout intentionally bypass the new-work guard.

Flow: anchored grant -> immutable observation request -> budget reservation -> browser history -> immutable protocol-2 result -> observed budget settlement -> identity-bound active guard -> existing intent/action checks.

Add a pure core protocol owner for strict request/result validation and evidence derivation, used by observation settlement and active admission. Preserve raw history and recompute its proof against exact prompt/answer/provider/session/profile/connector/repository/ref/commit. Reject old protocol/results; no migrations, receipt upgrades, fallback reads or inferred revision. Prompt requests commit and target ref tool reads and one JSON answer, avoiding citation stripping mismatches. The answer itself never owns revision authority.

Gate accepts repo root and existing intent, loads current campaign and anchored grant, validates current lifecycle/group/baseline and active policy, exact request/result bindings, same grant's real budget, and readAutomationUsageForResult observed settlement using its explicit read-only mode (fleet Offer projection must not repair budget current state). The latter verifies the actual stored reservation against the embedded value and exact observed-result evidence ref. Verify observe_revision operation/request identity and no authoring intent/step in that reservation. Budget closed/stopped/expired or unresolved observation refuses new active work; it does not prevent existing result settlement/replay. Later groups use the prior accepted audit baseline; bootstrap only proves the initial campaign revision. No grant or budget is minted by the gate.

Scope exceeds eight files due one cross-module invariant: core observation protocol, observation effect, active gate, adoption/planning/capacity/acquisition/worker callers and fleet offer projection and named tests. No new dependency, CLI command, service, flag or credential. Private local evidence remains host-trusted; content hashes are integrity, not outside-machine attestations. At 10x history volume the existing byte/page bound fails closed. Rollback reverts implementation and rejects new records on old code; old records remain unchanged.

## Task Breakdown
- [x] Add strict protocol-2 observation request/result validation, same-session capture and persist-before-settle producer.
- [x] Bind active entrypoints to exact campaign/intent/grant/history and real observed ledger settlement, preserving recovery paths.
- [x] Test positive formal observation, unavailable/legacy/cross-identity/corrupted/unsettled evidence, budget stop, later group binding and protected callers without real providers.
- [x] Freeze and run focused verification, TypeScript and six repository integrity checks; independent semantic review and archive with no main merge or whole-sprint completion.

## Verification
Named tests: campaign-revision-observation, campaign-revision-admission, campaign-fresh-audit, issue-batch-adoption, campaign-planning, campaign-capacity, campaign-acquisition, campaign-worker, development-campaign-store; CLI development-campaign; TypeScript. Six required integrity checks include init dry-run; adoption fixture apply is covered by issue-batch-adoption effect tests. No full suite: named authority, ledger, replay, provider and transaction boundaries cover the changed behavior. Preserve previous package evidence as original-subject baseline only.

## Exclusions
No real GPT call, new grant/budget, GitHub write, active campaign launch, release/global install, main WIP change or BRC6a probe. BRC14 and BRC15 stay pending until real acceptance. This implements an evidence-enforcing guard, not an activation grant. The user's continue instruction authorizes this previously identified model-free slice; it does not authorize model calls or active canary.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Add strict protocol-2 observation request/result validation, same-session capture and persist-before-settle producer.
- [x] Bind active entrypoints to exact campaign/intent/grant/history and real observed ledger settlement, preserving recovery paths.
- [x] Test positive formal observation, unavailable/legacy/cross-identity/corrupted/unsettled evidence, budget stop, later group binding and protected callers without real providers.
- [x] Freeze and run focused verification, TypeScript and six repository integrity checks; independent semantic review and archive with no main merge or whole-sprint completion.
