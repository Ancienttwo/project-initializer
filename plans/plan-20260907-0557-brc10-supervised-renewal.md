# Plan: BRC10 campaign supervised Lease renewal

> **Status**: Executing
> **Created**: 20260907-0557
> **Slug**: brc10-supervised-renewal
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260907-brc10-readiness.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260907-0557-brc10-supervised-renewal.md`; after execution revert branch `codex/brc10-supervised-renewal` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md`
> **Task Review**: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md`
> **Implementation Notes**: `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md`

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

- Active plan: `plans/plan-20260907-0557-brc10-supervised-renewal.md`
- Sprint contract: `tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md`
- Sprint review: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md`
- Implementation notes: `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260907-0557-brc10-supervised-renewal.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260907-0557-brc10-supervised-renewal.md`.

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
- Contract file: `tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md`
- Review file: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md`
- Implementation notes file: `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260907-0557-brc10-supervised-renewal.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260907-0557-brc10-supervised-renewal.md`; after execution revert branch `codex/brc10-supervised-renewal` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260907-0557-brc10-supervised-renewal.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md`, `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md`, and `tasks/notes/20260907-0557-brc10-supervised-renewal.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260907-0557-brc10-supervised-renewal.md`; after execution revert branch `codex/brc10-supervised-renewal` or the explicitly reviewed diff.

## Captured Planning Output

## Goal

Wire campaign dispatch to existing generation-fenced Lease renewal while the actual bounded child runs, and persist truthful supervisor evidence for later recovery. This independently useful BRC10 slice does not complete BRC10 or authorize reclaim.

## P1/P2/P3 and decisions

Existing authority: campaign-acquisition stores a real WorkEnvelope/ClaimActor; campaign-worker persists launch before the standalone contract-run child, and final before budget/attempt settlement. contract-run currently spawnSync-waits on the bounded runner, so it cannot renew concurrently. Existing renewLeaseLiveness already owns generation CAS and append-only renewal persistence. Extend these paths rather than adding a runner/store.

Add optional historical `liveness_policy` to the campaign authorization type, validated by the existing LeaseLivenessPolicy validator when present. New active acquisition and dispatch require the explicit policy before any new budget/claim/child effect. No default or historical rewrite. Fixtures use an explicit policy with 1000ms interval and 6000ms TTL.

After budget admission, persist the launch and a stable per-role runtime identity before its first renewal/spawn. The callback revalidates parent authorization, Engineer binding, ClaimActor and actual current Lease, then consumes the existing liveness current CAS. A failed callback aborts the supervised child and prevents the verifier; open reservation and launch remain reconciliation-required. Timer renewal uses the granted interval/TTL, not budget values. Final replay launches nothing and does not invent renewals. Existing renewal fsync recovery failures remain explicit attention; this slice does not guess unprojected state.

Make bounded runChild asynchronous using Node child_process.spawn; preserve the existing bounded supervisor, argv, deadline, output artifacts and timeout semantics. Await the two existing call sites. Campaign renewal is an explicit lifecycle callback; other contract runs retain their behavior. Stop timers on every completion/error path. On callback failure signal the wrapper so it forwards cancellation to its owned group; do not settle successful final or dispatch the verifier.

The bounded supervisor adds `process_group_quiescence` with explicit scope and state (`quiescent`, `active`, `unknown`). POSIX absence observed after child completion may prove its owned process group quiescent. Remaining descendants, denied/failed observation and unconfirmed forced termination cannot. Windows emits unsupported/unknown; this is not remote-provider or escaped-descendant proof. Carry the supervisor fields into the stored child observation, without converting them into provider inactivity or automatic reclaim.

Data flow: campaign authorization -> acquired handoff -> launch/effect identity -> asynchronous bounded runner <-> fenced Lease renewal -> child observation -> existing final/settlement. Existing Task and campaign locks retain their direction; no Task-lock callback acquires campaign lock. At 10x tasks synchronous evidence validation can delay timer service; delayed renewal remains a safety refusal, not a reason to weaken fences.

## Scope and file inventory

Expected more than eight files including tests and generated mirrors: src/core/automation/budget.ts; src/effects/automation/campaign-acquisition.ts; src/effects/automation/campaign-worker.ts; scripts/contract-run.ts; scripts/run-bounded-verifier-command.ts; their assets/templates/helpers mirrors; tests/helpers/campaign-acquisition-fixture.ts; tests/effects/campaign-acquisition.test.ts; tests/effects/campaign-worker.test.ts; a focused supervisor test; docs/researches/20260907-brc10-supervised-renewal.md; architecture projection and owning workflow artifacts. No new dependency, command, daemon or persistence root. The sole new test file covers real supervisor lifecycle; the new research document records this independent acceptance boundary.

Exclude automatic reclaim/rebinding, provider transport mediation, BRC13–15, shared campaign-boundary prose and policy inference. Preserve dirty acquired work and all immutable journals. Rollback stops dispatch and reverts source without altering stored records; new authorization fields remain historical evidence, not rewritten values.

## Acceptance

1. A real acquired worker running longer than two renewal intervals produces multiple generation-bound renewals while alive; source/helper mirror replay still launches once.
2. Missing or malformed explicit policy refuses before claim/dispatch effects; historical grants remain inspectable. Old generation, changed binding and revoked authority refuse renewal.
3. Renewal loss during a real child cancels via the supervisor, leaves unresolved launch/reservation for reconciliation, and never launches its verifier.
4. POSIX leader exit with a surviving descendant does not report quiescent early. Deadline/forced-termination observation is truthful. Windows emits unknown without a fake positive.
5. Existing BRC9 budget/attempt/retry and contract-run behavior remains green. No receipt from this slice is used to assert remote-provider terminal or reclaim eligibility.

## Verification and delivery

Focused tests: tests/effects/campaign-worker.test.ts, tests/effects/campaign-acquisition.test.ts, tests/contract-run.test.ts, the new supervisor test and existing lease-liveness unit/store tests; typecheck; helper-source parity; root SQL, architecture, task-sync, strict workflow, project-state and init dry-run checks. Freeze code and target for one canonical prepare-acceptance, one semantic review and canonical finish. Use changed-path exact-context reuse for deterministic checks. No unconditional local full suite; PR required CI supplies the integration gate. Then authorized PR merge/main readback. Whole BRC10 remains pending in the Sprint.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] Execute captured plan: BRC10 campaign supervised Lease renewal
