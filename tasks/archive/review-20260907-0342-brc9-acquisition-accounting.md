> **Archived**: 2026-09-07 03:42
> **Related Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260907-0342
> **Archive Projection V1**: `plans/plan-20260907-0116-brc9-acquisition-accounting.md` => `plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0116-brc9-acquisition-accounting.notes.md` => `tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0116-brc9-acquisition-accounting.contract.md` => `tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0116-brc9-acquisition-accounting.review.md` => `tasks/archive/review-20260907-0342-brc9-acquisition-accounting.md`

# Task Review: brc9-acquisition-accounting

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260907-0116-brc9-acquisition-accounting.md
> **Contract**: tasks/archive/contract-20260907-0342-brc9-acquisition-accounting.md
> **Notes File**: tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-07 03:42
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:e670a101d3b1722a2aef0f29f8bfcdc5443c828ea1b35b554a1e54a02226d907
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 07f5f74484e1d2a7df799fb796fa03b1adfb46b7

## Human Review Card

- Verdict: Owner acceptance after corrected external finding; original external FAIL preserved below.
- Change type: code-change
- Intended files changed: campaign acquisition, Engineer rollback classification, acquisition regressions, package documentation and architecture projection.
- Actual files changed: src/effects/automation/campaign-acquisition.ts; src/effects/engineers/acquire.ts; tests/effects/campaign-acquisition.test.ts; docs/researches/20260907-brc9-acquisition-accounting.md; docs/architecture/.projection-manifest.json; package plan/contract/notes/review and tasks/todos.md.
- Commands passed: canonical prepare run-20260907T033515-13034, 15/15 criteria, all ten executable checks passed: acquisition, worker neighbor, Engineer acquire neighbor, typecheck, SQL, architecture, task-sync, strict workflow, project state and init dry-run.
- Residual risks: unknown post-acquisition effects retain the reservation and require reconciliation. This package does not complete campaign transient retry policy or whole BRC9.
- Reviewer action required: none; existing explicit user grant authorizes Owner acceptance after the one-review limit.
- Rollback: revert the bounded publication; preserve external grant and usage evidence.

## Mode Evidence

- Selected route: work-package check and single official codex-plugin review, followed by authorized Owner correction acceptance.
- P1/P2/P3 evidence: existing campaign mutation lock and budget ledger remain sole authorities; acquire result is persisted before settlement; unknown Lease readback retains the reservation. Only contention before entering the admission lock becomes observable idle.
- Root cause or plan evidence: notes preserve both real unknown-Lease red/green and real two-Engineer contention regression.

## Verification Evidence

- Waza `/check` run: canonical named verification, no repeated local full suite.
- Commands run: Verification Plan's ten checks, all passed for the current subject and target.
- Supporting artifacts: .ai/harness/runs/run-20260907T033515-13034-20260907-0116-brc9-acquisition-accounting.json; /tmp/brc9-acquisition-corrected-final-prepare.log; /tmp/brc9-acquisition-unknown-lease-red.log; /tmp/brc9-acquisition-unknown-lease-green.log; /tmp/brc9-acquisition-contention-green.log; /tmp/brc9-acquisition-lock-boundary.log.
- Implementation notes reviewed: tasks/archive/notes-20260907-0342-brc9-acquisition-accounting.md.
- Run snapshot: run-20260907T033515-13034.

## Behavior Diff Notes

Acquisition reserves before effects, persists immutable results before settlement and replays without another acquisition. Unknown rollback remains charged as unresolved. A competing caller that cannot enter the admission lock returns idle without budget mutation or invocation.

## Failing Items

None in current named verification. The historical outside review below is not relabeled as a pass.

## Summary

Current corrected implementation is eligible for Owner receipt under the existing explicit grant. Whole BRC9 remains open for repair accounting and campaign transient policy.

## Original Outside Review (frozen subject, FAIL)

Subject: `sha256:e5ec60e04a509d758ae0c8a601e4fb71dd46f7f98323641fca23b3b08669c4dd`; target `cea2225e0ada0c9fdc383ab19974253724e3a41d`; HEAD `631404bf0ba7ddecc8ee638cce5c1b659df72a92`. Official codex-plugin returned one P1. The transcript below is verbatim and is not a pass for the corrected subject.

```json
{"verdict":"needs-attention","summary":"Do not ship: an unresolved post-acquisition failure can release budget headroom without proven rollback.","findings":[{"severity":"high","title":"Do not treat every claim_actor_receipt_failed result as proven no progress","body":"The new whitelist settles claim_actor_receipt_failed as no_progress, charging zero acquisitions and closing the reservation. However, acquireEngineerTask can return that error after Fleet acquisition when receipt validation fails and readLease(...).record is null. readLease also returns null for classification='unknown' (for example, a missing or malformed owner record); that branch performs no release. Thus an unknown post-acquisition outcome can be recorded as definitively unsuccessful, allowing another key to acquire despite unresolved effects. The campaign's accept_acquired rollback guard does not cover this path because the underlying acquire already returned failure.","file":"src/effects/automation/campaign-acquisition.ts","line_start":53,"line_end":55,"confidence":0.98,"recommendation":"Keep this failure reserved unless structured evidence proves rollback or absence of effects. At minimum, classify unknown Lease readback in acquireEngineerTask as rollback_failed, and add a regression covering successful Fleet acquisition followed by receipt failure and unknown Lease state; assert the reservation remains open and another acquisition is refused."}],"next_steps":[]}
```

The P1 was reproduced through real Fleet acquisition followed by failed receipt publication and an unknown Lease owner. The unfixed run closed the reservation (expected 1, received 0); see `/tmp/brc9-acquisition-unknown-lease-red.log`. The correction makes Engineer acquisition return `rollback_failed` for unknown readback, retaining the existing campaign reservation. Corrected-subject acceptance remains pending.

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:e670a101d3b1722a2aef0f29f8bfcdc5443c828ea1b35b554a1e54a02226d907
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 07f5f74484e1d2a7df799fb796fa03b1adfb46b7
> **Verification Evidence SHA256**: sha256:0b181e87847ad199137126524f59876227d045389589c32bd204a220bb55ea64
> **Issued At**: 2026-09-06T19:42:07.610Z

- Summary: User repeatedly approved BRC9 completion and acquisition acceptance after the disclosed one-review budget refusal. Accept the corrected unknown-Lease rollback behavior only after current canonical verification; preserve the original external FAIL and red/green proof without relabeling prior subjects.
- Findings: none

