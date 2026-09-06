> **Archived**: 2026-09-06 23:51
> **Related Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-2351
> **Archive Projection V1**: `plans/plan-20260906-2257-brc9-heartbeat-budget-consumption.md` => `plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260906-2257-brc9-heartbeat-budget-consumption.notes.md` => `tasks/archive/notes-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260906-2257-brc9-heartbeat-budget-consumption.contract.md` => `tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260906-2257-brc9-heartbeat-budget-consumption.review.md` => `tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md`

# Implementation Notes: brc9-heartbeat-budget-consumption

> **Status**: Active
> **Plan**: plans/archive/plan-20260906-2257-brc9-heartbeat-budget-consumption.md
> **Contract**: tasks/archive/contract-20260906-2351-brc9-heartbeat-budget-consumption.md
> **Review**: tasks/archive/review-20260906-2351-brc9-heartbeat-budget-consumption.md
> **Last Updated**: 2026-09-06 23:18
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:b182030cfc97ce91e4ae27e2393c64e612dced5dfd2030152eecdd73874d7357`

## Design Decisions

- The existing budget ledger owns all admission, call counts, usage and progress. Provider execution writes immutable outcome evidence under the same run store before closing usage; the outcome files are not counters. Evidence does not enter the heartbeat journal, so observation cannot invalidate that journal's compare-and-swap snapshot.
- Provider invocation keys bind the admitted step and call ordinal. Operation and request stay in the immutable reservation context, so changing a request at the same ordinal is refused rather than receiving another key. A replayed reservation never authorizes another provider invocation.
- A typed GitHub read failure records a returned adapter failure and consumes its call. Unknown read errors and all mutation errors retain the reservation; a timeout cannot prove a remote mutation did not happen.
- The heartbeat's durable receipt precedes its budget completion. Same-key replay can recover only an existing admission; replay-only admission cannot mint authority for an old unadmitted execution. Completed usage remains exact and cannot be rebound to another provider outcome.
- No-work idle and expired-intent responses remain pre-admission decisions with no provider access. They cannot consume another admission when the campaign is already exhausted or an abandoned authoring invocation needs reconciliation. Admitted work alone updates controller-step and no-progress accounting.

## Deviations From Plan Or Spec

- The integration replaces a former two-step journal-CAS interleaving with an earlier budget-admission refusal. The updated concurrency control proves the competing key performs no provider observation and cannot add a journal reservation. Same-key journal convergence remains covered.
- Source Ref now names docs/researches/20260905-repair-campaign-sprint-execution-boundaries.md. The partial package must not trigger canonical finish's sprint-row backfill. No lifecycle helper or new source-ref protocol was introduced.

## Tradeoffs Considered

- Counting one snapshot was rejected because repository identity and each page are separate provider invocations.
- Writing provider evidence into the heartbeat journal was rejected because those writes would invalidate its independent mutation decision snapshot.
- Reusing an already admitted provider call by executing again was rejected: a crash may have occurred after I/O. Exact receipt recovery or explicit reconciliation is required instead.

## Open Questions

- The coordinator froze local main at 61db011d9733b09b18b5ee249ac0e2b481cadf28. This worktree integrated its sprint-only correction and records that exact base in worktree metadata. The coordinator owns formal review, acceptance, canonical finish and main/push. The coordinator published the frozen target; HEAD, main and origin/main resolve to 61db011d before implementation commit. The policy-selected origin/main target therefore matches the integrated base.
- BRC9 remains incomplete: adoption's post-seal source-drift/recovery semantics, writable dispatch/native attempt binding, per-task repair accounting and transient retry policy are separate packages. No Task/Claim/Lease is fabricated for authoring.
- In-flight authoring remains an unresolved external reservation until existing authoritative reconciliation closes it. This package does not add an authoring-session recovery protocol or let a second provider call bypass that reservation.

## Evidence Links

- Baseline prerequisite: cda7da08583d31c2760cf945a3cde3881dea81e1; required CI 34040061287 completed success.
- Development provider-boundary run: /tmp/brc9-provider-development.log (7/7 before the additional replay-only control).
- Existing heartbeat integration run: /tmp/brc9-heartbeat-development-2.log (20/20).
- Actual paginated observer control: /tmp/brc9-heartbeat-pages.log (identity plus two pages and zero-I/O replay).
- Receipt-before-completion crash control: /tmp/brc9-heartbeat-boundary.log (crash control passed; the initial page-count fixture was corrected in the separate page run above).
- Type checking: /tmp/brc9-heartbeat-types-2.log passed before final fixture additions. Final executable evidence and semantic acceptance remain separate from these development checks.

## Promotion Candidates

- The research entry records the immutable evidence boundary, pre-admission idle behavior and the partial-package completion boundary. No external memory export is required.

## Pre-review recovery correction

- Trigger: a completed mutation journal result survives without its heartbeat receipt and without a heartbeat admission, as can occur in legacy BRC5 state. Result/reservation validation does not prove budget admission.
- Root cause: the completed-result recovery branch ran after ordinary admission, allowing historical effects to acquire new admission retroactively.
- Fix: detect the completed result before admission and require replay-only admission for that branch. Ordinary new execution retains ordinary admission.
- Regression evidence: /tmp/brc9-heartbeat-legacy-red.log rejected the old implementation because recovery resolved; /tmp/brc9-heartbeat-legacy-green.log passes all 23 heartbeat tests, including zero new admission/receipt/I/O for legacy result recovery and valid admitted receipt recovery. Type check passed in /tmp/brc9-heartbeat-legacy-types.log.
- Original prepare run-20260906T233231-11604 passed 21/21 (15 named checks executed, zero reused), target 61db011d, subject sha256:6067a76c78864e9030f353e0a5bf1d0b9ed8ef66ca7b2a4e08772fdba61314c5. It remains baseline evidence only; this subsequent correction is not covered by that exact-subject acceptance. No second prepare or external review was started; coordinator owns the final evidence/acceptance boundary.

> **Substantive Change SHA256**: `sha256:80f4ac6da3af48b6711002866e7b11a3f5a167f78d470db65860d16ba9302c44`
> **Substantive Change SHA256**: `sha256:7de43a32c7f49eb82f139d4dee2a1fb4e564c1b9cab582c208f0b913a9706be8`

## Formal review correction: settled read failure

- Root Cause Evidence — trigger: the real GitHub observer throws after a typed network failure. Its provider leaf is durably settled but the heartbeat has no receipt.
- Root Cause Evidence — owning boundary: campaign-step.ts previously reached completeHeartbeat only on observer success, leaving the admitted step active and blocking both same-key replay and the next key.
- Root Cause Evidence — pre-fix proof: /tmp/brc9-heartbeat-read-failure-red.log, one recovery failure and one passing unknown-outcome control.
- Root Cause Evidence — fix and guard: persist observe/no_progress with the existing failed snapshot receipt only when readAutomationBudgetStatus proves no open external reservation; completeCampaignBudgetStep rechecks under its lock. /tmp/brc9-heartbeat-read-failure-green.log passes both controls, including zero-I/O replay and a successful new-key real observation.
- The one official codex-plugin review found this P1 on subject sha256:eb7a0695c2c13662c2ca1329cf4ce460cdc2689d2251d7fabba23e6b7dae52b9; it remains a failed review of that subject. Final corrected acceptance requires Owner disposition and is not an external pass. No second semantic review or local full suite is scheduled.

> **Substantive Change SHA256**: `sha256:a791e47fb6a3a2cc47fe73414b49a18896f3e011985399b81ce1eef57a767b96`
