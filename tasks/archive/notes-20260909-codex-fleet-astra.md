# Codex fleet Astra mapping

> **Substantive Change SHA256**: `sha256:6ec136625c7ca15f23f1091b79ab2270fc9e8ebbd1a4c2d3f48c51aeba00c6a6`

The user selected GPT-6 Astra for Codex fast-worker at light reasoning and
for deep-worker and gatekeeper at medium reasoning. Codex serializes the light
level as `low`. The per-agent target overrides remain the mapping authority;
Claude source personas and family defaults retain their existing semantics.

The installer and helper mirror, tracked Codex projections, reference-document
mirrors, and installer expectations change together. User-global configuration
is outside this repository configuration change.

Verification: `bun test tests/install-agent-fleet.test.ts --timeout 60000`
passed all 21 tests and 241 assertions, including generated/golden equality.
Both modified mirror pairs are byte-identical. No full-suite trigger applies:
only three existing override tuples and their deterministic projections change.
The durable configuration reference is `docs/reference-configs/external-tooling.md`.

Rebased onto `f9bb667e`; range-diff confirmed the implementation patch is
unchanged. The incoming campaign change touches no fleet inputs, so the
focused test evidence remains applicable. The change digest binds the new base.
