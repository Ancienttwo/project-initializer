> **Archived**: 2026-09-07 00:58
> **Related Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0058
> **Archive Projection V1**: `plans/plan-20260907-0010-brc9-writable-dispatch-attempt.md` => `plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/notes/20260907-0010-brc9-writable-dispatch-attempt.notes.md` => `tasks/archive/notes-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0010-brc9-writable-dispatch-attempt.contract.md` => `tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0010-brc9-writable-dispatch-attempt.review.md` => `tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md`

# Implementation Notes: brc9-writable-dispatch-attempt

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0010-brc9-writable-dispatch-attempt.md
> **Contract**: tasks/archive/contract-20260907-0058-brc9-writable-dispatch-attempt.md
> **Review**: tasks/archive/review-20260907-0058-brc9-writable-dispatch-attempt.md
> **Last Updated**: 2026-09-07 00:10
> **Lifecycle**: notes

## Design Decisions

- The projected contract is byte-bound after acquisition; its lifecycle projection can differ from the canonical proof input. Canonical proof and current projected bytes are checked separately.

## Deviations From Plan Or Spec

- None recorded.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Existing contract-run | Selected | Owns the actual bounded worker/verifier processes and sole worker execution-boundary injection. |
| New runtime dispatch authority | Rejected | Existing wake effects do not represent task worker launches; inventing that join would create another authority. |

## Open Questions

- Final frozen-subject verification, independent review and acceptance remain pending.
- Historical replay after Lease loss and unresolved launch reconciliation are separate boundaries; BRC9 remains pending.

> **Substantive Change SHA256**: `sha256:ef7c796e8870a6f7afe8e95da237b83791925dc885217a6912370250577e9b4d`

## Verification scope

- Base: 0155acb01a6a79c0bf34376c974d6214e27fae38; upstream CI 34044240157 reported green for that subject. It is not evidence for this implementation.
- Development: acquisition 10/10; contract-run 32/32; worker crash/ownership controls 6/6 with one budget fixture failure, followed by the corrected budget control 1/1. The fixture originally assumed planning had consumed no invocation headroom; it now observes the same budget authority and its explicit stop.
- Named tests cover acquisition, actual host execution, invocation accounting and existing attempt projection. No uncovered integration risk justifies another local full suite. Final evidence is produced through canonical prepare after freezing.
- Durable interface: `docs/researches/20260907-brc9-writable-dispatch-attempt.md`.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.

## Formal review correction

- Original frozen subject: `sha256:25e471864fdfd65153d3c78a9f8df7c24f6362367bd45181c88f8f9e963571ba`, target `0155acb01a6a79c0bf34376c974d6214e27fae38`, passing prepare `run-20260907T004146-56975` (18/18; 12 named checks executed). Its sole codex-plugin review returned one P1 and remains FAIL for that original subject.
- root_cause: `scripts/contract-run.ts` replay constructed `status=pass` from campaign final evidence while the first run could be `missing_review`. The final record omitted the owning helper's status.
- repro: real acquisition with a declared absent Review File, successful worker/verifier and explicit completed execution result; first run exits 1, identical packaged-helper replay exits 0.
- regression_guard: `tests/effects/campaign-worker.test.ts`, “missing required Review File stays failed on exact campaign replay without another child”.
- pre_fix_failure_artifact: `/tmp/brc9-worker-review-status-red.log` (expected 1, received 0 on replay).
- Decision: bind actual contract-run status/failure class into immutable final evidence and replay it unchanged. Execution outcome remains separate from helper verification and semantic acceptance. Both source and packaged helper use this record.
- No second external review. Corrected subject needs its own deterministic evidence and exact Owner acceptance; the original external review is never relabeled as passing.

> **Substantive Change SHA256**: `sha256:7cef7c0bff70ce9f003451b432c71d8821264f2cc4b622674894db99325e2a71`

> **Substantive Change SHA256**: `sha256:2dfaaef34fcf0507b0f072af694d7d9178e7fc1ab1988499018f705b90801790`
