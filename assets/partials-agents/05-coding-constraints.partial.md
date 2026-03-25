## Coding Constraints

### First Principles
- Prefer data modeling over branch-heavy conditionals.
- Favor derivation over duplicated state.

### Single Source of Truth
- `docs/spec.md`, `tasks/contracts/`, `tasks/reviews/`, and `tests/` are authoritative.
- `src/` is mutable implementation.
- Rewrite over patch when contracts diverge.

### Quality Rules
- Keep functions intention-revealing and test-backed.
- Keep compatibility debt explicit through deprecation + replacement mapping.

See details in:
- `docs/reference-configs/sprint-contracts.md`
- `docs/reference-configs/evaluator-rubric.md`

---
