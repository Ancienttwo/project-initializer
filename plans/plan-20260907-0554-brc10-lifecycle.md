# Plan: BRC10 campaign lease liveness and controller recovery

> **Status**: Draft
> **Created**: 20260907-0554
> **Slug**: brc10-lifecycle
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC10 — Lease liveness 与 controller recovery（消费 #286）
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260907-0554-brc10-lifecycle.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260907-0554-brc10-lifecycle.md`; after execution revert branch `codex/brc10-lifecycle` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-0554-brc10-lifecycle.contract.md`
> **Task Review**: `tasks/reviews/20260907-0554-brc10-lifecycle.review.md`
> **Implementation Notes**: `tasks/notes/20260907-0554-brc10-lifecycle.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC10 — Lease liveness 与 controller recovery（消费 #286）
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260907-0554-brc10-lifecycle.md`
- Sprint contract: `tasks/contracts/20260907-0554-brc10-lifecycle.contract.md`
- Sprint review: `tasks/reviews/20260907-0554-brc10-lifecycle.review.md`
- Implementation notes: `tasks/notes/20260907-0554-brc10-lifecycle.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-0554-brc10-lifecycle.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-0554-brc10-lifecycle.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-0554-brc10-lifecycle.md`.

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
- Contract file: `tasks/contracts/20260907-0554-brc10-lifecycle.contract.md`
- Review file: `tasks/reviews/20260907-0554-brc10-lifecycle.review.md`
- Implementation notes file: `tasks/notes/20260907-0554-brc10-lifecycle.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-0554-brc10-lifecycle.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-0554-brc10-lifecycle.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260907-0554-brc10-lifecycle.md`; after execution revert branch `codex/brc10-lifecycle` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260907-0554-brc10-lifecycle.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260907-0554-brc10-lifecycle.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-0554-brc10-lifecycle.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-0554-brc10-lifecycle.contract.md`, `tasks/reviews/20260907-0554-brc10-lifecycle.review.md`, and `tasks/notes/20260907-0554-brc10-lifecycle.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-0554-brc10-lifecycle.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260907-0554-brc10-lifecycle.md`; after execution revert branch `codex/brc10-lifecycle` or the explicitly reviewed diff.

## Captured Planning Output

## Goal and completion boundary

Complete the Sprint BRC10 row after BRC9 and PR #336: current-owner renewal while the actual campaign child runs; evidence-gated reclaim; and crash recovery from the existing append-only campaign records without another owner or duplicate child. Successful prerequisite tests alone cannot close BRC10.

## P1 — Observed map

`campaign-acquisition.ts` owns budget-before-acquire and stores the actual acquired WorkEnvelope/ClaimActor handoff. `campaign-worker.ts` validates that handoff, persists launch before spawn, and records child observations/final before settling budget and attempts. `scripts/contract-run.ts` executes both children synchronously, preventing an in-process renewal timer. `run-bounded-verifier-command.ts` supervises the POSIX process group but currently returns no typed quiescence evidence. Its Windows group probe cannot prove tree termination.

`coordination-lease-liveness-store.ts` already owns append-only renewals, generation CAS and deterministic current projections. `coordination-lease-reclaim.ts` consumes five evidence fields under the existing Task lock and uses the existing steal transition. Steal returns a new reserving Lease. Ordinary Fleet acquire requires an available task and creates another worktree; it cannot resume that reserving Lease.

## P2 — Concrete flow and crash boundaries

Authorization and parent identity -> acquisition budget reservation -> real acquired handoff -> dispatch launch and runtime identity -> supervised worker/verifier with fenced renewals -> durable terminal observations -> attempt final -> budget settlement.

Recovery reads those exact records and current authority. A launch with no verifiable terminal observation stays attention. A stored final can finish settlement without launching either child. Reclaim first persists a generation-bound intent with a preselected new claim ID; after the existing steal transition, recovery resumes only that exact reserving/bound generation, writes the token and ClaimActor, and records the recovered envelope. Crashes after intent, steal, bind, token or actor publication replay their exact durable identities. Any foreign generation or changed authority stops recovery.

## P3 — Direction and invariants

Use existing Lease, budget and campaign journal authorities; add no scheduler, daemon or parallel persistence root. Keep Task election in its existing lock. Campaign records are written outside Task-lock callbacks; recovery must not invert existing binding/campaign/Task lock order.

Add an explicitly granted liveness policy to campaign authorization. Historical grants remain readable without synthesized defaults; new execution requires a validated policy before acquisition or dispatch effects. Renewal uses its interval and TTL, current Task/Claim/generation/binding, and an effect identity durably recorded before spawn.

Make the bounded child path asynchronous so the owner can renew during execution. A failed renewal cancels through the existing supervisor and suppresses the next child. Persist typed process-group quiescence and scope from the supervisor's actual observation; unsupported Windows tree proof, missing receipts and termination-confirmation timeout remain unknown. Leader exit, PID absence, deadline expiry and sending SIGKILL are never positive quiescence evidence.

Create an internal `resumeReclaimedFleetLease` boundary using existing Fleet post-claim authority/topology checks, bind, token writer and Engineer ClaimActor builder. It accepts only the exact journal-authorized new generation and original worktree/branch/unit. It does not claim, provision, project the plan again or execute a child. Keep old historical receipts immutable.

Active provider operations and completing/reviewing publication preserve ownership. Remote-provider terminal state must come from its owning producer, never from local child exit. Missing provider authority yields unknown/attention. The source investigation confirmed that `campaign-provider-execution.ts` records terminal outcomes only for GitHub adapter calls, while standalone child execution reserves `provider: null` and does not register its internal provider operations. `AgentRuntimeEffectV2` currently covers notify/wake operations, not this child. Before this plan becomes Approved, the parent must settle how the actual invocation boundary supplies evidence; the current arbitrary shell command cannot be treated as an observed provider transport. This is a design dependency, not permission to insert a caller-supplied boolean, parse stdout, or add a fixture-only success path. Renewal and journal replay can proceed in a separately accepted slice while full BRC10 remains incomplete.

At 10x tasks the first bottleneck is serial filesystem evidence validation and lock hold time. Do not cache ownership authority to improve throughput. Rollback stops new campaign dispatch and retains all journals; reverting source must not rewrite historical grants, Lease records or external effects.

## Scope inventory

Expected to exceed eight files. Owning sources: `src/core/automation/budget.ts`, `src/effects/automation/campaign-acquisition.ts`, `src/effects/automation/campaign-worker.ts`, a campaign-specific liveness/recovery consumer in `src/effects/automation/`, `src/effects/fleet/acquire.ts`, `src/effects/engineers/acquire.ts`, `scripts/contract-run.ts`, `scripts/run-bounded-verifier-command.ts`, and generated helper mirrors. Existing state/core primitives change only if an observed recovery invariant requires it. One new campaign consumer is justified by acquisition, runner and recovery sharing the same journal identity; it creates no new authority.

Tests: existing campaign acquisition/worker and contract-run tests; new lifecycle and recovery integration tests with real local Task/Lease/budget/journal stores and bounded fake external operations; process supervisor regressions; existing #286 generation/classification tests. Dedicated research and workflow artifacts record acceptance. Keep shared campaign boundary prose untouched until accepted conclusions require promotion.

## Acceptance matrix

- Current owner renews more than once during a real long-running child. Old claim/generation/binding or revoked authority cannot renew; renewal failure stops further dispatch.
- Expired active provider, descendant process, completing/reviewing, missing terminal evidence and unsupported platform evidence cause attention or protected outcomes with no Lease mutation.
- All affirmative reclaim inputs derive from persisted real producer evidence. Two competing OS processes obtain exactly one new generation.
- Crash after renewal fsync, reclaim intent, steal, bind, token, actor receipt and final settlement recovers exact state. Old receipts cannot create another generation; worker/verifier invocation counters never increment on recovery.
- Recovery checks current canonical Task revision, authorization, binding, worktree topology and exact branch/unit before mutation. Dirty work remains preserved; stale/foreign state is not repaired opportunistically.
- Supervisor reports remaining descendants and unconfirmed termination truthfully; Windows unknown is covered separately from POSIX success.
- Existing BRC9 admission, complete-attempt reservation, transient retry and same-key settlement behavior remains covered.

## Verification and delivery

Use named focused tests for the affected runner, campaign, Fleet/Engineer and #286 boundaries, typecheck, helper mirror checks, and the six root repository-integrity commands. Freeze implementation and target before canonical `verify-sprint --prepare-acceptance`; deterministic unchanged criteria may be reused. Do not add an unconditional local full suite: CI supplies the required full integration gate. Final semantic review runs once for this work-package, followed by acceptance, canonical finish, publication-range task-sync binding, PR CI, authorized merge and main readback.

No provider credentials are required for local deterministic lifecycle verification. Real BRC15 Canary target/profile and BRC6a Connector revision attestation remain separate delivery requirements; they are not silently waived by BRC10 acceptance.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC10 campaign lease liveness and controller recovery
