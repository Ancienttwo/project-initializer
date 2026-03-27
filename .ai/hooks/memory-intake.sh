#!/bin/bash
# Memory intake hook — SessionStart
# Reads Claude auto memory in read-only mode and caches a compact signal summary.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"

if [[ -f "$SCRIPT_DIR/lib/memory-state.sh" ]]; then
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/lib/memory-state.sh"
fi

if [[ -f "$SCRIPT_DIR/lib/skill-factory.sh" ]]; then
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/lib/skill-factory.sh"
fi

mkdir -p .claude

MEMORY_CONTEXT_FILE=".claude/.memory-context.json"
MEMORY_SNAPSHOT_FILE=".claude/.memory-snapshot.json"
TRANSCRIPT_PATH="$(hook_get_transcript_path "${1:-}")"
SESSION_SOURCE="$(hook_get_session_source "${1:-}")"

if ! declare -F memory_state_resolve_memory_dir >/dev/null 2>&1; then
  exit 0
fi

memory_dir="$(memory_state_resolve_memory_dir "$TRANSCRIPT_PATH" || true)"
if [[ -z "$memory_dir" || ! -d "$memory_dir" ]]; then
  exit 0
fi

snapshot_json="$(memory_state_scan_dir "$memory_dir" || true)"
if [[ -z "$snapshot_json" ]]; then
  exit 0
fi

delta_json="$(memory_state_compare_snapshots "$MEMORY_SNAPSHOT_FILE" "$snapshot_json" || true)"
if [[ -z "$delta_json" ]]; then
  delta_json='{"detected":false,"type":"unchanged","summary":"Auto memory unchanged since the previous snapshot."}'
fi

context_json="$(
  SNAPSHOT_JSON="$snapshot_json" \
  DELTA_JSON="$delta_json" \
  SESSION_SOURCE="$SESSION_SOURCE" \
  bun -e '
    const snapshot = JSON.parse(process.env.SNAPSHOT_JSON || "{}");
    const delta = JSON.parse(process.env.DELTA_JSON || "{}");
    const sessionSource = process.env.SESSION_SOURCE || "";
    const themes = (snapshot.themes || []).slice(0, 8);
    process.stdout.write(JSON.stringify({
      scanned_at: snapshot.scanned_at,
      session_source: sessionSource,
      memory_dir: snapshot.memory_dir,
      snapshot_hash: snapshot.snapshot_hash,
      file_count: snapshot.file_count,
      total_lines: snapshot.total_lines,
      themes,
      delta
    }));
  ' 2>/dev/null
)"

memory_state_write_file "$MEMORY_CONTEXT_FILE" "$context_json"
memory_state_write_file "$MEMORY_SNAPSHOT_FILE" "$snapshot_json"

if declare -F sf_record_memory_context >/dev/null 2>&1; then
  sf_record_memory_context "$context_json" || true
fi
