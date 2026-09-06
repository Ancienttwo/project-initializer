> **Archived**: 2026-09-06 16:25
> **Related Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-1625
> **Archive Projection V1**: `plans/plan-20260906-0401-brc8-bounded-worker-acquisition.md` => `plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/notes/20260906-0401-brc8-bounded-worker-acquisition.notes.md` => `tasks/archive/notes-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/contracts/20260906-0401-brc8-bounded-worker-acquisition.contract.md` => `tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md`
> **Archive Projection V1**: `tasks/reviews/20260906-0401-brc8-bounded-worker-acquisition.review.md` => `tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md`

# Implementation Notes: brc8-bounded-worker-acquisition

> **Status**: Active
> **Plan**: plans/archive/plan-20260906-0401-brc8-bounded-worker-acquisition.md
> **Contract**: tasks/archive/contract-20260906-1625-brc8-bounded-worker-acquisition.md
> **Review**: tasks/archive/review-20260906-1625-brc8-bounded-worker-acquisition.md
> **Last Updated**: 2026-09-06 04:02
> **Lifecycle**: notes

## Design Decisions

- Capacity is campaign-wide across groups and Engineers; current non-released Lease records remain the sole count authority. The campaign lock protects admission plus claim, not ownership.
- Existing acquire-next owns canonical ordering and replay; the local host receives only its real WorkEnvelope and live ClaimActorReceipt.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Controller-only capacity check | Rejected | Direct Fleet/Engineer callers could bypass it. |
| Common Fleet admission guard | Selected | All executable acquisition paths share the claim boundary; existing task locks remain the election authority. |

## Open Questions

- None.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.

## Startup Boundary

BRC7 was canonically accepted and merged as 58401d7da5f59fef597db48e21e6ffa62a96504b; archived acceptance records retain run-20260906T032157-9397. BRC8 starts from that exact commit. Existing #280 and #278 dependencies were traced before planning. Canonical capture-plan --status Approved --execute created this worktree; contract-run preflight passed after concretizing scope and verification. Sprint task 3722412b92ea2240c60bbca9f09ae2e04e2a30974d2978bc63778f00cfc9ac46 is bound to this worktree by claim 6b506e9f-6156-4e69-b38c-c86b8290b170, with its CLI-issued claim token. No BRC8 source implementation or final acceptance is claimed at this startup checkpoint.

The primary worktree's unrelated tmux-review research and todo were restored after BRC7 merge. Its old architecture projection conflicted with the newly accepted BRC7 projection; the accepted projection remains current, and the original saved bytes are retained in stash e1409d640c528f2b4f6db8cdd361a275fd483246. They are not BRC8 deliverables.

Startup verification: contract brief preflight passed, all six root integrity checks passed, and existing #280 acquire-next baseline passed 5 tests/12 assertions. These establish executable planning and the consumed dependency baseline, not BRC8 implementation acceptance. The first implementation entrypoint is src/effects/engineers/scheduling-acquire-next.ts and its existing unit suite, followed by the common Fleet capacity guard and campaign execution handoff.

## Implementation decisions and evidence

The common Fleet admission guard serializes campaign-wide lease counting through claim, retaining the existing per-task election. It counts published groups rather than only the selected group, includes reserving/bound/completing leases, and rejects unknown state or unavailable canonical group authority. No capacity counter or ownership schema was added. Membership discovery is shared with the BRC7 proof gate. Post-claim canonical/plan validation is shared between fresh Fleet acquisition and replayed WorkEnvelope handoff.

Real execution exposed a #280 integration defect: observeRetryEligibility uses observed_at as eligible_since for a Task with no attempt record, so independent fresh reads produced different offer revisions before any state mutation. The existing acquire-next boundary now freezes one observation time for collection and scheduled-acquire revalidation. It still re-reads all mutable stores; there is no fake attempt, persisted eligibility authority, second scheduler, or BRC9 work. Regression evidence: real handoff failed engineer_offer_stale before this change and passed after it (/tmp/brc8-real-handoff.txt); targeted baseline previously covered only injected scheduling documents.

Real tests prove capacity release/unknown-state behavior, two-process different-Task contention, authenticated different-Engineer/different-capability contention, one real worktree/envelope/actor receipt, idempotent handoff, same-capability exclusion, stale plan replay rejection, lost Lease rejection, and off/shadow/parent boundaries. Fake Fleet orchestration fixtures explicitly inject the capacity seam; real campaign cases never fabricate an envelope or lease. The shared adoption fixture canonicalizes its temporary HOME for the existing safe-directory lock contract.

Fresh handoff verification belongs inside acquire-next's key-locked success boundary, before the completed receipt. Its optional accept_acquired callback can reject a fresh result after caller-specific authority verification and own-claim compensation; it cannot replace the acquired envelope and never executes on replay. Campaign verification failure releases only an exactly matching bound claim/generation/worktree/branch/unit through the existing release command. Unknown ownership or failed rollback stays typed rollback_failed. A foreign claim is untouched. Replay validates read-only because a worker may already be using the envelope. Final policy observation explicitly requires active. This callback protects the cross-module handoff invariant without a new persisted schema or lifecycle. The real pre-fix regression left a bound lease; the fixed regression persists refusal and another Engineer can acquire afterward (/tmp/brc8-handoff-pre-fix.txt, /tmp/brc8-handoff-post-fix.txt).

