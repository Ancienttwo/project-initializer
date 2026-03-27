#!/bin/bash
# Migrate an existing project to project-initializer workflow conventions.
# - Project hooks source of truth: .claude/settings.json
# - Hook scripts synced from assets/hooks
# - docs/TODO.md removed (tasks/todo.md is canonical)
# - 6-phase workflow files and helpers installed
#
# Usage:
#   bash scripts/migrate-project-template.sh --repo /path/to/repo --dry-run
#   bash scripts/migrate-project-template.sh --repo /path/to/repo --apply

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PI_LIB_DIR="$SCRIPT_DIR/lib"
if [[ -f "$PI_LIB_DIR/project-init-lib.sh" ]]; then
  # shellcheck source=/dev/null
  . "$PI_LIB_DIR/project-init-lib.sh"
fi
HOOK_ASSETS_DIR="$SKILL_ROOT/assets/hooks"
TEMPLATE_ASSETS_DIR="$SKILL_ROOT/assets/templates"
HELPER_ASSETS_DIR="$TEMPLATE_ASSETS_DIR/helpers"
SKILL_FACTORY_ASSETS_DIR="$SKILL_ROOT/assets/skill-factory"
FACTOR_FACTORY_ASSETS_DIR="$TEMPLATE_ASSETS_DIR/factor-factory"
JQ_BIN="${PROJECT_INITIALIZER_JQ_BIN:-jq}"

MODE="dry-run"
TARGET_REPO=""

usage() {
  cat <<'USAGE_EOF'
Usage: migrate-project-template.sh --repo <path> [--dry-run|--apply]

Options:
  --repo <path>  Target repository path
  --dry-run      Print planned changes only (default)
  --apply        Apply changes
  --help         Show help
USAGE_EOF
}

log() {
  echo "[migrate] $*"
}

has_jq() {
  command -v "$JQ_BIN" >/dev/null 2>&1
}

merge_hook_settings_json() {
  local base_file="$1"
  local patch_file="$2"
  local output_file="$3"

  node - "$base_file" "$patch_file" "$output_file" <<'NODE_EOF'
const fs = require("fs");

const [, , basePath, patchPath, outputPath] = process.argv;

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function matcherOf(block) {
  return block && Object.prototype.hasOwnProperty.call(block, "matcher")
    ? block.matcher ?? null
    : null;
}

function ensureHooksArray(block) {
  if (!Array.isArray(block.hooks)) {
    block.hooks = [];
  }
  return block.hooks;
}

function hasCommand(block, command) {
  return ensureHooksArray(block).some((hook) => (hook?.command ?? "") === command);
}

function mergeEventBlocks(baseBlocks, patchBlocks) {
  const result = Array.isArray(baseBlocks) ? clone(baseBlocks) : [];

  for (const patchBlock of Array.isArray(patchBlocks) ? patchBlocks : []) {
    const matcher = matcherOf(patchBlock);
    const patchHooks = Array.isArray(patchBlock?.hooks) ? patchBlock.hooks : [];

    for (const patchHook of patchHooks) {
      const command = patchHook?.command ?? "";
      if (!command) continue;

      const existingWithCommand = result.find(
        (block) => matcherOf(block) === matcher && hasCommand(block, command)
      );
      if (existingWithCommand) continue;

      const targetBlock = result.find((block) => matcherOf(block) === matcher);
      if (targetBlock) {
        ensureHooksArray(targetBlock).push(clone(patchHook));
        continue;
      }

      const newBlock = matcher === null
        ? { hooks: [clone(patchHook)] }
        : { matcher, hooks: [clone(patchHook)] };
      result.push(newBlock);
    }
  }

  return result;
}

const base = readJson(basePath);
const patch = readJson(patchPath);

const merged = {
  ...clone(base),
  ...clone(Object.fromEntries(Object.entries(patch).filter(([key]) => key !== "hooks"))),
};

const baseHooks = (base && typeof base.hooks === "object" && base.hooks !== null) ? clone(base.hooks) : {};
const patchHooks = (patch && typeof patch.hooks === "object" && patch.hooks !== null) ? patch.hooks : {};

merged.hooks = baseHooks;
for (const [eventName, patchBlocks] of Object.entries(patchHooks)) {
  merged.hooks[eventName] = mergeEventBlocks(baseHooks[eventName], patchBlocks);
}

fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2) + "\n");
NODE_EOF
}

run_or_echo() {
  local cmd="$1"
  if [[ "$MODE" == "apply" ]]; then
    eval "$cmd"
  else
    echo "[dry-run] $cmd"
  fi
}

