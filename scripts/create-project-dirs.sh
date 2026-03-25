#!/bin/bash
# Create standard project directory structure
# Usage: bash scripts/create-project-dirs.sh
#
# Creates the three-layer project structure:
#   IMMUTABLE LAYER (资产层): specs, contracts, tests
#   MUTABLE LAYER (厕纸层): src
#   SUPPORTING (支撑层): docs, scripts, .ops, artifacts, tasks, plans

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_TEMPLATES_DIR="$SCRIPT_DIR/../assets/templates"
ASSETS_HOOKS_DIR="$SCRIPT_DIR/../assets/hooks"
ASSETS_SKILL_FACTORY_DIR="$SCRIPT_DIR/../assets/skill-factory"

write_runtime_gitignore_block() {
  local gitignore_file=".gitignore"
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

  if [ ! -f "$gitignore_file" ]; then
    cat > "$gitignore_file" <<'GITIGNORE_EOF'
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
GITIGNORE_EOF
  fi

  if ! grep -Fq "$begin_marker" "$gitignore_file"; then
    printf "\n%s\n" "$block" >> "$gitignore_file"
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
  ' "$gitignore_file" > "$tmp_file"
  mv "$tmp_file" "$gitignore_file"
}

write_templates() {
  mkdir -p .claude/templates

  cat > .claude/templates/spec.template.md <<'SPEC_TEMPLATE_EOF'
# Product Spec: {{PROJECT_NAME}}

> **Status**: Draft
> **Last Updated**: {{TIMESTAMP}}
> **Owner**: Planner
SPEC_TEMPLATE_EOF

  cat > .claude/templates/research.template.md <<'RESEARCH_TEMPLATE_EOF'
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
RESEARCH_TEMPLATE_EOF

  cat > .claude/templates/plan.template.md <<'PLAN_TEMPLATE_EOF'
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
PLAN_TEMPLATE_EOF

  cat > .claude/templates/contract.template.md <<'CONTRACT_TEMPLATE_EOF'
# Sprint Contract: {{TASK_SLUG}}

> **Status**: Pending
> **Plan**: {{PLAN_FILE}}
> **Owner**: {{OWNER}}
> **Last Updated**: {{TIMESTAMP}}

## Goal

Describe the exact outcome this task must deliver.

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

## Optional Visual Checks

- Screenshot path (optional):
- What to verify visually:
CONTRACT_TEMPLATE_EOF

  cat > .claude/templates/review.template.md <<'REVIEW_TEMPLATE_EOF'
# Sprint Review: {{TASK_SLUG}}

> **Status**: Pending
> **Plan**: {{PLAN_FILE}}
> **Contract**: {{CONTRACT_FILE}}
> **Checks File**: {{CHECKS_FILE}}
> **Last Updated**: {{TIMESTAMP}}
> **Recommendation**: fail
REVIEW_TEMPLATE_EOF
}

install_workflow_helpers() {
  mkdir -p scripts

  if [[ -d "$ASSETS_TEMPLATES_DIR/helpers" ]]; then
    cp "$ASSETS_TEMPLATES_DIR/helpers/"*.sh scripts/ 2>/dev/null || true
    chmod +x scripts/new-spec.sh scripts/new-sprint.sh scripts/new-plan.sh scripts/plan-to-todo.sh scripts/archive-workflow.sh scripts/prepare-handoff.sh scripts/verify-contract.sh scripts/verify-sprint.sh scripts/check-task-sync.sh scripts/ensure-task-workflow.sh scripts/check-task-workflow.sh 2>/dev/null || true
    return
  fi

  cat > scripts/new-spec.sh <<'NEW_SPEC_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: new-spec.sh"
exit 1
NEW_SPEC_STUB_EOF

  cat > scripts/new-sprint.sh <<'NEW_SPRINT_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: new-sprint.sh"
exit 1
NEW_SPRINT_STUB_EOF

  cat > scripts/new-plan.sh <<'NEW_PLAN_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: new-plan.sh"
exit 1
NEW_PLAN_STUB_EOF

  cat > scripts/prepare-handoff.sh <<'PREPARE_HANDOFF_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: prepare-handoff.sh"
exit 1
PREPARE_HANDOFF_STUB_EOF

  cat > scripts/plan-to-todo.sh <<'PLAN_TO_TODO_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: plan-to-todo.sh"
exit 1
PLAN_TO_TODO_STUB_EOF

  cat > scripts/archive-workflow.sh <<'ARCHIVE_WORKFLOW_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: archive-workflow.sh"
exit 1
ARCHIVE_WORKFLOW_STUB_EOF

  cat > scripts/verify-contract.sh <<'VERIFY_CONTRACT_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: verify-contract.sh"
exit 1
VERIFY_CONTRACT_STUB_EOF

  cat > scripts/verify-sprint.sh <<'VERIFY_SPRINT_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: verify-sprint.sh"
exit 1
VERIFY_SPRINT_STUB_EOF

  cat > scripts/check-task-sync.sh <<'CHECK_TASK_SYNC_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: check-task-sync.sh"
exit 1
CHECK_TASK_SYNC_STUB_EOF

  cat > scripts/ensure-task-workflow.sh <<'ENSURE_TASK_WORKFLOW_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: ensure-task-workflow.sh"
exit 1
ENSURE_TASK_WORKFLOW_STUB_EOF

  cat > scripts/check-task-workflow.sh <<'CHECK_TASK_WORKFLOW_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: check-task-workflow.sh"
exit 1
CHECK_TASK_WORKFLOW_STUB_EOF

  chmod +x scripts/new-spec.sh scripts/new-sprint.sh scripts/new-plan.sh scripts/plan-to-todo.sh scripts/archive-workflow.sh scripts/prepare-handoff.sh scripts/verify-contract.sh scripts/verify-sprint.sh scripts/check-task-sync.sh scripts/ensure-task-workflow.sh scripts/check-task-workflow.sh
}

