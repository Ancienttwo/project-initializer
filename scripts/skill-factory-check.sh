#!/bin/bash
# Inspect Skill Factory state or mark a skill as used for the current session.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOK_LIB="$REPO_ROOT/.ai/hooks/lib/skill-factory.sh"

if [[ ! -f "$HOOK_LIB" ]]; then
  HOOK_LIB="$REPO_ROOT/.claude/hooks/lib/skill-factory.sh"
fi

if [[ ! -f "$HOOK_LIB" ]]; then
  HOOK_LIB="$REPO_ROOT/assets/hooks/lib/skill-factory.sh"
fi

if [[ ! -f "$HOOK_LIB" ]]; then
  echo "Skill Factory hook library not found." >&2
  exit 1
fi

# shellcheck source=/dev/null
. "$HOOK_LIB"

MARK_USED=""
MARK_TYPE="unknown"
RECORD_FEEDBACK=""
FEEDBACK_SIGNAL="manual-feedback"
FEEDBACK_FILE_PATH=""
SCORE_DELTA="1"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mark-used) MARK_USED="${2:-}"; shift 2 ;;
    --record-feedback) RECORD_FEEDBACK="${2:-}"; shift 2 ;;
    --signal) FEEDBACK_SIGNAL="${2:-}"; shift 2 ;;
    --file-path) FEEDBACK_FILE_PATH="${2:-}"; shift 2 ;;
    --score-delta) SCORE_DELTA="${2:-}"; shift 2 ;;
    --type) MARK_TYPE="${2:-}"; shift 2 ;;
    --help)
      echo "Usage: bash scripts/skill-factory-check.sh [--mark-used <slug> --type <workflow|knowledge>] [--record-feedback <slug> --signal <label> --file-path <path> --score-delta <n> --type <workflow|knowledge>]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

sf_ensure_state

if [[ -n "$MARK_USED" ]]; then
  sf_mark_skill_usage "$MARK_USED" "$MARK_TYPE" "skill-factory-check"
  echo "[SkillFactory] Marked skill usage for ${MARK_USED}"
  exit 0
fi

if [[ -n "$RECORD_FEEDBACK" ]]; then
  sf_record_feedback "$FEEDBACK_SIGNAL" "$FEEDBACK_FILE_PATH" "$SCORE_DELTA" "$RECORD_FEEDBACK" "$MARK_TYPE"
  echo "[SkillFactory] Recorded explicit feedback for ${RECORD_FEEDBACK}"
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to inspect Skill Factory state." >&2
  exit 1
fi

repo_root="${HOOK_REPO_ROOT:-$REPO_ROOT}"
pending_count="$(jq -r --arg repo_root "$repo_root" '[ (.proposals // [])[] | select(.repo_root == $repo_root and .status == "pending") ] | length' "$SF_PROPOSALS_FILE" 2>/dev/null || echo 0)"
workflow_keys="$(jq -r '.patterns.workflow | keys | join(", ")' "$SF_STATE_FILE" 2>/dev/null || true)"
knowledge_keys="$(jq -r '.patterns.knowledge | keys | join(", ")' "$SF_STATE_FILE" 2>/dev/null || true)"
hint_summary="$(jq -r '(.optimization_hints // []) | map(select((.feedback_count // 0) >= 1) | "\(.slug):\(.feedback_count)") | join(", ")' "$SF_STATE_FILE" 2>/dev/null || true)"

echo "[SkillFactory] State file: $SF_STATE_FILE"
echo "[SkillFactory] Pending proposals: ${pending_count}"
echo "[SkillFactory] Workflow patterns: ${workflow_keys:-none}"
echo "[SkillFactory] Knowledge patterns: ${knowledge_keys:-none}"
echo "[SkillFactory] Optimization hints: ${hint_summary:-none}"
