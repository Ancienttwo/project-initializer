#!/bin/bash
# Claude Code Plugin Auto-Setup Script
# Part of project-initializer skill
# Installs global plugins and configures global hooks in ~/.claude/settings.json.
# Project-local hooks (.claude/settings.json in a repo) are configured separately.
# Default runtime profile:
#   - Plan + Permissionless
#   - Codex full access (danger-full-access + approval_policy=never semantics)
#   - Claude --dangerously-skip-permissions
#   - Worktree warning by default (opt-in enforcement) + atomic checkpoint commits

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
HOOKS_DIR="$CLAUDE_DIR/hooks"
PLUGINS_REPO="https://github.com/anthropics/claude-plugins-official.git"
AST_GREP_REPO="https://github.com/ast-grep/claude-skill.git"
OBSIDIAN_REPO="https://github.com/kepano/obsidian-skills.git"
SUPERPOWERS_MARKETPLACE="obra/superpowers-marketplace"
SUPERPOWERS_PLUGIN_ID="superpowers@superpowers-marketplace"

# Essential plugins that must be installed
ESSENTIAL_PLUGINS=(
    "feature-dev"
    "frontend-design"
    "code-simplifier"
    "code-review"
    "hookify"
)

# Recommended optional plugins
OPTIONAL_PLUGINS=(
    "commit-commands"
    "pr-review-toolkit"
    "security-guidance"
    "agent-sdk-dev"
    "ralph-loop"
)

default_lsp_for_project_type() {
    case "$1" in
        "plan-a"|"plan-c"|"plan-d"|"plan-e"|"plan-f"|"plan-i"|"plan-j"|"plan-k")
            echo "typescript-lsp"
            ;;
        "plan-b")
            echo "jdtls-lsp"
            ;;
        "plan-f-swift")
            echo "swift-lsp"
            ;;
        "plan-f-kotlin")
            echo "kotlin-lsp"
            ;;
        "plan-g")
            echo "pyright-lsp"
            ;;
        "plan-h"|"plan-j-rust")
            echo "rust-analyzer-lsp"
            ;;
        *)
            echo ""
            ;;
    esac
}

print_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     Claude Code Plugin Auto-Setup                        ║"
    echo "║     Plan + Permissionless runtime profile                ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

check_ast_grep() {
    if command -v ast-grep &> /dev/null || command -v sg &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} ast-grep CLI is installed"
        return 0
    else
        echo -e "  ${YELLOW}!${NC} ast-grep CLI not found"
        echo -e "    Install with: ${CYAN}brew install ast-grep${NC} or ${CYAN}npm install -g @ast-grep/cli${NC}"
        return 1
    fi
}

