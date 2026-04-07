# Lessons Learned (Self-Improvement Loop)

> Capture correction-derived prevention rules here.
> Promote repeated patterns into durable project rules during spa day.

## Template
- Date:
- Triggered by correction:
- Mistake pattern:
- Prevention rule:
- Where to apply next time:

## Entries
- Date: 2026-04-08
- Triggered by correction: workflow helper inventories and required-path checks had started drifting across multiple shell scripts
- Mistake pattern: repeating contract-critical lists in more than one place
- Prevention rule: promote helper/file/dir inventories into `assets/workflow-contract.v1.json`, then make scripts and tests consume that contract
- Where to apply next time: any new repo-local workflow artifact, helper script, or migration rule
