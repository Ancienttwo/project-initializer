#!/bin/bash
# Skill Factory session-end hook — Stop

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"

if [[ -f "$SCRIPT_DIR/lib/workflow-state.sh" ]]; then
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/lib/workflow-state.sh"
fi

if [[ -f "$SCRIPT_DIR/lib/memory-state.sh" ]]; then
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/lib/memory-state.sh"
fi

if [[ ! -f "$SCRIPT_DIR/lib/skill-factory.sh" ]]; then
  exit 0
fi

# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/skill-factory.sh"

sf_summarize_session || true
sf_detect_patterns || true
sf_prompt_feedback || true

if declare -F memory_state_resolve_memory_dir >/dev/null 2>&1; then
  transcript_path="$(hook_get_transcript_path "${1:-}")"
  memory_dir="$(memory_state_resolve_memory_dir "$transcript_path" || true)"
  if [[ -n "$memory_dir" && -d "$memory_dir" ]]; then
    snapshot_json="$(memory_state_scan_dir "$memory_dir" || true)"
    if [[ -n "$snapshot_json" ]]; then
      memory_state_write_file ".claude/.memory-snapshot.json" "$snapshot_json"
    fi
  fi
fi
