# Implementation Notes: untrack-current-status

> **Status**: Active
> **Plan**: plans/plan-20260906-0415-untrack-current-status.md
> **Contract**: tasks/contracts/20260906-0415-untrack-current-status.contract.md
> **Review**: tasks/reviews/20260906-0415-untrack-current-status.review.md
> **Last Updated**: 2026-09-06 04:16
> **Lifecycle**: notes
> **Substantive Change SHA256**: `sha256:9b2c19bc8cab96ee74a194751ce09340818598946ca6514cf0f1bdd09b05b315`

## Falsifier Result: FAILED on the first pass, resolved by the parent (decisions 8a/8b)

Contract falsifier: "If some gate or hook requires `tasks/current.md` to be committed ...
untracking reds CI." Result: **the falsifier fires.** Two independent Stop Conditions
("the change would require editing a path outside Allowed Paths") were hit.

### Blocker 1 — `check-task-workflow.sh` hard-requires the file to exist, and CI never generates it

- `scripts/check-task-workflow.sh:1153` calls `check_required_file "$current_status_file"`.
- `check_required_file` (`scripts/check-task-workflow.sh:779-786`) is a bare `[[ -f "$path" ]]`
  test that calls `report_issue` on absence. It has no tolerate-absent branch.
- Empirical proof (file moved aside, then restored):
  `bash scripts/check-task-workflow.sh --strict` ->
  `[workflow] Missing required file: tasks/current.md` (x2), `EXIT=1`.
- `scripts/check-ci.sh` runs `bash scripts/check-task-workflow.sh --strict` on a fresh
  checkout and never runs `ensure-task-workflow.sh` or `refresh-current-status.sh`.
  The only two generators it does run beforehand (`prepare-handoff.sh`,
  `codex-handoff-resume.sh`) contain zero references to `refresh-current-status` or
  `tasks/current`. `package.json` has no `postinstall`/`prepare`/`pretest` lifecycle hook.
  So in CI the file exists *only because it is tracked*.
- The plan's decision 5 says to treat the path "exactly as `.ai/harness/handoff/current.md`".
  That analog is **not** symmetric: the handoff file is checked by
  `check_handoff_resume_pair` (`scripts/check-task-workflow.sh:739-761`), which early-returns
  on line 743 when neither file exists. `tasks/current.md` is a hard required file.
  Achieving the stated symmetry therefore requires editing
  `scripts/check-task-workflow.sh` plus its projection
  `assets/templates/helpers/check-task-workflow.sh` -- neither is in Allowed Paths, and
  neither appears in the plan Scope or Task Breakdown.
- This is also a downstream product-contract change (every adopted repo would stop
  requiring the snapshot), not a mechanical edit, so it is a parent decision.

### Blocker 2 — `docs/reference-configs/` is a generated projection, not the authority

- `scripts/sync-reference-configs.ts:18,105` projects **`assets/reference-configs/` ->
  `docs/reference-configs/`**; `check:reference-configs` fails on content drift.
- Allowed Paths lists only `docs/reference-configs/` (the projection). Three of the
  cross-branch-read hits that must be removed live in the authority side:
  `assets/reference-configs/harness-overview.md:59`,
  `assets/reference-configs/handoff-protocol.md:31`,
  `assets/reference-configs/agentic-development-flow.md:96`.
- Editing only `docs/` reds `check:reference-configs`, which is an Exit Criterion;
  editing `assets/reference-configs/` is outside Allowed Paths.

### Resolution (parent, plan decisions 8a and 8b)

- 8a: `check_required_file "$current_status_file"` was removed from
  `scripts/check-task-workflow.sh`, mirroring `check_handoff_resume_pair`'s early return.
  Presence is still validated by the existing heading/checklist checks and
  `check_current_resume_freshness`, both already absence-guarded. A comment at the removal
  site names the reason. `tests/helper-scripts.test.ts` now proves all three states:
  present -> pass, absent -> pass with no "Missing required file" line, present-but-malformed
  -> fail. CI is not modified.
- 8b: the three cross-branch reads and the "tracked" wording were edited in
  `assets/reference-configs/` (authority) and projected with `sync:reference-configs`.
- The workflow contract now carries `tasks/current.md` in `runtimeFiles` beside
  `.ai/harness/handoff/current.md` instead of `requiredFiles`, which is the contract-level
  expression of the same 8a decision. `documents.currentStatus` is unchanged.

## Residual: closed by plan items 8c and 8d (follow-up commit)

Both were reported out-of-scope on the first pass; the parent widened Allowed Paths and
they are now fixed. Original findings kept below for the audit trail.

