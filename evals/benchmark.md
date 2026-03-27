# Skill Benchmark Report

Latest iteration: `iteration-20260327-221930`

Workspace root: `/Users/chris/.claude/skills/project-initializer-workspace`

Generated: 2026-03-27T14:53:50.728Z

## Command Matrix

| Agent | Profile | Command |
| --- | --- | --- |
| claude | with_skill | `claude -p --output-format text --no-session-persistence --permission-mode bypassPermissions --add-dir /Users/chris/.claude/skills/project-initializer 'Initialize a new AI quantitative trading project (Plan G) with factor research scaffolding, factor-lab scripts, and Plan G workflow guidance in the generated automation docs.'` |
| claude | without_skill | `claude -p --output-format text --no-session-persistence --permission-mode bypassPermissions --disable-slash-commands 'Initialize a new AI quantitative trading project (Plan G) with factor research scaffolding, factor-lab scripts, and Plan G workflow guidance in the generated automation docs.'` |
| codex | with_skill | `codex exec -C /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260327-221930/codex/with_skill/initialize-plan-g-project --dangerously-bypass-approvals-and-sandbox -o /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260327-221930/codex/with_skill/initialize-plan-g-project/final-response.md --add-dir /Users/chris/.claude/skills/project-initializer 'Initialize a new AI quantitative trading project (Plan G) with factor research scaffolding, factor-lab scripts, and Plan G workflow guidance in the generated automation docs.'` |
| codex | without_skill | `codex exec -C /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260327-221930/codex/without_skill/initialize-plan-g-project --dangerously-bypass-approvals-and-sandbox -o /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260327-221930/codex/without_skill/initialize-plan-g-project/final-response.md 'Initialize a new AI quantitative trading project (Plan G) with factor research scaffolding, factor-lab scripts, and Plan G workflow guidance in the generated automation docs.'` |

## claude / with_skill

| Eval | Status | Exit / Graders | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-plan-g-project | failed | 1 / graders fail (3) | 3046ms | 0 | [workspace](../project-initializer-workspace/iteration-20260327-221930/claude/with_skill/initialize-plan-g-project) |

### initialize-plan-g-project

- Eval: `6`
- Workspace: [../project-initializer-workspace/iteration-20260327-221930/claude/with_skill/initialize-plan-g-project](../project-initializer-workspace/iteration-20260327-221930/claude/with_skill/initialize-plan-g-project)
- Changed files: none
- Diff summary: no diff captured
- Agent status: failed (exit 1)
- Graders: failed (1/4 passed)
- Final response excerpt: (no final response captured)
- Expectations:
  - Selects Plan G or explicitly identifies the AI quantitative trading preset.
  - Mentions the factor registry as the source of truth for factor lifecycle state.
  - Includes the factor-lab new/promote/reject/check commands in the generated workflow discussion.
  - Preserves the standard tasks-first workflow alongside factor research scaffolding.
- Grader results:
  - PASS files_exist: files_exist: final-response.md
  - FAIL files_contain: files_contain: final-response.md !~ tasks/factors
  - FAIL files_contain: files_contain: final-response.md !~ registry\.json
  - FAIL files_contain: files_contain: final-response.md !~ factor-lab

## claude / without_skill

| Eval | Status | Exit / Graders | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-plan-g-project | success | 0 / graders pass | 841999ms | 26 | [workspace](../project-initializer-workspace/iteration-20260327-221930/claude/without_skill/initialize-plan-g-project) |

### initialize-plan-g-project

