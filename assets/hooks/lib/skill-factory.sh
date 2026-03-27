#!/bin/bash
# Skill Factory shared state and lifecycle helpers.

SF_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! declare -F workflow_plan_slug >/dev/null 2>&1 && [[ -f "$SF_LIB_DIR/workflow-state.sh" ]]; then
  # shellcheck source=/dev/null
  . "$SF_LIB_DIR/workflow-state.sh"
fi

if ! declare -F workflow_plan_slug >/dev/null 2>&1; then
  workflow_plan_slug() { return 1; }
fi
if ! declare -F workflow_todo_done >/dev/null 2>&1; then
  workflow_todo_done() { printf '0'; }
fi
if ! declare -F workflow_todo_total >/dev/null 2>&1; then
  workflow_todo_total() { printf '0'; }
fi

SF_STATE_FILE=".claude/.skill-factory-state.json"
SF_SESSION_FILE=".claude/.skill-factory-session.json"
SF_SESSION_MARKER_FILE=".claude/.skill-factory-session-marker.json"
SF_MEMORY_CONTEXT_FILE=".claude/.memory-context.json"
SF_MEMORY_SNAPSHOT_FILE=".claude/.memory-snapshot.json"
SF_GLOBAL_HOME="${CLAUDE_SKILL_FACTORY_HOME:-${HOME}/.claude}"
if ! mkdir -p "$SF_GLOBAL_HOME" 2>/dev/null; then
  SF_GLOBAL_HOME=".claude/.skill-factory-user"
  mkdir -p "$SF_GLOBAL_HOME"
fi
SF_PROPOSALS_FILE="${SF_GLOBAL_HOME}/.skill-proposals.json"
SF_SKILLS_DIR="${SF_GLOBAL_HOME}/skills"
SF_JQ_BIN="${PROJECT_INITIALIZER_JQ_BIN:-jq}"
SF_HINT_THRESHOLD="${SF_HINT_THRESHOLD:-3}"
SF_WORKFLOW_THRESHOLD="${SF_WORKFLOW_THRESHOLD:-3}"
SF_KNOWLEDGE_THRESHOLD="${SF_KNOWLEDGE_THRESHOLD:-3}"
SF_CORRECTION_WEIGHT="${SF_CORRECTION_WEIGHT:-2}"
SF_EVIDENCE_WARNED="${SF_EVIDENCE_WARNED:-0}"

sf_now_epoch() {
  date +%s
}

sf_agent_name() {
  if [[ -n "${CODEX_SESSION_ID:-}" ]]; then
    printf 'codex'
    return
  fi
  printf 'claude'
}

sf_require_jq() {
  command -v "$SF_JQ_BIN" >/dev/null 2>&1
}

sf_jq() {
  "$SF_JQ_BIN" "$@"
}

sf_warn_evidence_count_only() {
  if [[ "${SF_EVIDENCE_WARNED:-0}" == "1" ]]; then
    return 0
  fi

  echo "[SkillFactory] Evidence scoring: count-only mode" >&2
  SF_EVIDENCE_WARNED=1
  export SF_EVIDENCE_WARNED
}

sf_ensure_global_dirs() {
  mkdir -p ".claude" "$SF_GLOBAL_HOME" "$SF_SKILLS_DIR"
}

