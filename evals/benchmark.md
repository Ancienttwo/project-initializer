# Skill Benchmark Report

Latest iteration: `iteration-20260319-201733`

Workspace root: `/Users/chris/.claude/skills/project-initializer-workspace`

Generated: 2026-03-19T12:17:35.412Z

## Command Matrix

| Agent | Profile | Command |
| --- | --- | --- |
| claude | with_skill | `claude -p --output-format text --no-session-persistence --permission-mode bypassPermissions --add-dir /Users/chris/.claude/skills/project-initializer 'Initialize a new B2B internal tool with Vite, TanStack Router, tasks-first workflow files, and concise CLAUDE.md/AGENTS.md for both Claude and Codex.'` |
| claude | without_skill | `claude -p --output-format text --no-session-persistence --permission-mode bypassPermissions --disable-slash-commands 'Initialize a new B2B internal tool with Vite, TanStack Router, tasks-first workflow files, and concise CLAUDE.md/AGENTS.md for both Claude and Codex.'` |
| codex | with_skill | `codex exec -C /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260319-201733/codex/with_skill/initialize-new-project --dangerously-bypass-approvals-and-sandbox -o /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260319-201733/codex/with_skill/initialize-new-project/final-response.md --add-dir /Users/chris/.claude/skills/project-initializer 'Initialize a new B2B internal tool with Vite, TanStack Router, tasks-first workflow files, and concise CLAUDE.md/AGENTS.md for both Claude and Codex.'` |
| codex | without_skill | `codex exec -C /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260319-201733/codex/without_skill/initialize-new-project --dangerously-bypass-approvals-and-sandbox -o /Users/chris/.claude/skills/project-initializer-workspace/iteration-20260319-201733/codex/without_skill/initialize-new-project/final-response.md 'Initialize a new B2B internal tool with Vite, TanStack Router, tasks-first workflow files, and concise CLAUDE.md/AGENTS.md for both Claude and Codex.'` |

## claude / with_skill

| Eval | Status | Exit | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-new-project | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/initialize-new-project) |
| repair-agents-task-sync | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/repair-agents-task-sync) |
| migrate-legacy-repo | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/migrate-legacy-repo) |
| audit-workflow-drift | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/audit-workflow-drift) |
| codex-skill-factory-lifecycle | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/codex-skill-factory-lifecycle) |

### initialize-new-project

- Eval: `1`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/initialize-new-project](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/initialize-new-project)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Chooses a plausible core plan and explains the stack choice.
  - Includes tasks/todo.md, tasks/lessons.md, tasks/research.md, and tasks/contracts/ in the generated workflow.
  - Treats docs/PROGRESS.md as milestone-only instead of the active execution log.

### repair-agents-task-sync

- Eval: `2`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/repair-agents-task-sync](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/repair-agents-task-sync)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Calls out repo-local task sync as the primary enforcement mechanism.
  - Treats plans/ as the single source of truth for the active plan instead of relying on docs/plan.md.
  - Updates the final response contract to mention changed tasks files.
  - Avoids treating hooks as the only source of enforcement.

### migrate-legacy-repo

- Eval: `3`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/migrate-legacy-repo](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/migrate-legacy-repo)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Replaces docs/TODO.md with tasks/todo.md as the primary task contract.
  - Removes docs/plan.md compatibility pointers in favor of plans/ as the active-plan source of truth.
  - Adds repo-local task-sync enforcement such as scripts/check-task-sync.sh.
  - Updates migration guidance and scripts rather than only editing prose.
  - Installs a shared .ai/ hook layer and routes Claude hook settings through it.

### audit-workflow-drift

- Eval: `4`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/audit-workflow-drift](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/audit-workflow-drift)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Checks both Claude-specific hooks and cross-agent repo-local contracts.
  - Flags docs/PROGRESS.md misuse if it is acting as an execution log.
  - Flags duplicated active-plan state outside plans/ as workflow drift.
  - Mentions migration or template updates when current files are out of sync with the skill.
  - Calls out when a repo only has .claude hook wiring but lacks the shared .ai/ automation layer.

### codex-skill-factory-lifecycle

- Eval: `5`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/codex-skill-factory-lifecycle](../project-initializer-workspace/iteration-20260319-201733/claude/with_skill/codex-skill-factory-lifecycle)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Reads .claude/.skill-factory-state.json to understand current pattern counts.
  - Uses AGENTS.md Skill Factory protocol to group lessons by theme.
  - Runs bash scripts/skill-factory-check.sh to inspect current state.
  - After the third session, both workflow and knowledge proposals reach pending status.
  - Does not auto-create skills — proposals require explicit human promotion via skill-factory-create.sh.
  - Does not treat ordinary post-edit activity as optimization feedback.
  - Uses bash scripts/skill-factory-check.sh --record-feedback <slug> --signal <label> when explicit feedback is needed.

