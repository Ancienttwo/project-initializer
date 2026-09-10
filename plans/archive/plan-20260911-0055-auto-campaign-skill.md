# Plan: Auto-campaign single-turn skill with standard budget

> **Status**: Done
> **Created**: 20260911-0055
> **Slug**: auto-campaign-skill
> **Planning Source**: codex-plan
> **Orchestration Kind**: host-plan
> **Source Ref**: (none)
> **Artifact Level**: work-package
> **Promotion Reason**: verification_boundary
> **Verification Boundary**: Managed skill installation and canonical grant draft with model-free focused tests
> **Rollback Surface**: Revert only auto-campaign skill, manifest registration and focused tests; no live grants or runtime state
> **Spec**: `docs/spec.md`
> **Research**: See `docs/researches/`

## Workflow

Standard profile: this approved plan owns scope and verification. No separate contract, review or notes artifact. Execution is isolated in codex/auto-campaign-skill at base 8a33faed.

## Intent and accepted behavior

Owner requests auto-campaign with standard budget: one explicit invocation starts one bounded product turn, not a single model API turn. Reuse the original campaign/grant/ledger on resume. End at completed group, manual merge, budget exhaustion or a blocker; never mint another grant or group automatically. This implementation creates the conversational entrypoint, not host execution containment or live BRC acceptance. User authorized planning and implementation in the current conversation.

## P1 — Map

assets/skill-commands/manifest.json owns managed skill profile membership and assets/skills owns skill content. Existing global install projection copies complete package directories. src/core/automation/budget.ts owns ProgramAuthorizationV1, its canonical sealing/validation and enforced caps; src/effects/automation/grant-store.ts owns immutable mint/read. Existing campaign CLI owns start/transition/author/step/adopt/audit/closeout. Runtime authority and policy remain unchanged.

## P2 — Trace

Explicit auto-campaign request -> read current target and policy/provider/runtime readiness -> read one preset -> resolve authoritative grant inputs -> prepare canonical draft using installed runtime sealProgramAuthorization -> show scope and concrete bounds and obtain/reuse authorization -> existing grant mint and campaign start -> prepare_group -> author -> step/adopt/planning/acquire/verify/publication until one stop boundary. Status/replay read original durable IDs. Missing/off policy or disallowed execution environment stops before grants/provider effects. A dry run of adopt is not zero-provider and must not be used for preflight.

## P3 — Decision

Skill is the conversational coordinator; it owns no new runtime journal, budget parser or lifecycle. A portable supporting helper resolves the installed package through repo-harness docs path, calls its existing canonical grant sealer, and emits JSON to stdout without mint/start/provider effects. Caller supplies validated authoritative repository/ref/work-graph/issuer/session inputs; no local guessed authority. The preset JSON owns all defaults. No budget overrides in first version; explicit different limits require a separately reviewed grant, not silently widened standard. Token/cost limits remain null and unclaimed. Default policy activation and platform restrictions are not changed. At 10x demand the fixed group and budget stop the turn; no auto rollover or queue controller is added.

## Standard preset

One group, five Issues, bugfix/test_gap only, max_parallel_tasks 2, manual merge (squash), low risk only, contract_less campaign grant with null contract path. Budget: 40 agent turns, 10 successful acquisitions, 20 runner invocations, 3 provider failures, 3 consecutive no-progress steps, 1 repair cycle, 5400 wall-clock seconds, null input/output token and cost caps. Campaign: 2 authoring rounds, 40 controller steps, 32 provider calls; transient retries limited to 2 consecutive failures with 1000/10000 ms initial/maximum backoff. Grant expiry is issued_at plus preset wall-clock seconds. Duplicate required max_repair_cycles fields are derived from the same preset budget value. No model/profile override.

## File scope

