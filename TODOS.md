# TODOS

## Proposal Precision Tracking
**What:** Log whether Skill Factory proposals are accepted, dismissed, or expired. Compute acceptance rate after 10+ proposals.
**Why:** The plan tightens feedback loops but never defines how to measure success. Without metrics, we can't tell if evidence scoring is better than count-only.
**Pros:** Low-effort logging; reveals whether weighted scoring improves proposal quality.
**Cons:** Requires enough proposal volume to be statistically meaningful.
**Context:** Codex outside voice flagged that "feedback loop tightened" has no measurable definition. The existing `sf_create_proposal()` writes proposals but never tracks outcomes. Add an `outcome` field (accepted/dismissed/expired) to proposals, updated when `skill-factory-create.sh` runs or when proposals age past 30 days.
**Depends on:** PR1 (Skill Factory Feedback Tightening) shipping first.

## Correction Signal Decay Window
**What:** Time-decay on correction weights. Corrections older than 30 days count as 1x instead of 2x.
**Why:** Without decay, old corrections bias proposals forever. A correction from 6 months ago shouldn't have the same weight as one from yesterday.
**Pros:** Prevents stale corrections from inflating evidence scores.
**Cons:** Adds time-based logic to evidence scoring; slight complexity increase.
**Context:** Codex outside voice flagged no decay/windowing on correction weights. The `optimization_hints` in `.skill-factory-state.json` tracks `last_seen` timestamp per slug, which could be used as the decay reference.
**Depends on:** PR1 shipping + Proposal Precision Tracking (to verify decay improves acceptance rate).

## Factor Lab Gate Specifications
**What:** Define concrete input requirements for leakage, correlation, and cost gate checks in `factor-lab-check.sh`.
**Why:** Current plan says "advisory gates" but doesn't specify what inputs they validate. Without concrete criteria, the checker is review theater.
**Pros:** Makes factor quality checks meaningful and actionable.
**Cons:** Requires domain expertise to define good criteria.
**Context:** Codex outside voice flagged that gates "talk about leakage, correlation, and cost without defining inputs or machinery." Minimum viable criteria: leakage = hypothesis.md has `data_deps` YAML field listing all data sources with time ranges; correlation = registry.json tracks pairwise correlation scores between promoted factors; cost = backtest-summary.md has a `## Transaction Costs` section with estimated slippage and commission.
**Depends on:** PR3 (Factor Factory v1) shipping first.
