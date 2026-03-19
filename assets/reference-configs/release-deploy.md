# Release Process & Deployment Reference

> Deep reference for production/staging/preview release automation and Cloudflare deployment patterns.

## AI-Assisted Release Workflow

```yaml
RELEASE_PROCESS:
  AI_ANALYSIS:
    INPUT: git log --oneline $(git describe --tags --abbrev=0)..HEAD
    OUTPUT:
      - Suggested version: X.Y.Z
      - Grouped changes by category
      - Breaking change warnings
      - Migration notes

  CHANGELOG_GENERATION:
    PROMPT: |
      Based on the following commits, generate a CHANGELOG entry:
      {commits}

      Current version: {current_version}
      Suggested new version: {suggested_version}

      Format as Keep a Changelog style.

  HUMAN_REVIEW:
    - Review AI-generated CHANGELOG
    - Adjust version if needed
    - Confirm migration notes

  RELEASE_COMMANDS: |
    npm version {version} --no-git-tag-version
    git add package.json CHANGELOG.md
    git commit -m "chore(release): v{version}"
    git tag -a v{version} -m "Release v{version}"
    git push origin main --tags
```

## Deployment Triggers

```yaml
DEPLOYMENT_TRIGGERS:
  PRODUCTION:
    TRIGGER: New version tag (v*)
    BRANCH: main
    ACTIONS:
      - Run full test suite
      - Build production bundle
      - Deploy to production
      - Notify team

  STAGING:
    TRIGGER: Push to develop
    BRANCH: develop
    ACTIONS:
      - Run tests
      - Build staging bundle
      - Deploy to staging
      - Run smoke tests

  PREVIEW:
    TRIGGER: PR opened/updated
    ACTIONS:
      - Build preview
      - Deploy preview URL
      - Run E2E tests
      - Post preview URL to PR
```

## Cloudflare Deployment Patterns

```yaml
CLOUDFLARE_DEPLOYMENT:
  PAGES:
    BEST_FOR: Frontend, static sites, SSR entrypoint
    COMMAND: npx wrangler pages deploy dist

  WORKERS:
    BEST_FOR: API/webhook/edge business logic
    COMMAND: npx wrangler deploy

  CONTAINERS:
    BEST_FOR: Python or heavy dependency runtime
    COMMAND: npx wrangler containers deploy

  RECOMMENDED_COMBOS:
    FRONTEND_ONLY: Pages
    FRONTEND_PLUS_API: Pages + Workers
    FULL_EDGE_STACK: Pages + Workers + D1 + R2
    AI_APP: Workers + AI Gateway + Workers AI + Vectorize
```

## GitHub Actions Example (Cloudflare)

```yaml
name: release
on:
  push:
    tags:
      - 'v*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun test
      - run: bun run build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: pages deploy dist --project-name={project_name}
```

## Runtime Version Injection

```yaml
VERSION_IN_CODE:
  VITE:
    define: __APP_VERSION__ from package.json version
  RUNTIME_CHECK:
    log: App version at startup
```

## Rollback Policy

```yaml
ROLLBACK:
  STRATEGY: revert + patch release
  STEPS:
    - git revert <release_commit>
    - bump patch version
    - tag and redeploy
  NOTE: avoid force-push on main
```
