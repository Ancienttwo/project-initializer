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
SF_GLOBAL_HOME="${CLAUDE_SKILL_FACTORY_HOME:-${HOME}/.claude}"
if ! mkdir -p "$SF_GLOBAL_HOME" 2>/dev/null; then
  SF_GLOBAL_HOME=".claude/.skill-factory-user"
  mkdir -p "$SF_GLOBAL_HOME"
fi
SF_PROPOSALS_FILE="${SF_GLOBAL_HOME}/.skill-proposals.json"
SF_SKILLS_DIR="${SF_GLOBAL_HOME}/skills"
SF_HINT_THRESHOLD=3
SF_WORKFLOW_THRESHOLD=3
SF_KNOWLEDGE_THRESHOLD=3

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
  command -v jq >/dev/null 2>&1
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
  "optimization_hints": [],
  "dismissed": []
}
EOF_STATE
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
      jq -nc --argjson items "[${items_json}]" '
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
    jq -nc \
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
    jq -nc \
      --arg slug "$skill_slug" \
      --arg type "$skill_type" \
      --arg source "$source" \
      --arg agent "$(sf_agent_name)" \
      --arg ts "$(sf_now_epoch)" \
      '{skill_slug:$slug, skill_type:$type, source:$source, agent:$agent, ts:($ts|tonumber)}' \
      > "$SF_SESSION_MARKER_FILE"

    jq -nc \
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
      skill_type="$(jq -r '.skill_type // "unknown"' "$SF_SKILLS_DIR/$skill_slug/.factory/last-used.json" 2>/dev/null || printf 'unknown')"
    fi
  else
    if [[ ! -f "$SF_SESSION_MARKER_FILE" ]]; then
      return 1
    fi
    marker="$(cat "$SF_SESSION_MARKER_FILE" 2>/dev/null || true)"
    skill_slug="$(printf '%s' "$marker" | jq -r '.skill_slug // empty' 2>/dev/null || true)"
    skill_type="$(printf '%s' "$marker" | jq -r '.skill_type // "unknown"' 2>/dev/null || true)"
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

  jq -nc \
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

  jq -nc \
    --arg ts "$now" \
    --arg file_path "$file_path" \
    --arg agent "$(sf_agent_name)" \
    --arg signal "$signal" \
    --arg slug "$skill_slug" \
    --arg type "$skill_type" \
    --arg score_delta "$score_delta" \
    '{ts:($ts|tonumber), signal:$signal, file_path:$file_path, agent:$agent, skill_slug:$slug, skill_type:$type, score_delta:($score_delta|tonumber)}' >> "$feedback_file"

  jq \
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

  jq --argjson lessons "$lessons_payload" '.lessons = $lessons' "$SF_SESSION_FILE" > "$SF_SESSION_FILE.tmp" \
    && mv "$SF_SESSION_FILE.tmp" "$SF_SESSION_FILE"
}

sf_append_recent_session() {
  local session_json="$1"

  jq --argjson session "$session_json" '
    .sessions.recent = ((.sessions.recent // []) + [$session]) | .sessions.recent |= (.[-25:])
  ' "$SF_STATE_FILE" > "$SF_STATE_FILE.tmp" && mv "$SF_STATE_FILE.tmp" "$SF_STATE_FILE"
}

sf_update_workflow_pattern() {
  local key="$1"
  local plan_slug="$2"
  local now
  now="$(sf_now_epoch)"

  jq \
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

  jq --argjson lessons "$lessons_payload" '
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

sf_has_pending_proposal() {
  local repo_root="$1"
  local key="$2"
  local type="$3"

  jq -e --arg repo_root "$repo_root" --arg key "$key" --arg type "$type" '
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

  jq \
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
  intent_category="$(printf '%s' "$session_json" | jq -r '.intent_category // "explore"')"
  plan_slug="$(printf '%s' "$session_json" | jq -r '.plan_slug // ""')"
  lessons_payload="$(printf '%s' "$session_json" | jq -c '.lessons // {"themes":{},"items":[]}' )"
  repo_root="${HOOK_REPO_ROOT:-$(pwd)}"

  sf_append_recent_session "$session_json"
  sf_update_workflow_pattern "$intent_category" "$plan_slug"
  sf_replace_knowledge_patterns "$lessons_payload"

  if [[ "$intent_category" != "explore" && "$intent_category" != "knowledge" ]]; then
    local workflow_count
    workflow_count="$(jq -r --arg key "$intent_category" '.patterns.workflow[$key].count // 0' "$SF_STATE_FILE")"
    if [[ "$workflow_count" -ge "$SF_WORKFLOW_THRESHOLD" ]]; then
      sf_create_proposal \
        "workflow" \
        "$intent_category" \
        "Create a workflow skill for ${intent_category}" \
        "$repo_root" \
        "Detected ${workflow_count} similar ${intent_category} sessions." \
        "$(sf_normalize_slug "${intent_category}-workflow")" \
        "$(jq -c --arg key "$intent_category" '.patterns.workflow[$key]' "$SF_STATE_FILE")"
    fi
  fi
}

sf_detect_patterns() {
  local repo_root lessons_keys theme

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  repo_root="${HOOK_REPO_ROOT:-$(pwd)}"
  lessons_keys="$(jq -r '.patterns.knowledge | keys[]?' "$SF_STATE_FILE" 2>/dev/null || true)"

  while IFS= read -r theme; do
    local count slug
    [[ -z "$theme" ]] && continue
    count="$(jq -r --arg theme "$theme" '.patterns.knowledge[$theme].count // 0' "$SF_STATE_FILE")"
    if [[ "$count" -lt "$SF_KNOWLEDGE_THRESHOLD" ]]; then
      continue
    fi
    slug="$(sf_normalize_slug "${theme}-knowledge")"
    sf_create_proposal \
      "knowledge" \
      "$theme" \
      "Create a knowledge skill for ${theme}" \
      "$repo_root" \
      "Detected ${count} repeated lessons for theme '${theme}'." \
      "$slug" \
      "$(jq -c --arg theme "$theme" '.patterns.knowledge[$theme]' "$SF_STATE_FILE")"
  done <<< "$lessons_keys"
}

sf_check_proposals() {
  local repo_root pending pending_count pending_id

  sf_ensure_state
  if ! sf_require_jq; then
    return 0
  fi

  repo_root="${HOOK_REPO_ROOT:-$(pwd)}"
  pending_count="$(jq -r --arg repo_root "$repo_root" '
    [(.proposals // [])[] | select(.repo_root == $repo_root and .status == "pending")] | length
  ' "$SF_PROPOSALS_FILE" 2>/dev/null || echo 0)"

  if [[ "${pending_count:-0}" -gt 0 ]]; then
    pending="$(jq -r --arg repo_root "$repo_root" '
      (.proposals // [])
      | map(select(.repo_root == $repo_root and .status == "pending"))
      | .[0]
      | "\(.title) [\(.id)]"
    ' "$SF_PROPOSALS_FILE" 2>/dev/null || true)"
    pending_id="$(jq -r --arg repo_root "$repo_root" '
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

  hint="$(jq -r '
    (.optimization_hints // [])
    | map(select((.feedback_count // 0) >= 3))
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
  skill_slug="$(printf '%s' "$marker" | jq -r '.skill_slug // empty' 2>/dev/null || true)"
  if [[ -z "$skill_slug" ]]; then
    return 0
  fi

  echo "[SkillFactory] This session used '${skill_slug}'. If it needs work, run: bash scripts/skill-factory-check.sh --record-feedback ${skill_slug} --signal correction-needed"
}
