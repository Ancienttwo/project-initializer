> **Archived**: 2026-09-06 16:25
> **Related Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-1625
> **Archive Projection V1**: `plans/plan-20260906-0401-brc8-bounded-worker-acquisition.md` => `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/notes/20260906-0401-brc8-bounded-worker-acquisition.notes.md` => `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0401-brc8-bounded-worker-acquisition.contract.md` => `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0401-brc8-bounded-worker-acquisition.review.md` => `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`

# Plan: BRC8 — Acquire-next 与有界并行 worker 控制

> **Status**: Archived
> **Created**: 20260906-0401
> **Slug**: brc8-bounded-worker-acquisition
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC8 — Acquire-next 与有界并行 worker 控制（消费 #280）
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Canonical acquire-next ordering, real campaign Lease concurrency and authenticated WorkEnvelope handoff; focused regression and repository integrity checks
> **Rollback Surface**: Revert BRC8 integration without changing existing Lease records, WorkEnvelopes or BRC6/BRC7 authority
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Task Review**: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC8 — Acquire-next 与有界并行 worker 控制（消费 #280）
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`
- Sprint contract: `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
- Sprint review: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`
- Implementation notes: `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`.

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
- Contract file: `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
- Review file: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`
- Implementation notes file: `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert BRC8 integration without changing existing Lease records, WorkEnvelopes or BRC6/BRC7 authority
- **Verification boundary**: Canonical acquire-next ordering, real campaign Lease concurrency and authenticated WorkEnvelope handoff; focused regression and repository integrity checks
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`, `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`, and `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert BRC8 integration without changing existing Lease records, WorkEnvelopes or BRC6/BRC7 authority

## Captured Planning Output

## Goal

Connect the adopted repair campaign to existing authenticated Engineer acquire-next and hand one real acquired WorkEnvelope to the local host, enforcing the campaign-wide max_parallel_tasks bound at the common Fleet claim boundary.

## Authority and P1/P2/P3

P1: BRC6 immutable canonical adoption manifests own campaign Task membership; BRC7 admission and TaskOffer own readiness; EngineerOffers owns ordering, eligibility and capability concurrency; Fleet acquire owns the existing claim/worktree/bind/token/projection/envelope chain. Engineer principal and ClaimActorReceipt own actor binding. No prompt creates ownership. #280 is already landed (9f86aaf5) and #278 dispatch fence is landed (b62e6a07).

P2: campaign step reads the published intent and BRC7 planning result. Only an explicit execution authorization input selects the execution handoff path. Resolve the existing issued Engineer authorization with resolveEngineerPrincipal, restrict acquire-next candidates to immutable adopted task IDs, then preserve its canonical order. The common Fleet acquire boundary revalidates campaign authority and counts current non-released Lease records while holding one campaign lock, before invoking the existing task claim. After claim, existing Fleet provisioning and Engineer ClaimActorReceipt publication remain unchanged. Return the real acquisition plus dispatch instructions to the local host. The controller never spawns a worker.

P3: preserve off/shadow and manual-merge policy, exact task/plan/source admission, current Engineer authorization and existing task election. Add no dependency, second scoring rule, lease schema, root lifecycle command or persistent capacity counter. A campaign-scoped mutex serializes only admission checking and claim; Lease remains the count and ownership authority. Lock order is existing acquire-next key -> capability -> Engineer binding -> campaign admission -> task claim; capacity readers acquire no earlier lock. At 10x scale, canonical membership and lease scanning under the admission lock costs more; retain the simple exact scan until measured latency justifies a deterministic projection. Unknown/corrupt authority fails closed. Unreleased leases retain capacity; automatic expiry/takeover is outside BRC8.

## Scope

- Consume existing acquire-next rather than implement a second scheduler.
- Add an internal exact task_ids filter to AcquireNextFiltersV1, with closed validation, deterministic canonical normalization, and inclusion in its existing request digest. Empty list selects no task; ordering remains EngineerOffers order. Existing callers without a filter retain their behavior.
- Add a campaign capacity admission effect used by common Fleet acquisition, covering direct Fleet and Engineer entrypoints as well as campaign handoff. Discover membership from canonical manifests and immutable publication authority; missing local authority for a canonical member blocks. Validate all published groups for the same campaign and count unique current claimed/bound/non-released Task leases across them, including leases owned by other Engineers. Bound is the authorized max_parallel_tasks constrained by canonical policy. Noncampaign acquisition follows its existing path.
- Extend campaign step with optional --authorization-id for one explicit execution handoff. It is mutually exclusive with --planning-result. Without it, preserve BRC7 planning behavior. With it, validate local host/session ownership and current campaign authority, resolve the existing authenticated Engineer principal, and acquire only ready members of that exact group. Do not invoke planning mutation before the execution acquisition. In off mode reject; in shadow do not acquire or emit executable handoff. No eligible offer or capacity full returns a normal idle outcome; invalid/stale authority and conflicting keys remain typed failures.
- Reuse acquire-next idempotency storage with a deterministic campaign/intent/key namespace. The request digest must bind the exact principal and immutable membership. Same key resolves the same acquisition and cannot be repurposed for a different request. Before rendering an executable replay, validate the existing live ClaimActorReceipt/envelope authority; lost ownership blocks replay, never triggers a second acquisition.
- Handoff output contains the original WorkEnvelope and ClaimActorReceipt plus instructions to use the existing contract-worktree/ship-worktrees flow, obey its allowed_paths, and stop on lost authority. Dispatch instructions are not an ownership substitute. Reuse the existing standalone/local-host task packet boundary owner; do not duplicate EXECUTION_BOUNDARY text in another packet layer.

