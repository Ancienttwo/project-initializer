# Plan: BRC14 provider history revision evidence and fresh audit

> **Status**: Executing
> **Created**: 20260908-1350
> **Slug**: brc14-history-revision-evidence
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC14
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Provider history identity and bounded fresh-audit sequencing
> **Rollback Surface**: Revert producer/consumer code; preserve immutable historical observations
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md`
> **Task Review**: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md`
> **Implementation Notes**: `tasks/notes/20260908-1350-brc14-history-revision-evidence.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: sprint:plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md#BRC14
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260908-1350-brc14-history-revision-evidence.md`
- Sprint contract: `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md`
- Sprint review: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md`
- Implementation notes: `tasks/notes/20260908-1350-brc14-history-revision-evidence.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-1350-brc14-history-revision-evidence.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-1350-brc14-history-revision-evidence.md`.

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
- Contract file: `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md`
- Review file: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md`
- Implementation notes file: `tasks/notes/20260908-1350-brc14-history-revision-evidence.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-1350-brc14-history-revision-evidence.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert producer/consumer code; preserve immutable historical observations
- **Verification boundary**: Provider history identity and bounded fresh-audit sequencing
- **Review/acceptance boundary**: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-1350-brc14-history-revision-evidence.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-1350-brc14-history-revision-evidence.contract.md`, `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md`, and `tasks/notes/20260908-1350-brc14-history-revision-evidence.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-1350-brc14-history-revision-evidence.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert producer/consumer code; preserve immutable historical observations

## Captured Planning Output

## Goal

Consume provider-origin conversation history as exact GitHub revision evidence in BRC14 fresh audits. Preserve the active admission stop until its separate activation contract is satisfied. Owner already authorized implementation of remaining BRC and current model-free continuation; no additional GPT call is included in this package.

## Observed boundary

The completed read-only observation conversation 6a9fa035-b610-83ea-b000-0ad484e21e65 contains complete api_tool.call_tool commit and refs/heads/main returns, tied by provider metadata to the activated GitHub connector and one turn. GET history response SHA256 is a55c05ead0cab070da100e9e19581d457ac83e1870dc6930462ec6e749ba770b. The commit resolves to 33d692aaa0ab593df0c160082b18fdac02c82e9c and its tree to e198e1a525df4614f8dfd4564f32b0034dfb08f7. Local cross-check confirms all 36 root entries; truncated tree wrapper is excluded from production identity validation. This proves a viable producer, not completed-group audit or active-canary acceptance.

## Chosen design

Use the existing Oracle conversation-history capture implementation, collecting from the same CDP page after the final answer. Add an explicit private history output destination and preserve it across session worker serialization/reconstruction. Bind output to allocated Oracle session and actual conversation. Keep SSE diagnostics separate; do not parse model answer or fall back between evidence formats.

At repo-harness's existing Oracle effect boundary validate private regular-file ownership, bounds, hash, HTTPS host, successful GET response, conversation and source session. Publish typed history observation metadata. A single pure campaign validator consumes the exact captured provider schema: complete pagination, same turn, selected connector, tool role/name, invoked_resource, complete numbered response wrapper, GitHub commit/ref URL and body identities. Only full commit and ref returns produce exact revision evidence. Missing or unsupported data produces unverified; contradictions refuse. No local field guessing, new network credentials, or answer-SHA inference.

Wire fresh audit to this producer: bind history to fresh session, actual prompt and group snapshot; observed SHA must equal expected final main and model answer. Only accepted/accepted_with_followups recommendations with verified revision may enter the existing bounded group transition according to sprint semantics. rejected and unverified never seed the next group. Keep the active admission function unchanged in this package.

Flow: existing browser consult -> Oracle same-page history capture -> private artifact validator -> campaign revision validator -> fresh audit observation -> bounded group transition.

## Scope and constraints

This crosses more than 8 files because one value spans the existing Oracle CLI/worker/browser boundary and repo-harness provider/core/effect boundary. Expected Oracle surfaces: bin/oracle-cli.ts, src/sessionManager.ts, src/oracle/types.ts, src/browser/types.ts, src/browser/sessionRunner.ts, src/browser/index.ts, src/browser/conversationEvidence.ts and focused tests. Expected harness surfaces: src/cli/chatgpt-browser/{oracle-provider,oracle-session-evidence,types,engine}.ts, src/core/automation/campaign-revision-evidence.ts, src/core/automation/campaign-fresh-audit.ts, src/effects/automation/campaign-fresh-audit.ts and focused tests/fixtures. Add fields only where actual existing types require them; reuse the existing capture implementation and bounded file-validation facilities.

No active campaign, GitHub writes, issue generation, model switch, budget reset, new grant, release or global install. Do not reopen BRC6a or overwrite historical BRC15a negative observations. Do not declare BRC14 complete without its group-audit acceptance. Protect dirty main; work in isolated integration lineage.

## Risk and rollback

Fragile assumption: provider history preserves the observed typed tool response schema. Unknown shape, pagination or missing linkage fails closed. At 10x volume the fixed history size/page bound fails first rather than accepting partial evidence. Keep the complete original private response and immutable audit record for recovery. Revert the code package without migrating old observations or manufacturing upgraded receipts; old protocol evidence stays bound to its original subject.

## Task Breakdown

- [x] Persist the observed read-only result and exact evidence boundary in repo research with immutable raw-history digest; leave sprint BRC14/BRC15 pending.
- [x] Add same-page history collection and exact provider-session export to Oracle; preserve its destination through the worker; focused capture/CLI/session tests.
- [x] Add bounded private history transport validation and strict commit/ref evidence decoder to repo-harness, with redacted structural fixtures from the real response.
- [x] Connect verified revision evidence to fresh-audit acceptance and group transitions; retain rejected/unverified and active admission guards.
- [x] Freeze implementation and pass named focused tests, TypeScript and six repository integrity checks; independent semantic review has passed. Closure uses this evidence and finishes without merging dirty main.

## Verification

Oracle: focused conversationEvidence, sessionManager, browser session forwarding and CLI history option tests; typecheck and changed-file lint. Harness: named campaign-revision-evidence, campaign-fresh-audit and affected Oracle provider/session tests; TypeScript; check-deploy-sql-order, check-architecture-sync, check-task-sync, check-task-workflow --strict, inspect-project-state, init --dry-run.

Positive: complete captured commit/ref and current session/turn/connector; exact local SHA; accepted bounded transition. Negative: assistant imitation, cross-session/turn/repository, wrong ref/SHA, missing connector/URL, truncated/paged history, changed bytes, stale snapshot, reused authoring conversation, rejected recommendation, group-count overflow. No full suite: current change has named transport/protocol/sequence boundaries covered by focused tests; retain earlier suite evidence only as baseline.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Persist the observed read-only result and exact evidence boundary in repo research with immutable raw-history digest; leave sprint BRC14/BRC15 pending.
- [x] Add same-page history collection and exact provider-session export to Oracle; preserve its destination through the worker; focused capture/CLI/session tests.
- [x] Add bounded private history transport validation and strict commit/ref evidence decoder to repo-harness, with redacted structural fixtures from the real response.
- [x] Connect verified revision evidence to fresh-audit acceptance and group transitions; retain rejected/unverified and active admission guards.
- [x] Freeze implementation and pass named focused tests, TypeScript and six repository integrity checks; independent semantic review has passed. Closure uses this evidence and finishes without merging dirty main.