- assets/skills/auto-campaign/SKILL.md: triggering, turn semantics, preflight, consent reuse, existing CLI progression, stop/report contract.
- assets/skills/auto-campaign/references/standard.json: sole preset data.
- assets/skills/auto-campaign/references/execution.md: authoritative input and current CLI mapping, no guessed receipts/IDs, resume/merge boundary.
- assets/skills/auto-campaign/scripts/prepare-grant.ts: deterministic zero-effect grant draft via runtime sealer.
- assets/skill-commands/manifest.json and existing manifest/profile discovery tests or projection metadata proven necessary by surface trace: install for Claude/Codex full profile.
- tests/auto-campaign-skill.test.ts: preset -> canonical validation/mint in disposable HOME; bad/missing authority and no mint on draft; relocated installed skill resolution; trigger and stop instructions; package manifest discovery.
- docs/researches/20260911-auto-campaign-turn.md: durable product contract and verified boundary, link preset rather than copy numbers.
- Active plan itself: task/evidence sync. Additional contract/review/notes only if live workflow profile requires them.

## Verification

Run focused new skill/helper tests and existing named skill manifest/profile/installation checks identified by P1. Verify portable skill content after actual managed installation into disposable HOME; no global runtime changes. Run required integrity checks: check:hooks, check:helpers, check-deploy-sql-order, check-architecture-sync, check-task-sync, strict check-task-workflow, inspect-project-state, init dry-run. One final check review of frozen diff. No full suite or provider-based skill benchmark: no runtime semantics change and focused installed-skill tests cover the changed boundary. Do not claim model effectiveness or BRC acceptance from these checks.

## Task Breakdown
- [x] Register and author auto-campaign with single standard budget authority and zero-effect canonical draft helper.
- [x] Verify trigger/stop/resume, canonical budget binding, invalid input rejection and installed skill relocation in disposable fixtures.
- [x] Run required integrity checks, one final review, promote durable semantics and record exact delivery state.

## Promotion Gate

- **Merge/PR unit**: auto-campaign skill, preset, portable draft helper and managed discovery registration.
- **Rollback surface**: Revert this skill/catalog/test change; no live runtime mutations.
- **Verification boundary**: Disposable full/minimal host installation and canonical grant round trip.
- **Review/acceptance boundary**: One frozen-diff check review and focused/integrity evidence.
- **High-risk surface**: Draft input provenance and existing authorization gates must remain explicit.
- **Why not checklist row**: This is a separately installable product entrypoint with its own verification boundary.

## Evidence Contract

- **State/progress path**: This plan's Task Breakdown in codex/auto-campaign-skill.
- **Verification evidence**: Focused tests and required commands listed above; results recorded below.
- **Evaluator rubric**: Portable installed skill, sole budget preset, no minted authority from drafting, and no resume budget renewal; runtime gates preserved.
- **Stop condition**: Named focused tests/integrity checks pass and one review has no blocking findings.
- **Rollback surface**: Revert scoped skill/catalog/tests; no grants or provider calls were made outside disposable fixtures.

> **Substantive Change SHA256**: `sha256:d08723e9a22d619c1da0aafe6d18c00723b28d9805ebccb46ceb84038f479fd8`

## Acceptance Notes

- Base: 8a33faed74ab65706d4f3df7d03c8f7ccac53b84; isolated branch codex/auto-campaign-skill.
- `bun test tests/auto-campaign-skill.test.ts`: 3 pass, including actual full/minimal managed installation, both host copies, relocated helper and canonical mint/read in disposable HOME.
- `bun test tests/skill-surface tests/action-command-skills.test.ts`: 137 pass. Fixed exact live catalog expectations for the new facade; historical discovery baseline unchanged.
- `bun run check:type`: pass.
- Required integrity commands listed in Verification: all pass. Task-sync is bound to the substantive digest above; workflow field omissions corrected before acceptance.
- `npm pack --pack-destination /tmp --json` rebuilt hook/UI assets; tarball SHA1 7e488753baa1950db30bf3a17fc2af4b54d5c2fa. Installed tarball into a temporary package/HOME, projected both host skill copies, invoked the relocated draft helper through installed CLI and proved no grant store was created. All four skill files present; no skill cache/noise files.
- One Standard check review: parent correctness/package review and conditional security/architecture reviewers PASS, no findings. No second acceptance review.
- Full suite and provider effectiveness runs omitted: changed boundary is skill packaging and deterministic draft generation; named focused tests plus real package install cover it. No runtime controller, ledger, grant-store or Lease implementation changed. Resume/stop are reviewed skill instructions, not a live model behavior proof.
- Durable semantics promoted to docs/researches/20260911-auto-campaign-turn.md. Implementation complete; global installation, live campaign, merge and release were not performed.
