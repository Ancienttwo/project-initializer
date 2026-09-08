> **Archived**: 2026-09-08 17:11
> **Related Plan**: plans/archive/plan-20260908-1627-brc354-independent-supervision.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1711
> **Archive Projection V1**: `plans/plan-20260908-1627-brc354-independent-supervision.md` => `plans/archive/plan-20260908-1627-brc354-independent-supervision.md`
> **Archive Projection V1**: `tasks/notes/20260908-1627-brc354-independent-supervision.notes.md` => `tasks/archive/notes-20260908-1711-brc354-independent-supervision.md`
> **Archive Projection V1**: `tasks/contracts/20260908-1627-brc354-independent-supervision.contract.md` => `tasks/archive/contract-20260908-1711-brc354-independent-supervision.md`
> **Archive Projection V1**: `tasks/reviews/20260908-1627-brc354-independent-supervision.review.md` => `tasks/archive/review-20260908-1711-brc354-independent-supervision.md`

# Task Contract: brc354-independent-supervision

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260908-1627-brc354-independent-supervision.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 16:27
> **Review File**: `tasks/archive/review-20260908-1711-brc354-independent-supervision.md`
> **Notes File**: `tasks/archive/notes-20260908-1711-brc354-independent-supervision.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Worker-writable logs and summaries cannot independently establish terminal output or inactivity (#354).

## Goal

Integrate the preserved Docker producer and actual runtime consumers with host-only supervision journals; keep active admission closed.

## Scope

- In scope: containment producer, runtime v2, contract-run source/template, terminal and interruption consumers, model-free regressions and integration evidence.
- Out of scope: active campaigns, model calls, model selection changes, package release, unrelated worktree cleanup.
- Taste constraints: <!-- advisory only, no run gate; default style/taste lives in AGENTS.md and the minimal-change policy, use this to record a per-task override -->

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

A forged worktree log and matching local digest accepted by the actual terminal consumer, or a mounted host journal, falsifies isolation. Test after wrapper exit and before consumption.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear as a `package_test` check in Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-1627-brc354-independent-supervision.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1711-brc354-independent-supervision.md`
- Notes file: `tasks/archive/notes-20260908-1711-brc354-independent-supervision.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[{"id":"runtime-docker","kind":"runtime_readback","paths":["*"]},{"id":"lifecycle-regression","kind":"deterministic_test","paths":["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/2026-09-08-brc354-independent-supervision.md
  - docs/architecture/.projection-manifest.json
  - docs/architecture/modules/
  - deploy/campaign-container/
  - scripts/contract-run.ts
  - assets/templates/helpers/contract-run.ts
  - plans/
  - tasks/todos.md
  - tasks/archive/contract-20260908-1711-brc354-independent-supervision.md
  - tasks/archive/review-20260908-1711-brc354-independent-supervision.md
  - tasks/archive/notes-20260908-1711-brc354-independent-supervision.md
  - .ai/context/capabilities.json
  - .claude/templates/
  - src/
  - tests/
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
    - src/effects/automation/campaign-container.ts
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260908-1711-brc354-independent-supervision.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "runtime-docker",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-runtime-container.test.ts tests/effects/campaign-container-live.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Sixteen actual Docker checks passed on d2e311f4. Subsequent changes only bind workflow metadata; compare all implementation and test inputs byte-for-byte instead of repeating Docker.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-c16e467c5e8849cd8928.json",
        "execution_id": "vx-c16e467c5e8849cd8928"
      },
      "delta_checks": [
        "source-unchanged"
      ]
    },
    {
      "id": "lifecycle-regression",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/brc10-lifecycle.test.ts tests/effects/campaign-closeout.test.ts tests/unit/brc10-lifecycle.test.ts tests/campaign-finish-failure-audit.test.ts tests/bounded-supervisor-audit.test.ts tests/effects/campaign-containment.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "expensive",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Retain passing lifecycle/closeout/settlement baseline at db261e16. The only production delta changes cleanup kill exit handling to consume fresh inactivity; current real Docker tests cover this race and recovery. No lifecycle consumer changes.",
      "inputs": {
        "env": [
          "BRC_TEST_CONTAINER_IMAGE"
        ]
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-a9feb18d252440e5a024.json",
        "execution_id": "vx-a9feb18d252440e5a024"
      },
      "delta_checks": [
        "cleanup-race",
        "typecheck",
        "evidence-redaction"
      ]
    },
    {
      "id": "typecheck",
      "kind": "command",
      "command": "bun run check:type",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Shared runtime protocol and consumers typecheck.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helper-parity",
      "kind": "command",
      "command": "cmp scripts/contract-run.ts assets/templates/helpers/contract-run.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Packaged caller must use identical supervision boundary.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-0",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-1",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-2",
      "kind": "command",
      "command": "bash scripts/check-task-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-3",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-4",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrity-5",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "source-unchanged",
      "kind": "command",
      "command": "git diff --exit-code d2e311f4 -- src/core/automation/ src/effects/automation/ scripts/contract-run.ts assets/templates/helpers/contract-run.ts deploy/campaign-container/ tests/effects/brc10-lifecycle.test.ts tests/effects/campaign-closeout.test.ts tests/effects/campaign-container-live.test.ts tests/effects/campaign-containment.test.ts tests/effects/campaign-runtime-container.test.ts tests/fixtures/brc-audit/finish-failure.ts tests/fixtures/campaign-container-readback/ tests/helpers/historical-campaign-lifecycle.ts tests/unit/brc10-lifecycle.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves Docker acceptance inputs unchanged since its passing fixed-revision run.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "cleanup-race",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-container-live.test.ts -t \"cleanup consumes\"",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the only production delta since lifecycle baseline; fresh exact-container inactivity after kill races namespace exit.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "evidence-redaction",
      "kind": "command",
      "command": "bun test tests/evidence-event-store.test.ts tests/evidence-projection-drift.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Single directly blocking evidence projection fix: typed extensionless path arrays remain fingerprint-consistent while secret/traversal/free-text redaction remains enforced.",
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

- Functional behavior: active admission remains closed; the Docker runtime replaces host Codex execution for managed invocations.
- Edge cases: host-only journals authenticate output and original identity; interruption proves inactivity only.
- Regression risks: Docker 28.3.2/API 1.51 and a pinned local image are required. Historical fixtures model producer facts and are not live acceptance.

## Rollback Point

- Commit / checkpoint: main d4852017f6fc5d9a5167bdf5b64eaf48f9b442c1.
- Revert strategy: revert this integration; no campaign activation or data migration.
