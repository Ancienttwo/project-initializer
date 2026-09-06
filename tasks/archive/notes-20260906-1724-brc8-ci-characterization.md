> **Archived**: 2026-09-06 17:24
> **Related Plan**: plans/archive/plan-20260906-1702-brc8-ci-characterization.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260906-1724
> **Archive Projection V1**: `plans/plan-20260906-1702-brc8-ci-characterization.md` => `plans/archive/plan-20260906-1702-brc8-ci-characterization.md`
> **Archive Projection V1**: `tasks/notes/20260906-1702-brc8-ci-characterization.notes.md` => `tasks/archive/notes-20260906-1724-brc8-ci-characterization.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1702-brc8-ci-characterization.contract.md` => `tasks/archive/contract-20260906-1724-brc8-ci-characterization.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1702-brc8-ci-characterization.review.md` => `tasks/archive/review-20260906-1724-brc8-ci-characterization.md`

# Implementation Notes: brc8-ci-characterization

> **Status**: Active
> **Plan**: plans/archive/plan-20260906-1702-brc8-ci-characterization.md
> **Contract**: tasks/archive/contract-20260906-1724-brc8-ci-characterization.md
> **Review**: tasks/archive/review-20260906-1724-brc8-ci-characterization.md
> **Last Updated**: 2026-09-06 17:02
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

## Root cause and verification

CI 34022628870 on 2fbd9060 failed exactly tests/characterization/repair-campaign-authority-freeze.test.ts. Local pre-fix evidence /tmp/brc8-ci-characterization-before.txt reproduces 28 pass/1 fail. The claim spy is invoked, but its exception is returned by the BRC8 Fleet capacity admission catch as authorization_stale with message __spy__claim. The control now asserts that exact result; calls==['claim'], both prompt negatives, the no-write assertion, and all frozen bytes are unchanged. Full file passes 29 tests/587 assertions in /tmp/brc8-ci-characterization-after.txt. All six root integrity checks pass (/tmp/brc8-ci-integrity-{0..5}.txt). Quick parent review finds no remaining delta defect. This is a test-only assertion adaptation, not a runtime error-classification redesign. The sibling sweep found only this spy-throw expectation in the characterization file; CI reported no other failing file.

BRC9 readiness was independently traced against current main: per-group authoring limits are implemented, but campaign-step/provider-call limits, transient-failure streak, per-task repair accounting and pre-adoption attempt identity remain absent. The existing consume-only sprint boundary still blocks BRC9 implementation; extending upstream contracts requires an explicit scope decision.

## Final acceptance

Canonical run-20260906T172313-33968 passes 15/15 and reuses the frozen characterization/type passes (317ms/2684ms). Typed user_waiver receipt sha256:ef3517741082bcca79e19548aa8df12b20b24656484d78883b4e8296ade27555 targets c3bf07ea8e79af18e90e73c325d5724ca41dee3c, issued 2026-09-06T09:24:10.424Z. Owner acceptance continues the approved BRC8 behavior after the user instructed go on on the presented test-only correction. No second provider pass is claimed.
