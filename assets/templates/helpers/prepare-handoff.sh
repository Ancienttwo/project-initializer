#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

if [[ -f ".ai/hooks/lib/workflow-state.sh" ]]; then
  # shellcheck source=/dev/null
  . ".ai/hooks/lib/workflow-state.sh"
  workflow_write_handoff "${1:-manual}" 
  echo "Updated $(workflow_handoff_file)"
  exit 0
fi

mkdir -p .ai/harness/handoff
cat > .ai/harness/handoff/current.md <<EOF_HANDOFF
# Harness Handoff

> **Generated**: $(date '+%Y-%m-%d %H:%M:%S')
> **Reason**: ${1:-manual}
EOF_HANDOFF
echo "Updated .ai/harness/handoff/current.md"
