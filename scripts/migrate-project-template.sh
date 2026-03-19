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
HOOK_ASSETS_DIR="$SKILL_ROOT/assets/hooks"
TEMPLATE_ASSETS_DIR="$SKILL_ROOT/assets/templates"
HELPER_ASSETS_DIR="$TEMPLATE_ASSETS_DIR/helpers"
SKILL_FACTORY_ASSETS_DIR="$SKILL_ROOT/assets/skill-factory"

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
  local begin_marker="# BEGIN: claude-runtime-temp (managed by project-initializer)"
  local end_marker="# END: claude-runtime-temp"

  local block
  block=$(cat <<'BLOCK_EOF'
# BEGIN: claude-runtime-temp (managed by project-initializer)
.claude/settings.local.json
.claude/.atomic_pending
.claude/.session-id
.claude/.tool-call-count
.claude/.session-handoff.md
.claude/.task-state.json
.claude/.task-handoff.md
.claude/.skill-factory-state.json
.claude/.skill-factory-session.json
.claude/.skill-factory-session-marker.json
.claude/.skill-factory-user/
.claude/.context-pressure/
.claude/*.tmp
.claude/*.bak
.claude/*.bak.*
.claude/*.backup-*
# END: claude-runtime-temp
BLOCK_EOF
)

  if [[ "$MODE" != "apply" ]]; then
    echo "[dry-run] ensure managed runtime block in $file_path"
    return
  fi

  mkdir -p "$(dirname "$file_path")"
  if [[ ! -f "$file_path" ]]; then
    touch "$file_path"
  fi

  if ! grep -Fq "$begin_marker" "$file_path"; then
    printf "\n%s\n" "$block" >> "$file_path"
    return
  fi

  local tmp_file
  tmp_file="$(mktemp)"
  awk -v begin="$begin_marker" -v end="$end_marker" -v repl="$block" '
    $0 == begin {
      print repl
      skipping = 1
      next
    }
    skipping && $0 == end {
      skipping = 0
      next
    }
    !skipping { print }
  ' "$file_path" > "$tmp_file"
  mv "$tmp_file" "$file_path"
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
  local templates_dir="$repo/.claude/templates"

  run_or_echo "mkdir -p \"$templates_dir\""

  if [[ -f "$TEMPLATE_ASSETS_DIR/research.template.md" ]]; then
    run_or_echo "cp \"$TEMPLATE_ASSETS_DIR/research.template.md\" \"$templates_dir/research.template.md\""
  fi
  if [[ -f "$TEMPLATE_ASSETS_DIR/plan.template.md" ]]; then
    run_or_echo "cp \"$TEMPLATE_ASSETS_DIR/plan.template.md\" \"$templates_dir/plan.template.md\""
  fi
  if [[ -f "$TEMPLATE_ASSETS_DIR/contract.template.md" ]]; then
    run_or_echo "cp \"$TEMPLATE_ASSETS_DIR/contract.template.md\" \"$templates_dir/contract.template.md\""
  fi
}

install_helpers() {
  local repo="$1"
  local scripts_dir="$repo/scripts"

  run_or_echo "mkdir -p \"$scripts_dir\""

  if [[ -d "$HELPER_ASSETS_DIR" ]]; then
    run_or_echo "cp \"$HELPER_ASSETS_DIR/new-plan.sh\" \"$scripts_dir/new-plan.sh\""
    run_or_echo "cp \"$HELPER_ASSETS_DIR/plan-to-todo.sh\" \"$scripts_dir/plan-to-todo.sh\""
    run_or_echo "cp \"$HELPER_ASSETS_DIR/archive-workflow.sh\" \"$scripts_dir/archive-workflow.sh\""
    run_or_echo "cp \"$HELPER_ASSETS_DIR/verify-contract.sh\" \"$scripts_dir/verify-contract.sh\""
    run_or_echo "cp \"$HELPER_ASSETS_DIR/check-task-sync.sh\" \"$scripts_dir/check-task-sync.sh\""
    run_or_echo "cp \"$HELPER_ASSETS_DIR/ensure-task-workflow.sh\" \"$scripts_dir/ensure-task-workflow.sh\""
    run_or_echo "cp \"$HELPER_ASSETS_DIR/check-task-workflow.sh\" \"$scripts_dir/check-task-workflow.sh\""
    if [[ "$MODE" == "apply" ]]; then
      chmod +x "$scripts_dir/new-plan.sh" "$scripts_dir/plan-to-todo.sh" "$scripts_dir/archive-workflow.sh" "$scripts_dir/verify-contract.sh" "$scripts_dir/check-task-sync.sh" "$scripts_dir/ensure-task-workflow.sh" "$scripts_dir/check-task-workflow.sh" || true
    fi
  else
    log "Helper assets not found at $HELPER_ASSETS_DIR"
  fi
}

install_skill_factory_files() {
  local repo="$1"
  local scripts_dir="$repo/scripts"
  local skill_factory_dir="$repo/.claude/skill-factory"

  run_or_echo "mkdir -p \"$scripts_dir\" \"$skill_factory_dir\""

  if [[ -d "$SKILL_FACTORY_ASSETS_DIR" ]]; then
    run_or_echo "cp -R \"$SKILL_FACTORY_ASSETS_DIR\"/. \"$skill_factory_dir/\""
  fi

  if [[ -f "$SKILL_ROOT/scripts/skill-factory-create.sh" ]]; then
    run_or_echo "cp \"$SKILL_ROOT/scripts/skill-factory-create.sh\" \"$scripts_dir/skill-factory-create.sh\""
  fi
  if [[ -f "$SKILL_ROOT/scripts/skill-factory-check.sh" ]]; then
    run_or_echo "cp \"$SKILL_ROOT/scripts/skill-factory-check.sh\" \"$scripts_dir/skill-factory-check.sh\""
  fi

  if [[ "$MODE" == "apply" ]]; then
    chmod +x "$scripts_dir/skill-factory-create.sh" "$scripts_dir/skill-factory-check.sh" 2>/dev/null || true
  fi
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

  if [[ "$MODE" != "apply" ]]; then
    echo "[dry-run] inject task workflow scripts into $package_file"
    return
  fi

  if command -v node >/dev/null 2>&1; then
    node -e '
const fs = require("fs");
const file = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
pkg.private ??= true;
pkg.scripts ??= {};
pkg.scripts["check:task-sync"] = "bash scripts/check-task-sync.sh";
pkg.scripts["check:task-workflow"] = "bash scripts/check-task-workflow.sh --strict";
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
' "$package_file"
    log "Injected task workflow scripts into $package_file"
    return
  fi

  log "Warning: node not found. Could not inject task workflow scripts into $package_file"
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

  backup_if_exists "$project_settings"

  if [[ "$MODE" == "apply" ]]; then
    if [[ -f "$project_settings" ]] && command -v jq >/dev/null 2>&1; then
      jq -s '.[0] * .[1]' "$project_settings" "$HOOK_ASSETS_DIR/settings.template.json" > "$project_settings.tmp"
      mv "$project_settings.tmp" "$project_settings"
      log "Merged hook template into .claude/settings.json"
    else
      cp "$HOOK_ASSETS_DIR/settings.template.json" "$project_settings"
      log "Wrote .claude/settings.json from template"
    fi
  else
    echo "[dry-run] merge/copy \"$HOOK_ASSETS_DIR/settings.template.json\" -> \"$project_settings\""
  fi

  if [[ -f "$project_settings_local" ]]; then
    if [[ "$MODE" == "apply" ]]; then
      if command -v jq >/dev/null 2>&1; then
        if jq -e '.hooks != null' "$project_settings_local" >/dev/null 2>&1; then
          backup_if_exists "$project_settings_local"
          jq -s '.[0] * {hooks: ((.[0].hooks // {}) * (.[1].hooks // {}))}' \
            "$project_settings" "$project_settings_local" > "$project_settings.tmp"
          mv "$project_settings.tmp" "$project_settings"
          jq 'del(.hooks)' "$project_settings_local" > "$project_settings_local.tmp"
          mv "$project_settings_local.tmp" "$project_settings_local"
          log "Moved hooks from settings.local.json into settings.json"
        fi
      else
        log "jq not found; cannot auto-migrate hooks from settings.local.json"
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
