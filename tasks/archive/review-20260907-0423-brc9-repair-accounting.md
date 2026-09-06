> **Archived**: 2026-09-07 04:23
> **Related Plan**: plans/archive/plan-20260907-0146-brc9-repair-accounting.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260907-0423
> **Archive Projection V1**: `plans/plan-20260907-0146-brc9-repair-accounting.md` => `plans/archive/plan-20260907-0146-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0146-brc9-repair-accounting.notes.md` => `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0146-brc9-repair-accounting.contract.md` => `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0146-brc9-repair-accounting.review.md` => `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`

# Task Review: brc9-repair-accounting

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260907-0146-brc9-repair-accounting.md
> **Contract**: tasks/archive/contract-20260907-0423-brc9-repair-accounting.md
> **Notes File**: tasks/archive/notes-20260907-0423-brc9-repair-accounting.md
> **Checks File**: .ai/harness/checks/latest.json
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:ff0e4c4ddd6e10976beceb19dcd6932fac96a9fe3530365f7ceacb1002ee4518
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: e258d9d1d6451f858e68c9261c2b9066a073982f

## Human Review Card

- Verdict: Owner acceptance of the corrected subject; the unique external review remains FAIL for its original subject.
- Change type: code-change
- Intended files changed: existing budget operation vectors, campaign worker reservation/settlement, real retry fixtures and bounded CI identity assertion correction, package documentation and architecture projection.
- Actual files changed: src/core/automation/budget.ts; src/effects/automation/campaign-worker.ts; tests/unit/issue-282-automation-budget-core.test.ts; tests/effects/campaign-worker.test.ts; tests/helpers/campaign-acquisition-fixture.ts; tests/helpers/campaign-adoption-repository.ts; tests/characterization/repair-campaign-authority-freeze.test.ts; package research, workflow artifacts and architecture projection.
- Commands passed: canonical prepare run-20260907T041538-42598, 17/17, all 12 executable checks passed: budget algebra, BRC0 identity/inventory, acquisition, Task attempt policy, worker, type and six repository integrity checks.
- Residual risks: acquisition reaching its own maximum still seals the global run and can block the last acquired worker. Increasing the retry fixture allowance only isolates repair accounting and does not resolve that product contract. Unknown child/final outcomes retain the complete reservation and require reconciliation. Campaign transient policy and whole BRC9 acceptance remain in the final integration package.
- Reviewer action required: none; existing user completion approval supports the current Owner receipt after the single external review and correction.
- Rollback: revert this publication; retain immutable grant, reservation, usage and attempt evidence.

## Mode Evidence

- Selected route: work-package named verification, one official codex-plugin review, bounded correction, Owner acceptance.
- P1/P2/P3 evidence: existing ledger and lock are the sole arithmetic authority. Reserve both children before either starts, retain their one repair allowance until explicit final evidence, then settle once. The verifier checks its exact open reservation and original deadline. No new counter or global stop relaxation.
- Root cause evidence: /tmp/brc9-repair-last-slot-red.log failed at verifier dispatch after the final repair charge. /tmp/brc9-repair-last-slot-green.log passed the real last-slot attempt and replay. The entire worker file then passed 12/12 with 82 assertions.

## Verification Evidence

- Waza `/check` run: frozen canonical named prepare, no repeated local full suite.
- Run snapshot: .ai/harness/runs/run-20260907T041538-42598-20260907-0146-brc9-repair-accounting.json.
- Commands run: the contract's 12 named executable checks, all current exact passes.
- Supporting artifacts: /tmp/brc9-repair-paired-prepare.log; /tmp/brc9-repair-paired-worker-file.log; /tmp/brc9-repair-last-slot-red.log; /tmp/brc9-repair-last-slot-green.log; /tmp/brc9-sprint-identity-red.log; /tmp/brc9-sprint-identity-green.log.
- Implementation notes reviewed: tasks/archive/notes-20260907-0423-brc9-repair-accounting.md.

## Behavior Diff Notes

Initial and repair attempts reserve two child invocations together. Only the later attempt reserves one repair cycle. Its immutable final precedes settlement and Task attempt completion, so the final allowed repair can complete and replay without another charge. The CI identity correction preserves every migrated Task ID and order while permitting the two approved inserted Sprint rows; the historical migration receipt is unchanged.

## Failing Items

None in current named verification. The separately documented acquisition/global-stop product decision is unchanged, not claimed fixed by this package.

## Summary

The corrected repair package is accepted through Owner review under the existing grant. Original outside findings and prior subjects remain below without relabeling.

## Original official review — FAIL

Subject `sha256:e7a72b1de038d12790deb43f8eff786cc8455bdef0861e68b3a7fdbdf3faacc3`, target `e258d9d1d6451f858e68c9261c2b9066a073982f`, HEAD `73dbe8d4`. The original transcript remains a FAIL for its original subject.

```json
{
  "verdict": "needs-attention",
  "summary": "Do not ship: consuming the final allowed repair cycle prevents that attempt from completing verification.",
  "findings": [
    {
      "severity": "high",
      "title": "The final repair slot exhausts the budget before verification",
      "body": "When repair_cycles is max_repair_cycles - 1, this retry reservation admits the worker. Its afterChild then calls appendAutomationUsage, whose commitUsage invokes exhaustionRefusal and persists budget_exhausted when consumption equals the limit. contract-run subsequently calls beforeChild('verifier'), whose dispatch reservation is rejected because the budget is exhausted—even though verification consumes no repair cycle. The worker has already modified its worktree, but the attempt remains started without a final result, and replay requires reconciliation. With max_repair_cycles = 1, the first repair hits this failure. The new tests cover spare headroom and an already exhausted budget, omitting this boundary.",
      "file": "src/effects/automation/campaign-worker.ts",
      "line_start": 125,
      "line_end": 128,
      "confidence": 0.99,
      "recommendation": "Make budget admission and settlement account for the complete worker/verifier attempt so the last authorized repair can finish while subsequent repairs remain blocked. Add a regression with exactly one repair cycle remaining that verifies both children run, the attempt closes, and replay adds no charge."
    }
  ],
  "next_steps": []
}
```

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:ff0e4c4ddd6e10976beceb19dcd6932fac96a9fe3530365f7ceacb1002ee4518
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: e258d9d1d6451f858e68c9261c2b9066a073982f
> **Verification Evidence SHA256**: sha256:e049f16422c912a228118c330c1e945120803ae701421942c33182582bf7be3a
> **Issued At**: 2026-09-06T20:22:44.966Z

- Summary: Existing user approval authorizes completing and integrating BRC9. The unique official review found the final repair slot could not run its verifier; preserve that FAIL and its red/green evidence. Owner acceptance applies to the complete attempt reservation correction after current canonical verification, without a second external review. The unchanged acquisition-cap global-stop semantics remain a separately documented product-contract risk.
- Findings: none

