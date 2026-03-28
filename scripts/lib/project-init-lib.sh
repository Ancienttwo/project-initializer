#!/bin/bash
# Shared install helpers for project-initializer scaffolding scripts.

PI_RUNTIME_BLOCK_BEGIN="# BEGIN: claude-runtime-temp (managed by project-initializer)"
PI_RUNTIME_BLOCK_END="# END: claude-runtime-temp"
PI_DEFAULT_GITIGNORE_CONTENT=$(cat <<'EOF_GITIGNORE'
# Dependencies
node_modules/

# Build artifacts
artifacts/
coverage/
*.tar.gz
*.tgz

# Environment
.env
.env.*
!.env.example

# OS metadata
.DS_Store
EOF_GITIGNORE
)
PI_DEFAULT_RUNTIME_ENTRIES=$(cat <<'EOF_RUNTIME'
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
.claude/.memory-context.json
.claude/.memory-snapshot.json
.claude/.skill-factory-user/
.claude/.context-pressure/
.claude/*.tmp
.claude/*.bak
.claude/*.bak.*
.claude/*.backup-*
EOF_RUNTIME
)
PI_TEMPLATE_RESEARCH=$(cat <<'EOF_TEMPLATE_RESEARCH'
# {{PROJECT_NAME}} — Research Notes

> **Last Updated**: {{DATE}}
> **Scope**: (what area of the codebase was researched)
> **Usage**: Store deep codebase findings and hidden contracts here, not in chat-only summaries.

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
EOF_TEMPLATE_RESEARCH
)
PI_TEMPLATE_SPEC=$(cat <<'EOF_TEMPLATE_SPEC'
# Product Spec: {{PROJECT_NAME}}

> **Status**: Draft
> **Last Updated**: {{TIMESTAMP}}
> **Owner**: Planner

## Product Outcome

Describe the stable user or operator outcome this repo should deliver.

## Success Criteria

- Primary workflow:
- Quality bar:
- Out of scope:

## Constraints

- Technical:
- Compliance:
- Delivery:

## Acceptance Scenarios

- Given
  When
  Then

## Open Questions

- ...
EOF_TEMPLATE_SPEC
)
PI_TEMPLATE_PLAN=$(cat <<'EOF_TEMPLATE_PLAN'
# Plan: {{TITLE}}

> **Status**: Draft
> **Created**: {{TIMESTAMP}}
> **Slug**: {{SLUG}}
> **Research**: See `tasks/research.md`

## Approach
### Strategy
### Trade-offs
| Option | Pros | Cons | Decision |
|--------|------|------|----------|

## Detailed Design
### File Changes
| File | Action | Description |
|------|--------|-------------|

### Code Snippets
### Data Flow

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|

## Task Contracts
- Contract file: `tasks/contracts/{{SLUG}}.contract.md`
- Template: `.claude/templates/contract.template.md`
- Verification command: `bash scripts/verify-contract.sh --contract tasks/contracts/{{SLUG}}.contract.md --strict`
- Active plan rule: the latest non-archived `plans/plan-*.md` file is the current plan

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] ...
EOF_TEMPLATE_PLAN
)
PI_TEMPLATE_CONTRACT=$(cat <<'EOF_TEMPLATE_CONTRACT'
# Task Contract: {{TASK_SLUG}}

> **Status**: Pending
> **Plan**: {{PLAN_FILE}}
> **Owner**: {{OWNER}}
> **Last Updated**: {{TIMESTAMP}}
> **Review File**: `tasks/reviews/{{TASK_SLUG}}.review.md`

## Goal

Describe the exact outcome this task must deliver.

## Scope

- In scope:
- Out of scope:

## Allowed Paths

```yaml
allowed_paths:
  - plans/
  - tasks/todo.md
  - tasks/contracts/{{TASK_SLUG}}.contract.md
  - tasks/reviews/{{TASK_SLUG}}.review.md
  - src/
  - tests/
```

## Exit Criteria (Machine Verifiable)

```yaml
exit_criteria:
  files_exist:
    - src/modules/{{TASK_SLUG}}/index.ts
  tests_pass:
    - path: tests/unit/{{TASK_SLUG}}.test.ts
  commands_succeed:
    - bun run typecheck
  files_contain:
    - path: src/modules/{{TASK_SLUG}}/index.ts
      pattern: "export"
```

## Acceptance Notes (Human Review)

- Functional behavior:
- Edge cases:
- Regression risks:

## Rollback Point

- Commit / checkpoint:
- Revert strategy:
EOF_TEMPLATE_CONTRACT
)
PI_TEMPLATE_REVIEW=$(cat <<'EOF_TEMPLATE_REVIEW'
# Sprint Review: {{TASK_SLUG}}

> **Status**: Pending
> **Plan**: {{PLAN_FILE}}
> **Contract**: {{CONTRACT_FILE}}
> **Checks File**: {{CHECKS_FILE}}
> **Last Updated**: {{TIMESTAMP}}
> **Recommendation**: fail

## Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Functionality | 0/10 | |
| Product depth | 0/10 | |
| Design quality | 0/10 | |
| Code quality | 0/10 | |

## Failing Items

- ...

## Retest Steps

- Re-run:
- Re-check:

## Summary

- ...
EOF_TEMPLATE_REVIEW
)

pi_write_file_if_apply() {
  local mode="${1:-apply}"
  local path="$2"
  local content="$3"

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] write $path"
    return 0
  fi

  mkdir -p "$(dirname "$path")"
  printf '%s\n' "$content" > "$path"
}

pi_copy_file_if_apply() {
  local mode="${1:-apply}"
  local src="$2"
  local dest="$3"
  local src_abs=""
  local dest_abs=""

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] cp \"$src\" \"$dest\""
    return 0
  fi

  src_abs="$(cd "$(dirname "$src")" && pwd)/$(basename "$src")"
  dest_abs="$(cd "$(dirname "$dest")" && pwd)/$(basename "$dest")"

  if [[ "$src_abs" == "$dest_abs" ]]; then
    return 0
  fi

  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
}

pi_ensure_executable_if_apply() {
  local mode="${1:-apply}"
  shift || true

  if [[ "$mode" != "apply" || "$#" -eq 0 ]]; then
    return 0
  fi

  chmod +x "$@" 2>/dev/null || true
}

pi_default_runtime_block() {
  local extra_entries="${1:-}"
  local runtime_entries="$PI_DEFAULT_RUNTIME_ENTRIES"

  if [[ -n "$extra_entries" ]]; then
    runtime_entries="${runtime_entries}"$'\n'"${extra_entries}"
  fi

  printf '%s\n%s\n%s\n' "$PI_RUNTIME_BLOCK_BEGIN" "$runtime_entries" "$PI_RUNTIME_BLOCK_END"
}

pi_ensure_gitignore_block() {
  local file_path="$1"
  local prelude="${2:-}"
  local extra_entries="${3:-}"
  local mode="${4:-apply}"
  local block

  block="$(pi_default_runtime_block "$extra_entries")"

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] ensure managed runtime block in $file_path"
    return 0
  fi

  mkdir -p "$(dirname "$file_path")"
  if [[ ! -f "$file_path" ]]; then
    if [[ -n "$prelude" ]]; then
      printf '%s\n' "$prelude" > "$file_path"
    else
      touch "$file_path"
    fi
  fi

  if ! grep -Fq "$PI_RUNTIME_BLOCK_BEGIN" "$file_path"; then
    printf '\n%s\n' "$block" >> "$file_path"
    return 0
  fi

  local tmp_file
  local block_written=0
  tmp_file="$(mktemp)"

  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == "$PI_RUNTIME_BLOCK_BEGIN" ]]; then
      if [[ "$block_written" -eq 0 ]]; then
        printf '%s\n' "$block" >> "$tmp_file"
        block_written=1
      fi

      while IFS= read -r inner_line || [[ -n "$inner_line" ]]; do
        if [[ "$inner_line" == "$PI_RUNTIME_BLOCK_END" ]]; then
          break
        fi
      done
      continue
    fi

    printf '%s\n' "$line" >> "$tmp_file"
  done < "$file_path"

  mv "$tmp_file" "$file_path"
}

pi_install_templates() {
  local target_dir="$1"
  local templates_dir="$2"
  local mode="${3:-apply}"
  local output_dir="$target_dir/.claude/templates"

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] install templates into $output_dir"
    return 0
  fi

  mkdir -p "$output_dir"

  if [[ -f "$templates_dir/research.template.md" ]]; then
    cp "$templates_dir/research.template.md" "$output_dir/research.template.md"
  else
    printf '%s\n' "$PI_TEMPLATE_RESEARCH" > "$output_dir/research.template.md"
  fi

  if [[ -f "$templates_dir/spec.template.md" ]]; then
    cp "$templates_dir/spec.template.md" "$output_dir/spec.template.md"
  else
    printf '%s\n' "$PI_TEMPLATE_SPEC" > "$output_dir/spec.template.md"
  fi

  if [[ -f "$templates_dir/plan.template.md" ]]; then
    cp "$templates_dir/plan.template.md" "$output_dir/plan.template.md"
  else
    printf '%s\n' "$PI_TEMPLATE_PLAN" > "$output_dir/plan.template.md"
  fi

  if [[ -f "$templates_dir/contract.template.md" ]]; then
    cp "$templates_dir/contract.template.md" "$output_dir/contract.template.md"
  else
    printf '%s\n' "$PI_TEMPLATE_CONTRACT" > "$output_dir/contract.template.md"
  fi

  if [[ -f "$templates_dir/review.template.md" ]]; then
    cp "$templates_dir/review.template.md" "$output_dir/review.template.md"
  else
    printf '%s\n' "$PI_TEMPLATE_REVIEW" > "$output_dir/review.template.md"
  fi
}

pi_install_helpers() {
  local target_dir="$1"
  local helpers_dir="$2"
  local mode="${3:-apply}"
  local helper_names="${4:-new-plan.sh plan-to-todo.sh archive-workflow.sh prepare-handoff.sh verify-contract.sh summarize-failures.sh check-task-sync.sh ensure-task-workflow.sh check-task-workflow.sh}"
  local scripts_dir="$target_dir/scripts"
  local helper_name

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] install helpers into $scripts_dir"
    return 0
  fi

  mkdir -p "$scripts_dir"

  if [[ -d "$helpers_dir" ]]; then
    for helper_name in $helper_names; do
      if [[ -f "$helpers_dir/$helper_name" ]]; then
        cp "$helpers_dir/$helper_name" "$scripts_dir/$helper_name"
      fi
    done
    pi_ensure_executable_if_apply "$mode" "$scripts_dir"/new-plan.sh "$scripts_dir"/plan-to-todo.sh "$scripts_dir"/archive-workflow.sh "$scripts_dir"/prepare-handoff.sh "$scripts_dir"/verify-contract.sh "$scripts_dir"/summarize-failures.sh "$scripts_dir"/check-task-sync.sh "$scripts_dir"/ensure-task-workflow.sh "$scripts_dir"/check-task-workflow.sh "$scripts_dir"/switch-plan.sh
    return 0
  fi

  for helper_name in $helper_names; do
    cat > "$scripts_dir/$helper_name" <<EOF_STUB
#!/bin/bash
set -euo pipefail
echo "Missing helper template: $helper_name"
exit 1
EOF_STUB
  done
  pi_ensure_executable_if_apply "$mode" "$scripts_dir"/*.sh
}

pi_install_skill_factory() {
  local target_dir="$1"
  local skill_factory_assets_dir="$2"
  local scripts_source_dir="$3"
  local mode="${4:-apply}"
  local scripts_dir="$target_dir/scripts"
  local skill_factory_dir="$target_dir/.claude/skill-factory"

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] install skill factory assets into $target_dir"
    return 0
  fi

  mkdir -p "$scripts_dir" "$skill_factory_dir"

  if [[ -d "$skill_factory_assets_dir" ]]; then
    cp -R "$skill_factory_assets_dir"/. "$skill_factory_dir/"
  fi

  if [[ -f "$scripts_source_dir/skill-factory-create.sh" ]]; then
    pi_copy_file_if_apply "$mode" "$scripts_source_dir/skill-factory-create.sh" "$scripts_dir/skill-factory-create.sh"
  fi
  if [[ -f "$scripts_source_dir/skill-factory-check.sh" ]]; then
    pi_copy_file_if_apply "$mode" "$scripts_source_dir/skill-factory-check.sh" "$scripts_dir/skill-factory-check.sh"
  fi

  pi_ensure_executable_if_apply "$mode" "$scripts_dir/skill-factory-create.sh" "$scripts_dir/skill-factory-check.sh"
}

pi_resolve_js_runtime() {
  if command -v node >/dev/null 2>&1; then
    printf 'node'
    return 0
  fi

  if command -v bun >/dev/null 2>&1; then
    printf 'bun'
    return 0
  fi

  if [[ -x "${HOME}/.bun/bin/bun" ]]; then
    printf '%s' "${HOME}/.bun/bin/bun"
    return 0
  fi

  return 1
}

pi_ensure_task_sync() {
  local target_dir="$1"
  local create_if_missing="${2:-0}"
  local mode="${3:-apply}"
  local package_file="$target_dir/package.json"
  local js_runtime
  local project_name

  if [[ ! -f "$package_file" && "$create_if_missing" != "1" ]]; then
    if [[ "$mode" != "apply" ]]; then
      echo "[dry-run] package.json missing; skip task workflow script injection"
    fi
    return 0
  fi

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] inject task workflow scripts into $package_file"
    return 0
  fi

  if [[ ! -f "$package_file" ]]; then
    project_name="$(basename "$target_dir" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-')"
    project_name="${project_name:-project}"
    cat > "$package_file" <<EOF_PACKAGE
{
  "name": "$project_name",
  "private": true,
  "scripts": {
    "check:task-sync": "bash scripts/check-task-sync.sh",
    "check:task-workflow": "bash scripts/check-task-workflow.sh --strict"
  }
}
EOF_PACKAGE
    return 0
  fi

  js_runtime="$(pi_resolve_js_runtime || true)"
  if [[ -z "$js_runtime" ]]; then
    echo "[warn] no JavaScript runtime found; unable to inject task workflow scripts into $package_file" >&2
    return 0
  fi

  "$js_runtime" -e '
const fs = require("fs");
const file = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
pkg.private ??= true;
pkg.scripts ??= {};
pkg.scripts["check:task-sync"] = "bash scripts/check-task-sync.sh";
pkg.scripts["check:task-workflow"] = "bash scripts/check-task-workflow.sh --strict";
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
' "$package_file"
}

pi_factor_factory_gitignore_entries() {
  printf '%s\n' ".claude/.factor-cache/"
}

pi_should_enable_factor_factory() {
  local plan_type="${1:-${PROJECT_INITIALIZER_PLAN_TYPE:-}}"
  local explicit="${PROJECT_INITIALIZER_FACTOR_FACTORY:-0}"

  case "$explicit" in
    1|true|TRUE|yes|YES) return 0 ;;
  esac

  [[ "$plan_type" == "G" ]]
}

pi_install_factor_factory() {
  local target_dir="$1"
  local factor_assets_dir="$2"
  local scripts_source_dir="$3"
  local mode="${4:-apply}"
  local scripts_dir="$target_dir/scripts"
  local factors_dir="$target_dir/tasks/factors"
  local cache_dir="$target_dir/.claude/.factor-cache/candidates"
  local registry_template="$factor_assets_dir/factor-registry.template.json"
  local hypothesis_template="$factor_assets_dir/factor-hypothesis.template.md"
  local report_template="$factor_assets_dir/factor-backtest-report.template.md"

  if [[ "$mode" != "apply" ]]; then
    echo "[dry-run] install factor factory assets into $target_dir"
    return 0
  fi

  mkdir -p "$factors_dir/promoted" "$cache_dir" "$scripts_dir"

  if [[ -f "$registry_template" ]]; then
    cp "$registry_template" "$factors_dir/registry.json"
  fi

  if [[ -f "$hypothesis_template" ]]; then
    mkdir -p "$target_dir/.claude/factor-factory"
    cp "$hypothesis_template" "$target_dir/.claude/factor-factory/hypothesis.template.md"
  fi

  if [[ -f "$report_template" ]]; then
    mkdir -p "$target_dir/.claude/factor-factory"
    cp "$report_template" "$target_dir/.claude/factor-factory/backtest-report.template.md"
  fi

  local factor_script
  for factor_script in factor-lab-new.sh factor-lab-promote.sh factor-lab-reject.sh factor-lab-check.sh; do
    if [[ -f "$scripts_source_dir/$factor_script" ]]; then
      cp "$scripts_source_dir/$factor_script" "$scripts_dir/$factor_script"
    fi
  done

  pi_ensure_executable_if_apply "$mode" "$scripts_dir"/factor-lab-*.sh
}
