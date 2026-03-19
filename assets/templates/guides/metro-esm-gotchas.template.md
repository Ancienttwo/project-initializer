<!-- Generation: Only for Plan F (Mobile / Expo). Leave solutions as placeholders until actual issues encountered -->
# Metro ESM 已知问题与解决方案

> **Version**: {{CALVER_VERSION}}
> **Last Updated**: {{DATE}}

---

## 问题 1: ESM init-order in StyleSheet.create()

### 现象
Token imports are `undefined` when used at module top-level in `StyleSheet.create()`.

### 原因
Metro web ESM 模块初始化顺序不确定。

### 解决方案
Layout 组件使用内联值; 非 layout 组件在 render 函数内引用 token。

---

## 问题 2: Jotai ESM import.meta 崩溃

### 现象
`ReferenceError: import.meta is not defined`

### 原因
Metro 打包 web 为传统 `<script>` (非 ES module)。Jotai `.mjs` 使用 `import.meta.env`。

### 解决方案
`metro.config.js` 中自定义 `resolveRequest`，强制 Jotai 解析到 CJS。

---

## 问题 3: workspace `.js` 扩展名解析

### 解决方案
使用无扩展名导入 (`from "./types"` not `from "./types.js"`)。
tsconfig 使用 `"moduleResolution": "bundler"`。

---

## 问题 4: SVG 跨平台渲染

### 解决方案
每个 SVG 组件添加 `Platform.OS === "web"` 分支。
