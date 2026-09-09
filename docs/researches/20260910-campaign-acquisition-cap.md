# Campaign acquisition cap and completion

Campaign successful acquisitions count admitted tasks. Reaching the cap must reject another acquisition without revoking the remaining dispatch/provider budget needed to finish admitted tasks. Non-campaign autonomous loops retain their original eager global exhaustion behavior.

The observed cap1 run charged one successful acquisition and immediately sealed budget_exhausted; dispatch_attempt then failed before worker execution. Root cause: budget-store.ts exhaustionRefusal treated acquisition equality as global exhaustion, and reservation admission also persisted a global stop for acquisition-only cap refusals. The core reservation evaluator already rejects increments exceeding the cap under the serialized store lock.

The correction skips only campaign acquisition equality in post-operation exhaustion and avoids a global stop for a campaign acquisition-only refusal. Counters, operation-derived reservation sizes, exclusive locking, all other metrics, deadlines, and existing stop receipts remain authoritative. Over-limit durable consumption still fails closed. No historical stopped run is revived, no cap is increased, and no schema or second budget authority is introduced.

Evidence: tests/effects/campaign-acquisition-cap.test.ts covers cap1, extra acquisition refusal without state mutation, worker/verifier dispatch, a modeled provider reservation and settlement, runner exhaustion, and persistent stop receipt rejection. Existing issue-282 core/store/contention tests cover non-campaign behavior and crash/reconciliation boundaries; campaign-settled-resume covers retained recovery proof. Pre-fix failure is tasks/evidence/campaign-acquisition-cap-pre-fix.log.

This source change requires rebuilding the frozen campaign image and rebinding source/CI/image/preflight evidence before BRC continuation. It does not itself prove BRC14/BRC15 acceptance.