backup_if_exists() {
  local path="$1"
  if [[ -f "$path" ]]; then
    run_or_echo "cp \"$path\" \"$path.bak.$(date +%Y%m%d%H%M%S)\""
  fi
}

ensure_runtime_gitignore_block() {
  local file_path="$1"
  local extra_entries
  extra_entries=$(cat <<'EOF_EXTRA'
.claude/.active-plan
.claude/.plan-state/
EOF_EXTRA
)
  if pi_should_enable_factor_factory "${PROJECT_INITIALIZER_PLAN_TYPE:-}"; then
    extra_entries="${extra_entries}"$'\n'"$(pi_factor_factory_gitignore_entries)"
  fi
  pi_ensure_gitignore_block "$file_path" "" "$extra_entries" "$MODE"
}

ensure_gitignore_entry() {
  local file_path="$1"
  local entry="$2"

  if [[ "$MODE" != "apply" ]]; then
    echo "[dry-run] ensure .gitignore entry: $entry"
    return
  fi

  if ! grep -Fxq "$entry" "$file_path"; then
    printf "%s\n" "$entry" >> "$file_path"
  fi
}

install_templates() {
  local repo="$1"
  pi_install_templates "$repo" "$TEMPLATE_ASSETS_DIR" "$MODE"
}

install_helpers() {
  local repo="$1"
  if [[ -d "$HELPER_ASSETS_DIR" ]]; then
    pi_install_helpers "$repo" "$HELPER_ASSETS_DIR" "$MODE" "new-plan.sh plan-to-todo.sh archive-workflow.sh verify-contract.sh check-task-sync.sh ensure-task-workflow.sh check-task-workflow.sh switch-plan.sh"
  else
    log "Helper assets not found at $HELPER_ASSETS_DIR"
  fi
}

install_skill_factory_files() {
  local repo="$1"
  pi_install_skill_factory "$repo" "$SKILL_FACTORY_ASSETS_DIR" "$SKILL_ROOT/scripts" "$MODE"
}

ensure_task_sync_package_script() {
  local repo="$1"
  local package_file="$repo/package.json"

  if [[ ! -f "$package_file" ]]; then
    if [[ "$MODE" == "apply" ]]; then
      log "package.json missing; skipped check:task-sync injection"
    else
      echo "[dry-run] package.json missing; skip task workflow script injection"
    fi
    return
  fi

  pi_ensure_task_sync "$repo" "0" "$MODE"
  if [[ "$MODE" == "apply" ]]; then
    log "Injected task workflow scripts into $package_file"
  fi
}

create_task_files_if_missing() {
  local repo="$1"

  if [[ "$MODE" != "apply" ]]; then
    echo "[dry-run] ensure tasks/todo.md, tasks/lessons.md, docs/PROGRESS.md exist with tasks-first guidance"
    return
  fi

  mkdir -p "$repo/tasks" "$repo/docs"

  if [[ ! -f "$repo/tasks/todo.md" ]]; then
    cat > "$repo/tasks/todo.md" <<'TODO_EOF'
# Task Execution Checklist (Primary)

> **Source Plan**: (none)
> **Status**: Idle
> Generate the next execution checklist from an approved plan with:
>   bash scripts/plan-to-todo.sh --plan plans/plan-YYYYMMDD-HHMM-slug.md

## Execution
- [ ] No active execution checklist

## Review Section
- Verification evidence:
- Behavior diff notes:
- Risks / follow-ups:
TODO_EOF
  fi

  if [[ ! -f "$repo/tasks/lessons.md" ]]; then
    cat > "$repo/tasks/lessons.md" <<'LESSONS_EOF'
# Lessons Learned (Self-Improvement Loop)

> Capture correction-derived prevention rules here.
> Promote repeated patterns into durable project rules during spa day.

## Template
- Date:
- Triggered by correction:
- Mistake pattern:
- Prevention rule:
- Where to apply next time:
LESSONS_EOF
  fi

  if [[ ! -f "$repo/docs/PROGRESS.md" ]]; then
    cat > "$repo/docs/PROGRESS.md" <<'PROGRESS_EOF'
# Project Milestones

> Use this file for milestone checkpoints only.
> Active execution belongs in `tasks/todo.md`, `tasks/lessons.md`, and `tasks/research.md`.

## Milestones

- [ ] First migration milestone

## Notes

- Record releases, migrations, and major checkpoints here.
PROGRESS_EOF
  elif ! grep -Fq "Use this file for milestone checkpoints only." "$repo/docs/PROGRESS.md"; then
    cp "$repo/docs/PROGRESS.md" "$repo/docs/PROGRESS.md.bak.$(date +%Y%m%d%H%M%S)"
    cat > "$repo/docs/PROGRESS.md" <<'PROGRESS_EOF'
# Project Milestones

> Use this file for milestone checkpoints only.
> Active execution belongs in `tasks/todo.md`, `tasks/lessons.md`, and `tasks/research.md`.

## Milestones

- [ ] Preserve or restore milestone history here after migration review

## Notes

- This file was normalized during migration. Re-add historical milestones if needed.
PROGRESS_EOF
  fi
}

