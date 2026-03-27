# Lessons Learned (Self-Improvement Loop)

> Capture correction-derived prevention rules here.
> Promote repeated patterns into durable project rules during spa day.

## Template
- Date:
- Triggered by correction:
- Mistake pattern:
- Prevention rule:
- Where to apply next time:

## Entries
- Date: 2026-03-28
- Triggered by correction: self-host migration failed during repository bootstrap
- Mistake pattern: installer logic assumed source and destination were always different files, and gitignore replacement assumed multiline `awk -v` substitutions were safe
- Prevention rule: migration helpers must be idempotent when run against the skill's own repository, including self-copy checks and managed block rewrites
- Where to apply next time: bootstrap helpers, migration scripts, and any future repo-self-hosting workflows
