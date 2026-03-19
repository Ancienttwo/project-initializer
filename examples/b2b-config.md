# Example: Minimal B2B SaaS Config

Sample output from `/project-init` with Plan C (B2B SaaS):

```markdown
# my-saas-app Development Guide

> **Service Target**: Development Team
> **Interaction Style**: Professional English
> **Runtime Mode**: Plan-only
> **Runtime Profile**: Plan-only (recommended)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite 6.x + React 19 + TypeScript |
| Routing | TanStack Router |
| Data | TanStack Query + Zustand |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Supabase |
```

For full enterprise examples, see `references/tech-stacks.md`.

Notes:
- For Plan C (B2B SaaS), package manager default is typically `bun`.
- For Python-centric presets (Plan G/H), default package manager is `uv`.
