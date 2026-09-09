# Task Contract: campaign-execution-environment

> **Status**: Active
> **Plan**: plans/plan-20260909-2347-campaign-execution-environment.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-09 23:47
> **Review File**: `tasks/reviews/20260909-2347-campaign-execution-environment.review.md`
> **Notes File**: `tasks/notes/20260909-2347-campaign-execution-environment.notes.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

A Codex version probe does not establish task readiness. The image must supply the actual harness package and target-native dependencies before paid execution.

## Goal

Build an immutable local campaign image containing the selected packed harness and provide an explicit no-auth operator preflight through existing containment, proving the target Linux verification tools work.

## Scope

- In scope: image supply, local build script, no-auth operator preflight, focused regression and real Linux dependency probe.
- Out of scope: campaign recovery, budget changes, grant minting, watchdog/mount permission changes, package publication and unrelated Docker infrastructure.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The supplied image cannot run the real repo-harness verify-sprint helper in existing containment, or Linux-native package loading still fails after lockfile-bound preparation. Original-image regression is the cheapest proof.

## Root Cause Evidence

Original frozen image failed the actual helper regression with exit 127.

- root_cause: deploy/campaign-container/Dockerfile installs Codex but not harness, while campaign-runtime only probes Codex and mounts host-prepared native dependencies into Linux.
- repro: BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-environment.test.ts
- regression_guard: tests/effects/campaign-environment.test.ts
- pre_fix_failure_artifact: tasks/evidence/campaign-execution-environment-pre-fix.log

## Workflow Inventory

- Source plan: `plans/plan-20260909-2347-campaign-execution-environment.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/reviews/20260909-2347-campaign-execution-environment.review.md`
- Notes file: `tasks/notes/20260909-2347-campaign-execution-environment.notes.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"campaign-image-runtime-readback","kind":"runtime_readback","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - deploy/campaign-container/Dockerfile
  - scripts/build-campaign-image.sh
  - scripts/run-campaign-preflight.ts
  - tests/effects/campaign-environment.test.ts
  - docs/researches/20260909-campaign-execution-environment.md
  - docs/architecture/
  - tasks/
  - plans/
  - .archcontext/
  - .ai/context/
```

## Evidence Requirements

```yaml
evidence_requirements:
  # Set benchmark to required when this contract consumes the harness profile benchmark matrix.
  benchmark: not_applicable
```

## Delegation Contract

```yaml
delegation:
  budget:
    tokens: null
    runner_invocations: null
    wall_time_minutes: null
  permission_scope:
    mode: inherit_allowed_paths
    writable_paths: []
    network: inherited
  roles:
    parent:
      mode: narrate_and_gatekeep
      purpose: approval_checkpoint_owner
    explorer:
      mode: read_only
      purpose: codebase_research
    worker:
      mode: edit_within_allowed_paths
      purpose: implementation
    verifier:
      mode: read_only
      purpose: exit_criteria_review
  runner:
    preferred:
      - subagent
    fallback: null
    brief_is_authoritative: true
```

## Exit Criteria (Machine Verifiable)

This block contains only non-executable artifact requirements. Define every
executable check once in the canonical Verification Plan below. Each check must
state its phase, cost, evidence policy, necessity, and input environment; a
missing or malformed plan fails closed.

```yaml
exit_criteria:
  files_exist:
    - docs/researches/20260909-campaign-execution-environment.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/notes/20260909-2347-campaign-execution-environment.notes.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "environment",
      "kind": "package_test",
      "path": "tests/effects/campaign-environment.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Real packaged harness and helper in the pinned Linux image; zero model calls.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
      }
    },
    {
      "id": "containment",
      "kind": "package_test",
      "path": "tests/effects/campaign-containment.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Existing exact mounts and security request invariants remain enforced.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "TypeScript integration",
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
      "necessity": "Required integrity",
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
      "necessity": "Required architecture integrity",
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
      "necessity": "Required diff-bound task integrity",
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
      "necessity": "Required workflow integrity",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required project state",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required adoption dry-run",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

This is the sole executable verification authority. Use `baseline_with_delta`
only when a referenced immutable baseline plus named current delta checks prove
the intended coverage; do not infer that choice from paths or command text.

## Acceptance Notes (Human Review)

- Functional behavior: exact packed harness CLI and Linux target tools, no credentials or campaign mutations.
- Edge cases: command failure, absent command, bounded deadline and readonly preflight preserve failure results.
- Regression risks: image artifact content and trusted helper resolution; verify through the actual container, not source assertions.

## Rollback Point

- Commit / checkpoint: origin/main 721d8f31.
- Revert strategy: revert this isolated PR and retain all recorded failure/stop evidence.
