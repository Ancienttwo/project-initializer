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
- [x] Added 3.1.0 `run_id` plumbing across trace, verification, and task-state artifacts
- [x] Expanded harness defaults to 5 dimensions with `recovery` and `state` profiles plus question-pack `v3`
- [x] Added structured `failure_class` logging and `scripts/summarize-failures.sh` for failure aggregation
- [x] Aligned `summarize-failures.sh` runtime selection with Bun-first helpers while keeping Node fallback
- [x] Documented `hook_structured_error()` shim compatibility for legacy action-only callers

## Review Section
- Verification evidence:
- `bun test`
- `bash scripts/check-task-sync.sh`
- `bash scripts/check-task-workflow.sh --strict`
- `bash scripts/migrate-project-template.sh --repo . --dry-run`
- Behavior diff notes:
- Repository now self-hosts the same migration and workflow contract it generates for downstream repos.
- Trace events, verification reports, and task-state snapshots now share a `run_id` correlation field.
- Generated templates now expose `RECOVERY_PROFILE` and `STATE_PROFILE` defaults via question-pack `v3` and 5-dimensional plan-map profiles.
- Blocking hooks now emit structured `failure_class` metadata and append failure events to `.ai/harness/failures/latest.jsonl`.
- `summarize-failures.sh` now resolves a JS runtime explicitly, preferring `bun` but continuing to work in node-only environments.
- Risks / follow-ups:
- Keep root routing docs aligned if template routing conventions change.
- Revisit whether `.ai/hooks/` and `assets/hooks/` should be mechanically synchronized to reduce drift over time.
