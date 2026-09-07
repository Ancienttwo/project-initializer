# Plan: BRC10 campaign lease liveness and controller recovery

> **Status**: Executing
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
> **Research**: `docs/researches/20260907-brc10-provider-terminal-readiness.md`; `docs/researches/20260907-brc10-readiness.md`
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

## Goal and authority

Complete BRC10 on main a3fb4db2, retaining the already accepted renewal implementation. User explicitly authorized autonomous implementation, acceptance and PR merge and corrected the mistaken decision to wait for an implementation interface. The parent owns the provider integration choice. No further approval is needed for this work-package.

## P1 and P2

The current campaign handoff owns exact Task/Claim/Lease/binding and existing planning journal identity. contract-run owns real child spawn. The bounded supervisor owns deadline and POSIX group observations. Existing Codex JSONL parsing owns typed thread/turn output for the read-only collaboration consumer. None of these alone proves a campaign invocation terminal state. Reclaim already uses the Task lock and the existing steal transition, but its reserving result has no Fleet resume consumer.

Data flow:

    tracked role configuration -> direct Codex invocation -> bounded supervisor
                 |                         |                       |
                 +-> campaign journal <--- typed terminal <-------+
                             |
                    dispatch admission fence
                             |
               existing reclaim/steal under Task lock
                             |
                 exact original-worktree Fleet rebind

## P3 and concrete direction

Add a typed Codex execution mode to existing contract-run: `--campaign-provider codex-exec` requires `--campaign-handoff` and excludes caller worker/verifier shell commands. Standalone explicit-command execution keeps its existing semantics and does not gain automatic positive provider-inactivity evidence. This is an explicit invocation choice, never availability fallback.

Use the current tracked `.codex/agents/fast-worker.toml` and `.codex/agents/gatekeeper.toml` for worker/verifier model, effort, instructions and sandbox. Read TOML with the installed runtime parser, check regular tracked source and expected workspace-write/read-only scopes, and bind exact configuration bytes. Discover the real Codex executable on host PATH and record canonical path, executable digest and reported version. Spawn it directly through the existing bounded supervisor with fixed exec/JSON/ephemeral/strict/ignore-user-config arguments, exact model/effort and the generated contract prompt. Do not change read-only delegated capability or claim Provider-native role identity. The worker prompt remains the sole execution-boundary injection owner.

The supervisor must support separate stdout/stderr capture for typed JSONL while preserving existing combined-log callers. The actual invocation records its identity and intended argv before spawn, then persists started and terminal observations in the existing campaign planning journal. Reuse the existing structured Codex JSONL parser, extending its result to expose thread identity and terminal event digest and reject invalid event ordering/incomplete operations. Parser consumers continue to read bytes captured by their real invocation boundary; arbitrary shell stdout is never admitted as Codex evidence. The terminal receipt binds dispatch/role/Claim/generation/binding, executable and role configuration, exact output digest, provider thread/terminal identity, exit/timeout and process-group scope. Unsupported or incomplete observations remain unknown. A completed provider turn and quiescent local group prove only the managed invocation's scope; unsupported remote operation evidence cannot become inactive.

Persist a dispatch retirement fence under the same campaign planning lock used to admit a child. Child admission checks that fence before recording started; renewal also refuses retired dispatches. Reclaim may fence a crashed controller without declaring its OS process dead: any already-started invocation still independently blocks takeover until its terminal evidence is present. A started record is written before the spawn side effect, so a crash in that gap remains unknown rather than incorrectly never-started. Arm an initial exact-generation liveness observation before admission; do not loosen renew's active-child constraint.

The reclaim observer consumes the retirement fence, all admitted invocation terminal records, current ClaimActor/binding/Lease, and current publication state. It computes the existing five evidence fields and revision from those persisted producers. Completing/reviewing, active effects, malformed data and unknown evidence never reach steal. It does not read the unrelated generic AutomationControllerRun as campaign authority.

Persist one reclaim intent with a preselected new Claim ID before invoking existing automaticReclaimLease. Replay uses that exact intent; foreign generation refuses. Implement restricted Fleet resume using the existing post-claim authority/topology checks, bindLeaseRecord, claim-token writer, ClaimActor producer and WorkEnvelope validator. Rebind the original worktree/branch/unit only; never acquire another Task, create/project a worktree, reset dirty source or spawn a replacement child during recovery. Preserve old receipts. A persisted final may settle once after exact authority rebind; missing final does not invent a successful result.

At 10x scale, journal scans and filesystem validation dominate. Preserve correctness under existing locks rather than caching ownership. No new service, dependency, scheduler or persistence root is needed. Rollback stops new typed dispatch/reclaim and retains all immutable evidence.

## File ownership and scope

This work-package intentionally spans more than eight files: existing campaign-worker/acquisition/planning store consumers, one campaign runtime evidence consumer, one campaign recovery consumer, Fleet/Engineer rebind boundaries, the existing Codex output parser, contract-run and bounded supervisor plus their helper mirrors, and focused unit/effect/runner tests. New files own shared invocation/recovery invariants; they are not parallel authorities. Workflow artifacts and dedicated BRC10 research document the final design. Do not change BRC13/14 product code in this package.

## Verification and delivery

Named checks cover typed real-process invocation, managed provider event parsing and identity joins, incomplete/failed/timed-out/foreign invocation refusal, raw-shell non-promotion, active/publication protection, never-started fencing, two OS reclaimers, and crash replay after intent/steal/bind/token/ClaimActor/final settlement without a duplicate child. Retain the existing renewal regression and BRC9 worker/acquisition/retry tests, plus Lease/Fleet/Engineer affected tests, typecheck, helper parity and all six integrity checks. Local fake provider executables exercise the actual process transport; use a bounded installed Codex smoke run in a disposable checkout to distinguish protocol integration from fake coverage. Existing Codex credentials are used by its own auth path; no credentials are requested or copied into repository artifacts.

Freeze implementation and target before canonical prepare; perform one semantic acceptance review, finish, bind publication evidence, and follow PR/main CI through authorized merge. CI supplies the full integration gate; do not duplicate it locally without an uncovered risk. BRC10 remains pending until the entire recovery matrix is accepted. BRC6a and real Canary execution remain subsequent work, not substitutes for this slice.

## Task Breakdown
- [ ] Implement and verify the real campaign invocation, lifecycle fence and reclaim/rebind recovery boundary; accept and merge BRC10.
