> **Archived**: 2026-09-06 18:24
> **Related Plan**: plans/archive/plan-20260906-1746-verification-id-binding.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260906-1824
> **Archive Projection V1**: `plans/plan-20260906-1746-verification-id-binding.md` => `plans/archive/plan-20260906-1746-verification-id-binding.md`
> **Archive Projection V1**: `tasks/notes/20260906-1746-verification-id-binding.notes.md` => `tasks/archive/notes-20260906-1824-verification-id-binding.md`
> **Archive Projection V1**: `tasks/contracts/20260906-1746-verification-id-binding.contract.md` => `tasks/archive/contract-20260906-1824-verification-id-binding.md`
> **Archive Projection V1**: `tasks/reviews/20260906-1746-verification-id-binding.review.md` => `tasks/archive/review-20260906-1824-verification-id-binding.md`

# Task Contract: verification-id-binding

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260906-1746-verification-id-binding.md
> **Task Profile**: bugfix
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-06 17:46
> **Review File**: `tasks/archive/review-20260906-1824-verification-id-binding.md`
> **Notes File**: `tasks/archive/notes-20260906-1824-verification-id-binding.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

Installed runtime accepts a long check ID but redacts its ledger display value; ID-based control lookup misses the prior pass and repeats an expensive command.

## Goal

Preserve one ordinary expensive execution for admitted long or renamed check IDs, reject invalid receipt identities, and complete the Verification Plan cutover in consumers exposed by Required CI.

## Scope

- In scope: execution/cache fingerprint lookup and materialized receipt ID binding; Verification Plan/template fixture migrations and helper/protocol inventories proven missing by CI run 34025058232.
- Out of scope: global redaction policy, schema ID-length restrictions, unrelated workflows, local full suite.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

The installed counter reaches 2 after two ordinary expensive requests for a valid long ID, or a newer failure/invalid record revives an older pass. The captured /tmp/rh-cutover-long-check-id-repro.json proves the existing failure.

## Root Cause Evidence

- root_cause: src/effects/evidence/verification-execution.ts compares redacted ledger payload.check_id with raw contract IDs in reuse/prior-execution lookup, so the same executable cache key is treated as unseen.
- repro: installed CLI execute twice with ID verification-execution-lifecycle-full-suite-check; counter is 2 and evaluate is missing.
- regression_guard: tests/effects/verification-execution.test.ts
- pre_fix_failure_artifact: .ai/harness/evidence/pre-fix/verification-id-binding.log

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-1746-verification-id-binding.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-1824-verification-id-binding.md`
- Notes file: `tasks/archive/notes-20260906-1824-verification-id-binding.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{"protocol": 1, "oracles": [{"id": "identity-regressions", "kind": "deterministic_test", "paths": ["*"]}, {"id": "installed-counter", "kind": "runtime_readback", "paths": ["*"]}]}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - docs/researches/20260829-c0-collaboration-two-plane-authority-freeze.md
  - assets/templates/contract.template.md
  - .claude/templates/contract.template.md
  - tests/unit/verification-plan.test.ts
  - scripts/run-skill-evals.ts
  - tests/run-skill-evals.test.ts
  - tests/hook-contracts.test.ts
  - src/cli/commands/run.ts
  - tests/unit/collaboration-authority-baseline.test.ts
  - tests/effects/campaign-acquisition.test.ts
  - tests/cli/fleet-offer-acquire.test.ts
  - tests/fleet-acquire-concurrency.test.ts
  - tests/continuation-conformance.test.ts
  - src/effects/evidence/verification-execution.ts
  - tests/effects/verification-execution.test.ts
  - docs/researches/20260906-verification-execution-dataflow.md
  - docs/architecture/
  - plans/archive/plan-20260906-1746-verification-id-binding.md
  - tasks/
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
    - docs/spec.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-1824-verification-id-binding.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "identity-regression",
      "phase": "verification",
      "kind": "package_test",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers real command counters, long/renamed IDs, supersession, immutable evidence and projected receipt tampering.",
      "inputs": {
        "env": []
      },
      "path": "tests/effects/verification-execution.test.ts"
    },
    {
      "id": "receipt-adapters",
      "phase": "verification",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers source/projected consumers of the changed identity boundary.",
      "inputs": {
        "env": []
      },
      "command": "bun test --timeout 60000 tests/verification-lifecycle-adapters.test.ts tests/acceptance-receipt.test.ts tests/acceptance-receipt-evidence-fingerprint.test.ts"
    },
    {
      "id": "typecheck",
      "phase": "preflight",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks effect and consumer TypeScript contracts.",
      "inputs": {
        "env": []
      },
      "command": "bun run check:type"
    },
    {
      "id": "projections",
      "phase": "preflight",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Checks generated consumers and unchanged security/module boundaries.",
      "inputs": {
        "env": []
      },
      "command": "bun scripts/sync-helper-sources.ts --check && bun scripts/sync-reference-configs.ts --check && bun scripts/check-state-boundaries.ts && cmp AGENTS.md CLAUDE.md && cmp assets/workflow-contract.v1.json .ai/harness/workflow-contract.json"
    },
    {
      "id": "repository-integrity",
      "phase": "preflight",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Runs the required repository checks for the bounded correction.",
      "inputs": {
        "env": []
      },
      "command": "bash scripts/check-deploy-sql-order.sh && bash scripts/check-architecture-sync.sh && REPO_HARNESS_DIFF_BASE=879c9bfdfee66af602ac462b0a759efbf3e60bd0 REPO_HARNESS_DIFF_MODE=merge-base bash scripts/check-task-sync.sh && bash scripts/check-task-workflow.sh --strict && bun scripts/inspect-project-state.ts --repo . --format text && REPO_HARNESS_SOURCE_ROOT=\"$PWD\" bun src/cli/index.ts init --repo . --dry-run"
    },
    {
      "id": "cutover-fixtures",
      "phase": "verification",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers real campaign and fleet acquisition, contention, and continuation through canonical template/plan fixtures.",
      "inputs": {
        "env": []
      },
      "command": "bun test --timeout 60000 tests/effects/campaign-acquisition.test.ts tests/cli/fleet-offer-acquire.test.ts tests/fleet-acquire-concurrency.test.ts tests/continuation-conformance.test.ts"
    },
    {
      "id": "cutover-consumers",
      "phase": "verification",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers CLI inventory, actual canonical templates, protocol adjudication, read-only hooks and eval contract generation.",
      "inputs": {
        "env": []
      },
      "command": "bun test --timeout 60000 tests/cli/run.test.ts tests/unit/verification-plan.test.ts tests/verification-authoring.test.ts tests/unit/collaboration-authority-baseline.test.ts tests/hook-contracts.test.ts tests/run-skill-evals.test.ts"
    },
    {
      "id": "card-projection",
      "phase": "verification",
      "kind": "command",
      "cwd": ".",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Covers the two CI failures caused by the canonical template without rerunning the whole helper integration file.",
      "inputs": {
        "env": []
      },
      "command": "bun test --timeout 60000 tests/helper-scripts.test.ts --test-name-pattern 'verify-sprint ignores Human Review Card semantics|verify-sprint does not require a Human Review Card authoring path'"
    }
  ]
}
```

## Acceptance Notes (Human Review)

- Continue the approved correction of repeated expensive execution; the existing accepted commit remains historical baseline.
- No full local suite is required: named identity, receipt, adapter and failed-CI consumer checks cover this boundary. The original Required CI failed and is not a passing baseline.
- Do not change the redactor or shorten admitted IDs to hide the failure.

## Rollback Point

- Commit / checkpoint: 879c9bfdfee66af602ac462b0a759efbf3e60bd0.
- Revert strategy: revert only the identity binding correction; retain immutable history and the red evidence.
