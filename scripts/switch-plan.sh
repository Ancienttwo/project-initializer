#!/bin/bash
# Switch between concurrent plans in a single worktree.
# Saves/restores tasks/todo.md and .claude/.task-state.json per plan.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/switch-plan.sh --plan <plan-file>
       scripts/switch-plan.sh --list

Options:
  --plan <path>   Switch to the specified plan (saves current state, restores target)
  --list          List all non-archived plans with active marker
USAGE_EOF
}

extract_status() {
  local file="$1"
  awk '/\*\*Status\*\*:/ {sub(/^.*\*\*Status\*\*: */, ""); gsub(/\r/, ""); print; exit}' "$file" | xargs
}

get_active_plan() {
  if [[ -f ".claude/.active-plan" ]]; then
    local marker_plan
    marker_plan="$(cat ".claude/.active-plan" 2>/dev/null | xargs)"
    if [[ -n "$marker_plan" && -f "$marker_plan" ]]; then
      printf '%s' "$marker_plan"
      return 0
    fi
  fi
  local latest
  latest="$(find plans -maxdepth 1 -type f -name 'plan-*.md' 2>/dev/null | sort | tail -1)"
  if [[ -n "$latest" ]]; then
    printf '%s' "$latest"
    return 0
  fi
  return 1
}

plan_state_key() {
  basename "$1" .md
}

STATE_DIR=".claude/.plan-state"

save_plan_state() {
  local plan_file="$1"
  local key
  key="$(plan_state_key "$plan_file")"
  mkdir -p "$STATE_DIR"

  if [[ -f "tasks/todo.md" ]]; then
    cp "tasks/todo.md" "$STATE_DIR/${key}.todo.md.bak"
  fi
  if [[ -f ".claude/.task-state.json" ]]; then
    cp ".claude/.task-state.json" "$STATE_DIR/${key}.task-state.json.bak"
  fi
  if [[ -f ".claude/.task-handoff.md" ]]; then
    cp ".claude/.task-handoff.md" "$STATE_DIR/${key}.task-handoff.md.bak"
  fi
}

restore_plan_state() {
  local plan_file="$1"
  local key
  key="$(plan_state_key "$plan_file")"

  if [[ -f "$STATE_DIR/${key}.todo.md.bak" ]]; then
    cp "$STATE_DIR/${key}.todo.md.bak" "tasks/todo.md"
    if [[ -f "$STATE_DIR/${key}.task-state.json.bak" ]]; then
      cp "$STATE_DIR/${key}.task-state.json.bak" ".claude/.task-state.json"
    fi
    if [[ -f "$STATE_DIR/${key}.task-handoff.md.bak" ]]; then
      cp "$STATE_DIR/${key}.task-handoff.md.bak" ".claude/.task-handoff.md"
    fi
    echo "[PlanSwitch] Restored saved state for $(basename "$plan_file")"
    return 0
  fi
  return 1
}

reset_todo_idle() {
  local plan_file="$1"
  local status="$2"
  local parent_run_id
  parent_run_id="${HOOK_RUN_ID:-${CLAUDE_RUN_ID:-${CODEX_RUN_ID:-run-$(date '+%Y%m%d-%H%M%S')}}}"
  mkdir -p tasks
  cat > tasks/todo.md <<TODO_EOF
# Task Execution Checklist (Primary)

> **Source Plan**: ${plan_file}
> **Status**: Idle
> **Parent Run ID**: ${parent_run_id}
> **Supersedes**: ${plan_file}

Switched to ${plan_file} (status: ${status}). Plan not yet approved for execution.

## Execution
- [ ] No active execution checklist
TODO_EOF
}

do_list() {
  local active
  active="$(get_active_plan || true)"

  if [[ ! -d "plans" ]]; then
    echo "No plans/ directory found."
    return
  fi

  local found=0
  while IFS= read -r plan; do
    [[ -n "$plan" ]] || continue
    found=1
    local status marker
    status="$(extract_status "$plan")"
    status="${status:-(unknown)}"
    if [[ "$plan" == "$active" ]]; then
      marker="[*]"
    else
      marker="   "
    fi
    printf '%s %s  Status: %s\n' "$marker" "$plan" "$status"
  done < <(find plans -maxdepth 1 -type f -name 'plan-*.md' 2>/dev/null | sort)

  if [[ "$found" -eq 0 ]]; then
    echo "No plans found in plans/"
  fi
}

do_switch() {
  local target_plan="$1"

  if [[ ! -f "$target_plan" ]]; then
    echo "Error: plan file not found: $target_plan" >&2
    exit 1
  fi

  local current_plan
  current_plan="$(get_active_plan || true)"

  if [[ "$current_plan" == "$target_plan" ]]; then
    echo "[PlanSwitch] Already on $target_plan"
    return 0
  fi

  # Save current plan state
  if [[ -n "$current_plan" && -f "$current_plan" ]]; then
    save_plan_state "$current_plan"
    echo "[PlanSwitch] Saved state for $(basename "$current_plan")"
  fi

  # Set new active plan
  mkdir -p .claude
  printf '%s' "$target_plan" > ".claude/.active-plan"

  # Restore target plan state
  if restore_plan_state "$target_plan"; then
    return 0
  fi

  # No saved state — decide based on plan status
  local target_status
  target_status="$(extract_status "$target_plan")"
  target_status="${target_status:-(unknown)}"

  case "$target_status" in
    Approved)
      if [[ -f "scripts/plan-to-todo.sh" ]]; then
        echo "[PlanSwitch] Running plan-to-todo.sh for approved plan..."
        bash "scripts/plan-to-todo.sh" --plan "$target_plan"
      else
        reset_todo_idle "$target_plan" "$target_status"
        echo "[PlanSwitch] Switched to $target_plan (Approved, run plan-to-todo.sh manually)"
      fi
      ;;
    Draft|Annotating)
      reset_todo_idle "$target_plan" "$target_status"
      echo "[PlanSwitch] Switched to $target_plan (status: $target_status, todo idle)"
      ;;
    *)
      reset_todo_idle "$target_plan" "$target_status"
      echo "[PlanSwitch] Switched to $target_plan (status: $target_status)"
      ;;
  esac
}

# --- Main ---
target_plan=""
mode=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --plan)
      [[ -n "${2:-}" ]] || { echo "Error: --plan requires a value" >&2; usage; exit 2; }
      target_plan="$2"
      mode="switch"
      shift 2
      ;;
    --list)
      mode="list"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

case "$mode" in
  list)
    do_list
    ;;
  switch)
    do_switch "$target_plan"
    ;;
  *)
    usage
    exit 2
    ;;
esac
