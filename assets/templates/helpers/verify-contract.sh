#!/bin/bash
set -euo pipefail

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/verify-contract.sh --contract <contract-file> [--strict]

Options:
  --contract <path>  Contract markdown file with a YAML exit_criteria block
  --strict           Exit with code 1 when any criteria fail
USAGE_EOF
}

strip_quotes() {
  local value="$1"
  value="$(printf '%s' "$value" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
  if [[ "$value" =~ ^\".*\"$ ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" =~ ^\'.*\'$ ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

update_contract_status() {
  local file="$1"
  local status="$2"
  local tmp_file
  tmp_file="$(mktemp)"

  awk -v next_status="$status" '
    BEGIN { updated = 0 }
    {
      if (!updated && $0 ~ /^\> \*\*Status\*\*:/) {
        print "> **Status**: " next_status
        updated = 1
        next
      }
      print
    }
    END {
      if (!updated) {
        print ""
        print "> **Status**: " next_status
      }
    }
  ' "$file" > "$tmp_file"

  mv "$tmp_file" "$file"
}

contract_file=""
strict=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --contract)
      [[ -n "${2:-}" ]] || { echo "Error: --contract requires a value" >&2; usage; exit 2; }
      contract_file="$2"
      shift 2
      ;;
    --strict)
      strict=1
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

if [[ -z "$contract_file" ]]; then
  echo "Error: --contract is required" >&2
  usage
  exit 2
fi

if [[ ! -f "$contract_file" ]]; then
  echo "[ContractVerify] Contract file not found: $contract_file" >&2
  exit 2
fi

yaml_block="$(
  awk '
    BEGIN { in_block = 0; printed = 0 }
    /^```yaml[[:space:]]*$/ && printed == 0 { in_block = 1; next }
    /^```[[:space:]]*$/ && in_block == 1 { printed = 1; in_block = 0; exit }
    in_block == 1 { print }
  ' "$contract_file"
)"

if [[ -z "$yaml_block" ]]; then
  echo "[ContractVerify] No YAML exit criteria block found in $contract_file"
  update_contract_status "$contract_file" "Pending"
  if [[ "$strict" -eq 1 ]]; then
    exit 1
  fi
  exit 0
fi

declare -a files_exist=()
declare -a tests_pass=()
declare -a commands_succeed=()
declare -a contain_paths=()
declare -a contain_patterns=()

section=""
pending_path=""

while IFS= read -r raw_line; do
  line="$(printf '%s' "$raw_line" | sed -E 's/[[:space:]]+$//')"
  trimmed="$(printf '%s' "$line" | sed -E 's/^[[:space:]]+//')"

  [[ -z "$trimmed" ]] && continue
  [[ "$trimmed" =~ ^# ]] && continue
  [[ "$trimmed" == "exit_criteria:" ]] && continue

  case "$trimmed" in
    files_exist:)
      section="files_exist"
      pending_path=""
      continue
      ;;
    tests_pass:)
      section="tests_pass"
      pending_path=""
      continue
      ;;
    commands_succeed:)
      section="commands_succeed"
      pending_path=""
      continue
      ;;
    files_contain:)
      section="files_contain"
      pending_path=""
      continue
      ;;
  esac

  case "$section" in
    files_exist|commands_succeed)
      if [[ "$trimmed" =~ ^-[[:space:]]*(.+)$ ]]; then
        item="$(strip_quotes "${BASH_REMATCH[1]}")"
        [[ -n "$item" ]] || continue
        if [[ "$section" == "files_exist" ]]; then
          files_exist+=("$item")
        else
          commands_succeed+=("$item")
        fi
      fi
      ;;
    tests_pass)
      if [[ "$trimmed" =~ ^-[[:space:]]*path:[[:space:]]*(.+)$ ]]; then
        item="$(strip_quotes "${BASH_REMATCH[1]}")"
        [[ -n "$item" ]] && tests_pass+=("$item")
      fi
      ;;
    files_contain)
      if [[ "$trimmed" =~ ^-[[:space:]]*path:[[:space:]]*(.+)$ ]]; then
        pending_path="$(strip_quotes "${BASH_REMATCH[1]}")"
      elif [[ "$trimmed" =~ ^pattern:[[:space:]]*(.+)$ ]]; then
        pattern="$(strip_quotes "${BASH_REMATCH[1]}")"
        if [[ -n "$pending_path" ]]; then
          contain_paths+=("$pending_path")
          contain_patterns+=("$pattern")
          pending_path=""
        fi
      fi
      ;;
  esac
done <<< "$yaml_block"

total=0
failed=0

pass() {
  local msg="$1"
  total=$((total + 1))
  echo "[PASS] $msg"
}

fail() {
  local msg="$1"
  total=$((total + 1))
  failed=$((failed + 1))
  echo "[FAIL] $msg"
}

for path in "${files_exist[@]}"; do
  if [[ -e "$path" ]]; then
    pass "files_exist: $path"
  else
    fail "files_exist: $path"
  fi
done

for path in "${tests_pass[@]}"; do
  if [[ ! -f "$path" ]]; then
    fail "tests_pass file missing: $path"
    continue
  fi

  if ! command -v bun >/dev/null 2>&1; then
    fail "tests_pass cannot run (bun not found): $path"
    continue
  fi

  if bun test "$path" >/tmp/contract-test.log 2>&1; then
    pass "tests_pass: $path"
  else
    fail "tests_pass: $path"
  fi
done

for cmd in "${commands_succeed[@]}"; do
  if bash -lc "$cmd" >/tmp/contract-command.log 2>&1; then
    pass "commands_succeed: $cmd"
  else
    fail "commands_succeed: $cmd"
  fi
done

for idx in "${!contain_paths[@]}"; do
  path="${contain_paths[$idx]}"
  pattern="${contain_patterns[$idx]}"

  if [[ ! -f "$path" ]]; then
    fail "files_contain missing file: $path"
    continue
  fi

  if grep -Eq "$pattern" "$path"; then
    pass "files_contain: $path =~ $pattern"
  else
    fail "files_contain: $path !~ $pattern"
  fi
done

next_status="Fulfilled"
if [[ "$total" -eq 0 ]]; then
  next_status="Pending"
elif [[ "$failed" -gt 0 ]]; then
  next_status="Partial"
fi

update_contract_status "$contract_file" "$next_status"

echo "[ContractVerify] total=$total failed=$failed status=$next_status"

if [[ "$strict" -eq 1 && "$failed" -gt 0 ]]; then
  exit 1
fi

