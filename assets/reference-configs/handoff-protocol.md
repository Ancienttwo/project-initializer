# Handoff Protocol

Handoffs make long-running work resumable without trusting chat history.

## When Handoff Is Required

- Verification fails and the work is not resolved in-session
- The active sprint changes
- The session is ending
- The user or agent needs a durable checkpoint before switching sessions or worktrees

## Required Sections

- Goal
- Decisions
- Files touched
- Commands run
- Checks
- Blockers
- Exact next step
- Resume prompt
- Source artifacts

## Restore Flow

1. Start a fresh Codex session instead of relying on auto-compact or `codex resume` when the old session is near the limit.
2. If the current user message lists files under `# Files mentioned by the user`, references `pasted-text.txt`, or includes an explicit attachment/file path, read those current-input files before repo recovery artifacts.
3. Read source artifacts first: active plan, active contract, review file, latest checks trace, and any user-mentioned files.
4. Read `.ai/harness/handoff/resume.md`.
5. Read `.ai/harness/handoff/current.md`.
6. Read `tasks/current.md` as a local orientation snapshot only; it is ignored local state, so an absent or stale file is normal.
7. Resume from the exact next step.

## Source Of Truth

- Markdown, JSON, and JSONL files remain the canonical handoff surface.
- SQLite, Codex thread state, and chat history are read models only.
- `tasks/current.md` is an ignored local read model. It helps worktree orientation, but stale or surprising state must be checked against plans, workstreams, handoff, and checks.
