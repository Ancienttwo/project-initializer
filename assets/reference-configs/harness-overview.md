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
6. `.ai/harness/policy.json` is the machine-readable workflow contract.
7. `external_tooling` inside `.ai/harness/policy.json` captures default routing for gstack, Waza, and gbrain.
8. `.ai/context/context-map.json` indexes stable root context and discoverable nested context.
9. `.ai/harness/handoff/current.md` preserves resumable state across sessions.
10. `.ai/harness/events.jsonl` and `.ai/harness/runs/*.json` retain lightweight execution traces.

## Session Boundaries

- Exploration and planning are allowed before a contract exists.
- Implementation should prefer `docs/spec.md`, an approved plan, and an active sprint contract.
- Claiming completion should include contract verification evidence plus a passing review artifact.
- Stopping a session should refresh `.ai/harness/handoff/current.md` for easier resume.
- Use `docs/reference-configs/external-tooling.md` for install/update commands and host routing guidance.
