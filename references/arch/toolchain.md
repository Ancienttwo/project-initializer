# 工具链推荐 (2026)

### 包管理器对比

| 工具 | 安装速度 | 磁盘占用 | Monorepo支持 | 特点 |
|------|----------|----------|--------------|------|
| **Bun** | 最快 (10x npm) | 最小 | 原生workspace | 运行时+包管理一体化 |
| **pnpm** | 快 (3x npm) | 小 (硬链接) | 优秀 | 严格依赖隔离 |
| **npm** | 基准 | 大 | 良好 | 兼容性最好 |
| **yarn** | 快 | 中 | 良好 | PnP模式可选 |

**推荐策略:**

| 场景 | 推荐 | 原因 |
|------|------|------|
| AI Agent 项目 | **Bun** | 运行时+包管理一体，流式API原生支持 |
| Monorepo | **pnpm** | workspace协议成熟，严格隔离 |
| 企业/传统项目 | **npm** | 最大兼容性，CI/CD支持完善 |
| Expo/React Native | **npm/yarn** | Expo官方推荐，metro兼容性 |

### Biome - ESLint/Prettier 替代品

**架构组合:**

```text
Biome 1.9+
├── Linter (替代ESLint)
├── Formatter (替代Prettier)
├── Import Sorter
└── 单一配置文件 biome.json
```

**关键优势:**

- **极致性能**: Rust编写，比ESLint快 ~20x
- **零配置**: 开箱即用的合理默认值
- **一体化**: Lint + Format + Import Sort 合一
- **兼容性**: 支持大部分ESLint规则迁移

**biome.json 推荐配置:**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  }
}
```

**安装:**

```bash
# 使用 Bun
bun add -D @biomejs/biome

# 使用 npm/pnpm
npm install -D @biomejs/biome

# 初始化配置
npx @biomejs/biome init
```

**VSCode 集成:** 安装 [Biome VSCode Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

### Turborepo / Nx - 构建编排

| 工具 | 适用场景 | 特点 |
|------|----------|------|
| **Turborepo** | 中型Monorepo | 简单配置，增量构建 |
| **Nx** | 大型企业Monorepo | 强大但复杂，插件生态 |

---

## 数据库推荐 (2026)

### 方案对比总览

| 数据库 | 类型 | 延迟 | 定价模式 | 适用场景 |
|--------|------|------|----------|----------|
| **Supabase** | PostgreSQL 托管 | 全球 ~100-300ms | 免费层 + 按用量 | 全栈 BaaS、快速 MVP |
| **Turso** | libSQL (SQLite分支) | 边缘 <50ms | 免费层 + 按用量 | 边缘部署、低延迟 |
| **SQLite** | 嵌入式 | 本地 <1ms | 免费 | 单机应用、嵌入式 |
| **PlanetScale** | MySQL Serverless | 全球 ~50-150ms | 按用量 | MySQL 生态、分支工作流 |
| **Neon** | PostgreSQL Serverless | 边缘 ~50-100ms | 按用量 | Serverless PostgreSQL |

### 方案一：Supabase (全栈 BaaS 首选) ⭐

**项目地址:** [supabase.com](https://supabase.com/)

**架构组合:**

```text
Supabase Platform
├── PostgreSQL 数据库
│   ├── Row Level Security (RLS)
│   ├── 实时订阅 (Realtime)
│   └── PostgreSQL 扩展 (pg_vector, PostGIS...)
├── Auth 认证
│   ├── Email/Password
│   ├── OAuth (Google, GitHub, Discord...)
│   ├── Magic Link
│   └── Phone/SMS
├── Storage 存储
│   ├── 文件上传/下载
│   ├── 图片转换
│   └── CDN 分发
├── Edge Functions
│   └── Deno Runtime
└── Realtime
    ├── Broadcast (房间广播)
    ├── Presence (在线状态)
    └── Postgres Changes (数据库变更)
