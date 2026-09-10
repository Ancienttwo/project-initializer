# Task Review: operator-task-diff

> **Status**: Blocked
> **Plan**: plans/plan-20260910-2225-operator-task-diff.md
> **Contract**: tasks/contracts/20260910-2225-operator-task-diff.contract.md
> **Notes File**: tasks/notes/20260910-2225-operator-task-diff.notes.md
> **Checks File**: .ai/harness/checks/latest.json
> **Recommendation**: fail
> **Review Rubric Version**: 2

## Review scope

The full task diff and its security correction are under review. Native specialist review found external Git filter/fsmonitor execution and Windows path spelling assumptions. Real-Git regressions cover filter refusal, disabled fsmonitor and prunable unrelated worktrees; native paths run in the platform matrix. Shutdown rejects new diff admission. Cascade review verified lazy-fetch prohibition across worker authority reads and explicit assume-unchanged refusal after real pre-fix failures. Limited readback passed on fa0a5abb; parent confirmed that commit contains the reviewed corrections. The official Codex plugin must approve the frozen final subject before an AcceptanceReceipt can be recorded.

## Verification evidence

Initial feature: 211 focused operator tests, typecheck, build and repository integrity checks. Security correction regressions have captured pre-fix failures and post-fix passes. Final prepare-acceptance passed at run-20260910T231010-87128, including all 11 declared executable checks. No semantic acceptance or merge completion is claimed here.

## Semantic acceptance blocker

The first official Codex plugin invocation returned `stale_scope` while deterministic projection changed the subject. After final verification, the next invocation was refused as `review_budget_exhausted`: the work-package has spent its single semantic review attempt. Neither result is an external pass. The contract owner must explicitly authorize the allowed typed UserWaiverGrant before acceptance can proceed; the existing request to merge is not treated as a waiver. No circuit state, policy or gate was changed.
