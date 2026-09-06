> **Archived**: 2026-09-07 04:59
> **Related Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260907-0459
> **Archive Projection V1**: `plans/plan-20260907-0348-brc9-transient-retry-consumption.md` => `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260907-0348-brc9-transient-retry-consumption.notes.md` => `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0348-brc9-transient-retry-consumption.contract.md` => `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0348-brc9-transient-retry-consumption.review.md` => `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`

# Task Review: brc9-transient-retry-consumption

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Contract**: tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md
> **Notes File**: tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-07 03:48
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:2928b9410910ea0aaef2eae728bb257ee7e362a37e10ca11c246bf1544e06063
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: f459cbc0335bdfbc66ee75bc2b4d2d80955a445b

## Human Review Card

- Verdict: original external FAIL retained; bounded correction awaits exact Owner acceptance
- Change type: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | frontend
- Intended files changed:
- Actual files changed:
- Commands passed: recovery delta 5/5 (`/tmp/brc9-transient-review-green.log`); type pass. Previous prepare run-20260907T043935-20213 passed 30/30 for its original subject.
- Residual risks: acquisition-cap global stop remains a separate product-contract decision; no BRC6a exact-SHA claim.
- Reviewer action required: inspect diff and card
- Rollback: revert this publication to target f459cbc0335bdfbc66ee75bc2b4d2d80955a445b. Existing grants and settled ledger events are immutable.

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
> **Reviewed Subject SHA256**: sha256:2928b9410910ea0aaef2eae728bb257ee7e362a37e10ca11c246bf1544e06063
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: f459cbc0335bdfbc66ee75bc2b4d2d80955a445b
> **Verification Evidence SHA256**: sha256:f258294aa6994aabf62c223f5048239995dc08cb4e79c084509bd02665d47a26
> **Issued At**: 2026-09-06T20:58:54.185Z

- Summary: Existing explicit user approval to finish all BRC9; unique external FAIL preserved, both recovery findings reproduced and corrected with final 30/30 prepare. Acquisition-cap global stop remains an explicitly documented separate product-contract risk; no additional semantics change authorized.
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

## Unique official review — original subject

Subject `sha256:61306b215a997143fc5503d38c4e4206088876f5b7aa560920e64b8213e631d9`, target `f459cbc0335bdfbc66ee75bc2b4d2d80955a445b`. No second external review.

```json
{"verdict":"needs-attention","summary":"Two recovery regressions block shipping: temporary backoff can strand a dispatch, and historical transient results cannot replay after upgrade.","findings":[{"severity":"high","title":"Backoff refusal permanently strands an unstarted worker","body":"If a campaign transient failure occurs after a Task is acquired but before its worker starts, this admission check throws campaign_retry_backoff. However, bindCampaignWorker already persisted its immutable launch record before beforeChild requests the reservation. No child or reservation is created, yet retrying after backoff fails with 'launch requires reconciliation' because launch exists without final. An ordinary temporary refusal therefore requires manual recovery instead of becoming eligible again.","file":"src/effects/automation/budget-store.ts","line_start":1705,"line_end":1705,"confidence":0.97,"recommendation":"Coordinate worker launch publication with retry admission so a proven pre-execution refusal remains retryable. Add a regression that acquires a Task, records an intervening transient failure, attempts launch during backoff, then successfully launches the same dispatch after backoff."},{"severity":"medium","title":"Historical transient finals are replayed with a different charge","body":"At the pinned base, worker finals—including transient_failure—were settled as no_progress, consuming zero provider_failures. Replaying that immutable final now submits transient_failure, consuming one provider failure. commitUsage rejects the existing event with 'already exists with a different charge', so an upgrade breaks exact replay and crash recovery between budget settlement and Task-attempt completion. The new recovery test creates both records with the new implementation and misses this version boundary.","file":"src/effects/automation/campaign-worker.ts","line_start":110,"line_end":113,"confidence":0.99,"recommendation":"Preserve already-settled historical usage as replay authority, validating its exact final/reservation binding without recomputing its charge under new semantics. Add an upgrade fixture containing the base version's transient final and no_progress usage, including interrupted Task-attempt completion."}],"next_steps":[]}
```

## Correction evidence

Pre-execution backoff red: `/tmp/brc9-transient-backoff-red.log`. Historical settlement red: `/tmp/brc9-transient-review-red.log`. Five recovery controls passed in `/tmp/brc9-transient-review-green.log`. The final named Verification Plan preserves the original exact executions as baseline and explicitly checks current recovery delta. Owner disposition consumes the existing full-BRC9 completion approval; it does not relabel the original FAIL.
