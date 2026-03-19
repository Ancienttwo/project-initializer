#!/bin/bash
# Create a user-level skill from a Skill Factory proposal.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOK_LIB="$REPO_ROOT/.ai/hooks/lib/skill-factory.sh"
ASSET_DIR="$REPO_ROOT/.claude/skill-factory"

if [[ ! -f "$HOOK_LIB" ]]; then
  HOOK_LIB="$REPO_ROOT/.claude/hooks/lib/skill-factory.sh"
fi

if [[ ! -f "$HOOK_LIB" ]]; then
  HOOK_LIB="$REPO_ROOT/assets/hooks/lib/skill-factory.sh"
  ASSET_DIR="$REPO_ROOT/assets/skill-factory"
fi

if [[ ! -f "$HOOK_LIB" ]]; then
  echo "Skill Factory hook library not found." >&2
  exit 1
fi

# shellcheck source=/dev/null
. "$HOOK_LIB"

PROPOSAL_ID=""
TITLE=""
GOAL=""
OUTPUTS=""
BOUNDARIES=""
TYPE=""
INPUTS=""
RULES=""
DO_LIST=""
AVOID_LIST=""
SOURCE_PROJECT="${REPO_ROOT}"
FORCE=0
TEST_PROMPTS=()
QUESTIONS=()

usage() {
  cat <<'EOF_USAGE'
Usage: bash scripts/skill-factory-create.sh --proposal <id> --title <title> --goal <goal> --outputs <outputs> --boundaries <boundaries> [options]

Options:
  --proposal <id>         Pending proposal id from ~/.claude/.skill-proposals.json
  --title <title>         Skill title
  --goal <text>           Primary goal
  --outputs <text>        Expected outputs
  --boundaries <text>     Boundaries / constraints
  --type <workflow|knowledge>
  --inputs <text>         Workflow inputs
  --rules <text>          Knowledge rules block
  --do <text>             Knowledge do list
  --avoid <text>          Knowledge avoid list
  --test-prompt <text>    Add rubric test prompt (repeatable)
  --question <json>       Add rubric question JSON (repeatable)
  --force                 Overwrite existing target skill
EOF_USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --proposal) PROPOSAL_ID="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --goal) GOAL="${2:-}"; shift 2 ;;
    --outputs) OUTPUTS="${2:-}"; shift 2 ;;
    --boundaries) BOUNDARIES="${2:-}"; shift 2 ;;
    --type) TYPE="${2:-}"; shift 2 ;;
    --inputs) INPUTS="${2:-}"; shift 2 ;;
    --rules) RULES="${2:-}"; shift 2 ;;
    --do) DO_LIST="${2:-}"; shift 2 ;;
    --avoid) AVOID_LIST="${2:-}"; shift 2 ;;
    --test-prompt) TEST_PROMPTS+=("${2:-}"); shift 2 ;;
    --question) QUESTIONS+=("${2:-}"); shift 2 ;;
    --force) FORCE=1; shift ;;
    --help) usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$PROPOSAL_ID" || -z "$TITLE" || -z "$GOAL" || -z "$OUTPUTS" || -z "$BOUNDARIES" ]]; then
  echo "Missing required intake fields. Need --proposal, --title, --goal, --outputs, --boundaries." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for Skill Factory creation." >&2
  exit 1
fi

if [[ ! -f "$SF_PROPOSALS_FILE" ]]; then
  echo "Proposal registry not found: $SF_PROPOSALS_FILE" >&2
  exit 1
fi

proposal_json="$(jq -c --arg id "$PROPOSAL_ID" '(.proposals // [])[] | select(.id == $id)' "$SF_PROPOSALS_FILE")"
if [[ -z "$proposal_json" ]]; then
  echo "Proposal not found: $PROPOSAL_ID" >&2
  exit 1
fi

proposal_type="$(printf '%s' "$proposal_json" | jq -r '.type')"
proposal_slug="$(printf '%s' "$proposal_json" | jq -r '.skill_slug')"
proposal_reason="$(printf '%s' "$proposal_json" | jq -r '.reason')"
source_patterns="$(printf '%s' "$proposal_json" | jq -c '.source_patterns // {}')"

if [[ -n "$TYPE" && "$TYPE" != "$proposal_type" ]]; then
  echo "Proposal type mismatch: expected $proposal_type, got $TYPE" >&2
  exit 1
fi

TYPE="$proposal_type"
skill_dir="$SF_SKILLS_DIR/$proposal_slug"
factory_dir="$skill_dir/.factory"
skill_file="$skill_dir/SKILL.md"
agents_dir="$skill_dir/agents"
openai_yaml="$agents_dir/openai.yaml"

if [[ -f "$skill_file" && "$FORCE" -ne 1 ]]; then
  echo "Skill already exists: $skill_file (use --force to overwrite)" >&2
  exit 1
fi

mkdir -p "$factory_dir" "$factory_dir/candidates"

description="$(printf '%s' "$proposal_reason" | tr '\n' ' ' | sed -E 's/[[:space:]]+/ /g')"

normalize_single_line() {
  printf '%s' "$1" | tr '\n' ' ' | sed -E 's/[[:space:]]+/ /g; s/^ //; s/ $//'
}

