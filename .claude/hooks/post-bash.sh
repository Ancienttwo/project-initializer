#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${HOOK_REPO_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
TARGET="$REPO_ROOT/.ai/hooks/post-bash.sh"

if [[ ! -f "$TARGET" ]]; then
  echo "[HookShim] Shared hook not found: $TARGET" >&2
  exit 1
fi

export HOOK_REPO_ROOT="$REPO_ROOT"
exec bash "$TARGET" "$@"
