#!/bin/bash
# Shared workflow state helpers for plan/todo/contract-aware hooks.

WORKFLOW_CHANGED_PATHS=""
WORKFLOW_CHANGED_PATHS_READY=0

workflow_strip_quotes() {
  local value="$1"
  value="$(printf '%s' "$value" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  if [[ "$value" =~ ^\".*\"$ ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" =~ ^\'.*\'$ ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

workflow_json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

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

workflow_task_state_file() {
  printf '.claude/.task-state.json'
}

workflow_read_state_field() {
  local state_file="$1"
  local field="$2"
  local value=""

  if [[ ! -f "$state_file" ]]; then
    return 1
  fi

  if command -v jq >/dev/null 2>&1; then
    value="$(jq -r ".$field // empty" "$state_file" 2>/dev/null || true)"
  else
    value="$(
      awk -v field="$field" '
        $0 ~ "\"" field "\"" {
          line = $0
          sub(/^[^:]*:[[:space:]]*/, "", line)
          sub(/[[:space:]]*,?[[:space:]]*$/, "", line)
          gsub(/^"/, "", line)
          gsub(/"$/, "", line)
          print line
          exit
        }
      ' "$state_file"
    )"
  fi

  [[ -n "$value" ]] || return 1
  printf '%s' "$value"
}

workflow_iterate_todo_tasks() {
  local todo_file="${1:-tasks/todo.md}"
  [[ -f "$todo_file" ]] || return 0

  awk '
    BEGIN { task_index = 0 }
    /^[[:space:]]*-[[:space:]]\[[ xX]\][[:space:]]+/ {
      task_index += 1
      status = ($0 ~ /\[[xX]\]/) ? "completed" : "pending"
      desc = $0
      sub(/^[[:space:]]*-[[:space:]]\[[ xX]\][[:space:]]+/, "", desc)
      gsub(/\r/, "", desc)
      print task_index "\t" status "\t" desc
    }
  ' "$todo_file"
}

workflow_sync_task_state_from_todo() {
  local todo_file="${1:-tasks/todo.md}"
  local state_file="${2:-.claude/.task-state.json}"
  local source_plan="${3:-}"
  local timestamp
  local tmp_state
  local total=0
  local done=0
  local promoted_in_progress=0
  local idx status desc next_status passes first=1

  if [[ -z "$source_plan" ]]; then
    source_plan="$(get_todo_source_plan || true)"
  fi

  mkdir -p "$(dirname "$state_file")"
  timestamp="$(date '+%Y-%m-%dT%H:%M:%S%z')"

  {
    echo "{"
    printf '  "done_tasks": 0,\n'
    printf '  "total_tasks": 0,\n'
    printf '  "source_plan": "%s",\n' "$(workflow_json_escape "${source_plan:-}")"
    printf '  "updated_at": "%s",\n' "$(workflow_json_escape "$timestamp")"
    echo '  "tasks": ['

    while IFS=$'\t' read -r idx status desc; do
      [[ -n "$idx" ]] || continue
      total=$((total + 1))
      next_status="$status"
      if [[ "$status" == "completed" ]]; then
        done=$((done + 1))
      elif [[ "$promoted_in_progress" -eq 0 ]]; then
        next_status="in_progress"
        promoted_in_progress=1
      fi

      if [[ "$next_status" == "completed" ]]; then
        passes="true"
      else
        passes="false"
      fi

      if [[ "$first" -eq 0 ]]; then
        echo ","
      fi
      first=0

      printf '    {"id":"task-%s","desc":"%s","status":"%s","passes":%s,"verification_evidence":[]}' \
        "$idx" \
        "$(workflow_json_escape "$desc")" \
        "$next_status" \
        "$passes"
    done < <(workflow_iterate_todo_tasks "$todo_file")

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

workflow_read_file_mtime() {
  local file="$1"
  [[ -e "$file" ]] || return 1

  if stat -f '%m' "$file" >/dev/null 2>&1; then
    stat -f '%m' "$file"
    return 0
  fi

  stat -c '%Y' "$file"
}

has_research_for_new_plan() {
  local research_file="tasks/research.md"
  local latest_plan research_mtime plan_mtime

  [[ -f "$research_file" ]] || return 1

  latest_plan="$(get_latest_plan || true)"
  if [[ -z "$latest_plan" ]]; then
    return 0
  fi

  research_mtime="$(workflow_read_file_mtime "$research_file" || true)"
  plan_mtime="$(workflow_read_file_mtime "$latest_plan" || true)"

  [[ -n "$research_mtime" && -n "$plan_mtime" && "$research_mtime" -gt "$plan_mtime" ]]
}

workflow_extract_status_from_text() {
  local text="${1:-}"
  printf '%s' "$text" | awk '/\*\*Status\*\*:/ {sub(/^.*\*\*Status\*\*: */, ""); gsub(/\r/, ""); print; exit}' | xargs
}

workflow_plan_note_count_in_text() {
  local text="${1:-}"
  printf '%s\n' "$text" | grep -c '\[NOTE\]:' || true
}

workflow_plan_note_count() {
  local plan_file="$1"
  [[ -f "$plan_file" ]] || { printf '0'; return; }
  grep -c '\[NOTE\]:' "$plan_file" || true
}

validate_plan_transition() {
  local current_status="$1"
  local next_status="$2"
  local note_count="$3"

  case "${current_status}:${next_status}" in
    Draft:Annotating)
      if [[ "$note_count" -lt 1 ]]; then
        echo "Draft -> Annotating requires at least one [NOTE]: annotation."
        return 1
      fi
      ;;
    Annotating:Approved)
      if [[ "$note_count" -gt 0 ]]; then
        echo "Annotating -> Approved requires all [NOTE]: annotations to be resolved."
        return 1
      fi
      ;;
    Draft:Approved|Draft:Executing|Annotating:Executing)
      echo "Status jump ${current_status} -> ${next_status} skips required workflow gates."
      return 1
      ;;
    Approved:Draft|Approved:Annotating|Executing:Draft|Executing:Annotating|Executing:Approved)
      echo "Backward transition ${current_status} -> ${next_status} is not allowed."
      return 1
      ;;
  esac

  return 0
}

