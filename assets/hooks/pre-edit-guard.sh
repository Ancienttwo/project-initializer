#!/bin/bash
# Pre-Edit Guard — PreToolUse on Edit|Write
# Combines asset-layer warnings with TDD/BDD reminders.

set -eo pipefail
export LC_ALL=C

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"

FILE_PATH="$(hook_get_file_path "${1:-}")"
[[ -z "$FILE_PATH" ]] && exit 0

if echo "$FILE_PATH" | grep -qE "(^|/)(contracts|specs|tests)(/|$)|(\.contract\.|\.spec\.)"; then
  echo "[AssetLayer] Immutable file detected: $FILE_PATH"
  echo "  资产层文件被修改，需同步重写下游实现。"
fi

[[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py)$ ]] && exit 0

is_pure_barrel_file() {
  local file="$1"
  local saw_export="false"

  [[ -f "$file" ]] || return 1

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    line="${line#${line%%[![:space:]]*}}"
    line="${line%${line##*[![:space:]]}}"

    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^// ]] && continue
    [[ "$line" =~ ^/\* ]] && continue
    [[ "$line" =~ ^\* ]] && continue
    [[ "$line" =~ ^\*/$ ]] && continue

    if [[ "$line" =~ ^export([[:space:]]+type)?[[:space:]] ]]; then
      saw_export="true"
      continue
    fi

    return 1
  done < "$file"

  [[ "$saw_export" == "true" ]]
}

for p in "\.config\." "\.d\.ts$" "types\.ts$" "constants\." \
         "\.test\." "\.spec\." "__tests__" "__mocks__" "\.stories\."; do
  [[ "$FILE_PATH" =~ $p ]] && exit 0
done

if [[ "$FILE_PATH" =~ (^|/)index\.(ts|tsx|js|jsx)$ ]] && is_pure_barrel_file "$FILE_PATH"; then
  exit 0
fi

dir=$(dirname "$FILE_PATH")
name="${FILE_PATH##*/}"; name="${name%.*}"
ext="${FILE_PATH##*.}"

found=false
for candidate in \
  "${dir}/${name}.test.${ext}" \
  "${dir}/__tests__/${name}.test.${ext}" \
  "${dir/\/src\//\/tests\/}/${name}.test.${ext}"; do
  [[ -f "$candidate" ]] && found=true && break
done

if [[ "$found" == false ]]; then
  if [[ "$FILE_PATH" =~ \.(tsx|jsx)$ ]]; then
    echo "[BDD Guard] No scenario test found for $(basename "$FILE_PATH")"
    echo "  UI component detected: define Given-When-Then acceptance scenarios first."
  else
    echo "[TDD Guard] No test file found for $(basename "$FILE_PATH")"
    echo "  Reminder: write a failing test first, then implement."
  fi
fi
