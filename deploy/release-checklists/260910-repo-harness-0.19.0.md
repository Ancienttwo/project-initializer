# repo-harness 0.19.0 Release Filing

- Date: 2026-09-10
- Package: `repo-harness@0.19.0`
- Base release: `v0.18.0` (`cc06b67f55fa`)
- Product source range: `v0.18.0..1c8ce670` (467 commits, ~210k inserted lines).
  The branch was first cut at `fd675687` (464 commits) and rebased onto
  `1c8ce670` when `main` advanced during review. The three added commits are one
  CI workflow change (#387) and one campaign capability (#385, settled-failed
  adopted resume), the latter folded into the changelog's campaign entry.
- Release-prep branch: `codex/release-0-19-0`
- Candidate commit: bound by the release PR Head after the metadata commit
- Release scope: minor with breaking behavior. The range grows a second product
  layer on top of the file-backed session contract — authorized programs that
  hold their own authorization, budget ledger, task offers, and renewable
  leases — and adds five public CLI command groups (`automation`, `campaign`,
  `refactor`, `collaboration`, `external-source`) plus `claude-review` and
  offline `uninstall`. It also replaces tmux with herdr as the peer-terminal
  runtime and untracks `tasks/current.md`.
- Publish status: **prepared, not published**. No tag, no npm publish, no
  global runtime mutation has been performed for this version.

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

- This candidate changes release metadata and documentation only; product
  implementation is the already accepted source range on `main` at `fd675687`.
- npm `latest`, tag `v0.19.0`, tarball metadata, source commit, version files,
  and installed runtime must resolve to one immutable release.
- Registry publication, tag creation, merge, and global runtime mutation are
  **not** authorized by this filing. They require a separate explicit owner
  decision.

## Candidate Gate Evidence

| Gate | Candidate result |
| --- | --- |
| Branch rebased onto `origin/main` at `1c8ce670`; merge-base equals that tip and the substantive digest is rebound against it | pass |
| `npm view repo-harness version` before publish | `0.18.0`, dist-tag `latest: 0.18.0` |
| `bun test tests/readme-dx.test.ts` | recorded at candidate time |
| `bun scripts/check-skill-version.ts` | recorded at candidate time |
| `bash scripts/check-task-workflow.sh --strict` | recorded at candidate time |
| `bun src/cli/index.ts init --repo . --dry-run` | recorded at candidate time |
| `bun run check:release` | not run in this prep pass |
| `bun run smoke:tarball-install` | not run in this prep pass |
| GitHub Required/CI on release PR | not opened |

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

Not started. When the owner authorizes publication:

1. Merge the reviewed release PR into `main`.
2. Create tag `v0.19.0` at the merged commit and push it.
3. Publish `repo-harness@0.19.0` to npm.
4. Run `bun run check:release-published` to bind registry metadata, dist-tag,
   tarball integrity, tag, installed CLI, and installed hook runtime.
5. Refresh the selected Bun-global runtime and confirm `repo-harness --version`
   reports `0.19.0`.
