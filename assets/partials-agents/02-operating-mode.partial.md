## Operating Mode

- Default to **{{RUNTIME_MODE}}**.
- Runtime profile: {{RUNTIME_PROFILE}}.
- Recovery profile: `{{RECOVERY_PROFILE}}`.
- State profile: `{{STATE_PROFILE}}`.
- Claude runtime expectation: `{{CLAUDE_POLICY}}`.
- Codex runtime expectation: `{{CODEX_POLICY}}`.
- Do not implement until the user explicitly asks to implement.
- Stable product truth: `docs/spec.md`.
- Research contract: `tasks/research.md`.
- Canonical execution contract: `tasks/todo.md`.
- Sprint done contract: `tasks/contracts/`.
- Evaluator verdicts: `tasks/reviews/`.
- Structured checks: `.ai/harness/checks/latest.json`.
- Session handoff: `.ai/harness/handoff/current.md`.
- Lessons contract: `tasks/lessons.md`.
- Plan directory: `plans/` (timestamped plans).
- Active plan rule: latest non-archived `plans/plan-*.md` file.
- Plan archive: `plans/archive/`.
- Todo archive: `tasks/archive/`.
- Shared automation layer: `.ai/hooks/`.
- Claude adapter layer: `.claude/settings.json` calls `.ai/hooks/run-hook.sh`.
- After substantive repo changes, run `bash scripts/check-task-sync.sh` and `bash scripts/check-task-workflow.sh --strict`.
- Skill Factory state: `.claude/.skill-factory-state.json`.
- Run `bash scripts/skill-factory-check.sh` before ending a session when proposals or optimization hints matter.
- Primary worktree warns by default; enforce via `.claude/.require-worktree`.

---
