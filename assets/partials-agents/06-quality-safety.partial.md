## Quality & Safety

### Verification Gate
- Never mark work done without verification output.
- Run impact-based checks: typecheck, tests, lint/build.
- Run `bash scripts/check-task-workflow.sh --strict` before claiming the workflow is clean.
- Run `bash scripts/verify-contract.sh --contract <active-plan-contract> --strict` before any done/completed response when the active plan has a contract.

### Safety Rules
- Do not silently expand scope beyond approved plan.
- If unexpected repo changes appear, stop and ask.
- Prefer modifying existing files over unnecessary file creation.

### Final Response Contract
1. What changed
2. Verification evidence
3. Which `tasks/*.md` files were updated
4. Known risks/gaps
5. Optional next steps

---
