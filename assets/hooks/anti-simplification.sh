#!/bin/bash
# Anti-Simplification Guard — PostToolUse on Edit|Write
# Warns when changes suggest compatibility debt or unnecessary branch complexity.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"

FILE_PATH="$(hook_get_file_path "${1:-}")"
[[ -z "$FILE_PATH" ]] && exit 0

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

DIFF_CONTENT="$(git diff -- "$FILE_PATH" 2>/dev/null || true)"
[[ -z "$DIFF_CONTENT" ]] && exit 0

if echo "$DIFF_CONTENT" | grep -E '^\+.*(legacy|compat|backward|polyfill|shim)' >/dev/null; then
  echo "[AntiSimplification] Compatibility-like additions detected in $FILE_PATH"
  echo "  Prefer clean upgrades and rewrite-over-patch instead of legacy branches."
fi

branch_additions="$(echo "$DIFF_CONTENT" | grep -E '^\+.*\b(if|else if|switch)\b' | wc -l | tr -d ' ')"
if [[ "$branch_additions" -ge 4 ]]; then
  echo "[AntiSimplification] Branch-heavy additions detected in $FILE_PATH ($branch_additions new branch lines)"
  echo "  Re-check data structures before adding more control-flow branches."
fi
