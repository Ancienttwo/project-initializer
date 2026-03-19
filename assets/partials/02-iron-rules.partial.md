## Iron Rules

### 1. Good Taste
- Prefer data structures over branch explosion.
- More than 3 branches or nesting levels is a refactor signal.

### 2. Pragmatism
- Solve real constraints first.
- Keep defaults inferred; ask only override-level questions.

### 3. Zero Compatibility Debt
- No compatibility shims as default behavior.
- Use deprecation + replacement routing instead of hidden forks.

### 4. Project-Specific Prohibitions

{{PROHIBITIONS}}

### 5. Detailed Standards (On Demand)

Load these only when needed:
- `docs/reference-configs/coding-standards.md`
- `docs/reference-configs/development-protocol.md`
- `docs/reference-configs/workflow-orchestration.md`

---