- Eval: `6`
- Workspace: [../project-initializer-workspace/iteration-20260327-221930/claude/without_skill/initialize-plan-g-project](../project-initializer-workspace/iteration-20260327-221930/claude/without_skill/initialize-plan-g-project)
- Changed files: `.ai/hooks/run-hook.sh`, `.claude/factor-factory/backtest-report.template.md`, `.claude/factor-factory/hypothesis.template.md`, `.claude/settings.json`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `docs/PROGRESS.md`, `docs/architecture.md`, `docs/brief.md`, `docs/decisions.md`, `docs/reference-configs/ai-workflows.md`, `docs/reference-configs/coding-standards.md`, `docs/reference-configs/development-protocol.md`, `docs/reference-configs/git-strategy.md`, `docs/reference-configs/workflow-orchestration.md`, `docs/tech-stack.md`, `pyproject.toml`, `scripts/factor-lab-check.sh`, `scripts/factor-lab-new.sh`, `scripts/factor-lab-promote.sh`, `scripts/factor-lab-reject.sh`, `tasks/factors/registry.json`, `tasks/lessons.md`, `tasks/research.md`, `tasks/todo.md`
- Diff summary: .ai/hooks/run-hook.sh                              | 12 +++
 .claude/factor-factory/backtest-report.template.md | 36 +++++++++
 .claude/factor-factory/hypothesis.template.md      | 30 +++++++
 .claude/settings.json                              | 75 ++++++++++++++++++
 .gitignore                                         | 24 ++++++
 AGENTS.md                                          | 40 ++++++++++
 CLAUDE.md                                          | 88 +++++++++++++++++++++
 docs/PROGRESS.md                                   | 12 +++
 docs/architecture.md                               | 41 ++++++++++
 docs/brief.md                                      |  7 +-
 docs/decisions.md                                  | 16 ++++
 docs/reference-configs/ai-workflows.md             | 55 +++++++++++++
 docs/reference-configs/coding-standards.md         | 15 ++++
 docs/reference-configs/development-protocol.md     | 15 ++++
 docs/reference-configs/git-strategy.md             | 11 +++
 docs/reference-configs/workflow-orchestration.md   | 16 ++++
 docs/tech-stack.md                                 | 23 ++++++
 pyproject.toml                                     | 26 +++++++
 scripts/factor-lab-check.sh                        | 68 ++++++++++++++++
 scripts/factor-lab-new.sh                          | 91 ++++++++++++++++++++++
 scripts/factor-lab-promote.sh                      | 81 +++++++++++++++++++
 scripts/factor-lab-reject.sh                       | 63 +++++++++++++++
 tasks/factors/registry.json                        |  5 ++
 tasks/lessons.md                                   |  3 +
 tasks/research.md                                  |  3 +
 tasks/todo.md                                      | 14 ++++
 26 files changed, 867 insertions(+), 3 deletions(-)
- Agent status: success (exit 0)
- Graders: passed (4/4 passed)
- Final response excerpt: All scripts verified. Here's what was generated: ## Plan G Scaffold Complete **22 files + 4 factor-lab scripts** generated across the full project structure: ### Core Routing - `CLAUDE.md` - Plan G tech stack, workflow,…
- Expectations:
  - Selects Plan G or explicitly identifies the AI quantitative trading preset.
  - Mentions the factor registry as the source of truth for factor lifecycle state.
  - Includes the factor-lab new/promote/reject/check commands in the generated workflow discussion.
  - Preserves the standard tasks-first workflow alongside factor research scaffolding.
- Grader results:
  - PASS files_exist: files_exist: final-response.md
  - PASS files_contain: files_contain: final-response.md =~ tasks/factors
  - PASS files_contain: files_contain: final-response.md =~ registry\.json
  - PASS files_contain: files_contain: final-response.md =~ factor-lab

## codex / with_skill

| Eval | Status | Exit / Graders | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-plan-g-project | success | 0 / graders pass | 428420ms | 96 | [workspace](../project-initializer-workspace/iteration-20260327-221930/codex/with_skill/initialize-plan-g-project) |

### initialize-plan-g-project

