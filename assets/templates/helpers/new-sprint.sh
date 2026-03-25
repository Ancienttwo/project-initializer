#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/new-sprint.sh --slug <slug> [--title <title>]
USAGE_EOF
}

slug=""
title=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug)
      slug="${2:-}"
      shift 2
      ;;
    --title)
      title="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

[[ -n "$slug" ]] || { echo "--slug is required" >&2; usage; exit 1; }
[[ -n "$title" ]] || title="$slug"

bash scripts/new-plan.sh --slug "$slug" --title "$title"
latest_plan="$(find plans -maxdepth 1 -type f -name "plan-*-$(printf '%s' "$slug" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-{2,}/-/g').md" | sort | tail -1)"

[[ -n "$latest_plan" ]] || { echo "Unable to resolve created plan" >&2; exit 1; }

mkdir -p tasks/contracts tasks/reviews .ai/harness/checks .ai/harness/handoff
timestamp="$(date '+%Y-%m-%d %H:%M')"

sed \
  -e "s/{{TASK_SLUG}}/${slug}/g" \
  -e "s|{{PLAN_FILE}}|${latest_plan}|g" \
  -e "s/{{OWNER}}/${USER:-AI Agent}/g" \
  -e "s/{{TIMESTAMP}}/${timestamp}/g" \
  .claude/templates/contract.template.md > "tasks/contracts/${slug}.contract.md"

sed \
  -e "s/{{TASK_SLUG}}/${slug}/g" \
  -e "s|{{PLAN_FILE}}|${latest_plan}|g" \
  -e "s|{{CONTRACT_FILE}}|tasks/contracts/${slug}.contract.md|g" \
  -e "s|{{CHECKS_FILE}}|.ai/harness/checks/latest.json|g" \
  -e "s/{{TIMESTAMP}}/${timestamp}/g" \
  .claude/templates/review.template.md > "tasks/reviews/${slug}.review.md"

echo "{}" > .ai/harness/checks/latest.json
bash scripts/plan-to-todo.sh --plan "$latest_plan"
echo "Created sprint artifacts for ${slug}"