Generic Fleet selection skips capacity-full candidates without consuming claim-race retries; the initial offer count bounds the extra scan. Explicit Task assertions still refuse immediately. The regression has four full candidates ahead of unrelated ready work with the default three claim attempts. This prevents a full campaign from starving unrelated work while keeping fresh reads and bounded execution. Evidence: /tmp/brc8-capacity-selection-round2-pre.txt and /tmp/brc8-capacity-selection-round2-post.txt.

Development evidence: the eight contract suites passed 82 tests/419 assertions before review fixes (/tmp/brc8-focused-final.txt); the three affected suites then passed 27 tests after handoff fixes (/tmp/brc8-review-delta.txt). The bounded capacity-scan delta passed its named regression. Packaged tarball install/operator/CLI smoke passed before these internal review fixes (/tmp/brc8-tarball-smoke.txt); this is baseline packaging evidence, not final-subject acceptance. No full BRC8 suite has been requested or run. Canonical prepare and a typed AcceptanceReceipt remain separate completion gates.

> **Substantive Change SHA256**: `sha256:5a10027e01a6c9c7a89d8854d44e26a93b86d6674abbb5fece7da281b817fcd0`

## Frozen implementation and integration

Implementation commit d2763fe5 was integrated with main 492add48e1bd973f1a2b5c209a7f4da5845e0000 in 92510059 before canonical verification. Upstream changed TSX discovery and Claude review tooling; the only conflicts were generated architecture provenance and tasks/current.md. The current snapshot was regenerated, CodeGraph reindexed the integrated source, and ordinary architecture-projection apply succeeded with no human actions or refresh signals. All six repository-integrity commands passed on the integrated tree; logs are /tmp/brc8-integrated-{sql,architecture,task-sync,workflow,project-state,init}.txt. Native Deep specialists and all four independent adversarial angles are closed, including narrow fix verification; no external review or BRC8 AcceptanceReceipt has been issued.

## Canonical preparation

Installed verify-sprint --prepare-acceptance passed at frozen commit 343846a3b081298dcfbc9f82679b421e254969fe: run-20260906T045251-63588, nested criterion run-20260906T045302-65695. All nine contract checks passed; type took 1779ms, state boundaries 386ms, and the eight focused suites 149200ms. Architecture acceptance materialization was noop. Frozen subject is sha256:1991972e77cd03e5ebb99633cfde94d95b063565cba6d64685387657b0540521. Policy review_base is origin/main at ad4afe7765b62a66a58f6378f8d0efcd3c3006cf; the separate merge/diff base is local main 492add48e1bd973f1a2b5c209a7f4da5845e0000. The worktree metadata base_commit was refreshed to the observed merge-base after integration, as verify-sprint required, before any expensive criterion ran.

Canonical snapshot: .ai/harness/runs/run-20260906T045251-63588-20260906-0401-brc8-bounded-worker-acquisition.json; latest.json reports acceptance_receipt.status=pending. No AcceptanceReceipt, final acceptance, BRC8 merge or push is claimed. The review subject includes the already integrated upstream Claude-startup-cancel delta because origin/main is behind local main; BRC8's allowed-path gate passes against its actual merge base. Review/notes/current updates are excluded from normalized-final-content and must preserve this subject. Consume these exact-context criteria on any eligible retry rather than rerunning them.

## Official review correction

User authorized codex-plugin review. The first official result (/tmp/brc8-formal-review-1.json) reviewed HEAD 838003d1 and the exact prepared subject, reporting one P2: Engineer acquire-next's task assertion bypassed generic Fleet capacity skipping and permanently recorded the refusal. The concrete real regression failed before the fix (/tmp/brc8-engineer-capacity-pre-fix.txt). Fleet now preserves its existing no_eligible_task classification and adds the closed reason campaign_capacity_full; acquire-next scans only these pre-claim refusals within the initial offer-count bound, preserving order and separate race limits. Capacity-only idle clears its pending key so a released slot can be acquired using the same key. No new ownership, scheduler, lifecycle, or CLI command was added.

The first three-file delta run produced 25 pass and 5 timeouts while the machine repeatedly entered Deep Idle (pmset log: sleep/wake cycles through 15:13 on 2026-09-06). That run is not passing evidence. After full wake, the new real unrelated-task regression passed with an existing 90-second bounded verifier, exit 0 in 19357ms (/tmp/brc8-engineer-capacity-bounded.json and .log). Type passed. The final canonical criterion is narrowed to the five affected suites, retaining the original eight-suite canonical baseline; no full suite is needed. This is the third bounded capacity-starvation correction across the two entrypoints; another unresolved correctness failure in that issue stops the loop.

