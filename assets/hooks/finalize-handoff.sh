#!/bin/bash
# Finalize Handoff Hook — Stop
# Always refreshes the repo-local handoff artifact before the session ends.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/workflow-state.sh"

workflow_write_handoff "session-stop"
echo "[FinalizeHandoff] Refreshed $(workflow_handoff_file)."
