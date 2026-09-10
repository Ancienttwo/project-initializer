> **Archived**: 2026-09-08 03:25
> **Related Plan**: plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260908-0325
> **Archive Projection V1**: `plans/plan-20260908-0302-brc6a-conversation-evidence.md` => `plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md`
> **Archive Projection V1**: `tasks/notes/20260908-0302-brc6a-conversation-evidence.notes.md` => `tasks/archive/notes-20260908-0325-brc6a-conversation-evidence.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0302-brc6a-conversation-evidence.contract.md` => `tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0302-brc6a-conversation-evidence.review.md` => `tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md`

# Implementation Notes: brc6a-conversation-evidence

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-0302-brc6a-conversation-evidence.md
> **Contract**: tasks/archive/contract-20260908-0325-brc6a-conversation-evidence.md
> **Review**: tasks/archive/review-20260908-0325-brc6a-conversation-evidence.md
> **Last Updated**: 2026-09-08 03:02
> **Lifecycle**: notes

## Design Decisions

- Retain raw history as an observation; never infer missing call arguments from result URLs or answer text.

- This docs-only slice has a separate canonical worktree based on main33c5012e. Inherited provider code and its contract-scoped test evidence remain in their accepted package; no cross-contract baseline import, policy change or old test rerun is required.

## Deviations From Plan Or Spec

- pnpm attempted reinstall with shared node_modules; refused before mutation. Executed package compiler and build:vendor directly.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| Session/reattach integration | Deferred | No verified original request producer exists; avoid widening execution authority. |

## Open Questions

- Historical fetch_file requests are absent despite both pagination flags being false.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promoted to docs/researches/20260908-brc6a-conversation-history-evidence.md.