install_skill_factory_files() {
  mkdir -p .claude/skill-factory scripts .ai/hooks .claude/hooks

  if [[ -d "$ASSETS_SKILL_FACTORY_DIR" ]]; then
    cp -R "$ASSETS_SKILL_FACTORY_DIR"/. .claude/skill-factory/
  fi

  if [[ -f "$SCRIPT_DIR/skill-factory-create.sh" ]]; then
    cp "$SCRIPT_DIR/skill-factory-create.sh" scripts/skill-factory-create.sh
  fi
  if [[ -f "$SCRIPT_DIR/skill-factory-check.sh" ]]; then
    cp "$SCRIPT_DIR/skill-factory-check.sh" scripts/skill-factory-check.sh
  fi

  if [[ -d "$ASSETS_HOOKS_DIR" ]]; then
    find "$ASSETS_HOOKS_DIR" -mindepth 1 -maxdepth 1 \( -type f -name '*.sh' -o -type d -name 'lib' \) | while read -r asset; do
      if [[ -d "$asset" ]]; then
        cp -R "$asset" .ai/hooks/
        cp -R "$asset" .claude/hooks/
      else
        cp "$asset" .ai/hooks/
        if [[ "$(basename "$asset")" == "hook-input.sh" ]]; then
          cp "$asset" .claude/hooks/
        fi
      fi
    done

    find "$ASSETS_HOOKS_DIR" -mindepth 1 -maxdepth 1 -type f -name '*.sh' | while read -r asset; do
      hook_name="$(basename "$asset")"
      if [[ "$hook_name" == "hook-input.sh" ]]; then
        continue
      fi

      cat > ".claude/hooks/$hook_name" <<EOF_HOOK_SHIM
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
    done
  fi

  find .ai/hooks -type f -name '*.sh' -exec chmod +x {} + 2>/dev/null || true
  find .claude/hooks -type f -name '*.sh' -exec chmod +x {} + 2>/dev/null || true
  chmod +x scripts/skill-factory-create.sh scripts/skill-factory-check.sh 2>/dev/null || true
}

ensure_task_sync_package_script() {
  local package_file="package.json"
  local project_name
  project_name="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-')"
  project_name="${project_name:-project}"

  if [[ ! -f "$package_file" ]]; then
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
    return
  fi

  echo "[warn] node not found; unable to inject task workflow scripts into package.json" >&2
}

# ===== IMMUTABLE LAYER (资产层) =====
mkdir -p specs/modules
mkdir -p contracts/modules
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e

# ===== MUTABLE LAYER (厕纸层) =====
mkdir -p src/modules

# ===== SUPPORTING (支撑层) =====
mkdir -p docs/architecture
mkdir -p docs/api
mkdir -p docs/guides
mkdir -p docs/archives
mkdir -p docs/reference-configs
mkdir -p tasks/archive
mkdir -p tasks/contracts
mkdir -p tasks/reviews
mkdir -p plans/archive
mkdir -p scripts
mkdir -p .claude/hooks
mkdir -p .ai/hooks
mkdir -p .ai/harness/checks
mkdir -p .ai/harness/handoff
mkdir -p .ops/database
mkdir -p .ops/secrets
mkdir -p artifacts

# ===== Initial Files =====
touch docs/CHANGELOG.md
touch docs/spec.md
touch docs/brief.md
touch docs/tech-stack.md
touch docs/decisions.md

touch docs/reference-configs/harness-overview.md
touch docs/reference-configs/sprint-contracts.md
touch docs/reference-configs/evaluator-rubric.md
touch docs/reference-configs/handoff-protocol.md

cat > docs/PROGRESS.md << 'PROGRESS_EOF'
# Project Milestones

