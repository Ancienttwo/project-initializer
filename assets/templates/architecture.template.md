<!-- Generation: Scan actual project tree. Plan D=monorepo, Plan F=Expo Router, others=flat src/ -->
# {{PROJECT_NAME}} — 架构文档

> **Version**: {{CALVER_VERSION}}
> **Last Updated**: {{DATE}}

---

## Monorepo Source Tree

{{PROJECT_SOURCE_TREE}}

---

## 分层架构

```
┌─────────────────────────────────────────────────────┐
│                    Apps Layer                        │
│  {{APP_NAMES}}                                      │
├─────────────────────────────────────────────────────┤
│              Packages Layer                          │
│  {{PACKAGE_DIAGRAM}}                                │
├─────────────────────────────────────────────────────┤
│              External Dependencies                  │
│  {{EXTERNAL_DEPS}}                                  │
└─────────────────────────────────────────────────────┘
```

---

## Package 依赖关系

```
{{DEPENDENCY_GRAPH}}
```

### 导入规则

| 规则 | 说明 |
|------|------|
| Apps 之间 | **禁止** 互相导入 |
| App → Package | 通过 `@{{PROJECT_NAME}}/*` workspace 导入 |
| Package → Package | `shared` 可被所有包依赖 |

---

## 数据流

### 客户端数据流

```
{{CLIENT_DATA_FLOW}}
```

---

## 部署架构

```
{{DEPLOYMENT_DIAGRAM}}
```

{{#IF VALVE_DEPLOY}}
### 阀门式部署 (Valve Pattern)

同一套代码通过环境变量切换:

| 环境变量 | 海外 | 中国 |
|----------|------|------|
{{VALVE_ENV_TABLE}}
{{/IF}}

---

## 已知技术约束

| 约束 | 影响范围 | 解决方案 | 详见 |
|------|----------|----------|------|
{{KNOWN_CONSTRAINTS_TABLE}}
