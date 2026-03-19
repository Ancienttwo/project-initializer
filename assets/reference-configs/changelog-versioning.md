# Changelog & Versioning Reference

> Extracted from `05-workflow.partial.md` — detailed templates for changelog and semantic versioning.

```yaml
docs/CHANGELOG.md:
  PURPOSE: Version history for releases
  FORMAT: Keep a Changelog (https://keepachangelog.com/)
  VERSIONING: Semantic Versioning (https://semver.org/)

VERSION_FORMAT: MAJOR.MINOR.PATCH
  MAJOR: Breaking changes, incompatible API changes
  MINOR: New features, backward compatible
  PATCH: Bug fixes, backward compatible

CHANGELOG_SECTIONS:
  - Added      # New features
  - Changed    # Changes in existing functionality
  - Deprecated # Soon-to-be removed features
  - Removed    # Removed features
  - Fixed      # Bug fixes
  - Security   # Security vulnerabilities

RELEASE_RULES:
  PATCH_TRIGGERS:
    - Bug fixes
    - Typo corrections
    - Documentation updates
    - Dependency patches (non-breaking)

  MINOR_TRIGGERS:
    - New features (backward compatible)
    - New API endpoints
    - New components/modules
    - Deprecation notices
    - Performance improvements

  MAJOR_TRIGGERS:
    - Breaking API changes
    - Database schema changes (non-backward compatible)
    - Removed features
    - Major architecture changes
    - Dependency major version upgrades

PRE_RELEASE_TAGS:
  - alpha   # Early development, unstable
  - beta    # Feature complete, testing
  - rc      # Release candidate, final testing
  # Example: 2.0.0-alpha.1, 2.0.0-beta.2, 2.0.0-rc.1

CHANGELOG_TEMPLATE: |
  ## [Unreleased]

  ## [X.Y.Z] - YYYY-MM-DD
  ### Added
  - New feature description

  ### Changed
  - Change description

  ### Fixed
  - Bug fix description
```
