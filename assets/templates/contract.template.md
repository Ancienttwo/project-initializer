# Task Contract: {{TASK_SLUG}}

> **Status**: Pending
> **Plan**: {{PLAN_FILE}}
> **Owner**: {{OWNER}}
> **Last Updated**: {{TIMESTAMP}}

## Goal

Describe the exact outcome this task must deliver.

## Exit Criteria (Machine Verifiable)

```yaml
exit_criteria:
  files_exist:
    - src/modules/{{TASK_SLUG}}/index.ts
  tests_pass:
    - path: tests/unit/{{TASK_SLUG}}.test.ts
  commands_succeed:
    - bun run typecheck
  files_contain:
    - path: src/modules/{{TASK_SLUG}}/index.ts
      pattern: "export"
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Optional Visual Checks

- Screenshot path (optional):
- What to verify visually:
