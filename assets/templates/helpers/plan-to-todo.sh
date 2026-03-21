#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/plan-to-todo.sh --plan <plan-file>
USAGE_EOF
}

# Source shared workflow-state library if available (installed via migration).
# This avoids duplicating task-state JSON generation logic.
_WF_LIB=".ai/hooks/lib/workflow-state.sh"
if [[ -f "$_WF_LIB" ]]; then
  # shellcheck source=/dev/null
  . "$_WF_LIB"
  _HAS_WF_LIB=1
else
  _HAS_WF_LIB=0
fi

# Fallback json_escape only when workflow-state.sh is not available
if [[ "$_HAS_WF_LIB" -eq 0 ]]; then
  workflow_json_escape() {
    local value="$1"
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    value="${value//$'\n'/\\n}"
    value="${value//$'\r'/\\r}"
    value="${value//$'\t'/\\t}"
    printf '%s' "$value"
  }
fi

extract_status() {
  local file="$1"
  awk '/\*\*Status\*\*:/ {sub(/^.*\*\*Status\*\*: */, ""); gsub(/\r/, ""); print; exit}' "$file" | xargs
}

set_plan_status() {
  local file="$1"
  local status="$2"
  local tmp_file
  tmp_file="$(mktemp)"
  awk -v next_status="$status" '
    BEGIN { updated = 0 }
    {
      if (!updated && $0 ~ /\*\*Status\*\*:/) {
        sub(/\*\*Status\*\*: .*/, "**Status**: " next_status)
        updated = 1
      }
      print
    }
  ' "$file" > "$tmp_file"
  mv "$tmp_file" "$file"
}

unique_archive_path() {
  local desired="$1"
  if [[ ! -e "$desired" ]]; then
    printf '%s' "$desired"
    return
  fi

  local stem counter candidate
  stem="${desired%.md}"
  counter=2
  candidate="${stem}-v${counter}.md"
  while [[ -e "$candidate" ]]; do
    counter=$((counter + 1))
    candidate="${stem}-v${counter}.md"
  done
  printf '%s' "$candidate"
}

