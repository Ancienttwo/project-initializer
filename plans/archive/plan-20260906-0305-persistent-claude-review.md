> **Archived**: 2026-09-06 04:23
> **Related Plan**: plans/archive/plan-20260906-0305-persistent-claude-review.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260906-0423
> **Archive Projection V1**: `plans/plan-20260906-0305-persistent-claude-review.md` => `plans/archive/plan-20260906-0305-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/notes/20260906-0305-persistent-claude-review.notes.md` => `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0305-persistent-claude-review.contract.md` => `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0305-persistent-claude-review.review.md` => `tasks/archive/review-20260906-0423-persistent-claude-review.md`

# Plan: Persistent Claude acceptance review in tmux

> **Status**: Archived
> **Created**: 20260906-0305
> **Slug**: persistent-claude-review
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: docs/researches/20260906-tmux-claude-review-lifecycle.md
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Persistent provider lifecycle and exact AcceptanceReceipt integration
> **Rollback Surface**: Owned reviewer process cleanup and revert of this work-package diff
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
> **Task Review**: `tasks/archive/review-20260906-0423-persistent-claude-review.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-0423-persistent-claude-review.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: docs/researches/20260906-tmux-claude-review-lifecycle.md
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-0305-persistent-claude-review.md`
- Sprint contract: `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
- Sprint review: `tasks/archive/review-20260906-0423-persistent-claude-review.md`
- Implementation notes: `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-0423-persistent-claude-review.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-0305-persistent-claude-review.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-0305-persistent-claude-review.md`.

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
- Contract file: `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
- Review file: `tasks/archive/review-20260906-0423-persistent-claude-review.md`
- Implementation notes file: `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-0423-persistent-claude-review.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-0305-persistent-claude-review.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Owned reviewer process cleanup and revert of this work-package diff
- **Verification boundary**: Persistent provider lifecycle and exact AcceptanceReceipt integration
- **Review/acceptance boundary**: `tasks/archive/review-20260906-0423-persistent-claude-review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-0305-persistent-claude-review.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-0423-persistent-claude-review.md`, `tasks/archive/review-20260906-0423-persistent-claude-review.md`, and `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-0423-persistent-claude-review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Owned reviewer process cleanup and revert of this work-package diff

## Captured Planning Output

## Goal

Make tmux a required repo-harness runtime capability and deliver a host-managed persistent Claude acceptance reviewer: two or more bounded rounds in the same process/session, exact subject and evidence binding, explicit interrupted/ambiguous state, and cleanup after acceptance or explicit cancellation.

## P1 Map

The advisory cross-review command is one-shot and admits Codex providers. AcceptanceReceipt in scripts/acceptance-receipt.ts already supports Claude policy v1 and owns semantic acceptance, verification fingerprinting and projections. The tmux runtime adapter only sends bounded notifications to existing endpoints. Reuse these authorities without turning the adapter or pane state into acceptance or scheduling authority.

## P2 Trace

claude-review round --contract <path> --verification <prepared-checks> resolves the existing acceptance context, freezes contract/goal/subject/verification digests, admits one task-scoped reviewer session, and submits a numbered request to its owned tmux host. The host feeds a persistent Claude stream-json child and saves the provider result. The caller revalidates exact context and records the provider verdict through recordAcceptance, then projects the existing review artifact. A rejected round keeps the child alive; a next changed-subject round continues that same session. close verifies the current passing AcceptanceReceipt before shutdown; cancel records cancellation before shutting down without acceptance.

## P3 Decisions

- Add one public command family, claude-review round/status/close/cancel. Keep the existing advisory cross-review behavior and its single-shot budget unchanged. Claude session creation consumes the existing work-package semantic-review admission; same-session repair rounds are bounded to three, never silently respawned or replayed.
- Add pure response schema/validation, a host/session effects boundary and a narrow CLI. Use built-in Bun/Node streams, Unix socket or persisted request/result transport, child_process and existing directory locking. No new package dependency, provider fallback, scheduler, generic tmux executor or screen parser.
- Host state is task/worktree scoped and stored under existing ignored runtime evidence. Persist exact owned tmux server/pane and host/child process identities plus provider session ID. A live pane or reused PID alone cannot authorize continued submission or cleanup.
- Reviewer runs read-only with only explicitly allowed read tools, no writable tools, no inherited MCP servers/hooks/skills. It receives frozen review context and current source/diff evidence, with the current repo subject checked again after response. Context reuse never reuses an old verdict.
- Extend the existing acceptance writer with an optional exact expected-context fence used by this provider. Keep policy/disposition/verifier rules and the single protected receipt authority intact.
- Timeout, malformed/absent result, wrong identities, changed subject/evidence, concurrent/duplicate request, or lost process fail closed and remain observable. No automatic retry after potentially delivered input. Explicit cancel is available after failures.
- tmux detection is required for both host readiness profiles. Missing or unusable executable fails strict readiness; document installation without modifying user package managers.
- At 10x tasks, idle provider memory and unknown delivery become the first pressure points. This slice bounds one session per task and three rounds; existing budgets remain authoritative. No automatic worktree/board/recovery integration in this slice.

## File Changes

- src/core/review/claude-review.ts: closed protocol, response schema, exact result validation.
- src/effects/review/claude-review-session.ts and claude-review-host.ts: task identity, owned tmux lifecycle, persistent child, durable request/results, interruption/cleanup.
- src/cli/commands/claude-review.ts and src/cli/index.ts: round/status/close/cancel and session admission.
- scripts/acceptance-receipt.ts and assets/templates/helpers/acceptance-receipt.ts: reuse acceptance context and reject expected-context drift before writing.
- scripts/check-agent-tooling.sh and assets/templates/helpers/check-agent-tooling.sh: required tmux capability and strict readiness gate.
- tests/claude-review.test.ts, tests/acceptance-receipt.test.ts, tests/check-agent-tooling.test.ts: lifecycle/failure/receipt/readiness regressions; fixture provider only for deterministic tests.
- assets/skills/repo-harness-cross-review/ and assets/reference-configs/external-tooling.md: documented canonical Claude acceptance session entry and dependency, synced projections where managed.
- docs/spec.md, docs/researches/20260906-tmux-claude-review-lifecycle.md, tasks/ and plan artifacts: stable boundaries, proof and workflow closure. Architecture-owned projections only as required by changes.

## Verification

Named focused tests for session lifecycle, receipt and tooling plus bun run check:type, helper/reference drift checks and the six root integrity checks. Run one live fixture with the production CLI/host through two provider turns, real prepared evidence/AcceptanceReceipt, stale-subject rejection and precise cleanup. Reuse the previous experiment only for its original CLI protocol proof; it is not acceptance of this implementation. No full test suite: process/receipt/tooling impact has named coverage. Freeze implementation before final verify-sprint --prepare-acceptance. Review consumes that evidence, followed by final verify-sprint and contract-worktree finish. Preserve unrelated dirty main changes and do not merge without the normal protected gate.

## Rollback

Cancel only owned reviewer resources, retain request/result evidence, then revert this work-package diff. No data migration or writes to user tmux configuration. Existing Task/Lease/Binding and acceptance formats retain their authority.

## Task Breakdown

- [x] Implement required tmux readiness with missing/unusable executable regressions.
- [x] Implement persistent Claude session rounds, exact identity/context fences and existing acceptance recording.
- [x] Cover two-round reuse, failure/ambiguous/concurrent/stale inputs, and exact close/cancel cleanup.
- [x] Run focused and integrity checks plus the live two-round production-path acceptance fixture.
- [x] Promote durable documentation and prepare the single-review acceptance packet and protected closeout commands.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->
