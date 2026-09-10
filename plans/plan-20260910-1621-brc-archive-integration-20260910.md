# Plan: Consolidate inactive BRC branches and clean worktrees

> **Status**: Executing
> **Created**: 20260910-1621
> **Slug**: brc-archive-integration-20260910
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: merge_boundary
> **Verification Boundary**: Frozen history and documentation integration; eight integrity checks, no product-tree drift, one exact-head CI merge gate
> **Rollback Surface**: One integration merge; original branch commits remain reachable in its ancestry
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md`
> **Task Review**: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md`
> **Implementation Notes**: `tasks/notes/20260910-1621-brc-archive-integration-20260910.notes.md`

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

- Active plan: `plans/plan-20260910-1621-brc-archive-integration-20260910.md`
- Sprint contract: `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md`
- Sprint review: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md`
- Implementation notes: `tasks/notes/20260910-1621-brc-archive-integration-20260910.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260910-1621-brc-archive-integration-20260910.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260910-1621-brc-archive-integration-20260910.md`.

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
- Contract file: `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md`
- Review file: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md`
- Implementation notes file: `tasks/notes/20260910-1621-brc-archive-integration-20260910.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260910-1621-brc-archive-integration-20260910.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: One integration merge; original branch commits remain reachable in its ancestry
- **Verification boundary**: Frozen history and documentation integration; eight integrity checks, no product-tree drift, one exact-head CI merge gate
- **Review/acceptance boundary**: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: merge_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260910-1621-brc-archive-integration-20260910.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260910-1621-brc-archive-integration-20260910.contract.md`, `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md`, and `tasks/notes/20260910-1621-brc-archive-integration-20260910.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260910-1621-brc-archive-integration-20260910.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: One integration merge; original branch commits remain reachable in its ancestry

## Captured Planning Output

## Goal
Consolidate every inactive repo-harness branch and linked worktree into reviewed Git history on main, then delete their local/remote branch refs and worktree directories. Preserve the two active work locations: the primary checkout running operator-composer work and codex/campaign-reconciliation-recovery.

## P1 — Map
The frozen starting main is 3c570360543fe5b93378bec81c2a7d4f68f10663. Remaining inactive heads include exact-head squash-merged campaign repairs, historical BRC evidence branches, superseded container experiments, and projection-preservation snapshots. Pending files exist in brc14-readiness, release-0-19-0, and the detached brc360 readback worktree. The primary checkout and reconciliation worktree contain independently owned live changes and are excluded from staging, cleanup, and reset operations.

## P2 — Trace
For each inactive ref, bind the current head and dirty file inventory to its exact merged PR or repository history. Commit still-unrecorded inactive files before merging. Merge ancestry records preserve original source and evidence bytes; current source paths retain later accepted implementations where predecessor experiments were superseded. Unique durable research and closed workflow records remain discoverable through current docs and archive paths. No old grant, runtime execution, or workflow is resumed by cleanup.

## P3 — Decision and constraints
Perform all integration in this dedicated worktree. Retain current main runtime semantics; resolve historical projection and stale workflow collisions using the current owning implementation and archive-only history, with an explicit path/head decision record. Do not introduce product fixes, compatibility fallbacks, model/provider calls, or new campaign runs. At 10x branches the first cost is conflict attribution, so freeze the input list and record one evidence-backed disposition for each head. A merge revert restores the integrated tree; original commits remain in history for recovery after ref removal.

## Allowed Paths
- docs/researches/
- docs/architecture/.projection-manifest.json
- plans/
- tasks/
- Historical merge parents may contain product paths, but the final publication must not change src/, scripts/, assets/, deploy/, tests/, package.json, or bun.lock relative to its pinned main base unless a separately established necessary integration delta is recorded before execution.

## Task Breakdown
- [x] Freeze all inactive heads and dirty inventories; identify both protected active work locations.
- [x] Commit unrecorded inactive changes, integrate all inactive histories, and preserve unique research/archived workflow evidence without reverting current product behavior.
- [ ] Verify the final integration tree, document each head and conflict disposition, and obtain the single merge acceptance.


## Verification
Use the eight repository integrity checks from AGENTS.md, git diff --check, JSON validation for added evidence, and a redacted secret scan. Prove no product-path delta against the pinned main base. No local full suite is necessary for the intended history/documentation integration; GitHub required CI remains the merge gate. Scope additional local checks only to an observed final executable delta, if any. Freeze once before final acceptance and reuse unchanged evidence.

## Exit Criteria
Every frozen inactive head is reachable from the final main integration; durable research has a current reading entrypoint; obsolete active workflow files are archived; exact-head required CI passes; inactive local and remote refs/worktree directories are removed; both active work locations and their uncommitted work are preserved.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Freeze all inactive heads and dirty inventories; identify both protected active work locations.
- [x] Commit unrecorded inactive changes, integrate all inactive histories, and preserve unique research/archived workflow evidence without reverting current product behavior.
- [ ] Verify the final integration tree, document each head and conflict disposition, and obtain the single merge acceptance.


## Authorized operator follow-through

The work-package acceptance and archive cover the frozen integration candidate. They do not claim publication or deletion has already happened. After acceptance, push the candidate, wait for exact-head required CI, merge with ancestry preserved, remove the unchanged frozen inactive refs/worktrees, and verify the two active locations remain intact. Report actual completion from remote Git and filesystem readback.
