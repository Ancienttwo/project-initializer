## Task Management Protocol

```yaml
TASK_SOURCES:
  - tasks/research.md
  - tasks/todo.md
  - tasks/contracts/
  - tasks/lessons.md
  - plans/
  - docs/PROGRESS.md

PHASES: research -> plan -> annotate -> todo -> implement -> verify -> feedback

ARCHIVE:
  PLAN: plans/archive/
  TODO: tasks/archive/

RULES:
  - Treat repo-local tasks/ files as the primary cross-agent workflow contract
  - For non-chat tasks, sync tasks/ whenever substantive work changes the repo
  - Research first for unfamiliar areas and persist findings in tasks/research.md
  - Plan with trade-offs in plans/plan-{timestamp}-{slug}.md
  - Treat the latest non-archived plans/plan-*.md file as the active plan
  - Process annotation notes before implementing
  - Extract approved plan tasks into tasks/todo.md
  - Define task contracts in tasks/contracts/{slug}.contract.md
  - Verify contracts before claiming completion
  - Track progress with verification evidence in tasks/todo.md
  - Record correction-derived prevention rules in tasks/lessons.md
  - Group repeated lessons by theme so Skill Factory can promote them into knowledge skills
  - Treat `.ai/hooks/` as the shared automation entrypoint when repo scripts reference hook-backed workflow checks
  - Treat `.claude/settings.json` as the Claude-specific adapter, not the cross-agent source of truth
  - Before ending a session, refresh `.claude/.task-handoff.md` when the task state changed
  - If you explicitly use a generated skill, mark it with `bash scripts/skill-factory-check.sh --mark-used <slug> --type <workflow|knowledge>`
  - Check pending Skill Factory proposals with `bash scripts/skill-factory-check.sh`
  - Use docs/PROGRESS.md for milestones only, not active execution logs
  - Archive completed/abandoned plans and todos with metadata

ACTIVE_PLAN:
  - plans/ is the single source of truth for the current active plan
```

---
