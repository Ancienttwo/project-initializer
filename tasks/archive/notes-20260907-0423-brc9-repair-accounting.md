> **Archived**: 2026-09-07 04:23
> **Related Plan**: plans/archive/plan-20260907-0146-brc9-repair-accounting.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0423
> **Archive Projection V1**: `plans/plan-20260907-0146-brc9-repair-accounting.md` => `plans/archive/plan-20260907-0146-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0146-brc9-repair-accounting.notes.md` => `tasks/archive/notes-20260907-0423-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0146-brc9-repair-accounting.contract.md` => `tasks/archive/contract-20260907-0423-brc9-repair-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0146-brc9-repair-accounting.review.md` => `tasks/archive/review-20260907-0423-brc9-repair-accounting.md`

# Implementation Notes: brc9-repair-accounting

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0146-brc9-repair-accounting.md
> **Contract**: tasks/archive/contract-20260907-0423-brc9-repair-accounting.md
> **Review**: tasks/archive/review-20260907-0423-brc9-repair-accounting.md
> **Last Updated**: 2026-09-07 01:47
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:fadb499249095f92e415389c180e981637f2ad1476b02ab9db3ed5eb45bc7c88`

## Design Decisions

- Use canonical offer attempt_count to select the existing retry operation for the first worker child only. Work Package retry policy and Task attempt projection remain authoritative; the budget remains the only owner of repair arithmetic.
- The real retry fixture performs explicit operator release and cleanup of its disposable failed worktree before fresh acquisition. Automatic cleanup/reclaim remains outside this package.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Existing retry reservation | Selected | Already reserves one runner and one repair cycle before the effect. |
| Count each child as repair | Rejected | Would charge verifier execution as a second Task repair. |

## Open Questions

- None.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- `/tmp/brc9-repair-accounting-red.log`: real second attempt completed but repair_cycles was 0 instead of 1.
- `/tmp/brc9-repair-accounting-green.log`: 2/2 real retry/replay and exhaustion controls pass. `/tmp/brc9-repair-type.log` passes. Attempt-policy, SQL, architecture, strict workflow, state and init dry-run checks pass in `/tmp/brc9-repair-integrity-{0,1,2,4,5,6}.log`.
- Final acceptance target will include the separately frozen acquisition correction. No prepare or formal review has been run for this package yet.

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.

## Direct CI blocker: immutable migration identity evidence

Main run 34054783252 had one failing file: the BRC0 identity assertion equated all current Sprint rows to the historical migration receipt despite two explicitly approved insertions. `/tmp/brc9-sprint-identity-red.log` reproduces the failure before the test change. Preserve the receipt unchanged; compare the original identities in their original order and require unique current IDs. Removal, rekeying, duplicate IDs and reordering of migrated rows still fail. This is the package's single directly blocking adjacent correction; no runtime or migration authority changes.

Final publication against `e258d9d1`, after architecture projection and the direct CI correction:

> **Substantive Change SHA256**: `sha256:9f6e25903942c53d1e375f17a0849662c8d93a57f251757d5b0f12494f6ba796`

`bun test --timeout 60000 tests/characterization/repair-campaign-authority-freeze.test.ts` passed 29/29 after the reproduced identity failure. Current acceptance uses the frozen named Verification Plan; earlier repair red/green remains development evidence.

Integrated prepare run-20260907T034634-76672 passed ten checks but exposed the two retry fixtures reaching their total acquisition limit of two after acquisition charging landed. The existing budget correctly stopped before the next worker. Retry fixtures now explicitly authorize three successful acquisitions, leaving headroom for their second worker; default acquisition-limit fixtures remain at two. Production arithmetic is unchanged. Failure log: `.ai/harness/runs/verification-vx-7ee3bac1488744a1988f.log`.

Corrected final publication against `e258d9d1`, after explicit retry fixture acquisition headroom:

> **Substantive Change SHA256**: `sha256:2a32dcdd0f0f04460213d154091b5f68c932b6ef39cf32ba966a99c067ae5878`

`bun test --timeout 60000 tests/effects/campaign-worker.test.ts -t "later Task attempt"` passed 2/2, 20 assertions; `/tmp/brc9-repair-integrated-fixture-green.log`.

## Final-slot admission correction

The unique official review found that settling the final repair cycle after the worker sealed the global budget before verifier admission. `/tmp/brc9-repair-last-slot-red.log` reproduced exactly that failure. Reserve both children before either starts through dispatch_attempt/retry_attempt vectors in the existing ledger, then persist the final before settlement. `/tmp/brc9-repair-last-slot-green.log` passed 1/1 with 11 assertions; `/tmp/brc9-repair-paired-core.log` and `/tmp/brc9-repair-paired-type.log` passed. Verifier admission checks the exact current open reservation and original deadline. No second counter or global exhaustion relaxation is introduced. The original FAIL is retained verbatim in the review artifact; current acceptance is an Owner correction under the existing BRC9 completion approval, not a second external review.

Final paired-attempt publication against `e258d9d1`, after ordinary architecture projection:

> **Substantive Change SHA256**: `sha256:a27de0dd9e0cc328f12b050e31075f5eb6e356136226098f2665e9893456bd1e`

The complete worker file passed 12/12, 82 assertions (`/tmp/brc9-repair-paired-worker-file.log`). Prior prepare and external FAIL retain their original subjects; final verification below must bind the complete attempt correction.
