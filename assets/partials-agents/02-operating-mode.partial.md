## Operating Mode

- Default to **{{RUNTIME_MODE}}**.
- Runtime profile: {{RUNTIME_PROFILE}}.
- Do not implement until the user explicitly asks to implement.
- Research contract: `tasks/research.md`.
- Canonical execution contract: `tasks/todo.md`.
- Lessons contract: `tasks/lessons.md`.
- Plan directory: `plans/` (timestamped plans).
- Active plan rule: latest non-archived `plans/plan-*.md` file.
- Plan archive: `plans/archive/`.
- Todo archive: `tasks/archive/`.
- Shared automation layer: `.ai/hooks/`.
- Claude adapter layer: `.claude/settings.json` calls `.ai/hooks/run-hook.sh`.
- Skill Factory state: `.claude/.skill-factory-state.json`.
- Run `bash scripts/skill-factory-check.sh` before ending a session when proposals or optimization hints matter.
- Primary worktree warns by default; enforce via `.claude/.require-worktree`.

---
