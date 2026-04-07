#!/bin/bash
# Context Pressure Hook — PostToolUse (all tools)
# Tracks tool call count as a context proxy.
# Uses stable session-id files to avoid cross-session accumulation.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/session-state.sh"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/workflow-state.sh"

COUNTER_DIR=".claude/.context-pressure"
SESSION_ID_FILE=".claude/.session-id"
mkdir -p "$COUNTER_DIR"
SESSION_KEY="$(session_state_resolve_key "$SESSION_ID_FILE")"
SESSION_SAFE_KEY="$(session_state_safe_key "$SESSION_KEY")"
COUNT_FILE="$COUNTER_DIR/${SESSION_SAFE_KEY}.count"
WARN_FILE="$COUNTER_DIR/${SESSION_SAFE_KEY}.warned"
RED_FILE="$COUNTER_DIR/${SESSION_SAFE_KEY}.red"
COUNT="$(session_state_read_count "$COUNT_FILE")"
COUNT=$((COUNT + 1))

echo "$COUNT" > "$COUNT_FILE"
echo "$COUNT" > ".claude/.tool-call-count"

if [[ "$COUNT" -ge 30 && ! -f "$WARN_FILE" ]]; then
  echo "[ContextMonitor] Yellow zone (~30 tool calls). Finish current subtask, then /compact."
  touch "$WARN_FILE"
fi

if [[ "$COUNT" -ge 50 && ! -f "$RED_FILE" ]]; then
  echo "[ContextMonitor] Red zone (~50 tool calls). STOP and refresh the harness handoff now."
  workflow_write_handoff "context-red-zone"

  touch "$RED_FILE"
fi
