### Plan Annotation Protocol

Use `tasks/research.md` for deep codebase understanding, `plans/` for timestamped plans, and `tasks/todo.md` for active execution.

```yaml
PLAN_LOOP:
  MODE: {{RUNTIME_PROFILE}}
  PHASES: research -> plan -> annotate -> todo -> implement -> verify -> feedback
  RESEARCH_FILE: tasks/research.md
  PLAN_DIR: plans/
  PLAN_ARCHIVE: plans/archive/
  ACTIVE_PLAN_RULE: latest timestamped file in plans/
  PRIMARY_FILE: tasks/todo.md
  TODO_ARCHIVE: tasks/archive/
  CONTRACT_DIR: tasks/contracts/
  LESSONS_FILE: tasks/lessons.md
  ANNOTATION_GUARD: do not implement until plan Status is "Approved"
  CONTRACT_GUARD: do not mark done until contract exit criteria pass
  EXECUTION_CONTEXT: primary worktree warning by default; enforce via .claude/.require-worktree
  COMMIT_POLICY: explicit commits after green checks; no automatic checkpoint hook
```

### Task Management Protocol

- Treat `tasks/` as the primary cross-agent contract; hooks are enhancements, not the only enforcement layer.
- For non-chat tasks, sync `tasks/` whenever substantive repo changes are made.
- Research deeply first for unfamiliar areas and persist findings in `tasks/research.md`.
- Plan in `plans/plan-YYYYMMDD-HHMM-{slug}.md` with explicit trade-offs and task breakdown.
- Treat the latest non-archived `plans/plan-*.md` file as the active plan.
- Process all annotation notes before implementation.
- Extract approved plan tasks into `tasks/todo.md`, archiving prior todo to `tasks/archive/`.
- Create `tasks/contracts/{slug}.contract.md` with machine-verifiable exit criteria.
- Mark done only with verification evidence.
- Convert user corrections into prevention rules in `tasks/lessons.md`.
- Use `docs/PROGRESS.md` for milestone updates only, not the active execution log.

### Release, Git, and Deployment References

- `docs/reference-configs/changelog-versioning.md`
- `docs/reference-configs/git-strategy.md`
- `docs/reference-configs/release-deploy.md`