install_ast_grep_skill() {
    echo -e "${BLUE}Setting up ast-grep skill...${NC}"
    if [ -d "$CLAUDE_DIR/ast-grep-skill" ]; then
        echo -e "  Updating existing ast-grep skill..."
        cd "$CLAUDE_DIR/ast-grep-skill" && git pull --quiet 2>/dev/null || true
        cd - > /dev/null
    else
        echo -e "  Cloning ast-grep skill..."
        git clone --quiet "$AST_GREP_REPO" "$CLAUDE_DIR/ast-grep-skill" 2>/dev/null || {
            echo -e "  ${YELLOW}!${NC} Could not clone ast-grep skill"
            return 1
        }
    fi

    # Create skill directory and copy files
    mkdir -p "$SKILLS_DIR/ast-grep"

    # Copy skill file
    if [ -f "$CLAUDE_DIR/ast-grep-skill/ast-grep.md" ]; then
        cp "$CLAUDE_DIR/ast-grep-skill/ast-grep.md" "$SKILLS_DIR/ast-grep/SKILL.md"
        echo -e "  ${GREEN}✓${NC} ast-grep skill installed"
    elif [ -f "$CLAUDE_DIR/ast-grep-skill/skill.md" ]; then
        cp "$CLAUDE_DIR/ast-grep-skill/skill.md" "$SKILLS_DIR/ast-grep/SKILL.md"
        echo -e "  ${GREEN}✓${NC} ast-grep skill installed"
    elif [ -f "$CLAUDE_DIR/ast-grep-skill/SKILL.md" ]; then
        cp "$CLAUDE_DIR/ast-grep-skill/SKILL.md" "$SKILLS_DIR/ast-grep/"
        echo -e "  ${GREEN}✓${NC} ast-grep skill installed"
    else
        # Find any .md file in the repo (except README)
        for md_file in "$CLAUDE_DIR/ast-grep-skill"/*.md; do
            if [ -f "$md_file" ] && [ "$(basename "$md_file")" != "README.md" ]; then
                cp "$md_file" "$SKILLS_DIR/ast-grep/SKILL.md"
                echo -e "  ${GREEN}✓${NC} ast-grep skill installed"
                break
            fi
        done
    fi
}

install_permissionless_policy_hooks() {
    echo -e "${BLUE}Installing policy hooks (worktree + atomic commit)...${NC}"
    mkdir -p "$HOOKS_DIR"

    cat > "$HOOKS_DIR/worktree-guard.sh" << 'EOF'
#!/bin/bash
# Global Worktree Guard — warn by default, block only when marker exists.
set -u

# Resolve repo root — hooks may run from any cwd
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true
if [ -z "$REPO_ROOT" ]; then
  REPO_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || true
fi
if [ -n "$REPO_ROOT" ]; then
  cd "$REPO_ROOT" 2>/dev/null || true
fi

REQUIRE_MARKER=".claude/.require-worktree"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[WorktreeGuard] Not a git repository. Skip worktree policy check."
  exit 0
fi

GIT_DIR="$(git rev-parse --git-dir 2>/dev/null || true)"
if [[ "$GIT_DIR" == *".git/worktrees/"* ]]; then
  exit 0
fi

if [[ -f "$REQUIRE_MARKER" ]]; then
  echo "[WorktreeGuard] Mutation blocked: primary working tree detected ($GIT_DIR)."
  echo "  Enforcement marker found: $REQUIRE_MARKER"
  echo "  Use linked worktree for write operations."
  exit 1
fi

echo "[WorktreeGuard] Warning: primary working tree detected ($GIT_DIR)."
echo "  To enforce linked worktrees, create $REQUIRE_MARKER"
exit 0
EOF

    cat > "$HOOKS_DIR/atomic-pending.sh" << 'EOF'
#!/bin/bash
# Global Atomic Pending Marker — marks pending checkpoint state.
set -u

# Resolve repo root — hooks may run from any cwd
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true
if [ -z "$REPO_ROOT" ]; then
  REPO_ROOT="$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)" || true
fi
if [ -n "$REPO_ROOT" ]; then
  cd "$REPO_ROOT" 2>/dev/null || true
fi

mkdir -p ".claude" >/dev/null 2>&1 || true
date "+%Y-%m-%d %H:%M:%S" > ".claude/.atomic_pending" 2>/dev/null || true
exit 0
EOF

    cat > "$HOOKS_DIR/hook-input.sh" << 'EOF'
#!/bin/bash
# Shared input parsing helpers for hook scripts.
# Prefers stdin JSON, with env/argv fallbacks for compatibility.

# Resolve repo root — hooks may run from any cwd
if [[ -z "${HOOK_REPO_ROOT:-}" ]]; then
  HOOK_REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || true
  if [[ -z "$HOOK_REPO_ROOT" ]]; then
    HOOK_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." 2>/dev/null && pwd)" || true
  fi
  if [[ -n "$HOOK_REPO_ROOT" ]]; then
    cd "$HOOK_REPO_ROOT" 2>/dev/null || true
  fi
  export HOOK_REPO_ROOT
fi

hook_read_stdin_once() {
  if [[ -n "${HOOK_STDIN_JSON+x}" ]]; then
    return
  fi

  if [[ -t 0 ]]; then
    HOOK_STDIN_JSON=""
    return
  fi

  HOOK_STDIN_JSON="$(cat 2>/dev/null || true)"
}

hook_json_get() {
  local path="$1"
  local default_value="${2:-}"
  local parsed=""

  hook_read_stdin_once

  if [[ -n "$HOOK_STDIN_JSON" ]] && command -v jq >/dev/null 2>&1; then
    parsed="$(printf '%s' "$HOOK_STDIN_JSON" | jq -r "$path // empty" 2>/dev/null || true)"
  fi

  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
  else
    printf '%s' "$default_value"
  fi
}

hook_parse_json_arg() {
  local raw_arg="${1:-}"
  local path="$2"

  if [[ -z "$raw_arg" ]]; then
    return
  fi

  if command -v jq >/dev/null 2>&1 && printf '%s' "$raw_arg" | jq -e . >/dev/null 2>&1; then
    printf '%s' "$raw_arg" | jq -r "$path // empty" 2>/dev/null || true
  fi
}

hook_get_file_path() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.tool_input.file_path' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  if [[ -n "${CLAUDE_FILE_PATH:-}" ]]; then
    printf '%s' "$CLAUDE_FILE_PATH"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.tool_input.file_path')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "$arg"
}

hook_get_prompt() {
  local arg="${1:-}"
  local parsed=""

  parsed="$(hook_json_get '.user_message' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  if [[ -n "${PROMPT:-}" ]]; then
    printf '%s' "$PROMPT"
    return
  fi

  parsed="$(hook_parse_json_arg "$arg" '.user_message')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "$arg"
}
EOF

    cat > "$HOOKS_DIR/atomic-commit.sh" << 'EOF'
#!/bin/bash
# Global Atomic Commit Hook — commit after successful green checks.
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "$SCRIPT_DIR/hook-input.sh"

EXIT_CODE="${2:-${EXIT_CODE:-1}}"
MARKER=".claude/.atomic_pending"

get_tool_command() {
  local parsed=""

  parsed="$(hook_json_get '.tool_input.command' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  parsed="$(hook_json_get '.tool_input.raw_command' '')"
  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  if [[ -n "${TOOL_INPUT:-}" ]] && command -v jq >/dev/null 2>&1 && printf '%s' "$TOOL_INPUT" | jq -e . >/dev/null 2>&1; then
    parsed="$(printf '%s' "$TOOL_INPUT" | jq -r '.command // .raw_command // empty' 2>/dev/null || true)"
  fi

  if [[ -n "$parsed" ]]; then
    printf '%s' "$parsed"
    return
  fi

  printf '%s' "${TOOL_COMMAND:-}"
}

TOOL_COMMAND="$(get_tool_command)"

if [[ "$EXIT_CODE" != "0" ]]; then
  exit 0
fi

if ! echo "$TOOL_COMMAND" | grep -Eiq '(^|[[:space:]])(test|typecheck|lint|build)([[:space:]]|$)'; then
  exit 0
fi

if [[ ! -f "$MARKER" ]]; then
  exit 0
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  rm -f "$MARKER" >/dev/null 2>&1 || true
  exit 0
fi

if git diff --quiet && git diff --cached --quiet; then
  rm -f "$MARKER" >/dev/null 2>&1 || true
  exit 0
fi

git add -A
STAMP="$(date '+%Y-%m-%d %H:%M:%S')"
if git commit -m "chore(atom): checkpoint $STAMP" >/dev/null 2>&1; then
  echo "[AtomicCommit] Checkpoint committed: $STAMP"
  rm -f "$MARKER" >/dev/null 2>&1 || true
else
  echo "[AtomicCommit] Checkpoint commit skipped (commit failed)."
fi

exit 0
EOF

    chmod +x "$HOOKS_DIR/worktree-guard.sh" "$HOOKS_DIR/atomic-pending.sh" "$HOOKS_DIR/hook-input.sh" "$HOOKS_DIR/atomic-commit.sh"
    echo -e "  ${GREEN}✓${NC} Policy hooks installed to $HOOKS_DIR"
}

install_superpowers_plugin() {
    local settings_file="$CLAUDE_DIR/settings.json"
    local configured=false

    echo -e "${BLUE}Configuring Superpowers plugin (default)...${NC}"

    if command_exists claude; then
        if claude plugin marketplace add "$SUPERPOWERS_MARKETPLACE" >/dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} Marketplace added: $SUPERPOWERS_MARKETPLACE"
        else
            echo -e "  ${YELLOW}!${NC} Marketplace add skipped (already added or command unavailable)"
        fi

        if claude plugin install "$SUPERPOWERS_PLUGIN_ID" >/dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} Installed: $SUPERPOWERS_PLUGIN_ID"
            configured=true
        else
            echo -e "  ${YELLOW}!${NC} Could not install via CLI, falling back to settings.json enablement"
        fi
    else
        echo -e "  ${YELLOW}!${NC} Claude CLI not found, enabling in settings.json only"
    fi

    if [ -f "$settings_file" ] && command_exists jq; then
        jq --arg id "$SUPERPOWERS_PLUGIN_ID" \
          '.enabledPlugins = (.enabledPlugins // {}) | .enabledPlugins[$id] = true' \
          "$settings_file" > "$settings_file.new" && mv "$settings_file.new" "$settings_file"
        echo -e "  ${GREEN}✓${NC} Enabled in settings: $SUPERPOWERS_PLUGIN_ID"
        configured=true
    elif [ ! -f "$settings_file" ]; then
        cat > "$settings_file" << SETTINGS_EOF
{
  "enabledPlugins": {
    "$SUPERPOWERS_PLUGIN_ID": true
  }
}
SETTINGS_EOF
        echo -e "  ${GREEN}✓${NC} Created settings and enabled: $SUPERPOWERS_PLUGIN_ID"
        configured=true
    elif ! command_exists jq; then
        echo -e "  ${YELLOW}!${NC} jq not found; could not merge into existing settings.json"
    fi

    if [ "$configured" = false ]; then
        echo -e "  ${YELLOW}!${NC} Manual fallback:"
        echo -e "    claude plugin marketplace add $SUPERPOWERS_MARKETPLACE"
        echo -e "    claude plugin install $SUPERPOWERS_PLUGIN_ID"
    fi
}

configure_hooks() {
    local hook_type="$1"
    echo -e "${BLUE}Configuring hooks ($hook_type)...${NC}"

    # Backup existing settings
    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        cp "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/settings.json.backup-$(date +%Y%m%d_%H%M%S)"
    fi

    case "$hook_type" in
        "standard")
            cat > "$CLAUDE_DIR/settings.json.hooks" << 'HOOKS_EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '\u001b[1;33m[Guard] Quality guard active...\u001b[0m'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/worktree-guard.sh" },
          { "type": "command", "command": "echo '\u001b[0;34m[Guard] Code modification detected\u001b[0m'" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/atomic-pending.sh" }
        ]
      },
      {
        "matcher": "Bash\\(.*test.*\\)",
        "hooks": [
          { "type": "command", "command": "echo '\u001b[0;32m[Guard] Tests completed\u001b[0m'" }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/atomic-commit.sh" }
        ]
      }
    ]
  }
}
HOOKS_EOF
            ;;
        "minimal")
            cat > "$CLAUDE_DIR/settings.json.hooks" << 'HOOKS_EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '\u001b[1;33m[Guard] Quality guard active...\u001b[0m'"
          }
        ]
      }
    ]
  }
}
HOOKS_EOF
            ;;
        "biome")
            cat > "$CLAUDE_DIR/settings.json.hooks" << 'HOOKS_EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '\u001b[1;33m[Guard] Quality guard + Biome active...\u001b[0m'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/worktree-guard.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/atomic-pending.sh" }
        ]
      },
      {
        "matcher": "Write\\(.*\\.(ts|tsx|js|jsx|json)\\)",
        "hooks": [
          { "type": "command", "command": "bunx biome check --write \"$CLAUDE_FILE_PATH\" 2>&1 | head -10" }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/atomic-commit.sh" }
        ]
      }
    ]
  }
}
HOOKS_EOF
            ;;
        "biome-strict")
            cat > "$CLAUDE_DIR/settings.json.hooks" << 'HOOKS_EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '\u001b[1;33m[Guard] Quality guard + Biome CI active...\u001b[0m'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/worktree-guard.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/atomic-pending.sh" }
        ]
      },
      {
        "matcher": "Write\\(.*\\.(ts|tsx|js|jsx)\\)",
        "hooks": [
          { "type": "command", "command": "bunx biome ci \"$CLAUDE_FILE_PATH\" 2>&1 | head -20" }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bash ~/.claude/hooks/atomic-commit.sh" }
        ]
      }
    ]
  }
}
HOOKS_EOF
            ;;
        *)
            echo -e "  ${YELLOW}Skipping hook configuration${NC}"
            return
            ;;
    esac

    # Merge hooks into settings.json
    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        # Use jq if available, otherwise simple merge
        if command -v jq &> /dev/null; then
            jq -s '.[0] * .[1]' "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/settings.json.hooks" > "$CLAUDE_DIR/settings.json.new"
            mv "$CLAUDE_DIR/settings.json.new" "$CLAUDE_DIR/settings.json"
        else
            echo -e "  ${YELLOW}jq not found, creating new settings.json${NC}"
            cat "$CLAUDE_DIR/settings.json.hooks" > "$CLAUDE_DIR/settings.json"
        fi
    else
        cat "$CLAUDE_DIR/settings.json.hooks" > "$CLAUDE_DIR/settings.json"
    fi

    rm -f "$CLAUDE_DIR/settings.json.hooks"
    echo -e "  ${GREEN}✓${NC} Hooks configured"
}

add_permissions() {
    echo -e "${BLUE}Adding compatibility allow-list permissions...${NC}"

    # Create permissions array
    local permissions='[
      "Skill(feature-dev)",
      "Skill(feature-dev:*)",
      "Skill(frontend-design)",
      "Skill(frontend-design:*)",
      "Skill(code-simplifier)",
      "Skill(code-simplifier:*)",
      "Skill(code-review)",
      "Skill(code-review:*)",
      "Skill(ast-grep)",
      "Skill(ast-grep:*)",
      "Skill(commit-commands)",
      "Skill(commit-commands:*)",
      "Skill(pr-review-toolkit)",
      "Skill(pr-review-toolkit:*)"
    ]'

    if command -v jq &> /dev/null && [ -f "$CLAUDE_DIR/settings.json" ]; then
        # Merge permissions using jq
        jq --argjson perms "$permissions" '.permissions.allow = (.permissions.allow // []) + $perms | .permissions.allow |= unique' \
            "$CLAUDE_DIR/settings.json" > "$CLAUDE_DIR/settings.json.new"
        mv "$CLAUDE_DIR/settings.json.new" "$CLAUDE_DIR/settings.json"
        echo -e "  ${GREEN}✓${NC} Compatibility permissions added"
    else
        echo -e "  ${YELLOW}!${NC} Could not add compatibility permissions (jq required for merge)"
    fi
}

print_summary() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  Setup Complete!                                         ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Installed plugins:${NC}"
    for plugin in "${ESSENTIAL_PLUGINS[@]}"; do
        if [ -d "$SKILLS_DIR/$plugin" ]; then
            echo -e "  ${GREEN}✓${NC} $plugin"
        fi
    done
    if [ -d "$SKILLS_DIR/ast-grep" ]; then
        echo -e "  ${GREEN}✓${NC} ast-grep"
    fi
    if [ -f "$CLAUDE_DIR/settings.json" ] && grep -q "\"$SUPERPOWERS_PLUGIN_ID\"[[:space:]]*:[[:space:]]*true" "$CLAUDE_DIR/settings.json"; then
        echo -e "  ${GREEN}✓${NC} $SUPERPOWERS_PLUGIN_ID (default)"
    fi

    # Show LSP plugin if installed
    for lsp in typescript-lsp pyright-lsp rust-analyzer-lsp jdtls-lsp; do
        if [ -d "$SKILLS_DIR/$lsp" ]; then
            echo -e "  ${GREEN}✓${NC} $lsp (LSP)"
        fi
    done

    # Show optional plugins if installed
    for plugin in "${OPTIONAL_PLUGINS[@]}"; do
        if [ -d "$SKILLS_DIR/$plugin" ]; then
            echo -e "  ${GREEN}✓${NC} $plugin (optional)"
        fi
    done

    echo ""
    echo -e "${BLUE}Default runtime profile:${NC}"
    echo -e "  - Plan + Permissionless"
    echo -e "  - Codex: Full access semantics (danger-full-access + approval_policy=never)"
    echo -e "  - Claude: --dangerously-skip-permissions"
    echo -e "  - Mutations: primary tree warning; enforce via .claude/.require-worktree"
    echo -e "  - Commits: atomic checkpoints after green checks"
    echo ""
    echo -e "${BLUE}Available commands:${NC}"
    echo -e "  /feature-dev      - Guided feature development"
    echo -e "  /frontend-design  - Production-grade UI creation"
    echo -e "  /code-simplifier  - Code simplification"
    echo -e "  /code-review      - Code quality review"
    echo -e "  /ast-grep         - AST-based code search"
    if [ -d "$SKILLS_DIR/hookify" ]; then
        echo -e "  /hookify          - Smart hook creation (auto-detect bad behaviors)"
    fi
    if [ -d "$SKILLS_DIR/ralph-loop" ]; then
        echo -e "  /ralph-loop       - Iterative TDD workflow automation"
    fi
    echo ""
    echo -e "${YELLOW}Restart Claude Code to apply changes.${NC}"
}

# Main execution
main() {
    local install_optional=false
    local install_obsidian=false
    local hook_type="standard"

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --with-optional)
                install_optional=true
                shift
                ;;
            --with-obsidian)
                install_obsidian=true
                shift
                ;;
            --hooks)
                hook_type="$2"
                shift 2
                ;;
            --no-hooks)
                hook_type="none"
                shift
                ;;
            --lsp)
                lsp_plugin="$2"
                shift 2
                ;;
            --project-type)
                project_type="$2"
                shift 2
                ;;
            --help)
                echo "Usage: setup-plugins.sh [options]"
                echo ""
                echo "Default behavior: installs essential plugins + enables $SUPERPOWERS_PLUGIN_ID"
                echo "Runtime defaults: Plan + Permissionless, Codex full access semantics,"
                echo "  Claude --dangerously-skip-permissions, worktree-warning mutations (opt-in enforcement),"
                echo "  atomic checkpoint commits after green checks."
                echo ""
                echo "Options:"
                echo "  --with-optional    Install optional plugins (commit-commands, pr-review-toolkit, ralph-loop, etc.)"
                echo "  --with-obsidian    Install Obsidian skills"
                echo "  --hooks TYPE       Hook type: standard (default), minimal, biome, biome-strict, none"
                echo "  --no-hooks         Skip hook configuration"
                echo "  --lsp PLUGIN       Install specific LSP plugin (e.g., typescript-lsp, pyright-lsp)"
                echo "  --project-type TYPE  Auto-select LSP by project type"
                echo "  --help             Show this help"
                echo ""
                echo "Hook types:"
                echo "  standard      - Worktree guard + atomic commits + quality reminders (default)"
                echo "  minimal       - Only UserPromptSubmit quality guard"
                echo "  biome         - Standard profile + Biome auto-check on write"
                echo "  biome-strict  - Standard profile + Biome CI mode (fails on warnings)"
                echo ""
                echo "LSP by project type:"
                echo "  plan-a (Remix)           -> typescript-lsp"
                echo "  plan-b (UmiJS/Java)      -> jdtls-lsp"
                echo "  plan-c (Vite+TanStack)   -> typescript-lsp"
                echo "  plan-d (Monorepo)        -> typescript-lsp"
                echo "  plan-e (Astro Landing)   -> typescript-lsp"
                echo "  plan-f (Expo Mobile)     -> typescript-lsp"
                echo "  plan-f-swift (iOS)       -> swift-lsp"
                echo "  plan-f-kotlin (Android)  -> kotlin-lsp"
                echo "  plan-g (FastAPI Python)  -> pyright-lsp"
                echo "  plan-h (Rust Trading)    -> rust-analyzer-lsp"
                echo "  plan-i (Web3 DApp)       -> typescript-lsp"
                echo "  plan-j (TUI OpenTUI/Ink) -> typescript-lsp"
                echo "  plan-j-rust (Ratatui)    -> rust-analyzer-lsp"
                echo "  plan-k (Bun+Hono Agent)  -> typescript-lsp"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Auto-select LSP based on project type if specified
    if [ -n "$project_type" ] && [ -z "$lsp_plugin" ]; then
        lsp_plugin="$(default_lsp_for_project_type "$project_type")"
        if [ -n "$lsp_plugin" ]; then
            echo -e "${BLUE}Auto-selected LSP for $project_type: $lsp_plugin${NC}"
        fi
    fi

    print_banner

    # Create necessary directories
    echo -e "${YELLOW}Creating directories...${NC}"
    mkdir -p "$SKILLS_DIR" "$HOOKS_DIR"

    # Install runtime policy hooks (global ~/.claude/hooks)
    install_permissionless_policy_hooks

    # Clone or update official plugins
    echo -e "${YELLOW}Setting up official plugins repository...${NC}"
    if [ -d "$CLAUDE_DIR/plugins-official" ]; then
        echo -e "  Updating existing plugins..."
        cd "$CLAUDE_DIR/plugins-official" && git pull --quiet 2>/dev/null || true
        cd - > /dev/null
    else
        echo -e "  Cloning official plugins..."
        git clone --quiet "$PLUGINS_REPO" "$CLAUDE_DIR/plugins-official" 2>/dev/null || {
            echo -e "  ${RED}✗${NC} Could not clone official plugins"
            exit 1
        }
    fi

    # Install essential plugins
    echo ""
    echo -e "${BLUE}Installing Essential Plugins:${NC}"
    for plugin in "${ESSENTIAL_PLUGINS[@]}"; do
        if [ -d "$CLAUDE_DIR/plugins-official/plugins/$plugin" ]; then
            cp -r "$CLAUDE_DIR/plugins-official/plugins/$plugin" "$SKILLS_DIR/"
            echo -e "  ${GREEN}✓${NC} $plugin"
        else
            echo -e "  ${RED}✗${NC} $plugin (not found in official repo)"
        fi
    done

    # Install ast-grep skill
    echo ""
    check_ast_grep || true
    install_ast_grep_skill || true

    # Install optional plugins if requested
    if [ "$install_optional" = true ]; then
        echo ""
        echo -e "${BLUE}Installing Optional Plugins:${NC}"
        for plugin in "${OPTIONAL_PLUGINS[@]}"; do
            if [ -d "$CLAUDE_DIR/plugins-official/plugins/$plugin" ]; then
                cp -r "$CLAUDE_DIR/plugins-official/plugins/$plugin" "$SKILLS_DIR/"
                echo -e "  ${GREEN}✓${NC} $plugin"
            fi
        done
    fi

    # Install Obsidian skills if requested
    if [ "$install_obsidian" = true ]; then
        echo ""
        echo -e "${BLUE}Setting up Obsidian skills...${NC}"
        if [ -d "$CLAUDE_DIR/obsidian-skills" ]; then
            cd "$CLAUDE_DIR/obsidian-skills" && git pull --quiet 2>/dev/null || true
            cd - > /dev/null
        else
            git clone --quiet "$OBSIDIAN_REPO" "$CLAUDE_DIR/obsidian-skills" 2>/dev/null || {
                echo -e "  ${YELLOW}!${NC} Could not clone Obsidian skills"
            }
        fi

        # Copy Obsidian skills
        if [ -d "$CLAUDE_DIR/obsidian-skills" ]; then
            for skill_dir in "$CLAUDE_DIR/obsidian-skills"/*/; do
                if [ -d "$skill_dir" ]; then
                    skill_name=$(basename "$skill_dir")
                    cp -r "$skill_dir" "$SKILLS_DIR/"
                    echo -e "  ${GREEN}✓${NC} $skill_name"
                fi
            done
        fi
    fi

    # Install LSP plugin if specified
    if [ -n "$lsp_plugin" ]; then
        echo ""
        echo -e "${BLUE}Installing LSP Plugin:${NC}"
        if [ -d "$CLAUDE_DIR/plugins-official/plugins/$lsp_plugin" ]; then
            cp -r "$CLAUDE_DIR/plugins-official/plugins/$lsp_plugin" "$SKILLS_DIR/"
            echo -e "  ${GREEN}✓${NC} $lsp_plugin"

            # Add LSP-specific instructions
            case "$lsp_plugin" in
                "typescript-lsp")
                    echo -e "  ${CYAN}ℹ${NC} TypeScript LSP provides type checking and diagnostics"
                    echo -e "    Ensure tsconfig.json is properly configured"
                    ;;
                "pyright-lsp")
                    echo -e "  ${CYAN}ℹ${NC} Pyright LSP provides Python type checking"
                    echo -e "    Install Pyright: ${CYAN}npm install -g pyright${NC}"
                    ;;
                "rust-analyzer-lsp")
                    echo -e "  ${CYAN}ℹ${NC} Rust Analyzer provides Rust IDE features"
                    echo -e "    Install: ${CYAN}rustup component add rust-analyzer${NC}"
                    ;;
                "jdtls-lsp")
                    echo -e "  ${CYAN}ℹ${NC} Eclipse JDT LS provides Java IDE features"
                    echo -e "    Requires Java 17+ and jdtls installation"
                    ;;
            esac
        else
            echo -e "  ${RED}✗${NC} $lsp_plugin (not found in official repo)"
            echo -e "  ${YELLOW}!${NC} Available LSP plugins: typescript-lsp, pyright-lsp, rust-analyzer-lsp, jdtls-lsp"
        fi
    fi

    # Configure hooks (global ~/.claude/settings.json)
    echo ""
    echo -e "${CYAN}ℹ${NC} Configuring global hooks in ~/.claude/settings.json"
    echo -e "${CYAN}ℹ${NC} Project-local hooks are configured separately in each repo (.claude/settings.json)"
    configure_hooks "$hook_type"

    # Add permissions
    echo ""
    add_permissions

    # Configure Superpowers marketplace plugin (default)
    echo ""
    install_superpowers_plugin

    # Print summary
    print_summary
}

# Run main function
main "$@"
