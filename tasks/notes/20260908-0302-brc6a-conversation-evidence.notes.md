# Implementation Notes: brc6a-conversation-evidence

> **Status**: Active
> **Plan**: plans/plan-20260908-0302-brc6a-conversation-evidence.md
> **Contract**: tasks/contracts/20260908-0302-brc6a-conversation-evidence.contract.md
> **Review**: tasks/reviews/20260908-0302-brc6a-conversation-evidence.review.md
> **Last Updated**: 2026-09-08 03:02
> **Lifecycle**: notes

## Design Decisions

- Retain raw history as an observation; never infer missing call arguments from result URLs or answer text.

- This successor work-package starts at accepted provider closeout 60d4b4dd. Verification uses explicit REPO_HARNESS_DIFF_BASE=60d4b4dd so the prior accepted product delta is not reclassified as this documentation slice. The linked worktree retained its older base metadata; no metadata or main WIP is rewritten.

- Policy review_base remains origin/main and includes the prior accepted provider product. Its unchanged focused baseline vx-2b525d873c704a5bb9f5 is explicitly mapped, plus this slice task-sync delta; policy is not weakened and no old source is retested.

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