## Non-scope

BRC9 budget/attempt reservations, BRC10 liveness/recovery, provider dispatch services, autonomous loops, automatic merge, new root lifecycle commands, planner semantic inference, Task/Lease/Acceptance/Publication schema changes, and any change to BRC6 materialization authority. Default remains off and campaign operation remains manual. No new credential/account/config setup: execution uses an already-issued Engineer authorization; missing authorization is rejected.

## Data flow

    canonical manifest + BRC7 proof
                  |
    campaign step --authorization-id
                  |
    EngineerOffers -> existing acquire-next -> scheduled acquire
                  |
    Fleet revalidation -> campaign admission lock + Lease count -> Task claim
                  |
    fresh worktree -> bind -> token -> contract -> WorkEnvelope
                  |
    ClaimActorReceipt -> local host handoff -> existing worker flow

## Task Breakdown

- [x] Add exact membership filtering to acquire-next and prove canonical ordering, empty selection, malformed filter and same-key conflict behavior.
- [x] Implement common Fleet campaign capacity guard with shared campaign membership authority and real cross-process lease tests.
- [x] Wire explicit campaign execution handoff to authenticated acquire-next and existing live actor/envelope verification; cover off/shadow, idle, replay and stale authority.
- [ ] Run focused behavior and repository-integrity checks, update architecture and research authority, freeze implementation and prepare canonical acceptance once; close only with a valid typed receipt and installed contract-worktree finish.

## Files and abstraction budget

Expected scope exceeds eight files: src/effects/engineers/scheduling-acquire-next.ts, src/effects/fleet/acquire.ts, src/cli/commands/campaign.ts; new src/effects/automation/campaign-acquisition.ts and src/effects/automation/campaign-capacity.ts; existing campaign-planning-proof.ts only if extracting observed membership reuse; tests/unit/issue-280-acquire-next.test.ts, tests/effects/campaign-acquisition.test.ts, tests/fleet-acquire-concurrency.test.ts, tests/cli/campaign-planning.test.ts and existing fixture helpers; docs/researches and architecture projections plus this work-package's workflow artifacts. The two new effects separate local-host orchestration from the lower-level capacity guard so Fleet does not depend on orchestration that imports Fleet transitively. No new core protocol module unless a concrete shared closed result type requires it. No new dependencies or services.

## Verification

Use focused named suites for acquire-next, Engineer scheduling concurrency, Fleet concurrency, campaign effects and CLI. Real fixtures must include canonical adoption, planning admission, Git common state, issued Engineer principals, and actual claims rather than fabricated envelopes. Prove: priority preserved after exact campaign filtering; no foreign task; two-process same task has one owner; two Engineers/different capabilities at max_parallel_tasks=1 produce at most one live claim; campaign-wide cross-group cap; same capability serial; released Lease frees capacity; non-released/unknown lease cannot be treated as free; direct Fleet cannot bypass cap; replay returns same acquisition; mismatched principal/key fails; failed provisioning releases only its own claim; stale source/proof, stale principal and lost actor receipt block; off/shadow no acquisition; no eligible normal exit. Run type/state-boundary checks and all six root integrity checks. No full suite by default: these named entrypoint/concurrency tests cover this bounded integration; retain BRC7's canonical full-suite identity as baseline, never label it a BRC8 full pass. Any uncovered cross-module risk must be stated before expanding the gate.

## Rollback

One independent commit/work-package. Revert the BRC8 connection and capacity guard; no persisted schema migration or counter cleanup. Existing acquired WorkEnvelopes and Lease ownership remain under their existing release/finish paths. Do not delete active leases, worktrees, BRC6 manifests or BRC7 admission evidence.

## Acceptance boundary

BRC8 begins after BRC7 canonical merge. Parent owns implementation and acceptance integration; no new external review is implicitly dispatched during planning. BRC9/BRC10 remain explicit follow-on sprint rows, not hidden partial implementations in BRC8.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Add exact membership filtering to acquire-next and prove canonical ordering, empty selection, malformed filter and same-key conflict behavior.
- [x] Implement common Fleet campaign capacity guard with shared campaign membership authority and real cross-process lease tests.
- [x] Wire explicit campaign execution handoff to authenticated acquire-next and existing live actor/envelope verification; cover off/shadow, idle, replay and stale authority.
- [ ] Run focused behavior and repository-integrity checks, update architecture and research authority, freeze implementation and prepare canonical acceptance once; close only with a valid typed receipt and installed contract-worktree finish.
