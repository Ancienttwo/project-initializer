# Plan: BRC6a live provider stream retention

> **Status**: Executing
> **Created**: 20260908-0336
> **Slug**: brc6a-live-network-evidence
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md --strict`.
> **Rollback Surface**: Before execution remove `plans/plan-20260908-0336-brc6a-live-network-evidence.md`; after execution revert branch `codex/brc6a-live-network-evidence` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md`
> **Task Review**: `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md`
> **Implementation Notes**: `tasks/notes/20260908-0336-brc6a-live-network-evidence.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan-or-waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260908-0336-brc6a-live-network-evidence.md`
- Sprint contract: `tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md`
- Sprint review: `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md`
- Implementation notes: `tasks/notes/20260908-0336-brc6a-live-network-evidence.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-0336-brc6a-live-network-evidence.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-0336-brc6a-live-network-evidence.md`.

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
- Contract file: `tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md`
- Review file: `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md`
- Implementation notes file: `tasks/notes/20260908-0336-brc6a-live-network-evidence.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-0336-brc6a-live-network-evidence.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/plan-20260908-0336-brc6a-live-network-evidence.md`; after execution revert branch `codex/brc6a-live-network-evidence` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md --strict`.
- **Review/acceptance boundary**: `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-0336-brc6a-live-network-evidence.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-0336-brc6a-live-network-evidence.contract.md`, `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md`, and `tasks/notes/20260908-0336-brc6a-live-network-evidence.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-0336-brc6a-live-network-evidence.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/plan-20260908-0336-brc6a-live-network-evidence.md`; after execution revert branch `codex/brc6a-live-network-evidence` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Add opt-in live response-stream retention to existing Oracle browser execution, preserving original provider bytes that may contain tool requests omitted from historical conversation reload. No new GPT call, budget reuse, model/thinking selection, active admission, or exact-version claim is authorized by this implementation slice.

## P1/P2/P3
P1: Existing Oracle CLI builds RunOracleOptions then BrowserRunOptions; browser/index.ts has local and remote CDP clients, each enabled before submission and closed in finally. Previous history collector b6f35dcc proved tool results exist while original call_tool requests are omitted. CodeGraph absent in Oracle checkout; direct source tracing used.
P2: Attach a shared collector to the exact browser page client before its navigation/submission. Match only same configured origin HTTP responses with text/event-stream MIME; use CDP Network.streamResourceContent initial bufferedData and subsequent Network.dataReceived base64 chunks, plus loadingFinished/loadingFailed. No HTTP request bodies, headers, cookies or query strings are recorded. Original model-to-tool requests, if present, are response-stream payload, not inferred from browser POST data.
P3: Stream bytes into exclusive0600 bounded NDJSON so interruption preserves a clearly incomplete trace. Header and capture-end are local observation records, never provider receipt or model/tool authority. Cap64MiB and256 streams; errors/caps/missing footer are explicit incomplete evidence. No parsers, endpoint aliases or alternate transport. Unset option performs no capture. CLI is browser foreground only; no inherited trace path on reattach. At10x runs DOM/transport drift or absent server tool parameters fails the evidence goal first; do not invent parameters or spend GPT budget to hide it.

## Scope
Oracle codex/brc6a-live-network-evidence based on b6f35dcc: one shared collector; CLI option --write-network-evidence; RunOracleOptions/BrowserRunOptions propagation; local/remote lifecycle hooks; focused collector and runner tests; model-free real-Chrome SSE fixture; docs/changelog. 12 files to bind existing CLI and both CDP execution paths, no dependency or service. repo-harness research/workflow only in a fresh worktree based on main33c5012e.

## Verification
Focused mock tests for origin/MIME/request identity, initial-buffer ordering, multi-chunk bytes, late callbacks, capture limits, disk failure, exclusive file, footer completeness and independent local/remote lifecycle wiring. Real Chrome on a disposable empty profile against a local HTTP/SSE fixture verifies protocol semantics without ChatGPT/model calls. Run Oracle typecheck/build and targeted lint; six repo integrity checks and one independent frozen review. Prepare one concrete future read-only GitHub probe request with explicit1call/600second budget for separate user approval; do not send it in this slice. No full suite or global install.

## Task Breakdown
- [x] Implement optional live stream collector and existing browser runner wiring.
- [x] Verify focused failures and model-free Chrome transport fixture.
- [ ] Record evidence, bounded future probe, review and archive without merging main WIP.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Implement optional live stream collector and existing browser runner wiring.
- [x] Verify focused failures and model-free Chrome transport fixture.
- [ ] Record evidence, bounded future probe, review and archive without merging main WIP.
