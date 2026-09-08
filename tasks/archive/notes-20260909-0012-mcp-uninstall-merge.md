> **Archived**: 2026-09-09 00:12
> **Related Plan**: plans/archive/plan-20260909-0010-mcp-uninstall-merge.md
> **Outcome**: Completed
> **Lifecycle**: notes
> **Parent Run ID**: run-20260909-0012
> **Archive Projection V1**: `plans/plan-20260909-0010-mcp-uninstall-merge.md` => `plans/archive/plan-20260909-0010-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/notes/20260909-0010-mcp-uninstall-merge.notes.md` => `tasks/archive/notes-20260909-0012-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0010-mcp-uninstall-merge.contract.md` => `tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0010-mcp-uninstall-merge.review.md` => `tasks/archive/review-20260909-0012-mcp-uninstall-merge.md`

# Implementation Notes: mcp-uninstall-merge

> **Status**: Active
> **Plan**: plans/archive/plan-20260909-0010-mcp-uninstall-merge.md
> **Contract**: tasks/archive/contract-20260909-0012-mcp-uninstall-merge.md
> **Review**: tasks/archive/review-20260909-0012-mcp-uninstall-merge.md
> **Last Updated**: 2026-09-09 00:10
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

## Integration evidence
- User approved merge. main and origin/main are fe35f0a9; MCP branch rebased conflict-free.
- Eight changed MCP source/test files are byte-identical to reviewed f3b96cfd. Original two specialist PASS verdicts and final installed tarball six-command smoke remain valid for those bytes.
- Only workflow integration metadata is newly authored. Original archived contract and notes restored exactly; prior history stays sealed.
- Current-base checks cover the same 91 focused tests, typecheck and six integrity commands; no full-suite trigger.

> **Substantive Change SHA256**: `sha256:92004d8bad8d6cc4f35c5222a58f7483604123a7d067a1b50b6c9620e39d0b16`
