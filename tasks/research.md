# Project — Research Notes

> **Last Updated**: 2026-03-28
> **Scope**: self-host migration, hook layout, and workflow contract surfaces
> **Usage**: Store deep codebase findings and hidden contracts here, not in chat-only summaries.

## Codebase Map
| File | Purpose | Key Exports |
|------|---------|-------------|
| `scripts/migrate-project-template.sh` | Repo migration entrypoint | tasks-first migration flow |
| `scripts/lib/project-init-lib.sh` | Shared install logic | helper installation, gitignore/runtime block handling |
| `assets/hooks/` | Shared hook implementation source | repo-local hook scripts and libs |
| `scripts/assemble-template.ts` | CLAUDE/AGENTS template assembly | `assembleTemplate`, `assembleTemplateWithHooks` |
| `tests/` | Contract and regression coverage | migration/bootstrap/helper tests |

## Architecture Observations
### Patterns & Conventions
- This repo is both a skill source tree and a generated-workflow consumer, so self-migration must tolerate source and destination paths living in the same repository.
- `.ai/hooks/` is the shared source of truth; `.claude/hooks/` exists only as a compatibility shim layer.
- Workflow enforcement is repo-local: `tasks/`, `plans/`, helper scripts, and package scripts matter more than agent-specific prompt text.

### Implicit Contracts
- `scripts/check-task-sync.sh` requires `tasks/` changes whenever substantive repo files change.
- `scripts/check-task-workflow.sh` expects the generated templates/helpers/directories to exist even when no active plan is present.
- `docs/PROGRESS.md` should remain milestone-only and not become a running work log.

### Edge Cases & Intricacies
- Self-migration can fail if installer logic tries to `cp` a file onto itself; the shared lib now skips identical source/destination copies.
- Re-running migration against an existing managed `.gitignore` block must replace the block without using multiline `awk -v` substitution.

## Technical Debt / Risks
- Root routing docs are repo-specific and can drift from future template conventions if not kept in sync.
- This repo still relies on migration/bootstrap scripts staying idempotent across repeated local runs.

## Research Conclusions
### What to Preserve
- Existing assets, evals, and test coverage as the canonical contract surface for this skill.
- The shared hook model where `.claude/settings.json` invokes `.ai/hooks/run-hook.sh`.

### What to Change
- Keep self-hosting support first-class in migration tests.
- Maintain concise root routing docs so the repo demonstrates the intended downstream workflow.

### Open Questions
- Whether future template assembly should expose a first-class “skill/tooling repo” preset instead of relying on hand-authored root routing docs.
