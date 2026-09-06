> **Archived**: 2026-09-06 16:25
> **Related Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Outcome**: Completed
> **Lifecycle**: review
> **Parent Run ID**: run-20260906-1625
> **Archive Projection V1**: `plans/plan-20260906-0401-brc8-bounded-worker-acquisition.md` => `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/notes/20260906-0401-brc8-bounded-worker-acquisition.notes.md` => `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0401-brc8-bounded-worker-acquisition.contract.md` => `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0401-brc8-bounded-worker-acquisition.review.md` => `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`

# Task Review: brc8-bounded-worker-acquisition

> **Status**: Accepted
> **Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Contract**: tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md
> **Notes File**: tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md
> **Checks File**: .ai/harness/checks/latest.json
> **Last Updated**: 2026-09-06 04:02
> **Recommendation**: pass
> **Review Rubric Version**: 2
> **Reviewed Subject SHA256**: sha256:a5859a00cea05d79eaa38ee0ef32120bf7eb5f4fea3f7e071f5e49515c46a616
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 5ca8493308f3e6e20b06f0d8a58d11307d9c03de

## Human Review Card

- Technical verdict: native Waza `/check` Deep pass, official P2 corrected, final canonical delta passed, and owner acceptance recorded as user_waiver.
- Change type: code-change.
- Intended and actual scope: campaign execution CLI, existing Engineer acquire-next, shared Fleet admission/validation, two campaign effects, focused tests/fixture, research and workflow/architecture projections. All are within contract allowed_paths.
- Behavior: exact immutable membership preserves scheduling order; campaign-wide Lease admission limits concurrent claims; the local parent receives a real authenticated envelope/actor receipt.
- Rollback: revert the BRC8 integration without deleting existing claims/worktrees or changing BRC6/BRC7 authority.

## Mode Evidence

- Selected route: approved work-package implementation followed by native `/check` Deep (authentication, mutation and multi-module boundaries).
- P1/P2/P3: captured plan's authority map, concrete acquisition trace and capacity-lock tradeoff; implementation notes retain the observed time-indexed scheduling defect and final handoff boundary.
- No new dependencies. campaign-capacity separates the shared Fleet claim guard from campaign-acquisition orchestration and avoids an import cycle. Shared membership and Fleet validation reuse existing authority. The fresh-success callback protects validation/compensation before durable success, without altering replay ownership. The new effect test file holds real adoption, binding, acquisition and process-concurrency fixtures.

## Verification Evidence

- Development baseline: eight named contract suites, 82 pass / 0 fail / 419 assertions, `/tmp/brc8-focused-final.txt`.
- Review delta: three affected suites, 27 pass / 0 fail, `/tmp/brc8-review-delta.txt`; final four-blocked-candidate scan regression passes `/tmp/brc8-capacity-selection-round2-post.txt`.
- Pre-fix regressions: `/tmp/brc8-handoff-pre-fix.txt` proves a retained bound Lease; `/tmp/brc8-capacity-selection-round2-pre.txt` proves unrelated work was skipped after three capacity refusals.
- Native specialist ledger: security PASS; architecture PASS; independent assumption-violation PASS after handoff fix; composition PASS; abuse-case finding resolved by the same handoff fix; cascade PASS after two bounded capacity-selection rounds. Architecture separately verified the HIGH shadow finding and its explicit active-mode fix.
- Native reviewers consumed existing test evidence without duplicate suites. The subsequent authorized official codex-plugin result and correction are recorded below.
- All six root integrity checks pass after integration with main 492add48; architecture projection reports no human actions or refresh signals. Logs: `/tmp/brc8-integrated-{sql,architecture,task-sync,workflow,project-state,init}.txt`. The native review is not an external AcceptanceReceipt.
- Canonical prepare: run-20260906T045251-63588, all 9 checks passed on frozen commit 343846a3; eight focused suites passed in 149200ms. Subject `sha256:1991972e77cd03e5ebb99633cfde94d95b063565cba6d64685387657b0540521`, policy review target `origin/main` at `ad4afe7765b62a66a58f6378f8d0efcd3c3006cf`, local merge base `492add48`. Architecture acceptance materialization: noop. Evidence snapshot: `.ai/harness/runs/run-20260906T045251-63588-20260906-0401-brc8-bounded-worker-acquisition.json`.

## Acceptance Receipt Projection

> **Disposition**: user_waiver
> **Reviewer**: User
> **Source**: user-waiver
> **Actor**: ancienttwo
> **Reviewed Subject SHA256**: sha256:a5859a00cea05d79eaa38ee0ef32120bf7eb5f4fea3f7e071f5e49515c46a616
> **Reviewed Subject Scope**: normalized-final-content
> **Reviewed Target Revision**: 5ca8493308f3e6e20b06f0d8a58d11307d9c03de
> **Verification Evidence SHA256**: sha256:8d483dc5a052e9e116ecb905ba8744931e2c2b72876567f2af3c217364544252
> **Issued At**: 2026-09-06T08:24:14.351Z

