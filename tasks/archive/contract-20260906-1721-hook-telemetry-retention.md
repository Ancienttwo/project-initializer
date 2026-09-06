# Task Contract: hook-telemetry-retention

> **Status**: Superseded
> **Plan**: plans/archive/plan-20260906-1721-hook-telemetry-retention.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: runtime-harness-global-runtime-reconciliation
> **Last Updated**: 2026-09-06 17:21
> **Review File**: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md`
> **Notes File**: `tasks/archive/notes-20260906-1721-hook-telemetry-retention.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The live hook log exceeded 168 MB. Rotation must bound storage without silently dropping retained historical samples from either report consumer.

## Goal

Rename-based 8 MiB rotation, at most 32 archived segments and 256 MiB archived bytes, shared retained-history readers, and unchanged hook fail-open telemetry safety.

## Scope

- In scope: telemetry writer, bounded storage, two readers, named regression checks and documentation.
- Out of scope: live log migration, global runtime install, PR/BRC work, changes to event protocol or metric meaning.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

Loss or duplicate events during six-process rotation, reader omission of archived events, or deletion of a foreign/symlink target falsifies the design.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under exit_criteria.tests_pass).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see the Root Cause Evidence Gate section in docs/reference-configs/sprint-contracts.md).

## Workflow Inventory

- Source plan: `plans/archive/plan-20260906-1721-hook-telemetry-retention.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260906-1721-hook-telemetry-retention.md`
- Notes file: `tasks/archive/notes-20260906-1721-hook-telemetry-retention.md`
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
  - src/effects/hook-event-log.ts
  - src/cli/hook/event-telemetry.ts
  - scripts/hook-dispatch-diet-report.ts
  - scripts/run-harness-profile-benchmark.ts
  - tests/unit/hook-event-log.test.ts
  - docs/architecture/
  - docs/researches/20260906-release-todo-hardening.md
  - tasks/todos.md
  - plans/archive/plan-20260906-1721-hook-telemetry-retention.md
  - tasks/archive/contract-20260906-1721-hook-telemetry-retention.md
  - tasks/archive/notes-20260906-1721-hook-telemetry-retention.md
  - tasks/archive/review-20260906-1721-hook-telemetry-retention.md
  - tasks/workstreams/
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

Choose the smallest checks that cover the changed behavior. Add a full suite
only for an explicit release requirement or an observed cross-module coverage
gap; state that reason and expected cost in Acceptance Notes. Do not duplicate
coverage between `tests_pass` and `commands_succeed`. Before the first run,
list eligible deterministic criteria in `criterion_reuse`; eligibility requires
all inputs to be bound by the frozen subject/toolchain context. Leave external
or mutable-state criteria ineligible. The canonical acceptance runner owns the
expensive execution; workers and reviewers consume its evidence.

If a full suite already passed before a bounded follow-up edit, preserve its
run identity as baseline evidence and choose focused checks for the actual delta.
The parent revises these criteria and records the baseline plus coverage rationale
in Acceptance Notes, unless an explicit user/release requirement still requires
a full run on the new subject. A cache miss alone does not justify another full
suite; never label the old subject's pass as a full pass for the new subject.

```yaml
exit_criteria:
  files_exist:
    - docs/spec.md
  artifacts_exist:
    - .ai/harness/checks/latest.json
    - tasks/archive/notes-20260906-1721-hook-telemetry-retention.md
  tests_pass:
    - path: tests/unit/hook-event-log.test.ts
    - path: tests/unit/hrd-08-event-telemetry-and-benchmark.test.ts
    - path: tests/hook-dispatch-diet-report.test.ts
    - path: tests/harness-benchmark-matrix.test.ts
    - path: tests/hook-runtime.test.ts
    - path: tests/hook-runtime-characterization.test.ts
  commands_succeed:
    - bun run check:type
criterion_reuse:
  tests_pass: []
  commands_succeed: []
```

## Acceptance Notes (Human Review)

- Functional behavior: retained segment metrics, stable protocol and bounded evidence cache.
- Edge cases: symlinks, missing/custom paths, UTF-8 chunk boundaries, count/byte caps and concurrent appends.
- Regression risks: only named writer/readers change; 63 focused tests pass. No full product suite is justified.

## Rollback Point

- Commit / checkpoint:
- Revert strategy:

Implementation is included in the user-approved release integration contract `tasks/contracts/20260906-1732-checks-artifact-repair.contract.md`; this historical slice does not claim separate external acceptance.
