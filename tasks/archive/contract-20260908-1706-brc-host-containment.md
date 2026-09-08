> **Archived**: 2026-09-08 17:06
> **Related Plan**: plans/archive/plan-20260908-0420-brc-host-containment.md
> **Outcome**: Superseded
> **Lifecycle**: contract
> **Parent Run ID**: run-20260908-1706
> **Archive Projection V1**: `plans/plan-20260908-0420-brc-host-containment.md` => `plans/archive/plan-20260908-0420-brc-host-containment.md`
> **Archive Projection V1**: `tasks/notes/20260908-0420-brc-host-containment.notes.md` => `tasks/archive/notes-20260908-1706-brc-host-containment.md`
> **Archive Projection V1**: `tasks/contracts/20260908-0420-brc-host-containment.contract.md` => `tasks/archive/contract-20260908-1706-brc-host-containment.md`
> **Archive Projection V1**: `tasks/reviews/20260908-0420-brc-host-containment.review.md` => `tasks/archive/review-20260908-1706-brc-host-containment.md`

# Task Contract: brc-host-containment

> **Status**: Active
> **Plan**: plans/archive/plan-20260908-0420-brc-host-containment.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-08 05:38
> **Review File**: `tasks/archive/review-20260908-1706-brc-host-containment.md`
> **Notes File**: `tasks/archive/notes-20260908-1706-brc-host-containment.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The new Docker adapter misclassified a permutation of observed mounts as isolation drift. Its original pre-start checks also lacked a complete comparison against the authorization-derived containment spec.

## Goal

Connect the approved Docker carrier to campaign version probes, worker/verifier execution and terminal evidence, retaining budget, deadline, replay and admission invariants. Validate the combination with model-free real Docker evidence; report BRC6a separately.

## Scope

- In scope: the container expected-spec/compiler, runtime readback guards, pinned image/watchdog, saved-response diagnostic, campaign invocation/worker/recovery consumers, contract-run and helper mirror, and focused adapter/integration tests.
- Out of scope: BRC6a producer/admission changes without verified producer evidence, real provider calls, merge and premature issue closure.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The same saved mount facts still produce different guarded configuration identities, or an extra/writable mount, watchdog bypass or privilege change is admitted before start.

## Root Cause Evidence

- root_cause: campaign-container.configuration included the order of top-level Docker Mounts in its identity.
- repro: saved same-created-container reads in tests/fixtures/campaign-container-readback/mount-order.json.
- regression_guard: tests/effects/campaign-container-readback-diagnostic.test.ts retains the legacy rejecting projection and verifies the current semantic comparison.
- pre_fix_failure_artifact: .ai/harness/runs/brc-host-diagnosis/outcomes.json and response-10.json capture the real original rejection; this package introduces the previously unintegrated adapter and is classified code-change.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260908-0420-brc-host-containment.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260908-1706-brc-host-containment.md`
- Notes file: `tasks/archive/notes-20260908-1706-brc-host-containment.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol":1,"oracles":[]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - deploy/campaign-container/
  - src/core/automation/campaign-runtime.ts
  - src/effects/automation/campaign-runtime.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/campaign-recovery.ts
  - scripts/contract-run.ts
  - assets/templates/helpers/contract-run.ts
  - tests/unit/brc10-lifecycle.test.ts
  - tests/helpers/historical-campaign-lifecycle.ts
  - tests/effects/brc10-lifecycle.test.ts
  - tests/effects/campaign-closeout.test.ts
  - tests/effects/campaign-runtime-container.test.ts
  - src/core/automation/campaign-containment.ts
  - src/effects/automation/campaign-container.ts
  - scripts/diagnose-campaign-container-readback.ts
  - tests/effects/campaign-container-live.test.ts
  - tests/effects/campaign-container-readback-diagnostic.test.ts
  - tests/fixtures/campaign-container-readback/
  - docs/researches/2026-09-08-brc-container-readback-diagnosis.md
  - docs/architecture/.projection-manifest.json
  - plans/archive/plan-20260908-0420-brc-host-containment.md
  - tasks/todos.md
  - tasks/archive/contract-20260908-1706-brc-host-containment.md
  - tasks/archive/notes-20260908-1706-brc-host-containment.md
  - tasks/archive/review-20260908-1706-brc-host-containment.md
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

```yaml
exit_criteria:
  files_exist:
    - src/core/automation/campaign-runtime.ts
  - src/effects/automation/campaign-runtime.ts
  - src/effects/automation/campaign-worker.ts
  - src/effects/automation/campaign-recovery.ts
  - scripts/contract-run.ts
  - assets/templates/helpers/contract-run.ts
  - tests/unit/brc10-lifecycle.test.ts
  - tests/helpers/historical-campaign-lifecycle.ts
  - tests/effects/brc10-lifecycle.test.ts
  - tests/effects/campaign-closeout.test.ts
  - tests/effects/campaign-runtime-container.test.ts
  - src/core/automation/campaign-containment.ts
    - src/effects/automation/campaign-container.ts
    - tests/fixtures/campaign-container-readback/mount-order.json
  artifacts_exist:
    - docs/researches/2026-09-08-brc-container-readback-diagnosis.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "containment",
      "kind": "command",
      "command": "BRC_TEST_CONTAINER_IMAGE=sha256:72270cb098680b4e5e9e34f3ed7da6d861551bf946813a485069554055e08523 bun test tests/effects/campaign-container-live.test.ts tests/effects/campaign-container-readback-diagnostic.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers saved response drift, unsafe configuration rejection, real version/mount/descendant/deadline/cancel adapter paths without credentials.",
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
      "necessity": "Checks shared core/effect TypeScript interfaces.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "deploy-sql",
      "kind": "command",
      "command": "bash scripts/check-deploy-sql-order.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity.",
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
      "necessity": "Required capability/projection integrity.",
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
      "necessity": "Required task projection integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "task-workflow",
      "kind": "command",
      "command": "bash scripts/check-task-workflow.sh --strict",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required strict workflow integrity.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "state-inspection",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required project-state audit.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "init-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required non-mutating adoption inspection.",
      "inputs": {
        "env": []
      }
    }
  ]
}
```

No full-suite criterion: named invocation, worker, recovery, closeout, contract-run and real Docker tests cover the changed execution/evidence handoffs; admission remains fenced. Verification commands will be frozen after tracing the exact affected tests. Docker availability and the explicit pinned local ARM64 image are environmental prerequisites, never silently skipped in acceptance.

## Acceptance Notes (Human Review)

- Development evidence: 19 tests / 59 assertions pass; TypeScript check passes. Six required repository-integrity checks also pass. Canonical campaign acceptance remains unrecorded.
- Existing three failed blind iterations remain historical evidence; user explicitly approved this field-level implementation after diagnosis.
- BRC6a is reported feasible by the user; its formal evidence is outside this adapter slice.
- No live provider or complete campaign lifecycle is claimed.

## Rollback Point

Base 38c26b2ada6a3071df40745b8eed6e06315695b6. Remove/revert this isolated carrier package without changing current campaign invocation consumers.


## Approved integration boundary

The user approved probe/worker consumer integration after the 19-test adapter result. The original three failed blind iterations remain historical; this is the explicit continuation authorization. Old native process-group evidence must fail closed, never acquire container inactivity authority.

## Current verification status

Paused after three failed consumer-integration batches under global AGENTS.md:44. Prior 19-test adapter/integrity evidence is baseline only. Current consumer wiring has partial development passes, a passing TypeScript check, unresolved test failures and no current integrity/acceptance run. The Verification Plan above is not yet frozen for consumer acceptance and must be updated before execution. See the notes and consumer-integration evidence directory.

## Authorized continuation

The user explicitly requested continuation after the stop report. Retain all prior failed batches; fix the identified test registration/outer harness bounds first, freeze source during process tests, then continue the existing controller-crash recovery slice. Workload deadlines, admission and issue closure criteria remain unchanged.