1. **Generated capability-context blocks still call the file tracked.** Eight files carry
   `- \`tasks/current.md\` is the tracked derived status snapshot; ...`:
   `assets/CLAUDE.md:81`, `assets/AGENTS.md:81`, `scripts/CLAUDE.md:73`, `scripts/AGENTS.md:73`,
   `assets/hooks/CLAUDE.md:77`, `assets/hooks/AGENTS.md:77`, emitted by
   `scripts/architecture-event.ts:1280` and `scripts/context-contract-sync.sh:489`
   (plus their two helper projections). Root `CLAUDE.md`/`AGENTS.md` were reworded in scope and
   `check-architecture-sync.sh` passes today, but because the same block is generator-owned, a
   later projection run can rewrite the root line back to "tracked". Fix is two generator
   lines plus a projection refresh.
   **Closed (8c).** Both generator lines now emit
   `- \`tasks/current.md\` is the ignored local derived status read model; ...`, matching the
   root contracts. Helper projections resynced. The six generated blocks were refreshed to the
   generator's exact literal: `git diff --numstat` shows precisely one changed line per file,
   and a byte comparison asserts both generator literals and all eight consumer files
   (six generated blocks plus root `CLAUDE.md`/`AGENTS.md`) now carry the identical sentence, so
   a future projection run is idempotent rather than reverting. There is no bulk-regeneration
   entrypoint -- `context-contract-sync.sh sync-latest` processes a single event and a synthetic
   event would restamp `Last architecture event`, `Severity`, and `Last changed path`, so the
   generator-owned line was substituted directly and then proven equal to generator output.
   A seventh and eighth file surfaced during verification: `.ai/hooks/CLAUDE.md` and
   `.ai/hooks/AGENTS.md` are a byte-parity projection of `assets/hooks/`, enforced by
   `tests/workflow-contract.test.ts`. They were refreshed with the repo's own
   `bun run sync:hooks`, not hand-edited.
2. **A second downstream gitignore authority was not updated.** `src/core/adoption/gitignore-plan.ts`
   (used by `repo-harness init`) now ignores `tasks/current.md`, but the shell bootstrap path
   `scripts/lib/project-init-lib.sh:57` has its own literal block and does not. Repos scaffolded
   through `create-project-dirs.sh` will still track the file. A speculative assertion for this
   was added and then reverted from `tests/create-project-dirs.runtime.test.ts` to keep the test
   suite honest about what actually changed.
   **Closed (8d).** `tasks/current.md` added at `scripts/lib/project-init-lib.sh:58`, in the same
   position as `gitignore-plan.ts` (directly after `tasks/.current.md.tmp.*`). The
   `tests/create-project-dirs.runtime.test.ts` ignore-list assertion was restored and passes.
   The dual authority itself is not unified here -- that is a separate slice, now recorded as a
   deferred goal in `tasks/todos.md` with the drift risk and revisit trigger.

## Verification coverage rationale

No full `bun test` run. Every changed behavior is covered by a named focused file:
session-context prompt shape, workflow-contract list membership and both-copy equality, adoption
ignore template, refresh helper output, the new check-task-workflow tolerate-absent case, plus
scaffold-parity / bootstrap-files / evidence-projection-drift / readme-dx from the contract's
exit criteria. `check:type`, `check:helpers`, `check:reference-configs`, `check-architecture-sync`,
`check-task-sync`, `check-task-workflow --strict`, the inspector, and `init --dry-run` all ran clean.

## Classified Hit Inventory (checklist for the unblocked run)

`rg -n 'tasks/current.md' src scripts assets docs tests CLAUDE.md AGENTS.md SKILL.md README.md .github` -> **220 hits**.

| Bucket | Count | Notes |
|--------|-------|-------|
| Cross-branch read (remove) | 13 across 9 files | `src/cli/hook/session-context.ts` (3), `scripts/refresh-current-status.sh` (2) + helper projection (2), and 3 reference-config docs x2 (authority+projection). 3 of these are outside Allowed Paths (Blocker 2). |
| "tracked" wording (reword) | 25 | Spread over CLAUDE.md / AGENTS.md / README.md / SKILL.md / docs; must stay CLAUDE.md==AGENTS.md (`tests/scaffold-parity.test.ts`) and clear `tests/readme-dx.test.ts` literal pins. |
| Exemption (remove) | 3 | `src/effects/review/diff-fingerprint.ts:407`, `scripts/check-task-sync.sh:228`, and its projection `assets/templates/helpers/check-task-sync.sh:228`. Siblings on those lines stay. |
| Generation / local read (keep) | remainder | `scripts/ensure-task-workflow.sh:887`, policy defaults, `.ai/context/context-map.json` root_context_files, MCP/state fixtures. |
| Test (update) | 39 files | Largest surface; includes `tests/state/fixtures/` (24 hits) and `tests/cli/` (12). |

No product file was modified. `tasks/current.md` remains tracked and unchanged;
the temporary move used for the empirical proof was reverted (file restored, 5145 bytes).

## Design Decisions

- Not reached: execution stopped at the contract Falsifier.

## Deviations From Plan Or Spec

- None. Execution stopped before the first product edit, per the contract Stop Condition on Allowed Paths.

## Tradeoffs Considered

| Option | Decision | Reason |
|--------|----------|--------|
| ... | ... | ... |

## Open Questions

- Should `check-task-workflow` tolerate an absent `tasks/current.md` (true handoff symmetry, changes downstream contract), or should `scripts/check-ci.sh` regenerate it before the check? Plan decision 5 does not resolve this.

## Evidence Links

- Checks: `.ai/harness/checks/latest.json`
- Run snapshots: `.ai/harness/runs/`

## Promotion Filter

Promote a candidate to `tasks/lessons.md`, `docs/researches/`, or harness asset files only when all three hold: hard to reverse, surprising without local context, and a real trade-off existed. If any one is missing, keep it in this notes file instead.

## Promotion Candidates

- Promote to `tasks/lessons.md` only after a repeated correction or failure pattern.
- Promote to `docs/researches/` only when it is durable repo knowledge with evidence.
- Promote to harness asset files only after verification across more than one task or fixture.
