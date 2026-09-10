# Task Contract: operator-task-diff

> **Status**: Active
> **Plan**: plans/plan-20260910-2225-operator-task-diff.md
> **Task Profile**: code-change
> **Workflow Profile**: strict
> **Owner**: ancienttwo
> **Capability ID**: root
> **Review File**: `tasks/reviews/20260910-2225-operator-task-diff.review.md`
> **Notes File**: `tasks/notes/20260910-2225-operator-task-diff.notes.md`

## Goal

Merge the authorized read-only task worktree diff with no configured Git command execution through the GET reader. Preserve canonical target/worktree identity and explicit refusal semantics.

## Why

A local diff endpoint must not execute repository clean filters or fsmonitor commands. The merge boundary also requires exact-subject acceptance under the main policy.

## Scope

- In scope: existing feature paths, external-filter refusal, fsmonitor disablement, real-Git regressions and final acceptance.
- Out of scope: package release, TeamAI, the old retention release branch and primary WIP.

## Allowed Paths

```yaml
allowed_paths:
  - docs/architecture/.projection-manifest.json
  - .github/workflows/ci.yml
  - src/core/operator/task-diff.ts
  - src/effects/operator/task-diff.ts
  - src/effects/operator/task-diff-worker.ts
  - src/effects/operator/server.ts
  - src/operator-web/TaskDiff.tsx
  - src/operator-web/App.tsx
  - src/operator-web/i18n.ts
  - src/operator-web/styles.css
  - tests/effects/operator-task-diff.test.ts
  - tests/cli/operator-serve.test.ts
  - tests/effects/operator-write-boundary.test.ts
  - tests/operator-web/operator-task-diff.test.tsx
  - docs/researches/20260901-operator-board-audit-hardening.md
  - plans/
  - tasks/contracts/20260910-2225-operator-task-diff.contract.md
  - tasks/reviews/20260910-2225-operator-task-diff.review.md
  - tasks/notes/20260910-2225-operator-task-diff.notes.md
```

## Change Assessment

```json
{"protocol":1,"oracles":[]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Evidence Requirements

```yaml
evidence_requirements:
  benchmark: not_applicable
```

## Exit Criteria

```yaml
exit_criteria:
  files_exist:
    - src/effects/operator/task-diff.ts
    - tests/effects/operator-task-diff.test.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "operator",
      "kind": "command",
      "command": "bun test tests/effects/operator-task-diff.test.ts tests/cli/operator-serve.test.ts tests/operator-web/operator-task-diff.test.tsx tests/operator-web/operator-interactions.test.tsx tests/operator-web/operator-ui.test.tsx tests/unit/operator-web-types.test.ts tests/effects/operator-write-boundary.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "type",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "build",
      "kind": "command",
      "command": "bun run build:operator-web",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "hooks",
      "kind": "command",
      "command": "bun run check:hooks",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helpers",
      "kind": "command",
      "command": "bun run check:helpers",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-sync",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "inspect",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "init",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Final merge acceptance for the operator read boundary and required repository integrity; no full suite.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

## Acceptance Notes

Final checks cover the security correction plus the full bounded operator surface. Prior 211 tests are development evidence; no expensive/full suite is authorized locally. GitHub Required / CI remains required. Primary WIP must not enter this branch.
