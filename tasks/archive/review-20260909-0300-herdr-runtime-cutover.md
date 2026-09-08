> **Archived**: 2026-09-09 03:00
> **Related Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260909-0300
> **Archive Projection V1**: `plans/plan-20260909-0125-herdr-runtime-cutover.md` => `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/notes/20260909-0125-herdr-runtime-cutover.notes.md` => `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0125-herdr-runtime-cutover.contract.md` => `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0125-herdr-runtime-cutover.review.md` => `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`

# Task Review: herdr-runtime-cutover

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Contract**: tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md
> **Notes File**: tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-09 01:25
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:2fd8be5db51167352c0ebc88720193cd8632c1812dd682bdc1cdff7a50b8ad9a
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 0b0c0a606d97f11b0d813bd5b161fba594ae7def

## Human Review Card

- Verdict: owner accepted the verified startup ownership repair and authorized merge. Rebinding that approval after non-overlapping main movement.
- Change type: migration.
- Intended and actual scope: closed runtime adapter identifiers and submission; persistent review hosting; required tooling and generated guidance; focused tests and architecture/workflow documentation. Implementation checkpoint 3dc1809b.
- Behavior: explicit named Herdr routing replaces tmux; ambiguous delivery is not retried; review ownership and receipt boundaries remain.
- Rollback: drain owned sessions before reverting the cutover. Old session metadata and adapter records are not translated.

## Mode Evidence

- Route: approved work-package execution using think/check instructions.
- P1/P2/P3: captured plan and durable research explain both consumers, identity handoffs and migration constraints.
- New runtime dependency: installed Herdr >=0.9.0; no npm dependency. One shared helper serves the existing adapter and review lifecycle; generated launcher/config preserve owned execution.

## Verification Evidence

Final bounded report: `.ai/harness/checks/herdr-final-verification.latest.json` (8 current checks plus 4 baseline-with-delta passes; only architecture-sync failed). Baseline report: `.ai/harness/checks/herdr-verification.latest.json`; immutable execution records under `.ai/harness/runs/` are referenced by the contract.

- Passed: runtime-contracts, review-lifecycle, readiness-guidance-adoption, typecheck, deploy-sql, task-workflow, project-state, adoption-dry-run and both mirror checks.
- Task-sync: passed after adding the exact substantive digest to notes.
- Real Herdr tests use deterministic providers and prove transport/process/receipt mechanics; they do not establish actual model judgment.
- Architecture-sync: now passes after approved current apply and strict-noop retirement of both stale candidates. No source fix or gate relaxation was needed.
- No full suite: focused groups cover each changed runtime and configuration contract.

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:2fd8be5db51167352c0ebc88720193cd8632c1812dd682bdc1cdff7a50b8ad9a
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 0b0c0a606d97f11b0d813bd5b161fba594ae7def
> **Verification Evidence SHA256**: sha256:b836d6d17472e3fefc14a835cac952340f9dc55f210982e2f6deda0013eea37c
> **Issued At**: 2026-09-08T18:58:33.790Z

- Summary: Owner explicitly approved the verified post-review Herdr startup repair and local main merge; approval covers verified non-overlapping integration and fulfilled status reconciliation.
- Findings: none

## Residual Risks / Follow-ups

Architecture recovery main e9794576 is integrated. Prepare current checks after the archctx 0.5.8 update, then obtain the configured typed receipt and finish the worktree. Runtime/review source is guarded against its passing baseline; readiness/adoption and type checks run current. Installation, migration of live sessions, merge and release remain unperformed.

## Official Codex plugin transcript (verbatim)

```json
{"verdict":"needs-attention","summary":"Do not ship yet: interrupted startup can leak a detached Herdr server while cancellation reports successful closure.","findings":[{"severity":"medium","title":"Record ambiguous server startup before spawning","body":"The detached server starts before server.json is persisted. If the caller crashes in that window, or publishing server.json fails, the server can remain alive without recorded ownership. Cancellation then writes closed.json, stopReviewServer returns immediately because server.json is absent, and status reports closed. This hides an orphan runtime and prevents normal cleanup.","file":"src/effects/review/claude-review-session.ts","line_start":131,"line_end":138,"confidence":0.96,"recommendation":"Persist a server-start intent before spawning. Treat an intent without server identity as unresolved startup rather than successful closure; clean up the owned child on caught publication failures. Add a regression covering interruption between spawn and metadata publication."}],"next_steps":["Close the server-start ownership gap and verify cancellation never reports closed when server existence remains unresolved."]}
```

Original reviewed subject: sha256:2d2925cec868e903599a81fbaa19eaefbf9bbe6182f1bc974c25b63d6b3b48ec. One P2 finding was reproduced and repaired. Current verification will cover the repaired subject; owner acceptance was explicitly granted for the repair. The current receipt truthfully uses User/user-waiver, not an external-pass claim for bytes the plugin did not review.
