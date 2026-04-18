# Project — Research Notes

> **Last Updated**: 2026-04-19
> **Scope**: workflow contract manifest, inspection-first migration, progressive context/policy surfaces, harness state externalization, and DX polish for docs + hook operations
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
| `scripts/assemble-template.ts` | CLAUDE/AGENTS template assembly | `assembleTemplate`, `assembleTemplateWithHooks` |
| `tests/` | Contract and regression coverage | migration/bootstrap/helper tests |

## Architecture Observations
### Patterns & Conventions
- The root skill is now a compatibility router. The operational contract moved into scripts plus the workflow manifest, policy file, and context map.
- The repo-local workflow contract now exists as a machine-readable manifest installed at `.ai/harness/workflow-contract.json`.
- `.ai/context/context-map.json` and `.ai/harness/policy.json` layer progressive-loading and enforcement metadata on top of the workflow manifest.
- `.ai/hooks/` remains the shared source of truth; `.claude/hooks/` should stay a shim layer.

### Implicit Contracts
- `scripts/check-task-sync.sh` requires `tasks/` changes whenever substantive repo files change.
- `scripts/check-task-workflow.sh` reads `.ai/harness/workflow-contract.json` for the baseline required-path inventory and layers `policy.json` on top for progressive-context surfaces.
- `scripts/migrate-project-template.sh` now runs inspect -> legacy-doc migration -> workflow refresh -> verification.
- Legacy `docs/TODO.md`, `docs/plan.md`, and execution-log style `docs/PROGRESS.md` must be migrated before template refresh.
- `scripts/check-task-workflow.sh` expects the generated templates/helpers/directories to exist even when no active plan is present.
- `scripts/check-task-workflow.sh --strict` now also expects `docs/spec.md`, `tasks/reviews/`, `scripts/new-spec.sh`, `scripts/new-sprint.sh`, and `scripts/verify-sprint.sh` to exist in the self-host repo.
- `.ai/context/context-map.json` and `.ai/harness/policy.json` are now part of the generated contract, not optional documentation extras.
- `docs/PROGRESS.md` should remain milestone-only and not become a running work log.
- The README now owns the "first 5 minutes" contract, so onboarding regressions should be treated like product regressions, not copy drift.

### Edge Cases & Intricacies
- Self-migration can fail if installer logic tries to `cp` a file onto itself; the shared lib now skips identical source/destination copies.
- Shell consumers need a JSON runtime bridge; `project-init-lib.sh` resolves `node`, `bun`, or `python3` before reading the workflow contract.
- Self-host parity matters twice: the installed runtime contract must match the asset contract, and `.ai/hooks/` must match `assets/hooks/`.
- Legacy doc migration must be idempotent, so imported sections use stable markers and archived backups use deterministic names.
- Re-running migration against an existing managed `.gitignore` block must replace the block without using multiline `awk -v` substitution.
- `hook_structured_error()` output does not automatically flow into `.claude/.trace.jsonl`, so failure analysis needs a dedicated JSONL sink rather than assuming trace hooks will capture guard failures.
- `hook_structured_error()` still accepts legacy arg-4 action shims (`block`/`warn`/`advisory`), so any cleanup there needs to preserve backward compatibility for generated hooks.
- `assemble-template.ts` and `initializer-question-pack.ts` originally hard-coded the `v2` question-pack path; moving to `v3` requires explicit backward-compatible reads for tests and legacy callers.
- `workflow_append_event()` sits on the critical path for both `trace-event.sh` and `prepare-handoff.sh`; treating supplemental event metadata as hard-fail JSON can break both flows at once.
- Generated helper installation lists are duplicated across `project-init-lib.sh`, `create-project-dirs.sh`, and `migrate-project-template.sh`, so new helper scripts must be wired in at multiple layers.
- `summarize-failures.sh` is Bun-first for repo consistency, but it now needs an explicit Node fallback because generated repos may not have Bun on PATH.
- Hook failures write to `.ai/harness/failures/latest.jsonl`, while `.claude/.trace.jsonl` captures surrounding tool activity. They complement each other; neither replaces the other.
- The progressive-loading contract only works when directory AGENTS files land on immediate module paths like `apps/web/AGENTS.md`; writing to `apps/AGENTS.md` or other container roots is effectively invisible to the context map.
- Custom plan `K` must stay layout-agnostic; nested context files should only appear when the target repo already has real `apps/*`, `packages/*`, or `services/*` modules.
- Once helper installation moves behind `assets/workflow-contract.v1.json`, regression tests should assert helper presence via the manifest instead of string-matching explicit shell argument lists.

## Technical Debt / Risks
- `ensure-task-workflow.sh` still assumes the workflow surface already exists; it does not yet synthesize a fallback runtime contract manifest for partially migrated repos.
- The workflow contract is machine-readable, but some shell stubs still create content bodies directly rather than deriving full file contents from the manifest.
- Root routing docs are repo-specific and can drift from future template conventions if not kept in sync.
- This repo still relies on migration/bootstrap scripts staying idempotent across repeated local runs.
- `.ai/hooks/` and `assets/hooks/` are close but not fully identical, which increases the risk that self-host behavior and generated hook behavior diverge.

## Research Conclusions
### What to Preserve
- Repo-local tasks-first workflow surfaces as the main contract for Claude and Codex.
- Existing assets, evals, and test coverage as the canonical contract surface for this skill.
- Additive migration behavior that preserves user content and archives uncertain legacy docs.
- Self-host migration as a first-class verification target.
- The shared hook model where `.claude/settings.json` invokes `.ai/hooks/run-hook.sh`.
- The current multi-file control surface (`plans/`, `tasks/`, `tasks/contracts/`, `tasks/reviews/`, `.ai/harness/*`) instead of collapsing into a single charter artifact.
- The new split between stable root context and discoverable nested context, because it keeps root prompt mass predictable while still letting deeper modules speak for themselves.

### What to Change
- Keep helper installation, workflow verification, and migration rules anchored to `assets/workflow-contract.v1.json` and `.ai/harness/policy.json`.
- Keep self-hosting support first-class in migration tests.
- Maintain concise root routing docs so the repo demonstrates the intended downstream workflow.
- Treat `run_id`, `failure_class`, and 5-dimensional harness profiles as additive metadata with explicit consumers, not as new abstract control layers.
- Keep hook authority and failure handling explicit in docs so new maintainers do not have to infer the runtime chain from tests.
- Make parity risk explicit: generated output is the downstream contract, and self-hosted behavior must call out whether it matches or diverges.
- Keep the machine-readable policy focused on workflow enforcement; do not turn v1 into a heavyweight architecture linter.

### Open Questions
- Whether `ensure-task-workflow.sh` should auto-install a fallback runtime contract manifest when run in a partially migrated repo.
- Whether future template assembly should expose a first-class “skill/tooling repo” preset instead of relying on hand-authored root routing docs.
- Whether future work should unify `.ai/hooks/` and `assets/hooks/` through generation or parity tests instead of manual sync.
