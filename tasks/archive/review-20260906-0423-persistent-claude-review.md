> **Archived**: 2026-09-06 04:23
> **Related Plan**: plans/archive/plan-20260906-0305-persistent-claude-review.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260906-0423
> **Archive Projection V1**: `plans/plan-20260906-0305-persistent-claude-review.md` => `plans/archive/plan-20260906-0305-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/notes/20260906-0305-persistent-claude-review.notes.md` => `tasks/archive/notes-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0305-persistent-claude-review.contract.md` => `tasks/archive/contract-20260906-0423-persistent-claude-review.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0305-persistent-claude-review.review.md` => `tasks/archive/review-20260906-0423-persistent-claude-review.md`

# Task Review: persistent-claude-review

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260906-0305-persistent-claude-review.md
> **Contract**: tasks/archive/contract-20260906-0423-persistent-claude-review.md
> **Notes File**: tasks/archive/notes-20260906-0423-persistent-claude-review.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-06 03:05
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:a00fabf1e20b2a5906515fe550ff59dc9898f0dc6716b16eeb9fc78269f9bdd8
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 58401d7da5f59fef597db48e21e6ffa62a96504b

## Human Review Card

- Change type: code-change.
- Scope: required tmux readiness, persistent task-scoped Claude review, exact acceptance fences and owned cleanup.
- Review boundary: one independent Claude session through the production CLI; up to three same-process repair rounds. Receipt projection below is authoritative for verdict.
- Verification: named lifecycle, acceptance and readiness regression files; type and deterministic projection checks; six repository-integrity checks. Frozen run identity is recorded by verify-sprint.
- Rollback: cancel owned reviewer resources, retain evidence and revert the work-package diff.

## Mode Evidence

- Waza `/check`: approved plan execution; parent verifies scope and required checks, Claude supplies independent semantic acceptance.
- P1/P2/P3: approved file-backed plan and production lifecycle research.
- Test evidence: deterministic integration uses real tmux and receipt writer; live fixture separately exercises actual Claude semantic rejection and repair.

## Residual Risks

- No automatic recovery after ambiguous delivery; operator inspects and cancels.
- POSIX process groups required; use WSL on Windows.
- Review processes remain alive until explicit close/cancel; close precedes worktree finish.
- Board controls, scheduler integration and native Claude TUI are outside this slice.

## Acceptance Receipt Projection

> **Disposition**: external_pass
> **Reviewer**: Claude
> **Source**: claude-review
> **Actor**: not-applicable
> **Reviewed Subject SHA256**: sha256:a00fabf1e20b2a5906515fe550ff59dc9898f0dc6716b16eeb9fc78269f9bdd8
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 58401d7da5f59fef597db48e21e6ffa62a96504b
> **Verification Evidence SHA256**: sha256:b1009d1c934f30550fa9d9d2c1ccbd9e5f5a0b567ca56f0692b2a4aecd9d5477
> **Issued At**: 2026-09-05T20:22:54.079Z

- Summary: The current subject satisfies the contract on the new target revision 58401d7d. Readiness: check-agent-tooling.sh adds tmux as a required platform-runtime capability, verifies `tmux -V` output shape, and the strict-readiness failure is host-agnostic so both Claude and Codex profiles fail without usable tmux; present/missing/unavailable regressions pass. Lifecycle: the claude-review round/status/close/cancel family is registered in src/cli/index.ts; one owned tmux server (-L repo-harness-review) hosts one persistent stream-json child per canonical contract path; session creation consumes exactly one semantic-review circuit admission (limit 1, strongBoundary) and up to three rounds share it. Fences: each request freezes contract/goal/subject/evidence/target digests, the host revalidates the request digest and contract/goal identity before delivery, validateClaudeReviewResult checks type/subtype/is_error/session_id and exact round_id/session_id/subject_sha256/context_sha256 with closed key sets and enum checks, and recordAcceptance re-derives acceptanceContext and refuses any stale field before the single protected receipt writer runs; the caller also rechecks context before submit. verifyAcceptance deterministically refuses reject dispositions (line 972), so close after a rejected round fails closed; close also requires the last accepted-N receipt to equal the currently verified receipt. Falsifiers: same child_pid/session_id across rounds is asserted; stale source during review yields no receipt and the next round is refused as ambiguous rather than replayed; concurrent callers are refused by the directory lock without a second provider turn; cleanup signals only the identity-checked (pid/pgid/lstart/comm) detached child group, never kills a pane after host identity is lost, and the sentinel-pane test proves isolation. Packaging is sound: src/ and scripts/ ship as TypeScript run by Bun, so the host sibling module resolves at runtime. Prepared verification shows every machine criterion passing on subject a00fabf1 with frozen retry identity unchanged and no paths outside allowed_paths. Prior findings F-001 (P2), F-002 (P3) and F-003 (P3) remain open with current evidence; F-001 is recorded as an explicit deferral in tasks/todos.md and is fail-closed. New P3 F-004 notes the hardcoded provider model alias. No P0/P1 findings remain unresolved.
- Findings: P2: Cancel remains unavailable after a host startup failure. closeClaudeReview still reads processes.json unconditionally (src/effects/review/claude-review-session.ts:253) before deciding the orphan/cancel path. If tmux new-session, the host pane/identity check, provider spawn, or the 15 s processes.json wait fails, session.json and failure.json exist, runClaudeReviewRound refuses with claude_review_interrupted, and cancel throws ENOENT while the semantic-review admission is already consumed. Behaviour is fail-closed (no acceptance, no unowned process touched) and the parent recorded this as an explicit deferral in tasks/todos.md, so it stays non-blocking. Fix: when processes.json is absent and cancel is requested, write closed.json with a startup-failure termination and return.; P3: validateClaudeReviewResult (src/core/review/claude-review.ts) still accepts a FAIL verdict with zero unresolved findings; only the PASS-with-open-P0/P1 conflict is refused (line 100). The host then saves result-N.json and recordAcceptance rejects with 'reject requires at least one finding' (scripts/acceptance-receipt.ts:848), leaving request without accepted record so later rounds report claude_review_ambiguous_round and the session must be cancelled. Fail-closed, but the validator should refuse this shape before delivery so the same session can continue.; P3: docs/spec.md:384-385 still says 'Up to three changed-subject repair rounds retain the same PID/session', implying four total rounds, while CLAUDE_REVIEW_MAX_ROUNDS is 3 total (initial plus two repairs), which the 'three rounds share one admission and a fourth changed subject is refused' test enforces and claude-mode.md states correctly. Align the spec wording with the implemented budget.; P3: src/effects/review/claude-review-host.ts hardcodes '--model fable' with no override. On a Claude CLI without that alias the first turn fails as claude_review_provider_failed, the session is interrupted, and the single semantic-review admission is consumed with no way to retry except explicit cancel. The live production-path fixture passed with this alias, so this is an operational fragility rather than a correctness defect; consider a validated env or option override and documenting the requirement in claude-mode.md.