read_contract_status() {
  local file="$1"
  awk '/^\> \*\*Status\*\*:/ {sub(/^.*\> \*\*Status\*\*: */, ""); gsub(/\r/, ""); print; exit}' "$file" | xargs
}

contract_references_path() {
  local contract_file="$1"
  local file_path="$2"
  local yaml_block section pending_path trimmed item

  [[ -f "$contract_file" ]] || return 1
  [[ "$file_path" == "$contract_file" ]] && return 0

  yaml_block="$(
    awk '
      BEGIN { in_block = 0; printed = 0 }
      /^```yaml[[:space:]]*$/ && printed == 0 { in_block = 1; next }
      /^```[[:space:]]*$/ && in_block == 1 { printed = 1; in_block = 0; exit }
      in_block == 1 { print }
    ' "$contract_file"
  )"

  section=""
  pending_path=""

  while IFS= read -r line; do
    trimmed="$(printf '%s' "$line" | sed -E 's/[[:space:]]+$//; s/^[[:space:]]+//')"
    [[ -z "$trimmed" ]] && continue

    case "$trimmed" in
      files_exist:|tests_pass:|files_contain:|files_not_exist:|files_not_contain:)
        section="${trimmed%:}"
        pending_path=""
        continue
        ;;
    esac

    case "$section" in
      files_exist|files_not_exist)
        if [[ "$trimmed" =~ ^-[[:space:]]*(.+)$ ]]; then
          item="$(workflow_strip_quotes "${BASH_REMATCH[1]}")"
          [[ "$item" == "$file_path" ]] && return 0
        fi
        ;;
      tests_pass|files_contain|files_not_contain)
        if [[ "$trimmed" =~ ^-[[:space:]]*path:[[:space:]]*(.+)$ ]]; then
          pending_path="$(workflow_strip_quotes "${BASH_REMATCH[1]}")"
          [[ "$pending_path" == "$file_path" ]] && return 0
        elif [[ "$trimmed" =~ ^path:[[:space:]]*(.+)$ ]]; then
          pending_path="$(workflow_strip_quotes "${BASH_REMATCH[1]}")"
          [[ "$pending_path" == "$file_path" ]] && return 0
        fi
        ;;
    esac
  done <<< "$yaml_block"

  return 1
}
