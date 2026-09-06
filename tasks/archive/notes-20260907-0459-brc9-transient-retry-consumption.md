> **Archived**: 2026-09-07 04:59
> **Related Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0459
> **Archive Projection V1**: `plans/plan-20260907-0348-brc9-transient-retry-consumption.md` => `plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/notes/20260907-0348-brc9-transient-retry-consumption.notes.md` => `tasks/archive/notes-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0348-brc9-transient-retry-consumption.contract.md` => `tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0348-brc9-transient-retry-consumption.review.md` => `tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md`

# Implementation Notes: brc9-transient-retry-consumption

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0348-brc9-transient-retry-consumption.md
> **Contract**: tasks/archive/contract-20260907-0459-brc9-transient-retry-consumption.md
> **Review**: tasks/archive/review-20260907-0459-brc9-transient-retry-consumption.md
> **Last Updated**: 2026-09-07 03:48
> **Lifecycle**: notes

## Design Decisions

- ...

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| ... | ... | ... |

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

## Frozen authority and decisions

The existing grant is the only policy authority and the usage ledger the only counter authority. Absence remains inspectable but cannot authorize new effects. The schema-owning #282 PRD is updated alongside its drift test. Verifier usage settles from a validated final result, not merely process exit; failed contract-run cannot reset the streak. No new dependencies or persistent stores.

## Development evidence

- `/tmp/brc9-transient-policy-red.log`: missing-policy grant admitted a new real step before the fix; expected rejection, received admitted.
- `/tmp/brc9-transient-policy-controls.log`: four core/store controls passed, including capped backoff, replay, acquisition non-reset, exhaustion and unknown reservation.
- `/tmp/brc9-transient-provider-controls.log`: ten provider controls passed, including intervening successful reads and non-transient typed errors.
- `/tmp/brc9-transient-worker-controls.log`: two real worker controls passed, including crash after final persistence but before usage and attempt completion.
- `/tmp/brc9-transient-failed-review-control.log`: failed contract-run with completed result does not reset the streak; exact replay remains failed.
- `/tmp/brc9-transient-budget-neighbors.log`: 129 passed, one schema-document drift; corrected by updating the actual PRD, then `/tmp/brc9-transient-prd-binding.log` passed 3/3. This historical run is not relabeled as all green.
- `/tmp/brc9-transient-campaign-neighbors.log`: 54/54 campaign/authoring/observer/CLI checks passed.

Repair publication `f459cbc0335bdfbc66ee75bc2b4d2d80955a445b` is integrated as the exact target. Merge resolution preserves paired attempt reservations, transient settlement, both regression sets and explicit fixture acquisition limits. Final acceptance requires a frozen canonical prepare. No full-suite pass is claimed for this subject.

## Audit coordination: acquisition/global stop remains a separate decision

The user relayed the completed BRC-claude discussion as information, not authorization for another implementation slice. Preserve current strict global-stop semantics. The repair fixture's acquisition allowance increase isolates that test and is not evidence that the final acquired worker can execute at the acquisition cap. The dedicated research document records the unresolved product contract and all three affected stop/drift paths. No second review or full suite is triggered by this note.

## Final publication binding

Exact target: `f459cbc0335bdfbc66ee75bc2b4d2d80955a445b`. Named consumer checks cover the shared admission and settlement delta; earlier full-suite/prepare evidence retains its original subject.

> **Substantive Change SHA256**: `sha256:036196fe4fad8395c5b9393811169898ef46c2fbbe524bbbc659ce42e6799c19`

## Bounded recovery correction

The unique formal review failed on two reproducible recovery cases. `/tmp/brc9-transient-backoff-red.log` proves a transient refusal published a launch that poisoned the same dispatch. `/tmp/brc9-transient-review-red.log` proves the base final/no_progress settlement conflicts with recomputed transient charge (its first backoff test had an invalid clock fixture, superseded by the dedicated red). Publish launch only after reservation succeeds, under the same planning lock; retain launch fencing for unknown execution. Read a settled event through the budget store only after exact reservation and result evidence validation, preserving its immutable charge rather than deriving a new historical outcome. No new dependency, ledger, migration parser, or global-stop semantics. At 10x load the existing per-campaign planning lock serializes admission; child execution remains outside it.

Final recovery correction against `f459cbc0`, after ordinary projection:

> **Substantive Change SHA256**: `sha256:7ecf9b5dbbeda3632994875ec5f005eb98bb83279d23ab3d8b96d94bff6acf54`
