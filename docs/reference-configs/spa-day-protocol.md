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

## Cadence
- Run once per sprint or when rules exceed practical scan length.

