---
name: project-initializer
description: Use when initializing, migrating, auditing, or repairing AI-assisted project scaffolding such as CLAUDE.md, AGENTS.md, tasks/, hooks, and repo-local contracts. Not for runtime debugging or generic non-AI setup.
---

# Project Initializer

Build or modernize a repository so it works as an AI-assisted coding project with:

- stack-aware initialization
- concise `CLAUDE.md` / `AGENTS.md` routing files
- repo-local `spec -> plan -> contract -> review -> handoff` artifacts
- shared `.ai/hooks/` automation
- migration helpers for older repos
- reference configs and workflow scripts

Treat this skill as a router. Keep `SKILL.md` focused on when to use the skill and which path to follow. Load detailed references only when needed.

## When not to use

- Do not use this skill for runtime bug debugging inside an already healthy AI workflow.
- Do not use this skill for generic app scaffolding that does not involve AI-agent routing, hooks, or repo-local harness contracts.
- Do not use this skill when the user only wants product behavior changes unrelated to repo workflow setup.

## Choose the right path

Start by deciding which of these five workflows matches the user request:

1. **Initialize a new project**
   - Use when the user wants a new React, TypeScript, Node, Remix, Expo, monorepo, or adjacent project scaffold.
2. **Migrate an existing repo**
   - Use when the user already has a repository and wants to adopt the latest AI workflow, hooks, templates, or tasks-first contract.
3. **Audit an AI workflow**
   - Use when the repo exists and the user wants a review of `AGENTS.md`, `CLAUDE.md`, hooks, harness artifacts, or repo-local workflow enforcement.
4. **Repair task-sync or contract drift**
   - Use when the user says Codex or Claude is not updating `tasks/*`, `PROGRESS.md` is being misused, or the repo contract has drifted.
5. **Enable or configure Skill Factory**
   - Use when the user wants built-in skill proposal/feedback flows, user-level skill generation, or autoresearch-ready skill sidecars inside generated projects.
   - Read `references/skill-factory-guide.md` before configuring or debugging Skill Factory behavior.

## Capture intent before generating

Extract as much as possible from the conversation first, then fill the gaps:

- project type and stack
- whether the repo is new or existing
- whether the user needs generation, migration, or audit
- target agents: Claude, Codex, or both
- acceptance criteria for the scaffold or migration

When the repo already exists, inspect it before asking questions. Determine whether the problem is:

- missing files
- stale templates
- hook-only enforcement without repo-local contract
- outdated `AGENTS.md` / `CLAUDE.md` guidance
- migration drift between generated files and current conventions

## Core operating rules

- Prefer repo-local artifacts over agent-specific hooks.
- Keep shared hook logic in `.ai/hooks/`; treat `.claude/settings.json` as the Claude adapter.
- Generate `docs/spec.md`, `tasks/todo.md`, `tasks/lessons.md`, `tasks/research.md`, `tasks/contracts/`, `tasks/reviews/`, and `.ai/harness/` as the default workflow surface.
- Treat `plans/` as the single source of truth for the active plan.
- Treat `docs/PROGRESS.md` as milestone-only, not as the day-to-day execution log.
- Make Claude hooks an enhancement layer, not the sole source of enforcement.
- Keep `CLAUDE.md` and `AGENTS.md` concise; route detail into `docs/reference-configs/*`.
- Keep stack-specific details in assets and references, not duplicated in the main skill body.

## New project workflow

For a new project:

1. Infer defaults from the plan map and question pack.
2. Confirm only the decisions that materially affect the generated project.
3. Assemble concise `CLAUDE.md` and `AGENTS.md`.
4. Generate repo-local harness files and helper scripts.
5. Install shared hooks into `.ai/hooks/` from `assets/hooks/`, create `.claude/hooks/` compatibility shims that delegate to `.ai/hooks/`, and write `.claude/settings.json` with hook commands referencing `.ai/hooks/run-hook.sh`. Load `references/hooks-guide.md` for the hook architecture.
6. Generate reference configs and stack docs.
7. Make sure the repo includes repo-local task sync enforcement.

Load on demand:

- stack selection and defaults: `references/tech-stacks.md`
- architecture variants: `references/arch/*.md`
- hook presets: `references/hooks-guide.md`
- plugin decisions: `references/plugins-core.md`

### Plan index

Core Plans (A-F):
- Plan A: Remix
- Plan B: UmiJS + Ant Design Pro
- Plan C: Vite + TanStack Router
- Plan D: Bun + Turborepo
- Plan E: Astro landing page
- Plan F: Expo + NativeWind

Custom Presets (G-K):
- Plan G: AI quantitative trading
- Plan H: Financial trading / FIX / RFQ
- Plan I: Web3 DApp
- Plan J: AI coding agent / TUI
- Plan K: Fully custom configuration