Final delta canonical preparation passed: run-20260906T151959-78917, all nine criteria, type 1655ms, state boundaries 356ms, five affected suites 97760ms. Frozen subject sha256:48ad5681e6c84fcd1a5fdb405e38b24f50bbf04ee4e19d4232359deb447425f9, review target ad4afe7765b62a66a58f6378f8d0efcd3c3006cf. The runner applied the deterministic architecture projection before freezing criteria. The earlier sleep-interrupted development run is superseded only by this new successful run, never relabeled. Formal provider recheck is pending.

Official recheck was blocked before provider execution by installed cross-review: review_budget_exhausted; one semantic review per work-package, then fix findings and use owner acceptance. This is a runtime review-budget gate, not a provider failure or automatic approval rejection. The verified correction subject is sha256:48ad5681e6c84fcd1a5fdb405e38b24f50bbf04ee4e19d4232359deb447425f9; no second provider result or typed acceptance exists. Owner approval must explicitly accept this correction before grant-waiver/record user_waiver; the earlier user approval authorized external review only. No merge or push. Diagnostic: /tmp/brc8-formal-review-2.json.

## Owner acceptance completed

The user explicitly approved owner acceptance after the runtime review-budget boundary was explained. Installed acceptance-receipt grant-waiver and record --disposition user_waiver issued the receipt at 2026-09-06T07:54:52.763Z for subject sha256:48ad5681e6c84fcd1a5fdb405e38b24f50bbf04ee4e19d4232359deb447425f9, target ad4afe7765b62a66a58f6378f8d0efcd3c3006cf, verification evidence sha256:55b7738216f437fb08fa4cdf1fc955170fb10d68f86ad4364a94e966982302b6. Canonical verify reported User/user-waiver/user_waiver valid; verify-sprint finalized acceptance without rerunning verification (/tmp/brc8-owner-final-verify.txt). This closes the semantic acceptance gap. Canonical contract-worktree finish/publication is still outstanding; no BRC8 merge or push has occurred.

## Concurrent upstream integration

Remote main advanced to 8e709e62 after the owner receipt was issued; receipt verification correctly rejected two overlapping paths. Main was merged as 6a502de6 and integrated into BRC8 without overwriting the unrelated untracked research. The original owner receipt is baseline evidence only until refreshed. The only integration defect is test-only: the local startup-cancel sentinel used the old tmux socket while upstream teardown used the new one. Root Cause Evidence: observed 78 pass/1 teardown failure in /tmp/brc8-upstream-tests.txt; traced new-session/display/has-session to old socket and teardown to new socket; invariant is that the real sentinel and cleanup share the product socket; fix unifies the six test socket literals, with the same real regression as the guard. This consumes the one directly blocking out-of-scope fix allowance. No BRC8 source behavior changed.

> **Substantive Change SHA256**: `sha256:d5bb514c11ec35f7c956665972e6d8e1fd36ee7787eb68b493953962cd96c7fe`

The integrated Claude review and skill catalog/package suites pass 79 tests/265 assertions in 20.84 seconds (/tmp/brc8-upstream-tests-fixed.txt). The original failing run is retained as pre-fix evidence.

## Refreshed owner acceptance

Canonical preparation run-20260906T160410-90230 passed all nine checks (type 2889ms, state boundaries 477ms, five focused suites 122487ms). The unchanged owner approval was rebound to integrated subject sha256:7a59e5c2de85efb3c4e58234a5d18f40660eca53ad0092f2f23f42fee365b15f, target 8e709e627883fa3e360fc8cbc8c346a6d146ed8f, evidence sha256:133fe83888f62cb89c2980ff63774889d5c0b3b2ac6c4a13c9327611afd48aa2. Installed record issued User/user-waiver/user_waiver at 2026-09-06T08:06:59.817Z; receipt verify passed and verify-sprint finalized without another test run. This supersedes the pre-upstream receipt as current acceptance. Main retains the unrelated untracked docs/researches/20260906-verification-execution-dataflow.md; canonical finish with merge requires a clean target and remains outstanding. No BRC8 merge or push is claimed.

## Final publication target synchronization

The user authorized pushing the two existing local main commits required by canonical finish. The initial push was rejected because origin advanced to 76dc97e8 (ignored local current-status cutover). Integration kept tasks/current.md untracked and retained the merged deferred goals; conflicts were only the deleted read model and todo timestamp. Main 5ca84933 was pushed successfully and integrated into BRC8 as d4bfc192. No BRC8 production source changed. Upstream session-context/workflow-contract regression passes 64 tests/509 assertions; all six root checks pass. Main's concurrent research and projection were preserved in stash 7a5c67a75f3276a14a4b41d9509fef3594b39b3b before publication; the research must be restored and the old projection retained as recovery evidence if the accepted projection differs. The remote accepted the main push while reporting the Required / CI status was expected; no remote CI pass is claimed.

Final synchronized-target acceptance: run-20260906T162101-14112 passes nine checks; type 2435ms, state boundaries 437ms, five suites 126468ms. Subject sha256:a5859a00cea05d79eaa38ee0ef32120bf7eb5f4fea3f7e071f5e49515c46a616; target 5ca8493308f3e6e20b06f0d8a58d11307d9c03de; typed user_waiver issued 2026-09-06T08:24:14.351Z. The existing owner approval remains the semantic authority. Finalize reuses prepared evidence without rerunning tests.