create_research_file_if_missing() {
  local repo="$1"
  local research_file="$repo/tasks/research.md"
  local now
  now="$(date '+%Y-%m-%d %H:%M')"

  if [[ -f "$research_file" ]]; then
    return
  fi

  if [[ "$MODE" != "apply" ]]; then
    echo "[dry-run] create $research_file"
    return
  fi

  mkdir -p "$repo/tasks"

  if [[ -f "$repo/.claude/templates/research.template.md" ]]; then
    sed \
      -e "s/{{PROJECT_NAME}}/Project/g" \
      -e "s/{{DATE}}/${now}/g" \
      "$repo/.claude/templates/research.template.md" > "$research_file"
    return
  fi

  cat > "$research_file" <<EOF_RESEARCH
# Project — Research Notes

> **Last Updated**: ${now}
> **Scope**: (what area of the codebase was researched)

## Codebase Map
| File | Purpose | Key Exports |
|------|---------|-------------|

## Architecture Observations
### Patterns & Conventions
### Implicit Contracts
### Edge Cases & Intricacies

## Technical Debt / Risks

## Research Conclusions
### What to Preserve
### What to Change
### Open Questions
EOF_RESEARCH
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --repo)
        TARGET_REPO="${2:-}"
        shift 2
        ;;
      --dry-run)
        MODE="dry-run"
        shift
        ;;
      --apply)
        MODE="apply"
        shift
        ;;
      --help)
        usage
        exit 0
        ;;
      *)
        echo "Unknown argument: $1" >&2
        usage
        exit 1
        ;;
    esac
  done
}

require_repo() {
  if [[ -z "$TARGET_REPO" ]]; then
    echo "--repo is required" >&2
    usage
    exit 1
  fi

  if [[ ! -d "$TARGET_REPO" ]]; then
    echo "Repo path does not exist: $TARGET_REPO" >&2
    exit 1
  fi
}

