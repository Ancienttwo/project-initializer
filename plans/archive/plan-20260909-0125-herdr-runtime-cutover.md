> **Archived**: 2026-09-09 03:00
> **Related Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260909-0300
> **Archive Projection V1**: `plans/plan-20260909-0125-herdr-runtime-cutover.md` => `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/notes/20260909-0125-herdr-runtime-cutover.notes.md` => `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0125-herdr-runtime-cutover.contract.md` => `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0125-herdr-runtime-cutover.review.md` => `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`

# Plan: Replace tmux runtime dependency with herdr

> **Status**: Archived
> **Created**: 20260909-0125
> **Slug**: herdr-runtime-cutover
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`; after execution revert branch `codex/herdr-runtime-cutover` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
> **Task Review**: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`
> **Implementation Notes**: `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`

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

- Active plan: `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`
- Sprint contract: `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
- Sprint review: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`
- Implementation notes: `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260909-0125-herdr-runtime-cutover.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`.

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
- Contract file: `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
- Review file: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`
- Implementation notes file: `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`; after execution revert branch `codex/herdr-runtime-cutover` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`, `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`, and `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`; after execution revert branch `codex/herdr-runtime-cutover` or the explicitly reviewed diff.

## Captured Planning Output

## Decision and authorization

The owner approved freezing tmux integrations and implementing a herdr replacement. Deliver one atomic work-package: intermediate commits are development checkpoints, not independently released phases. Do not stop existing user sessions, enable disabled Agent Runtime policy, publish a release, or introduce a second scheduler.

## P1 — Map

The current main has three coupled surfaces: src/effects/engineers/agent-runtime-adapters/tmux-cli-agent.ts and its exact adapter/provider enums; src/effects/review/claude-review-session.ts plus claude-review-host.ts; scripts/check-agent-tooling.sh and generated global guidance in src/cli/commands/init.ts. Both readiness docs and README currently require tmux. Existing runtime adapter executors are tested host integration seams, not internally dispatched by a daemon. Do not invent a dispatcher. The review caller and host already own durable request/result files, provider stream-json, three-round budget, process ownership and AcceptanceReceipt.

## P2 — Trace

A notification's persisted intent produces a bounded opaque control_ref; the host resolves an endpoint and submits input, records transport observation, and existing message receipts remain authoritative. Replace tmux submission with explicit-server herdr agent.prompt and a bounded timeout. Successful submission is not message ACK; timeout/invalid response remains unknown and cannot trigger a blind replay.

A review round captures exact contract/goal/subject/evidence, starts one detached host in a managed terminal, submits files to that host, and receives validated provider stream-json before writing acceptance. Replace only terminal hosting and identity lookup with a dedicated owned herdr headless server and explicit pane. Keep the provider stdin protocol, cancellation/startup lock, identity fences and receipt checks. Old tmux session metadata is rejected, never interpreted as herdr; operators drain it using the previous installed version before upgrading.

## P3 — Decide

Use installed herdr 0.9.0 CLI/schema as minimum implementation target. Use explicit server/socket routing, server PID/start identity and pane process identity; never use UI focus or default current session. Use an isolated server per review, a private generated shell launcher for the existing Bun host, and generated config with update checks and restore disabled. Preserve current POSIX process-group requirement. A small shared herdr process/API helper is justified only for the two real consumers (review lifecycle and closed notification executor); no npm dependency is needed. Readiness requires a valid herdr version; missing/unusable herdr fails closed. Remove tmux variant authoring and automatic fallback from global guidance.

At 10x concurrency, per-review server/provider memory and startup cost fail before terminal IDs; retain existing budget/admission boundaries rather than add a scheduler. Rollback is a code revert after draining owned sessions; do not translate persistent endpoint or session identities. Legacy adapter policy needs explicit operator configuration update/rebinding; preserve off mode in the self-host policy. No automatic data migration or guessing provider values.

## File changes

More than eight files are necessary for one shared-contract cutover. Update src/core/engineers/{agent-runtime-effect,principal-claim}.ts, src/effects/engineers/{principal,agent-runtime-feature,agent-runtime-effect-store}.ts, src/cli/{commands/engineer,mcp/engineer-tools}.ts, src/core/adoption/standard-plan.ts, operator-web adapter unions/fixtures, the renamed herdr-cli-agent adapter, and their affected tests. Update both review modules and tests/claude-review.test.ts. Update scripts/check-agent-tooling.sh and its mirrored helper, global-working-rules/external-tooling reference sources and mirrors, init guidance renderer and focused tests, README.md, docs/spec.md, architecture module and a durable migration research note. Update .ai/harness/policy.json adapter key without enabling it. Keep workflow artifacts synchronized.

## Task Breakdown

- [x] Replace the closed notification adapter and exact public adapter/provider identifiers with herdr-cli-agent; verify bounded routing, explicit errors and ambiguous delivery semantics.
- [x] Replace review terminal hosting with owned herdr lifecycle; preserve same-process rounds, startup cancellation, process fences, stale/duplicate rejection, receipt-gated close and orphan cleanup.
- [x] Replace readiness prerequisite and peer guidance; remove tmux fallback authoring; document drain/rebind cutover and synchronize generated mirrors.
- [ ] Freeze implementation, run focused regressions and repository integrity checks, inspect real isolated herdr transport/cleanup, record acceptance, and finish the worktree through the existing gate.

## Verification design

Run named affected Bun tests for adapters, effect/provider contract, task-offer wake, engineer CLI/MCP, fleet/operator snapshots, required herdr readiness, global guidance and real herdr review lifecycle. Add deterministic mock-provider tests running under real herdr: same-child FAIL/repair/PASS, missing/wrong occupant, delayed startup/cancel, crash/deadline, lost host cleanup, server identity replacement, and sentinel isolation. Test notification malformed response/timeout without pretending a mock provider is real Claude/Codex. Use no paid provider turn except the existing required acceptance route. Run check:type and the six root integrity checks. Adoption default change requires dry-run and disposable fixture apply coverage using the existing TS operation model. No full suite is justified initially: named tests exercise each changed runtime/config contract. Any uncovered integration risk requires a recorded plan revision before expensive execution.

## Promotion Gate

- Merge/PR unit: one atomic tmux-to-herdr runtime, readiness and public-contract cutover.
- Rollback surface: revert this worktree's final commits after draining its owned sessions; existing user tmux processes remain untouched.
- Verification boundary: named transport, lifecycle, readiness, guidance, adoption and root integrity checks on the frozen worktree.
- Review/acceptance boundary: one current exact AcceptanceReceipt through the installed workflow.
- High-risk surface: cancellation can signal processes; retain exact PID/group/start/executable and server/pane ownership fencing.
- Why not checklist row: replacing a required runtime changes public contracts, persisted bindings and process cleanup across modules.

## Evidence Contract

- State/progress path: this plan Task Breakdown and associated contract/review; tasks/current.md remains a projection.
- Verification evidence: .ai/harness/checks and runs generated from the contract JSON Verification Plan.
- Evaluator rubric: no tmux execution/fallback in live product paths; herdr error/timeout does not invent ACK; owned cleanup never kills sentinel/unrelated processes; exact receipt remains necessary.
- Stop condition: three fail/fix/reverify rounds per issue, missing ownership facts, a second out-of-scope blocking fault, or required gate unavailable; preserve work and report exact evidence.
- Rollback surface: the isolated codex/herdr-runtime-cutover branch and task-owned disposable servers only.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Replace the closed notification adapter and exact public adapter/provider identifiers with herdr-cli-agent; verify bounded routing, explicit errors and ambiguous delivery semantics.
- [x] Replace review terminal hosting with owned herdr lifecycle; preserve same-process rounds, startup cancellation, process fences, stale/duplicate rejection, receipt-gated close and orphan cleanup.
- [x] Replace readiness prerequisite and peer guidance; remove tmux fallback authoring; document drain/rebind cutover and synchronize generated mirrors.
- [ ] Freeze implementation, run focused regressions and repository integrity checks, inspect real isolated herdr transport/cleanup, record acceptance, and finish the worktree through the existing gate.

## Execution checkpoint

Implementation is committed at 3dc1809b. All named behavior groups and typecheck passed. Final acceptance and worktree finish remain blocked by two unresolved architecture projection candidates; exact evidence and next action are in the linked notes. No production or installed-runtime cutover is claimed.

Architecture closure continuation: integrated main e9794576, recorded the current approved projection and retired both old candidates with strict noop proofs. Architecture-sync passes. Formal verification and acceptance are next.
