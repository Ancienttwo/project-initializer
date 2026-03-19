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
# Task Contract: {{TASK_SLUG}}

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
}

install_workflow_helpers() {
  mkdir -p scripts

  if [[ -d "$ASSETS_TEMPLATES_DIR/helpers" ]]; then
    cp "$ASSETS_TEMPLATES_DIR/helpers/"*.sh scripts/ 2>/dev/null || true
    chmod +x scripts/new-plan.sh scripts/plan-to-todo.sh scripts/archive-workflow.sh scripts/verify-contract.sh scripts/check-task-sync.sh scripts/ensure-task-workflow.sh scripts/check-task-workflow.sh 2>/dev/null || true
    return
  fi

  cat > scripts/new-plan.sh <<'NEW_PLAN_STUB_EOF'
#!/bin/bash
set -euo pipefail
echo "Missing helper template: new-plan.sh"
exit 1
NEW_PLAN_STUB_EOF

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

  chmod +x scripts/new-plan.sh scripts/plan-to-todo.sh scripts/archive-workflow.sh scripts/verify-contract.sh scripts/check-task-sync.sh scripts/ensure-task-workflow.sh scripts/check-task-workflow.sh
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
mkdir -p plans/archive
mkdir -p scripts
mkdir -p .claude/hooks
mkdir -p .ai/hooks
mkdir -p .ops/database
mkdir -p .ops/secrets
mkdir -p artifacts

# ===== Initial Files =====
touch docs/CHANGELOG.md
touch docs/brief.md
touch docs/tech-stack.md
touch docs/decisions.md

touch docs/reference-configs/changelog-versioning.md
touch docs/reference-configs/git-strategy.md
touch docs/reference-configs/release-deploy.md
touch docs/reference-configs/ai-workflows.md
touch docs/reference-configs/coding-standards.md
touch docs/reference-configs/development-protocol.md
touch docs/reference-configs/workflow-orchestration.md
cat > docs/reference-configs/spa-day-protocol.md <<'SPA_DAY_EOF'
# Spa Day Protocol

Periodic cleanup protocol to reduce context bloat and rule conflicts.

## 1. Rule Consolidation
- Merge overlapping rules in `docs/reference-configs/`.
- Remove contradictory instructions and keep one canonical rule per topic.

## 2. CLAUDE/AGENTS Routing Freshness
- Verify all routed paths still exist.
- Remove stale references from CLAUDE.md/AGENTS.md indexes.

## 3. Lessons Graduation
- Promote repeated lessons from `tasks/lessons.md` into durable rules.
- Archive one-off or obsolete lessons.

## 4. Research Pruning
- Remove already-implemented investigation items from `tasks/research.md`.
- Keep only unresolved findings and open questions.

## 5. Docs Reality Check
- Sync `docs/architecture.md` and `docs/tech-stack.md` with current codebase.
- Flag drift for immediate correction.

## 6. Contract Hygiene
- Move fulfilled contracts from `tasks/contracts/` into an archive folder if needed.
- Keep active contracts only for in-flight tasks.
SPA_DAY_EOF

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

write_templates
install_workflow_helpers
install_skill_factory_files
ensure_task_sync_package_script
write_runtime_gitignore_block

cat > .claude/settings.json << 'PROJECT_SETTINGS_EOF'
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" worktree-guard.sh" },
          { "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" pre-edit-guard.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" post-edit-guard.sh" }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" post-bash.sh" }
        ]
      },
      {
        "hooks": [
          { "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" context-pressure-hook.sh" }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{ "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" prompt-guard.sh" }]
      }
    ],
    "Stop": [
      {
        "hooks": [{ "type": "command", "command": "repo=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0; HOOK_REPO_ROOT=\"$repo\" bash \"$repo/.ai/hooks/run-hook.sh\" skill-factory-session-end.sh" }]
      }
    ]
  }
}
PROJECT_SETTINGS_EOF

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

cat > docs/reference-configs/changelog-versioning.md << 'REF_CHANGELOG_EOF'
# Changelog & Versioning Reference

Use this file for detailed release-note and semantic-versioning rules.
REF_CHANGELOG_EOF

cat > docs/reference-configs/git-strategy.md << 'REF_GIT_EOF'
# Git Strategy Reference

Use this file for branch model and commit convention details.
REF_GIT_EOF

cat > docs/reference-configs/release-deploy.md << 'REF_RELEASE_EOF'
# Release & Deployment Reference

Use this file for release pipeline and deployment trigger details.
REF_RELEASE_EOF

cat > docs/reference-configs/ai-workflows.md << 'REF_AIWF_EOF'
# AI Workflows Reference

Use this file for extended AI workflow templates, tasks-first session handoff, and milestone-only progress guidance.
REF_AIWF_EOF

cat > docs/reference-configs/coding-standards.md << 'REF_CODING_STANDARDS_EOF'
# Coding Standards Reference

Use this file for detailed coding constraints and refactor thresholds.
REF_CODING_STANDARDS_EOF

cat > docs/reference-configs/development-protocol.md << 'REF_DEV_PROTOCOL_EOF'
# Development Protocol Reference

Use this file for detailed feature/bug flow playbooks, repo-local task sync rules, and final response requirements.
REF_DEV_PROTOCOL_EOF

cat > docs/reference-configs/workflow-orchestration.md << 'REF_WORKFLOW_ORCH_EOF'
# Workflow Orchestration Reference

Use this file for advanced plan/execution orchestration patterns.
REF_WORKFLOW_ORCH_EOF

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
