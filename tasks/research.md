# Project — Research Notes

> **Last Updated**: 2026-04-08
> **Scope**: workflow contract manifest, legacy-doc migration, self-host parity, and inspection-first routing
> **Usage**: Store deep codebase findings and hidden contracts here, not in chat-only summaries.

## Codebase Map
| File | Purpose | Key Exports |
|------|---------|-------------|
| `scripts/migrate-project-template.sh` | Repo migration entrypoint | staged migration flow |
| `scripts/inspect-project-state.ts` | Structured repo classifier | `inspectRepo` |
| `scripts/migrate-workflow-docs.ts` | Legacy workflow-doc migration | `migrate` |
| `scripts/lib/project-init-lib.sh` | Shared install logic | contract query + helper installation |
| `assets/workflow-contract.v1.json` | Canonical workflow contract | helper/file/dir inventory |
| `assets/hooks/` | Shared hook implementation source | repo-local hook scripts and libs |
| `tests/workflow-contract.test.ts` | Parity and migration coverage | manifest + hook parity + doc migration |

## Architecture Observations
### Patterns & Conventions
- The root skill is now a compatibility router. The operational contract moved into scripts and the workflow manifest.
- The repo-local workflow contract now exists as a machine-readable manifest installed at `.ai/harness/workflow-contract.json`.
- `.ai/hooks/` remains the shared hook source of truth; `.claude/hooks/` should stay a shim layer.

### Implicit Contracts
- `scripts/check-task-workflow.sh` now reads `.ai/harness/workflow-contract.json` instead of maintaining its own hard-coded required-path inventory.
- `scripts/migrate-project-template.sh` now runs inspect -> legacy-doc migration -> workflow refresh -> verification.
- Legacy `docs/TODO.md`, `docs/plan.md`, and execution-log style `docs/PROGRESS.md` must be migrated before template refresh.

### Edge Cases & Intricacies
- Shell consumers need a JSON runtime bridge; `project-init-lib.sh` now resolves `node`, `bun`, or `python3` before reading the workflow contract.
- Self-host parity matters twice: the installed runtime contract must match the asset contract, and `.ai/hooks/` must match `assets/hooks/`.
- Legacy doc migration must be idempotent, so imported sections use stable markers and archived backups use deterministic names.

## Technical Debt / Risks
- `ensure-task-workflow.sh` still assumes the workflow surface already exists; it does not yet synthesize a fallback runtime contract manifest for partially migrated repos.
- The workflow contract is machine-readable, but some shell stubs still create content bodies directly rather than deriving full file contents from the manifest.

## Research Conclusions
### What to Preserve
- Repo-local tasks-first workflow surfaces as the main contract for Claude and Codex.
- Additive migration behavior that preserves user content and archives uncertain legacy docs.
- Self-host migration as a first-class verification target.

### What to Change
- Keep helper installation, workflow verification, and migration rules anchored to `assets/workflow-contract.v1.json`.
- Keep `.ai/hooks/` and `assets/hooks/` under explicit parity coverage.
- Keep root routing docs aligned with the inspection-first router model.

### Open Questions
- Whether `ensure-task-workflow.sh` should auto-install a fallback runtime contract manifest when run in a partially migrated repo.