> Use this file for milestone checkpoints only.
> Active execution belongs in `tasks/todo.md`, `tasks/lessons.md`, and `tasks/research.md`.

## Milestones

- [x] Repository scaffolded
- [ ] First feature milestone shipped

## Notes

- Record releases, migrations, and major checkpoints here.
PROGRESS_EOF

cat > docs/spec.md << 'SPEC_EOF'
# Product Spec

> **Status**: Draft
> **Owner**: Planner
SPEC_EOF

cat > tasks/todo.md << 'TASK_TODO_EOF'
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
TASK_TODO_EOF

cat > tasks/lessons.md << 'TASK_LESSONS_EOF'
# Lessons Learned (Self-Improvement Loop)

> Capture correction-derived prevention rules here.
> Promote repeated patterns into durable project rules during spa day.

## Template
- Date:
- Triggered by correction:
- Mistake pattern:
- Prevention rule:
- Where to apply next time:
TASK_LESSONS_EOF

cat > tasks/research.md << 'TASK_RESEARCH_EOF'
# Project Research Notes

> **Last Updated**: TBD
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
TASK_RESEARCH_EOF

cat > .ai/harness/checks/latest.json << 'CHECKS_EOF'
{}
CHECKS_EOF

cat > .ai/harness/handoff/current.md << 'HANDOFF_EOF'
# Harness Handoff

> **Reason**: scaffold
HANDOFF_EOF

write_templates
install_workflow_helpers
install_skill_factory_files
ensure_task_sync_package_script
write_runtime_gitignore_block

cp "$ASSETS_HOOKS_DIR/settings.template.json" .claude/settings.json

cat > specs/overview.md << 'SPECS_OVERVIEW_EOF'
# Project Specifications

> **Spec is the Source of Truth. 规格是唯一真理的来源。**

## How to Use

1. Write spec first, then implement
2. Changing spec = rewrite downstream
3. No implementation without spec

## Modules

- Add module specs in `modules/` directory
- Format: `{module-name}.spec.md`
SPECS_OVERVIEW_EOF

cat > contracts/types.ts << 'CONTRACTS_TYPES_EOF'
/**
 * Shared Type Definitions
 *
 * IMMUTABLE: Changes here require downstream rewrites
 */

// Add shared types here
export {}
CONTRACTS_TYPES_EOF

cat > tests/README.md << 'TESTS_README_EOF'
# Test Directory Structure

> **Test is the new Spec. 测试是唯一的真理。**

## Asset Hierarchy

Tests are IMMUTABLE ASSETS. Implementation is DISPOSABLE.

## Rules

- Test code quantity ≥ Implementation code quantity
- Test failure = Delete module and rewrite
- Never modify tests to make buggy code pass

## Running Tests

```bash
bun test              # Run all tests
bun test --coverage   # With coverage
bun test --watch      # Watch mode
```
TESTS_README_EOF

cp "$ASSETS_TEMPLATES_DIR/../reference-configs/harness-overview.md" docs/reference-configs/harness-overview.md 2>/dev/null || true
cp "$ASSETS_TEMPLATES_DIR/../reference-configs/sprint-contracts.md" docs/reference-configs/sprint-contracts.md 2>/dev/null || true
cp "$ASSETS_TEMPLATES_DIR/../reference-configs/evaluator-rubric.md" docs/reference-configs/evaluator-rubric.md 2>/dev/null || true
cp "$ASSETS_TEMPLATES_DIR/../reference-configs/handoff-protocol.md" docs/reference-configs/handoff-protocol.md 2>/dev/null || true

cat > scripts/regenerate.sh << 'REGENERATE_EOF'
#!/bin/bash
# Regenerate a module: delete implementation, keep spec/contract/tests
# Usage: ./scripts/regenerate.sh <module-name>

MODULE=$1

if [ -z "$MODULE" ]; then
  echo "Usage: ./scripts/regenerate.sh <module-name>"
  echo "Example: ./scripts/regenerate.sh auth"
  exit 1
fi

if [ ! -d "src/modules/$MODULE" ]; then
  echo "Module src/modules/$MODULE not found"
  exit 1
fi

echo "Deleting implementation: src/modules/$MODULE"
rm -rf "src/modules/$MODULE"
mkdir -p "src/modules/$MODULE"

echo "Module $MODULE cleared. Ready for rewrite."
echo ""
echo "Preserved assets:"
echo "  - specs/modules/$MODULE.spec.md"
echo "  - contracts/modules/$MODULE.contract.ts"
echo "  - tests/unit/$MODULE/"
echo "  - tests/integration/$MODULE/"
REGENERATE_EOF
chmod +x scripts/regenerate.sh

touch .ops/.gitkeep
echo "# This folder contains sensitive operations files - DO NOT COMMIT" > .ops/README.md

echo "Project directory structure created successfully."
