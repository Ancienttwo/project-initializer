### 7. Development Protocol

> **Core Philosophy**: Code is toilet paper when contracts change; durable truth belongs in repo-local artifacts, not chat memory.

#### The Layered Truth

- **PRODUCT TRUTH**: `docs/spec.md`
- **EXECUTION TRUTH**: `plans/`
- **DONE TRUTH**: `tasks/contracts/`, `tasks/reviews/`, `.ai/harness/checks/latest.json`
- **MUTABLE LAYER**: `src/`

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
- `docs/reference-configs/harness-overview.md`
- `docs/reference-configs/sprint-contracts.md`

---