- Summary: User approved BRC8 owner acceptance, canonical finish and prerequisite main push. Rebind the unchanged BRC8 product behavior after accepted upstream current-status cutover integration; canonical run-20260906T162101-14112 passes nine checks, and 64 workflow integration tests pass. One-review budget remains exhausted; this is owner acceptance, not a second provider pass.
- Findings: none

## Behavior Diff Notes

- Fresh handoff authority loss records a typed failure after exact own-claim release. Unknown state or failed release reports rollback_failed. Shadow and foreign-owner regressions pass. Replayed handoffs revalidate read-only and never release an already dispatched worker.
- Generic Fleet skips full campaign candidates within an initial-offer-count scan; capacity skips do not consume claim-race retries. Explicit task assertions retain fail-closed semantics.
- Shared campaign authority enumeration includes every published group; missing canonical group authority blocks before claim. The real concurrency fixture uses two Engineers in one published group; this is not evidence of a full multi-group authoring lifecycle, which belongs to the later sprint boundary.

## Residual Risks / Follow-ups

- Canonical prepare and final owner acceptance have passed; the typed user_waiver receipt is valid. BRC8 remains in its worktree pending canonical contract-worktree finish and publication.
- Authority reads are snapshots; workers must stop on subsequent loss of claim authority. Cross-authority lifecycle locking and automatic recovery remain outside BRC8.

## Official codex-plugin review, round 1

The provider reviewed HEAD 838003d1, subject sha256:1991972e77cd03e5ebb99633cfde94d95b063565cba6d64685387657b0540521, base ad4afe7765b62a66a58f6378f8d0efcd3c3006cf. Its advisory PASS wrapper did not waive the concrete P2; the parent required a fix. Verbatim transcript:

```json
{"verdict":"needs-attention","summary":"Capacity handling can starve unrelated ready work through Engineer acquire-next. Static review only; tests were not run.","findings":[{"severity":"medium","title":"Full campaign blocks later eligible Engineer offers","body":"The capacity-skip branch only runs without a task assertion. However, acquireNextScheduledEngineerTask always selects the first Engineer offer and passes its task assertion through acquireScheduledEngineerTask to Fleet. Campaign capacity is not filtered during offer collection, and selectionMayBeRetried excludes no_eligible_task. Consequently, when another capability fills the campaign cap, an Engineer whose first offer belongs to that campaign returns failure without considering later unrelated ready work. New idempotency keys select the same blocked offer; the existing key permanently replays the refusal.","file":"src/effects/fleet/acquire.ts","line_start":791,"line_end":798,"confidence":0.97,"recommendation":"Preserve a typed capacity-full result and let acquire-next perform a bounded scan excluding capacity-blocked candidates while preserving offer order. Keep exact-task acquisitions fenced. Add a regression covering a full campaign offer followed by unrelated ready work through the Engineer acquire-next entrypoint."}],"next_steps":[]}
```

The pre-fix real Engineer regression failed, and the corrected regression passed in 19357ms after machine wake. The final delta criteria subsequently passed; the installed review budget prevented a second provider invocation, and the owner accepted the verified correction as recorded below.

## Final verification and owner-acceptance boundary

The correction is implemented in fadeb832 and frozen at 07072d2a. Canonical run-20260906T151959-78917 passed all nine criteria: type, state boundaries and the five affected suites (97760ms). New subject: `sha256:48ad5681e6c84fcd1a5fdb405e38b24f50bbf04ee4e19d4232359deb447425f9`; target remains `ad4afe7765b62a66a58f6378f8d0efcd3c3006cf`. The new real Engineer test passes, including a full campaign before unrelated ready work; the existing real two-Engineer race now proves that the previously capacity-blocked key succeeds after release.

The installed cross-review runner refused the requested provider recheck before invoking the provider. Code: `review_budget_exhausted`. Verbatim diagnostic:

> This work-package already used its one semantic review. Fix the findings, then close with owner acceptance; do not re-run external review.

The first provider opinion belongs to the old subject and is not a pass for this new one. A second external acceptance is unavailable. The user explicitly approved owner acceptance of the verified correction at 7dff97d6. The canonical helper recorded UserWaiverGrant and AcceptanceReceipt user_waiver for the exact new subject at 2026-09-06T07:54:52.763Z. Receipt verification passed, and verify-sprint finalized acceptance without rerunning verification. The original advisory PASS is not used as acceptance of the changed tree.
