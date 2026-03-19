# AI-Driven Version Control Strategy Reference

> Extracted from `05-workflow.partial.md` — detailed git branch and commit conventions.

```yaml
GIT_BRANCH_STRATEGY:
  main:
    PURPOSE: Production-ready code
    PROTECTION: Require PR, no direct push
    DEPLOYS_TO: Production

  develop:
    PURPOSE: Integration branch
    PROTECTION: Require PR from feature branches
    DEPLOYS_TO: Staging

  feature/*:
    NAMING: feature/{ticket-id}-{short-description}
    EXAMPLE: feature/PROJ-123-add-user-auth
    LIFECYCLE: Branch from develop -> PR to develop -> Delete after merge

  hotfix/*:
    NAMING: hotfix/{ticket-id}-{description}
    EXAMPLE: hotfix/PROJ-456-fix-login-crash
    LIFECYCLE: Branch from main -> PR to main + develop -> Delete after merge
    TRIGGERS: PATCH version bump

COMMIT_MESSAGE_FORMAT:
  PATTERN: "{type}({scope}): {description}"
  TYPES:
    - feat     # New feature -> MINOR bump
    - fix      # Bug fix -> PATCH bump
    - docs     # Documentation only
    - style    # Formatting, no code change
    - refactor # Code restructure, no behavior change
    - perf     # Performance improvement -> MINOR bump
    - test     # Adding tests
    - chore    # Build, CI, dependencies
    - breaking # Breaking change -> MAJOR bump (use with feat/fix)

  EXAMPLES:
    - "feat(auth): add OAuth2 login support"
    - "fix(api): resolve null pointer in user endpoint"
    - "breaking(api): remove deprecated v1 endpoints"
    - "chore(deps): upgrade React to v19"

AI_CHANGELOG_GENERATION:
  TRIGGER: Before each release
  COMMAND: "Generate CHANGELOG from commits since last tag"
  PROCESS:
    1. AI scans commits since last version tag
    2. Groups by type (feat -> Added, fix -> Fixed, etc.)
    3. Extracts scope for categorization
    4. Generates human-readable descriptions
    5. Suggests version bump based on commit types

  AUTO_VERSION_RULES:
    - Has "breaking" or "BREAKING CHANGE" -> MAJOR
    - Has "feat" -> MINOR
    - Only "fix", "docs", "chore" -> PATCH
```