## Existing repo migration workflow

For migration requests:

1. Inspect current repo structure, especially:
   - `CLAUDE.md`
   - `AGENTS.md`
   - `.claude/settings.json`
   - `.ai/hooks/`
   - `docs/PROGRESS.md`
   - `tasks/`
   - helper scripts under `scripts/`
2. Identify drift from the current harness contract.
3. Use `scripts/migrate-project-template.sh` when the user wants repo-wide migration.
4. Preserve user-owned content where possible; prefer additive migration over destructive replacement unless the user asks to reset.
5. If the repo has hooks but lacks repo-local task enforcement, treat that as incomplete migration.

Read `references/migration-guide.md` before changing migration behavior.

## Audit and repair workflow

For audits or contract repairs:

1. Compare current repo behavior against the generated contract.
2. Check whether both Codex and Claude can follow the same `tasks/` workflow.
3. Flag these issues first:
   - `docs/PROGRESS.md` used as active task log
   - final response contract missing task-file disclosure
   - task-sync enforced only through hooks
   - `AGENTS.md` mentions `tasks/*` but does not require syncing them
   - active-plan state duplicated outside `plans/`
4. Recommend repo-local enforcement first, then hook enhancements second.

If the user wants implementation, update templates, scripts, migration paths, and tests together.

## Outputs this skill owns

The skill can generate or maintain:

- `CLAUDE.md`
- `AGENTS.md`
- `.ai/hooks/*`
- `.claude/hooks/*` (compatibility shims delegating to `.ai/hooks/`)
- `.claude/settings.json` (hook adapter referencing `.ai/hooks/run-hook.sh`)
- `docs/brief.md`
- `docs/spec.md`
- `docs/tech-stack.md`
- `docs/decisions.md`
- `docs/architecture.md`
- `docs/PROGRESS.md`
- `tasks/todo.md`
- `tasks/lessons.md`
- `tasks/research.md`
- `tasks/contracts/*`
- `tasks/reviews/*`
- `.ai/harness/*`
- `docs/reference-configs/*.md`
- workflow helpers under `scripts/`
- skill factory helpers under `scripts/skill-factory-*.sh`

Conditional outputs remain plan-specific:

- `docs/packages.md` for monorepos
- `docs/guides/metro-esm-gotchas.md` for Expo
- Cloudflare deployment notes for cloudflare-native plans

## Evaluation and iteration

This skill is expected to be benchmarked and iterated like a product, not just edited by feel.

Use `evals/evals.json` as the canonical prompt set for:

- new project initialization
- AGENTS/CLAUDE regeneration
- old repo migration to harness-style contracts
- audit and repair of AI workflow drift

Benchmark conventions, iteration directories, and review flow live in:

- `references/evaluation-playbook.md`

Use the local runner for lightweight repo-owned benchmark passes:

- `bun run benchmark:skills --dry-run`
- `bun run benchmark:skills --eval repair-agents-task-sync`

Do not vendor the upstream `skill-creator` runner or viewer into this repo. Keep this repo ready to work with external evaluation workflows while owning only the minimal local orchestration needed for iteration.

## Bundled resources

### Assets

- `assets/plan-map.json`
- `assets/initializer-question-pack.v2.json`
- `assets/partials/`
- `assets/partials-agents/`
- `assets/reference-configs/`
- `assets/templates/`
- `assets/hooks/`

### References

- `references/tech-stacks.md`
- `references/best-practices.md`
- `references/hooks-guide.md`
- `references/migration-guide.md`
- `references/plugins-core.md`
- `references/evaluation-playbook.md`
- `references/skill-factory-guide.md`
- `references/arch/*.md`

### Scripts

- `scripts/assemble-template.ts`
- `scripts/init-project.sh`
- `scripts/create-project-dirs.sh`
- `scripts/migrate-project-template.sh`
- `scripts/setup-plugins.sh`
- `scripts/switch-plan.sh`
- `scripts/check-versions.ts`
- `scripts/check-skill-version.ts`
- `scripts/run-skill-hook.ts`

## Validation checklist

When you change this skill, validate the relevant layer:

- template assembly tests for `CLAUDE.md` / `AGENTS.md`
- bootstrap and migration tests for generated files
- task-sync tests for repo-local contract enforcement
- eval asset validation for `evals/evals.json`
- version consistency checks against `package.json` and `assets/skill-version.json`
- Skill Factory changes: hooks, `skill-factory-create/check`, guide, and tests stay aligned

## Troubleshooting

- Unsure which plan to use: start with core plans A-F.
- Unsure whether to prefer hooks or repo artifacts: prefer repo artifacts.
- Unsure whether to update `docs/PROGRESS.md`: only update it for milestones.
- Unsure whether to add more detail to `CLAUDE.md` / `AGENTS.md`: move detail into `docs/reference-configs/*`.