sf_ensure_state() {
  sf_ensure_global_dirs

  if [[ ! -f "$SF_STATE_FILE" ]]; then
    cat > "$SF_STATE_FILE" <<'EOF_STATE'
{
  "version": 1,
  "sessions": {
    "recent": []
  },
  "patterns": {
    "workflow": {},
    "knowledge": {}
  },
  "pattern_feedback": {
    "workflow": {}
  },
  "memory": {
    "last_scan_at": 0,
    "last_snapshot_hash": "",
    "recent_deltas": [],
    "themes": {},
    "corroborations": {}
  },
  "optimization_hints": [],
  "dismissed": []
}
EOF_STATE
  fi

  if sf_require_jq; then
    sf_jq '
      .version = (.version // 1)
      | .sessions = (.sessions // {recent: []})
      | .patterns = (.patterns // {workflow: {}, knowledge: {}})
      | .pattern_feedback = (.pattern_feedback // {workflow: {}})
      | .memory = (.memory // {last_scan_at: 0, last_snapshot_hash: "", recent_deltas: [], themes: {}, corroborations: {}})
      | .optimization_hints = (.optimization_hints // [])
      | .dismissed = (.dismissed // [])
    ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
  fi

  if [[ ! -f "$SF_PROPOSALS_FILE" ]]; then
    cat > "$SF_PROPOSALS_FILE" <<'EOF_PROPOSALS'
{
  "proposals": []
}
EOF_PROPOSALS
  fi
}

sf_normalize_slug() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

sf_text_matches_slug() {
  local text="$1"
  local slug="$2"
  local normalized spaced part matched=0

  normalized="$(printf '%s' "$text" | tr '[:upper:]' '[:lower:]')"
  spaced="${slug//-/ }"

  if [[ -n "$slug" && "$normalized" == *"$slug"* ]]; then
    return 0
  fi

  if [[ -n "$spaced" && "$normalized" == *"$spaced"* ]]; then
    return 0
  fi

  IFS='-' read -r -a slug_parts <<< "$slug"
  for part in "${slug_parts[@]}"; do
    [[ ${#part} -lt 4 ]] && continue
    if [[ "$normalized" == *"$part"* ]]; then
      matched=1
      break
    fi
  done

  [[ "$matched" -eq 1 ]]
}

sf_recompute_memory_corroborations() {
  if ! sf_require_jq; then
    return 0
  fi

  sf_jq '
    . as $state
    | .memory.corroborations = (
        reduce ($state.memory.themes | keys[]?) as $key ({};
          .[$key] = {
            memory_count: ($state.memory.themes[$key].count // 0),
            workflow_count: ($state.patterns.workflow[$key].count // 0),
            knowledge_count: ($state.patterns.knowledge[$key].count // 0),
            count: (($state.patterns.workflow[$key].count // 0) + ($state.patterns.knowledge[$key].count // 0)),
            label: ($state.memory.themes[$key].label // $key),
            last_seen: ($state.memory.themes[$key].last_seen // 0)
          }
        )
        | with_entries(select((.value.memory_count // 0) > 0 and ((.value.workflow_count // 0) > 0 or (.value.knowledge_count // 0) > 0)))
      )
  ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
}

sf_record_memory_context() {
  local context_json="$1"

  sf_ensure_state
  if ! sf_require_jq || [[ -z "$context_json" ]]; then
    return 0
  fi

  sf_jq \
    --argjson ctx "$context_json" \
    '
      .memory.last_scan_at = ($ctx.scanned_at // 0)
      | .memory.last_snapshot_hash = ($ctx.snapshot_hash // "")
      | .memory.themes = (
          reduce ($ctx.themes // [])[] as $theme ({};
            .[($theme.slug // "")] = {
              label: ($theme.label // ($theme.slug // "")),
              count: ($theme.count // 1),
              files: ($theme.files // []),
              last_seen: ($ctx.scanned_at // 0)
            }
          )
          | with_entries(select(.key != ""))
        )
      | .memory.recent_deltas = (
          (.memory.recent_deltas // [])
          + (
            if (($ctx.delta.detected // false) == true or ($ctx.delta.type // "") == "autodream-like") then
              [{
                ts: ($ctx.scanned_at // 0),
                type: ($ctx.delta.type // "updated"),
                summary: ($ctx.delta.summary // ""),
                changed_files: ($ctx.delta.changed_files // 0),
                removed_files: ($ctx.delta.removed_files // 0),
                line_delta: ($ctx.delta.line_delta // 0)
              }]
            else
              []
            end
          )
        )
      | .memory.recent_deltas |= (.[-10:])
    ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"

  sf_recompute_memory_corroborations
}

sf_memory_corroboration_count() {
  local key="$1"

  if ! sf_require_jq; then
    printf '0'
    return 0
  fi

  sf_jq -r --arg key "$key" '.memory.corroborations[$key].count // 0' "$SF_STATE_FILE" 2>/dev/null || printf '0'
}

sf_memory_label() {
  local key="$1"

  if ! sf_require_jq; then
    printf '%s' "$key"
    return 0
  fi

  sf_jq -r --arg key "$key" '.memory.themes[$key].label // .memory.corroborations[$key].label // $key' "$SF_STATE_FILE" 2>/dev/null || printf '%s' "$key"
}

sf_recent_memory_delta_type() {
  if ! sf_require_jq; then
    return 0
  fi

  sf_jq -r '.memory.recent_deltas[-1].type // ""' "$SF_STATE_FILE" 2>/dev/null || true
}

sf_memory_prompt_context() {
  local prompt_text="$1"
  local plan_slug="${2:-}"
  local max_items="${3:-3}"
  local recent_delta_type emitted=0

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  recent_delta_type="$(sf_recent_memory_delta_type)"

  while IFS=$'\t' read -r slug label count; do
    [[ -z "$slug" ]] && continue
    if ! sf_text_matches_slug "$prompt_text" "$slug" && ! sf_text_matches_slug "$plan_slug" "$slug"; then
      continue
    fi

    if [[ "$emitted" -eq 0 && "$recent_delta_type" == "autodream-like" ]]; then
      echo "[Memory] Auto memory was consolidated since the last session."
    fi

    echo "[Memory] Theme: ${label} (auto memory hits ${count})"
    emitted=$((emitted + 1))
    if [[ "$emitted" -ge "$max_items" ]]; then
      break
    fi
  done < <(
    sf_jq -r '
      (.memory.themes // {})
      | to_entries
      | sort_by(-(.value.count // 0), .key)
      | .[]
      | "\(.key)\t\(.value.label // .key)\t\(.value.count // 1)"
    ' "$SF_STATE_FILE" 2>/dev/null || true
  )
}

sf_detect_intent_category() {
  local prompt_text="$1"
  local implement_intent="$2"
  local done_intent="$3"
  local normalized

  normalized="$(printf '%s' "$prompt_text" | tr '[:upper:]' '[:lower:]')"

  if [[ "$done_intent" == "1" ]]; then
    printf 'done'
  elif printf '%s' "$normalized" | grep -qEi '(bug|fix|patch|修复|修bug|改bug)'; then
    printf 'bug-fix'
  elif printf '%s' "$normalized" | grep -qEi '(deploy|release|ship|发布|部署)'; then
    printf 'release'
  elif printf '%s' "$normalized" | grep -qEi '(review|audit|审查|review code)'; then
    printf 'review'
  elif printf '%s' "$normalized" | grep -qEi '(knowledge|convention|规范|约定|lessons?)'; then
    printf 'knowledge'
  elif [[ "$implement_intent" == "1" ]]; then
    printf 'feature'
  else
    printf 'explore'
  fi
}

sf_lessons_payload() {
  if [[ ! -f "tasks/lessons.md" ]]; then
    printf '{"themes":{},"items":[]}'
    return
  fi

  awk '
    BEGIN {
      count = 0
      theme = ""
      prevention = ""
      trigger = ""
      current_field = ""
    }
    function escape_json(value) {
      gsub(/\\/, "\\\\", value)
      gsub(/"/, "\\\"", value)
      gsub(/\t/, "\\t", value)
      gsub(/\r/, "\\r", value)
      return value
    }
    function emit() {
      if (theme == "" && prevention == "") {
        return
      }
      count++
      printf "%s{\"theme\":\"%s\",\"prevention\":\"%s\",\"trigger\":\"%s\"}", (count > 1 ? "," : ""), escape_json(theme), escape_json(prevention), escape_json(trigger)
      theme = ""
      prevention = ""
      trigger = ""
      current_field = ""
    }
    /^- Date:/ {
      emit()
      next
    }
    /^- Mistake pattern:/ {
      theme = $0
      sub(/^- Mistake pattern:[[:space:]]*/, "", theme)
      current_field = "theme"
      next
    }
    /^- Prevention rule:/ {
      prevention = $0
      sub(/^- Prevention rule:[[:space:]]*/, "", prevention)
      current_field = "prevention"
      next
    }
    /^- Triggered by correction:/ {
      trigger = $0
      sub(/^- Triggered by correction:[[:space:]]*/, "", trigger)
      current_field = "trigger"
      next
    }
    /^- [A-Za-z]/ {
      current_field = ""
      next
    }
    {
      if (current_field == "theme" && $0 != "") {
        theme = theme "\\n" $0
      } else if (current_field == "prevention" && $0 != "") {
        prevention = prevention "\\n" $0
      } else if (current_field == "trigger" && $0 != "") {
        trigger = trigger "\\n" $0
      }
      next
    }
    END {
      emit()
    }
  ' tasks/lessons.md | {
    local items_json
    items_json="$(cat)"
    if [[ -z "$items_json" ]]; then
      printf '{"themes":{},"items":[]}'
      return
    fi

    if sf_require_jq; then
      sf_jq -nc --argjson items "[${items_json}]" '
        {
          themes: (
            reduce $items[] as $item ({};
              .[($item.theme | ascii_downcase | gsub("[^a-z0-9]+"; "-") | gsub("^-+|-+$"; ""))] += [$item]
            )
            | with_entries(select(.key != ""))
          ),
          items: $items
        }
      '
    else
      printf '{"themes":{},"items":[]}'
    fi
  }
}

sf_write_session_snapshot() {
  local prompt_text="$1"
  local intent_category="$2"
  local plan_slug="$3"
  local todo_done="$4"
  local todo_total="$5"
  local lessons_payload="$6"
  local agent
  agent="$(sf_agent_name)"

  sf_ensure_global_dirs

  if sf_require_jq; then
    sf_jq -nc \
      --arg ts "$(sf_now_epoch)" \
      --arg agent "$agent" \
      --arg prompt "$prompt_text" \
      --arg intent "$intent_category" \
      --arg plan_slug "$plan_slug" \
      --arg todo_done "$todo_done" \
      --arg todo_total "$todo_total" \
      --argjson lessons "$lessons_payload" \
      '{
        ts: ($ts | tonumber),
        agent: $agent,
        prompt: $prompt,
        intent_category: $intent,
        plan_slug: $plan_slug,
        todo_done: ($todo_done | tonumber),
        todo_total: ($todo_total | tonumber),
        lessons: $lessons
      }' > "$SF_SESSION_FILE"
  fi
}

sf_collect_signal() {
  local prompt_text="$1"
  local implement_intent="${2:-0}"
  local done_intent="${3:-0}"
  local intent_category plan_slug todo_done todo_total lessons_payload

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  intent_category="$(sf_detect_intent_category "$prompt_text" "$implement_intent" "$done_intent")"
  plan_slug="$(workflow_plan_slug || true)"
  todo_done="$(workflow_todo_done)"
  todo_total="$(workflow_todo_total)"
  lessons_payload="$(sf_lessons_payload)"

  sf_write_session_snapshot "$prompt_text" "$intent_category" "$plan_slug" "$todo_done" "$todo_total" "$lessons_payload"
}

sf_mark_skill_usage() {
  local skill_slug="$1"
  local skill_type="${2:-unknown}"
  local source="${3:-manual}"
  local skill_dir="$SF_SKILLS_DIR/$skill_slug"

  sf_ensure_global_dirs
  mkdir -p "$skill_dir/.factory"

  if sf_require_jq; then
    sf_jq -nc \
      --arg slug "$skill_slug" \
      --arg type "$skill_type" \
      --arg source "$source" \
      --arg agent "$(sf_agent_name)" \
      --arg ts "$(sf_now_epoch)" \
      '{skill_slug:$slug, skill_type:$type, source:$source, agent:$agent, ts:($ts|tonumber)}' \
      > "$SF_SESSION_MARKER_FILE"

    sf_jq -nc \
      --arg slug "$skill_slug" \
      --arg type "$skill_type" \
      --arg source "$source" \
      --arg ts "$(sf_now_epoch)" \
      '{skill_slug:$slug, skill_type:$type, source:$source, last_used_at:($ts|tonumber)}' \
      > "$skill_dir/.factory/last-used.json"
  fi
}

sf_resolve_skill_context() {
  local target_slug="${1:-}"
  local target_type="${2:-unknown}"
  local marker skill_slug skill_type

  if [[ -n "$target_slug" ]]; then
    skill_slug="$target_slug"
    skill_type="$target_type"
    if [[ "$skill_type" == "unknown" && -f "$SF_SKILLS_DIR/$skill_slug/.factory/last-used.json" ]]; then
      skill_type="$(sf_jq -r '.skill_type // "unknown"' "$SF_SKILLS_DIR/$skill_slug/.factory/last-used.json" 2>/dev/null || printf 'unknown')"
    fi
  else
    if [[ ! -f "$SF_SESSION_MARKER_FILE" ]]; then
      return 1
    fi
    marker="$(cat "$SF_SESSION_MARKER_FILE" 2>/dev/null || true)"
    skill_slug="$(printf '%s' "$marker" | sf_jq -r '.skill_slug // empty' 2>/dev/null || true)"
    skill_type="$(printf '%s' "$marker" | sf_jq -r '.skill_type // "unknown"' 2>/dev/null || true)"
  fi

  if [[ -z "$skill_slug" ]]; then
    return 1
  fi

  printf '%s\t%s\n' "$skill_slug" "${skill_type:-unknown}"
}

sf_record_usage_activity() {
  local file_path="${1:-}"
  local context skill_slug skill_type skill_dir history_file now

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  context="$(sf_resolve_skill_context || true)"
  if [[ -z "$context" ]]; then
    return 0
  fi

  skill_slug="${context%%$'\t'*}"
  skill_type="${context#*$'\t'}"
  skill_dir="$SF_SKILLS_DIR/$skill_slug/.factory"
  history_file="$skill_dir/history.jsonl"
  mkdir -p "$skill_dir"
  now="$(sf_now_epoch)"

  sf_jq -nc \
    --arg ts "$now" \
    --arg file_path "$file_path" \
    --arg agent "$(sf_agent_name)" \
    --arg slug "$skill_slug" \
    --arg type "$skill_type" \
    --arg signal "post-edit-activity" \
    '{ts:($ts|tonumber), signal:$signal, file_path:$file_path, agent:$agent, skill_slug:$slug, skill_type:$type}' >> "$history_file"
}

sf_record_feedback() {
  local signal="${1:-manual-feedback}"
  local file_path="${2:-}"
  local score_delta="${3:-1}"
  local target_slug="${4:-}"
  local target_type="${5:-unknown}"
  local context skill_slug skill_type skill_dir feedback_file now

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  context="$(sf_resolve_skill_context "$target_slug" "$target_type" || true)"
  if [[ -z "$context" ]]; then
    return 0
  fi

  skill_slug="${context%%$'\t'*}"
  skill_type="${context#*$'\t'}"
  skill_dir="$SF_SKILLS_DIR/$skill_slug/.factory"
  feedback_file="$skill_dir/feedback.jsonl"
  mkdir -p "$skill_dir"
  now="$(sf_now_epoch)"

  sf_jq -nc \
    --arg ts "$now" \
    --arg file_path "$file_path" \
    --arg agent "$(sf_agent_name)" \
    --arg signal "$signal" \
    --arg slug "$skill_slug" \
    --arg type "$skill_type" \
    --arg score_delta "$score_delta" \
    '{ts:($ts|tonumber), signal:$signal, file_path:$file_path, agent:$agent, skill_slug:$slug, skill_type:$type, score_delta:($score_delta|tonumber)}' >> "$feedback_file"

  sf_jq \
    --arg slug "$skill_slug" \
    --arg ts "$now" \
    --arg score_delta "$score_delta" \
    '
      .optimization_hints = (
        (.optimization_hints // [])
        | if any(.[]; .slug == $slug) then
            map(if .slug == $slug then .feedback_count += ($score_delta|tonumber) | .last_seen = ($ts|tonumber) else . end)
          else
            . + [{slug:$slug, feedback_count:($score_delta|tonumber), last_seen:($ts|tonumber)}]
          end
      )
    ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"

  local source_pattern_key
  source_pattern_key="$(
    sf_jq -r '.source_pattern_key // empty' "$skill_dir/meta.json" 2>/dev/null || true
  )"

  if [[ -n "$source_pattern_key" && "$skill_type" == "workflow" ]]; then
    sf_jq \
      --arg key "$source_pattern_key" \
      --arg ts "$now" \
      --arg score_delta "$score_delta" \
      '
        .pattern_feedback.workflow[$key] = (
          .pattern_feedback.workflow[$key] // {correction_count: 0, last_seen: 0}
        )
        | .pattern_feedback.workflow[$key].correction_count += ($score_delta | tonumber)
        | .pattern_feedback.workflow[$key].last_seen = ($ts | tonumber)
      ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
  fi
}

sf_read_new_lessons() {
  local lessons_payload

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  lessons_payload="$(sf_lessons_payload)"
  if [[ ! -f "$SF_SESSION_FILE" ]]; then
    sf_write_session_snapshot "" "explore" "" "$(workflow_todo_done)" "$(workflow_todo_total)" "$lessons_payload"
    return 0
  fi

  sf_jq --argjson lessons "$lessons_payload" '.lessons = $lessons' "$SF_SESSION_FILE" > "$SF_SESSION_FILE.tmp" \
    && mv "$SF_SESSION_FILE.tmp" "$SF_SESSION_FILE"
}

sf_append_recent_session() {
  local session_json="$1"

  sf_jq --argjson session "$session_json" '
    .sessions.recent = ((.sessions.recent // []) + [$session]) | .sessions.recent |= (.[-25:])
  ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
}

sf_update_workflow_pattern() {
  local key="$1"
  local plan_slug="$2"
  local now
  now="$(sf_now_epoch)"

  sf_jq \
    --arg key "$key" \
    --arg plan_slug "$plan_slug" \
    --arg ts "$now" \
    '
      .patterns.workflow[$key] = (
        .patterns.workflow[$key] // {count:0, last_seen:0, plan_slugs:[]}
      )
      | .patterns.workflow[$key].count += 1
      | .patterns.workflow[$key].last_seen = ($ts|tonumber)
      | .patterns.workflow[$key].plan_slugs = (
          (.patterns.workflow[$key].plan_slugs + (if $plan_slug == "" then [] else [$plan_slug] end))
          | unique
        )
    ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
}

sf_replace_knowledge_patterns() {
  local lessons_payload="$1"

  sf_jq --argjson lessons "$lessons_payload" '
    .patterns.knowledge = (
      $lessons.themes
      | with_entries({
          key: .key,
          value: {
            count: (.value | length),
            lessons: (.value | map(.prevention))
          }
        })
    )
  ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
}

sf_compute_evidence_score() {
  local key="$1"

  if ! sf_require_jq; then
    sf_warn_evidence_count_only
    printf '0\t0\t0\n'
    return 0
  fi

  local pattern_count correction_count evidence_score
  pattern_count="$(sf_jq -r --arg key "$key" '.patterns.workflow[$key].count // 0' "$SF_STATE_FILE" 2>/dev/null || printf '0')"
  correction_count="$(sf_jq -r --arg key "$key" '.pattern_feedback.workflow[$key].correction_count // 0' "$SF_STATE_FILE" 2>/dev/null || printf '0')"

  evidence_score=$((pattern_count + (correction_count * SF_CORRECTION_WEIGHT)))
  printf '%s\t%s\t%s\n' "$pattern_count" "$correction_count" "$evidence_score"
}

sf_workflow_readiness_label() {
  local evidence_score="${1:-0}"

  if (( evidence_score >= SF_WORKFLOW_THRESHOLD + SF_CORRECTION_WEIGHT )); then
    printf 'HIGH'
  elif (( evidence_score >= SF_WORKFLOW_THRESHOLD )); then
    printf 'MEDIUM'
  else
    printf 'LOW'
  fi
}

sf_evaluate_workflow_proposal() {
  local intent_category="$1"
  local repo_root="$2"
  local evidence_line pattern_count correction_count evidence_score memory_corroboration memory_label reason_json

  evidence_line="$(sf_compute_evidence_score "$intent_category")"
  pattern_count="${evidence_line%%$'\t'*}"
  correction_count="${evidence_line#*$'\t'}"
  correction_count="${correction_count%%$'\t'*}"
  evidence_score="${evidence_line##*$'\t'}"
  memory_corroboration="$(sf_memory_corroboration_count "$intent_category")"
  memory_label="$(sf_memory_label "$intent_category")"

  if (( pattern_count < SF_WORKFLOW_THRESHOLD )); then
    return 0
  fi

  reason_json="$(
    sf_jq -nc \
      --arg key "$intent_category" \
      --argjson count "$pattern_count" \
      --argjson correction_count "$correction_count" \
      --argjson evidence_score "$evidence_score" \
      --arg readiness "$(sf_workflow_readiness_label "$evidence_score")" \
      --argjson memory_corroboration "$memory_corroboration" \
      --arg memory_label "$memory_label" \
      '{
        key: $key,
        count: $count,
        correction_count: $correction_count,
        evidence_score: $evidence_score,
        readiness: $readiness,
        memory_corroboration_count: $memory_corroboration,
        memory_label: $memory_label
      }'
  )"

  sf_create_proposal \
    "workflow" \
    "$intent_category" \
    "Create a workflow skill for ${intent_category}" \
    "$repo_root" \
    "Detected ${pattern_count} similar ${intent_category} sessions with ${correction_count} explicit correction signals (evidence score ${evidence_score}).$(if [[ "$memory_corroboration" -gt 0 ]]; then printf ' Auto memory corroborates this pattern through %s related signals for theme %s.' "$memory_corroboration" "$memory_label"; fi)" \
    "$(sf_normalize_slug "${intent_category}-workflow")" \
    "$reason_json"
}

sf_has_pending_proposal() {
  local repo_root="$1"
  local key="$2"
  local type="$3"

  sf_jq -e --arg repo_root "$repo_root" --arg key "$key" --arg type "$type" '
    any((.proposals // [])[]; .repo_root == $repo_root and .key == $key and .type == $type and .status == "pending")
  ' "$SF_PROPOSALS_FILE" >/dev/null 2>&1
}

sf_create_proposal() {
  local type="$1"
  local key="$2"
  local title="$3"
  local repo_root="$4"
  local reason="$5"
  local skill_slug="$6"
  local source_patterns="$7"
  local now proposal_id

  sf_ensure_state
  now="$(sf_now_epoch)"
  proposal_id="$(sf_normalize_slug "${type}-${key}-${now}")"

  if [[ -d "$SF_SKILLS_DIR/$skill_slug" ]]; then
    return 0
  fi

  if sf_has_pending_proposal "$repo_root" "$key" "$type"; then
    return 0
  fi

  sf_jq \
    --arg id "$proposal_id" \
    --arg type "$type" \
    --arg key "$key" \
    --arg title "$title" \
    --arg repo_root "$repo_root" \
    --arg reason "$reason" \
    --arg slug "$skill_slug" \
    --argjson source_patterns "$source_patterns" \
    --arg ts "$now" \
    '
      .proposals = (
        (.proposals // []) + [{
          id: $id,
          type: $type,
          key: $key,
          title: $title,
          repo_root: $repo_root,
          reason: $reason,
          status: "pending",
          skill_slug: $slug,
          source_patterns: $source_patterns,
          created_at: ($ts|tonumber)
        }]
      )
    ' "$SF_PROPOSALS_FILE" > "$SF_PROPOSALS_FILE.tmp" && mv "$SF_PROPOSALS_FILE.tmp" "$SF_PROPOSALS_FILE"
}

sf_summarize_session() {
  local session_json intent_category plan_slug lessons_payload repo_root

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  if [[ ! -f "$SF_SESSION_FILE" ]]; then
    sf_collect_signal "" "0" "0"
  fi

  if [[ ! -f "$SF_SESSION_FILE" ]]; then
    return 0
  fi

  session_json="$(cat "$SF_SESSION_FILE" 2>/dev/null || true)"
  intent_category="$(printf '%s' "$session_json" | sf_jq -r '.intent_category // "explore"')"
  plan_slug="$(printf '%s' "$session_json" | sf_jq -r '.plan_slug // ""')"
  lessons_payload="$(printf '%s' "$session_json" | sf_jq -c '.lessons // {"themes":{},"items":[]}' )"
  repo_root="${HOOK_REPO_ROOT:-$(pwd)}"

  sf_append_recent_session "$session_json"
  sf_update_workflow_pattern "$intent_category" "$plan_slug"
  sf_replace_knowledge_patterns "$lessons_payload"
  sf_recompute_memory_corroborations

  if [[ "$intent_category" != "explore" && "$intent_category" != "knowledge" ]]; then
    sf_evaluate_workflow_proposal "$intent_category" "$repo_root"
  fi
}

sf_detect_patterns() {
  local repo_root lessons_keys theme

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  repo_root="${HOOK_REPO_ROOT:-$(pwd)}"
  lessons_keys="$(sf_jq -r '.patterns.knowledge | keys[]?' "$SF_STATE_FILE" 2>/dev/null || true)"

  while IFS= read -r theme; do
    local count slug memory_corroboration memory_label source_patterns
    [[ -z "$theme" ]] && continue
    count="$(sf_jq -r --arg theme "$theme" '.patterns.knowledge[$theme].count // 0' "$SF_STATE_FILE")"
    if [[ "$count" -lt "$SF_KNOWLEDGE_THRESHOLD" ]]; then
      continue
    fi
    slug="$(sf_normalize_slug "${theme}-knowledge")"
    memory_corroboration="$(sf_memory_corroboration_count "$theme")"
    memory_label="$(sf_memory_label "$theme")"
    source_patterns="$(
      sf_jq -c --arg theme "$theme" --argjson memory_corroboration "$memory_corroboration" --arg memory_label "$memory_label" '
        (.patterns.knowledge[$theme] // {})
        + {
          memory_corroboration_count: $memory_corroboration,
          memory_label: $memory_label
        }
      ' "$SF_STATE_FILE"
    )"
    sf_create_proposal \
      "knowledge" \
      "$theme" \
      "Create a knowledge skill for ${theme}" \
      "$repo_root" \
      "Detected ${count} repeated lessons for theme '${theme}'.$(if [[ "$memory_corroboration" -gt 0 ]]; then printf ' Auto memory corroborates this theme through %s related signals for %s.' "$memory_corroboration" "$memory_label"; fi)" \
      "$slug" \
      "$source_patterns"
  done <<< "$lessons_keys"
}

sf_check_proposals() {
  local repo_root pending pending_count pending_id

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  repo_root="${HOOK_REPO_ROOT:-$(pwd)}"
  pending_count="$(sf_jq -r --arg repo_root "$repo_root" '
    [(.proposals // [])[] | select(.repo_root == $repo_root and .status == "pending")] | length
  ' "$SF_PROPOSALS_FILE" 2>/dev/null || echo 0)"

  if [[ "${pending_count:-0}" -gt 0 ]]; then
    pending="$(sf_jq -r --arg repo_root "$repo_root" '
      (.proposals // [])
      | map(select(.repo_root == $repo_root and .status == "pending"))
      | .[0]
      | "\(.title) [\(.id)]"
    ' "$SF_PROPOSALS_FILE" 2>/dev/null || true)"
    pending_id="$(sf_jq -r --arg repo_root "$repo_root" '
      (.proposals // [])
      | map(select(.repo_root == $repo_root and .status == "pending"))
      | .[0].id // ""
    ' "$SF_PROPOSALS_FILE" 2>/dev/null || true)"
    echo "[SkillFactory] Pending proposal detected: ${pending}"
    echo "[SkillFactory] Review with: bash scripts/skill-factory-create.sh --proposal ${pending_id}"
  fi
}

sf_check_optimization() {
  local hint

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  hint="$(sf_jq -r --arg threshold "$SF_HINT_THRESHOLD" '
    (.optimization_hints // [])
    | map(select((.feedback_count // 0) >= ($threshold | tonumber)))
    | .[0]
    | if . == null then "" else "\(.slug) \(.feedback_count)" end
  ' "$SF_STATE_FILE" 2>/dev/null || true)"

  if [[ -n "$hint" ]]; then
    echo "[SkillFactory] Optimization hint available for ${hint% *} after ${hint##* } explicit feedback signals."
    echo "[SkillFactory] Prepare autoresearch input from ~/.claude/skills/${hint% *}/.factory/rubric.json, feedback.jsonl, and supporting history."
  fi
}

sf_prompt_feedback() {
  local marker skill_slug

  if ! sf_require_jq; then
    return 0
  fi

  if [[ ! -f "$SF_SESSION_MARKER_FILE" ]]; then
    return 0
  fi

  marker="$(cat "$SF_SESSION_MARKER_FILE" 2>/dev/null || true)"
  skill_slug="$(printf '%s' "$marker" | sf_jq -r '.skill_slug // empty' 2>/dev/null || true)"
  if [[ -z "$skill_slug" ]]; then
    return 0
  fi

  echo "[SkillFactory] This session used '${skill_slug}'. If it needs work, run: bash scripts/skill-factory-check.sh --record-feedback ${skill_slug} --signal correction-needed"
}
