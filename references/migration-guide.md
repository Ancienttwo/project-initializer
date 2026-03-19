# Migration Guide (to 2.4.x)

This guide upgrades existing repositories to current project-initializer conventions.

## Key Changes in 2.4.x

- **Version control**: Single source of truth at `assets/skill-version.json`; version stamped into generated projects at `.claude/.skill-version`.
- **Lifecycle hooks**: 7 hook events (`pre-init`, `post-init`, `pre-assemble`, `post-assemble`, `pre-migrate`, `post-migrate`, `on-version-change`) configured in `assets/skill-hooks.json`.
- **Version consistency checker**: `bun scripts/check-skill-version.ts` validates version sync across `package.json` and `assets/skill-version.json`.
- Shared hook logic lives in `.ai/hooks/`; Claude project hooks route through `.claude/settings.json`.
- `docs/TODO.md` is removed; `tasks/todo.md` is the only task contract.
- `docs/plan.md` is removed; `plans/` is the only source of truth for the active plan.
- `docs/PROGRESS.md` is milestone-only; active execution lives in `tasks/`.
- `scripts/check-task-sync.sh` and `check:task-sync` enforce repo-local task sync.
- `scripts/check-task-workflow.sh` and `check:task-workflow` enforce repo-local workflow integrity.
- Hook input parsing is hybrid (stdin JSON + env/argv fallback).
- BDD/TDD reminders now route by path.
- Runtime mode is configurable via template variables:
  - `{{RUNTIME_MODE}}`
  - `{{RUNTIME_PROFILE}}`
- Question pack is now kept under `assets/initializer-question-pack.v1.json`.
- Plan G/H default package manager is `uv`.

## Automated Migration

```bash
# Preview only
bash scripts/migrate-project-template.sh --repo /path/to/project --dry-run

# Apply migration
bash scripts/migrate-project-template.sh --repo /path/to/project --apply
```

## What the Script Does

1. Syncs hook scripts from `assets/hooks/` to `<repo>/.ai/hooks/`.
2. Writes compatibility shims into `<repo>/.claude/hooks/`.
3. Creates or merges `<repo>/.claude/settings.json` from `settings.template.json`.
4. If `jq` exists, moves `hooks` from `settings.local.json` into `settings.json`.
5. Removes legacy `docs/TODO.md` if present.
6. Ensures tasks-first workflow files exist and normalizes `docs/PROGRESS.md` to milestone-only guidance.
7. Installs `scripts/check-task-sync.sh`, `scripts/ensure-task-workflow.sh`, and `scripts/check-task-workflow.sh`, then injects task workflow scripts into `package.json` when present.
8. Prints a migration report.
9. Keeps Claude hook references valid while moving the shared source of truth to `.ai/hooks/`.

## Manual Follow-up

1. Review `<repo>/.claude/settings.json` for project-specific command exceptions.
2. Confirm `.ai/hooks/` contains the shared repo-local hook implementation.
3. Confirm `.claude/settings.local.json` only contains personal overrides.
4. Run project smoke checks, `check:task-sync`, `check:task-workflow`, and basic hook trigger scenarios.
5. Commit migration in one isolated change-set.
6. If your old docs referenced `governance/` contracts or skill-audit scripts, remove those references and use `assets/initializer-question-pack.v1.json` as the Q&A source of truth.

## Rollback

- Restore `*.bak.<timestamp>` files created by the migration script.
- Or revert the migration commit.
