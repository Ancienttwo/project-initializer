#!/bin/bash
# Post-Bash Hook — PostToolUse on Bash
# Reminds to rewrite (not patch) when tests fail.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/workflow-state.sh"

TOOL_OUTPUT="${1:-${TOOL_OUTPUT:-}}"
EXIT_CODE="${2:-${EXIT_CODE:-}}"
COMMAND_TEXT="$(hook_json_get '.tool_input.command' '')"

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

checks_file="$(workflow_checks_file)"
mkdir -p "$(dirname "$checks_file")"
cat > "$checks_file" <<EOF_CHECKS
{
  "source": "post-bash",
  "command": "$(printf '%s' "$COMMAND_TEXT" | sed 's/"/\\"/g')",
  "exit_code": ${EXIT_CODE:-0},
  "status": "$([[ "${EXIT_CODE:-0}" = "0" ]] && echo pass || echo fail)",
  "generated_at": "$(date '+%Y-%m-%dT%H:%M:%S%z')"
}
EOF_CHECKS

echo "[ChecksFile] Updated ${checks_file}."
