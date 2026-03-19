## Coding Constraints

### First Principles
- Prefer data modeling over branch-heavy conditionals.
- Favor derivation over duplicated state.

### Single Source of Truth
- `specs/`, `contracts/`, `tests/` are authoritative.
- `src/` is mutable implementation.
- Rewrite over patch when contracts diverge.

### Quality Rules
- Keep functions intention-revealing and test-backed.
- Keep compatibility debt explicit through deprecation + replacement mapping.

See details in:
- `docs/reference-configs/coding-standards.md`
- `docs/reference-configs/development-protocol.md`

---