## claude / without_skill

| Eval | Status | Exit | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-new-project | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/initialize-new-project) |
| repair-agents-task-sync | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/repair-agents-task-sync) |
| migrate-legacy-repo | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/migrate-legacy-repo) |
| audit-workflow-drift | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/audit-workflow-drift) |
| codex-skill-factory-lifecycle | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/codex-skill-factory-lifecycle) |

### initialize-new-project

- Eval: `1`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/initialize-new-project](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/initialize-new-project)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Chooses a plausible core plan and explains the stack choice.
  - Includes tasks/todo.md, tasks/lessons.md, tasks/research.md, and tasks/contracts/ in the generated workflow.
  - Treats docs/PROGRESS.md as milestone-only instead of the active execution log.

### repair-agents-task-sync

- Eval: `2`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/repair-agents-task-sync](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/repair-agents-task-sync)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Calls out repo-local task sync as the primary enforcement mechanism.
  - Treats plans/ as the single source of truth for the active plan instead of relying on docs/plan.md.
  - Updates the final response contract to mention changed tasks files.
  - Avoids treating hooks as the only source of enforcement.

### migrate-legacy-repo

- Eval: `3`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/migrate-legacy-repo](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/migrate-legacy-repo)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Replaces docs/TODO.md with tasks/todo.md as the primary task contract.
  - Removes docs/plan.md compatibility pointers in favor of plans/ as the active-plan source of truth.
  - Adds repo-local task-sync enforcement such as scripts/check-task-sync.sh.
  - Updates migration guidance and scripts rather than only editing prose.
  - Installs a shared .ai/ hook layer and routes Claude hook settings through it.

### audit-workflow-drift

- Eval: `4`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/audit-workflow-drift](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/audit-workflow-drift)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Checks both Claude-specific hooks and cross-agent repo-local contracts.
  - Flags docs/PROGRESS.md misuse if it is acting as an execution log.
  - Flags duplicated active-plan state outside plans/ as workflow drift.
  - Mentions migration or template updates when current files are out of sync with the skill.
  - Calls out when a repo only has .claude hook wiring but lacks the shared .ai/ automation layer.

### codex-skill-factory-lifecycle

- Eval: `5`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/codex-skill-factory-lifecycle](../project-initializer-workspace/iteration-20260319-201733/claude/without_skill/codex-skill-factory-lifecycle)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Reads .claude/.skill-factory-state.json to understand current pattern counts.
  - Uses AGENTS.md Skill Factory protocol to group lessons by theme.
  - Runs bash scripts/skill-factory-check.sh to inspect current state.
  - After the third session, both workflow and knowledge proposals reach pending status.
  - Does not auto-create skills — proposals require explicit human promotion via skill-factory-create.sh.
  - Does not treat ordinary post-edit activity as optimization feedback.
  - Uses bash scripts/skill-factory-check.sh --record-feedback <slug> --signal <label> when explicit feedback is needed.

## codex / with_skill

| Eval | Status | Exit | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-new-project | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/initialize-new-project) |
| repair-agents-task-sync | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/repair-agents-task-sync) |
| migrate-legacy-repo | dry_run | 0 | 1ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/migrate-legacy-repo) |
| audit-workflow-drift | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/audit-workflow-drift) |
| codex-skill-factory-lifecycle | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/codex-skill-factory-lifecycle) |

### initialize-new-project

- Eval: `1`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/initialize-new-project](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/initialize-new-project)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Chooses a plausible core plan and explains the stack choice.
  - Includes tasks/todo.md, tasks/lessons.md, tasks/research.md, and tasks/contracts/ in the generated workflow.
  - Treats docs/PROGRESS.md as milestone-only instead of the active execution log.

### repair-agents-task-sync

- Eval: `2`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/repair-agents-task-sync](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/repair-agents-task-sync)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Calls out repo-local task sync as the primary enforcement mechanism.
  - Treats plans/ as the single source of truth for the active plan instead of relying on docs/plan.md.
  - Updates the final response contract to mention changed tasks files.
  - Avoids treating hooks as the only source of enforcement.

### migrate-legacy-repo

- Eval: `3`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/migrate-legacy-repo](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/migrate-legacy-repo)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Replaces docs/TODO.md with tasks/todo.md as the primary task contract.
  - Removes docs/plan.md compatibility pointers in favor of plans/ as the active-plan source of truth.
  - Adds repo-local task-sync enforcement such as scripts/check-task-sync.sh.
  - Updates migration guidance and scripts rather than only editing prose.
  - Installs a shared .ai/ hook layer and routes Claude hook settings through it.