```

**关键优势:**

- **开源自托管**: 可本地部署，不锁定
- **PostgreSQL 原生**: 完整 SQL 支持，丰富扩展
- **实时订阅**: 内置 WebSocket 数据库变更推送
- **完整 BaaS**: Auth + Storage + Functions 一站式
- **免费层慷慨**: 500MB 数据库、1GB 存储、50K MAU

**TypeScript 集成 (推荐 Drizzle ORM):**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client, { schema })

// 查询示例
const allPosts = await db.query.posts.findMany({
  with: { author: true },
  where: eq(posts.published, true),
})
```

**Supabase Client 直连 (前端/RLS):**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types' // 自动生成

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 实时订阅
supabase
  .channel('posts')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => console.log('Change:', payload)
  )
  .subscribe()
```

**RLS 策略示例:**

```sql
-- 用户只能读取自己的数据
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- 已发布的文章所有人可读
CREATE POLICY "Published posts are viewable by everyone"
ON posts FOR SELECT
USING (published = true);

-- 作者可以编辑自己的文章
CREATE POLICY "Authors can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);
```

**安装:**

```bash
# Supabase CLI
brew install supabase/tap/supabase

# 本地开发
supabase init
supabase start

# 类型生成
supabase gen types typescript --local > src/lib/database.types.ts
```

### 方案二：Turso (边缘数据库首选) ⭐

**项目地址:** [turso.tech](https://turso.tech/)

**架构组合:**

```text
Turso (libSQL)
├── 核心特性
│   ├── SQLite 兼容
│   ├── 边缘复制 (全球 30+ 节点)
│   ├── 嵌入式复制 (Embedded Replicas)
│   └── 向量搜索 (libSQL 扩展)
├── 部署模式
│   ├── Primary (主写入节点)
│   └── Replicas (边缘只读副本)
└── 连接方式
    ├── HTTP (libsql://)
    ├── WebSocket
    └── 本地嵌入 (Embedded)
```

**关键优势:**

- **极低延迟**: 边缘副本 <50ms 全球访问
- **SQLite 兼容**: 熟悉的 SQL 语法，零迁移成本
- **嵌入式复制**: 本地 SQLite + 云同步
- **Serverless 友好**: Cloudflare Workers、Vercel Edge 原生支持
- **免费层**: 9GB 存储、500 数据库、10亿行读取/月

**TypeScript 集成 (Drizzle ORM):**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
})
```

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  published: integer('published', { mode: 'boolean' }).default(false),
  authorId: integer('author_id').references(() => users.id),
})
```

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export const db = drizzle(client, { schema })
```

**嵌入式复制 (Embedded Replicas):**

```typescript
// 本地嵌入 + 云同步 (极致低延迟)
import { createClient } from '@libsql/client'

const client = createClient({
  url: 'file:local.db',  // 本地 SQLite
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  syncInterval: 60,  // 每60秒同步
})

// 手动同步
await client.sync()
```

**Turso CLI:**

```bash
# 安装
brew install tursodatabase/tap/turso

# 登录
turso auth login

# 创建数据库
turso db create my-app

# 查看连接信息
turso db show my-app --url
turso db tokens create my-app

# 创建边缘副本
turso db replicate my-app --location sin  # 新加坡
turso db replicate my-app --location nrt  # 东京
```

### 方案三：SQLite (本地/嵌入式首选)

**架构组合:**

```text
SQLite 生态
├── 核心库
│   ├── better-sqlite3 (Node.js 同步)
│   ├── sql.js (WASM 浏览器)
│   └── Bun SQLite (Bun 原生)
├── ORM 支持
│   ├── Drizzle ORM
│   ├── Prisma
│   └── Kysely
└── 扩展
    ├── SQLite-vec (向量搜索)
    ├── FTS5 (全文搜索)
    └── JSON1 (JSON 操作)
```

**适用场景:**

