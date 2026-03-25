# Harness Overview

This repo uses a shared long-running harness. The durable workflow lives in repo-local artifacts, not in chat memory.

## Roles

- **Planner** updates `docs/spec.md`, researches constraints, and writes or approves `plans/plan-*.md`.
- **Generator** implements only against the active sprint contract and keeps `tasks/todo.md` synchronized.
- **Evaluator** writes `tasks/reviews/<slug>.review.md` and scores the current sprint using fresh evidence from `.ai/harness/checks/latest.json`.

## State Flow

1. `docs/spec.md` captures stable product intent.
2. `plans/plan-*.md` captures a concrete execution approach.
3. `tasks/contracts/<slug>.contract.md` defines done for the active sprint.
4. `tasks/todo.md` is the execution projection for the active sprint.
5. `tasks/reviews/<slug>.review.md` records evaluator judgment.
6. `.ai/harness/handoff/current.md` preserves resumable state across sessions.

## Session Boundaries

- Exploration and planning are allowed before a contract exists.
- Implementation requires: `docs/spec.md`, an approved plan, and an active sprint contract.
- Claiming completion requires: contract verification evidence plus a passing review artifact.
- Stopping a session should refresh `.ai/harness/handoff/current.md`.
