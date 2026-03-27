# project-initializer

Project scaffolding skill for Claude/Codex workflows.

## Current Model (3.0.x)

- Question flow uses **9 grouped decision points** with harness defaults inferred first.
- Plan menu is tiered:
  - **Core Plans (A-F)** first.
  - **Custom Presets (G-K)** only when needed.
- Runtime mode is configurable with template vars:
  - `{{RUNTIME_MODE}}`
  - `{{RUNTIME_PROFILE}}`
- Question-pack source of truth is in:
  - `assets/initializer-question-pack.v2.json`
- Generated repos default to the repo-local harness flow:
  - `docs/spec.md -> plans/ -> tasks/contracts/ -> tasks/reviews/ -> .ai/harness/*`
- Claude auto memory can be observed by generated hooks in read-only mode to enrich Skill Factory signal quality.

## Quick Usage

```bash
# minimal setup flow
/project-init --quick

# explicit template assembly
bun scripts/assemble-template.ts --plan C --name "MyProject"
bun scripts/assemble-template.ts --target agents --plan C --name "MyProject"

# local benchmark skeleton
bun run benchmark:skills --dry-run

# run one eval across both Claude and Codex
bun run benchmark:skills --eval repair-agents-task-sync
```

## Key Files

- Skill spec: `SKILL.md`
- Plan mapping: `assets/plan-map.json`
- Question-pack: `assets/initializer-question-pack.v2.json`
- Shared hooks: `assets/hooks/`
- Template assembler: `scripts/assemble-template.ts`
- Question inference helper: `scripts/initializer-question-pack.ts`
- Scaffolding scripts:
  - `scripts/init-project.sh`
  - `scripts/create-project-dirs.sh`

## Package Manager Defaults

- General default priority: `bun > pnpm > npm`
- **Plan G/H** (Python-centric) default to **`uv`** as primary package manager.

## Runtime Profiles

- `Plan-only (recommended)` (default)
- `Plan + Permissionless`
- `Standard (ask before each action)`

Configured in `assets/initializer-question-pack.v2.json` and consumed by `scripts/initializer-question-pack.ts`.

## Verification

```bash
bun test
bun run benchmark:skills --dry-run
```
