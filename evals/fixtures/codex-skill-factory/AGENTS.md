# AGENTS

This project uses tasks-first workflows with Skill Factory integration.

- Sync `tasks/todo.md` and `tasks/lessons.md` every session.
- Group repeated lessons by theme so Skill Factory can promote them into knowledge skills.
- If you explicitly use a generated skill, mark it with `bash scripts/skill-factory-check.sh --mark-used <slug> --type <workflow|knowledge>`.
- Check pending Skill Factory proposals with `bash scripts/skill-factory-check.sh`.
- Update `.claude/.task-handoff.md` before ending a session.
- Skill Factory state: `.claude/.skill-factory-state.json`.
- Run `bash scripts/skill-factory-check.sh` before ending a session when proposals or optimization hints matter.
