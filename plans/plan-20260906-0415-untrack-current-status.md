# Plan: Stop tracking tasks/current.md

> **Status**: Executing
> **Created**: 20260906-0415
> **Slug**: untrack-current-status
> **Planning Source**: repo-harness-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Focused session-context, adoption template, helper, contract and doc tests plus projections and integrity checks
> **Rollback Surface**: Revert codex/untrack-current-status and re-add tasks/current.md
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260906-0415-untrack-current-status.contract.md`
> **Task Review**: `tasks/reviews/20260906-0415-untrack-current-status.review.md`
> **Implementation Notes**: `tasks/notes/20260906-0415-untrack-current-status.notes.md`

## Agentic Routing
- Selected route: planning
- Routing reason: Captured from repo-harness-plan planning output.
- Source ref: (none)
- Due diligence:
  - P1 map: See captured planning output below.
  - P2 trace: See captured planning output below.
  - P3 decision rationale: See captured planning output below.

## Workflow Inventory
Complete this inventory before implementation. If any line is unknown, keep the plan in Draft and fill it before projection.

- Active plan: `plans/plan-20260906-0415-untrack-current-status.md`
- Sprint contract: `tasks/contracts/20260906-0415-untrack-current-status.contract.md`
- Sprint review: `tasks/reviews/20260906-0415-untrack-current-status.review.md`
- Implementation notes: `tasks/notes/20260906-0415-untrack-current-status.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260906-0415-untrack-current-status.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260906-0415-untrack-current-status.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260906-0415-untrack-current-status.md`.

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
- Contract file: `tasks/contracts/20260906-0415-untrack-current-status.contract.md`
- Review file: `tasks/reviews/20260906-0415-untrack-current-status.review.md`
- Implementation notes file: `tasks/notes/20260906-0415-untrack-current-status.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260906-0415-untrack-current-status.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260906-0415-untrack-current-status.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert codex/untrack-current-status and re-add tasks/current.md
- **Verification boundary**: Focused session-context, adoption template, helper, contract and doc tests plus projections and integrity checks
- **Review/acceptance boundary**: `tasks/reviews/20260906-0415-untrack-current-status.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260906-0415-untrack-current-status.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260906-0415-untrack-current-status.contract.md`, `tasks/reviews/20260906-0415-untrack-current-status.review.md`, and `tasks/notes/20260906-0415-untrack-current-status.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260906-0415-untrack-current-status.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert codex/untrack-current-status and re-add tasks/current.md

## Captured Planning Output

## Goal
`tasks/current.md` stops being a tracked file. It becomes an ignored local read model at the same level as `.ai/harness/handoff/current.md`: still generated by `refresh-current-status.sh` and `ensure-task-workflow.sh`, still read by session context, but never committed, never diffed, never compared across branches. Every surface that names it "tracked" or reads it from another branch is cut over in the same change, and downstream adoption ignores it from the first init.

## P1 Map
Inputs of the snapshot are almost all untracked local state: `.ai/harness/active-plan`, `.ai/harness/active-worktree`, `.ai/harness/sprint/active-sprint`, `.ai/harness/handoff/current.md`, `.ai/harness/checks/latest.json`, git status, linked worktrees. Only `tasks/workstreams/` is tracked. Surfaces that depend on it being tracked: `src/cli/hook/session-context.ts:904-940` (`currentStatusSnapshotContext` reads `git show <target>:tasks/current.md` and emits "Target branch snapshot" lines); `src/effects/review/diff-fingerprint.ts:407` (exempts the path from fingerprints); `scripts/check-task-sync.sh:228` (exempts it from substantive-change classification); `scripts/refresh-current-status.sh` "Mainline Snapshot Reading" section rendering `git show ${target}:tasks/current.md`; `assets/workflow-contract.v1.json` and `.ai/harness/workflow-contract.json` (`helpers.refresh-current-status` description, an artifact list entry near line 265, `currentStatus` near 312); `src/core/adoption/gitignore-plan.ts` (downstream ignore template, already ignores `tasks/.current.md.tmp.*` and `.ai/harness/handoff/current.md`); self-host `.gitignore`; `tests/scaffold-parity.test.ts:98`, `tests/evidence-projection-drift.test.ts`, `tests/helper-scripts.test.ts:2871,2954` and other test files (39 mention the path); docs: `CLAUDE.md:7,136`, `AGENTS.md:7,136`, `docs/reference-configs/harness-overview.md:35,58,82`, `docs/reference-configs/handoff-protocol.md:38`, plus SKILL/skill-command docs that say "tracked". `tests/readme-dx.test.ts` asserts literal doc strings; grep before rewording.

## P2 Trace
A session refreshes the snapshot with `--write`, commits it, and the PR merges. Another worktree on another machine regenerates it from its own local markers and sees a different file; `git show main:tasks/current.md` then shows a session-specific state (today: `Source Branch: codex/ci-gate-closeout`, commit not on main's path) presented as "mainline". No check can make this deterministic because the inputs are not in git. The pressure point is a tracked artifact with untracked inputs.

## P3 Decision
Cut over in one change with no compatibility path:
1. `git rm --cached tasks/current.md`; add `tasks/current.md` to self-host `.gitignore` next to `tasks/.current.md.tmp.*`; add the same line to `src/core/adoption/gitignore-plan.ts` so downstream repos ignore it from init.
2. `session-context.ts`: drop the target-branch branch entirely. Keep the local snapshot line; change the rule line to say it is an ignored local read model. Return null when there is no local status.
3. `refresh-current-status.sh`: remove the "Mainline Snapshot Reading" section and the "tracked mainline snapshot" sentence; describe it as a local read model. Keep `--write`, `--clear`, preview.
4. Remove the now-dead exemptions in `diff-fingerprint.ts:407` and `check-task-sync.sh:228` for `tasks/current.md` only.
5. Workflow contract: treat `tasks/current.md` exactly as the contract treats `.ai/harness/handoff/current.md` (same list membership, same wording); keep `currentStatus` path key since the generator still writes there. Keep `assets/workflow-contract.v1.json` and `.ai/harness/workflow-contract.json` byte-identical.
6. Docs and root contracts: every "tracked" description of `tasks/current.md` becomes "ignored local read model"; `CLAUDE.md` and `AGENTS.md` stay identical.
7. Tests: update assertions to the new contract; delete tests whose only subject was cross-branch reading; keep tests that assert generation and linked-worktree redaction.
8a. `scripts/check-task-workflow.sh`: the snapshot check becomes tolerate-absent, mirroring how `check_handoff_resume_pair` early-returns when the handoff file is missing. When the file exists it is still validated as today. CI does not regenerate it; an absent snapshot is a valid state for an ignored local read model. Regenerate the helper projection.
8b. Authority for reference docs is `assets/reference-configs/`; `docs/reference-configs/` is its projection via `sync-reference-configs.ts`. Edit the assets side and regenerate.
8. Existing downstream repos that already track the file: no automated untrack operation. Record the one-line operator step (`git rm --cached tasks/current.md`) in `docs/reference-configs/harness-overview.md` next to the refresh guidance. Tradeoff: manual step for existing adopters versus adding an adoption operation that deletes tracked user files; the manual step is safer and the file is regenerated on the next refresh anyway.
Cost at 10x: none; this removes code paths.

## Scope
`scripts/check-task-workflow.sh` and its helper projection; `assets/reference-configs/` and its `docs/reference-configs/` projection; `.gitignore`; `tasks/current.md` (untracked, file stays on disk); `src/cli/hook/session-context.ts`; `src/effects/review/diff-fingerprint.ts`; `src/core/adoption/gitignore-plan.ts`; `scripts/refresh-current-status.sh`; `scripts/check-task-sync.sh`; their `assets/templates/helpers/` projections; `assets/workflow-contract.v1.json`; `.ai/harness/workflow-contract.json`; `CLAUDE.md`; `AGENTS.md`; `docs/reference-configs/harness-overview.md`; `docs/reference-configs/handoff-protocol.md`; other docs or skill-command files under `assets/skill-commands/` and `SKILL.md` that call it tracked; `tests/**` as needed; this plan. No change to what the snapshot contains beyond removing the mainline section, no change to handoff or checks.

## Task Breakdown
- [x] RED: add or adjust tests asserting session context emits no target-branch lines, gitignore plan includes `tasks/current.md`, refresh output has no mainline section, and workflow-contract lists the path alongside handoff.
- [x] Untrack the file, update both gitignores, cut over session-context, refresh script, the tolerate-absent snapshot check in check-task-workflow, and the dead exemptions; regenerate helper projections.
- [x] Sync both workflow-contract copies and reword docs and root contracts; grep `tests/readme-dx.test.ts` and other literal-string tests first.
- [x] Update remaining tests; run verification commands; record results.

## Promotion Gate

- **Merge/PR unit**: one PR; the cutover is only coherent as a unit.
- **Rollback surface**: revert the branch and `git add tasks/current.md` again.
- **Verification boundary**: focused tests for session-context, gitignore-plan, helper-scripts refresh cases, scaffold-parity, evidence-projection-drift, bootstrap-files, readme-dx; helper and reference-config projections; integrity checks.
- **Review/acceptance boundary**: gatekeeper review.
- **High-risk surface**: downstream adopters with the file tracked keep a stale committed copy until they run the documented step; `init` must not try to delete it. The session-context change alters injected prompt text; tests pin the new shape.
- **Why not checklist row**: cross-module cutover touching product contract, adoption template, and prompt injection.

## Evidence Contract

- **State/progress path**: this plan's Task Breakdown.
- **Verification evidence**: Verification Results below.
- **Evaluator rubric**: `git ls-files tasks/current.md` is empty on the branch; `git check-ignore tasks/current.md` succeeds; `rg -n 'git show.*tasks/current.md' src scripts assets docs` returns nothing; no doc calls the file tracked; both workflow-contract copies identical; focused tests pass.
- **Stop condition**: rubric satisfied and verification commands pass; report blockers without widening scope.
- **Rollback surface**: revert only this branch.

## Verification Commands

```bash
git ls-files tasks/current.md
git check-ignore -q tasks/current.md && echo ignored
rg -n 'git show.*tasks/current.md|tracked.*tasks/current.md|tasks/current.md.*tracked' src scripts assets docs CLAUDE.md AGENTS.md SKILL.md README.md
bun test tests/session-context.test.ts tests/gitignore-plan.test.ts tests/scaffold-parity.test.ts tests/evidence-projection-drift.test.ts tests/bootstrap-files.test.ts tests/readme-dx.test.ts tests/workflow-contract.test.ts --timeout 60000
bun test tests/helper-scripts.test.ts --test-name-pattern 'refresh-current-status|check-task-sync' --timeout 60000
bun run check:type
bun run check:helpers
bun run check:reference-configs
bash scripts/check-deploy-sql-order.sh
bash scripts/check-architecture-sync.sh
bash scripts/check-task-sync.sh
bash scripts/check-task-workflow.sh --strict
bun scripts/inspect-project-state.ts --repo . --format text
bun src/cli/index.ts init --repo . --dry-run
```

Test file names above are best guesses from the path grep; the implementer substitutes the real files that cover each surface and lists them in Verification Results. If observed cross-module impact exceeds the named files, state the uncovered risk before running anything wider.

## Verification Results

Test files substituted for the plan's guesses: there is no `tests/gitignore-plan.test.ts`; the
adoption ignore template is asserted by `tests/workflow-contract.test.ts` and
`tests/create-project-dirs.runtime.test.ts`. The check-task-workflow surface (decision 8a) is
`tests/helper-scripts.test.ts`.

| Command | Outcome |
|---------|---------|
| `git ls-files tasks/current.md` | empty — untracked |
| `git check-ignore -q tasks/current.md` | ignored via `.gitignore:40` |
| rubric grep for cross-branch/tracked wording | no cross-branch read remains; 8 residual "tracked" lines in generated capability-context blocks (see notes, out of Allowed Paths) |
| `bun test` session-context, scaffold-parity, evidence-projection-drift, bootstrap-files, readme-dx, workflow-contract, create-project-dirs.runtime | 111 pass, 0 fail |
| `bun test tests/helper-scripts.test.ts -t 'refresh-current-status\|check-task-workflow\|check-task-sync'` | 19 pass, 0 fail |
| `bun run check:type` | exit 0 |
| `bun run check:helpers` | projection OK, 56 helpers |
| `bun run check:reference-configs` | projection OK, 23 docs |
| `bash scripts/check-deploy-sql-order.sh` | `[deploy-sql] OK` |
| `bash scripts/check-architecture-sync.sh` | exit 0, blocking=0 |
| `bash scripts/check-task-sync.sh` (merge-base vs origin/main) | exit 0 after binding the substantive digest |
| `bash scripts/check-task-workflow.sh --strict` | `[workflow] OK` |
| `bun scripts/inspect-project-state.ts --repo . --format text` | exit 0 |
| `bun src/cli/index.ts init --repo . --dry-run` | exit 0, 0 operations |

RED evidence captured before implementation: `/tmp/untrack-current-red.log` (6 failing assertions
across session-context, workflow-contract, create-project-dirs.runtime, helper-scripts).

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] RED: add or adjust tests asserting session context emits no target-branch lines, gitignore plan includes `tasks/current.md`, refresh output has no mainline section, and workflow-contract lists the path alongside handoff.
- [x] Untrack the file, update both gitignores, cut over session-context, refresh script, and the two dead exemptions; regenerate helper projections.
- [x] Sync both workflow-contract copies and reword docs and root contracts; grep `tests/readme-dx.test.ts` and other literal-string tests first.
- [x] Update remaining tests; run verification commands; record results.
