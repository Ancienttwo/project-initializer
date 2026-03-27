#!/bin/bash
set -euo pipefail

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/verify-contract.sh --contract <contract-file> [--strict] [--quiet] [--report-file <path>]

Options:
  --contract <path>     Contract markdown file with a YAML exit_criteria block
  --strict              Exit with code 1 when any criteria fail
  --quiet               Suppress per-check logs; only print on failure or status change
  --report-file <path>  Write structured JSON results for downstream tooling
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

json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '%s' "$value"
}

resolve_bun_bin() {
  if [[ -n "${BUN_BIN:-}" ]] && [[ -x "${BUN_BIN}" ]]; then
    printf '%s' "$BUN_BIN"
    return 0
  fi

  if command -v bun >/dev/null 2>&1; then
    command -v bun
    return 0
  fi

  if [[ -x "${HOME}/.bun/bin/bun" ]]; then
    printf '%s' "${HOME}/.bun/bin/bun"
    return 0
  fi

  return 1
}

read_contract_status() {
  local file="$1"
  awk '/^\> \*\*Status\*\*:/ {sub(/^.*\> \*\*Status\*\*: */, ""); gsub(/\r/, ""); print; exit}' "$file" | xargs
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

append_result() {
  local kind="$1"
  local target="$2"
  local passed="$3"
  local message="$4"
  RESULT_KINDS+=("$kind")
  RESULT_TARGETS+=("$target")
  RESULT_PASSED+=("$passed")
  RESULT_MESSAGES+=("$message")
}

log_check() {
  local prefix="$1"
  local message="$2"

  if [[ "$quiet" -eq 1 ]]; then
    return
  fi

  echo "[$prefix] $message"
}

pass() {
  local kind="$1"
  local target="$2"
  local message="$3"
  total=$((total + 1))
  append_result "$kind" "$target" "true" "$message"
  log_check "PASS" "$message"
}

fail() {
  local kind="$1"
  local target="$2"
  local message="$3"
  total=$((total + 1))
  failed=$((failed + 1))
  append_result "$kind" "$target" "false" "$message"
  log_check "FAIL" "$message"
}

write_report() {
  local report_path="$1"
  local idx

  [[ -n "$report_path" ]] || return 0

  mkdir -p "$(dirname "$report_path")"

  {
    echo "{"
    printf '  "contract": "%s",\n' "$(json_escape "$contract_file")"
    printf '  "previous_status": "%s",\n' "$(json_escape "$previous_status")"
    printf '  "next_status": "%s",\n' "$(json_escape "$next_status")"
    printf '  "quiet": %s,\n' "$([[ "$quiet" -eq 1 ]] && echo true || echo false)"
    printf '  "strict": %s,\n' "$([[ "$strict" -eq 1 ]] && echo true || echo false)"
    printf '  "total": %s,\n' "$total"
    printf '  "failed": %s,\n' "$failed"
    echo '  "results": ['
    for idx in "${!RESULT_KINDS[@]}"; do
      if [[ "$idx" -gt 0 ]]; then
        echo ","
      fi
      printf '    {"kind":"%s","target":"%s","passed":%s,"message":"%s"}' \
        "$(json_escape "${RESULT_KINDS[$idx]}")" \
        "$(json_escape "${RESULT_TARGETS[$idx]}")" \
        "${RESULT_PASSED[$idx]}" \
        "$(json_escape "${RESULT_MESSAGES[$idx]}")"
    done
    echo
    echo "  ]"
    echo "}"
  } > "$report_path"
}

contract_file=""
strict=0
quiet=0
report_file=""

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
    --quiet)
      quiet=1
      shift
      ;;
    --report-file)
      [[ -n "${2:-}" ]] || { echo "Error: --report-file requires a value" >&2; usage; exit 2; }
      report_file="$2"
      shift 2
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

trap 'rm -f /tmp/contract-test.log /tmp/contract-command.log' EXIT

if [[ ! -f "$contract_file" ]]; then
  echo "[ContractVerify] Contract file not found: $contract_file" >&2
  exit 2
fi

previous_status="$(read_contract_status "$contract_file")"
previous_status="${previous_status:-Pending}"

yaml_block="$(
  awk '
    BEGIN { in_block = 0; block = ""; found = 0 }
    /^```yaml[[:space:]]*$/ {
      in_block = 1
      block = ""
      next
    }
    /^```[[:space:]]*$/ && in_block == 1 {
      if (block ~ /(^|[[:space:]])exit_criteria:/) {
        printf "%s", block
        found = 1
        exit
      }
      in_block = 0
      block = ""
      next
    }
    in_block == 1 {
      block = block $0 ORS
    }
  ' "$contract_file"
)"

