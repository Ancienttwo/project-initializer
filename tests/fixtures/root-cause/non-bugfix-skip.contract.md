# Task Contract: root-cause-fixture-non-bugfix-skip

> **Status**: Active
> **Task Profile**: code-change
> **Owner**: fixture

## Why

Shared root-cause gate fixture (see tests/fixtures/root-cause/expected-results.ts): proves
a non-bugfix contract is never subject to the Root Cause Evidence gate, even when that
section is left as the raw, unfilled template placeholder below.

## Goal

Exercise the root-cause gate's non-bugfix skip path.

## Scope

- In scope: tests/fixtures/root-cause/ fixture content only.
- Out of scope: everything else in the repository.

## Root Cause Evidence

Required when Task Profile is `bugfix`; leave as-is otherwise.

- root_cause: one sentence naming file:line/condition (testable, not "a state issue").
- repro: the command or UI path that reproduces the symptom.
- regression_guard: path to a test that fails on the unfixed code and passes after the fix (must also appear under the canonical Verification Plan).
- pre_fix_failure_artifact: path to a captured run of regression_guard on the UNFIXED code. Capture with `bun test <regression_guard> > <artifact> 2>&1; echo "PRE_FIX_EXIT=$?" >> <artifact>` (no pipes — pipes swallow the exit status). The gate requires a non-zero `PRE_FIX_EXIT=` line plus the regression_guard path string in the artifact (see H2/H3).

## Allowed Paths

```yaml
allowed_paths:
  - tests/fixtures/root-cause/
```

## Evidence Requirements

```yaml
evidence_requirements:
  benchmark: not_applicable
```

## Exit Criteria (Machine Verifiable)

```yaml
exit_criteria:
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "fixture-regression-guard",
      "kind": "package_test",
      "path": "tests/fixtures/root-cause/other-guard.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "This fixture declares its root-cause regression guard explicitly.",
      "inputs": { "env": [] }
    }
  ]
}
```
