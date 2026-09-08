# Plan: BRC14 private response capture consumption

> **Status**: Executing
> **Created**: 20260908-1006
> **Slug**: brc14-response-capture
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Oracle raw transport evidence survives wrapper cleanup with exact invocation identity
> **Rollback Surface**: Revert bounded capture wiring; retain private historical evidence
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260908-1006-brc14-response-capture.contract.md`
> **Task Review**: `tasks/reviews/20260908-1006-brc14-response-capture.review.md`
> **Implementation Notes**: `tasks/notes/20260908-1006-brc14-response-capture.notes.md`

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

- Active plan: `plans/plan-20260908-1006-brc14-response-capture.md`
- Sprint contract: `tasks/contracts/20260908-1006-brc14-response-capture.contract.md`
- Sprint review: `tasks/reviews/20260908-1006-brc14-response-capture.review.md`
- Implementation notes: `tasks/notes/20260908-1006-brc14-response-capture.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260908-1006-brc14-response-capture.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260908-1006-brc14-response-capture.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260908-1006-brc14-response-capture.md`.

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
- Contract file: `tasks/contracts/20260908-1006-brc14-response-capture.contract.md`
- Review file: `tasks/reviews/20260908-1006-brc14-response-capture.review.md`
- Implementation notes file: `tasks/notes/20260908-1006-brc14-response-capture.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260908-1006-brc14-response-capture.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260908-1006-brc14-response-capture.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert bounded capture wiring; retain private historical evidence
- **Verification boundary**: Oracle raw transport evidence survives wrapper cleanup with exact invocation identity
- **Review/acceptance boundary**: `tasks/reviews/20260908-1006-brc14-response-capture.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260908-1006-brc14-response-capture.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260908-1006-brc14-response-capture.contract.md`, `tasks/reviews/20260908-1006-brc14-response-capture.review.md`, and `tasks/notes/20260908-1006-brc14-response-capture.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260908-1006-brc14-response-capture.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert bounded capture wiring; retain private historical evidence

## Captured Planning Output

## Goal
Connect the existing Oracle page-response-stream exporter to fresh campaign audit and retain the private raw evidence after provider cleanup. Preserve user model defaults and active/revision fail-closed behavior.

## P1/P2/P3
P1: Oracle fbc9ed38 owns --write-network-evidence and the oracle-page-response-streams protocol. repo-harness owns invocation paths, descriptor validation, BrowserSessionMeta and campaign audit answer records. The wrapper currently never requests capture and destroys its answer temp directory. Historical conversation results contain no complete original request and are not a fresh audit.
P2: fresh audit -> browser consult -> Oracle process -> invocation descriptor/metadata -> wrapper session -> audit answer record. Add transport observation at the existing provider boundary, using a private invocation directory under the controlled Oracle home. The original raw file survives cleanup; the metadata points to its byte digest and capture status bound to the descriptor session. Do not parse ChatGPT internal tool semantics or invent a resolved revision.
P3: one internal capture option is set only by fresh audit, not a public CLI/config knob. Oracle command receives --wait and an exclusive managed --write-network-evidence path. Missing, invalid, foreign-session and incomplete capture remain explicit transport observations and cannot verify a revision. No alternate provider, active launch, model choice, live request, global install, historical record migration or extra dependency. At 10x scale the existing per-run 64 MiB bound controls individual evidence retention; storage remains private local runtime state.

## Implementation
Use existing oracle-session-evidence module for a bounded file decoder/observation: requested capture status, provider session identity, raw private path, bytes and SHA256; validate start protocol/kind/session and terminal capture status without decoding base64 tool content. Keep missing/invalid capture distinct from empty/incomplete/captured. Reject symlinks and oversized input. Extend internal BrowserConsultInput/authoring input with captureNetworkEvidence optional true, set only in fresh audit. runOracleProvider allocates a private invocation capture directory under oracleHome, passes the file path to Oracle, and projects the observation through OracleSessionEvidence and BrowserSessionMeta. No raw payload enters logs, answer text, or tracked research. Audit answer record retains the same capture observation, but its revision_evidence remains unavailable. Preserve capture files even after failed/partial invocations; do not automatically retry.

## Verification
Focused tests cover argument forwarding and current model behavior; valid, foreign-session, missing, incomplete, symlink and oversized trace observations; retained raw file after wrapper temp cleanup; audit requests capture and preserves metadata without accepted revision. Run relevant browser CLI, oracle-session-evidence and fresh-audit tests, typecheck and six repository integrity checks. No full suite or live calls. Canonical prepare, independent check, receipt and archive on this isolated integration worktree; keep main WIP untouched.

## Scope and rollback
Expected 8-10 existing code/test/doc paths, no new service or dependency. Components flow Oracle exporter -> wrapper evidence -> browser session -> audit answer record, without reverse dependencies. Revert implementation commit to disable future capture; existing private evidence stays original runtime history. BRC6a remains closed; BRC14 real version acceptance and BRC15 active remain separate.

## Task Breakdown
- [x] Wire private invocation-owned Oracle capture through browser and audit metadata.
- [x] Verify malformed/partial evidence and retained raw artifact behavior with model-free fixtures.
- [ ] Complete scoped verification, independent acceptance and archive.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Wire private invocation-owned Oracle capture through browser and audit metadata.
- [x] Verify malformed/partial evidence and retained raw artifact behavior with model-free fixtures.
- [ ] Complete scoped verification, independent acceptance and archive.