migrate_hooks() {
  local repo="$1"
  local project_claude_dir="$repo/.claude"
  local project_hooks_dir="$project_claude_dir/hooks"
  local project_ai_hooks_dir="$repo/.ai/hooks"
  local project_settings="$project_claude_dir/settings.json"
  local project_settings_local="$project_claude_dir/settings.local.json"

  run_or_echo "mkdir -p \"$project_hooks_dir\" \"$project_ai_hooks_dir\""

  while IFS= read -r hook; do
    local rel_path dest_dir hook_name
    rel_path="${hook#"$HOOK_ASSETS_DIR"/}"
    dest_dir="$project_ai_hooks_dir/$(dirname "$rel_path")"
    hook_name="$(basename "$hook")"
    run_or_echo "mkdir -p \"$dest_dir\""
    run_or_echo "cp \"$hook\" \"$dest_dir/$hook_name\""
    if [[ "$MODE" == "apply" ]]; then
      chmod +x "$dest_dir/$hook_name" 2>/dev/null || true
    fi
  done < <(find "$HOOK_ASSETS_DIR" -type f -name '*.sh' | sort)

  if [[ -d "$HOOK_ASSETS_DIR/lib" ]]; then
    run_or_echo "mkdir -p \"$project_hooks_dir/lib\""
    run_or_echo "cp -R \"$HOOK_ASSETS_DIR/lib\"/. \"$project_hooks_dir/lib/\""
  fi

  if [[ -f "$HOOK_ASSETS_DIR/hook-input.sh" ]]; then
    run_or_echo "cp \"$HOOK_ASSETS_DIR/hook-input.sh\" \"$project_hooks_dir/hook-input.sh\""
    if [[ "$MODE" == "apply" ]]; then
      chmod +x "$project_hooks_dir/hook-input.sh" 2>/dev/null || true
    fi
  fi

  while IFS= read -r hook; do
    local hook_name shim_path
    hook_name="$(basename "$hook")"
    if [[ "$hook_name" == "hook-input.sh" ]]; then
      continue
    fi

    shim_path="$project_hooks_dir/$hook_name"
    if [[ "$MODE" == "apply" ]]; then
      cat > "$shim_path" <<EOF_HOOK_SHIM
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="\${HOOK_REPO_ROOT:-\$(cd "\$SCRIPT_DIR/../.." && pwd)}"
TARGET="\$REPO_ROOT/.ai/hooks/$hook_name"

if [[ ! -f "\$TARGET" ]]; then
  echo "[HookShim] Shared hook not found: \$TARGET" >&2
  exit 1
fi

export HOOK_REPO_ROOT="\$REPO_ROOT"
exec bash "\$TARGET" "\$@"
EOF_HOOK_SHIM
      chmod +x "$shim_path" 2>/dev/null || true
    else
      echo "[dry-run] write shim \"$shim_path\" -> \".ai/hooks/$hook_name\""
    fi
  done < <(find "$HOOK_ASSETS_DIR" -mindepth 1 -maxdepth 1 -type f -name '*.sh' | sort)

  if [[ "$MODE" == "apply" ]]; then
    if [[ -f "$project_settings" ]]; then
      if has_jq && command -v node >/dev/null 2>&1; then
        backup_if_exists "$project_settings"
        merge_hook_settings_json "$project_settings" "$HOOK_ASSETS_DIR/settings.template.json" "$project_settings.tmp"
        mv "$project_settings.tmp" "$project_settings"
        log "Merged hook template into .claude/settings.json"
      else
        log "Skipping automatic merge for .claude/settings.json because jq or node is unavailable; leaving existing file unchanged"
      fi
    else
      cp "$HOOK_ASSETS_DIR/settings.template.json" "$project_settings"
      log "Wrote .claude/settings.json from template"
    fi
  else
    echo "[dry-run] merge/copy \"$HOOK_ASSETS_DIR/settings.template.json\" -> \"$project_settings\""
  fi

  if [[ -f "$project_settings_local" ]]; then
    if [[ "$MODE" == "apply" ]]; then
      if has_jq && command -v node >/dev/null 2>&1; then
        if "$JQ_BIN" -e '.hooks != null' "$project_settings_local" >/dev/null 2>&1; then
          backup_if_exists "$project_settings_local"
          merge_hook_settings_json "$project_settings" "$project_settings_local" "$project_settings.tmp"
          mv "$project_settings.tmp" "$project_settings"
          "$JQ_BIN" 'del(.hooks)' "$project_settings_local" > "$project_settings_local.tmp"
          mv "$project_settings_local.tmp" "$project_settings_local"
          log "Moved hooks from settings.local.json into settings.json"
        fi
      else
        log "Skipping hooks migration from settings.local.json because jq or node is unavailable; leaving files unchanged"
      fi
    else
      echo "[dry-run] inspect and migrate hooks from \"$project_settings_local\" into \"$project_settings\""
    fi
  fi
}

migrate_docs() {
  local repo="$1"
  local legacy_todo="$repo/docs/TODO.md"

  if [[ -f "$legacy_todo" ]]; then
    if [[ "$MODE" == "apply" ]]; then
      rm -f "$legacy_todo"
      log "Removed legacy docs/TODO.md"
    else
      echo "[dry-run] rm -f \"$legacy_todo\""
    fi
  fi
}

