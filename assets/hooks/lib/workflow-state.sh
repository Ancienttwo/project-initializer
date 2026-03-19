#!/bin/bash
# Shared workflow state helpers for plan/todo/contract-aware hooks.

WORKFLOW_CHANGED_PATHS=""
WORKFLOW_CHANGED_PATHS_READY=0

is_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

load_changed_paths() {
  if [[ "$WORKFLOW_CHANGED_PATHS_READY" -eq 1 ]]; then
    return
  fi

  WORKFLOW_CHANGED_PATHS_READY=1
  if ! is_git_repo; then
    return
  fi

  WORKFLOW_CHANGED_PATHS="$(
    git status --porcelain=v1 --untracked-files=no 2>/dev/null \
      | awk '{
          path = substr($0, 4)
          rename_idx = index(path, " -> ")
          if (rename_idx > 0) {
            path = substr(path, rename_idx + 4)
          }
          print path
        }'
  )"
}

has_changes() {
  local file="$1"

  load_changed_paths

  if [[ -n "$WORKFLOW_CHANGED_PATHS" ]] && printf '%s\n' "$WORKFLOW_CHANGED_PATHS" | grep -Fxq -- "$file"; then
    return 0
  fi
  return 1
}

has_changes_glob() {
  local pattern="$1"
  local changed

  load_changed_paths

  changed="$(printf '%s\n' "$WORKFLOW_CHANGED_PATHS" | grep -E "$pattern" | head -1)"

  if [[ -n "$changed" ]]; then
    printf '%s' "$changed"
    return 0
  fi
  return 1
}

get_latest_plan() {
  local latest
  latest="$(find plans -maxdepth 1 -type f -name 'plan-*.md' 2>/dev/null | sort | tail -1)"
  if [[ -n "$latest" ]]; then
    printf '%s' "$latest"
    return 0
  fi
  return 1
}

get_active_plan() {
  get_latest_plan
}

get_plan_status() {
  local plan_file="$1"
  awk '/\*\*Status\*\*:/ {sub(/^.*\*\*Status\*\*: */, ""); gsub(/\r/, ""); print; exit}' "$plan_file" | xargs
}

get_todo_source_plan() {
  if [[ ! -f "tasks/todo.md" ]]; then
    return 1
  fi

  awk -F': ' '/^\> \*\*Source Plan\*\*:/ {print $2; exit}' tasks/todo.md | xargs
}

derive_contract_path() {
  local plan_file="$1"
  local base slug

  base="$(basename "$plan_file")"
  slug="$(printf '%s' "$base" | sed -E 's/^plan-[0-9]{8}-[0-9]{4}-//; s/\.md$//')"

  if [[ -z "$slug" ]] || [[ "$slug" == "$base" ]]; then
    return 1
  fi

  printf 'tasks/contracts/%s.contract.md' "$slug"
}

workflow_plan_slug() {
  local active_plan slug
  active_plan="$(get_active_plan || true)"
  if [[ -z "$active_plan" ]]; then
    return 1
  fi

  slug="$(basename "$active_plan" | sed -E 's/^plan-[0-9]{8}-[0-9]{4}-//; s/\.md$//')"
  if [[ -n "$slug" ]]; then
    printf '%s' "$slug"
    return 0
  fi
  return 1
}

workflow_todo_total() {
  if [[ ! -f "tasks/todo.md" ]]; then
    printf '0'
    return
  fi

  grep -E '^[[:space:]]*-[[:space:]]\[[ xX]\][[:space:]]+' tasks/todo.md | wc -l | tr -d ' '
}

workflow_todo_done() {
  if [[ ! -f "tasks/todo.md" ]]; then
    printf '0'
    return
  fi

  grep -E '^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]+' tasks/todo.md | wc -l | tr -d ' '
}
