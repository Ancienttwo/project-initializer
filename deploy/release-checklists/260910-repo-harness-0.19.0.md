# repo-harness 0.19.0 Release Filing

- Date: 2026-09-10
- Package: `repo-harness@0.19.0`
- Base release: `v0.18.0` (`cc06b67f55fa`)
- Integration base: `16f6581f55f89277d9cff315cca439fbfcc5128a`.
- Release branch: `codex/retention-release-0-19-0`.
- Candidate commit: bound by the release PR head and final verification receipt.
- Release scope: minor with breaking behavior. The range grows a second product
  layer on top of the file-backed session contract — authorized programs that
  hold their own authorization, budget ledger, task offers, and renewable
  leases — and adds five public CLI command groups (`automation`, `campaign`,
  `refactor`, `collaboration`, `external-source`) plus `claude-review` and
  offline `uninstall`. It also replaces tmux with herdr as the peer-terminal
  runtime and untracks `tasks/current.md`.
- Publish status: **published** (2026-09-10T16:14:23.963Z UTC).
  - Merge commit: `a8b5620308a3d2123e4e4c1dc59ad2f34883fe2f` (PR #396 merged into
    `main` as a merge commit, preserving the branch head `c9e05f27b3527469` in
    `main`'s ancestry).
  - Tag: `v0.19.0`, annotated tag object
    `03b5eae2a7a1515aeba79909436afda7e7d7a4e1`, pointing at
    `a8b5620308a3d2123e4e4c1dc59ad2f34883fe2f`.
  - npm: `repo-harness@0.19.0`, dist-tag `latest: 0.19.0`,
    integrity `sha512-oZ1PUQIdcnFWSUesy6Z4o/vDhLuOdjmIDvP/P8/n13OonbdKhMum+I66MEMjIeXYZVmVlBmvUOKkUVDVYNR/yw==`,
    shasum `94ca3e059ef1d766e948f56a82d44d3d7b011850`.
  - `bun run check:release-published`: OK — registry, dist-tag, tarball, tag, and
    local version files agree (runtime evidence receipt
    `sha256:6ee79ddfc9dd2f55e9323a6950c6be38ef4eef161e440f63fe8a018e1c464005`).
  - Bun-global runtime refreshed: `repo-harness --version` reports `0.19.0`.

## Release Content

### Authorized programs (new layer)

- `repo-harness automation grant mint|list` stores and lists
  operator-minted `ProgramAuthorizationV1` records in the harness home gate
  store. Every program surface below starts from a stored authorization digest;
  there is no unauthenticated start path, and the author of every record is
  resolved from `--authorization-id` rather than declared by the payload.
- `repo-harness automation budget show|list` reads the enforceable per-goal
  ledger. Provider calls, campaign steps, adoption observations, heartbeat
  execution, and worker acquisition all reserve against it before the work is
  recorded. `automation budget repair` re-runs a locked reconciliation so a
  stopped or expired run seals its exhaustion receipt; it never reserves,
  charges, or changes a cap.
- Renewable Lease liveness carries a renewal interval, a maximum TTL, and a
  closed set of evidence sources (`controller`, `runtime_effect`,
  `publication`, `binding`). An unproven liveness state requires attention
  rather than reclaiming silently.
- `repo-harness automation controller start|step|status|stop|reconcile` runs one
  bounded unattended Engineer dispatch loop under `--maximum-steps`,
  `--maximum-duration-ms`, and `--maximum-transient-retries` with deterministic
  backoff and a bounded attempt-retry ledger.

### Engineer scheduling core

- `engineer acquire-next --authorization-id <id> --idempotency-key <key>`
  selects and claims the first canonical offer for an enrolled principal.
- Dependency edges (`canonical_done`, `module_accepted`,
  `publication_integrated`, `product_accepted`) resolve from receipt
  authorities instead of inference.
- Sprint task IDs are immutable identities under backlog schema v2;
  `repo-harness sprint migrate-schema` is the atomic, fail-closed migration.
- `engineer work-demand propose|transition|materialize|status`,
  `engineer message send|receive|ack`, `engineer principal enroll|list|status|revoke`,
  `engineer task-freeze`, and `engineer board` complete the surface.

### Campaign, refactor, collaboration, external source

- `repo-harness campaign audit|author|author-followup|adopt|step|prepare-resume|transition|status|closeout`
  runs a seeded repair program through the GPT Pro authoring lane and an
  exact-SHA adoption readback. `prepare-resume` emits a zero-provider resume
  request from stored adoption, continuation, and budget evidence.
- `repo-harness refactor` operates the ArchContext-backed refactor program.
  Activation stays off in this release: the canary set and rung-promotion
  evidence must be refreshed against the installed provider first.
- `repo-harness collaboration exchange|threads|signals|post|handoff|packet`
  exposes the Work Exchange for one authenticated Module Engineer. Handoff
  adoption is non-exclusive and grants no Task, Claim, or Lease. The accepted
  C9 canary result remains a negative multi-seat decision; persistent
  `EngineerSeatV2`, Phase 5 Review, and Phase 6 Merge are inactive.
- `repo-harness external-source refresh|list|bind|bindings|context` observes
  provider Issues and binds one immutable source revision to one exact pending
  canonical task. Intake is inert and mints no execution authority.

### Runtime, review, and lifecycle

- herdr >= 0.9.0 replaces tmux as the peer-terminal runtime, checksum-pinned in
  `.ai/harness/policy.json#external_tooling.herdr`.
- `repo-harness claude-review round|status|close|cancel` hosts a persistent
  read-only Claude reviewer in an owned herdr session across up to three repair
  rounds.
- `repo-harness uninstall` and `repo-harness mcp uninstall` remove only owned
  managed configuration offline, preserving user edits and static history.
- Execution facts and semantic acceptance are separated authorities; active
  contracts are migrated onto the split with execution identity preserved.

### Documentation

- `README.md` is restructured around the two layers: the session contract stays
  the entry path, and a new `## Authorized Programs` section documents the
  program layer. Four localized READMEs are brought to parity.
- `docs/CHANGELOG.md` gains a `[0.19.0]` section with an explicit `### Breaking`
  subsection.

## Semantic Version Decision

`0.19.0` rather than `1.0.0`. Under 0.x cadence a minor may carry breaking
behavior, and this repository already takes minors for new public surfaces
(0.17.1 -> 0.18.0 for a protocol bump). A `1.0.0` would be a compatibility
promise the range does not make: the campaign, refactor, and collaboration
surfaces are explicitly gated, Refactor Mode activation is off, and multi-seat
collaboration is an accepted negative decision.

`0.18.1` is rejected: the range adds five public command groups, changes host
readiness prerequisites, untracks a previously tracked workflow file, and
requires a sprint backlog schema migration.

## Breaking Changes

| Change | Downstream action |
| --- | --- |
| herdr >= 0.9.0 replaces tmux for host readiness | Install herdr; drain reviewers on the old runtime and rebind terminal endpoints before upgrading |
| `tasks/current.md` untracked and gitignored | `git rm --cached tasks/current.md` and pick up the new `.gitignore` entry |
| Sprint backlog schema v2 required for task identity | `repo-harness sprint migrate-schema` |
| `provider-thread-effects` capability retired for `agent-runtime-effects` | Regenerate `CLAUDE.md` / `AGENTS.md` capability blocks |
| Oracle exact pin 0.14.1 -> 0.20.0; cookie-path transport removed | Upgrade the resolved Oracle binary; stop passing `--browser-cookie-path` |
| `campaign close-not-planned` rejects the generic `pass` disposition | Emit `external_pass` or `user_waiver` |
| Fleet acquisition's plan-to-todo projection is initialize-only | No action; an authored contract is now preserved instead of overwritten |

## Authority Boundary

- This candidate adds the reviewed browser draft recovery and checkpoint
  retention fixes to the prepared 0.19.0 source, and pins archctx and
  archctx-contracts to the published 0.5.10 packages.
- npm `latest`, tag `v0.19.0`, tarball metadata, source commit, version files,
  and installed runtime must resolve to one immutable release.
- The owner authorized merge, tag, npm publication through Web Auth, and the
  selected Bun-global runtime update after the required gates pass.

## Metadata Preparation Evidence (PR #388)

| Gate | Candidate result |
| --- | --- |
| Branch rebased onto `origin/main` at `1c8ce670`; merge-base equals that tip and the substantive digest is rebound against it | pass |
| `npm view repo-harness version` before publish | `0.18.0`, dist-tag `latest: 0.18.0` |
| `bun test tests/readme-dx.test.ts` | recorded at candidate time |
| `bun scripts/check-skill-version.ts` | recorded at candidate time |
| `bash scripts/check-task-workflow.sh --strict` | recorded at candidate time |
| `bun src/cli/index.ts init --repo . --dry-run` | recorded at candidate time |
| `bun run check:release` | pass (exit 0) at merge commit `a8b56203`: 5209 pass, 53 skip, 0 fail across 416 files; `[release] OK: npm package gate passed.` |
| `bun run smoke:tarball-install` | pass (exit 0): `repo-harness-0.19.0.tgz` installs, serves the packaged Operator, and packaged CLI bins start |
| GitHub Required/CI on release PR | pass: PR #396 head `c9e05f27b3527469` — Governance, Test, MCP path matrix (ubuntu/macos/windows), and `Required / CI` all SUCCESS |

### Skill eval evidence

- `full_test_count`: unavailable — no skill eval was run for this candidate.
- `dry_run_ratio`: unavailable.
- `grader_pass_rate`: unavailable.
- `effectiveness_authority`: **none**. This filing carries no authoritative
  skill-effectiveness evidence and must not be read as if it did.

### Readiness yellow flags

- Waza staging drift: `tooling.waza.update` reports update-available. Repair:
  `bunx skills add tw93/Waza -g -a claude-code -s think hunt check health -y`,
  then `repo-harness setup check --target claude --check-updates --json`.
- CodeGraph version drift: `tooling.codegraph.update` reports update-available.
  Repair: `bun update @colbymchenry/codegraph && bash scripts/ensure-codegraph.sh --sync`.
- Missing skill eval evidence: recorded above as unavailable, not as a pass.

## Publish Follow-through

The owner authorized the following delivery steps; all five are complete:

1. Done — PR #396 merged into `main` as merge commit
   `a8b5620308a3d2123e4e4c1dc59ad2f34883fe2f`.
2. Done — annotated tag `v0.19.0` (tag object
   `03b5eae2a7a1515aeba79909436afda7e7d7a4e1`) created at that commit and pushed
   to `origin`.
3. Done — `repo-harness@0.19.0` published to npm through Web Auth at
   2026-09-10T16:14:23.963Z UTC; `latest` now resolves to `0.19.0`.
4. Done — `bun run check:release-published` passed: registry, dist-tag, tarball,
   tag, and local version files agree. The first attempt returned E404 because
   registry replication had not caught up; the recorded pass is the rerun.
5. Done — Bun-global runtime reinstalled at `repo-harness@0.19.0`;
   `repo-harness --version` reports `0.19.0`, `~/.bun/bin/repo-harness` resolves
   to the global `src/cli/index.ts`, and `~/.bun/bin/repo-harness-hook` resolves
   to the packaged `dist/hook-entry.js`.

## Approved retention and draft follow-through (2026-09-10)

The owner approved commit, publication and Bun-global runtime refresh after
local composer/checkpoint acceptance. PR #388 already merged the version
metadata; npm and the selected global installation still report 0.18.0.
This approval supersedes the preparation-only public-action boundary above.

- Integration base: `16f6581f55f89277d9cff315cca439fbfcc5128a`.
- Scope supplement: browser-local Task Message recovery, current-only recovery
  checkpoint retention, durable publication before collection, and one shared
  recovery reader projected into the standalone helper.
- Source evidence: `plans/archive/plan-20260910-1608-operator-composer-draft.md`.
- Release follow-through: `plans/plan-20260910-1742-retention-release-0-19-0.md`.
- The owner separately approved archctx 0.5.10. PR #154 passed all ten CI
  jobs and merged at `dc4fcc3d9ee7e70f66654d934f50a55f30381cf2`. Both packages
  are published as 0.5.10 through Web Auth; registry tarballs match the tested
  artifacts byte for byte. This release fixes both provider pins to 0.5.10.
- Release gate, exact CI, registry publication and installed-runtime readback:
  pending. The owner selected npm Web Auth and completed login as `ancienttwo`.
  Publication and installed-runtime success remain unclaimed until readback.
- Skill effectiveness evidence remains unavailable. Existing Waza/CodeGraph
  update flags do not change the source or packaged runtime being released.

## Release gate outcome (2026-09-10)

- Execution `vx-29d11f7e074c48acb914` failed on one test
  (`tests/effects/campaign-authoring-resume.test.ts`, `automation_budget_clock_regression`,
  clock regressed 21 ms). It stays recorded as a failed run.
- Root cause: macOS `timed` ran an NTP SYNC at 2026-09-10 20:49:09.454 local and
  stepped the wall clock back between the `publishAutomationBudget` and
  `reserveAutomationBudgetAdmission` samples (unified log evidence). The source
  sampling order was verified correct and left unchanged.
- Focused rerun of that file: 26/26 passed. Forced rerun
  `vx-09c0b0b29f8e49cdb6fa` passed (exit 0, 44 minutes) with the force reason
  recorded. Branch CI run 34479638051 was green.
- Codex acceptance review then REJECTED the candidate: checkpoint fsync used
  read-only handles, which fails on Windows (`FlushFileBuffers` needs write
  access and cannot flush directories), silently stopping checkpoint publication
  there. Fixed on this branch, with the Windows CI matrix now running
  `tests/evidence-checkpoint.test.ts`.
- npm publication and installed-runtime readback: complete. See the publish
  status above for the merge commit, tag object, registry metadata, and the
  installed-runtime readback.
