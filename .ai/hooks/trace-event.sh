#!/bin/bash
# Trace Event Hook — lightweight JSONL tracing for PostToolUse.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/session-state.sh"

mkdir -p .claude

TRACE_FILE=".claude/.trace.jsonl"
SESSION_ID_FILE=".claude/.session-id"

event_type="$(hook_json_get '.hook_event_name' 'PostToolUse')"
tool_name="$(hook_get_tool_name "${1:-}")"
file_path="$(hook_get_file_path "${1:-}")"
exit_code="$(hook_get_exit_code "${1:-}")"
duration_ms="$(hook_get_duration_ms "${1:-}")"
session_key="$(session_state_resolve_key "$SESSION_ID_FILE")"

tool_name="${tool_name:-unknown}"
file_path="${file_path:-}"
exit_code="${exit_code:-0}"
duration_ms="${duration_ms:-0}"

# Rotate trace log when it exceeds MAX_TRACE_LINES
MAX_TRACE_LINES=10000
KEEP_TRACE_LINES=5000
if [[ -f "$TRACE_FILE" ]]; then
  line_count="$(wc -l < "$TRACE_FILE" | tr -d ' ')"
  if [[ "$line_count" -gt "$MAX_TRACE_LINES" ]]; then
    tmp_trace="$(mktemp)"
    tail -n "$KEEP_TRACE_LINES" "$TRACE_FILE" > "$tmp_trace"
    mv "$tmp_trace" "$TRACE_FILE"
  fi
fi

printf '{"ts":"%s","event_type":"%s","tool_name":"%s","file_path":"%s","exit_code":%s,"duration_ms":%s,"session_key":"%s"}\n' \
  "$(hook_json_escape "$(date '+%Y-%m-%dT%H:%M:%S%z')")" \
  "$(hook_json_escape "$event_type")" \
  "$(hook_json_escape "$tool_name")" \
  "$(hook_json_escape "$file_path")" \
  "$exit_code" \
  "$duration_ms" \
  "$(hook_json_escape "$session_key")" \
  >> "$TRACE_FILE"
