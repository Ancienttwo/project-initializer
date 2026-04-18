# Migration Guide (to 3.2.x)

This guide upgrades existing repositories to current project-initializer conventions.

## Key Changes in 3.2.x

- **Version control**: single source of truth at `assets/skill-version.json`; version stamped into generated projects at `.claude/.skill-version`.
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
- Helper scripts now include `new-spec.sh`, `new-sprint.sh`, `prepare-handoff.sh`, `verify-sprint.sh`, and `check-agent-tooling.sh`.
- Hook input parsing is hybrid (stdin JSON + env/argv fallback).
- Shared hooks understand current Claude Code fields such as `prompt`, `session_id`, `transcript_path`, `memory_type`, and `load_reason`.
- BDD/TDD reminders now route by path.
- Runtime mode is configurable via template variables:
  - `{{RUNTIME_MODE}}`
  - `{{RUNTIME_PROFILE}}`
- Question pack is now kept under `assets/initializer-question-pack.v4.json` (with older packs retained for compatibility reads).
- Plan G/H default package manager is `uv`.
- `.ai/harness/policy.json` now carries an `external_tooling` profile:
  - `complex -> gstack`
  - `simple -> Waza`
  - `knowledge -> gbrain`
  - hosts: `claude-code`, `codex`
  - mode: `guidance-only`
  - detection: `init-migrate`
  - `gbrain.mcp: candidate-disabled`

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
5. Removes legacy `docs/TODO.md` if present and removes `docs/plan.md` when migrating a repo that still carries the old plan pointer.
6. Ensures `docs/spec.md`, `tasks/todo.md`, `tasks/lessons.md`, `tasks/research.md`, `tasks/contracts/`, `tasks/reviews/`, and `.ai/harness/*` exist.
7. Merges missing `external_tooling` defaults into `<repo>/.ai/harness/policy.json` without overwriting explicit user values.
8. Installs workflow helpers including `new-spec.sh`, `new-sprint.sh`, `prepare-handoff.sh`, `verify-sprint.sh`, `check-task-sync.sh`, `check-agent-tooling.sh`, `ensure-task-workflow.sh`, and `check-task-workflow.sh`.
9. Copies the current shared harness reference configs into `docs/reference-configs/`, including external tooling guidance.
10. Injects `check:task-sync`, `check:context-files`, and `check:task-workflow` into `package.json` when present.
11. Prints a migration report with an external tooling advisory section.
12. Keeps Claude hook references valid while moving the shared source of truth to `.ai/hooks/`.
13. Never auto-installs or auto-upgrades gstack/Waza/gbrain, never starts `gbrain serve`, and never enables MCP automatically.

## External Tooling Safety Contract

Use `bash scripts/check-agent-tooling.sh` for advisory checks only.

The detector is intentionally read-only. It may call:

- `git -C <gstack-dir> remote get-url origin`
- `git -C <gstack-dir> rev-parse HEAD`
- `git -C <gstack-dir> ls-remote --symref origin HEAD`
- `npx -y skills ls -g --json`
- `npx -y skills check`
- `gbrain doctor --json`
- `gbrain check-update --json`
- `gbrain integrations list --json`

The migration flow must not treat these as probes:

- `gstack setup`
- `gstack setup --help`
- `npx skills update`
- `gbrain serve`
- `gbrain sync`
- `gbrain upgrade`

## Manual Follow-up

1. Review `<repo>/.claude/settings.json` for project-specific command exceptions.
2. Confirm `.ai/hooks/` contains the shared repo-local hook implementation.
3. Confirm `.claude/settings.local.json` only contains personal overrides.
4. Confirm `docs/spec.md`, `tasks/reviews/`, and `.ai/harness/` exist and match the repo’s live workflow.
5. Confirm repo-local Skill Factory and old auto-memory artifacts were removed from `.claude/`, `.ai/hooks/`, and `scripts/`.
6. Confirm `.ai/harness/policy.json` contains the expected `external_tooling` profile and that explicit repo overrides were preserved.
7. Review the migration report's external tooling advisory section:
   - does gstack/Waza/gbrain presence match the local machine?
   - does `gbrain` stay advisory/manual-only when MCP is disabled?
   - are install and upgrade commands appropriate for the target hosts?
8. Run `bash scripts/check-agent-tooling.sh --host both --check-updates` inside the migrated repo if you want a fresh advisory snapshot.
9. Run project smoke checks, `check:task-sync`, `check:task-workflow`, and basic hook trigger scenarios.
10. Run `bash scripts/prepare-handoff.sh migration` if the migration changed the active task state.
11. Run `bash scripts/verify-sprint.sh` when the repo already has an active sprint review flow.
12. Commit migration in one isolated change-set.
13. If your old docs referenced `governance/` contracts or skill-audit scripts, remove those references and use `assets/initializer-question-pack.v4.json` as the Q&A source of truth.

## Rollback

- Restore `*.bak.<timestamp>` files created by the migration script.
- Or revert the migration commit.
