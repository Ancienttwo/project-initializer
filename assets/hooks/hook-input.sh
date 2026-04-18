#!/bin/bash
# Shared input parsing helpers for hook scripts.
# Prefers stdin JSON, with env/argv fallbacks for compatibility.

# Resolve repo root — hooks may run from any cwd
if [[ -z "${HOOK_REPO_ROOT:-}" ]]; then
  HOOK_REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true
  if [[ -z "$HOOK_REPO_ROOT" ]]; then
    HOOK_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." 2>/dev/null && pwd)" || true
  fi
  if [[ -n "$HOOK_REPO_ROOT" ]]; then
    cd "$HOOK_REPO_ROOT" 2>/dev/null || true
  fi
  export HOOK_REPO_ROOT
fi

if [[ -f "${HOOK_REPO_ROOT:-$(pwd)}/.ai/hooks/lib/workflow-state.sh" ]]; then
  # shellcheck source=/dev/null
  . "${HOOK_REPO_ROOT:-$(pwd)}/.ai/hooks/lib/workflow-state.sh"
fi

hook_read_stdin_once() {
  if [[ -n "${HOOK_STDIN_JSON+x}" ]]; then
    return
  fi

  if [[ -t 0 ]]; then
    HOOK_STDIN_JSON=""
    return
  fi

  HOOK_STDIN_JSON="$(cat 2>/dev/null || true)"
}

hook_json_extract_with_bun() {
  local json_input="$1"
  local path="$2"

  command -v bun >/dev/null 2>&1 || return 1

  JSON_INPUT="$json_input" JSON_PATH="$path" bun -e '
    const raw = process.env.JSON_INPUT ?? "";
    const path = (process.env.JSON_PATH ?? "").split(".").filter(Boolean);
    if (!raw) process.exit(1);

    let value = JSON.parse(raw);
    for (const key of path) {
      if (value == null || !(key in value)) process.exit(1);
      value = value[key];
    }

    if (value == null) process.exit(1);
    if (typeof value === "object") {
      process.stdout.write(JSON.stringify(value));
    } else {
      process.stdout.write(String(value));
    }
  ' 2>/dev/null
}

hook_json_get() {
  local path="$1"
  local default_value="${2:-}"
  local parsed=""

  hook_read_stdin_once

  if [[ -n "$HOOK_STDIN_JSON" ]] && command -v jq >/dev/null 2>&1; then
    parsed="$(printf '%s' "$HOOK_STDIN_JSON" | jq -r "$path // empty" 2>/dev/null || true)"
  fi

  if [[ -z "$parsed" && -n "$HOOK_STDIN_JSON" ]]; then
    parsed="$(hook_json_extract_with_bun "$HOOK_STDIN_JSON" "$path" || true)"
  fi

  if [[ -z "$parsed" && -n "$HOOK_STDIN_JSON" ]]; then
    echo "[HookInput] WARN: JSON parse failed for path: $path (neither jq nor bun succeeded)" >&2
  fi

  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
  else
    printf '%s' "$default_value"
  fi
}

hook_json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

hook_sanitize_token() {
  local value="$1"
  value="$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')"
  value="$(printf '%s' "$value" | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-{2,}/-/g')"
  printf '%s' "${value:-unknown}"
}

hook_parse_json_arg() {
  local raw_arg="${1:-}"
  local path="$2"

  if [[ -z "$raw_arg" ]]; then
    return
  fi

  if command -v jq >/dev/null 2>&1 && printf '%s' "$raw_arg" | jq -e . >/dev/null 2>&1; then
    printf '%s' "$raw_arg" | jq -r "$path // empty" 2>/dev/null || true
    return
  fi

  hook_json_extract_with_bun "$raw_arg" "$path" || true
}

hook_get_file_path() {
  local arg="${1:-}"
  local parsed=""

  for path in '.file_path' '.tool_input.file_path' '.trigger_file_path' '.parent_file_path'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi

    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
  done

  if [[ -n "${CLAUDE_FILE_PATH:-}" ]]; then
    printf '%s' "$CLAUDE_FILE_PATH"
    return
  fi

  printf '%s' "$arg"
}

hook_get_prompt() {
  local arg="${1:-}"
  local parsed=""

  if [[ -n "${PROMPT:-}" ]]; then
    printf '%s' "$PROMPT"
    return
  fi

  for path in '.prompt' '.user_message'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi

    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
  done

  printf '%s' "$arg"
}

hook_get_session_id() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.session_id' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.session_id')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${CLAUDE_SESSION_ID:-${CODEX_SESSION_ID:-}}"
}

hook_get_transcript_path() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.transcript_path' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.transcript_path')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${CLAUDE_TRANSCRIPT_PATH:-}"
}

hook_get_cwd() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.cwd' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.cwd')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${HOOK_REPO_ROOT:-$(pwd)}"
}

hook_get_session_source() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.source' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.source')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${CLAUDE_SESSION_SOURCE:-}"
}

hook_get_memory_type() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.memory_type' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.memory_type')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${CLAUDE_MEMORY_TYPE:-}"
}

hook_get_load_reason() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.load_reason' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.load_reason')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${CLAUDE_LOAD_REASON:-}"
}

hook_get_write_payload() {
  local arg="${1:-}"
  local parsed=""

  for path in '.tool_input.content' '.tool_input.new_string' '.tool_input.text'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
  done
}

