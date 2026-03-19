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

if [[ ! -f "$SCRIPT_DIR/lib/skill-factory.sh" ]]; then
  exit 0
fi

# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/skill-factory.sh"

sf_summarize_session || true
sf_detect_patterns || true
sf_prompt_feedback || true
