#!/bin/bash
# Worktree Guard — PreToolUse on Edit|Write
# Default behavior: warn in primary tree.
# Enforced behavior: block when .claude/.require-worktree exists.

set -u

# Resolve repo root — hooks may run from any cwd
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${HOOK_REPO_ROOT:-}"
if [ -z "$REPO_ROOT" ]; then
  REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true
fi
if [ -z "$REPO_ROOT" ]; then
  REPO_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || true
fi
if [ -n "$REPO_ROOT" ]; then
  cd "$REPO_ROOT" 2>/dev/null || true
fi

REQUIRE_MARKER=".claude/.require-worktree"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[WorktreeGuard] Not a git repository. Skip worktree policy check."
  exit 0
fi

GIT_DIR="$(git rev-parse --git-dir 2>/dev/null || true)"
if [[ "$GIT_DIR" == *".git/worktrees/"* ]]; then
  exit 0
fi

if [[ -f "$REQUIRE_MARKER" ]]; then
  echo "[WorktreeGuard] Mutation blocked: primary working tree detected ($GIT_DIR)."
  echo "  Enforcement marker found: $REQUIRE_MARKER"
  echo "  Use a linked worktree for write operations."
  echo "  Example: git worktree add ../<repo>-wt-<branch> -b <branch>"
  exit 1
fi

echo "[WorktreeGuard] Warning: primary working tree detected ($GIT_DIR)."
echo "  To enforce linked worktrees, create $REQUIRE_MARKER"
exit 0
