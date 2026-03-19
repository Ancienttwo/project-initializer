#!/bin/bash
# Post-Bash Hook — PostToolUse on Bash
# Reminds to rewrite (not patch) when tests fail.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"

TOOL_OUTPUT="${1:-${TOOL_OUTPUT:-}}"
EXIT_CODE="${2:-${EXIT_CODE:-}}"

if [[ -z "$TOOL_OUTPUT" ]]; then
  TOOL_OUTPUT="$(hook_json_get '.tool_output' '')"
fi
if [[ -z "$EXIT_CODE" ]]; then
  EXIT_CODE="$(hook_json_get '.exit_code' '')"
fi

if [[ "$EXIT_CODE" != "0" ]]; then
  if echo "$TOOL_OUTPUT" | grep -qEi "(FAIL|failed|error.*test)"; then
    echo "[PostBash] Tests failed. Reminder: failure = rewrite module, not patching."
  fi
fi
