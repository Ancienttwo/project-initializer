# Task Execution Checklist (Primary)

> **Source Plan**: (none)
> **Status**: Idle
> Generate the next execution checklist from an approved plan with:
>   bash scripts/plan-to-todo.sh --plan plans/plan-YYYYMMDD-HHMM-slug.md

## Execution
- [ ] No active execution checklist

## Last Completed Work
- [x] Added `assets/workflow-contract.v1.json` and installed `.ai/harness/workflow-contract.json` into generated and self-hosted workflow surfaces
- [x] Added `scripts/inspect-project-state.ts` for structured routing and repo drift classification
- [x] Added `scripts/migrate-workflow-docs.ts` to preserve and migrate legacy workflow documents
- [x] Wired `create-project-dirs.sh`, `init-project.sh`, `migrate-project-template.sh`, and `check-task-workflow.sh` to the shared workflow contract
- [x] Added parity and migration coverage for the runtime contract, hook assets, and legacy-doc migration

## Review Section
- Verification evidence:
- `bun test`
- `bash scripts/check-task-sync.sh`
- `bash scripts/check-task-workflow.sh --strict`
- `bun scripts/inspect-project-state.ts --repo . --format text`
- `bash scripts/migrate-project-template.sh --repo . --dry-run`
- Behavior diff notes:
- Workflow inventory is now driven by a machine-readable contract manifest instead of repeated shell lists.
- Legacy workflow docs are migrated by a dedicated script before the main workflow refresh runs.
- Self-hosted `.ai/hooks/` is now covered by parity tests against `assets/hooks/`.
- Risks / follow-ups:
- Decide whether `ensure-task-workflow.sh` should synthesize a fallback runtime contract manifest for partially migrated repos.
