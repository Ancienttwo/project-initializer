# Handoff Protocol

Handoffs make long-running work resumable without trusting chat history.

## When Handoff Is Required

- Context pressure reaches the configured red zone
- Verification fails and the work is not resolved in-session
- The active sprint changes
- The session is ending

## Required Sections

- Active spec / plan / contract / review pointers
- Current status and blocker summary
- Files changed in the working tree
- Latest check results
- Next recommended action

## Restore Flow

1. Read `.ai/harness/handoff/current.md`
2. Read the active plan and sprint contract
3. Read the latest review file if one exists
4. Read `.ai/harness/checks/latest.json`
5. Resume from the next recommended action
