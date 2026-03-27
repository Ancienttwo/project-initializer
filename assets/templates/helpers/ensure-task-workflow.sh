#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

usage() {
  cat <<'USAGE_EOF'
Usage: scripts/ensure-task-workflow.sh [--slug <slug>] [--title <title>]
USAGE_EOF
}

normalize_slug() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-{2,}/-/g'
}

get_active_plan() {
  if [[ -f ".claude/.active-plan" ]]; then
    local marker_plan
    marker_plan="$(cat ".claude/.active-plan" 2>/dev/null | xargs)"
    if [[ -n "$marker_plan" && -f "$marker_plan" ]]; then
      printf '%s' "$marker_plan"
      return 0
    fi
  fi
  local latest
  latest="$(find plans -maxdepth 1 -type f -name 'plan-*.md' 2>/dev/null | sort | tail -1)"
  if [[ -n "$latest" ]]; then
    printf '%s' "$latest"
    return 0
  fi
  return 1
}

ensure_templates() {
  mkdir -p .claude/templates

  if [[ ! -f ".claude/templates/spec.template.md" ]]; then
    cat > .claude/templates/spec.template.md <<'SPEC_TEMPLATE_EOF'
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
SPEC_TEMPLATE_EOF
  fi

  if [[ ! -f ".claude/templates/research.template.md" ]]; then
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
  fi

  if [[ ! -f ".claude/templates/plan.template.md" ]]; then
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

## Annotations
<!-- [NOTE]: prefixed inline. Claude processes all and revises. -->

## Task Breakdown
- [ ] ...
PLAN_TEMPLATE_EOF
  fi

  if [[ ! -f ".claude/templates/contract.template.md" ]]; then
    cat > .claude/templates/contract.template.md <<'CONTRACT_TEMPLATE_EOF'
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
CONTRACT_TEMPLATE_EOF
  fi

  if [[ ! -f ".claude/templates/review.template.md" ]]; then
    cat > .claude/templates/review.template.md <<'REVIEW_TEMPLATE_EOF'
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
REVIEW_TEMPLATE_EOF
  fi
}

ensure_idle_todo() {
  mkdir -p tasks
  if [[ ! -f "tasks/todo.md" ]]; then
    cat > tasks/todo.md <<'TODO_EOF'
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
}

ensure_auxiliary_files() {
  mkdir -p plans plans/archive tasks/archive tasks/contracts tasks/reviews docs scripts .ai/harness/checks .ai/harness/handoff

  if [[ ! -f "docs/spec.md" ]]; then
    cat > docs/spec.md <<'SPEC_EOF'
# Product Spec

> **Status**: Draft
> **Owner**: Planner
SPEC_EOF
  fi

  if [[ ! -f "tasks/lessons.md" ]]; then
    cat > tasks/lessons.md <<'LESSONS_EOF'
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

  if [[ ! -f "tasks/research.md" ]]; then
    cat > tasks/research.md <<'RESEARCH_EOF'
# Project — Research Notes

> **Last Updated**: TBD
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
RESEARCH_EOF
  fi

  if [[ ! -f "docs/PROGRESS.md" ]]; then
    cat > docs/PROGRESS.md <<'PROGRESS_EOF'
# Project Milestones

> Use this file for milestone checkpoints only.
> Active execution belongs in `tasks/todo.md`, `tasks/lessons.md`, and `tasks/research.md`.

## Milestones

- [ ] First milestone

## Notes

- Record releases, migrations, and major checkpoints here.
PROGRESS_EOF
  fi

  if [[ ! -f ".ai/harness/checks/latest.json" ]]; then
    echo "{}" > ".ai/harness/checks/latest.json"
  fi

  if [[ ! -f ".ai/harness/handoff/current.md" ]]; then
    cat > ".ai/harness/handoff/current.md" <<'HANDOFF_EOF'
# Harness Handoff

> **Reason**: bootstrap
HANDOFF_EOF
  fi
}

slug=""
title=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug)
      [[ -n "${2:-}" ]] || { echo "Error: --slug requires a value" >&2; usage; exit 1; }
      slug="$2"
      shift 2
      ;;
    --title)
      [[ -n "${2:-}" ]] || { echo "Error: --title requires a value" >&2; usage; exit 1; }
      title="$2"
      shift 2
      ;;
    --help|-h)
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

ensure_templates
ensure_auxiliary_files
ensure_idle_todo

active_plan="$(get_active_plan || true)"
if [[ -n "$active_plan" ]]; then
  echo "Workflow ready. Active plan: $active_plan"
  exit 0
fi

if [[ ! -f "docs/spec.md" ]]; then
  if [[ -x "scripts/new-spec.sh" ]]; then
    bash "scripts/new-spec.sh"
  fi
fi

if [[ -z "$slug" ]]; then
  echo "Workflow ready. No active plan present."
  echo "Create one with: bash scripts/ensure-task-workflow.sh --slug <slug> --title <title>"
  exit 0
fi

slug="$(normalize_slug "$slug")"
if [[ -z "$slug" ]]; then
  echo "Slug is empty after normalization" >&2
  exit 1
fi

if [[ -z "$title" ]]; then
  title="$slug"
fi

if [[ -x "scripts/new-plan.sh" ]]; then
  bash "scripts/new-plan.sh" --slug "$slug" --title "$title"
else
  echo "Missing scripts/new-plan.sh" >&2
  exit 1
fi
