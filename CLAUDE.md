# project-initializer CLAUDE.md

This repository dogfoods the `project-initializer` workflow. Treat it as a Bun + TypeScript skill/tooling repo whose job is to generate, migrate, and validate tasks-first AI project scaffolding for Claude and Codex.

## Read First

- `tasks/todo.md`
- `tasks/lessons.md`

## Load On Demand

- `tasks/research.md` for codebase findings and migration quirks
- `plans/` for any active implementation plan
- `docs/reference-configs/ai-workflows.md`
- `docs/reference-configs/development-protocol.md`
- `docs/reference-configs/workflow-orchestration.md`

## Repo-Specific Rules

- Keep this file concise; route detailed policy into `docs/reference-configs/`.
- Treat `.ai/hooks/` as the shared automation layer and `.claude/settings.json` as the Claude adapter.
- When changing bootstrap or migration behavior, update the matching tests in `tests/`.
- Prefer additive migration behavior over destructive replacement.
- Preserve the distinction between milestone tracking in `docs/PROGRESS.md` and active work tracking in `tasks/`.

## Verification Defaults

Run these when touching scaffolding, migration, hooks, or workflow contracts:

```bash
bun test
bash scripts/check-task-sync.sh
bash scripts/check-task-workflow.sh --strict
bash scripts/migrate-project-template.sh --repo . --dry-run
```