- **桌面应用**: Electron/Tauri 本地数据
- **CLI 工具**: 配置和缓存存储
- **嵌入式设备**: IoT、边缘计算
- **开发测试**: 快速原型、单元测试
- **只读分析**: 大数据导出分析

**Bun SQLite (最快):**

```typescript
// Bun 原生 SQLite 支持，性能最佳
import { Database } from 'bun:sqlite'

const db = new Database('app.db')

// 创建表
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 预编译语句 (性能优化)
const insertUser = db.prepare(
  'INSERT INTO users (email, name) VALUES ($email, $name)'
)
const getUser = db.prepare('SELECT * FROM users WHERE id = $id')

// 事务
db.transaction(() => {
  insertUser.run({ $email: 'user@example.com', $name: 'John' })
  insertUser.run({ $email: 'user2@example.com', $name: 'Jane' })
})()

// 查询
const user = getUser.get({ $id: 1 })
```

**better-sqlite3 (Node.js):**

```typescript
import Database from 'better-sqlite3'

const db = new Database('app.db', { verbose: console.log })

// 同步 API，比异步更快
const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
const user = stmt.get('user@example.com')

// WAL 模式 (推荐)
db.pragma('journal_mode = WAL')
```

**Drizzle + SQLite:**

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'

const sqlite = new Database('app.db')
export const db = drizzle(sqlite, { schema })

// 迁移
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
migrate(db, { migrationsFolder: './drizzle' })
```

### 数据库选型指南

| 需求 | 推荐方案 | 原因 |
|------|----------|------|
| **全栈 MVP/快速开发** | Supabase ⭐ | Auth+Storage+Realtime 一站式 |
| **边缘部署/低延迟** | Turso ⭐ | 全球边缘复制，<50ms |
| **Serverless 函数** | Turso / Neon | 冷启动友好，连接池 |
| **PostgreSQL 生态** | Supabase / Neon | 完整 PostgreSQL 功能 |
| **本地/嵌入式应用** | SQLite | 零配置，极致性能 |
| **Electron/Tauri** | SQLite (better-sqlite3) | 本地存储，离线支持 |
| **MySQL 迁移** | PlanetScale | MySQL 兼容，分支工作流 |
| **向量搜索/AI** | Supabase (pgvector) | PostgreSQL 原生向量 |

### ORM 推荐

| ORM | 类型安全 | 性能 | 学习曲线 | 推荐场景 |
|-----|----------|------|----------|----------|
| **Drizzle** ⭐ | 极佳 | 极佳 | 中 | 新项目首选 |
| **Prisma** | 优秀 | 良好 | 低 | 快速开发 |
| **Kysely** | 极佳 | 极佳 | 中 | SQL Builder |
| **TypeORM** | 良好 | 一般 | 高 | 传统 ORM |

**Drizzle vs Prisma:**

| 维度 | Drizzle | Prisma |
|------|---------|--------|
| **类型推断** | 100% TypeScript | 代码生成 |
| **SQL 控制** | 完全控制 | 抽象封装 |
| **包体积** | ~50KB | ~2MB |
| **性能** | 接近原生 SQL | 有开销 |
| **迁移** | SQL 文件 | 声明式 |
| **学习曲线** | 需要 SQL 知识 | 更友好 |

### 数据库连接最佳实践

**Serverless 连接池:**

```typescript
// 使用连接池避免连接耗尽
// Supabase 推荐使用 Supavisor (内置)
const connectionString = process.env.DATABASE_URL + '?pgbouncer=true'

// Neon 使用 @neondatabase/serverless
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
```

**环境变量管理:**

```bash
# .env.local
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres

# Turso
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=eyJ...

# SQLite
DATABASE_PATH=./data/app.db
```

### 研究来源

- [Supabase](https://supabase.com/docs) - 开源 Firebase 替代
- [Turso](https://docs.turso.tech/) - 边缘 SQLite
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Node.js SQLite
- [PlanetScale](https://planetscale.com/) - MySQL Serverless
- [Neon](https://neon.tech/) - PostgreSQL Serverless

---

