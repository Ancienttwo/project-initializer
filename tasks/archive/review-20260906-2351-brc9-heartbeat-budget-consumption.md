> **Archived**: 2026-09-06 23:51
> **Related Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260906-2351
> **Archive Projection V1**: `plans/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` => `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260906-2257-brc9-heartbeat-budget-consumption.notes.md` => `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2257-brc9-heartbeat-budget-consumption.contract.md` => `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2257-brc9-heartbeat-budget-consumption.review.md` => `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`

# Task Review: brc9-heartbeat-budget-consumption

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Contract**: tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md
> **Notes File**: tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-06 22:57
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:1cba3be72b15dcc83318e0857340bafbf8414d06b978f120ddd8d6b99f810b9d
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 61db011d9733b09b18b5ee249ac0e2b481cadf28

## Human Review Card

- Verdict: pending
- Change type: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | frontend
- Intended files changed:
- Actual files changed:
- Commands passed:
- Residual risks:
- Reviewer action required: inspect diff and card
- Rollback:

## Mode Evidence

- Selected route:
- P1/P2/P3 evidence:
- Root cause or plan evidence:

## Verification Evidence

- Waza `/check` run:
- Commands run:
- Manual checks:
- Supporting artifacts:
- Implementation notes reviewed:
- Run snapshot:

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:1cba3be72b15dcc83318e0857340bafbf8414d06b978f120ddd8d6b99f810b9d
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 61db011d9733b09b18b5ee249ac0e2b481cadf28
> **Verification Evidence SHA256**: sha256:7b51d4f0b039f949753bdd87e597fa9713018c1a2497508add6e7647b37f7ff1
> **Issued At**: 2026-09-06T15:50:58.054Z

- Summary: User explicitly approved Owner acceptance for corrected subject sha256:1cba3be72b15dcc83318e0857340bafbf8414d06b978f120ddd8d6b99f810b9d, target 61db011d9733b09b18b5ee249ac0e2b481cadf28, prepare run-20260906T234744-70512. The original external P1 remains failed evidence; its settled-read-failure fix passed current delta verification.
- Findings: none

## Behavior Diff Notes

- ...

## Residual Risks / Follow-ups

- ...

## Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Functionality | 0/10 | |
| Product depth | 0/10 | |
| Design quality | 0/10 | |
| Code quality | 0/10 | |

## Failing Items

- ...

## Retest Steps

- Re-run:
- Re-check:

## Summary

- ...

## Official external review — original subject

- Provider: codex-plugin
- Subject: sha256:eb7a0695c2c13662c2ca1329cf4ce460cdc2689d2251d7fabba23e6b7dae52b9
- Target: 61db011d9733b09b18b5ee249ac0e2b481cadf28
- Result: FAIL (P1); corrected-subject Owner acceptance pending.

```json
{"verdict":"needs-attention","summary":"Do not ship: a transient GitHub read failure strands the campaign’s active heartbeat and blocks subsequent execution.","findings":[{"severity":"high","title":"Complete the admitted heartbeat after a known read failure","body":"If GitHub returns a typed rate-limit or network error, provider.read durably records the failure and closes its reservation, but observeIssueBatch throws here. Execution never reaches completeHeartbeat, leaving active_step set without a heartbeat receipt. A new key is rejected because that step remains active; retrying the same key restarts invocation ordinal zero and is rejected as already admitted. Thus one transient read failure blocks further campaign heartbeats even after GitHub recovers and with no unresolved external reservation to reconcile. The added failure test checks leaf accounting but misses this controller dead end.","file":"src/effects/automation/campaign-step.ts","line_start":473,"line_end":473,"confidence":0.99,"recommendation":"Handle durably observed read failures by persisting a failure/no-progress heartbeat receipt and completing its admission when no external reservations remain unresolved. Preserve fail-closed handling for unknown outcomes. Add an integration test showing a typed read failure followed by a successful heartbeat under a new key."}],"next_steps":["Add the failed-observation completion path and verify recovery through runCampaignStep with the real observer."]}
```
