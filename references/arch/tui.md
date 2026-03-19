# TUI Terminal 架构推荐 (2026)

> **⭐ 首选推荐**: OpenTUI 是 [OpenCode](https://github.com/sst/opencode) (Claude Code 竞品) 和 Terminal Shop 的底层框架，专为 AI 工具设计，与 Claude Agent SDK 集成最佳。

### 方案对比

| 方案 | 语言 | 适用场景 | 特点 | 推荐度 |
|------|------|----------|------|--------|
| **OpenTUI + React** ⭐ | TypeScript | Claude Agent集成、AI工具 | React组件模型、Solid支持、高性能 | ⭐⭐⭐⭐⭐ |
| **Ink** | TypeScript | React团队、CLI工具 | 成熟稳定、社区活跃 | ⭐⭐⭐⭐ |
| **Ratatui** | Rust | 高性能TUI、系统工具 | 零成本抽象、亚毫秒渲染 | ⭐⭐⭐⭐ |
| **Tauri + WebView** | Rust + TS | 桌面TUI混合应用 | 小体积、跨平台 | ⭐⭐⭐ |

### 方案一：OpenTUI + Claude Agent SDK ⭐首选推荐

**架构组合:**
```
OpenTUI 0.1.70+
├── @opentui/core (核心库)
├── @opentui/react 或 @opentui/solid (UI层)
├── Claude Agent SDK
│   └── agent-sdk-dev skill
└── 自定义 MCP Tools (人机交互)
```

**关键特性:**
- [OpenTUI](https://github.com/sst/opentui) 是 OpenCode 和 Terminal Shop 的底层TUI框架
- 内置控制台覆盖层，捕获所有 console 输出
- 支持 React 和 SolidJS reconciler
- 组件化架构，Flexbox布局

**与Claude Agent SDK集成要点:**
- Claude Agent SDK 子进程无TTY，需通过 [SDK MCP Servers](https://oneryalcin.medium.com/when-claude-cant-ask-building-interactive-tools-for-the-agent-sdk-64ccc89558fa) 实现交互
- 自定义MCP工具处理审批流程、文件选择、配置向导

**插件依赖:** `agent-sdk-dev` from [claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/agent-sdk-dev)

**安装:**
```bash
npm install @opentui/core @opentui/react
# 需要安装 Zig 构建工具
```

### 方案二：Ink (成熟React方案)

**架构组合:**
```
Ink 5.x
├── ink-ui (组件库)
├── React 18+
├── TypeScript
└── Yoga (Flexbox布局)
```

**关键特性:**
- [Ink](https://github.com/vadimdemedes/ink) 被 Gatsby、Prisma、Shopify 等使用
- 完整React特性支持 (Suspense, Hooks, DevTools)
- [Ink UI](https://github.com/vadimdemedes/ink-ui) 提供 TextInput、Select、Alert等组件

**快速开始:**
```bash
npx create-ink-app my-cli --typescript
```

### 方案三：Ratatui (Rust高性能方案)

**架构组合:**
```
Ratatui 0.30+
├── ratatui-core (模块化核心)
├── Crossterm (跨平台终端后端)
├── tokio (异步运行时)
└── tui-realm (可选: React/Elm风格架构)
```

**关键特性:**
- [Ratatui](https://ratatui.rs/) 亚毫秒级渲染，零成本抽象
- 丰富的内置widgets: 图表、表格、进度条、列表
- 约束式响应式布局，自动适应终端大小
- [tui-realm](https://github.com/veeso/tui-realm) 提供类React的组件化开发体验

**快速开始:**
```bash
cargo install --locked cargo-generate
cargo generate ratatui/templates
```

### 方案四：Tauri + Electron 混合桌面TUI

**架构组合:**
```
Tauri 2.0
├── Rust 后端 (高性能计算)
├── React/Vue/Solid 前端
├── WebView (系统原生)
└── CLI Plugin (命令行参数)

或

Electron 34+
├── Node.js 后端
├── React 前端
├── node-addon-api (原生扩展)
└── Web Workers (后台任务)
```

**Tauri vs Electron 选择:**
- **Tauri**: 体积小 (~10MB)、性能好、安全性高、需要Rust知识
- **Electron**: 成熟稳定、npm生态、团队熟悉、体积较大 (~150MB)

**Electron性能优化要点:**
- [懒加载](https://www.electronjs.org/docs/latest/tutorial/performance) + 代码分割
- 重用窗口而非创建新窗口
- 性能关键代码用 [node-addon-api](https://blog.logrocket.com/advanced-electron-js-architecture/) 写原生
- 定期内存泄漏检测

### TUI 相关工具推荐

| 工具 | 描述 |
|------|------|
| [VibeMux](https://github.com/UgOrange/vibemux) | 多AI Agent编排TUI (类似lazydocker) |
| [Claude Squad](https://github.com/smtg-ai/claude-squad) | tmux管理多个Claude Code实例 |
| [Claude Code Config](https://github.com/joeyism/claude-code-config) | 管理~/.claude.json的TUI工具 |

---

