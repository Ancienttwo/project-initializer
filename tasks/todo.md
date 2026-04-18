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
- [x] Added `.ai/context/context-map.json` and `.ai/harness/policy.json` as generated and self-hosted workflow surfaces
- [x] Extended harness state to include `.ai/harness/events.jsonl`, `.ai/harness/runs/`, and durable handoff/check artifacts
- [x] Added `scripts/check-context-files.sh` and `scripts/maintenance-triage.sh` to the generated helper contract
- [x] Promoted `hybrid` recovery plus `stable-root-progressive-subdir` context loading into the v4 question pack and assembly defaults
- [x] Fixed shared hook event appends so `trace-event` and `prepare-handoff` no longer fail on structured metadata payloads
- [x] Self-migrated this repository so `docs/spec.md`, `tasks/reviews/`, `scripts/new-spec.sh`, `scripts/new-sprint.sh`, and `scripts/verify-sprint.sh` now exist locally
- [x] Expanded scaffold, migration, and AGENTS assembly tests for context-map, policy, parity, and new helper surfaces
- [x] Fixed nested directory context generation so discoverable module contracts now land at `apps/*/AGENTS.md`, `packages/*/AGENTS.md`, and `services/*/AGENTS.md`
- [x] Stopped custom plan `K` from creating monorepo container directories unless the target repo already has real module subtrees
- [x] Rebased the harness upgrade onto the upstream workflow-contract engine, bumped the release to `3.2.1`, and aligned tests to contract-driven helper inventory

## Review Section
- Verification evidence:
- `bun test tests/create-project-dirs.runtime.test.ts`
- `bun test`
- `bash scripts/check-task-sync.sh`
- `bash scripts/check-task-workflow.sh --strict`
- `bash scripts/check-context-files.sh`
- `bun scripts/inspect-project-state.ts --repo . --format text`
- `bash scripts/migrate-project-template.sh --repo . --dry-run`
- `git diff --check`
- Behavior diff notes:
- Workflow inventory is now driven by a machine-readable contract manifest instead of repeated shell lists.
- Legacy workflow docs are migrated by a dedicated script before the main workflow refresh runs.
- Generated repos now carry a stable-root context map plus a machine-readable harness policy instead of relying on scattered prose rules alone.
- Shared workflow state now writes checks, handoff, event, run-summary, and failure artifacts under `.ai/harness/` with self-host parity coverage.
- Self-hosted `.ai/hooks/` is now covered by parity tests against `assets/hooks/`.
- Tool trace and handoff refresh both survive structured event metadata and still record run-linked evidence.
- This repository now satisfies its own strict workflow contract without relying on dry-run assumptions.
- Nested directory contracts now land where `.ai/context/context-map.json` can actually discover them.
- Custom plan `K` keeps a single-project layout unless the repo already exposes monorepo module directories.
- Contract-driven helper installation now covers the progressive-context helpers without falling back to hard-coded script lists.
- Risks / follow-ups:
- Decide whether `ensure-task-workflow.sh` should synthesize a fallback runtime contract manifest for partially migrated repos.
- Keep root routing docs aligned if template routing conventions change.
- Revisit whether `.ai/hooks/` and `assets/hooks/` should be mechanically synchronized to reduce drift over time.
- Decide whether self-hosted tooling repos should get a dedicated preset instead of relying on hand-authored root routing docs.
