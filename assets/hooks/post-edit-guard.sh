#!/bin/bash
# Post-Edit Guard — PostToolUse on Edit|Write
# Combines doc-drift reminders with task handoff generation.

set -euo pipefail
export LC_ALL=C

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/lib/workflow-state.sh"

run_skill_factory_activity() {
  if [[ ! -f "$SCRIPT_DIR/lib/skill-factory.sh" ]]; then
    return 0
  fi

  # Source lazily so older generated projects without Skill Factory still work,
  # and so both the early-return path and the task-handoff path share one hook.
  # shellcheck source=/dev/null
  . "$SCRIPT_DIR/lib/skill-factory.sh"
  sf_record_usage_activity "$FILE_PATH" || true
  if [[ "$FILE_PATH" == "tasks/lessons.md" ]]; then
    sf_read_new_lessons || true
  fi
}

FILE_PATH="$(hook_get_file_path "${1:-}")"
[[ -z "$FILE_PATH" ]] && exit 0

BASENAME=$(basename "$FILE_PATH")
DIRNAME=$(dirname "$FILE_PATH")

if [[ "$BASENAME" == "package.json" && "$DIRNAME" =~ (^|/)packages/([^/]+) ]]; then
  PKG_NAME="packages/${BASH_REMATCH[2]}"
  if [[ -n "$PKG_NAME" ]]; then
    echo "[DocDrift] $PKG_NAME/package.json changed"
    echo "  Check: docs/packages.md exports table may need updating"
  fi
fi

if [[ "$FILE_PATH" =~ (^|/)packages/([^/]+)/src/([^/]+)/index\.ts$ ]]; then
  PKG="${BASH_REMATCH[2]}"
  MODULE="${BASH_REMATCH[3]}"
  echo "[DocDrift] New module '$MODULE' in $PKG"
  echo "  Check: docs/packages.md and docs/architecture.md may need updating"
fi

if [[ "$FILE_PATH" =~ (^|/)apps/[^/]+/src/.+ ]]; then
  echo "[DocDrift] App source changed: $FILE_PATH"
  echo "  Check: docs/architecture.md source tree may need updating"
fi

if [[ "$BASENAME" == "metro.config.js" ]] || [[ "$BASENAME" == "metro.config.ts" ]]; then
  echo "[DocDrift] Metro config changed"
  echo "  Check: docs/guides/metro-esm-gotchas.md may need updating"
fi

if [[ "$BASENAME" == "tsconfig.json" && "$DIRNAME" =~ (^|/)(packages|apps)/ ]]; then
  echo "[DocDrift] TypeScript config changed in $(basename "$DIRNAME")"
  echo "  Check: docs/packages.md may need updating"
fi

if [[ "$BASENAME" == "turbo.json" ]]; then
  echo "[DocDrift] Turborepo config changed"
  echo "  Check: docs/architecture.md pipeline section may need updating"
fi

if [[ "$BASENAME" =~ ^wrangler.*\.toml$ ]]; then
  echo "[DocDrift] Wrangler config changed: $BASENAME"
  echo "  Check: docs/guides/cf-deployment.md bindings/routes may need updating"
fi

if [[ "$FILE_PATH" != "tasks/todo.md" ]] || [[ ! -f "tasks/todo.md" ]]; then
  run_skill_factory_activity
  exit 0
fi

mkdir -p .claude

STATE_FILE=".claude/.task-state.json"
HANDOFF_FILE=".claude/.task-handoff.md"

total_tasks="$(grep -E '^[[:space:]]*-[[:space:]]\[[ xX]\][[:space:]]+' tasks/todo.md | wc -l | tr -d ' ')"
done_tasks="$(grep -E '^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]+' tasks/todo.md | wc -l | tr -d ' ')"

prev_done=0
if [[ -f "$STATE_FILE" ]]; then
  if command -v jq >/dev/null 2>&1; then
    prev_done="$(jq -r '.done_tasks // 0' "$STATE_FILE" 2>/dev/null || echo 0)"
  else
    prev_done="$(grep -Eo '"done_tasks":[[:space:]]*[0-9]+' "$STATE_FILE" | grep -Eo '[0-9]+' | head -1)"
    prev_done="${prev_done:-0}"
  fi
fi

if [[ "$done_tasks" -le "$prev_done" ]]; then
  cat > "$STATE_FILE" <<EOF_STATE
{"done_tasks": $done_tasks, "total_tasks": $total_tasks}
EOF_STATE
  exit 0
fi

just_completed="$(
  grep -E '^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]+' tasks/todo.md \
    | sed -E 's/^[[:space:]]*-[[:space:]]\[[xX]\][[:space:]]+//' \
    | tail -1
)"
just_completed="${just_completed:-Task completed}"

remaining_tasks="$(
  grep -E '^[[:space:]]*-[[:space:]]\[[[:space:]]\][[:space:]]+' tasks/todo.md \
    | sed -E 's/^[[:space:]]*-[[:space:]]\[[[:space:]]\][[:space:]]+/- [ ] /'
)"

if [[ -z "$remaining_tasks" ]]; then
  remaining_tasks="- [ ] (none)"
fi

diff_stat="$(git diff --shortstat HEAD 2>/dev/null | tr -d '\n')"
diff_stat="${diff_stat:-no uncommitted diff against HEAD}"

active_plan="(none)"
parsed="$(find plans -maxdepth 1 -type f -name 'plan-*.md' 2>/dev/null | sort | tail -1)"
if [[ -n "$parsed" ]]; then
  active_plan="$parsed"
fi

cat > "$HANDOFF_FILE" <<EOF_HANDOFF
# Task Handoff Summary

> **Generated**: $(date '+%Y-%m-%d %H:%M:%S')
> **Progress**: ${done_tasks}/${total_tasks}
> **Active Plan**: ${active_plan}

## Just Completed

- ${just_completed}

## Remaining Tasks

${remaining_tasks}

## Working Tree Snapshot

- ${diff_stat}
EOF_HANDOFF

cat > "$STATE_FILE" <<EOF_STATE
{"done_tasks": $done_tasks, "total_tasks": $total_tasks}
EOF_STATE

echo "[TaskHandoff] Task completion advanced (${done_tasks}/${total_tasks}). Wrote ${HANDOFF_FILE}."

run_skill_factory_activity
