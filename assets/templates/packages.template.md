<!-- Generation: Only for monorepo (Plan D) or multi-package setups. Read packages/*/package.json -->
# {{PROJECT_NAME}} — Package 参考

> **Version**: {{CALVER_VERSION}}
> **Last Updated**: {{DATE}}

---

## 总览

| Package | 用途 | React 依赖 | 外部依赖 |
|---------|------|-----------|----------|
{{PACKAGE_OVERVIEW_TABLE}}

---

{{#EACH PACKAGE}}
## {{PACKAGE_SCOPE}}/{{PACKAGE_NAME}}

{{PACKAGE_DESCRIPTION}}

### Exports

| Export Path | 内容 |
|-------------|------|
{{PACKAGE_EXPORTS_TABLE}}

### Source Tree

```
{{PACKAGE_SOURCE_TREE}}
```

{{#IF PACKAGE_KEY_API}}
**关键 API**:
{{PACKAGE_KEY_API}}
{{/IF}}

{{#IF PACKAGE_KNOWN_ISSUES}}
**已知问题**: {{PACKAGE_KNOWN_ISSUES}}
{{/IF}}

---

{{/EACH}}
