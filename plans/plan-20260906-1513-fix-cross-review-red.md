# Plan: Fix cross-review skill regressions from ad4afe77

> **Status**: Approved
> **Created**: 20260906-1513
> **Slug**: fix-cross-review-red
> **Planning Source**: repo-harness-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Substantive Change SHA256**: `sha256:3a09183a587a982d00024bb862ecaea0baf867bb30037355b37346a09d32a6ee`
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: skill-surface tests, typecheck, PR CI for tmux-bound claude-review tests
> **Rollback Surface**: Revert codex/fix-cross-review-red
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/contracts/20260906-1513-fix-cross-review-red.contract.md`
> **Task Review**: `tasks/reviews/20260906-1513-fix-cross-review-red.review.md`
> **Implementation Notes**: `tasks/notes/20260906-1513-fix-cross-review-red.notes.md`

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

- Active plan: `plans/plan-20260906-1513-fix-cross-review-red.md`
- Sprint contract: `tasks/contracts/20260906-1513-fix-cross-review-red.contract.md`
- Sprint review: `tasks/reviews/20260906-1513-fix-cross-review-red.review.md`
- Implementation notes: `tasks/notes/20260906-1513-fix-cross-review-red.notes.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/contracts/20260906-1513-fix-cross-review-red.contract.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/plan-20260906-1513-fix-cross-review-red.md` and may start `repo-harness run contract-worktree start --plan plans/plan-20260906-1513-fix-cross-review-red.md`.

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
- Contract file: `tasks/contracts/20260906-1513-fix-cross-review-red.contract.md`
- Review file: `tasks/reviews/20260906-1513-fix-cross-review-red.review.md`
- Implementation notes file: `tasks/notes/20260906-1513-fix-cross-review-red.notes.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/contracts/20260906-1513-fix-cross-review-red.contract.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/plan-20260906-1513-fix-cross-review-red.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: Revert codex/fix-cross-review-red
- **Verification boundary**: skill-surface tests, typecheck, PR CI for tmux-bound claude-review tests
- **Review/acceptance boundary**: `tasks/reviews/20260906-1513-fix-cross-review-red.review.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: verification_boundary

## Evidence Contract

- **State/progress path**: `plans/plan-20260906-1513-fix-cross-review-red.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/contracts/20260906-1513-fix-cross-review-red.contract.md`, `tasks/reviews/20260906-1513-fix-cross-review-red.review.md`, and `tasks/notes/20260906-1513-fix-cross-review-red.notes.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/reviews/20260906-1513-fix-cross-review-red.review.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: Revert codex/fix-cross-review-red

## Captured Planning Output

## Goal
Restore the three skill-surface gates that ad4afe77 ("persistent Claude review") broke on main, so every open PR can pass Required / CI again.

## P1 Map
`tests/skill-surface/cross-review-package.test.ts` pins the cross-review SKILL.md router at 2048 bytes and its `references/` set; `tests/skill-surface/retired-names-scan.test.ts` scans src/scripts/assets/docs for word-boundary hits of `retiredPackages[]` names from `assets/skill-commands/manifest.json`; `docs/architecture/modules/public-surface/action-commands.md` documents retiredPackages as pure declaration with no projection.

## P2 Trace
ad4afe77 added a Mode Selection paragraph (SKILL.md 2257 bytes), a new `references/claude-mode.md` not in the declared list, a CLI command literally named `claude-review`, and a tmux server named `repo-harness-review`; the last two are both retired package names and trip the scan.

## P3 Decision
Move the explanatory paragraph into `references/claude-mode.md` and keep only the routing bullet (SKILL.md 2043 bytes). Declare `claude-mode.md` in the test's REFERENCES. Remove `claude-review` from retiredPackages because it is a live command again and the list is pure diagnostic (19 -> 18, architecture doc and catalog test updated). Rename the tmux server to `repo-harness-claude-review` in `src/effects/review/claude-review-session.ts`, its test, and `docs/spec.md`, because `repo-harness-review` is a retired name and an allowlist would be a shim. No production behavior beyond the server name changes.

## Scope
assets/skill-commands/manifest.json; assets/skills/repo-harness-cross-review/SKILL.md and references/claude-mode.md; src/effects/review/claude-review-session.ts; docs/spec.md; docs/architecture/modules/public-surface/{action-commands,root-router}.md; tests/claude-review.test.ts; tests/skill-surface/{catalog,cross-review-package}.test.ts; this plan.

## Task Breakdown
- [x] Trim SKILL.md under 2048 bytes and declare claude-mode.md.
- [x] Retire-name collisions: drop claude-review from retiredPackages, rename the tmux server.
- [ ] CI green on the PR (claude-review.test.ts spawns real tmux and takes about 15 minutes per case locally; CI is the verification surface).

## Verification Commands

```bash
bun test tests/skill-surface --timeout 60000
bun run check:type
REPO_HARNESS_DIFF_BASE=origin/main REPO_HARNESS_DIFF_MODE=merge-base bash scripts/check-task-sync.sh
```

## Verification Results

- tests/skill-surface: pass locally (124 pass in the combined run; the 4 local failures are all in tests/claude-review.test.ts, tmux-bound, deferred to CI).
- check:type: exit 0.
- check-task-sync: bound to the digest in the header.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Trim SKILL.md under 2048 bytes and declare claude-mode.md.
- [x] Retire-name collisions: drop claude-review from retiredPackages, rename the tmux server.
- [ ] CI green on the PR (claude-review.test.ts spawns real tmux and takes about 15 minutes per case locally; CI is the verification surface).
