> **Archived**: 2026-09-08 23:19
> **Related Plan**: plans/archive/plan-20260908-2246-user-config-uninstall.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-2319
> **Archive Projection V1**: `plans/plan-20260908-2246-user-config-uninstall.md` => `plans/archive/plan-20260908-2246-user-config-uninstall.md`
> **Archive Projection V1**: `tasks/notes/20260908-2246-user-config-uninstall.notes.md` => `tasks/archive/notes-20260908-2319-user-config-uninstall.md`
> **Archive Projection V1**: `tasks/contracts/20260908-2246-user-config-uninstall.contract.md` => `tasks/archive/contract-20260908-2319-user-config-uninstall.md`
> **Archive Projection V1**: `tasks/reviews/20260908-2246-user-config-uninstall.review.md` => `tasks/archive/review-20260908-2319-user-config-uninstall.md`

# Plan: User configuration uninstall symmetry

> **Status**: Archived
> **Created**: 20260908-2246
> **Slug**: user-config-uninstall
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Disposable HOME install/uninstall restoration and preservation tests plus required integrity checks
> **Rollback Surface**: Installer and CLI changes plus private user configuration restoration receipts; no live user configuration writes during development
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-2319-user-config-uninstall.md`
> **Task Review**: `tasks/archive/review-20260908-2319-user-config-uninstall.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-2319-user-config-uninstall.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from codex-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260908-2246-user-config-uninstall.md`
- Sprint contract: `tasks/archive/contract-20260908-2319-user-config-uninstall.md`
- Sprint review: `tasks/archive/review-20260908-2319-user-config-uninstall.md`
- Implementation notes: `tasks/archive/notes-20260908-2319-user-config-uninstall.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-2319-user-config-uninstall.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-2246-user-config-uninstall.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-2246-user-config-uninstall.md`.

## Approach
### Strategy
Use the captured planning output below as the execution source of truth.

### Trade-offs
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Captured plan | Preserves the approved Codex Plan or Waza think decision | Requires the captured text to be concrete enough to execute | Use |

## Detailed Design
### File Changes
| File | Action | Description |
|------|--------|-------------|
| See captured planning output | Follow | Implement only the approved scope named below |

### Code Snippets
See captured planning output.

### Data Flow
See captured planning output.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Captured plan lacks enough detail | Medium | Execution may need clarification | Stop before implementation if the captured output contradicts repo rules or lacks concrete file targets |

## Task Contracts
- Contract file: `tasks/archive/contract-20260908-2319-user-config-uninstall.md`
- Review file: `tasks/archive/review-20260908-2319-user-config-uninstall.md`
- Implementation notes file: `tasks/archive/notes-20260908-2319-user-config-uninstall.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-2319-user-config-uninstall.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-2246-user-config-uninstall.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Installer and CLI changes plus private user configuration restoration receipts; no live user configuration writes during development
- **Verification boundary**: Disposable HOME install/uninstall restoration and preservation tests plus required integrity checks
- **Review/acceptance boundary**: `tasks/archive/review-20260908-2319-user-config-uninstall.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-2246-user-config-uninstall.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-2319-user-config-uninstall.md`, `tasks/archive/review-20260908-2319-user-config-uninstall.md`, and `tasks/archive/notes-20260908-2319-user-config-uninstall.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-2319-user-config-uninstall.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Installer and CLI changes plus private user configuration restoration receipts; no live user configuration writes during development

## Captured Planning Output

### Approved scope
Implement user-level uninstall symmetry. Global uninstall defaults to both hosts; target selection remains explicit. Add --dry-run and structured --json output; explicit --recover-interrupted restores selector-only pending preimages after interrupted setup. Local adapter removal remains scoped and does not become repository unadoption. Do not uninstall this machine or publish a release as part of implementation.

### P1 / P2 / P3
P1: src/cli/index.ts owns runtime transaction locks and CLI routing. commands/install.ts calls host targets. installer/install-profile.ts already owns transaction snapshots and the ownership_manifest for installed files, links and CodeGraph projections. Reuse that ownership for file removal; do not invent another directory inventory. brain-root.ts owns ~/.repo-harness/config.json. Global managed instructions are marker-delimited.
P2: install -> transaction snapshot -> host adapters/runtime setup -> profile projection -> snapshot disposal. Codex writes default_mode_request_user_input but uninstall only strips hooks. Existing transaction ownership can prove newly created files and MCP projections, but does not preserve overwritten configuration values. The pressure point is retaining reversible configuration changes before backup disposal, and consuming them with uninstall.
P3: add a private configuration undo receipt for configuration fragments (original + installed values); this records restoration provenance, while the existing profile remains the installed inventory. Do not delete a configuration fragment through both paths. Persist before mutation where a direct writer is available; transaction-backed writers capture before/after before commit. Retain the earliest original across refreshes; changed user values conflict and remain. Missing ownership is reported, never inferred from matching values. Existing tagged hooks/global rules and product-owned brain config are explicit ownership. Configuration malformed or symlink escapes fail closed. No recursive deletion of HOME, host roots, archives or vault. At 10x installation surfaces, incomplete mutation inventory fails first; named coverage tests enforce the observed boundary.

### Implementation
- installer/configuration-ownership.ts: bounded user configuration fragments and private restoration receipts, preserving user changes and original values; validation and path confinement.
- installer/uninstall.ts and commands/install.ts/index.ts: plan/apply result (remove/restore/preserve/unresolved), dry-run no writes, target filtering; existing owned file manifest consumption; managed hooks/context, brain configuration, profile invalidation; retained archives/tools listed explicitly. Unresolved items yield nonzero exit and retain retry evidence.
- installer/install-profile.ts, targets/codex.ts, tools/codegraph.ts and runtime transaction integration as required: capture restoration provenance at installation boundaries, retain original across updates, include receipt in rollback surface, use existing managed-file/link/tree ownership and drift checks.
- Focused tests cover fresh install/uninstall, pre-existing config restoration, user edits, mixed hooks, missing receipts, malformed input, targets, repeat uninstall, dry-run bytes/no filesystem writes, unrelated files and static archives preservation, and profile-owned skills/rules/MCP removal.
- Update README and installation/reference architecture docs to the final scope. Sync task artifacts and record bounded project-unadoption as deferred work, not part of this slice.

### Verification
Run named focused CLI installer/uninstall/profile/runtime tests plus the six repository-integrity commands in AGENTS.md. No full suite: the affected installation and transaction tests cover the changed contracts; no release requested. Freeze code before final acceptance and use the contract Verification Plan through verify-sprint --prepare-acceptance. Waza check review once for this boundary. All mutation tests use disposable HOME fixtures.

### Acceptance and exclusions
Users can preview and remove owned user-level configuration while preserving user changes, unrelated third-party configuration and static history. Output must distinguish complete/partial and unresolved ownership; no silent success on leftovers. Existing shared third-party binaries/plugins without sufficient provenance are retained and reported. Package-manager global removal and repository-level unadoption are separate explicit operations. No new dependency is needed; the restoration/cleanup modules and extracted existing runtime lock protect the shared installation/uninstallation invariant and isolate planning from execution.

## Task Breakdown
- [x] Implement configuration restoration provenance and integrate installation writers/transactions.
- [x] Implement target-scoped uninstall plan/apply, dry-run and owned surface cleanup.
- [x] Add focused preservation, restoration, conflict and idempotence tests; update product docs.
- [ ] Run required scoped verification and one check review, record acceptance and finish worktree.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Implement configuration restoration provenance and integrate installation writers/transactions.
- [x] Implement target-scoped uninstall plan/apply, dry-run and owned surface cleanup.
- [x] Add focused preservation, restoration, conflict and idempotence tests; update product docs.
- [ ] Run required scoped verification and one check review, record acceptance and finish worktree.
