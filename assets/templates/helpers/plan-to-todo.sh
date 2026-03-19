#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/plan-to-todo.sh --plan <plan-file>
USAGE_EOF
}

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

render_contract_file "$plan_file" "$contract_file" "$slug" "$timestamp_human"

rm -f "$tasks_tmp"
set_plan_status "$plan_file" "Executing"

echo "Updated tasks/todo.md from $plan_file"
