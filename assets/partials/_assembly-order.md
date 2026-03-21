# Partial Assembly Order

This document defines the order used to assemble `CLAUDE.md`.

## Assembly Sequence

```
1. 01-header.partial.md
2. 02-iron-rules.partial.md
3. 03-philosophy.partial.md
4. 04-project-structure.partial.md
5. 05-workflow.partial.md
6. {{#IF CLOUDFLARE_NATIVE}}06-cloudflare.partial.md{{/IF}}
7. 07-footer.partial.md
8. 08-orchestration.partial.md
9. 09-compact-instructions.partial.md
```

## Conditional Logic

Cloudflare section is included when:
- The selected plan has `cloudflareNative=true` in `assets/plan-map.json`
- Or explicit `--cloudflare`

It is excluded when:
- The selected plan has `cloudflareNative=false`
- Or explicit `--no-cloudflare`

## Variable Substitution

1. Concatenate partials in order
2. Process conditional blocks `{{#IF CONDITION}}...{{/IF}}`
3. Replace `{{VARIABLE_NAME}}` placeholders
4. Output final markdown

## Rules

- Partials are flat files; no partial includes
- One conceptual purpose per partial
- Keep core rules concise and move details to `docs/reference-configs/*`
