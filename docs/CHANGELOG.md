# Changelog

All notable changes to this skill are documented here.

## [3.0.0] - 2026-03-25

### Changed

- Upgraded generated repositories from a tasks-first scaffold to a shared long-running harness model.
- Added `docs/spec.md`, `tasks/reviews/`, and `.ai/harness/{checks,handoff}` as first-class generated artifacts.
- Reworked hook behavior around artifact-aware execution gates, contract scope enforcement, structured checks, and mandatory handoff generation.
- Upgraded the initializer question pack to `v2` and added stack-aware orchestration, evaluation, and handoff defaults.
- Updated helper scripts, templates, CLAUDE/AGENTS routing output, and tests to the 3.0 harness model.
