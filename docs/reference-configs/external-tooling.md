# External Tooling

Generated repos route external tooling by task shape:

- `gstack` for complex planning, review, QA, release, and browser-first workflows
- `Waza` for short implementation loops, debugging, read/write, and lightweight checks
- `gbrain` for knowledge capture, repo sync, and handoff retrieval

## Detect Safely

Use `bash scripts/check-agent-tooling.sh` for a read-only advisory report.

Supported flags:

- `--host claude|codex|both`
- `--json`
- `--check-updates`

The detector intentionally avoids side-effecting commands. It does not run:

- `gstack setup`
- `npx skills update`
- `gbrain serve`
- `gbrain sync`

## Install

### gstack

Claude Code:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Codex:

```bash
test -d ~/.claude/skills/gstack || git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --host codex
```

### Waza

Both hosts:

```bash
npx -y skills add tw93/Waza -g -a claude-code codex -s check design health hunt learn read think write -y
```

Single host:

```bash
npx -y skills add tw93/Waza -g -a claude-code -s check design health hunt learn read think write -y
```

Replace `claude-code` with `codex` when installing for Codex only.

### gbrain

```bash
bun add -g gbrain
```

## Update

### gstack

Claude Code:

```bash
cd ~/.claude/skills/gstack && git pull && ./setup
```

Codex:

```bash
cd ~/.claude/skills/gstack && git pull && ./setup --host codex
```

### Waza

```bash
npx -y skills check
npx -y skills update
```

### gbrain

```bash
gbrain check-update --json
gbrain upgrade
```

## Manual Knowledge Sync

`gbrain` stays advisory-first in this contract. Manual repo sync is allowed:

```bash
gbrain sync --repo <path>
```

## Why gbrain MCP Stays Off by Default

- `gbrain` is useful even when only the CLI is healthy.
- Local MCP endpoints are more failure-prone than the CLI health path.
- The policy keeps `gbrain` as a candidate MCP entry, not a required runtime dependency.
- Re-enable MCP only after the local host config is explicitly updated and `gbrain doctor --json` is healthy enough for your workflow.
