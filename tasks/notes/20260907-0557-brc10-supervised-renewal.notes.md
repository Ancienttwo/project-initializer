# Implementation Notes: brc10-supervised-renewal

> **Status**: Active
> **Plan**: plans/plan-20260907-0557-brc10-supervised-renewal.md
> **Contract**: tasks/contracts/20260907-0557-brc10-supervised-renewal.contract.md
> **Review**: tasks/reviews/20260907-0557-brc10-supervised-renewal.review.md
> **Last Updated**: 2026-09-07 05:57
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
# Blocking policy serialization correction

- root_cause: `src/core/state/lease-liveness.ts:107` compared JSON property order with builder order; canonical grant storage sorts nested keys, so an unchanged authenticated policy failed on readback.
- repro: `bun test --timeout 60000 tests/unit/brc10-supervised-renewal.test.ts`
- regression_guard: `tests/unit/brc10-supervised-renewal.test.ts` covers reordered valid policy and rejects stale values, forged digest and extra keys.
- pre_fix_failure_artifact: `.ai/harness/runs/brc10-liveness-policy-pre-fix.log` records 2 pass / 1 fail and `PRE_FIX_EXIT=1`.

This is the first directly blocking out-of-scope correction. Exact field validation and the builder-owned digest remain authoritative; no stored policy is rewritten or inferred. A second out-of-scope discovery stops this package for disposition.
