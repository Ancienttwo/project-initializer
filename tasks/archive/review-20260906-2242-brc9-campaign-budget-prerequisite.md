> **Archived**: 2026-09-06 22:42
> **Related Plan**: plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260906-2242
> **Archive Projection V1**: `plans/plan-20260906-2017-brc9-campaign-budget-prerequisite.md` => `plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/notes/20260906-2017-brc9-campaign-budget-prerequisite.notes.md` => `tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2017-brc9-campaign-budget-prerequisite.contract.md` => `tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2017-brc9-campaign-budget-prerequisite.review.md` => `tasks/archive/review-20260906-2242-brc9-campaign-budget-prerequisite.md`

# Task Review: brc9-campaign-budget-prerequisite

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260906-2017-brc9-campaign-budget-prerequisite.md
> **Contract**: tasks/archive/contract-20260906-2242-brc9-campaign-budget-prerequisite.md
> **Notes File**: tasks/archive/notes-20260906-2242-brc9-campaign-budget-prerequisite.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-06 22:06
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:1aea337adad2167bc4e8cdd1c9ebee3cb30c4a0869273ef0614829a80b141237
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: d969c667e39166252a2ad67b19ef135f29b4e71a

## Human Review Card

- Verdict: accepted through the owner-approved user_waiver receipt; implementation and verification gates pass.
- Change type: code-change
- Intended files changed: campaign budget core/store/projection and authoring forwarding; campaign producer/consumer fixtures and focused tests; approved plan/contract/review/notes, PRDs/research and generated architecture manifest.
- Actual files changed: 24 paths in the approved scope, four production owners; no dependencies, controller wiring or new persistence authority.
- Commands passed: canonical prepare, all 29 contract checks, Change Assessment, architecture projection current/noop, Deep native specialist/adversarial review.
- Residual risks: BRC9 controller wiring and other prerequisites remain excluded. Historical standalone leaf-record integrity is a pre-existing #282/BRC6 hardening decision, not a new regression.
- Reviewer action required: none for semantic acceptance; preserve the main dirty manifest and hold finish/merge.
- Rollback: revert before issuing new campaign grants/events; after issuance stop affected runs and require an explicit migration/release decision, preserving immutable history.

## Mode Evidence

- Selected route: approved work-package implementation followed by Deep Waza check.
- P1/P2/P3 evidence: approved plan maps grant, Git-common ledger, authoring and read projection; traces step -> leaf -> authoring -> completion; preserves one unresolved external reservation and generic bytes.
- Root cause evidence: notes record pre-fix failures and fixes for active-step revision stranding, mixed board snapshots and foreign step authority. Regression tests exercise real-store writes and isolated-process read interleaving.

## Verification Evidence

- Frozen implementation: 77523d58b67e9ff38991031ec11455e3bfb912b3, target 77b16acb5b054d0f173d5383c1364dd0cea913a2.
- Canonical prepare: run-20260906T215359-61531, 29/29 checks passed, Change Assessment passed; owner acceptance subsequently finalized without rerunning verification. Snapshot: .ai/harness/runs/run-20260906T215359-61531-20260906-2017-brc9-campaign-budget-prerequisite.json.
- Review subject: sha256:05c65fddf637349e7233a198ca71f710d312a84b780c241c74055e234d1d6165.
- Development regressions: revision red -> 73/73 combined pass; board/foreign-authority red -> 76/76 combined pass; strengthened final composition file 21/21 pass; TypeScript pass. These development runs are not duplicate final criteria.
- Final native review ledger: security + abuse PASS; architecture + composition PASS; assumption violation PASS; cascade construction PASS. All reviewed the frozen final correction and reconciled prior full-diff coverage; reviewers did not rerun tests.
- The one official codex-plugin review passed the earlier 475afb8d subject sha256:dd56855b6d4a9a03dd78b392711682a0d99ac71c9a61c2622bff2423b0bd2904. It remains evidence for that subject only. The subsequent invocation for the final subject was refused with review_budget_exhausted: one semantic review per work-package, fixes close via owner acceptance. It is not a new external pass.
- No local full suite was run. Named core/store/contention/e2e/PRD, campaign producer/consumer and authority-freeze checks plus type/state and six repository-integrity commands cover this scope. New publication CI remains pending.

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:1aea337adad2167bc4e8cdd1c9ebee3cb30c4a0869273ef0614829a80b141237
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: d969c667e39166252a2ad67b19ef135f29b4e71a
> **Verification Evidence SHA256**: sha256:294946894e4ffbcb581dd86212bd03a717b6c5e7983d165a45c41828090909d9
> **Issued At**: 2026-09-06T14:42:11.267Z

- Summary: Owner explicitly approved user_waiver acceptance for reviewed implementation 89c8df63 after final 29/29 canonical checks and native reviews; prior external review remains bound to its original subject. Preserve main dirty manifest; no finish or merge authorized by this approval.
- Findings: none

## Behavior Diff Notes

Campaign grants now require independent step/provider caps. Local admission/completion events share the existing ledger with provider usage. A step holds no outer external reservation; provider calls bind the exact active step, while existing standalone authoring uses explicit null. Step completion alone updates campaign no-progress streak. Revisions require quiescence. Step history validates authorization and published ancestry; board metrics are bound to a coherent event/open-reservation snapshot. Old incomplete campaign grants fail closed.

## Residual Risks / Follow-ups

Owner acceptance is finalized. Canonical finish/publication remain on hold while the user requires the main dirty manifest to be preserved. BRC9 consumer wiring must reserve each real invocation and complete before final BRC6 seal/verification. An independently reviewed pre-existing forged standalone leaf reservation/usage ancestry gap is outside this step-event package; no leaf protocol redesign was added.

## Failing Items

No final in-scope code finding remains. The typed owner receipt is current. Finish/merge remain on hold; the main dirty manifest must not be overwritten. The prior external pass remains bound to its original subject.

## Retest Steps

Reuse the final exact-subject prepare while subject, contract, target and toolchain remain unchanged. The typed grant/receipt is recorded and finalization passed without rerunning verification. When the target worktree boundary is resolved, use installed canonical contract-worktree finish; do not overwrite the protected main dirty manifest.
