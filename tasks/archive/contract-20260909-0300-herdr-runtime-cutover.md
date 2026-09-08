> **Archived**: 2026-09-09 03:00
> **Related Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Outcome**: Completed
> **Lifecycle**: contract
> **Parent Run ID**: run-20260909-0300
> **Archive Projection V1**: `plans/plan-20260909-0125-herdr-runtime-cutover.md` => `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/notes/20260909-0125-herdr-runtime-cutover.notes.md` => `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/contracts/20260909-0125-herdr-runtime-cutover.contract.md` => `tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md`
> **Archive Projection V1**: `tasks/reviews/20260909-0125-herdr-runtime-cutover.review.md` => `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`

# Task Contract: herdr-runtime-cutover

> **Status**: Fulfilled
> **Plan**: plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
> **Task Profile**: code-change
> <!-- legal values: code-change | docs-only | ledger-closeout | migration | eval-only | delegated-run | bugfix (omit for legacy passthrough); see docs/reference-configs/sprint-contracts.md -->
> **Owner**: ancienttwo
> **Capability ID**: root
> **Last Updated**: 2026-09-09 01:25
> **Review File**: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`
> **Notes File**: `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
> **Exemplar**: `docs/reference-configs/contract-brief-example.md`

## Why

The owner reports unreliable cross-agent tmux input. Replace the required terminal runtime without weakening message receipts, process cleanup or review acceptance.

## Goal

Require herdr 0.9.0 or newer, replace tmux notification and persistent review hosting, and remove tmux fallback guidance. Preserve off-mode policy, explicit endpoint identity, at-most-once effects and exact AcceptanceReceipt.

## Scope

- In scope: the runtime, lifecycle, readiness, guidance and exact adapter/provider contract cutover in the approved plan.
- Out of scope: enabling runtime policy, editing existing user sessions, release/publish, new scheduler or automatic legacy migration.
- Taste constraints: remove retired paths; no tmux fallback or second message authority.

## Stop Conditions

- Stop and hand back to the parent if the change would require editing a path outside Allowed Paths.
- Stop if an Exit Criteria command cannot be run in this environment.
- Stop if Goal, Scope, or Exit Criteria are internally contradictory.

## Falsifier

If herdr cannot expose owned server/pane process identities or preserve independent provider cleanup, do not replace that lifecycle. Probe installed headless server and process-info before implementing lifecycle changes.

## Workflow Inventory

- Source plan: `plans/archive/plan-20260909-0125-herdr-runtime-cutover.md`
- Deferred-goal ledger: `tasks/todos.md`
- Review file: `tasks/archive/review-20260909-0300-herdr-runtime-cutover.md`
- Notes file: `tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md`
- Checks file: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope gate: edit only paths listed under `allowed_paths`; update this contract before widening scope.
- Completion gate: run `verify-sprint --prepare-acceptance`, record one typed AcceptanceReceipt under the frozen policy below, then run `verify-sprint`; review Markdown is projection only.

## Change Assessment