### audit-workflow-drift

- Eval: `4`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/audit-workflow-drift](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/audit-workflow-drift)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Checks both Claude-specific hooks and cross-agent repo-local contracts.
  - Flags docs/PROGRESS.md misuse if it is acting as an execution log.
  - Flags duplicated active-plan state outside plans/ as workflow drift.
  - Mentions migration or template updates when current files are out of sync with the skill.
  - Calls out when a repo only has .claude hook wiring but lacks the shared .ai/ automation layer.

### codex-skill-factory-lifecycle

- Eval: `5`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/codex-skill-factory-lifecycle](../project-initializer-workspace/iteration-20260319-201733/codex/with_skill/codex-skill-factory-lifecycle)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Reads .claude/.skill-factory-state.json to understand current pattern counts.
  - Uses AGENTS.md Skill Factory protocol to group lessons by theme.
  - Runs bash scripts/skill-factory-check.sh to inspect current state.
  - After the third session, both workflow and knowledge proposals reach pending status.
  - Does not auto-create skills — proposals require explicit human promotion via skill-factory-create.sh.
  - Does not treat ordinary post-edit activity as optimization feedback.
  - Uses bash scripts/skill-factory-check.sh --record-feedback <slug> --signal <label> when explicit feedback is needed.

## codex / without_skill

| Eval | Status | Exit | Duration | Changed Files | Raw Artifacts |
| --- | --- | --- | ---: | ---: | --- |
| initialize-new-project | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/initialize-new-project) |
| repair-agents-task-sync | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/repair-agents-task-sync) |
| migrate-legacy-repo | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/migrate-legacy-repo) |
| audit-workflow-drift | dry_run | 0 | 0ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/audit-workflow-drift) |
| codex-skill-factory-lifecycle | dry_run | 0 | 1ms | 0 | [workspace](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/codex-skill-factory-lifecycle) |

### initialize-new-project

- Eval: `1`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/initialize-new-project](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/initialize-new-project)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Chooses a plausible core plan and explains the stack choice.
  - Includes tasks/todo.md, tasks/lessons.md, tasks/research.md, and tasks/contracts/ in the generated workflow.
  - Treats docs/PROGRESS.md as milestone-only instead of the active execution log.

### repair-agents-task-sync

- Eval: `2`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/repair-agents-task-sync](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/repair-agents-task-sync)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Calls out repo-local task sync as the primary enforcement mechanism.
  - Treats plans/ as the single source of truth for the active plan instead of relying on docs/plan.md.
  - Updates the final response contract to mention changed tasks files.
  - Avoids treating hooks as the only source of enforcement.

### migrate-legacy-repo

- Eval: `3`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/migrate-legacy-repo](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/migrate-legacy-repo)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Replaces docs/TODO.md with tasks/todo.md as the primary task contract.
  - Removes docs/plan.md compatibility pointers in favor of plans/ as the active-plan source of truth.
  - Adds repo-local task-sync enforcement such as scripts/check-task-sync.sh.
  - Updates migration guidance and scripts rather than only editing prose.
  - Installs a shared .ai/ hook layer and routes Claude hook settings through it.

### audit-workflow-drift

- Eval: `4`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/audit-workflow-drift](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/audit-workflow-drift)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Checks both Claude-specific hooks and cross-agent repo-local contracts.
  - Flags docs/PROGRESS.md misuse if it is acting as an execution log.
  - Flags duplicated active-plan state outside plans/ as workflow drift.
  - Mentions migration or template updates when current files are out of sync with the skill.
  - Calls out when a repo only has .claude hook wiring but lacks the shared .ai/ automation layer.

### codex-skill-factory-lifecycle

- Eval: `5`
- Workspace: [../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/codex-skill-factory-lifecycle](../project-initializer-workspace/iteration-20260319-201733/codex/without_skill/codex-skill-factory-lifecycle)
- Changed files: none
- Diff summary: no diff captured
- Final response excerpt: dry-run: no final response captured
- Expectations:
  - Reads .claude/.skill-factory-state.json to understand current pattern counts.
  - Uses AGENTS.md Skill Factory protocol to group lessons by theme.
  - Runs bash scripts/skill-factory-check.sh to inspect current state.
  - After the third session, both workflow and knowledge proposals reach pending status.
  - Does not auto-create skills — proposals require explicit human promotion via skill-factory-create.sh.
  - Does not treat ordinary post-edit activity as optimization feedback.
  - Uses bash scripts/skill-factory-check.sh --record-feedback <slug> --signal <label> when explicit feedback is needed.