migrate_workflow() {
  local repo="$1"

  run_or_echo "mkdir -p \"$repo/plans/archive\""
  run_or_echo "mkdir -p \"$repo/tasks/archive\""
  run_or_echo "mkdir -p \"$repo/tasks/contracts\""
  run_or_echo "mkdir -p \"$repo/docs/reference-configs\""

  install_templates "$repo"
  install_helpers "$repo"
  install_skill_factory_files "$repo"
  if pi_should_enable_factor_factory "${PROJECT_INITIALIZER_PLAN_TYPE:-}"; then
    pi_install_factor_factory "$repo" "$FACTOR_FACTORY_ASSETS_DIR" "$SKILL_ROOT/scripts" "$MODE"
  fi
  create_research_file_if_missing "$repo"
  create_task_files_if_missing "$repo"
  ensure_task_sync_package_script "$repo"

  if [[ -f "$repo/docs/plan.md" ]]; then
    if [[ "$MODE" == "apply" ]]; then
      rm -f "$repo/docs/plan.md"
      log "Removed legacy docs/plan.md compatibility pointer"
    else
      echo "[dry-run] rm -f \"$repo/docs/plan.md\""
    fi
  fi

  local repo_gitignore="$repo/.gitignore"
  run_or_echo "touch \"$repo_gitignore\""
  ensure_gitignore_entry "$repo_gitignore" "# Project-specific"
  ensure_gitignore_entry "$repo_gitignore" "artifacts/"
  ensure_gitignore_entry "$repo_gitignore" "coverage/"
  ensure_gitignore_entry "$repo_gitignore" "*.tar.gz"
  ensure_gitignore_entry "$repo_gitignore" "*.tgz"
  ensure_gitignore_entry "$repo_gitignore" "# Environment"
  ensure_gitignore_entry "$repo_gitignore" ".env"
  ensure_gitignore_entry "$repo_gitignore" ".env.*"
  ensure_gitignore_entry "$repo_gitignore" "!.env.example"
  ensure_gitignore_entry "$repo_gitignore" "# OS metadata"
  ensure_gitignore_entry "$repo_gitignore" ".DS_Store"
  ensure_runtime_gitignore_block "$repo_gitignore"

  local spa_protocol_repo="$repo/docs/reference-configs/spa-day-protocol.md"
  local spa_protocol_asset="$SKILL_ROOT/assets/reference-configs/spa-day-protocol.md"
  if [[ -f "$spa_protocol_asset" ]]; then
    run_or_echo "cp \"$spa_protocol_asset\" \"$spa_protocol_repo\""
  elif [[ "$MODE" == "apply" && ! -f "$spa_protocol_repo" ]]; then
    cat > "$spa_protocol_repo" <<'SPA_DAY_EOF'
# Spa Day Protocol

Periodic cleanup protocol to reduce context bloat and rule conflicts.
SPA_DAY_EOF
  else
    echo "[dry-run] ensure spa-day protocol at \"$spa_protocol_repo\""
  fi
}

print_report() {
  local repo="$1"
  echo
  echo "=== Migration Report ==="
  echo "Mode: $MODE"
  echo "Repo: $repo"
  echo "- Project hooks synced from: $HOOK_ASSETS_DIR"
  echo "- Team hook config target: .claude/settings.json"
  echo "- Legacy docs/TODO.md: removed when present"
  echo "- Workflow migration: plans/archive + tasks/archive + research + helpers + plan pointer + task-sync contract"
  echo "- Runtime temporary ignore block synced to .gitignore"
}

run_skill_hook() {
  local event="$1"
  local hook_script="$SCRIPT_DIR/run-skill-hook.ts"

  if command -v bun >/dev/null 2>&1 && [[ -f "$hook_script" ]]; then
    bun "$hook_script" "$event" --context "{\"repo\":\"$TARGET_REPO\",\"mode\":\"$MODE\"}" 2>&1 || {
      if [[ "$event" == pre-* ]]; then
        log "Pre-hook $event failed, aborting."
        return 1
      else
        log "Post-hook $event warning (non-fatal)."
      fi
    }
  fi
}

update_version_stamp() {
  local repo="$1"
  local stamp_file="$repo/.claude/.skill-version"
  local skill_version_file="$SKILL_ROOT/assets/skill-version.json"
  local sv_version="unknown"
  local sv_template_version="unknown"

  if [[ -f "$skill_version_file" ]] && command -v bun >/dev/null 2>&1; then
    sv_version=$(bun -e "console.log(JSON.parse(require('fs').readFileSync('$skill_version_file','utf-8')).version)")
    sv_template_version=$(bun -e "console.log(JSON.parse(require('fs').readFileSync('$skill_version_file','utf-8')).templateVersion)")
  elif [[ -f "$skill_version_file" ]] && command -v node >/dev/null 2>&1; then
    sv_version=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$skill_version_file','utf-8')).version)")
    sv_template_version=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$skill_version_file','utf-8')).templateVersion)")
  fi

  if [[ "$MODE" == "apply" ]]; then
    mkdir -p "$(dirname "$stamp_file")"
    cat > "$stamp_file" <<STAMP_EOF
skill_version=$sv_version
template_version=$sv_template_version
migrated_at=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
STAMP_EOF
    log "Version stamp updated: $stamp_file"
  else
    echo "[dry-run] update version stamp at $stamp_file (skill=$sv_version, template=$sv_template_version)"
  fi
}

main() {
  parse_args "$@"
  require_repo

  TARGET_REPO="$(cd "$TARGET_REPO" && pwd)"
  log "Starting migration ($MODE) for $TARGET_REPO"

  run_skill_hook "pre-migrate" || exit 1

  migrate_hooks "$TARGET_REPO"
  migrate_docs "$TARGET_REPO"
  migrate_workflow "$TARGET_REPO"
  update_version_stamp "$TARGET_REPO"
  print_report "$TARGET_REPO"

  run_skill_hook "post-migrate"
}

main "$@"
