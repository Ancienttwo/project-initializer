> **Archived**: 2026-09-07 00:58
> **Related Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260907-0058
> **Archive Projection V1**: `plans/plan-20260907-0010-brc9-writable-dispatch-attempt.md` => `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/notes/20260907-0010-brc9-writable-dispatch-attempt.notes.md` => `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0010-brc9-writable-dispatch-attempt.contract.md` => `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0010-brc9-writable-dispatch-attempt.review.md` => `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`

# Task Review: brc9-writable-dispatch-attempt

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Contract**: tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md
> **Notes File**: tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-07 00:10
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:518b407ae4619310e25952adc0094c070620cfbf47a5f1ef83304adadee389e6
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 0155acb01a6a79c0bf34376c974d6214e27fae38

## Human Review Card

- Verdict: original external review FAIL; P1 corrected, exact Owner acceptance pending
- Change type: code-change
- Intended files changed:
- Actual files changed:
- Commands passed: original canonical prepare 18/18; corrected-status development regression 3/3 and type.
- Residual risks: unresolved launches remain fail-closed; historical Lease-loss replay and the rest of BRC9 are separate packages.
- Reviewer action required: exact Owner acceptance after corrected-subject prepare.
- Rollback: revert source; retain immutable launch/attempt/budget evidence.

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
> **Reviewed Subject SHA256**: sha256:518b407ae4619310e25952adc0094c070620cfbf47a5f1ef83304adadee389e6
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 0155acb01a6a79c0bf34376c974d6214e27fae38
> **Verification Evidence SHA256**: sha256:8ff4c720f6945540653e7b557ca63dcc38bd8fb41520e23fe33e5eabc5b309a5
> **Issued At**: 2026-09-06T16:58:09.775Z

- Summary: Approved corrected subject after P1 replay-status fix; original external review remains recorded as FAIL.
- Findings: none

## Behavior Diff Notes

- Real acquired contract workers reserve existing invocation budget and emit existing TaskAutomationAttempt outcomes. Execution reports never imply semantic acceptance.
- Replay preserves the actual helper status and failure class; missing Review File cannot become pass by retry.

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

## Original external review transcript

```json
{
  "verdict": "needs-attention",
  "summary": "Do not ship: campaign replay can turn a failed contract run into a successful result without satisfying its missing-review check.",
  "findings": [
    {
      "severity": "high",
      "title": "Preserve contract-run failure status across campaign finalization and replay",
      "body": "When both children exit 0 but the required Review File is absent, contract-run sets status=fail and failure_class=missing_review. It nevertheless calls campaign.finish(), which persists final evidence and records the worker-reported completed outcome because it only checks child exit codes. Repeating the identical invocation then reaches this unconditional pass response, although the review is still missing. Thus an explicitly failed run becomes successful merely by retrying.",
      "file": "scripts/contract-run.ts",
      "line_start": 768,
      "line_end": 769,
      "confidence": 0.99,
      "recommendation": "Persist and replay the actual contract-run status and failure class alongside the campaign execution result; do not infer pass from the existence of final attempt evidence. Apply the same fix to the template helper and add a regression covering missing Review File on initial execution and exact replay."
    }
  ],
  "next_steps": []
}
```
