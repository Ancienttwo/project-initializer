# Project — Research Notes

> **Last Updated**: 2026-03-29
> **Scope**: self-host migration, hook layout, workflow contract surfaces, and 3.1.0 harness upgrades
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
- `hook_structured_error()` output does not automatically flow into `.claude/.trace.jsonl`, so failure analysis needs a dedicated JSONL sink rather than assuming trace hooks will capture guard failures.
- `hook_structured_error()` still accepts legacy arg-4 action shims (`block`/`warn`/`advisory`), so any cleanup there needs to preserve backward compatibility for generated hooks.
- `assemble-template.ts` and `initializer-question-pack.ts` originally hard-coded the `v2` question-pack path; moving to `v3` requires explicit backward-compatible reads for tests and legacy callers.
- Generated helper installation lists are duplicated across `project-init-lib.sh`, `create-project-dirs.sh`, and `migrate-project-template.sh`, so new helper scripts must be wired in at multiple layers.
- `summarize-failures.sh` is Bun-first for repo consistency, but it now needs an explicit Node fallback because generated repos may not have Bun on PATH.

## Technical Debt / Risks
- Root routing docs are repo-specific and can drift from future template conventions if not kept in sync.
- This repo still relies on migration/bootstrap scripts staying idempotent across repeated local runs.
- `.ai/hooks/` and `assets/hooks/` are close but not fully identical, which increases the risk that self-host behavior and generated hook behavior diverge.

## Research Conclusions
### What to Preserve
- Existing assets, evals, and test coverage as the canonical contract surface for this skill.
- The shared hook model where `.claude/settings.json` invokes `.ai/hooks/run-hook.sh`.
- The current multi-file control surface (`plans/`, `tasks/`, `tasks/contracts/`, `tasks/reviews/`, `.ai/harness/*`) instead of collapsing into a single charter artifact.

### What to Change
- Keep self-hosting support first-class in migration tests.
- Maintain concise root routing docs so the repo demonstrates the intended downstream workflow.
- Treat `run_id`, `failure_class`, and 5-dimensional harness profiles as additive metadata with explicit consumers, not as new abstract control layers.

### Open Questions
- Whether future template assembly should expose a first-class “skill/tooling repo” preset instead of relying on hand-authored root routing docs.
- Whether future work should unify `.ai/hooks/` and `assets/hooks/` through generation or parity tests instead of manual sync.
