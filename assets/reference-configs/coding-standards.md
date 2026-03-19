# Coding Standards (Reference)

Use this file for detailed coding constraints that are intentionally not always loaded.

## Guidance

- Prefer composable data structures over branch-heavy logic.
- Keep functions small enough to reason about quickly.
- Remove dead code instead of preserving compatibility shims.
- Keep tests close to behavior changes.

## Red-Line Defaults

| Metric | Recommended Threshold |
|---|---|
| File lines | <= 800 |
| Function lines | <= 40 (split if comprehension drops) |
| Nesting depth | <= 3 |
| Branch count | <= 3 |

## Escalation

If a constraint is intentionally exceeded, record rationale in `docs/decisions.md`.
