# Task Execution Checklist (Primary)

> **Source Plan**: (none)
> **Status**: Idle
> Generate the next execution checklist from an approved plan with:
>   bash scripts/plan-to-todo.sh --plan plans/plan-YYYYMMDD-HHMM-slug.md

## Execution
- [ ] No active execution checklist

## Last Completed Work
- [x] Migrated this repository to the shared tasks-first workflow surface
- [x] Synced `.ai/hooks/` and `.claude/hooks/` into the repo-local contract
- [x] Added root `CLAUDE.md` / `AGENTS.md` routing docs for self-hosting
- [x] Fixed self-migration edge cases in `project-init-lib.sh`

## Review Section
- Verification evidence:
- `bun test`
- `bash scripts/check-task-sync.sh`
- `bash scripts/check-task-workflow.sh --strict`
- `bash scripts/migrate-project-template.sh --repo . --dry-run`
- Behavior diff notes:
- Repository now self-hosts the same migration and workflow contract it generates for downstream repos.
- Risks / follow-ups:
- Keep root routing docs aligned if template routing conventions change.
