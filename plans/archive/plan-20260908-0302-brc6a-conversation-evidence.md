> **Archived**: 2026-09-08 03:25
> **Related Plan**: plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-0325
> **Archive Projection V1**: `plans/plan-20260908-0302-brc6a-conversation-evidence.md` => `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-0302-brc6a-conversation-evidence.notes.md` => `tasks/archive/notes-20260908-0325-brc6a-conversation-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0302-brc6a-conversation-evidence.contract.md` => `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0302-brc6a-conversation-evidence.review.md` => `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md`

# Plan: BRC6a read-only conversation evidence capture

> **Status**: Archived
> **Created**: 20260908-0302
> **Slug**: brc6a-conversation-evidence
> **Planning Source**: codex-plan-or-waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md --strict`.
> **Rollback Surface**: Before execution remove `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`; after execution revert branch `codex/brc6a-conversation-evidence` or the explicitly reviewed diff.
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md`
> **Task Review**: `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-0325-brc6a-conversation-evidence.md`

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

- Active plan: `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`
- Sprint contract: `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md`
- Sprint review: `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md`
- Implementation notes: `tasks/archive/notes-20260908-0325-brc6a-conversation-evidence.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`.

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
- Contract file: `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md`
- Review file: `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md`
- Implementation notes file: `tasks/archive/notes-20260908-0325-brc6a-conversation-evidence.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`; after execution revert branch `codex/brc6a-conversation-evidence` or the explicitly reviewed diff.
- **Verification boundary**: Commands named in the captured planning output plus `repo-harness run verify-contract --contract tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md --strict`.
- **Review/acceptance boundary**: `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md`, `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md`, and `tasks/archive/notes-20260908-0325-brc6a-conversation-evidence.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Before execution remove `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`; after execution revert branch `codex/brc6a-conversation-evidence` or the explicitly reviewed diff.

## Captured Planning Output

## Goal
Deliver an operator-invoked, read-only Oracle conversation-history evidence capture for one explicitly selected existing ChatGPT conversation. Preserve raw provider response bytes and identity without claiming exact revision or creating a model request.

## P1/P2/P3
P1: Oracle has copyChromeProfile, launchChrome and chrome-remote-interface. Existing browser execution captures DOM answers and no conversation history. Existing browser-tools start uses broad process management and is unsuitable for ownership isolation. A disposable profile copy and owned Chrome instance were verified by this parent with the completed BRC6a conversation.
P2: On Page.navigate to the existing /c/<id>, Chrome sends GET /backend-api/conversations/<id>?include_has_versions=true&num_turns=10. Network responseReceived/loadingFinished/getResponseBody exposes JSON with conversation_id, messages[] and page_info. The observed tool results carry GitHub invoked_resource metadata; original call_tool request messages are absent. UI summary expansion did not expose those original calls. The producer must retain the actual history, not infer missing requests.
P3: Narrow operator script calls reusable collector, with bounded time/size, exact origin/path/GET/id checks, exclusive owner-only output, owned profile cleanup, no inherited model/thinking overrides, no prompt/submission API. One new collector protects the protocol and is exercised by script/tests. No dependency is added. At 10x runs, profile-copy cost and browser-history format drift fail first; bounded capture rejects unavailable or malformed evidence. Do not expand into audit/adoption authority or automatically run canaries.

## Scope
Oracle isolated branch codex/brc6a-conversation-evidence based on 43adb603: src/browser/conversationEvidence.ts; scripts/capture-conversation-evidence.ts; focused tests/browser/conversationEvidence.test.ts; docs/browser-mode.md and CHANGELOG.md. repo-harness: research report and workflow artifacts for this execution boundary. Main WIP remains unchanged.

## Verification
Focused mocked CDP tests prove exact GET matching, wrong conversation rejection, missing/paginated history represented honestly, malformed/oversized response rejection, timeout/cleanup, exclusive output and byte hash. Oracle typecheck and build. Run the operator once against the already-completed conversation as read-only readback, verify raw result message identifiers and file mode/hash, and verify owned Chrome/profile cleanup. Six repo integrity checks; no full suite, new GPT call, grant, GitHub write, release or main merge. One independent acceptance review after code freeze.

## Task Breakdown
- [x] Implement bounded raw history collector and owned-profile operator command.
- [x] Verify focused failures and one existing-conversation readback without model calls.
- [ ] Record corrected evidence boundary, acceptance, and archive without merging dirty main.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Implement bounded raw history collector and owned-profile operator command.
- [x] Verify focused failures and one existing-conversation readback without model calls.
- [ ] Record corrected evidence boundary, acceptance, and archive without merging dirty main.
