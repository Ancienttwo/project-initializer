#!/bin/bash
# Shared session-id and tool-call count helpers.

session_state_new_session_id() {
  if command -v uuidgen >/dev/null 2>&1; then
    uuidgen
    return
  fi

  printf 'session-%s-%s' "$(date +%Y%m%d%H%M%S)" "$RANDOM"
}

session_state_resolve_key() {
  local session_id_file="$1"
  local session_key="${CLAUDE_SESSION_ID:-${CODEX_SESSION_ID:-${SESSION_KEY:-}}}"

  if [[ -z "$session_key" ]] && [[ -s "$session_id_file" ]]; then
    session_key="$(cat "$session_id_file" 2>/dev/null || true)"
  fi

  if [[ -z "$session_key" ]]; then
    session_key="$(session_state_new_session_id)"
    echo "$session_key" > "$session_id_file"
  fi

  printf '%s' "$session_key"
}

session_state_safe_key() {
  local key="$1"
  echo "$key" | tr -c 'A-Za-z0-9._-' '_'
}

session_state_read_count() {
  local count_file="$1"
  local count=0

  if [[ -f "$count_file" ]]; then
    count="$(cat "$count_file" 2>/dev/null || echo 0)"
  fi

  if ! [[ "$count" =~ ^[0-9]+$ ]]; then
    count=0
  fi

  printf '%s' "$count"
}
