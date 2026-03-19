### 7. Development Protocol

> **Core Philosophy**: Code is toilet paper when contracts change; rewrite over patch.

#### The Layered Truth

- **IMMUTABLE LAYER**: `specs/`, `contracts/`, `tests/`
- **MUTABLE LAYER**: `src/`
- Source of truth lives in the immutable layer.

#### Response Protocol (Concise)

```yaml
NEW_FEATURE_FLOW:
  1. Define acceptance criteria
  2. Define contract
  3. Write failing tests
  4. Implement and verify

BUG_FIX_FLOW:
  1. Reproduce with test
  2. Fix root cause
  3. Re-run full verification
```

Detailed playbooks:
- `docs/reference-configs/ai-workflows.md`
- `docs/reference-configs/development-protocol.md`

---