```json
{
  "protocol": 1,
  "oracles": [
    {
      "id": "runtime-contracts",
      "kind": "deterministic_test",
      "paths": [
        "src/cli/commands/engineer.ts",
        "src/cli/mcp/engineer-tools.ts",
        "src/core/engineers/agent-runtime-effect.ts",
        "src/core/engineers/principal-claim.ts",
        "src/effects/engineers/agent-runtime-adapters/herdr-cli-agent.ts",
        "src/effects/engineers/agent-runtime-adapters/tmux-cli-agent.ts",
        "src/effects/engineers/agent-runtime-effect-store.ts",
        "src/effects/engineers/agent-runtime-feature.ts",
        "src/effects/engineers/principal.ts",
        "src/operator-web/fixture.ts",
        "src/operator-web/types.ts",
        "tests/cli/engineer.test.ts",
        "tests/cli/mcp-engineer-tools.test.ts",
        "tests/unit/fleet-board.test.ts",
        "tests/unit/issue-279-automation-controller-run.test.ts",
        "tests/unit/issue-281-task-offer-wake.test.ts",
        "tests/unit/operator-fleet-snapshot.test.ts",
        "tests/unit/operator-web-types.test.ts",
        "tests/unit/r1-agent-runtime-adapters.test.ts",
        "tests/unit/r1-provider-neutral-agent-runtime.test.ts"
      ]
    },
    {
      "id": "review-lifecycle",
      "kind": "deterministic_test",
      "paths": [
        "docs/researches/20260909-herdr-runtime-cutover.md",
        "src/cli/commands/claude-review.ts",
        "src/effects/review/claude-review-host.ts",
        "src/effects/review/claude-review-session.ts",
        "src/effects/terminal/herdr.ts",
        "tests/claude-review.test.ts",
        "tests/herdr-transport.test.ts"
      ]
    },
    {
      "id": "readiness-guidance-adoption",
      "kind": "deterministic_test",
      "paths": [
        ".ai/harness/policy.json",
        "README.md",
        "assets/reference-configs/external-tooling.md",
        "assets/reference-configs/global-working-rules.md",
        "assets/skills/repo-harness-cross-review/references/claude-mode.md",
        "assets/templates/helpers/check-agent-tooling.sh",
        "docs/reference-configs/external-tooling.md",
        "docs/reference-configs/global-working-rules.md",
        "docs/spec.md",
        "scripts/check-agent-tooling.sh",
        "src/cli/commands/init.ts",
        "src/core/adoption/standard-plan.ts",
        "tests/check-agent-tooling.test.ts",
        "tests/cli/adoption-plan.test.ts",
        "tests/unit/herdr-optional-peer-harness.test.ts",
        "tests/unit/herdr-peer-harness.test.ts"
      ]
    },
    {
      "id": "architecture-reconciliation",
      "kind": "deterministic_test",
      "paths": [
        ".ai/context/context-map.json",
        ".archcontext/model/nodes/capability.runtime-harness.agent-runtime-effects.yaml",
        "docs/architecture/.projection-manifest.json",
        "docs/architecture/changelog.md",
        "docs/architecture/decisions/index.md",
        "docs/architecture/diagrams/architecture.likec4",
        "docs/architecture/diagrams/architecture.mmd",
        "docs/architecture/diagrams/architecture.structurizr.json",
        "docs/architecture/index.md",
        "docs/architecture/modules/runtime-harness/agent-runtime-effects.md",
        "docs/architecture/requests/runtime-harness-agent-runtime-effects.md",
        "src/core/engineers/AGENTS.md",
        "src/core/engineers/CLAUDE.md"
      ]
    }
  ]
}
```

## Acceptance Policy

```json
{"protocol":2,"reviewer":"Codex","source":"codex-plugin","user_waiver":"allowed"}
```

## Allowed Paths

```yaml
allowed_paths:
  - src/
  - tests/
  - scripts/check-agent-tooling.sh
  - assets/templates/helpers/check-agent-tooling.sh
  - assets/reference-configs/global-working-rules.md
  - assets/reference-configs/external-tooling.md
  - assets/skills/repo-harness-cross-review/references/claude-mode.md
  - docs/spec.md
  - docs/reference-configs/global-working-rules.md
  - docs/reference-configs/external-tooling.md
  - docs/researches/20260909-herdr-runtime-cutover.md
  - docs/architecture/modules/runtime-harness/agent-runtime-effects.md
  - README.md
  - .archcontext/model/nodes/capability.runtime-harness.agent-runtime-effects.yaml
  - docs/architecture/
  - .ai/harness/policy.json
  - .ai/context/context-map.json
  - plans/archive/plan-20260909-0125-herdr-runtime-cutover.md
  - tasks/todos.md
  - tasks/archive/contract-20260909-0300-herdr-runtime-cutover.md
  - tasks/archive/review-20260909-0300-herdr-runtime-cutover.md
  - tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md
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
    - tasks/archive/notes-20260909-0300-herdr-runtime-cutover.md
```

## Verification Plan

