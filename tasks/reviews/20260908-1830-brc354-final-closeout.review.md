# Task Review: brc354-final-closeout

> **Status**: Accepted
> **Plan**: plans/plan-20260908-1830-brc354-final-closeout.md
> **Contract**: tasks/contracts/20260908-1830-brc354-final-closeout.contract.md
> **Notes File**: tasks/notes/20260908-1830-brc354-final-closeout.notes.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-08 18:30
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:2a60b8232e7494d67e3a501c70ada654f828b7ec55bc7f57320a13c490713122
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: a1393e4447e771dbfdf1cce183a5a07fbda12afc

## Human Review Card

- Verdict: PASS for the local source work package; remote CI/merge and issue closeout are the delivery gate.
- Change type: bugfix.
- Scope: 8 substantive files cover preparation fencing, exact-container cleanup and the three regression suites; remaining files are workflow and architecture/research documentation.
- Reviewer: Codex parent, with independent security and architecture specialists; no concrete introduced findings.
- Rollback: revert the closeout source commit; retain existing host journals.

## P1 / P2 / P3 and Root Cause

The owning path is prepareChild -> version probe/container create -> invocation publication -> beforeChild -> terminal/recovery. The old unstarted shortcut returned positive inactivity despite a lost preparation. A durable preparation record now precedes every async effect; missing invocation authority blocks recovery without manufacturing output. Explicit cleanup retains journal authority after exact inactive-container removal. At higher volume, operator cleanup frequency and retained journal storage are the declared limits.

## Verification Evidence

All 11 canonical checks passed with no skips at the criterion level: runtime-docker, lifecycle-regression, lifecycle-guards, typecheck, helper-parity and the six required repository checks. Docker-dependent tests ran with the pinned local image, rather than passing through skipIf. No real provider inference occurred.

- Frozen run: `.ai/harness/runs/run-20260908T184439-49341-20260908-1830-brc354-final-closeout.json`.
- Docker execution: `vx-c6317fade74f4cd2a190` (115859 ms).
- Lifecycle execution: `vx-169d1de1f4264298bc92` (144299 ms).
- Lifecycle guards: `vx-7d5b9d99634040bd9beb` (129893 ms).
- Original guard failure: `.ai/harness/runs/brc354-pre-fix.log`, two failed assertions and PRE_FIX_EXIT=1 on unfixed main.
- Packaged operator command: rebuilt tarball and extracted-package help/argument/refusal smoke passed. Existing dependencies were reused; no global install or release is claimed.
- All executable evidence came from canonical preparation; later finalization explicitly reported no verification rerun.

The uncommitted-contract preparation could not emit the final summary event. After the exact source/contract bytes were committed as 8afd59c9, the canonical emitter projected the original run through the ledger; the typed AcceptanceReceipt below consumed that projection. The raw snapshot is not interchangeable with the ledger-materialized verification input.

## Acceptance Receipt Projection

> **Disposition**: external_pass
> **Reviewer**: Codex
> **Source**: codex-plugin
> **Actor**: not-applicable
> **Reviewed Subject SHA256**: sha256:2a60b8232e7494d67e3a501c70ada654f828b7ec55bc7f57320a13c490713122
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: a1393e4447e771dbfdf1cce183a5a07fbda12afc
> **Verification Evidence SHA256**: sha256:a34b0ed2bcc2f41c5d737e41c61bd0a54dba2046d2956587d7573c2d0a03818b
> **Issued At**: 2026-09-08T10:54:33.312Z

- Summary: Complete bounded diff reviewed with independent security and architecture passes. All 11 canonical checks passed, including real Docker crash/cleanup and lifecycle recovery. Active admission remains closed.
- Findings: none

## Behavior and Remaining Boundaries

Unknown pre-publication effects remain unresolved: no inferred inactivity, reconstructed invocation, new owner, or successful provider result. The operator cleanup path requires a complete protected created handle; partial journals are retained for operator attention. Journals have no automatic TTL deletion.

Production active admission stays closed. BRC6a Owner closeout is unchanged; BRC14/BRC15 live acceptance and package publication are outside this work package. Required PR CI and merge must finish before issue #354 is closed.