hook_get_tool_name() {
  local arg="${1:-}"
  local parsed=""

  for path in '.tool_name' '.hook_event_name'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
  done

  printf '%s' "${HOOK_TOOL_NAME:-}"
}

hook_get_duration_ms() {
  local arg="${1:-}"
  local parsed=""

  for path in '.duration_ms' '.tool_response.duration_ms'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
  done

  printf '%s' "${HOOK_DURATION_MS:-0}"
}

hook_get_exit_code() {
  local arg="${1:-}"
  local parsed=""

  for path in '.tool_response.exit_code' '.exit_code'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      printf '%s' "$parsed"
      return
    fi
  done

  printf '%s' "${EXIT_CODE:-0}"
}

hook_get_run_id() {
  local arg="${1:-}"
  local parsed=""
  local session_id=""
  local session_source=""
  local transcript_path=""

  if [[ -n "${HOOK_RUN_ID:-}" ]]; then
    printf '%s' "$HOOK_RUN_ID"
    return
  fi

  for path in '.run_id' '.tool_input.run_id'; do
    parsed="$(hook_json_get "$path" '')"
    if [[ -n "$parsed" ]]; then
      HOOK_RUN_ID="$parsed"
      export HOOK_RUN_ID
      printf '%s' "$parsed"
      return
    fi

    parsed="$(hook_parse_json_arg "$arg" "$path")"
    if [[ -n "$parsed" ]]; then
      HOOK_RUN_ID="$parsed"
      export HOOK_RUN_ID
      printf '%s' "$parsed"
      return
    fi
  done

  if [[ -n "${CLAUDE_RUN_ID:-${CODEX_RUN_ID:-}}" ]]; then
    HOOK_RUN_ID="${CLAUDE_RUN_ID:-${CODEX_RUN_ID:-}}"
    export HOOK_RUN_ID
    printf '%s' "$HOOK_RUN_ID"
    return
  fi

  session_id="$(hook_get_session_id "$arg")"
  if [[ -n "$session_id" ]]; then
    session_source="$(hook_get_session_source "$arg")"
    HOOK_RUN_ID="run-$(hook_sanitize_token "${session_source:-session}")-$(hook_sanitize_token "$session_id")"
    export HOOK_RUN_ID
    printf '%s' "$HOOK_RUN_ID"
    return
  fi

  transcript_path="$(hook_get_transcript_path "$arg")"
  if [[ -n "$transcript_path" ]]; then
    HOOK_RUN_ID="run-transcript-$(hook_sanitize_token "$transcript_path")"
    export HOOK_RUN_ID
    printf '%s' "$HOOK_RUN_ID"
    return
  fi

  HOOK_RUN_ID="run-$(date '+%Y%m%dT%H%M%S')-$$"
  export HOOK_RUN_ID
  printf '%s' "$HOOK_RUN_ID"
}

hook_failure_log_file() {
  if declare -F workflow_failure_log_file >/dev/null 2>&1; then
    workflow_failure_log_file
    return 0
  fi
  printf '.ai/harness/failures/latest.jsonl'
}

hook_append_failure_record() {
  local guard="$1"
  local action="$2"
  local reason="$3"
  local fix="$4"
  local failure_class="$5"
  local run_id="$6"
  local log_file

  log_file="$(hook_failure_log_file)"
  mkdir -p "$(dirname "$log_file")"

  printf '{"ts":"%s","guard":"%s","action":"%s","reason":"%s","fix":"%s","failure_class":"%s","run_id":"%s"}\n' \
    "$(hook_json_escape "$(date '+%Y-%m-%dT%H:%M:%S%z')")" \
    "$(hook_json_escape "$guard")" \
    "$(hook_json_escape "$action")" \
    "$(hook_json_escape "$reason")" \
    "$(hook_json_escape "$fix")" \
    "$(hook_json_escape "$failure_class")" \
    "$(hook_json_escape "$run_id")" \
    >> "$log_file"
}

hook_structured_error() {
  local guard="$1"
  local reason="$2"
  local fix="$3"
  local failure_class="${4:-state_violation}"
  local action="${5:-block}"
  local run_id=""

  # Older guards passed the action token as arg 4 before failure_class existed.
  # Keep translating those shimmed calls so generated hooks and self-hosted hooks
  # preserve behavior while defaulting the missing failure_class sanely.
  case "$failure_class" in
    block|warn|advisory)
      action="$failure_class"
      failure_class="state_violation"
      ;;
    missing_artifact|state_violation|contract_failure|quality_gate)
      ;;
    *)
      failure_class="state_violation"
      ;;
  esac

  run_id="$(hook_get_run_id)"
  hook_append_failure_record "$guard" "$action" "$reason" "$fix" "$failure_class" "$run_id"

  printf '{"guard":"%s","action":"%s","reason":"%s","fix":"%s","failure_class":"%s","run_id":"%s"}\n' \
    "$(hook_json_escape "$guard")" \
    "$(hook_json_escape "$action")" \
    "$(hook_json_escape "$reason")" \
    "$(hook_json_escape "$fix")" \
    "$(hook_json_escape "$failure_class")" \
    "$(hook_json_escape "$run_id")"
}

# Cache stdin eagerly in the parent shell so multiple getters can reuse it.
hook_read_stdin_once
