# Task Review: campaign-reconciliation-recovery

> **Status**: Pending
> **Plan**: plans/plan-20260910-1553-campaign-reconciliation-recovery.md
> **Contract**: tasks/contracts/20260910-1553-campaign-reconciliation-recovery.contract.md
> **Notes File**: tasks/notes/20260910-1553-campaign-reconciliation-recovery.notes.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-10 15:54
> **Recommendation**: fail
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: pending
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: pending

## Human Review Card

- Verdict: pending final canonical and external acceptance; native source review found no blocking finding.
- Change type: bugfix with operator recovery for malformed immutable evidence.
- Actual changed boundary: budget preparation/publication, explicit reconciliation repair CLI/API, expired-to-stopped transition, exact model caller selectors, focused regression tests and recovery documentation.
- Passed: TypeScript; hook/helper projection parity; SQL order; task sync; strict task workflow; project-state inspection; downstream init dry-run; installed-package repair CLI smoke.
- Focused development run: 140 passed, 1 existing exact-Issue admission case hit the unchanged 60-second timeout, 739 assertions across 7 files. The exact case then passed once on clean baseline (19.59s) and once on this patch (10.31s), with the same timeout and 717 local Git commands each. The aggregate result remains a retained failed run; no patch regression was identified.
- Architecture: source selector delta reviewed; the owner approved the exact change; canonical apply produced proven 8/8 selectors and all old candidates were resolved through typed receipts. Formal external AcceptanceReceipt is still pending.
- Rollback: before activation, revert this source slice. After a live operator apply, preserve original history and the new receipt/charge; never refund or delete ledger authority.

## Mode Evidence

- Waza `/hunt` real-store RED evidence establishes malformed-record persistence, late-settlement terminal drift and refusal to acknowledge stop after expiry.
- Waza `/check` Deep source review used security, architecture and four adversarial angles. No blocking source findings. Model selectors received a delta review after the caller split.
- P1/P2/P3 and immutable authority constraints are captured in the plan and research runbook.

## Verification Evidence

- Exact initial base: `3c570360543fe5b93378bec81c2a7d4f68f10663`.
- RED artifact: `tasks/evidence/campaign-reconciliation-recovery-pre-fix.log` (0 pass / 3 fail); changed recovery guards subsequently passed.
- Focused log: `/tmp/campaign-reconciliation-recovery/final-focused-tests.log`.
- Installed runtime: fresh temp HOME, normal `npm pack` + Bun install, exact changed-source byte comparison, real installed CLI help and operator fixture; 1 pass / 6 assertions.
- Composition probe: isolated usage-before-current crash, ordinary API interleaving and exact repair replay; 1 pass / 10 assertions.
- Live dry-run: exact original record/evidence digests; all 14 run files byte-identical before/after; `commit: null`. No live campaign, grant, reservation, Issue or provider mutation occurred.
- Canonical run `run-20260910T173914-45088-20260910-1553-campaign-reconciliation-recovery` passed all 17 declared checks with exact evidence and no timeouts. Change Assessment required the explicit budget-store oracle mapping, now declared without changing tests or source. Final preparation and external acceptance remain pending.

## CLI Command Surface

- Contract: `automation budget repair-reconciliation --repo <repo> --from <request.json>` defaults to read-only preview; `--apply` is required to record the full reserved charge.
- Runtime: actual installed package CLI, executable shim and help resolved. JSON stdout, explicit apply, default no-write preview and original-record immutability passed the installed fixture.
- Safety sink: exact raw-record hash and original ref names; full reserved charge only; original history retained; receipt-bound replay; crash recovery; no provider call/new grant/refund. Package smoke used disposable HOME and Git fixtures.
- Gap: not globally activated or used to settle the real reservation. Formal external acceptance/CI and exact live source activation remain outstanding.

## Acceptance Receipt Projection

> **Disposition**: unavailable
> **Reviewer**: unavailable
> **Source**: unavailable
> **Actor**: not-applicable
> **Reviewed Subject SHA256**: pending
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: pending
> **Verification Evidence SHA256**: pending
> **Issued At**: pending

- Summary: No AcceptanceReceipt has been recorded.
- Findings: none

## Behavior Diff Notes

Malformed new evidence fails before the immutable reconciliation is published. An existing malformed full-reserve decision has an explicit, auditable repair path. Late settlement retains terminal budget state. Expired campaigns can acknowledge stop while every execution transition stays closed.

## Residual Risks / Follow-ups

Complete canonical verification and the contract-frozen external review, then complete PR/CI before any live recovery. Preserve Issues #177/#178 and the existing grant boundary. A green native review or installed smoke is not a substitute for those remaining gates.
