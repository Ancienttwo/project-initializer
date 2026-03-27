# Migration Guide (to 3.0.x)

This guide upgrades existing repositories to current project-initializer conventions.

## Key Changes in 3.0.x

- **Version control**: Single source of truth at `assets/skill-version.json`; version stamped into generated projects at `.claude/.skill-version`.
- **Lifecycle hooks**: 7 hook events (`pre-init`, `post-init`, `pre-assemble`, `post-assemble`, `pre-migrate`, `post-migrate`, `on-version-change`) configured in `assets/skill-hooks.json`.
- **Version consistency checker**: `bun scripts/check-skill-version.ts` validates version sync across `package.json` and `assets/skill-version.json`.
- Shared hook logic lives in `.ai/hooks/`; Claude project hooks route through `.claude/settings.json`.
- Stable product truth lives in `docs/spec.md`.
- `plans/` is the only source of truth for the active plan; any `docs/plan.md` pointer is legacy drift and should be removed during migration.
- Sprint done definitions live in `tasks/contracts/` and `tasks/reviews/`.
- Structured verification and resumable state live in `.ai/harness/checks/latest.json` and `.ai/harness/handoff/current.md`.
- `docs/TODO.md` is removed; `tasks/todo.md` is the only task contract.
- `docs/PROGRESS.md` is milestone-only; active execution lives in `tasks/` and `.ai/harness/`.
- `scripts/check-task-sync.sh` and `check:task-sync` enforce repo-local task sync.
- `scripts/check-task-workflow.sh` and `check:task-workflow` enforce repo-local workflow integrity.
- Helper scripts now include `new-spec.sh`, `new-sprint.sh`, `prepare-handoff.sh`, and `verify-sprint.sh`.
- Hook input parsing is hybrid (stdin JSON + env/argv fallback).
- Shared hooks understand current Claude Code fields such as `prompt`, `session_id`, `transcript_path`, `memory_type`, and `load_reason`.
- Generated projects now install a read-only Claude auto memory intake hook at `SessionStart`.
- BDD/TDD reminders now route by path.
- Runtime mode is configurable via template variables:
  - `{{RUNTIME_MODE}}`
  - `{{RUNTIME_PROFILE}}`
- Question pack is now kept under `assets/initializer-question-pack.v2.json`.
- Plan G/H default package manager is `uv`.

## Automated Migration

```bash
# Preview only
bash scripts/migrate-project-template.sh --repo /path/to/project --dry-run

# Apply migration
bash scripts/migrate-project-template.sh --repo /path/to/project --apply
```

## What the Script Does

1. Syncs hook scripts from `assets/hooks/` to `<repo>/.ai/hooks/`, including the memory intake hook and shared memory helpers.
2. Writes compatibility shims into `<repo>/.claude/hooks/`.
3. Creates or merges `<repo>/.claude/settings.json` from `settings.template.json`.
4. If `jq` exists, moves `hooks` from `settings.local.json` into `settings.json`.
5. Removes legacy `docs/TODO.md` if present and removes `docs/plan.md` when migrating a repo that still carries the old plan pointer.
6. Ensures `docs/spec.md`, `tasks/todo.md`, `tasks/lessons.md`, `tasks/research.md`, `tasks/contracts/`, `tasks/reviews/`, and `.ai/harness/*` exist.
7. Installs workflow helpers including `new-spec.sh`, `new-sprint.sh`, `prepare-handoff.sh`, `verify-sprint.sh`, `check-task-sync.sh`, `ensure-task-workflow.sh`, and `check-task-workflow.sh`.
8. Copies the 3.0 harness reference configs into `docs/reference-configs/`.
9. Injects `check:task-sync` and `check:task-workflow` into `package.json` when present.
10. Prints a migration report.
11. Keeps Claude hook references valid while moving the shared source of truth to `.ai/hooks/`.
12. Preserves read-only auto memory behavior; shared project settings still do not manage `autoMemoryDirectory`.

## Manual Follow-up

1. Review `<repo>/.claude/settings.json` for project-specific command exceptions.
2. Confirm `.ai/hooks/` contains the shared repo-local hook implementation.
3. Confirm `.claude/settings.local.json` only contains personal overrides.
4. Confirm `docs/spec.md`, `tasks/reviews/`, and `.ai/harness/` exist and match the repo’s live workflow.
5. If Claude auto memory is enabled, confirm `.claude/.memory-context.json` and `.claude/.memory-snapshot.json` stay ignored and are not committed.
6. Run project smoke checks, `check:task-sync`, `check:task-workflow`, and basic hook trigger scenarios.
7. Run `bash scripts/prepare-handoff.sh migration` if the migration changed the active task state.
8. Run `bash scripts/verify-sprint.sh` when the repo already has an active sprint review flow.
9. Commit migration in one isolated change-set.
10. If your old docs referenced `governance/` contracts or skill-audit scripts, remove those references and use `assets/initializer-question-pack.v2.json` as the Q&A source of truth.

## Rollback

- Restore `*.bak.<timestamp>` files created by the migration script.
- Or revert the migration commit.
