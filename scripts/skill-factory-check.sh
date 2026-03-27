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

if ! sf_require_jq; then
  echo "jq is required to inspect Skill Factory state." >&2
  exit 1
fi

repo_root="${HOOK_REPO_ROOT:-$REPO_ROOT}"
pending_count="$(sf_jq -r --arg repo_root "$repo_root" '[ (.proposals // [])[] | select(.repo_root == $repo_root and .status == "pending") ] | length' "$SF_PROPOSALS_FILE" 2>/dev/null || echo 0)"
workflow_keys="$(sf_jq -r '.patterns.workflow | keys | join(", ")' "$SF_STATE_FILE" 2>/dev/null || true)"
knowledge_keys="$(sf_jq -r '.patterns.knowledge | keys | join(", ")' "$SF_STATE_FILE" 2>/dev/null || true)"
hint_summary="$(sf_jq -r '(.optimization_hints // []) | map(select((.feedback_count // 0) >= 1) | "\(.slug):\(.feedback_count)") | join(", ")' "$SF_STATE_FILE" 2>/dev/null || true)"

echo "[SkillFactory] State file: $SF_STATE_FILE"
echo "[SkillFactory] Pending proposals: ${pending_count}"
echo "[SkillFactory] Workflow patterns: ${workflow_keys:-none}"
echo "[SkillFactory] Knowledge patterns: ${knowledge_keys:-none}"
echo "[SkillFactory] Optimization hints: ${hint_summary:-none}"

while IFS= read -r workflow_key; do
  [[ -z "$workflow_key" ]] && continue
  evidence_line="$(sf_compute_evidence_score "$workflow_key")"
  pattern_count="${evidence_line%%$'\t'*}"
  correction_count="${evidence_line#*$'\t'}"
  correction_count="${correction_count%%$'\t'*}"
  evidence_score="${evidence_line##*$'\t'}"
  readiness="$(sf_workflow_readiness_label "$evidence_score")"
  echo "[SkillFactory] Workflow readiness: ${workflow_key} count=${pattern_count} corrections=${correction_count} evidence=${evidence_score} readiness=${readiness}"
done < <(
  sf_jq -r '
    [
      (.patterns.workflow | keys[]?),
      (.pattern_feedback.workflow | keys[]?)
    ]
    | unique
    | .[]
  ' "$SF_STATE_FILE" 2>/dev/null || true
)

if [[ -d "$SF_SKILLS_DIR" ]]; then
  while IFS= read -r meta_file; do
    skill_dir="$(dirname "$meta_file")"
    skill_slug="$(sf_jq -r '.skill_slug // empty' "$meta_file" 2>/dev/null || true)"
    [[ -z "$skill_slug" ]] && continue
    history_count=0
    feedback_count=0
    if [[ -f "$skill_dir/history.jsonl" ]]; then
      history_count="$(wc -l < "$skill_dir/history.jsonl" | tr -d ' ')"
    fi
    if [[ -f "$skill_dir/feedback.jsonl" ]]; then
      feedback_count="$(wc -l < "$skill_dir/feedback.jsonl" | tr -d ' ')"
    fi
    source_pattern_key="$(sf_jq -r '.source_pattern_key // empty' "$meta_file" 2>/dev/null || true)"
    readiness="LOW"
    if [[ -n "$source_pattern_key" ]]; then
      evidence_line="$(sf_compute_evidence_score "$source_pattern_key")"
      evidence_score="${evidence_line##*$'\t'}"
      readiness="$(sf_workflow_readiness_label "$evidence_score")"
    fi
    echo "[SkillFactory] Skill stats: ${skill_slug} activity=${history_count} feedback=${feedback_count} readiness=${readiness}"
  done < <(find "$SF_SKILLS_DIR" -path '*/.factory/meta.json' -type f | sort)
fi
