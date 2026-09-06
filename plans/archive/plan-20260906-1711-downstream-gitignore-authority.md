# Plan: Single downstream gitignore authority

> **Status**: Superseded
> **Created**: 20260906-1711
> **Slug**: downstream-gitignore-authority
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: TS init and shell bootstrap emit the same Git rules and preserve user content
> **Rollback Surface**: Revert the asset and both consumers together
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md`
> **Task Review**: `tasks/archive/review-20260906-1711-downstream-gitignore-authority.md`
> **Implementation Notes**: `tasks/archive/notes-20260906-1711-downstream-gitignore-authority.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from waza-think planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/archive/plan-20260906-1711-downstream-gitignore-authority.md`
- Sprint contract: `tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md`
- Sprint review: `tasks/archive/review-20260906-1711-downstream-gitignore-authority.md`
- Implementation notes: `tasks/archive/notes-20260906-1711-downstream-gitignore-authority.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260906-1711-downstream-gitignore-authority.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260906-1711-downstream-gitignore-authority.md`.

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
- Contract file: `tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md`
- Review file: `tasks/archive/review-20260906-1711-downstream-gitignore-authority.md`
- Implementation notes file: `tasks/archive/notes-20260906-1711-downstream-gitignore-authority.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260906-1711-downstream-gitignore-authority.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert the asset and both consumers together
- **Verification boundary**: TS init and shell bootstrap emit the same Git rules and preserve user content
- **Review/acceptance boundary**: `tasks/archive/review-20260906-1711-downstream-gitignore-authority.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260906-1711-downstream-gitignore-authority.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260906-1711-downstream-gitignore-authority.md`, `tasks/archive/review-20260906-1711-downstream-gitignore-authority.md`, and `tasks/archive/notes-20260906-1711-downstream-gitignore-authority.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260906-1711-downstream-gitignore-authority.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert the asset and both consumers together

## Captured Planning Output

## Goal
Remove the duplicated downstream gitignore authoring lists while preserving existing user rules and factor-factory additions. This is the first independent slice of the user's three authorized pre-release todos; telemetry retention and verification failure classification remain separate slices.

## P1 Map
`src/core/adoption/gitignore-plan.ts` owns the init operation's ignore body; `scripts/lib/project-init-lib.sh` duplicates it as bootstrap prelude/runtime heredocs consumed by create-project-dirs and init-project. Both ship in the package. The shell list already omits `.ai/harness/backups/` and `.claude/.active-plan`. Existing managed-block replacement and TS transaction semantics own user-content preservation.

## P2 Trace
Init resolves gitignoreManagedBlockOperation -> appendManagedBlock -> fs transaction. Shell bootstrap sources project-init-lib -> pi_ensure_gitignore_block -> managed-block replacement. Their independent literals cause different Git tracking outcomes for the same harness state path.

## P3 Decision
Move the complete current TS body verbatim to `assets/templates/runtime.gitignore`; TS and shell read the packaged bytes directly. Delete both old authoring lists. Shell places the complete body within its existing managed block, with an empty default prelude; existing user/prelude content remains untouched. Preserve current markers and factor-factory extension semantics. Missing asset fails explicitly, with no embedded fallback. This uses standard filesystem reads and adds no dependency, command, config, or semantic parser. The single new asset serves the two observed consumers. At 10x ignore entries startup reads grow linearly, remaining small; no per-hook read is introduced.

## Scope
`assets/templates/runtime.gitignore`, `src/core/adoption/gitignore-plan.ts`, `scripts/lib/project-init-lib.sh`, `tests/unit/gitignore-plan.test.ts`, `tests/create-project-dirs.runtime.test.ts`, `tests/adoption-plan.test.ts` if its fixture owns apply parity, and task/research evidence for this slice. Other agents own PRs, BRC, and verification lifecycle; do not edit their worktrees or contracts.

## Task Breakdown
- [x] Prove shell/init ignore divergence with a real shell emission regression, preserving custom rules and extension entries.
- [x] Extract the canonical asset and replace both literal authoring paths, including fail-closed missing-asset coverage.
- [x] Verify focused gitignore/bootstrap/adoption behavior, real init dry-run and fixture apply, typecheck and package asset inclusion.
- [x] Run six repository-integrity checks, record the result, remove only the resolved todo and retain independent changes as a reviewable commit.

## Verification Commands
`bun test tests/unit/gitignore-plan.test.ts tests/create-project-dirs.runtime.test.ts tests/scaffold-parity.test.ts --timeout 60000`; named adoption plan/apply fixtures; `bun run check:type`; the six root integrity commands; package file-list readback. No full suite: named consumers cover the complete behavior and no runtime semantic contract changes.

## Rollback
Revert this slice's asset and consumer changes together. No user repositories or live runtime evidence are migrated by this implementation task.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Prove shell/init ignore divergence with a real shell emission regression, preserving custom rules and extension entries.
- [x] Extract the canonical asset and replace both literal authoring paths, including fail-closed missing-asset coverage.
- [x] Verify focused gitignore/bootstrap/adoption behavior, real init dry-run and fixture apply, typecheck and package asset inclusion.
- [x] Run six repository-integrity checks, record the result, remove only the resolved todo and retain independent changes as a reviewable commit.

Implementation is included in the user-approved release integration contract `tasks/contracts/20260906-1732-checks-artifact-repair.contract.md`; this historical slice does not claim separate external acceptance.
