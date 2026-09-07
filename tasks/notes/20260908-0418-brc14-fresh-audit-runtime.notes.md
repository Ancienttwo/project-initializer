# Implementation Notes: brc14-fresh-audit-runtime

> **Status**: Active
> **Plan**: plans/plan-20260908-0418-brc14-fresh-audit-runtime.md
> **Contract**: tasks/contracts/20260908-0418-brc14-fresh-audit-runtime.contract.md
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:d3f3ee5a167b4f638824f4cc2dafbde747517d653bd09bf32d160aa3eeb347e2`

## Design Decisions

- Snapshot ownership, audit observations and remaining authority limits are documented in `docs/researches/20260908-brc14-fresh-audit-runtime.md`.
- Reuse exact authorization binding and existing budget reconciliation. Durable observation replay precedes browser binding; new dispatch still validates authorization/profile. No new budget authority or dependency.
- Cross-group authoring-session reuse is rejected. Unverified audit output never advances lifecycle or rolls back main.

## Authorized Fixture Alignment

Two inherited failures reproduced on accepted integration `67d3e858` with `bun test --timeout 60000 tests/effects/issue-batch-observer.test.ts tests/effects/campaign-step.test.ts -t 'never treats issue-number selection|real observer counts identity'`: 0 pass, 2 fail, 27 filtered (`/tmp/brc14-baseline-fixture-check.log`). Observer selection failed during campaign creation; heartbeat fixture lacked a committed capability registry. The user authorized continuing with both repairs. Tests now use the current contract; no production guard was relaxed. The out-of-group heartbeat expects the new shared sequence error before I/O.

## Verification

The initial combined prepare run `run-20260908T045842-1718` passed focused tests, TypeScript and five integrity commands; task-sync required the substantive digest above. Its overall status remains failed. A committed contract and final prepare/AcceptanceReceipt own final evidence. No full suite or live provider was invoked.

## Remaining Product Boundary

Implementation acceptance is separate from real BRC14 completion. The trusted revision producer remains absent, so active acceptance and later groups stay blocked. The user stopped further BRC6a probes; no new provider budget is inferred. Main seven-file WIP hashes matched the pre-integration snapshot.

## Review Corrections

> **Substantive Change SHA256**: `sha256:da4ca1bdf613ac900be1d34faece296975a8f25b3aef83a24f93ab21ef3d9c2d`

The independent review found a stale CLI inventory and missing semantic architecture ownership. The CLI inventory now includes audit and its suite is in the contract. The development-campaign node explicitly owns both audit modules and the CLI call sink. The focused CLI run passed 4/4. The amended contract adds previously uncovered CLI coverage; the prior 13/13 run remains evidence for its original subject only.

The exact architecture signal `sha256:522895ccef52a6ebe63e68cf15718a97c468c40466bb90ce2522fba0ce5d7594` was accepted with reference `approved-plan:da8ccce0:brc14-fresh-audit-runtime`, whose approved scope owns the lifecycle/audit boundary. Canonical projection also refreshes the controlled AGENTS/CLAUDE blocks and the existing automation-budget source-change queue card; these generated mirrors are included in allowed paths. No human-authored root instructions were changed.