truncate_text() {
  local text="$1"
  local limit="${2:-120}"
  if [[ ${#text} -le "$limit" ]]; then
    printf '%s' "$text"
    return
  fi
  printf '%s...' "${text:0:$((limit - 3))}"
}

yaml_quote() {
  printf "%s" "$1" | sed "s/'/''/g"
}

write_openai_yaml() {
  local display_name short_description default_prompt

  display_name="$(normalize_single_line "$TITLE")"
  short_description="$(truncate_text "$(normalize_single_line "$GOAL")" 140)"

  if [[ "$TYPE" == "knowledge" ]]; then
    default_prompt="Apply the ${display_name} rules, follow the established conventions first, and explain any exception explicitly."
  else
    default_prompt="Use the ${display_name} workflow, produce the expected outputs, and verify the exit conditions before finishing."
  fi

  mkdir -p "$agents_dir"
  printf "display_name: '%s'\nshort_description: '%s'\ndefault_prompt: '%s'\n" \
    "$(yaml_quote "$display_name")" \
    "$(yaml_quote "$short_description")" \
    "$(yaml_quote "$default_prompt")" \
    > "$openai_yaml"
}

template_file="$ASSET_DIR/workflow-skill.template.md"
if [[ "$TYPE" == "knowledge" ]]; then
  template_file="$ASSET_DIR/knowledge-skill.template.md"
fi

if [[ ! -f "$template_file" ]]; then
  echo "Template not found: $template_file" >&2
  exit 1
fi

workflow_steps="${INPUTS:-"- Use the repo contracts as the starting point\n- Produce the expected outputs\n- Verify against the exit conditions"}"
exit_conditions="${OUTPUTS}"
rules_block="${RULES:-"- Preserve the repeated project convention captured by the proposal"}"
do_block="${DO_LIST:-"- Follow the convention consistently\n- Explain exceptions explicitly"}"
avoid_block="${AVOID_LIST:-"- Ignore previous corrections\n- Invent new conventions without evidence"}"

rendered_skill="$(cat "$template_file")"
rendered_skill="${rendered_skill//'{{SKILL_SLUG}}'/$proposal_slug}"
rendered_skill="${rendered_skill//'{{DESCRIPTION}}'/$description}"
rendered_skill="${rendered_skill//'{{TITLE}}'/$TITLE}"
rendered_skill="${rendered_skill//'{{GOAL}}'/$GOAL}"
rendered_skill="${rendered_skill//'{{INPUTS}}'/${INPUTS:-"- Repo-local plans/\n- tasks/todo.md\n- tasks/contracts/*"}}"
rendered_skill="${rendered_skill//'{{WORKFLOW_STEPS}}'/$workflow_steps}"
rendered_skill="${rendered_skill//'{{OUTPUTS}}'/$OUTPUTS}"
rendered_skill="${rendered_skill//'{{EXIT_CONDITIONS}}'/$exit_conditions}"
rendered_skill="${rendered_skill//'{{BOUNDARIES}}'/$BOUNDARIES}"
rendered_skill="${rendered_skill//'{{SOURCE_PATTERNS}}'/$(printf '%s' "$source_patterns" | jq '.')}"
rendered_skill="${rendered_skill//'{{RULES}}'/$rules_block}"
rendered_skill="${rendered_skill//'{{DO_LIST}}'/$do_block}"
rendered_skill="${rendered_skill//'{{AVOID_LIST}}'/$avoid_block}"
printf '%s\n' "$rendered_skill" > "$skill_file"
write_openai_yaml

questions_json='[]'
if [[ ${#QUESTIONS[@]} -gt 0 ]]; then
  for q in "${QUESTIONS[@]}"; do
    questions_json="$(printf '%s' "$questions_json" | jq --argjson q "$q" '. + [$q]')"
  done
else
  questions_json="$(jq '.questions' "$ASSET_DIR/rubric.template.json")"
fi

test_prompts_json='[]'
if [[ ${#TEST_PROMPTS[@]} -gt 0 ]]; then
  for prompt in "${TEST_PROMPTS[@]}"; do
    test_prompts_json="$(printf '%s' "$test_prompts_json" | jq --arg prompt "$prompt" '. + [$prompt]')"
  done
else
  test_prompts_json="$(jq '.testPrompts' "$ASSET_DIR/rubric.template.json")"
fi

jq -nc \
  --arg type "$TYPE" \
  --arg title "$TITLE" \
  --arg slug "$proposal_slug" \
  --arg source_project "$SOURCE_PROJECT" \
  --arg proposal_id "$PROPOSAL_ID" \
  --arg created_at "$(date +%s)" \
  --argjson source_patterns "$source_patterns" \
  '{
    type: $type,
    title: $title,
    skill_slug: $slug,
    source_project: $source_project,
    proposal_id: $proposal_id,
    source_patterns: $source_patterns,
    created_at: ($created_at | tonumber)
  }' > "$factory_dir/meta.json"

jq -nc \
  --argjson questions "$questions_json" \
  --argjson test_prompts "$test_prompts_json" \
  '{questions:$questions, testPrompts:$test_prompts}' > "$factory_dir/rubric.json"

touch "$factory_dir/history.jsonl" "$factory_dir/feedback.jsonl"

jq --arg id "$PROPOSAL_ID" '
  .proposals = ((.proposals // []) | map(if .id == $id then .status = "accepted" else . end))
' "$SF_PROPOSALS_FILE" > "$SF_PROPOSALS_FILE.tmp" && mv "$SF_PROPOSALS_FILE.tmp" "$SF_PROPOSALS_FILE"

sf_mark_skill_usage "$proposal_slug" "$TYPE" "skill-factory-create"

echo "[SkillFactory] Created ${TYPE} skill at ${skill_file}"
echo "[SkillFactory] Agent metadata initialized at ${openai_yaml}"
echo "[SkillFactory] Sidecar initialized at ${factory_dir}"