if [[ -z "$yaml_block" ]]; then
  next_status="Pending"
  update_contract_status "$contract_file" "$next_status"
  total=0
  failed=0
  RESULT_KINDS=()
  RESULT_TARGETS=()
  RESULT_PASSED=()
  RESULT_MESSAGES=()
  write_report "$report_file"
  if [[ "$quiet" -eq 0 ]]; then
    echo "[ContractVerify] No YAML exit criteria block found in $contract_file"
  elif [[ "$previous_status" != "$next_status" ]]; then
    echo "[ContractVerify] status ${previous_status} -> ${next_status}"
  fi
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
declare -a files_not_exist=()
declare -a not_contain_paths=()
declare -a not_contain_patterns=()

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
    files_not_exist:)
      section="files_not_exist"
      pending_path=""
      continue
      ;;
    files_not_contain:)
      section="files_not_contain"
      pending_path=""
      continue
      ;;
  esac

  case "$section" in
    files_exist|commands_succeed|files_not_exist)
      if [[ "$trimmed" =~ ^-[[:space:]]*(.+)$ ]]; then
        item="$(strip_quotes "${BASH_REMATCH[1]}")"
        [[ -n "$item" ]] || continue
        if [[ "$section" == "files_exist" ]]; then
          files_exist+=("$item")
        elif [[ "$section" == "commands_succeed" ]]; then
          commands_succeed+=("$item")
        else
          files_not_exist+=("$item")
        fi
      fi
      ;;
    tests_pass)
      if [[ "$trimmed" =~ ^-[[:space:]]*path:[[:space:]]*(.+)$ ]]; then
        item="$(strip_quotes "${BASH_REMATCH[1]}")"
        [[ -n "$item" ]] && tests_pass+=("$item")
      fi
      ;;
    files_contain|files_not_contain)
      if [[ "$trimmed" =~ ^-[[:space:]]*path:[[:space:]]*(.+)$ ]]; then
        pending_path="$(strip_quotes "${BASH_REMATCH[1]}")"
      elif [[ "$trimmed" =~ ^pattern:[[:space:]]*(.+)$ ]]; then
        pattern="$(strip_quotes "${BASH_REMATCH[1]}")"
        if [[ -n "$pending_path" ]]; then
          if [[ "$section" == "files_contain" ]]; then
            contain_paths+=("$pending_path")
            contain_patterns+=("$pattern")
          else
            not_contain_paths+=("$pending_path")
            not_contain_patterns+=("$pattern")
          fi
          pending_path=""
        fi
      fi
      ;;
  esac
done <<< "$yaml_block"

total=0
failed=0
RESULT_KINDS=()
RESULT_TARGETS=()
RESULT_PASSED=()
RESULT_MESSAGES=()

if ((${#files_exist[@]})); then
  for path in "${files_exist[@]}"; do
    if [[ -e "$path" ]]; then
      pass "files_exist" "$path" "files_exist: $path"
    else
      fail "files_exist" "$path" "files_exist: $path"
    fi
  done
fi

if ((${#tests_pass[@]})); then
  for path in "${tests_pass[@]}"; do
    if [[ ! -f "$path" ]]; then
      fail "tests_pass" "$path" "tests_pass file missing: $path"
      continue
    fi

    bun_bin="$(resolve_bun_bin || true)"
    if [[ -z "$bun_bin" ]]; then
      fail "tests_pass" "$path" "tests_pass cannot run (bun not found): $path"
      continue
    fi

    if "$bun_bin" test "$path" >/tmp/contract-test.log 2>&1; then
      pass "tests_pass" "$path" "tests_pass: $path"
    else
      fail "tests_pass" "$path" "tests_pass: $path"
    fi
  done
fi

if ((${#commands_succeed[@]})); then
  for cmd in "${commands_succeed[@]}"; do
    if bash -lc "$cmd" >/tmp/contract-command.log 2>&1; then
      pass "commands_succeed" "$cmd" "commands_succeed: $cmd"
    else
      fail "commands_succeed" "$cmd" "commands_succeed: $cmd"
    fi
  done
fi

if ((${#contain_paths[@]})); then
  for idx in "${!contain_paths[@]}"; do
    path="${contain_paths[$idx]}"
    pattern="${contain_patterns[$idx]}"

    if [[ ! -f "$path" ]]; then
      fail "files_contain" "$path" "files_contain missing file: $path"
      continue
    fi

    if grep -Eq "$pattern" "$path"; then
      pass "files_contain" "$path" "files_contain: $path =~ $pattern"
    else
      fail "files_contain" "$path" "files_contain: $path !~ $pattern"
    fi
  done
fi

if ((${#files_not_exist[@]})); then
  for path in "${files_not_exist[@]}"; do
    if [[ ! -e "$path" ]]; then
      pass "files_not_exist" "$path" "files_not_exist: $path"
    else
      fail "files_not_exist" "$path" "files_not_exist: $path"
    fi
  done
fi

if ((${#not_contain_paths[@]})); then
  for idx in "${!not_contain_paths[@]}"; do
    path="${not_contain_paths[$idx]}"
    pattern="${not_contain_patterns[$idx]}"

    if [[ ! -f "$path" ]]; then
      pass "files_not_contain" "$path" "files_not_contain missing file: $path"
      continue
    fi

    if grep -Eq "$pattern" "$path"; then
      fail "files_not_contain" "$path" "files_not_contain: $path =~ $pattern"
    else
      pass "files_not_contain" "$path" "files_not_contain: $path !~ $pattern"
    fi
  done
fi

next_status="Fulfilled"
if [[ "$total" -eq 0 ]]; then
  next_status="Pending"
elif [[ "$failed" -gt 0 ]]; then
  next_status="Partial"
fi

update_contract_status "$contract_file" "$next_status"
write_report "$report_file"

if [[ "$quiet" -eq 1 ]]; then
  if [[ "$failed" -gt 0 || "$previous_status" != "$next_status" ]]; then
    echo "[ContractVerify] total=$total failed=$failed status=${previous_status}->${next_status}"
  fi
else
  echo "[ContractVerify] total=$total failed=$failed status=$next_status"
fi

if [[ "$strict" -eq 1 && "$failed" -gt 0 ]]; then
  exit 1
fi