render_contract_file() {
  local plan_file="$1"
  local contract_file="$2"
  local slug="$3"
  local timestamp="$4"
  local owner="${USER:-AI Agent}"
  local template_file=".claude/templates/contract.template.md"
  local tmp_file

  if [[ ! -f "$template_file" ]]; then
    mkdir -p .claude/templates
    cat > "$template_file" <<'CONTRACT_TEMPLATE_EOF'
# Task Contract: {{TASK_SLUG}}

> **Status**: Pending
> **Plan**: {{PLAN_FILE}}
> **Owner**: {{OWNER}}
> **Last Updated**: {{TIMESTAMP}}

## Goal

Describe the exact outcome this task must deliver.

## Exit Criteria (Machine Verifiable)

```yaml
exit_criteria:
  files_exist:
    - src/modules/{{TASK_SLUG}}/index.ts
  tests_pass:
    - path: tests/unit/{{TASK_SLUG}}.test.ts
  commands_succeed:
    - bun run typecheck
  files_contain:
    - path: src/modules/{{TASK_SLUG}}/index.ts
      pattern: "export"
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Optional Visual Checks

- Screenshot path (optional):
- What to verify visually:
CONTRACT_TEMPLATE_EOF
  fi

  tmp_file="$(mktemp)"
  sed \
    -e "s/{{TASK_SLUG}}/${slug}/g" \
    -e "s|{{PLAN_FILE}}|${plan_file}|g" \
    -e "s/{{OWNER}}/${owner}/g" \
    -e "s/{{TIMESTAMP}}/${timestamp}/g" \
    "$template_file" > "$tmp_file"
  mv "$tmp_file" "$contract_file"
}

# Delegate to workflow-state.sh if available; inline fallback otherwise.
# This ensures a single source of truth for task-state JSON generation.
if [[ "$_HAS_WF_LIB" -eq 0 ]]; then
  workflow_sync_task_state_from_todo() {
    local todo_file="${1:-tasks/todo.md}"
    local state_file="${2:-.claude/.task-state.json}"
    local source_plan="${3:-}"
    local timestamp
    local tmp_state
    local total=0
    local done=0
    local promoted_in_progress=0
    local first=1

    mkdir -p "$(dirname "$state_file")"
    timestamp="$(date '+%Y-%m-%dT%H:%M:%S%z')"

    {
      echo "{"
      printf '  "done_tasks": 0,\n'
      printf '  "total_tasks": 0,\n'
      printf '  "source_plan": "%s",\n' "$(workflow_json_escape "${source_plan:-}")"
      printf '  "updated_at": "%s",\n' "$(workflow_json_escape "$timestamp")"
      echo '  "tasks": ['

      while IFS= read -r line; do
        printf '%s\n' "$line" | grep -Eq '^[[:space:]]*-[[:space:]]\[[ xX]\][[:space:]]+' || continue
        total=$((total + 1))
        local desc
        desc="$(printf '%s' "$line" | sed -E 's/^[[:space:]]*-[[:space:]]\[[ xX]\][[:space:]]+//')"
        local status="pending"
        local passes="false"

        if [[ "$line" =~ \[[xX]\] ]]; then
          status="completed"
          passes="true"
          done=$((done + 1))
        elif [[ "$promoted_in_progress" -eq 0 ]]; then
          status="in_progress"
          promoted_in_progress=1
        fi

        if [[ "$first" -eq 0 ]]; then
          echo ","
        fi
        first=0

        printf '    {"id":"task-%s","desc":"%s","status":"%s","passes":%s,"verification_evidence":[]}' \
          "$total" \
          "$(workflow_json_escape "$desc")" \
          "$status" \
          "$passes"
      done < "$todo_file"

      echo
      echo "  ]"
      echo "}"
    } > "$state_file"

    tmp_state="$(mktemp)"
    awk -v done="$done" -v total="$total" '
      {
        if ($0 ~ /"done_tasks":/) {
          printf "  \"done_tasks\": %s,\n", done
        } else if ($0 ~ /"total_tasks":/) {
          printf "  \"total_tasks\": %s,\n", total
        } else {
          print
        }
      }
    ' "$state_file" > "$tmp_state"
    mv "$tmp_state" "$state_file"
  }
fi

plan_file=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --plan)
      [[ -n "${2:-}" ]] || { echo "Error: --plan requires a value" >&2; usage; exit 1; }
      plan_file="$2"
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

if [[ -z "$plan_file" ]]; then
  echo "--plan is required" >&2
  usage
  exit 1
fi

if [[ ! -f "$plan_file" ]]; then
  echo "Plan file not found: $plan_file" >&2
  exit 1
fi

status="$(extract_status "$plan_file")"
if [[ "$status" != "Approved" ]]; then
  echo "Plan status must be Approved before extraction (current: ${status:-unknown})." >&2
  exit 1
fi

mkdir -p tasks/archive
mkdir -p tasks/contracts
mkdir -p .claude

timestamp="$(date +%Y%m%d-%H%M)"
timestamp_human="$(date '+%Y-%m-%d %H:%M')"
plan_base="$(basename "$plan_file")"
slug="$(echo "$plan_base" | sed -E 's/^plan-[0-9]{8}-[0-9]{4}-//; s/\.md$//')"
contract_file="tasks/contracts/${slug}.contract.md"

if [[ -f "tasks/todo.md" ]] && grep -q '[^[:space:]]' tasks/todo.md; then
  archive_file="$(unique_archive_path "tasks/archive/todo-${timestamp}-${slug}.md")"
  {
    echo "> **Archived**: $(date '+%Y-%m-%d %H:%M')"
    echo "> **Related Plan**: ${plan_file}"
    echo "> **Outcome**: Superseded"
    echo
    cat tasks/todo.md
  } > "$archive_file"
fi

tasks_tmp="$(mktemp)"
awk '
  BEGIN { in_section = 0 }
  /^## Task Breakdown/ { in_section = 1; next }
  in_section && /^## / { exit }
  in_section { print }
' "$plan_file" > "$tasks_tmp"

if ! grep -Eq '^- \[[ xX]\]' "$tasks_tmp"; then
  cat > "$tasks_tmp" <<'DEFAULT_TASKS_EOF'
- [ ] Confirm task breakdown details
- [ ] Implement approved plan incrementally
DEFAULT_TASKS_EOF
fi

{
  echo "# Task Execution Checklist (Primary)"
  echo
  echo "> **Source Plan**: ${plan_file}"
  echo "> **Status**: Executing"
  echo "> **Generated**: ${timestamp_human}"
  echo
  echo "## Execution"
  cat "$tasks_tmp"
  echo
  echo "## Review Section"
  echo "- Verification evidence:"
  echo "- Behavior diff notes:"
  echo "- Risks / follow-ups:"
} > tasks/todo.md

workflow_sync_task_state_from_todo "tasks/todo.md" ".claude/.task-state.json" "$plan_file"

render_contract_file "$plan_file" "$contract_file" "$slug" "$timestamp_human"

rm -f "$tasks_tmp"
set_plan_status "$plan_file" "Executing"

echo "Updated tasks/todo.md from $plan_file"
