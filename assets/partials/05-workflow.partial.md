### Plan Annotation Protocol

Use `tasks/research.md` for deep codebase understanding, `plans/` for timestamped plans, and `tasks/todo.md` for active execution.

```yaml
PLAN_LOOP:
  MODE: {{RUNTIME_PROFILE}}
  PHASES: research -> plan -> annotate -> todo -> implement -> verify -> feedback
  RESEARCH_FILE: tasks/research.md
  PLAN_DIR: plans/
  PLAN_ARCHIVE: plans/archive/
  ACTIVE_PLAN_RULE: .claude/.active-plan marker if present, otherwise latest timestamped file in plans/
  PLAN_SWITCH: scripts/switch-plan.sh --plan <plan-file> | --list
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

Core rules (canonical source: see Workflow Orchestration section below):
- `tasks/` is the primary cross-agent contract; hooks are enhancements only.
- Treat the latest non-archived `plans/plan-*.md` as the active plan.
- Mark done only with verification evidence.
- `docs/PROGRESS.md` is for milestones only, not the active execution log.

### Release, Git, and Deployment References

- `docs/reference-configs/changelog-versioning.md`
- `docs/reference-configs/git-strategy.md`
- `docs/reference-configs/release-deploy.md`

{{#IF FACTOR_FACTORY_ENABLED}}
### Factor Research Protocol

- `tasks/factors/registry.json` is the authoritative factor inventory for Plan G projects.
- Use `bash scripts/factor-lab-new.sh --name <slug>` to create a candidate workspace.
- Use `bash scripts/factor-lab-promote.sh --name <slug>` only after `hypothesis.md` and `backtest-summary.md` exist.
- Use `bash scripts/factor-lab-reject.sh --name <slug> --reason "<reason>"` to reject a candidate with an auditable reason.
- Use `bash scripts/factor-lab-check.sh` to validate registry state, candidate completeness, and promoted directory drift.
{{/IF}}