- Eval: `6`
- Workspace: [../project-initializer-workspace/iteration-20260327-221930/codex/with_skill/initialize-plan-g-project](../project-initializer-workspace/iteration-20260327-221930/codex/with_skill/initialize-plan-g-project)
- Changed files: `.ai/hooks/anti-simplification.sh`, `.ai/hooks/atomic-commit.sh`, `.ai/hooks/atomic-pending.sh`, `.ai/hooks/changelog-guard.sh`, `.ai/hooks/context-pressure-hook.sh`, `.ai/hooks/hook-input.sh`, `.ai/hooks/lib/session-state.sh`, `.ai/hooks/lib/skill-factory.sh`, `.ai/hooks/lib/workflow-state.sh`, `.ai/hooks/post-bash.sh`, `.ai/hooks/post-edit-guard.sh`, `.ai/hooks/pre-code-change.sh`, `.ai/hooks/pre-edit-guard.sh`, `.ai/hooks/prompt-guard.sh`, `.ai/hooks/run-hook.sh`, `.ai/hooks/skill-factory-session-end.sh`, `.ai/hooks/tdd-guard-hook.sh`, `.ai/hooks/trace-event.sh`, `.ai/hooks/worktree-guard.sh`, `.claude/factor-factory/backtest-report.template.md`, `.claude/factor-factory/hypothesis.template.md`, `.claude/hooks/anti-simplification.sh`, `.claude/hooks/atomic-commit.sh`, `.claude/hooks/atomic-pending.sh`, `.claude/hooks/changelog-guard.sh`, `.claude/hooks/context-pressure-hook.sh`, `.claude/hooks/hook-input.sh`, `.claude/hooks/lib/session-state.sh`, `.claude/hooks/lib/skill-factory.sh`, `.claude/hooks/lib/workflow-state.sh`, `.claude/hooks/post-bash.sh`, `.claude/hooks/post-edit-guard.sh`, `.claude/hooks/pre-code-change.sh`, `.claude/hooks/pre-edit-guard.sh`, `.claude/hooks/prompt-guard.sh`, `.claude/hooks/run-hook.sh`, `.claude/hooks/skill-factory-session-end.sh`, `.claude/hooks/tdd-guard-hook.sh`, `.claude/hooks/trace-event.sh`, `.claude/hooks/worktree-guard.sh`, `.claude/settings.json`, `.claude/skill-factory/intake-questions.json`, `.claude/skill-factory/knowledge-skill.template.md`, `.claude/skill-factory/rubric-to-eval.sh`, `.claude/skill-factory/rubric.template.json`, `.claude/skill-factory/workflow-skill.template.md`, `.claude/templates/contract.template.md`, `.claude/templates/plan.template.md`, `.claude/templates/research.template.md`, `.gitignore`, `.ops/.gitkeep`, `.ops/README.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `contracts/types.ts`, `docs/CHANGELOG.md`, `docs/PROGRESS.md`, `docs/architecture.md`, `docs/brief.md`, `docs/decisions.md`, `docs/reference-configs/ai-workflows.md`, `docs/reference-configs/changelog-versioning.md`, `docs/reference-configs/coding-standards.md`, `docs/reference-configs/development-protocol.md`, `docs/reference-configs/git-strategy.md`, `docs/reference-configs/release-deploy.md`, `docs/reference-configs/spa-day-protocol.md`, `docs/reference-configs/workflow-orchestration.md`, `docs/tech-stack.md`, `package.json`, `plans/archive/.gitkeep`, `scripts/archive-workflow.sh`, `scripts/check-task-sync.sh`, `scripts/check-task-workflow.sh`, `scripts/ensure-task-workflow.sh`, `scripts/factor-lab-check.sh`, `scripts/factor-lab-new.sh`, `scripts/factor-lab-promote.sh`, `scripts/factor-lab-reject.sh`, `scripts/new-plan.sh`, `scripts/plan-to-todo.sh`, `scripts/regenerate.sh`, `scripts/skill-factory-check.sh`, `scripts/skill-factory-create.sh`, `scripts/verify-contract.sh`, `specs/overview.md`, `tasks/archive/.gitkeep`, `tasks/contracts/.gitkeep`, `tasks/factors/README.md`, `tasks/factors/promoted/.gitkeep`, `tasks/factors/registry.json`, `tasks/lessons.md`, `tasks/research.md`, `tasks/todo.md`, `tests/README.md`
- Diff summary: .ai/hooks/anti-simplification.sh                   |  30 +
 .ai/hooks/atomic-commit.sh                         |  77 +++
 .ai/hooks/atomic-pending.sh                        |  21 +
 .ai/hooks/changelog-guard.sh                       |  80 +++
 .ai/hooks/context-pressure-hook.sh                 |  62 ++
 .ai/hooks/hook-input.sh                            | 248 +++++++
 .ai/hooks/lib/session-state.sh                     |  48 ++
 .ai/hooks/lib/skill-factory.sh                     | 770 +++++++++++++++++++++
 .ai/hooks/lib/workflow-state.sh                    | 437 ++++++++++++
 .ai/hooks/post-bash.sh                             |  25 +
 .ai/hooks/post-edit-guard.sh                       | 192 +++++
 .ai/hooks/pre-code-change.sh                       |  17 +
 .ai/hooks/pre-edit-guard.sh                        | 107 +++
 .ai/hooks/prompt-guard.sh                          | 182 +++++
 .ai/hooks/run-hook.sh                              |  28 +
 .ai/hooks/skill-factory-session-end.sh             |  24 +
 .ai/hooks/tdd-guard-hook.sh                        |  78 +++
 .ai/hooks/trace-event.sh                           |  49 ++
 .ai/hooks/worktree-guard.sh                        |  38 +
 .claude/factor-factory/backtest-report.template.md |  36 +
 .claude/factor-factory/hypothesis.template.md      |  30 +
 .claude/hooks/anti-simplification.sh               |  14 +
 .claude/hooks/atomic-commit.sh                     |  14 +
 .claude/hooks/atomic-pending.sh                    |  14 +
 .claude/hooks/changelog-guard.sh                   |  14 +
 .claude/hooks/context-pressure-hook.sh             |  14 +
 .claude/hooks/hook-input.sh                        | 248 +++++++
 .claude/hooks/lib/session-state.sh                 |  48 ++
 .claude/hooks/lib/skill-factory.sh                 | 770 +++++++++++++++++++++
 .claude/hooks/lib/workflow-state.sh                | 437 ++++++++++++
 .claude/hooks/post-bash.sh                         |  14 +
 .claude/hooks/post-edit-guard.sh                   |  14 +
 .claude/hooks/pre-code-change.sh                   |  14 +
 .claude/hooks/pre-edit-guard.sh                    |  14 +
 .claude/hooks/prompt-guard.sh                      |  14 +
 .claude/hooks/run-hook.sh                          |  14 +
 .claude/hooks/skill-factory-session-end.sh         |  14 +
 .claude/hooks/tdd-guard-hook.sh                    |  14 +
 .claude/hooks/trace-event.sh                       |  14 +
 .claude/hooks/worktree-guard.sh                    |  14 +
 .claude/settings.json                              |  47 ++
 .claude/skill-factory/intake-questions.json        |  23 +
 .claude/skill-factory/knowledge-skill.template.md  |  37 +
 .claude/skill-factory/rubric-to-eval.sh            |  33 +
 .claude/skill-factory/rubric.template.json         |  14 +
 .claude/skill-factory/workflow-skill.template.md   |  46 ++
 .claude/templates/contract.template.md             |  36 +
 .claude/templates/plan.template.md                 |  36 +
 .claude/templates/research.template.md             |  21 +
 .gitignore                                         |  36 +
 .ops/.gitkeep                                      |   0
 .ops/README.md                                     |   1 +
 AGENTS.md                                          | 413 +++++------
 CLAUDE.md                                          | 252 +++++++
 README.md                                          |  36 +-
 contracts/types.ts                                 |   8 +
 docs/CHANGELOG.md                                  |   0
 docs/PROGRESS.md                                   |  13 +
 docs/architecture.md                               |  46 ++
 docs/brief.md                                      |  32 +-
 docs/decisions.md                                  |  29 +
 docs/reference-configs/ai-workflows.md             | 197 ++++++
 docs/reference-configs/changelog-versioning.md     |  63 ++
 docs/reference-configs/coding-standards.md         |  23 +
 docs/reference-configs/development-protocol.md     |  54 ++
 docs/reference-configs/git-strategy.md             |  61 ++
 docs/reference-configs/release-deploy.md           | 139 ++++
 docs/reference-configs/spa-day-protocol.md         |  31 +
 docs/reference-configs/workflow-orchestration.md   |  86 +++
 docs/tech-stack.md                                 |  45 ++
 package.json                                       |   8 +
 plans/archive/.gitkeep                             |   1 +
 scripts/archive-workflow.sh                        | 168 +++++
 scripts/check-task-sync.sh                         |  60 ++
 scripts/check-task-workflow.sh                     | 160 +++++
 scripts/ensure-task-workflow.sh                    | 288 ++++++++
 scripts/factor-lab-check.sh                        |  73 ++
 scripts/factor-lab-new.sh                          |  96 +++
 scripts/factor-lab-promote.sh                      |  86 +++
 scripts/factor-lab-reject.sh                       |  68 ++
 scripts/new-plan.sh                                | 121 ++++
 scripts/plan-to-todo.sh                            | 310 +++++++++
 scripts/regenerate.sh                              |  28 +
 scripts/skill-factory-check.sh                     | 125 ++++
 scripts/skill-factory-create.sh                    | 285 ++++++++
 scripts/verify-contract.sh                         | 453 ++++++++++++
 specs/overview.md                                  |  14 +
 tasks/archive/.gitkeep                             |   1 +
 tasks/contracts/.gitkeep                           |   1 +
 tasks/factors/README.md                            |  21 +
 tasks/factors/promoted/.gitkeep                    |   1 +
 tasks/factors/registry.json                        |   5 +
 tasks/lessons.md                                   |  11 +
 tasks/research.md                                  |  50 ++
 tasks/todo.md                                      |  20 +
 tests/README.md                                    |  21 +
 96 files changed, 8392 insertions(+), 233 deletions(-)
- Agent status: success (exit 0)
- Graders: passed (4/4 passed)
- Final response excerpt: Initialized the repo as a Plan G scaffold for “Quant Factor Lab”. The generated routing files now exist in [CLAUDE.md](/Users/chris/.claude/skills/project-initializer-workspace/iteration-20260327-221930/codex/with_skill…
- Expectations:
  - Selects Plan G or explicitly identifies the AI quantitative trading preset.
  - Mentions the factor registry as the source of truth for factor lifecycle state.
  - Includes the factor-lab new/promote/reject/check commands in the generated workflow discussion.
  - Preserves the standard tasks-first workflow alongside factor research scaffolding.
- Grader results:
  - PASS files_exist: files_exist: final-response.md
  - PASS files_contain: files_contain: final-response.md =~ tasks/factors
  - PASS files_contain: files_contain: final-response.md =~ registry\.json
  - PASS files_contain: files_contain: final-response.md =~ factor-lab

## codex / without_skill

| Eval | Status | Exit / Graders | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-plan-g-project | failed | n/a / graders fail (3) | 785804ms | 104 | [workspace](../project-initializer-workspace/iteration-20260327-221930/codex/without_skill/initialize-plan-g-project) |

### initialize-plan-g-project

- Eval: `6`
- Workspace: [../project-initializer-workspace/iteration-20260327-221930/codex/without_skill/initialize-plan-g-project](../project-initializer-workspace/iteration-20260327-221930/codex/without_skill/initialize-plan-g-project)
- Changed files: `.claude/hooks/anti-simplification.sh`, `.claude/hooks/atomic-commit.sh`, `.claude/hooks/atomic-pending.sh`, `.claude/hooks/changelog-guard.sh`, `.claude/hooks/context-pressure-hook.sh`, `.claude/hooks/hook-input.sh`, `.claude/hooks/lib/session-state.sh`, `.claude/hooks/lib/skill-factory.sh`, `.claude/hooks/lib/workflow-state.sh`, `.claude/hooks/post-bash.sh`, `.claude/hooks/post-edit-guard.sh`, `.claude/hooks/pre-code-change.sh`, `.claude/hooks/pre-edit-guard.sh`, `.claude/hooks/prompt-guard.sh`, `.claude/hooks/run-hook.sh`, `.claude/hooks/skill-factory-session-end.sh`, `.claude/hooks/tdd-guard-hook.sh`, `.claude/hooks/worktree-guard.sh`, `.claude/settings.json`, `.claude/skill-factory/intake-questions.json`, `.claude/skill-factory/knowledge-skill.template.md`, `.claude/skill-factory/rubric-to-eval.sh`, `.claude/skill-factory/rubric.template.json`, `.claude/skill-factory/workflow-skill.template.md`, `.claude/templates/contract.template.md`, `.claude/templates/plan.template.md`, `.claude/templates/research.template.md`, `.env.example`, `.gitignore`, `.ops/.gitkeep`, `.ops/README.md`, `.python-version`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `apps/api/app/__init__.py`, `apps/api/app/api/__init__.py`, `apps/api/app/api/routes/__init__.py`, `apps/api/app/api/routes/health.py`, `apps/api/app/main.py`, `apps/web/index.html`, `apps/web/package.json`, `apps/web/src/App.tsx`, `apps/web/src/main.tsx`, `apps/web/src/styles.css`, `apps/web/tsconfig.json`, `apps/web/vite.config.ts`, `configs/factors/default-momentum.toml`, `contracts/types.ts`, `data/features/.gitkeep`, `data/processed/.gitkeep`, `data/raw/.gitkeep`, `docs/CHANGELOG.md`, `docs/PROGRESS.md`, `docs/architecture.md`, `docs/brief.md`, `docs/decisions.md`, `docs/reference-configs/ai-workflows.md`, `docs/reference-configs/changelog-versioning.md`, `docs/reference-configs/coding-standards.md`, `docs/reference-configs/development-protocol.md`, `docs/reference-configs/git-strategy.md`, `docs/reference-configs/release-deploy.md`, `docs/reference-configs/spa-day-protocol.md`, `docs/reference-configs/workflow-orchestration.md`, `docs/tech-stack.md`, `notebooks/factor_lab/.gitkeep`, `package.json`, `plans/plan-20260327-2245-plan-g-bootstrap.md`, `pyproject.toml`, `research/factor_lab/README.md`, `research/factor_lab/factors/default-momentum.md`, `scripts/archive-workflow.sh`, `scripts/check-task-sync.sh`, `scripts/check-task-workflow.sh`, `scripts/ensure-task-workflow.sh`, `scripts/factor-lab-new.sh`, `scripts/factor-lab-report.sh`, `scripts/factor-lab-run.sh`, `scripts/new-plan.sh`, `scripts/plan-to-todo.sh`, `scripts/regenerate.sh`, `scripts/skill-factory-check.sh`, `scripts/skill-factory-create.sh`, `scripts/verify-contract.sh`, `sitecustomize.py`, `specs/overview.md`, `src/plan_g/__init__.py`, `src/plan_g/config.py`, `src/plan_g/factor_lab/__init__.py`, `src/plan_g/factor_lab/cli.py`, `src/plan_g/factor_lab/config.py`, `src/plan_g/factor_lab/pipeline.py`, `tasks/contracts/plan-g-bootstrap.contract.md`, `tasks/lessons.md`, `tasks/research.md`, `tasks/todo.md`, `tests/README.md`, `tests/__init__.py`, `tests/unit/__init__.py`, `tests/unit/api/__init__.py`, `tests/unit/api/test_placeholder.py`, `tests/unit/test_factor_lab_config.py`, `uv.lock`
- Diff summary: .claude/hooks/anti-simplification.sh              |  30 +
 .claude/hooks/atomic-commit.sh                    |  77 ++
 .claude/hooks/atomic-pending.sh                   |  21 +
 .claude/hooks/changelog-guard.sh                  |  80 ++
 .claude/hooks/context-pressure-hook.sh            |  62 ++
 .claude/hooks/hook-input.sh                       | 107 +++
 .claude/hooks/lib/session-state.sh                |  47 ++
 .claude/hooks/lib/skill-factory.sh                | 669 +++++++++++++++++
 .claude/hooks/lib/workflow-state.sh               | 132 ++++
 .claude/hooks/post-bash.sh                        |  25 +
 .claude/hooks/post-edit-guard.sh                  | 156 ++++
 .claude/hooks/pre-code-change.sh                  |  17 +
 .claude/hooks/pre-edit-guard.sh                   |  79 ++
 .claude/hooks/prompt-guard.sh                     | 132 ++++
 .claude/hooks/run-hook.sh                         |  25 +
 .claude/hooks/skill-factory-session-end.sh        |  24 +
 .claude/hooks/tdd-guard-hook.sh                   |  78 ++
 .claude/hooks/worktree-guard.sh                   |  43 ++
 .claude/settings.json                             |  42 ++
 .claude/skill-factory/intake-questions.json       |  23 +
 .claude/skill-factory/knowledge-skill.template.md |  37 +
 .claude/skill-factory/rubric-to-eval.sh           |  33 +
 .claude/skill-factory/rubric.template.json        |  14 +
 .claude/skill-factory/workflow-skill.template.md  |  46 ++
 .claude/templates/contract.template.md            |  36 +
 .claude/templates/plan.template.md                |  36 +
 .claude/templates/research.template.md            |  21 +
 .env.example                                      |   7 +
 .gitignore                                        |  54 ++
 .ops/.gitkeep                                     |   0
 .ops/README.md                                    |   1 +
 .python-version                                   |   1 +
 AGENTS.md                                         | 196 +++++
 CLAUDE.md                                         | 259 +++++++
 README.md                                         |  35 +-
 apps/api/app/__init__.py                          |   1 +
 apps/api/app/api/__init__.py                      |   1 +
 apps/api/app/api/routes/__init__.py               |   1 +
 apps/api/app/api/routes/health.py                 |   8 +
 apps/api/app/main.py                              |  29 +
 apps/web/index.html                               |  12 +
 apps/web/package.json                             |  22 +
 apps/web/src/App.tsx                              |  38 +
 apps/web/src/main.tsx                             |  11 +
 apps/web/src/styles.css                           |  73 ++
 apps/web/tsconfig.json                            |  20 +
 apps/web/vite.config.ts                           |   9 +
 configs/factors/default-momentum.toml             |  12 +
 contracts/types.ts                                |   8 +
 data/features/.gitkeep                            |   0
 data/processed/.gitkeep                           |   0
 data/raw/.gitkeep                                 |   0
 docs/CHANGELOG.md                                 |   0
 docs/PROGRESS.md                                  |  14 +
 docs/architecture.md                              |  30 +
 docs/brief.md                                     |   8 +-
 docs/decisions.md                                 |  19 +
 docs/reference-configs/ai-workflows.md            |  18 +
 docs/reference-configs/changelog-versioning.md    |   3 +
 docs/reference-configs/coding-standards.md        |   3 +
 docs/reference-configs/development-protocol.md    |  23 +
 docs/reference-configs/git-strategy.md            |   3 +
 docs/reference-configs/release-deploy.md          |   3 +
 docs/reference-configs/spa-day-protocol.md        |  27 +
 docs/reference-configs/workflow-orchestration.md  |  20 +
 docs/tech-stack.md                                |  17 +
 notebooks/factor_lab/.gitkeep                     |   0
 package.json                                      |  13 +
 plans/plan-20260327-2245-plan-g-bootstrap.md      |  39 +
 pyproject.toml                                    |  48 ++
 research/factor_lab/README.md                     |  18 +
 research/factor_lab/factors/default-momentum.md   |  12 +
 scripts/archive-workflow.sh                       | 153 ++++
 scripts/check-task-sync.sh                        |  59 ++
 scripts/check-task-workflow.sh                    | 152 ++++
 scripts/ensure-task-workflow.sh                   | 280 +++++++
 scripts/factor-lab-new.sh                         |  56 ++
 scripts/factor-lab-report.sh                      |  11 +
 scripts/factor-lab-run.sh                         |  11 +
 scripts/new-plan.sh                               | 121 ++++
 scripts/plan-to-todo.sh                           | 208 ++++++
 scripts/regenerate.sh                             |  28 +
 scripts/skill-factory-check.sh                    |  77 ++
 scripts/skill-factory-create.sh                   | 253 +++++++
 scripts/verify-contract.sh                        | 260 +++++++
 sitecustomize.py                                  |   8 +
 specs/overview.md                                 |  14 +
 src/plan_g/__init__.py                            |   1 +
 src/plan_g/config.py                              |  25 +
 src/plan_g/factor_lab/__init__.py                 |   1 +
 src/plan_g/factor_lab/cli.py                      |  42 ++
 src/plan_g/factor_lab/config.py                   |  45 ++
 src/plan_g/factor_lab/pipeline.py                 |  55 ++
 tasks/contracts/plan-g-bootstrap.contract.md      |  32 +
 tasks/lessons.md                                  |  11 +
 tasks/research.md                                 |  45 ++
 tasks/todo.md                                     |  23 +
 tests/README.md                                   |  21 +
 tests/__init__.py                                 |   1 +
 tests/unit/__init__.py                            |  10 +
 tests/unit/api/__init__.py                        |   1 +
 tests/unit/api/test_placeholder.py                |  10 +
 tests/unit/test_factor_lab_config.py              |  43 ++
 uv.lock                                           | 847 ++++++++++++++++++++++
 104 files changed, 6107 insertions(+), 5 deletions(-)
- Agent status: failed (exit n/a)
- Graders: failed (1/4 passed)
- Final response excerpt: (no final response captured)
- Expectations:
  - Selects Plan G or explicitly identifies the AI quantitative trading preset.
  - Mentions the factor registry as the source of truth for factor lifecycle state.
  - Includes the factor-lab new/promote/reject/check commands in the generated workflow discussion.
  - Preserves the standard tasks-first workflow alongside factor research scaffolding.
- Grader results:
  - PASS files_exist: files_exist: final-response.md
  - FAIL files_contain: files_contain: final-response.md !~ tasks/factors
  - FAIL files_contain: files_contain: final-response.md !~ registry\.json
  - FAIL files_contain: files_contain: final-response.md !~ factor-lab
