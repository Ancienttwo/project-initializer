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

  parsed="$(hook_json_get '.tool_input.file_path' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  if [[ -n "${CLAUDE_FILE_PATH:-}" ]]; then
    printf '%s' "$CLAUDE_FILE_PATH"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.tool_input.file_path')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "$arg"
}

hook_get_prompt() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.user_message' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  if [[ -n "${PROMPT:-}" ]]; then
    printf '%s' "$PROMPT"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.user_message')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "$arg"
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

hook_structured_error() {
  local guard="$1"
  local reason="$2"
  local fix="$3"
  local action="${4:-block}"

  printf '{"guard":"%s","action":"%s","reason":"%s","fix":"%s"}\n' \
    "$(hook_json_escape "$guard")" \
    "$(hook_json_escape "$action")" \
    "$(hook_json_escape "$reason")" \
    "$(hook_json_escape "$fix")"
}

# Cache stdin eagerly in the parent shell so multiple getters can reuse it.
hook_read_stdin_once
