<!-- Generation: Populate from Q2 project type choices and Q1.7 team size -->
# {{PROJECT_NAME}} - Architecture Decision Records

本文档记录项目的关键技术决策及其理由。
This document records key technical decisions and their rationale.

---

## ADR-001: Tech Stack Selection / 技术栈选择

- **Date / 日期**: {{DATE}}
- **Status / 状态**: Accepted / 已采纳
- **Decider / 决策者**: {{USER_NAME}}

### Context / 上下文

{{PROJECT_BRIEF_SUMMARY}}

### Decision / 决策

选择 **{{PLAN_TYPE}}** 作为项目架构方案。
Selected **{{PLAN_TYPE}}** as the project architecture.

### Rationale / 理由

{{TECH_STACK_RATIONALE}}

### Trade-offs / 权衡

| Alternative / 考虑方案 | Pros / 优点 | Cons / 缺点 | Decision / 决定 |
|------------------------|-------------|-------------|-----------------|
{{ALTERNATIVES_TABLE}}

### Consequences / 后果

- **Positive / 正面**: {{POSITIVE_CONSEQUENCES}}
- **Negative / 负面**: {{NEGATIVE_CONSEQUENCES}}
- **Risks / 风险**: {{RISKS}}

---

## ADR-002: Team Size & Architecture Complexity / 团队规模与架构

- **Date / 日期**: {{DATE}}
- **Status / 状态**: Accepted / 已采纳
- **Team Size / 团队规模**: {{TEAM_SIZE}}

### Decision / 决策

基于团队规模 ({{TEAM_SIZE}})，采用 {{ARCHITECTURE_COMPLEXITY}} 架构策略。
Based on team size ({{TEAM_SIZE}}), adopting {{ARCHITECTURE_COMPLEXITY}} architecture.

### Rationale / 理由

{{TEAM_SIZE_RATIONALE}}

---

## ADR Template / 决策模板

Use this template for future decisions:

```markdown
## ADR-XXX: [Title / 标题]

- **Date**: YYYY-MM-DD
- **Status**: Proposed / Accepted / Deprecated / Superseded
- **Decider**: [Name]

### Context
[Background and problem that triggered this decision]

### Decision
[The decision made]

### Rationale
[Why this decision was made]

### Consequences
[Impact of this decision]
```

---

*Generated: {{DATE}}*
