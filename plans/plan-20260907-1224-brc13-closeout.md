# Plan: BRC13 Issue closure and exact cleanup

> **Status**: Executing
> **Created**: 20260907-1224
> **Slug**: brc13-closeout
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC13 — Issue closure 与 exact branch/worktree cleanup（人工 merge 之后）
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260907-1224-brc13-closeout.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260907-1224-brc13-closeout.md`; after execution revert branch `codex/brc13-closeout` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-1224-brc13-closeout.contract.md`
> **Task Review**: `tasks/reviews/20260907-1224-brc13-closeout.review.md`
> **Implementation Notes**: `tasks/notes/20260907-1224-brc13-closeout.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC13 — Issue closure 与 exact branch/worktree cleanup（人工 merge 之后）
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260907-1224-brc13-closeout.md`
- Sprint contract: `tasks/contracts/20260907-1224-brc13-closeout.contract.md`
- Sprint review: `tasks/reviews/20260907-1224-brc13-closeout.review.md`
- Implementation notes: `tasks/notes/20260907-1224-brc13-closeout.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-1224-brc13-closeout.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-1224-brc13-closeout.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-1224-brc13-closeout.md`.

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
- Contract file: `tasks/contracts/20260907-1224-brc13-closeout.contract.md`
- Review file: `tasks/reviews/20260907-1224-brc13-closeout.review.md`
- Implementation notes file: `tasks/notes/20260907-1224-brc13-closeout.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-1224-brc13-closeout.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-1224-brc13-closeout.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260907-1224-brc13-closeout.md`; after execution revert branch `codex/brc13-closeout` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260907-1224-brc13-closeout.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260907-1224-brc13-closeout.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-1224-brc13-closeout.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-1224-brc13-closeout.contract.md`, `tasks/reviews/20260907-1224-brc13-closeout.review.md`, and `tasks/notes/20260907-1224-brc13-closeout.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-1224-brc13-closeout.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260907-1224-brc13-closeout.md`; after execution revert branch `codex/brc13-closeout` or the explicitly reviewed diff.

## Captured Planning Output

# BRC13 Issue closure and exact cleanup

Scope: implement the existing Sprint BRC13 row after BRC10, under the user's continuing authorization for implementation, owner acceptance and PR merge. This package does not run a real campaign or take over unrelated worktrees. Existing Operator delivery Draft and research are separate owner artifacts.

## P1 — observed boundaries

The canonical campaign manifest and its adoption receipt own Task/slot/Issue identity. `requireCampaignPlanningAuthority` validates this join at canonical main. `createCampaignProviderExecutor` and the one budget store own provider read/comment/close admission and unknown outcomes. `reconcilePublication` owns the reviewing Lease release after exact publication and current target checks. It currently lacks actual Provider mergeCommit. `bindSprintCommand` is shared by ordinary Fleet acquisition and BRC10 exact recovery; this is the binding side of a worktree mutation barrier. The existing `contract-worktree cleanup` actuator performs local worktree then local branch deletion, but has no exact campaign topology/foreign Lease receipt or remote deletion phase.

## P2 — concrete closeout

An authorized local campaign parent supplies the existing dispatch selector. Resolve the original or persisted recovered WorkEnvelope and ClaimActor; match current reviewing publication and all canonical mapped Task identities. Persist each closeout intent before publication reconcile can remove its Lease. Never reconstruct lost Claim ownership from a branch name or completed Sprint row. Group tasks by adopted immutable Issue id, preserving every slot and task revision.

Observe actual merged PR metadata, including mergeCommit OID, with exact repository/head/base/publication identity. Fresh fetch the target and require that real merge OID is reachable from the fetched target. Pre-merge synthetic test merges, absorption alone, unreachable OIDs and changed publication identities cannot authorize completed Issue closure. Generic publication reconciliation remains the only owner of publication Lease release. It verifies actual mergeCommit reachability and persists the consuming campaign proof before release; historical generic integration observations keep their original schema.

Reobserve adopted Issue source before the first close mutation. Require every Task for an Issue to have valid merge evidence; explicit not_planned requires a committed structured decision and falsifier, both covered by the existing verified AcceptanceReceipt, and non-admitted not_reproducible planning outcomes for all mapped Tasks. Post-admission worker falsification remains a human-attention case. Persist exact comment and close intents before invoking the provider. Standalone existing reads cannot run while a mutation reservation is unresolved. Add explicit compound comment/close/ref-delete attempt operations to the same campaign budget authority: each reserves exactly two Provider calls before any effect, binds mutation plus mandatory readback request digests, and always performs one mutation followed by one verification read. Both phases have immutable started/result records. An unknown mutation uses only its already-reserved read phase; no new admission bypasses global stop, and no mutation is resent. A started read without a durable result remains unknown and blocks; it is not repeated. Known completion charges the two calls actually made; unresolved attempts retain the full reservation, with the existing explicit worst-case reconciliation path. Existing single-call heartbeat operations remain their own semantics, not aliases or fallback reads. A closed Issue must have the intended disposition and comment evidence.

After Issue closure, persist exact remote branch ref and expected OID. Delete only with expected-OID compare-and-delete; absent ref is idempotent only after an authoritative read. A moved branch refuses. Git remote mutation needs an explicit operation classification in the same budget ledger, not a disguised github_close charge.

Use one worktree topology mutation lock shared by final bind and local cleanup. Lock ordering is topology before Task; normal acquisition and recovered bind must pass through the same barrier. Under it, re-read exact worktree/branch/unit, all foreign Lease references, current main reachability and dirty status, then call the existing local cleanup actuator with exact expected inputs. Dirty work yields cleanup_blocked_dirty_worktree. The actuator returns structured phase receipts for worktree removal and local branch deletion; replay verifies identity and absence and never resets or force-cleans WIP.

Persist CampaignCleanupReceiptV1 only after all ordered phases: human merge, merge reachability, Issue closure, remote ref deletion, local worktree removal, local branch deletion. Any remaining phase keeps group cleanup_pending. Shared campaign lifecycle admission blocks next audit/group while cleanup is pending; CLI-only gating is insufficient.

## P3 — invariants and tradeoffs

Reuse the existing campaign planning journal for closeout records; no second state root, service, scheduler or task authority. Add one shared topology lock because both actual bind consumers and destructive cleanup must obey one cross-module invariant. Do not duplicate Task/Issue mapping or budget arithmetic. Validate closed input shapes and exact stored identities; missing authority is an explicit refusal. Preserve dirty and foreign worktrees and all historical evidence.

New modules may own the shared closeout receipt, the transaction consumer, and the shared topology lock; all other changes stay with existing publication, budget, Fleet/Engineer binding, campaign entrypoint and cleanup owners. At tenfold scale provider reads and serialized topology changes grow first; no speculative batching/cache is included. Rollback stops new closeout admissions and retains in-progress intents and external outcomes; it cannot reopen Issues or reconstruct deleted branches automatically.

## Required behavior checks

Focused regressions: premature/unreachable/drifted merge; old Claim and reconciliation_required handoff; multi-Task Issue partial completion; source Issue drift; falsifier disposition; unknown comment/close response with no second mutation; exact remote CAS and already-absent branch; crash after each irreversible phase; dirty/foreign Lease refusal; concurrent bind versus cleanup; cleanup_pending blocks group/audit. Reuse existing campaign, publication reconciliation, budget and cleanup fixtures. Include typecheck, six repository integrity checks and cleanup helper parity. No local full suite unless a named integration risk remains uncovered. Freeze code and target, canonical prepare once with baseline/delta reuse, one independent review, delegated owner acceptance, canonical finish and PR/main CI.

## Ownership exclusions

Do not edit Operator/Fleet board projections, agent-runtime-effect-store, the Multica research/Draft, unrelated shared main WIP, or BRC6a exact-SHA evidence semantics. This package cannot promote notification receipts or Provider turn completion into execution containment. BRC10 command-execution reclaim refusal stays intact.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC13 Issue closure and exact cleanup
