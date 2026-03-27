#!/bin/bash
# Convert Skill Factory rubric JSON into autoresearch binary eval format.

set -euo pipefail

RUBRIC_FILE="${1:-}"

if [[ -z "$RUBRIC_FILE" ]]; then
  echo "Usage: bash assets/skill-factory/rubric-to-eval.sh <rubric.json>" >&2
  exit 1
fi

if [[ ! -f "$RUBRIC_FILE" ]]; then
  echo "Rubric file not found: $RUBRIC_FILE" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to convert rubric JSON." >&2
  exit 1
fi

jq -r '
  .questions
  | to_entries
  | map(
      "EVAL \(.key + 1): \(.value.name // .value.id // ("Question " + ((.key + 1)|tostring)))\n" +
      "Question: \(.value.question)\n" +
      "Pass condition: \(.value.pass)\n" +
      "Fail condition: \(.value.fail)\n"
    )
  | join("\n")
' "$RUBRIC_FILE"