```json
{
  "protocol": 1,
  "checks": [
    {
      "id": "runtime-contracts",
      "kind": "command",
      "command": "bun test tests/unit/r1-agent-runtime-adapters.test.ts tests/unit/r1-provider-neutral-agent-runtime.test.ts tests/unit/issue-281-task-offer-wake.test.ts tests/unit/issue-279-automation-controller-run.test.ts tests/unit/fleet-board.test.ts tests/unit/operator-fleet-snapshot.test.ts tests/unit/operator-web-types.test.ts tests/cli/engineer.test.ts tests/cli/mcp-engineer-tools.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Covers exact adapter/provider identifiers, receipt and at-most-once effects, public CLI/MCP and operator projections.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-9a4a2c2d8fab4db9af81.json",
        "execution_id": "vx-9a4a2c2d8fab4db9af81"
      },
      "delta_checks": [
        "frozen-runtime-inputs"
      ]
    },
    {
      "id": "review-lifecycle",
      "kind": "command",
      "command": "bun test tests/claude-review.test.ts tests/herdr-transport.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Verifies real Herdr lifecycle including the reviewed spawn-to-metadata interruption gap, caught publication failure cleanup, existing receipt/cancel/sentinel behavior and transport.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-fad0e657892a4bf2b742.json",
        "execution_id": "vx-fad0e657892a4bf2b742"
      },
      "delta_checks": [
        "repaired-review-inputs-unchanged"
      ]
    },
    {
      "id": "readiness-guidance-adoption",
      "kind": "command",
      "command": "bun test tests/check-agent-tooling.test.ts tests/unit/herdr-peer-harness.test.ts tests/cli/adoption-plan.test.ts tests/cli/global-runtime-init.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "baseline_with_delta",
      "necessity": "Covers required herdr, no tmux fallback guidance and TS adoption fixture apply.",
      "inputs": {
        "env": []
      },
      "baseline": {
        "run_file": ".ai/harness/runs/verification-vx-d6529d135f554685b93d.json",
        "execution_id": "vx-d6529d135f554685b93d"
      },
      "delta_checks": [
        "integrated-inputs-unchanged"
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
      "necessity": "Validates renamed shared contracts and both runtime consumers.",
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
      "necessity": "Required repository integrity or changed generated-source mirror check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture-sync",
      "kind": "command",
      "command": "bash scripts/check-architecture-sync.sh",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or changed generated-source mirror check.",
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
      "necessity": "Required repository integrity or changed generated-source mirror check.",
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
      "necessity": "Required repository integrity or changed generated-source mirror check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "project-state",
      "kind": "command",
      "command": "bun scripts/inspect-project-state.ts --repo . --format text",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or changed generated-source mirror check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "adoption-dry-run",
      "kind": "command",
      "command": "bun src/cli/index.ts init --repo . --dry-run",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or changed generated-source mirror check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "helper-mirrors",
      "kind": "command",
      "command": "bun scripts/sync-helper-sources.ts --check",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or changed generated-source mirror check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "reference-mirrors",
      "kind": "command",
      "command": "bun scripts/sync-reference-configs.ts --check",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Required repository integrity or changed generated-source mirror check.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "frozen-runtime-inputs",
      "kind": "command",
      "command": "git diff --exit-code bbe2cabc4be5301be450ba62b3bf6fd394e2bf45 -- src/effects/terminal src/effects/engineers src/core/engineers src/cli/commands/engineer.ts src/cli/mcp/engineer-tools.ts src/operator-web tests/herdr-transport.test.ts tests/unit/r1-agent-runtime-adapters.test.ts tests/unit/r1-provider-neutral-agent-runtime.test.ts tests/unit/issue-281-task-offer-wake.test.ts tests/unit/issue-279-automation-controller-run.test.ts tests/unit/fleet-board.test.ts tests/unit/operator-fleet-snapshot.test.ts tests/unit/operator-web-types.test.ts tests/cli/engineer.test.ts tests/cli/mcp-engineer-tools.test.ts ':(exclude)**/AGENTS.md' ':(exclude)**/CLAUDE.md'",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the retained notification/runtime-contract test inputs unchanged; reviewer lifecycle now has current verification after the startup ownership repair.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "architecture-reconciliation",
      "kind": "command",
      "command": "bun test tests/unit/architecture-projection-acceptance.test.ts tests/unit/architecture-projection-orchestration.test.ts tests/architecture-projection-provider.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Verifies strict noop retirement, candidate identity and actual provider contract after integrating architecture recovery and archctx 0.5.8.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "integrated-inputs-unchanged",
      "kind": "command",
      "command": "git diff --exit-code da80bd25324cf6ec62f7c8507cdaa445b40390c7 -- src tests scripts assets package.json bun.lock .ai/harness/policy.json .ai/context/context-map.json .archcontext/model ':(exclude)src/effects/review/claude-review-session.ts' ':(exclude)tests/claude-review.test.ts' ':(exclude)src/cli/chatgpt-browser/oracle-provider.ts' ':(exclude)tests/cli/chatgpt-browser.test.ts' ':(exclude)src/core/automation/campaign-revision-evidence.ts' ':(exclude)src/effects/automation/campaign-fresh-audit.ts' ':(exclude)src/effects/automation/campaign-revision-observation.ts' ':(exclude)tests/effects/campaign-fresh-audit.test.ts' ':(exclude)tests/effects/campaign-revision-observation.test.ts' ':(exclude)tests/unit/campaign-revision-evidence.test.ts'",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Retains the passed installation/adoption baseline. The only permitted implementation delta is the independently current-verified review-session startup ownership repair and its test file; dependency, installer and adoption inputs remain identical. Main b4712412 contributes only a non-overlapping Oracle version pin and its tests; those inputs are outside the Herdr/adoption consumers and have upstream verification. Main 0b0c0a60 adds the non-overlapping campaign revision browser-linking change; its six source/test files are verified by current campaign-integration checks.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "repaired-review-inputs-unchanged",
      "kind": "command",
      "command": "git diff --exit-code 6a3563eb -- src/effects/review src/effects/terminal tests/claude-review.test.ts tests/herdr-transport.test.ts",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Proves the repaired review lifecycle and real transport inputs remain byte-identical to the passing final 21-test execution while integrating the non-overlapping upstream Oracle pin and lifecycle evidence.",
      "inputs": {
        "env": []
      }
    },
    {
      "id": "campaign-integration",
      "kind": "command",
      "command": "bun test tests/effects/campaign-fresh-audit.test.ts tests/effects/campaign-revision-observation.test.ts tests/unit/campaign-revision-evidence.test.ts --timeout 60000",
      "cwd": ".",
      "phase": "verification",
      "cost": "normal",
      "evidence_policy": "current_exact",
      "necessity": "Validates the new non-overlapping campaign revision/browser-linking inputs from main 0b0c0a60 before publishing the combined tree. Herdr ownership repair remains byte-identical to owner-accepted 6a3563eb.",
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

- Functional behavior: runtime-contracts, review-lifecycle, readiness-guidance-adoption and typecheck passed on frozen tree bbe2cabc4be5301be450ba62b3bf6fd394e2bf45. The baseline references above preserve those immutable executions; frozen-runtime-inputs proves their implementation inputs unchanged. Architecture/task workflow checks remain current.
- Acceptance: owner ancienttwo explicitly accepted the verified post-review repair and local merge; the typed User/user-waiver receipt is valid. Prepared run run-20260909T025050-55692 passed all 22 criteria. The current architecture change has a typed approved apply receipt and both stale candidates have strict-noop retirement receipts. No gate was weakened.
- Edge cases: timeout is ambiguous, stale occupant rejects, owned cleanup preserves sentinel.
- Regression risks: public adapter cutover requires drain/rebind; no compatibility parser.

## Rollback Point

- Commit / checkpoint: base 1f1dad97.
- Revert strategy: drain task-owned herdr review sessions, revert worktree commits; never translate live identities.

## Semantic review follow-up

The one configured Codex plugin review completed on subject sha256:2d2925cec868e903599a81fbaa19eaefbf9bbe6182f1bc974c25b63d6b3b48ec and found one P2 server startup ownership gap. Parent reproduced and repaired it; final lifecycle verification is current. The original provider opinion is not relabeled as a review of the repaired subject. Under the one-semantic-review policy, owner acceptance supplies the final semantic authority after verification and was explicitly granted in the current conversation.
