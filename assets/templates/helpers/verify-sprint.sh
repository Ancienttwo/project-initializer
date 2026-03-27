#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

if [[ -f ".ai/hooks/lib/workflow-state.sh" ]]; then
  # shellcheck source=/dev/null
  . ".ai/hooks/lib/workflow-state.sh"
  contract_file="$(workflow_active_contract || true)"
  review_file="$(workflow_active_review || true)"
else
  contract_file=""
  review_file=""
fi

[[ -n "$contract_file" && -f "$contract_file" ]] || { echo "No active sprint contract found" >&2; exit 1; }

bash scripts/verify-contract.sh --contract "$contract_file" --strict --report-file .ai/harness/checks/latest.json

if [[ -z "$review_file" || ! -f "$review_file" ]]; then
  echo "Missing sprint review file" >&2
  exit 1
fi

grep -Eq '^> \*\*Recommendation\*\*:[[:space:]]*pass([[:space:]]*)$' "$review_file" || {
  echo "Sprint review does not recommend pass" >&2
  exit 1
}

echo "Sprint verification passed"
