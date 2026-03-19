## Project Structure

```
{{PROJECT_STRUCTURE}}
```

### Tech Stack

| Layer | Technology |
|-------|------------|
{{TECH_STACK_TABLE}}

---

## Workflow Rules

- Prefer modifying existing files over adding new files.
- {{RUNTIME_MODE}} by default for file mutations.
- Primary worktree warns by default; enforce via `.claude/.require-worktree`.
- Commit explicitly after green checks; no automatic checkpoint hook in the shared preset.
- Keep execution contracts in `tasks/todo.md` and `tasks/lessons.md`.
