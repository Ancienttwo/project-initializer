# BRC10 readiness and prerequisite boundary

Status: discovery complete for the #286 substrate; campaign execution remains blocked by Sprint BRC9. Observed base: `484c529a` on 2026-09-07. This is a readiness assessment, not an approved execution contract or a completion claim. The owning Sprint is `plans/sprints/20260902-2238-gpt-pro-seeded-repair-campaign.sprint.md`, rows 11–12 and Execution Dependencies Requiring Resolution.

## P1 — Existing authority and ownership

- `src/effects/state/coordination-lease-liveness-store.ts:54` owns generation-bound renewal under the existing Task lock, immutable renewal records and current projection. Its current production caller is the generic automation `controller-run.ts`; campaign code does not call it.
- `src/core/state/lease-liveness.ts:169` classifies current liveness. Expiry alone cannot authorize reclaim; unknown evidence requires operator attention, active effects block reclaim, and completing/reviewing require publication recovery.
- `src/effects/state/coordination-lease-reclaim.ts:30` re-observes evidence under the Task lock and consumes the existing generation-incrementing steal transition. The source tree currently contains no production caller of this entrypoint or `observeLeaseReclaimEligibility`.
- Campaign heartbeat budget consumption is published, but is explicitly a partial BRC9 package. Acquisition accounting, writable dispatch/attempt identity, per-task repair accounting, transient retry policy and adoption terminal ordering remain unaccepted. Do not infer BRC9 completion from #282/#287 or heartbeat acceptance.

## P2 — Required evidence flow

Current campaign acquisition produces a real WorkEnvelope/ClaimActor handoff. BRC10 must consume the accepted execution path's actual Task revision, Claim, Lease generation, binding generation, runtime effect identity and terminal observations. Those inputs feed renewal and the existing five reclaim evidence fields: controller terminal, runtime effect inactive, publication inactive, binding generation matches and ClaimActor matches. Missing evidence stays unknown; neither a PID nor an expired deadline supplies it.

A recovery step must re-read campaign journal, budget reservations, current Lease and execution/publication evidence before deciding whether an action is a replay, an attention-only outcome or an evidence-gated reclaim. Replaying a campaign step must not imply that an external effect did not run. Task locks and campaign locks remain their existing authorities; lock ordering must follow the finalized BRC9 consumer path rather than introducing a reverse nesting order.

## P3 — Smallest coherent execution slice

After full BRC9 acceptance, freeze the exact producer contracts and add campaign consumption of existing renewal/classification/reclaim APIs, with controller recovery tests at the existing persisted boundaries. Keep one Lease store, one budget ledger and one campaign journal. No new command, daemon, dependency, takeover heuristic or writable runner is justified by BRC10 itself.

At 10x tasks, the first concern to measure is serial evidence reads and lock hold time; unknown or incomplete evidence must still refuse takeover. Performance does not justify cached ownership authority.

The implementation plan cannot yet be decision-complete: the real campaign writable execution/effect producer and its terminal/attempt evidence remain BRC9 dependencies. Do not fabricate these values in order to implement BRC10 ahead of the producer.

## Acceptance work to carry forward

- Exact current owner renews; stale generation, task revision, binding or ClaimActor cannot renew/reclaim.
- Expired but active provider work, completing/reviewing publication and unknown liveness preserve ownership.
- Two actual reclaimer processes yield exactly one new generation; the existing unit test exercises sequential stale replay and does not establish cross-process campaign behavior.
- Crash after renewal persistence and after Lease mutation recovers using exact durable identities, without a second owner or duplicate provider effect.
- Exercise observation and reclaim at different real timestamps. The current reclaim API compares a fresh full receipt digest, including `classified_at`, with the prior receipt; current unit fixtures inject the same fixed timestamp. This is a consumer timing risk to reproduce before implementation, not a verified runtime fix or a reason to bypass the receipt fence.
- Exercise the finalized campaign path end to end with real local Lease/budget/journal stores and bounded fake external effects. Reuse upstream tests as substrate evidence, not whole-BRC10 acceptance.

## Verification performed

`bun test --timeout 60000 tests/unit/lease-liveness.test.ts tests/unit/lease-liveness-store.test.ts tests/unit/lease-reclaim.test.ts`: 8 pass, 0 fail, 23 assertions. These checks validate the existing #286 substrate only. No product source was edited, no external effect was invoked, and no full suite was run.

Coordination: BRC9 owner pane %14 is investigating the writable dispatch/attempt bridge and explicitly retains row 11 as pending. This document is isolated from the shared campaign-boundary research file. Main/push and CI are outside this readiness package; CI for the subsequent #334 target is owned by pane %6. `check-task-sync` reports no substantive changes and `check-task-workflow --strict` passes for this documentation-only package.
