> **Archived**: 2026-09-08 23:43
> **Related Plan**: plans/archive/plan-20260908-2325-mcp-setup-uninstall.md
> **Outcome**: Completed
> **Lifecycle**: plan
> **Parent Run ID**: run-20260908-2343
> **Archive Projection V1**: `plans/plan-20260908-2325-mcp-setup-uninstall.md` => `plans/archive/plan-20260908-2325-mcp-setup-uninstall.md`
> **Archive Projection V1**: `tasks/notes/20260908-2325-mcp-setup-uninstall.notes.md` => `tasks/archive/notes-20260908-2343-mcp-setup-uninstall.md`
> **Archive Projection V1**: `tasks/contracts/20260908-2325-mcp-setup-uninstall.contract.md` => `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md`
> **Archive Projection V1**: `tasks/reviews/20260908-2325-mcp-setup-uninstall.review.md` => `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md`

# Plan: Independent MCP setup uninstall

> **Status**: Archived
> **Created**: 20260908-2325
> **Slug**: mcp-setup-uninstall
> **Planning Source**: waza-think
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: risk_boundary
> **Verification Boundary**: Offline credential teardown, shared registry preservation and project TOML restoration
> **Rollback Surface**: MCP setup/uninstall CLI and bounded configuration receipts; no live user data mutations
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`
> **Task Contract**: `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md`
> **Task Review**: `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md`
> **Implementation Notes**: `tasks/archive/notes-20260908-2343-mcp-setup-uninstall.md`

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

- Active plan: `plans/archive/plan-20260908-2325-mcp-setup-uninstall.md`
- Sprint contract: `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md`
- Sprint review: `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md`
- Implementation notes: `tasks/archive/notes-20260908-2343-mcp-setup-uninstall.md`
- Deferred-goal ledger: `tasks/todos.md`
- Current checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`
- Scope authority: `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md` `allowed_paths`
- Concurrency rule: `.ai/harness/active-plan` selects the active plan for this worktree when present; `.ai/harness/active-worktree` records the owning worktree. If another worktree already owns active work, open or switch to the matching worktree instead of serializing unrelated plans.
- Execution isolation: approved contract-level work projects through `repo-harness run plan-to-todo --plan plans/archive/plan-20260908-2325-mcp-setup-uninstall.md` and may start `repo-harness run contract-worktree start --plan plans/archive/plan-20260908-2325-mcp-setup-uninstall.md`.

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
- Contract file: `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md`
- Review file: `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md`
- Implementation notes file: `tasks/archive/notes-20260908-2343-mcp-setup-uninstall.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `repo-harness run verify-contract --contract tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md --strict`
- Active plan rule: this captured plan is written to `.ai/harness/active-plan` and the owning worktree is written to `.ai/harness/active-worktree` unless --no-active is used. Do not infer active execution from the latest non-archived plan.

## Handoff

- Checks file: `.ai/harness/checks/latest.json`
- Session handoff: `.ai/harness/handoff/current.md`

## Promotion Gate

- **Merge/PR unit**: Captured plan `plans/archive/plan-20260908-2325-mcp-setup-uninstall.md` is the proposed mergeable execution unit; revise before execute if this is only a checklist step.
- **Rollback surface**: MCP setup/uninstall CLI and bounded configuration receipts; no live user data mutations
- **Verification boundary**: Offline credential teardown, shared registry preservation and project TOML restoration
- **Review/acceptance boundary**: `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md` must record pass against the captured acceptance criteria.
- **High-risk surface**: Risks named in captured planning output; keep the plan Draft if risk ownership is not concrete.
- **Why not checklist row**: risk_boundary

## Evidence Contract

- **State/progress path**: `plans/archive/plan-20260908-2325-mcp-setup-uninstall.md` task breakdown, `tasks/todos.md` deferred-goal ledger, `tasks/archive/contract-20260908-2343-mcp-setup-uninstall.md`, `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md`, and `tasks/archive/notes-20260908-2343-mcp-setup-uninstall.md`
- **Verification evidence**: `.ai/harness/checks/latest.json`, `.ai/harness/runs/`, and the commands named in the captured planning output
- **Evaluator rubric**: `tasks/archive/review-20260908-2343-mcp-setup-uninstall.md` must record a passing Waza /check style recommendation
- **Stop condition**: all task breakdown items are complete, sprint verification passes, and the review recommends pass
- **Rollback surface**: MCP setup/uninstall CLI and bounded configuration receipts; no live user data mutations

## Captured Planning Output

## Goal
Complete the approved independent MCP setup teardown slice. Preserve repositories, running task/workspace data, archives and unrelated host configuration.

## P1 / P2 / P3
Codex setup patches project .codex/config.toml; ChatGPT setup writes account-level mcp.local.json, bearer/OAuth credentials and registered-repos.json. The shared registry serves other harness consumers: preserve non-MCP registrations, restore only receipt-proven setup changes, preserve unproven shared authorization and advance authorizationRevision through its owning lock. HTTP servers cache credentials and can flush them back after deletion: teardown is explicitly offline, requires --services-stopped for ChatGPT apply, never claims live/remote revocation. No process killing, new service manager or external connector automation. At 10x state the registry scan is the first scaling cost; no workspace scan is needed.

## Implementation
- Add repo-harness mcp uninstall --target codex|chatgpt|both (default both), --repo, --dry-run, --json, --services-stopped and --recover-interrupted for project configuration recovery.
- Reuse bounded configuration fragment receipts and transaction lock for project Codex setup; allow repo_harness TOML selector with semantic sibling validation. Record original fragment before setup. Uninstall restores proven preimage, preserves edited/unproven fragments, supports explicit interrupted transaction recovery and idempotence. Existing installations with no receipt are reported unresolved instead of guessing from .bak.
- Implement MCP teardown in src/cli/mcp/uninstall.ts. Plan all exact paths before mutation; symlinks/malformed shared config fail closed. Delete four dedicated MCP config/credential stores without retaining secret backups. Serialize ChatGPT setup/uninstall with a shared storage-root setup lock and restore rows under the existing registry authority lock; implement owning registry restoration operation preserving other registrations while restoring setup-owned access grants. Honor REPO_HARNESS_HOME.
- Static generated guides, bridge skill files, configuration restoration history, repositories and all workspace/task state remain. External environment credentials and remote Connector registration require operator cleanup, reported distinctly from local completion. No credentials are printed or copied into receipts.
- Update CLI/docs and deferred ledger. No new dependencies; new uninstall module owns plan/apply behavior, shared existing fragment/registry helpers protect setup/uninstall invariants. More than eight files expected including tests and docs.

## Verification
Focused tests: new tests/cli/mcp-uninstall.test.ts, existing mcp-setup, configuration-ownership/uninstall, registry and MCP HTTP/OAuth suites as affected. Test fresh roundtrip, prior config restoration, edited/unproven/malformed/symlink cases, no-write dryrun, custom storage root, target isolation, inactive epochs, repeat apply, stop-service precondition, registry grant revocation and workspace byte preservation. Run typecheck and six required repo-integrity checks. No full suite: named tests cover setup and cleanup boundaries; runtime behavior is unchanged. Freeze then prepare acceptance and one Waza check review; local merge through contract-worktree finish. No live user HOME uninstall, push or release.

## Task Breakdown
- [x] Implement receipt-aware Codex setup and scoped MCP uninstall with offline credential cleanup and registry revocation.
- [x] Add focused tests and update product documentation/deferred ledger.
- [ ] Complete scoped checks and Waza check, record acceptance, archive and merge locally.

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [x] Implement receipt-aware Codex setup and scoped MCP uninstall with offline credential cleanup and registry revocation.
- [x] Add focused tests and update product documentation/deferred ledger.
- [ ] Complete scoped checks and Waza check, record acceptance, archive and merge locally.
