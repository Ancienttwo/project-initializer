> **Archived**: 2026-09-07 03:11
> **Related Plan**: plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260907-0311
> **Archive Projection V1**: `plans/plan-20260907-0203-brc9-adoption-provider-accounting.md` => `plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/notes/20260907-0203-brc9-adoption-provider-accounting.notes.md` => `tasks/archive/notes-20260907-0311-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/contracts/20260907-0203-brc9-adoption-provider-accounting.contract.md` => `tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md`
> **Archive Projection V1**: `tasks/reviews/20260907-0203-brc9-adoption-provider-accounting.review.md` => `tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md`

# Implementation Notes: brc9-adoption-provider-accounting

> **Status**: Active
> **Plan**: plans/archive/plan-20260907-0203-brc9-adoption-provider-accounting.md
> **Contract**: tasks/archive/contract-20260907-0311-brc9-adoption-provider-accounting.md
> **Review**: tasks/archive/review-20260907-0311-brc9-adoption-provider-accounting.md
> **Last Updated**: 2026-09-07 02:04
> **Lifecycle**: notes

## Design Decisions

- Integrated committed shadow package ce5e42d3 in 44cb9368; retained its strict full-ledger terminal and same-lock completion/seal. Main's five audit documents were not imported or edited.
- Active continuation is an explicit separate proof: historical terminal plus current ledger digest and completed successor events. The shared read/verify API remains strict. Only fully settled same-group/intent GitHub reads can extend the seal; mutations, foreign groups, challenges and unknown outcomes refuse continuation.
- Publication recovery first completes its own durably observed step bookkeeping, then validates continuation, performs a fresh source probe, compares exact revisions and validates again. This does not reuse an old snapshot as fresh evidence.

## Deviations From Plan Or Spec

- Shadow owner alignment narrowed the original shared-prefix proposal into an active-only continuation API. This protects already accepted strict shadow semantics.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| ... | ... | ... |

## Open Questions

- None.

## Evidence Links

Final publication `cae23fe4` against `7102269c` includes the generated automation-budget architecture size-band update as well as code/tests. The earlier pre-projection digest below remains baseline evidence only.

> **Substantive Change SHA256**: `sha256:0e0dba3e9154aca67b006ec7ffbd15f0ee5716ddb29755a497ee168baad583ef`

CI run 34054157236 stopped at task-sync before tests because this final digest was absent. The same direct-base check reproduced locally and passes with this evidence binding; no product code or acceptance subject was changed by the correction.

Publication delta against ce5e42d3 (production and tests frozen):

> **Substantive Change SHA256**: `sha256:ff9fb80e5c924721884103ea74345380829128ed3a8150e1c2bab63810a82c98`

### Terminal contract alignment controls

On production commit 751124a0, after replacing the ambiguous plan/contract wording with the two explicit proof contracts, this command passed 10/10 with 36 assertions (26 unrelated tests filtered out):

```bash
bun test tests/unit/campaign-authoring-budget-prerequisite.test.ts tests/effects/issue-batch-shadow-budget.test.ts tests/effects/issue-batch-adoption.test.ts -t 'exact readonly post-seal|active continuation rejects|shadow rejects its old terminal|publication recovery completes durable|unknown active read|active provider cap|post-seal .* mutation'
```

Output: `/tmp/brc9-terminal-alignment-controls.log`. The tests cover paired strict rejection/active continuation, comment/close/foreign-group refusal, real shadow replay rejection after a settled read, publication recovery, unknown reads, cap refusal and title/label drift. `bash scripts/check-task-workflow.sh --strict` passed (`/tmp/brc9-terminal-alignment-workflow.log`). This is bounded alignment evidence, not a new full review or final BRC9 acceptance; the earlier 29-test integration run remains its original pre-alignment baseline.

> **Substantive Change SHA256**: `sha256:6a113b8642afee77f250a4536740f3173ec83021462c87679ad9fcd95c82782b`

- /tmp/brc9-active-recovery-green.log: 1/1 after the actual persistence-fault red.
- /tmp/brc9-continuation-negative-green.log: 4/4 mutation/foreign-group/shadow-strict controls. The initial four fixture failures supplied empty completion evidence; corrected fixtures supply exact result evidence before testing the proof boundary.
- /tmp/brc9-active-unknown-cap.log: 2/2, unknown external outcome retains one reservation and no repeated call; exhausted provider budget refuses before I/O.
- /tmp/brc9-active-final-type.log: TypeScript pass. /tmp/brc9-active-integrity-{0..5}.log covers SQL, architecture, task-sync, strict workflow, project state and init dry-run. The first task-sync result requires the current digest above; rerun after binding.
- No final prepare or semantic review has been run for this integrated subject. Origin remains cea2225e while the committed integration base is ce5e42d3; previous evidence keeps its original target.

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Initial integrated baseline: /tmp/brc9-adoption-shadow-integration.log, 29/29. Explicit strict/continuation split: /tmp/brc9-explicit-continuation.log, 29/29. Both are development evidence for their original snapshots, not final acceptance.
- Publication recovery red: /tmp/brc9-active-recovery-red.log, durable snapshot followed by injected completion-write failure causes the next call to reject its still-active step before recovery. Green is tracked separately.

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
