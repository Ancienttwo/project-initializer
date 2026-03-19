# Technology Stack Reference

## Quick Decision Tree

### Core Plans (A-F)

```
Start → Project Type?
│
├─ C-Side with SEO (dynamic)?
│  └─ Yes → Plan A: Remix (SSR)
│
├─ Traditional Enterprise (CRM/ERP)?
│  └─ Yes → Plan B: UmiJS + Ant Design Pro
│
├─ Modern B2B SaaS (Internal Tools)?
│  └─ Yes → Plan C: Vite + TanStack Router ⭐
│      └─ AI Chat/Assistant extension: Plan C + Ant Design X
│
├─ Monorepo (Multi-project)?
│  └─ Yes → Plan D: Bun + Turborepo
│
├─ Landing / Marketing Site?
│  └─ Yes → Plan E: Astro + Starwind UI
│
├─ Mobile App?
│  └─ Yes → Plan F: Expo + NativeWind
│
└─ Domain-specific constraints not covered above?
   └─ Choose Custom Presets (G-K)
```

---

### Custom Presets (G-K)

Use these only after confirming A-F does not fit:

- Plan G: AI Quantitative Trading (Python backend)
- Plan H: Financial Trading (FIX/RFQ)
- Plan I: Web3 DApp (EVM chains)
- Plan J: AI Coding Agent / TUI
- Plan K: Fully custom stack

---

## Plan A: Remix (Full-Stack SSR)

**Stack:**
```
Vite + Remix 2.x + React 19
+ Remix Router (routing + data loading)
+ shadcn/ui (modern UI)
+ Supabase (backend BaaS)
+ Zustand (client state)
+ TypeScript
```

**Best For:**
- Marketing sites + admin hybrid
- SEO-required SaaS products
- Full-stack teams

**Init Commands:**
```bash
bunx create-remix@latest my-remix-app
cd my-remix-app
bunx shadcn@latest init
bun add @supabase/supabase-js @supabase/ssr zustand
bun add react-hook-form @hookform/resolvers zod
bun add clsx tailwind-merge class-variance-authority
bun add lucide-react date-fns nanoid
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## Plan B: UmiJS + Ant Design Pro (Enterprise)

**Stack:**
```
UmiJS 4.x + Ant Design 5.x
+ Ant Design Pro (enterprise components)
+ ProComponents (advanced components)
+ Supabase (backend BaaS)
+ TypeScript
```

**Best For:**
- Traditional enterprise systems (CRM/ERP/OA)
- Rapid delivery projects
- Teams familiar with Alibaba ecosystem

**Init Commands:**
```bash
npm create umi
# Select: Ant Design Pro template
cd my-ant-pro-app
bun install
bun add @supabase/supabase-js
bun add date-fns lodash-es
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## Plan C: Vite + TanStack Router (Modern SPA) ⭐

**Stack:**
```
Vite 6.x + React 19
+ TanStack Router (routing + type safety)
+ TanStack Query (data management)
+ shadcn/ui (modern UI)
+ Supabase (backend BaaS)
+ Zustand (client state)
+ TypeScript
```

**Best For:**
- **B2B SaaS (Internal Tools)** ⭐⭐⭐⭐⭐
- Vibe coding + AI collaboration
- Ultimate performance and type safety

**Init Commands:**
```bash
bun create vite@latest my-vite-app -- --template react-ts
cd my-vite-app
bun add @tanstack/react-router
bun add -d @tanstack/router-devtools @tanstack/router-plugin
bun add @tanstack/react-query
bun add -d @tanstack/react-query-devtools
bunx shadcn@latest init
bunx shadcn@latest add button input table form dialog select card tabs
bun add @supabase/supabase-js zustand
bun add react-hook-form @hookform/resolvers zod
bun add clsx tailwind-merge lucide-react date-fns
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## Plan C + Ant Design X (AI Apps)

**Additional Stack:**
```
@ant-design/x 2.0 (AI components)
+ @ant-design/x-markdown (Markdown rendering)
+ @anthropic-ai/claude-agent-sdk (Claude integration)
```

**Best For:**
- AI chatbots
- AI assistants
- Intelligent customer service
- Knowledge base Q&A

**Additional Commands:**
```bash
bun add @ant-design/x antd@6
bun add @ant-design/x-markdown
bun add @anthropic-ai/claude-agent-sdk
```

---

## Plan D: Bun + Monorepo (High Performance)

**Stack:**
```
Bun 1.x + Turborepo
+ Any framework (Vite / Remix / Next.js)
+ Any UI library (shadcn/ui / Ant Design)
+ TypeScript
+ Workspaces
```

**Best For:**
- Large projects (multi-app code sharing)
- Micro-frontend architecture
- Front + back in same repo
- Multi-team collaboration

**Init Commands:**
```bash
curl -fsSL https://bun.sh/install | bash
bunx create-turbo@latest
# Select: bun as package manager
cd my-monorepo
bun install
bun add -d vitest
```

**Project Structure:**
```
my-monorepo/
├── apps/
│   ├── web/           # Web app
│   ├── admin/         # Admin dashboard
│   └── mobile/        # React Native
├── packages/
│   ├── ui/            # Shared UI components
│   ├── utils/         # Shared utilities
│   └── types/         # Shared TypeScript types
├── turbo.json
└── package.json
```

---

## Plan E: C-Side Apps (SEO Required)

### E1: Remix (Recommended)
Same as Plan A, optimized for SEO with built-in SSR.

### E2: Astro + Starwind UI (Landing Pages) ⭐

**Stack:**
```
Astro 5.x
+ Starwind UI (Astro 原生组件, shadcn 式 CLI)
+ Tailwind CSS v4
+ Content Collections (type-safe content)
+ MDX (optional, for blog/docs)
+ TypeScript
```

**Best For:**
- Landing Pages / Marketing Sites
- 公司官网 / 产品介绍页
- 文档站 (配合 Starlight)
- Zero JS by default — 零 React runtime 开销

> **不用于**: Dashboard、Mobile、复杂交互应用。Dashboard 用 Plan C (Vite + React)。

**Init Commands:**
```bash
bunx create-astro@latest my-landing -- --template basics
cd my-landing
bunx astro add tailwind
bunx starwind add button card input navigation-menu separator
bun add -d vitest @playwright/test
```

---

## Plan F: Mobile Apps (React Native)

### F1: Expo + NativeWind (Recommended)

**Stack:**
```
React Native 0.84+ + Expo SDK 55
+ NativeWind (Tailwind for RN)
+ TanStack Query (data management)
+ Supabase (backend)
+ Zustand (state management)
```

**Best For:**
- Frontend developers familiar with Tailwind
- Cross-platform (iOS + Android + Web)

**Init Commands:**
```bash
npx create-expo-app my-mobile-app -t expo-template-blank-typescript
# Or: bunx create-expo-app my-mobile-app -t expo-template-blank-typescript
cd my-mobile-app
bun add nativewind
bun add -d tailwindcss
bunx tailwindcss init
bun add @tanstack/react-query @supabase/supabase-js zustand
bun add -d vitest @testing-library/react-native jest-expo
```

### F2: Expo + HeroUI Native (Rich Components)

**Stack:**
```
React Native 0.84+ + Expo SDK 55
+ HeroUI Native (formerly NextUI for RN)
+ TanStack Query (data management)
+ Supabase (backend)
+ Zustand (state management)
```

**Best For:**
- Feature-rich mobile apps needing polished UI components
- Teams familiar with HeroUI/NextUI ecosystem
- Apps requiring consistent design system across web + mobile

**Init Commands:**
```bash
npx create-expo-app my-mobile-app -t expo-template-blank-typescript
# Or: bunx create-expo-app my-mobile-app -t expo-template-blank-typescript
cd my-mobile-app
bun add heroui-native
bun add @tanstack/react-query @supabase/supabase-js zustand
bun add -d vitest @testing-library/react-native jest-expo
```

> **Note:** HeroUI Native is in beta (1.0.0-beta). Evaluate component coverage for your needs before committing.

---

## Backend Options

### Supabase (Recommended for Most Projects)
- PostgreSQL database
- Auth, Storage, Realtime
- Row Level Security
- Edge Functions

### Cloudflare Workers + Hono
- Serverless, global edge
- D1 (SQLite), KV, R2
- SSE streaming support
- Low cost ($5/month unlimited)

### oRPC (Type-Safe RPC)
- End-to-end type safety
- OpenAPI first-class support
- Framework agnostic

---

## AI/LLM Integration ⭐

### Vercel AI SDK (Recommended for UI) ⭐

**What it is:**
The standard library for building AI-powered UIs. Framework agnostic with first-class React/Next.js support.

**Key Features:**
- 🔄 Streaming UI components (useChat, useCompletion)
- 🤖 Multi-provider support (OpenAI, Anthropic, Google, Mistral)
- 📝 Generative UI with React Server Components
- 🛠️ Tool calling and function execution
- 💾 Message persistence helpers

**Installation:**
```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic
```

**React Streaming Chat Example:**
```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    messages,
    system: "You are a helpful assistant.",
  })

  return result.toDataStreamResponse()
}

// components/chat.tsx
"use client"
import { useChat } from "ai/react"

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  )
}
```

### Claude Agent SDK (Official Anthropic)

**For building AI agents with tool use:**
```bash
npm install @anthropic-ai/claude-agent-sdk
```

```typescript
import { Agent } from "@anthropic-ai/claude-agent-sdk"

const agent = new Agent({
  model: "claude-sonnet-4-20250514",
  tools: [searchTool, calculatorTool],
})

const response = await agent.run("Search for latest AI news")
```

### AI Gateway (Cost & Rate Limiting)

**Cloudflare AI Gateway (Free):**
- Request caching (reduce costs)
- Rate limiting
- Analytics and logging
- No code changes required

**OpenRouter (Multi-model):**
- Unified API for 100+ models
- Automatic fallbacks
- Pay-per-token pricing

```typescript
// Using OpenRouter with Vercel AI SDK
import { createOpenAI } from "@ai-sdk/openai"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

const model = openrouter("anthropic/claude-sonnet-4")
```

---

## Vector Database (RAG) ⭐

### Supabase pgvector (Recommended) ⭐

**What it is:**
PostgreSQL extension for vector similarity search, fully integrated with Supabase ecosystem.

**Key Features:**
- 🔗 Native Supabase integration (same database)
- 🔒 Row Level Security for vectors
- 📊 SQL queries + vector search combined
- 🚀 No additional infrastructure

**Setup:**
```sql
-- Enable the extension
create extension if not exists vector;

-- Create embeddings table
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536),  -- OpenAI ada-002 dimensions
  metadata jsonb,
  created_at timestamptz default now()
);

-- Create HNSW index for fast search
create index on documents using hnsw (embedding vector_cosine_ops);

-- Similarity search function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

**TypeScript Usage:**
```typescript
import { createClient } from "@supabase/supabase-js"
import { embed } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(url, key)

// Generate embedding
const { embedding } = await embed({
  model: openai.embedding("text-embedding-3-small"),
  value: "What is RAG?",
})

// Search similar documents
const { data } = await supabase.rpc("match_documents", {
  query_embedding: embedding,
  match_threshold: 0.7,
  match_count: 5,
})
```

**RAG Pipeline:**
```typescript
// Full RAG implementation
async function ragQuery(question: string) {
  // 1. Embed the question
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: question,
  })

  // 2. Search relevant documents
  const { data: docs } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: 5,
  })

  // 3. Generate answer with context
  const context = docs.map((d) => d.content).join("\n\n")

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    prompt: `Context:\n${context}\n\nQuestion: ${question}`,
  })

  return text
}
```

### Embedding Models Comparison

| Model | Dimensions | Cost | Quality |
|-------|------------|------|---------|
| text-embedding-3-small | 1536 | $0.02/1M tokens | Good |
| text-embedding-3-large | 3072 | $0.13/1M tokens | Best |
| Voyage AI | 1024 | $0.10/1M tokens | Excellent |

---

## Database Platform ⭐

### 数据库选型对比 (2026)

| 数据库 | 类型 | 边缘延迟 | 免费层 | 最佳场景 |
|--------|------|----------|--------|----------|
| **Supabase** | PostgreSQL BaaS | ~100-300ms | 500MB + 无限API | 全栈 BaaS、快速 MVP |
| **Turso** | libSQL (SQLite fork) | <50ms | 9GB + 500 DBs | 边缘优先、多租户 |
| **SQLite** | 嵌入式 | <1ms (本地) | 免费 | 桌面应用、CLI 工具 |
| **Neon** | Serverless PostgreSQL | ~50-100ms | 0.5GB | PostgreSQL + Serverless |
| **PlanetScale** | MySQL Serverless | ~50-100ms | 5GB | MySQL 生态、分支工作流 |

### Supabase (推荐: 全栈 BaaS) ⭐

**完整后端即服务，PostgreSQL + Auth + Storage + Realtime**

```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// 查询 + 实时订阅
const { data } = await supabase
  .from('posts')
  .select('*, author:users(*)')
  .order('created_at', { ascending: false })

// 实时监听
supabase
  .channel('posts')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' },
    (payload) => console.log('Change:', payload))
  .subscribe()
```

**优势:** Auth/Storage/Edge Functions 全家桶、pgvector 向量搜索、Row Level Security

### Turso (推荐: 边缘部署) ⭐

**libSQL (SQLite fork) 边缘数据库，支持 Embedded Replicas**

```bash
npm install @libsql/client
```

```typescript
import { createClient } from '@libsql/client'

// 云端连接
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

// 🔥 Embedded Replicas (本地 + 云同步，极致低延迟)
const embeddedClient = createClient({
  url: 'file:local-replica.db',
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  syncInterval: 60,
})

await client.execute('SELECT * FROM users WHERE id = ?', [userId])
```

**优势:** 边缘 <50ms 延迟、Embedded Replicas、多租户 (database-per-tenant)

### SQLite (推荐: 本地/嵌入式)

**零配置嵌入式数据库，Bun 原生支持**

```typescript
// Bun 原生 SQLite (最快)
import { Database } from 'bun:sqlite'

const db = new Database('app.db')
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT
)`)

// 预编译语句 (性能优化)
const insert = db.prepare('INSERT INTO users (email, name) VALUES (?, ?)')
insert.run('user@example.com', 'John')

// 查询
const users = db.query('SELECT * FROM users').all()
```

```typescript
// better-sqlite3 (Node.js)
import Database from 'better-sqlite3'

const db = new Database('app.db')
const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
const user = stmt.get(userId)
```

**优势:** 零延迟、零配置、单文件备份、Bun 原生集成

### 选型决策树

```
需要 Auth/Storage/Realtime 全家桶?
├─ Yes → Supabase ⭐
└─ No
    └─ 部署到边缘 (Cloudflare Workers)?
        ├─ Yes → Turso (Embedded Replicas)
        └─ No
            └─ 需要 PostgreSQL 特性?
                ├─ Yes → Neon / Supabase
                └─ No → SQLite (Bun 原生)
```

---

## Database ORM ⭐

### Drizzle (Recommended for Edge) ⭐

**What it is:**
Lightweight, type-safe ORM with SQL-like syntax. Perfect for edge runtimes.

**Key Features:**
- 🚀 Edge runtime compatible (Cloudflare Workers, Vercel Edge)
- 📝 SQL-like TypeScript syntax
- 🔧 Zero dependencies, lightweight (~7kb)
- 🔄 Migrations with drizzle-kit

**Installation:**
```bash
npm install drizzle-orm
npm install -D drizzle-kit
```

**Schema Definition:**
```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: uuid("author_id").references(() => users.id),
})
```

**Query Examples:**
```typescript
import { db } from "./db"
import { users, posts } from "./schema"
import { eq } from "drizzle-orm"

// Insert
await db.insert(users).values({ email: "test@example.com" })

// Select with join
const result = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(users.email, "test@example.com"))
```

### Prisma (Feature-Rich)

**Best for:**
- Complex data models with relations
- Need Prisma Studio GUI
- Not deploying to edge

**Edge Limitation:**
Requires Prisma Accelerate ($) for edge deployment.

**Comparison:**

| Feature | Drizzle | Prisma |
|---------|---------|--------|
| Edge Runtime | ✅ Native | ⚠️ Needs Accelerate |
| Bundle Size | ~7kb | ~2MB |
| SQL Control | ✅ Full | ⚠️ Abstracted |
| Type Safety | ✅ Excellent | ✅ Excellent |
| GUI | ❌ | ✅ Prisma Studio |
| Learning Curve | SQL knowledge | Prisma DSL |

**Recommendation:**
- **Drizzle** → Edge deployment, Cloudflare Workers, lightweight
- **Prisma** → Complex apps, need GUI, not edge-critical

---

## Cloud Services (Geek Stack)

### Email: Resend ⭐

**Developer-first email API with React Email support.**

```bash
npm install resend @react-email/components
```

```typescript
import { Resend } from "resend"
import { WelcomeEmail } from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: "onboarding@yourdomain.com",
  to: "user@example.com",
  subject: "Welcome!",
  react: <WelcomeEmail username="John" />,
})
```

### Storage: Cloudflare R2 ⭐

**S3-compatible storage with zero egress fees.**

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
})

await r2.send(new PutObjectCommand({
  Bucket: "my-bucket",
  Key: "file.pdf",
  Body: buffer,
}))
```

### Background Jobs: Inngest ⭐

**Event-driven background functions with automatic retries.**

```bash
npm install inngest
```

```typescript
import { Inngest } from "inngest"

const inngest = new Inngest({ id: "my-app" })

// Define function
export const processUpload = inngest.createFunction(
  { id: "process-upload" },
  { event: "file/uploaded" },
  async ({ event, step }) => {
    // Step 1: Generate thumbnail
    const thumbnail = await step.run("generate-thumbnail", async () => {
      return await generateThumbnail(event.data.fileUrl)
    })

    // Step 2: Extract text (automatic retry on failure)
    const text = await step.run("extract-text", async () => {
      return await extractText(event.data.fileUrl)
    })

    // Step 3: Generate embeddings
    await step.run("generate-embeddings", async () => {
      await generateAndStoreEmbeddings(text)
    })
  }
)
```

### Services Comparison

| Service | Purpose | Free Tier | Pricing |
|---------|---------|-----------|---------|
| **Resend** | Email | 3k/mo | $20/mo for 50k |
| **R2** | Storage | 10GB + 10M requests | $0.015/GB |
| **Inngest** | Background Jobs | 25k steps/mo | $25/mo |
| **Upstash Redis** | KV/Cache | 10k commands/day | $0.2/100k |

---

## Authentication Options

### Better Auth (Recommended for Self-Hosted) ⭐

**What it is:**
The most comprehensive TypeScript authentication library. Framework agnostic, self-hosted, no vendor lock-in.

**Key Features:**
- 🔐 Email/Password, OAuth (20+ providers), Magic Link, Passkeys
- 📱 Two-factor authentication (TOTP, SMS, Email)
- 👥 Organizations & Teams with RBAC
- 🔌 Plugin system (username, anonymous, etc.)
- 🗃️ Database adapters (Prisma, Drizzle, Kysely, MongoDB, etc.)
- 📝 Full TypeScript with type inference

**Installation:**
```bash
npm install better-auth

# With database adapter
npm install @better-auth/prisma  # or drizzle, kysely, etc.
```

**Quick Setup (Node.js / Hono):**
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})

// React client
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()
```

**Cloudflare Workers + Hono + D1 Setup:** ⭐
```typescript
// src/index.ts (Cloudflare Worker)
import { Hono } from "hono"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { drizzle } from "drizzle-orm/d1"

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

// Initialize auth per request (Workers are stateless)
app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  const db = drizzle(c.env.DB)

  const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
    trustedOrigins: ["https://your-app.com"],
  })

  return auth.handler(c.req.raw)
})

export default app
```

**D1 Database Schema (Drizzle):**
```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
})

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: integer("expiresAt", { mode: "timestamp" }),
  password: text("password"),
})

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
})
```

**Best For:**
- Projects requiring full auth control
- Self-hosted / privacy-focused apps
- Complex auth flows (organizations, RBAC)
- Avoiding vendor lock-in
- **Edge deployment (Cloudflare Workers + D1)** ⭐

**Comparison:**
| Feature | Better Auth | Supabase Auth | Clerk |
|---------|-------------|---------------|-------|
| Self-hosted | ✅ | ⚠️ (cloud first) | ❌ |
| Edge Runtime (CF Workers) | ✅ | ❌ | ❌ |
| Pricing | Free | Free tier | $25/mo |
| Organizations | ✅ Built-in | ❌ | ✅ |
| Passkeys | ✅ | ❌ | ✅ |
| Vendor Lock-in | None | Medium | High |

### Supabase Auth (Recommended for BaaS)
- Integrated with Supabase ecosystem
- Row Level Security integration
- Social OAuth + Magic Link
- Best when already using Supabase

### Clerk (Managed Solution)
- Drop-in UI components
- User management dashboard
- Best for rapid prototyping
- Higher cost at scale

---

## Package Manager Comparison

| Feature | npm | pnpm | Bun |
|---------|-----|------|-----|
| Install Speed | 🟡 45s | 🟢 18s | 🟢 **2s** |
| Compatibility | 🟢 100% | 🟢 99% | 🟡 95% |
| Disk Usage | 🔴 High | 🟢 Low | 🟢 Low |
| Monorepo | ⚠️ Needs tools | 🟢 Native | 🟢 Native |
| Built-in Tools | ❌ None | ❌ None | 🟢 Test+Build+Transpile |

**Recommendation:**
- New projects → Bun
- Monorepo → Bun or pnpm
- Production/Stability → pnpm

---

## UI Library Comparison

| Library | Style | Components | Customization | AI Friendly |
|---------|-------|------------|---------------|-------------|
| shadcn/ui | Modern | ~40 | ⭐⭐⭐⭐⭐ (source code) | ⭐⭐⭐⭐⭐ |
| HeroUI v3 | Modern | 60+ | ⭐⭐⭐⭐ (theme builder) | ⭐⭐⭐⭐ |
| Ant Design | Enterprise | 100+ | ⭐⭐⭐ (theme config) | ⭐⭐⭐⭐ |
| Ant Design X | AI-focused | AI components | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Selection Guide:**
- 🎨 Modern SaaS → shadcn/ui
- 🎯 Polished UI + Theme Builder → HeroUI v3 (beta, approaching stable)
- 🏢 Enterprise CRM/ERP → Ant Design Pro
- 🤖 AI Apps → Ant Design X
- 📱 Mobile + Web consistency → HeroUI v3 (web) + HeroUI Native (mobile)
- 🌐 Astro Landing Page → Starwind UI (Astro 原生, 零 React)

## Enhancement Libraries (按需选用)

> 参考自 Codex CLI、shadcn/ui 等主流产品的技术选型。按需引入，不要全装。

| 类别 | 推荐 | 用途 | 场景 |
|---|---|---|---|
| **富文本编辑** | `lexical` | Meta 的富文本引擎 | CMS、评论、文档编辑 |
| **代码高亮** | `shikijs` | VS Code 级语法高亮 | 文档站、代码展示、AI Chat |
| **拖拽** | `@dnd-kit/core` | 现代拖拽库 | Kanban、排序、Dashboard 布局 |
| **动效** | `framer-motion` | 声明式动画 | 页面过渡、微交互、手势 |
| **复杂可视化** | `d3` | 底层可视化引擎 | 自定义图表、网络图、金融图 |
| **简单图表** | `recharts` | React 图表库 (基于 d3) | Dashboard 标准图表 |
| **国际化** | `react-intl` | FormatJS 国际化 | 多语言应用 |
| **监控** | `@opentelemetry/*` | 分布式追踪标准 | 生产环境可观测性 |

```bash
# 按需安装示例
bun add lexical @lexical/react              # 富文本
bun add shiki                               # 代码高亮
bun add @dnd-kit/core @dnd-kit/sortable     # 拖拽
bun add framer-motion                       # 动效
bun add d3                                  # 可视化
bun add recharts                            # 图表
bun add react-intl                          # 国际化
```

---

## 21st.dev Magic MCP (AI Component Generator) ⭐

**What it is:**
AI-powered React component generator that creates beautiful, modern UI components through natural language descriptions. Like v0 but integrated directly into your IDE (Cursor/Windsurf/Claude Code).

**Key Features:**
- 🎨 Generate UI components from natural language prompts
- 📦 Access to vast collection of pre-built, customizable components
- 🔄 Real-time preview as you create
- 📝 Full TypeScript support
- 🖼️ SVGL integration for professional brand assets/logos

**Installation:**
```bash
# Add to Claude Code globally
claude mcp add magic --scope user \
  --env API_KEY="<your-api-key>" \
  -- npx -y @21st-dev/magic@latest

# Get API key at: https://21st.dev/magic/console
```

**Usage Triggers:**
- `/ui` - Generate UI component
- `/21` or `/21st` - Access 21st.dev components
- Natural language: "create a button", "make a card", "build a dialog"

**Best For:**
- Rapid UI prototyping
- Consistent design system components
- Teams wanting AI-accelerated UI development
- Projects using React + Tailwind CSS

**Compatibility:**
Works with all React-based stacks (Plan A, B, C, F1)

---

## Context7 MCP (Up-to-date Documentation) ⭐

**What it is:**
MCP server that fetches real-time, up-to-date documentation for any library directly into your AI context. No more outdated API references or hallucinated methods.

**Key Features:**
- 📚 Access latest docs for 9000+ libraries (React, TanStack, Supabase, shadcn/ui, etc.)
- 🔍 Code-focused or info-focused retrieval modes
- 📖 Version-specific documentation queries
- 🎯 Topic-based filtering for precise context

**Installation:**
```bash
# Add to Claude Code globally
claude mcp add context7 --scope user \
  -- npx -y @upstash/context7-mcp@latest
```

**Usage:**
```
# Resolve library ID first
"resolve library ID for tanstack router"

# Then fetch docs
"get context7 docs for /tanstack/router topic routing"

# Direct queries also work
"How does TanStack Query handle caching?"
```

**Available Libraries (examples):**
- `/shadcn-ui/ui` - shadcn/ui components (1251+ snippets)
- `/tanstack/router` - TanStack Router
- `/tanstack/query` - TanStack Query
- `/supabase/supabase` - Supabase SDK
- `/anthropics/anthropic-sdk-python` - Claude SDK

**Best For:**
- Accurate, up-to-date API usage
- Learning new libraries quickly
- Avoiding deprecated methods
- All projects regardless of stack

---

## Sequential Thinking MCP (Complex Problem Solving) ⭐

**What it is:**
Dynamic problem-solving through structured Chain of Thought. Perfect for breaking down complex tasks, debugging, and architectural decisions.

**Key Features:**
- 🧠 Flexible thinking process that adapts as understanding deepens
- 🔄 Can revise previous thoughts and branch into alternatives
- ✅ Hypothesis generation and verification loop
- 📊 Adjustable depth (can add more steps if needed)

**Installation:**
```bash
# Add to Claude Code globally
claude mcp add sequential --scope user \
  -- npx -y @anthropics/mcp-server-sequential-thinking
```

**When to Use:**
- Breaking down complex multi-step problems
- Planning and design with room for revision
- Debugging where root cause isn't obvious
- Architectural decisions requiring trade-off analysis
- Problems where scope isn't clear initially

**Parameters:**
```typescript
{
  thought: string,        // Current thinking step
  thoughtNumber: number,  // Current step (1, 2, 3...)
  totalThoughts: number,  // Estimated total (can adjust)
  nextThoughtNeeded: boolean,
  isRevision?: boolean,   // Revising previous thought?
  branchFromThought?: number  // Branching point
}
```

**Best For:**
- Complex debugging sessions
- Architecture planning
- Multi-step implementations
- Any task requiring careful reasoning

---

## shadcn MCP (Component Registry Access) ⭐

**What it is:**
Official shadcn/ui MCP server for searching, viewing, and installing components directly from registries. Access component source code, examples, and get install commands without leaving your AI workflow.

**Key Features:**
- 🔍 Search components across registries with fuzzy matching
- 📖 View component source code and dependencies
- 💡 Get usage examples and demos (e.g., `accordion-demo`, `button example`)
- 📦 Generate `npx shadcn add` commands for installation
- ✅ Audit checklist for verifying new components

**Installation:**
```bash
# Add to Claude Code globally
claude mcp add shadcn --scope user \
  -- npx -y @anthropics/mcp-server-shadcn
```

**Available Tools:**
```typescript
// Search for components
search_items_in_registries({ registries: ["@shadcn"], query: "button" })

// View component details
view_items_in_registries({ items: ["@shadcn/button", "@shadcn/card"] })

// Get usage examples
get_item_examples_from_registries({ registries: ["@shadcn"], query: "accordion-demo" })

// Get install command
get_add_command_for_items({ items: ["@shadcn/button", "@shadcn/dialog"] })

// Post-install audit
get_audit_checklist()
```

**Usage Patterns:**
- "Search shadcn for data table component"
- "Show me the dialog component source"
- "Get examples for the form component"
- "How do I install the calendar component?"

**Best For:**
- Projects using shadcn/ui (Plan A, C)
- Discovering available components
- Understanding component implementations
- Quick component installation

---

## Recommended MCP Stack for Vibe Coding

For optimal AI-assisted development, install all four:

```bash
# 1. Context7 - Always up-to-date documentation
claude mcp add context7 --scope user \
  -- npx -y @upstash/context7-mcp@latest

# 2. Sequential Thinking - Complex problem solving
claude mcp add sequential --scope user \
  -- npx -y @anthropics/mcp-server-sequential-thinking

# 3. shadcn - Component registry access
claude mcp add shadcn --scope user \
  -- npx -y @anthropics/mcp-server-shadcn

# 4. Magic (21st.dev) - AI UI component generation
claude mcp add magic --scope user \
  --env API_KEY="<your-api-key>" \
  -- npx -y @21st-dev/magic@latest
```

**Synergy:**
- Use **Context7** to fetch accurate library docs
- Use **Sequential Thinking** for complex architecture/debugging
- Use **shadcn** to search/install pre-built components
- Use **Magic** for custom AI-generated UI components

This stack maximizes AI collaboration efficiency across all project phases.

---

## Trading Platform Technology Reference ⭐

> **Deep Research Date**: 2025-12-20
> **Scope**: Frontend Dashboard + Charts, Backend API, Trading Engine SDKs

### Data Grid Comparison

| Library | License | Performance | Features | Price | Use Case |
|---------|---------|-------------|----------|-------|----------|
| **[AG-Grid Enterprise](https://www.ag-grid.com/)** | Commercial | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $999+/dev | Institutional Trading |
| **[Syncfusion DataGrid](https://www.syncfusion.com/)** | Commercial | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $995/dev | Enterprise Apps |
| **[TanStack Table](https://tanstack.com/table)** | MIT | ⭐⭐⭐⭐ | ⭐⭐⭐ | Free | Small-Medium Projects |

**Recommendations:**
- **Institutional Trading** → AG-Grid Enterprise (industry standard, JP Morgan, Bloomberg use)
- **Cost Sensitive** → Syncfusion (similar features, better pricing)
- **Open Source Priority** → TanStack Table + custom virtualization

### Financial Charts Comparison

| Library | Type | Size | Performance | Price | Features |
|---------|------|------|-------------|-------|----------|
| **[TradingView Lightweight](https://tradingview.github.io/lightweight-charts/)** | Open | 45KB | ⭐⭐⭐⭐ | Free | Basic, lightweight |
| **[TradingView Pro](https://www.tradingview.com/charting-library/)** | Commercial | Large | ⭐⭐⭐⭐⭐ | Contact | Full-featured retail |
| **[ChartIQ](https://cosaic.io/chartiq/)** (S&P Global) | Commercial | Large | ⭐⭐⭐⭐⭐ | High | Institutional, Zerodha/Futu use |
| **[DXcharts](https://www.devexperts.com/dxcharts/)** | Hybrid | Medium | ⭐⭐⭐⭐⭐ | Lite Free | 100+ indicators |
| **[SciChart](https://www.scichart.com/)** | Commercial | Large | ⭐⭐⭐⭐⭐ | $2,999+ | 10M+ datapoints, WebGL |
| **[react-financial-charts](https://github.com/react-financial/react-financial-charts)** | MIT | Small | ⭐⭐⭐ | Free | 60+ indicators |

**Performance Benchmark (Source: SciChart):**

| Data Points | TradingView Lightweight | SciChart.js | Highstock |
|-------------|------------------------|-------------|-----------|
| 1,000 candles | ✅ Smooth | ✅ Smooth | ✅ Smooth |
| 10,000 candles | ✅ Smooth | ✅ Smooth | ⚠️ Laggy |
| 100,000 candles | ⚠️ Laggy | ✅ Smooth | ❌ Unusable |
| 1,000,000 candles | ❌ Unusable | ✅ Smooth | ❌ Unusable |

**Recommendations:**
- **Retail Trading App** → TradingView Lightweight (free, 45KB)
- **Professional Platform** → ChartIQ / TradingView Pro
- **Quantitative Backtesting** → SciChart (million-level data)
- **Open Source** → react-financial-charts (60+ indicators)

### Time-Series Database Comparison

| Database | Type | Query Speed | Ingest Speed | Price | Use Case |
|----------|------|-------------|--------------|-------|----------|
| **[KDB+/KDB-X](https://kx.com/)** | Commercial | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$$$$ | HFT, Investment Banks |
| **[QuestDB](https://questdb.com/)** | Open Source | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free/Commercial | Quant Research |
| **[TimescaleDB](https://timescale.com/)** | Open Source | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Free/Commercial | PostgreSQL Ecosystem |
| **[ClickHouse](https://clickhouse.com/)** | Open Source | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | OLAP Analytics |

**Benchmark (2025 KX Report):**

| Query Type | KDB-X | QuestDB | ClickHouse | TimescaleDB |
|------------|-------|---------|------------|-------------|
| Simple Aggregation | 1x | 4.2x slower | 3.1x slower | 5.8x slower |
| Complex OHLCV | 1x | **4.4x faster** | 2.1x slower | 8.3x slower |
| Latest Point Query | 1x | 1.2x | 3.5x slower | 12x slower |

**Recommendations:**
- **HFT / Tick Data** → KDB+ (30-year industry standard)
- **Quant Research** → QuestDB (free, SQL compatible, excellent performance)
- **Existing PostgreSQL** → TimescaleDB (no migration cost)
- **OLAP Analytics** → ClickHouse (columnar, fast aggregations)

### Trading Engine SDKs

**FIX Protocol Engines:**

| Engine | Language | License | Features |
|--------|----------|---------|----------|
| **[QuickFIX/J](https://www.quickfixj.org/)** | Java | Open Source | Most mature, bank standard |
| **[QuickFIX/n](https://github.com/connamara/quickfixn)** | C# | Open Source | .NET ecosystem |
| **[QuickFIX](https://github.com/quickfix/quickfix)** | C++ | Open Source | Highest performance |

**Crypto Trading Engines:**

| Library | Language | Exchanges | Features |
|---------|----------|-----------|----------|
| **[CCXT](https://github.com/ccxt/ccxt)** | JS/Python/PHP/C# | 107+ | Unified API, open source standard |
| **[CCXT Pro](https://ccxt.pro/)** | JS/Python/PHP | 107+ | WebSocket support |
| **[Freqtrade](https://www.freqtrade.io/)** | Python | Many | Open source quant framework |

**Order Matching Engines (Open Source):**

| Project | Language | Stars | Features |
|---------|----------|-------|----------|
| **[Liquibook](https://github.com/enewhuis/liquibook)** | C++ | 1.2k+ | Mature, embeddable |
| **[matching-engine-rs](https://github.com/amankrx/matching-engine-rs)** | Rust | New | ITCH protocol |

### Broker API Comparison

| Broker | Markets | Commission | API Types | Best For |
|--------|---------|------------|-----------|----------|
| **[Alpaca](https://alpaca.markets/)** | US Stocks/Crypto | Free | REST/WS/FIX | Developers |
| **[Interactive Brokers](https://interactivebrokers.com/)** | Global | Low | TWS/FIX | Global coverage |
| **[Binance](https://binance.com/)** | Crypto | 0.1% | REST/WS | Largest crypto |

### Cloudflare Native Time-Series Solutions ⭐

| Solution | Type | Time-Series Support | Price | Limitations |
|----------|------|---------------------|-------|-------------|
| **D1** | SQLite | ❌ No native | Free 5GB | Not for high-frequency |
| **Hyperdrive** | PostgreSQL Accelerator | ✅ Connect external TimescaleDB | $5+/mo | Only acceleration layer |
| **Workers Analytics Engine** | Columnar | ⭐ Designed for time-series | Free tier + usage | SQL subset, ideal for OHLCV |

**Recommended: Workers Analytics Engine (Cloudflare Native)**

```typescript
// Write candlestick data
await env.ANALYTICS.writeDataPoint({
  blobs: [symbol, interval],
  doubles: [open, high, low, close, volume],
  indexes: [symbol],
});

// OHLCV aggregation query
const query = `
  SELECT
    blob1 as symbol,
    toStartOfInterval(timestamp, INTERVAL '1' HOUR) as time,
    min(double3) as low,
    max(double2) as high,
    argMin(double1, timestamp) as open,
    argMax(double4, timestamp) as close,
    sum(double5) as volume
  FROM ANALYTICS
  WHERE timestamp > now() - INTERVAL '7' DAY
  GROUP BY symbol, time
  ORDER BY time
`;
```

**Hybrid Strategy:**

```
┌─────────────────────────────────────────────────────────┐
│  K-line/Tick Data → Workers Analytics Engine (Free)     │
│  Orders/Users → Keep existing PostgreSQL/D1             │
│                                                         │
│  If complex SQL needed:                                 │
│  → Hyperdrive + Neon (TimescaleDB extension)            │
│  → Or Hyperdrive + Supabase                             │
└─────────────────────────────────────────────────────────┘
```

### Cost-Effective Upgrade Path

**Open Source Stack (Start Here):**

| Component | Free Choice | Notes |
|-----------|-------------|-------|
| Data Grid | TanStack Table | MIT, pairs with TanStack Query/Router |
| Charts | TradingView Lightweight | 45KB, sufficient for most use cases |
| Time-Series DB | **Workers Analytics Engine** (CF Native) | Free tier 10M points/day, ideal for OHLCV |
| Time-Series DB (Alt) | QuestDB | Self-hosted, SQL compatible, 4.4x faster than KDB+ |
| Real-time | WebSocket + Redis Pub/Sub | Self-hosted, free |
| Crypto Trading | CCXT | 107+ exchanges, unified API |
| Matching Engine | matching-engine-rs | Rust, ITCH protocol |

**Paid Upgrade Priority (When Needed):**

```
┌─────────────────────────────────────────────────────────┐
│  Upgrade Priority (Minimal Tech Stack Changes)          │
├─────────────────────────────────────────────────────────┤
│  1. AG-Grid Enterprise ($999 one-time/dev)              │
│     → Immediate trading UX improvement                  │
│     → Million-row data, real-time flash updates         │
│                                                         │
│  2. TimescaleDB Cloud ($50-200/month)                   │
│     → PostgreSQL extension, zero migration              │
│     → 10x faster candlestick aggregation                │
│                                                         │
│  3. DXcharts Pro (Contact for pricing)                  │
│     → Cheaper than TradingView/ChartIQ                  │
│     → 100+ indicators, white-label support              │
│                                                         │
│  4. Ably ($29+/month) - Optional                        │
│     → Only needed for global scale                      │
│     → 99.999% SLA, global CDN                           │
└─────────────────────────────────────────────────────────┘
```

**Cost Estimates:**

| Stack Level | Monthly Cost | Use Case |
|-------------|--------------|----------|
| **Open Source** | $0-100 | MVP, Small Team |
| **Hybrid** (AG-Grid + TimescaleDB Cloud) | $100-500 | Growing Platform |
| **Enterprise** (Full Commercial Stack) | $5,000-50,000 | Institutional Trading |

---

## Plan G: AI Quantitative Trading Platform (Python Backend) ⭐

**Package Manager Default:** `uv` (primary for Python dependencies)

**Architecture Overview:**
```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: Vite + TanStack Router + React                   │
│  ├─ Real-time Charts (TradingView Lightweight Charts)       │
│  ├─ Portfolio Dashboard (shadcn/ui + Recharts)              │
│  └─ Strategy Builder (Monaco Editor + AI Assistant)         │
├─────────────────────────────────────────────────────────────┤
│  API Gateway: FastAPI (REST) + WebSocket (Streaming)        │
├─────────────────────────────────────────────────────────────┤
│  Core Services (Python)                                      │
│  ├─ Strategy Engine (Backtrader / VectorBT)                 │
│  ├─ AI/ML Models (PyTorch / scikit-learn)                   │
│  ├─ Data Pipeline (Pandas + NumPy + TA-Lib)                 │
│  └─ Risk Management (Monte Carlo / VaR)                     │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├─ TimescaleDB (Time-series data)                          │
│  ├─ Redis (Real-time cache + Pub/Sub)                       │
│  └─ Supabase pgvector (AI embeddings + Research)            │
├─────────────────────────────────────────────────────────────┤
│  External Integrations                                       │
│  ├─ Market Data: Polygon.io / Alpaca / Binance              │
│  ├─ Broker API: Interactive Brokers / Alpaca                │
│  └─ AI: Claude (Analysis) / OpenAI (Embeddings)             │
└─────────────────────────────────────────────────────────────┘
```

**Frontend Stack (Plan C):**
```
Vite 6.x + React 19 + TypeScript
+ TanStack Router (routing)
+ TanStack Query (data fetching)
+ shadcn/ui + Recharts (charts/UI)
+ TradingView Lightweight Charts (market charts)
+ Monaco Editor (strategy code editing)
+ Zustand (client state)
```

**Frontend Init Commands:**
```bash
bun create vite@latest quant-frontend -- --template react-ts
cd quant-frontend

# Core dependencies
bun add @tanstack/react-router @tanstack/react-query
bun add -d @tanstack/router-devtools @tanstack/router-plugin @tanstack/react-query-devtools

# UI
bunx shadcn@latest init
bunx shadcn@latest add button input table form dialog select card tabs chart
bun add recharts lucide-react

# Trading-specific
bun add lightweight-charts @monaco-editor/react
bun add zustand socket.io-client
bun add date-fns decimal.js
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Python Backend Stack:**
```
FastAPI 0.110+ (REST + WebSocket)
+ Pydantic v2 (validation)
+ SQLAlchemy 2.0 + asyncpg (DB)
+ Redis (cache + pub/sub)
+ Celery + Redis (task queue)
```

**Core Quant Libraries:**
```
numpy>=1.26
pandas>=2.1
ta-lib>=0.4        # Technical analysis (C wrapper)
vectorbt>=0.26     # Vectorized backtesting
scikit-learn>=1.4  # ML models
pytorch>=2.2       # Deep learning
anthropic>=0.25    # Claude API
```

**Backend Project Structure:**
```
quant-platform/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── routes/
│   │   │   │   ├── strategies.py
│   │   │   │   ├── backtest.py
│   │   │   │   ├── portfolio.py
│   │   │   │   ├── market_data.py
│   │   │   │   └── ai_assistant.py
│   │   │   └── websocket/
│   │   │       └── streaming.py
│   │   └── deps.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── events.py
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/
│   │   ├── strategy_engine/
│   │   │   ├── backtest.py
│   │   │   ├── indicators.py
│   │   │   └── risk.py
│   │   ├── ai/
│   │   │   ├── embeddings.py
│   │   │   ├── analysis.py
│   │   │   └── strategy_advisor.py
│   │   └── market_data/
│   │       ├── providers/
│   │       │   ├── polygon.py
│   │       │   ├── alpaca.py
│   │       │   └── binance.py
│   │       └── aggregator.py
│   └── workers/             # Celery tasks
│       ├── backtest_runner.py
│       └── data_sync.py
├── tests/
├── alembic/                 # DB migrations
├── pyproject.toml
├── requirements.txt
└── docker-compose.yml
```

**Backend Init Commands:**
```bash
# Create project
mkdir quant-platform && cd quant-platform
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install fastapi[all] uvicorn[standard]
pip install sqlalchemy[asyncio] asyncpg alembic
pip install redis celery[redis]
pip install numpy pandas ta-lib vectorbt
pip install scikit-learn torch
pip install anthropic httpx

# TA-Lib requires system installation first
# macOS: brew install ta-lib
# Ubuntu: apt-get install libta-lib-dev
```

**AI Integration Example:**

```python
# services/ai/strategy_advisor.py
from anthropic import Anthropic

client = Anthropic()

async def analyze_strategy(strategy_code: str, backtest_results: dict) -> str:
    """AI-powered strategy analysis"""
    prompt = f"""
    Analyze this trading strategy and its backtest results:

    Strategy Code:
    ```python
    {strategy_code}
    ```

    Backtest Results:
    - Sharpe Ratio: {backtest_results['sharpe']}
    - Max Drawdown: {backtest_results['max_drawdown']}
    - Win Rate: {backtest_results['win_rate']}
    - Total Return: {backtest_results['total_return']}

    Provide:
    1. Risk assessment
    2. Potential improvements
    3. Market conditions where this strategy excels/fails
    """

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text
```

**Real-time WebSocket Example:**

```python
# api/v1/websocket/streaming.py
from fastapi import WebSocket
import redis.asyncio as redis

async def market_data_stream(websocket: WebSocket, symbols: list[str]):
    r = redis.from_url("redis://localhost")
    pubsub = r.pubsub()

    # Subscribe to market data channels
    await pubsub.subscribe(*[f"market:{s}" for s in symbols])

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                await websocket.send_json({
                    "symbol": message["channel"].decode().split(":")[1],
                    "data": json.loads(message["data"])
                })
    finally:
        await pubsub.unsubscribe()
```

**Database Schema (TimescaleDB):**

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- OHLCV data (hypertable)
CREATE TABLE ohlcv (
    time TIMESTAMPTZ NOT NULL,
    symbol TEXT NOT NULL,
    open DECIMAL(20,8),
    high DECIMAL(20,8),
    low DECIMAL(20,8),
    close DECIMAL(20,8),
    volume DECIMAL(30,8)
);

SELECT create_hypertable('ohlcv', 'time');
CREATE INDEX ON ohlcv (symbol, time DESC);

-- Strategies
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    parameters JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backtest results
CREATE TABLE backtest_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES strategies(id),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    metrics JSONB,
    trades JSONB,
    equity_curve DECIMAL[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Landing Page (Independent Remix):**
```bash
# Separate Remix project for marketing/SEO
bunx create-remix@latest quant-landing
cd quant-landing
bunx shadcn@latest init
bun add framer-motion
```

**Recommended Stack Summary (Open Source + Cloudflare Native):**

| Layer | Recommendation | Alternative |
|-------|----------------|-------------|
| **Frontend Grid** | TanStack Table (Free) | AG-Grid ($999+, budget available) |
| **Charts** | TradingView Lightweight | react-financial-charts |
| **Real-time** | Cloudflare Durable Objects + WebSocket | Socket.io (Self-hosted) |
| **Backend** | FastAPI + Redis | Hono + Cloudflare Workers |
| **Trading Engine** | CCXT / CCXT Pro | - |
| **Time-Series DB** | **Workers Analytics Engine** (CF Native) | QuestDB (Self-hosted) |
| **Relational DB** | D1 / Supabase | PostgreSQL |
| **Vector DB** | Supabase pgvector | - |

**Cost Estimate**: ~$0-100/month (Cloudflare free tier covers most use cases)

**Best For:**

- AI-powered trading research platforms
- Algorithmic trading development
- Portfolio analytics dashboards
- Quantitative research teams

---

## Plan H: Financial Trading Platform (FIX + REST) ⭐

**Package Manager Default:** `uv` (primary for Python dependencies in mixed stacks)

**Architecture Overview:**
```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: Vite + TanStack Router + React                   │
│  ├─ Trading Blotter (AG-Grid + shadcn/ui)                   │
│  ├─ Order Management (Real-time WebSocket)                  │
│  └─ RFQ Workflow (Form-based, low latency not critical)     │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                   │
│  ├─ REST API (Node.js / Hono) - RFQ, Portfolio, Reports     │
│  └─ WebSocket (Real-time order updates, market data)        │
├─────────────────────────────────────────────────────────────┤
│  Trading Core (High-Frequency Path)                          │
│  ├─ FIX Engine (QuickFIX/J or QuickFIX/n)                   │
│  ├─ Order Router (Java/C++ for latency)                     │
│  ├─ Matching Engine Interface                                │
│  └─ Market Data Handler (UDP multicast)                     │
├─────────────────────────────────────────────────────────────┤
│  Business Logic (Low-Frequency Path)                         │
│  ├─ RFQ Service (Node.js / Python)                          │
│  ├─ Pricing Engine                                           │
│  ├─ Risk Checks (Pre-trade)                                  │
│  └─ Trade Lifecycle Management                               │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├─ PostgreSQL (Trades, Orders, Positions)                  │
│  ├─ Redis (Session state, Real-time cache)                  │
│  ├─ TimescaleDB (Tick data, Analytics)                      │
│  └─ Message Queue (Kafka/Redis Streams)                     │
└─────────────────────────────────────────────────────────────┘
```

**Two Trading Paths:**

| Path | Latency | Protocol | Use Case |
|------|---------|----------|----------|
| **High-Frequency** | < 1ms | FIX 4.4 / FIX 5.0 / Binary | Algorithmic execution, Market making |
| **Low-Frequency** | < 500ms | REST + WebSocket | RFQ, Voice trades, Block trades |

**High-Performance Core Options:**

| Language | Use Case | AI Dev Support | Example |
|----------|----------|----------------|---------|
| **Java** (QuickFIX/J) | FIX protocol, Enterprise | ⭐⭐⭐⭐⭐ | Traditional banks |
| **Rust** (Tokio) | Custom binary protocol, Ultra-low latency | ⭐⭐⭐⭐ | 长桥 Longbridge |
| **C++** (QuickFIX) | HFT, Matching engines | ⭐⭐⭐ | Exchanges |

> **Industry Validation**: [长桥 Longbridge](https://open.longbridge.com) uses Rust core engine with 10ms order latency and microsecond-level market data processing.

**Frontend Stack (Plan C):**
```
Vite 6.x + React 19 + TypeScript
+ TanStack Router (routing)
+ TanStack Query (data fetching)
+ AG-Grid Enterprise (trading blotter)
+ shadcn/ui (forms, dialogs)
+ Zustand (client state)
+ Socket.io-client (real-time)
```

**Frontend Init Commands:**
```bash
bun create vite@latest trading-frontend -- --template react-ts
cd trading-frontend

# Core
bun add @tanstack/react-router @tanstack/react-query
bun add -d @tanstack/router-devtools @tanstack/router-plugin @tanstack/react-query-devtools

# UI
bunx shadcn@latest init
bunx shadcn@latest add button input table form dialog select card tabs badge

# Trading-specific
bun add ag-grid-react ag-grid-enterprise  # License required for enterprise
bun add socket.io-client
bun add zustand decimal.js date-fns

# Charts (optional)
bun add lightweight-charts recharts

# Testing
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom
```

**AG-Grid Trading Blotter Example:**
```typescript
// components/trading-blotter.tsx
import { AgGridReact } from 'ag-grid-react'
import { ColDef } from 'ag-grid-community'

const columnDefs: ColDef[] = [
  { field: 'orderId', headerName: 'Order ID', width: 120 },
  { field: 'symbol', headerName: 'Symbol', width: 100 },
  { field: 'side', headerName: 'Side', width: 80,
    cellClass: (params) => params.value === 'BUY' ? 'text-green-500' : 'text-red-500' },
  { field: 'quantity', headerName: 'Qty', width: 100, type: 'numericColumn' },
  { field: 'price', headerName: 'Price', width: 100, type: 'numericColumn' },
  { field: 'status', headerName: 'Status', width: 100 },
  { field: 'filledQty', headerName: 'Filled', width: 100 },
  { field: 'avgPrice', headerName: 'Avg Px', width: 100 },
  { field: 'timestamp', headerName: 'Time', width: 150 },
]

export function TradingBlotter({ orders }: { orders: Order[] }) {
  return (
    <div className="ag-theme-quartz-dark h-[600px]">
      <AgGridReact
        rowData={orders}
        columnDefs={columnDefs}
        animateRows={true}
        getRowId={(params) => params.data.orderId}
      />
    </div>
  )
}
```

**REST API Backend (Node.js + Hono):**
```bash
# For RFQ and low-latency-insensitive operations
bun add hono @hono/node-server
bun add drizzle-orm postgres
bun add ioredis socket.io
bun add zod
```

```typescript
// src/index.ts (Hono backend for RFQ)
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// RFQ Request Schema
const rfqSchema = z.object({
  symbol: z.string(),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive(),
  clientId: z.string(),
  expirySeconds: z.number().default(30),
})

// Create RFQ
app.post('/api/rfq', zValidator('json', rfqSchema), async (c) => {
  const rfq = c.req.valid('json')

  // 1. Get quotes from liquidity providers
  const quotes = await requestQuotes(rfq)

  // 2. Store RFQ in database
  const rfqId = await db.insert(rfqs).values({
    ...rfq,
    status: 'PENDING',
    quotes: quotes,
    expiresAt: new Date(Date.now() + rfq.expirySeconds * 1000),
  }).returning()

  // 3. Notify client via WebSocket
  io.to(rfq.clientId).emit('rfq:created', { rfqId, quotes })

  return c.json({ rfqId, quotes })
})

// Accept RFQ Quote
app.post('/api/rfq/:rfqId/accept', async (c) => {
  const { rfqId } = c.req.param()
  const { quoteId } = await c.req.json()

  // Validate expiry
  const rfq = await db.query.rfqs.findFirst({ where: eq(rfqs.id, rfqId) })
  if (new Date() > rfq.expiresAt) {
    return c.json({ error: 'RFQ expired' }, 400)
  }

  // Execute trade
  const trade = await executeTrade(rfq, quoteId)

  return c.json({ trade })
})
```

**FIX Engine Integration (Java/QuickFIX):**
```java
// For high-frequency trading path
// QuickFIX/J configuration (quickfix.cfg)

[DEFAULT]
ConnectionType=initiator
ReconnectInterval=5
FileStorePath=store
FileLogPath=log
StartTime=00:00:00
EndTime=00:00:00
UseDataDictionary=Y
DataDictionary=FIX44.xml
ValidateUserDefinedFields=N

[SESSION]
BeginString=FIX.4.4
SenderCompID=YOUR_FIRM
TargetCompID=EXCHANGE
SocketConnectHost=fix.exchange.com
SocketConnectPort=9876
HeartBtInt=30
```

```java
// FIXApplication.java
public class FIXApplication extends MessageCracker implements Application {

    @Override
    public void fromApp(Message message, SessionID sessionID)
            throws FieldNotFound, IncorrectDataFormat, UnsupportedMessageType {
        crack(message, sessionID);
    }

    @Handler
    public void onMessage(ExecutionReport message, SessionID sessionID)
            throws FieldNotFound {
        String orderId = message.getClOrdID().getValue();
        char execType = message.getExecType().getValue();
        BigDecimal lastPx = new BigDecimal(message.getLastPx().getValue());
        BigDecimal lastQty = new BigDecimal(message.getLastQty().getValue());

        // Publish to Redis for frontend consumption
        redis.publish("executions", JSON.stringify(new Execution(
            orderId, execType, lastPx, lastQty
        )));
    }

    public void sendNewOrder(NewOrderSingle order) throws SessionNotFound {
        Session.sendToTarget(order, sessionID);
    }
}
```

**Alternative: Rust High-Performance Core (Longbridge Style):** ⭐

```bash
# Rust project setup
cargo new trading-core
cd trading-core

# Add dependencies to Cargo.toml
cargo add tokio --features full
cargo add tokio-tungstenite  # WebSocket
cargo add serde serde_json --features derive
cargo add redis
cargo add rust_decimal       # Financial precision
cargo add chrono
cargo add tracing tracing-subscriber
```

```rust
// src/protocol/binary.rs - Custom binary protocol (like Longbridge)
use bytes::{Buf, BufMut, BytesMut};
use rust_decimal::Decimal;

#[derive(Debug, Clone)]
pub struct OrderMessage {
    pub msg_type: u8,
    pub order_id: u64,
    pub symbol: [u8; 16],
    pub side: u8,        // 1=Buy, 2=Sell
    pub quantity: Decimal,
    pub price: Decimal,
    pub timestamp: i64,
}

impl OrderMessage {
    pub fn encode(&self, buf: &mut BytesMut) {
        buf.put_u8(self.msg_type);
        buf.put_u64(self.order_id);
        buf.put_slice(&self.symbol);
        buf.put_u8(self.side);
        // Encode Decimal as fixed-point i64 (8 decimal places)
        buf.put_i64((self.quantity * Decimal::from(100_000_000)).to_i64().unwrap());
        buf.put_i64((self.price * Decimal::from(100_000_000)).to_i64().unwrap());
        buf.put_i64(self.timestamp);
    }

    pub fn decode(buf: &mut BytesMut) -> Option<Self> {
        if buf.len() < 58 { return None; }

        let msg_type = buf.get_u8();
        let order_id = buf.get_u64();
        let mut symbol = [0u8; 16];
        buf.copy_to_slice(&mut symbol);
        let side = buf.get_u8();
        let quantity = Decimal::from(buf.get_i64()) / Decimal::from(100_000_000);
        let price = Decimal::from(buf.get_i64()) / Decimal::from(100_000_000);
        let timestamp = buf.get_i64();

        Some(Self { msg_type, order_id, symbol, side, quantity, price, timestamp })
    }
}
```

```rust
// src/gateway/tcp.rs - Low-latency TCP gateway
use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use redis::AsyncCommands;

pub async fn start_gateway(addr: &str) -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind(addr).await?;
    let redis = redis::Client::open("redis://127.0.0.1/")?;

    tracing::info!("Trading gateway listening on {}", addr);

    loop {
        let (socket, peer) = listener.accept().await?;
        let redis = redis.clone();

        tokio::spawn(async move {
            if let Err(e) = handle_connection(socket, redis).await {
                tracing::error!("Connection error from {}: {}", peer, e);
            }
        });
    }
}

async fn handle_connection(
    mut socket: TcpStream,
    redis: redis::Client,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut buf = BytesMut::with_capacity(4096);
    let mut conn = redis.get_multiplexed_async_connection().await?;

    loop {
        let n = socket.read_buf(&mut buf).await?;
        if n == 0 { break; }

        while let Some(order) = OrderMessage::decode(&mut buf) {
            // Process order with microsecond latency
            let start = std::time::Instant::now();

            // Validate and route order
            let execution = process_order(&order).await?;

            // Publish to Redis for frontend
            let json = serde_json::to_string(&execution)?;
            conn.publish::<_, _, ()>("executions", &json).await?;

            tracing::debug!("Order {} processed in {:?}", order.order_id, start.elapsed());
        }
    }
    Ok(())
}
```

```rust
// src/market_data/feed.rs - UDP multicast market data
use tokio::net::UdpSocket;
use std::net::SocketAddr;

pub async fn start_market_data_feed(
    multicast_addr: &str,
    redis: redis::Client,
) -> Result<(), Box<dyn std::error::Error>> {
    let socket = UdpSocket::bind("0.0.0.0:0").await?;
    let multicast: SocketAddr = multicast_addr.parse()?;

    // Join multicast group
    socket.join_multicast_v4(
        multicast.ip().to_string().parse()?,
        "0.0.0.0".parse()?,
    )?;

    let mut buf = [0u8; 65536];
    let mut conn = redis.get_multiplexed_async_connection().await?;

    loop {
        let (len, _) = socket.recv_from(&mut buf).await?;

        // Parse and publish with minimal latency
        if let Some(tick) = parse_market_data(&buf[..len]) {
            let channel = format!("market:{}", tick.symbol);
            conn.publish::<_, _, ()>(&channel, &tick.to_json()).await?;
        }
    }
}
```

**Rust Project Structure:**

```text
trading-core/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── protocol/
│   │   ├── mod.rs
│   │   ├── binary.rs       # Custom binary protocol
│   │   └── fix.rs          # FIX protocol (optional)
│   ├── gateway/
│   │   ├── mod.rs
│   │   ├── tcp.rs          # Low-latency TCP
│   │   └── websocket.rs    # WebSocket bridge
│   ├── market_data/
│   │   ├── mod.rs
│   │   └── feed.rs         # UDP multicast
│   ├── order/
│   │   ├── mod.rs
│   │   ├── router.rs       # Order routing
│   │   └── validator.rs    # Pre-trade checks
│   └── risk/
│       ├── mod.rs
│       └── limits.rs       # Position limits
├── Cargo.toml
├── Dockerfile
└── README.md
```

**When to Choose Rust over Java:**

| Criteria | Java (QuickFIX/J) | Rust |
|----------|-------------------|------|
| FIX protocol required | ✅ Best choice | ⚠️ Limited libraries |
| Custom binary protocol | ⚠️ Verbose | ✅ Ideal |
| Latency < 100μs | ⚠️ GC pauses | ✅ No GC |
| Memory footprint | ⚠️ ~500MB+ | ✅ ~50MB |
| Team expertise | ✅ Common | ⚠️ Rarer |
| AI-assisted development | ✅ Excellent | ⭐⭐⭐⭐ Good |

**Real-time WebSocket Bridge:**
```typescript
// services/websocket-bridge.ts
import { createClient } from 'redis'
import { Server } from 'socket.io'

// Bridge FIX executions to WebSocket clients
async function startBridge(io: Server) {
  const redis = createClient()
  await redis.connect()

  await redis.subscribe('executions', (message) => {
    const execution = JSON.parse(message)

    // Broadcast to relevant clients
    io.to(`order:${execution.orderId}`).emit('execution', execution)
  })

  await redis.subscribe('market-data', (message) => {
    const tick = JSON.parse(message)
    io.to(`symbol:${tick.symbol}`).emit('tick', tick)
  })
}
```

**Database Schema:**

```sql
-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cl_ord_id TEXT UNIQUE NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
    order_type TEXT NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8),
    status TEXT NOT NULL DEFAULT 'PENDING',
    filled_qty DECIMAL(20,8) DEFAULT 0,
    avg_price DECIMAL(20,8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Executions
CREATE TABLE executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    exec_id TEXT UNIQUE NOT NULL,
    exec_type TEXT NOT NULL,
    last_qty DECIMAL(20,8),
    last_price DECIMAL(20,8),
    leaves_qty DECIMAL(20,8),
    cum_qty DECIMAL(20,8),
    timestamp TIMESTAMPTZ NOT NULL
);

-- RFQs
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    quotes JSONB,
    accepted_quote_id TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Positions
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    quantity DECIMAL(20,8) NOT NULL DEFAULT 0,
    avg_cost DECIMAL(20,8),
    unrealized_pnl DECIMAL(20,8),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, symbol)
);
```

**Project Structure:**

```text
trading-platform/
├── apps/
│   ├── frontend/           # Vite + React (Plan C)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── components/
│   │   │   │   ├── blotter/
│   │   │   │   ├── order-entry/
│   │   │   │   └── rfq/
│   │   │   └── stores/
│   │   └── package.json
│   ├── api/                # Node.js + Hono (REST + WebSocket)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── websocket/
│   │   └── package.json
│   ├── trading-core/       # Choose ONE:
│   │   │                   #   - Java (QuickFIX/J) for FIX protocol
│   │   │                   #   - Rust (Tokio) for custom binary protocol
│   │   ├── src/            # Java: src/main/java/ | Rust: src/
│   │   └── Cargo.toml      # or pom.xml for Java
│   └── landing/            # Remix (Marketing site)
│       └── package.json
├── packages/
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Shared utilities
├── docker-compose.yml
└── turbo.json
```

**Landing Page (Independent Remix):**

```bash
# Marketing site with SEO
bunx create-remix@latest trading-landing
cd trading-landing
bunx shadcn@latest init
bun add framer-motion @radix-ui/react-icons
```

**Recommended Stack Summary (Institutional + Cloudflare Native):**

| Layer | Recommendation | Alternative |
|-------|----------------|-------------|
| **Frontend Grid** | AG-Grid Enterprise | Syncfusion |
| **Charts** | ChartIQ / DXcharts | SciChart (high data volume) |
| **Real-time** | Cloudflare Durable Objects + WebSocket | Self-hosted WebSocket + Redis |
| **API Layer** | Hono + Cloudflare Workers | Node.js (self-hosted) |
| **FIX Engine** | QuickFIX/J (Java) | Rust (custom binary) |
| **Matching Engine** | Liquibook (C++) | matching-engine-rs (Rust) |
| **Time-Series DB** | **Workers Analytics Engine** (CF Native) | QuestDB / KDB+ |
| **Relational DB** | Hyperdrive + Neon/Supabase | PostgreSQL (self-hosted) |
| **Message Queue** | Cloudflare Queues | Redis Streams / Kafka |

**Cost Estimate**: ~$500-5,000/month (includes AG-Grid license + Cloudflare paid tier)

**Best For:**

- Institutional trading platforms
- Multi-asset trading systems (Equities, FX, Fixed Income)
- Broker/dealer order management systems
- Market making platforms
- OTC trading (RFQ workflows)

---

## Plan I: Web3 DApp (EVM Chains) ⭐

**Architecture Overview:**
```
┌─────────────────────────────────────────────────────────────┐
│  Landing Page (Astro + Starwind UI)                          │
│  ├─ Hero / Features / Tokenomics                             │
│  └─ Wallet Connect CTA → redirect to App                    │
├─────────────────────────────────────────────────────────────┤
│  DApp Frontend (Vite + React)                                │
│  ├─ Wagmi v2 + viem (wallet + contract interaction)          │
│  ├─ ConnectKit / RainbowKit (wallet UI)                      │
│  ├─ TanStack Router (SPA routing)                            │
│  ├─ TanStack Query (data fetching + chain query cache)       │
│  ├─ shadcn/ui + Tailwind CSS v4 (UI)                         │
│  └─ Zustand (global state: wallet, tx status)                │
├─────────────────────────────────────────────────────────────┤
│  Smart Contracts (Solidity)                                   │
│  ├─ Hardhat (dev/test/deploy)                                │
│  ├─ OpenZeppelin (ERC standards base)                        │
│  └─ Custom contracts (NFT/DeFi/Agent/DAO)                    │
├─────────────────────────────────────────────────────────────┤
│  Backend API (Cloudflare Workers + Hono)                      │
│  ├─ Chain indexing / event caching                           │
│  ├─ D1 (metadata storage)                                    │
│  └─ External API integrations                                │
└─────────────────────────────────────────────────────────────┘
```

### I1: Landing Page (Astro)

Same as Plan E2 — Astro + Starwind UI for zero-JS marketing pages.

### I2: DApp Frontend (Vite + React + Wagmi)

**Stack:**
```
Vite 6.x + React 19
+ Wagmi v2 + viem (EVM chain interaction)
+ ConnectKit (wallet connection UI)
+ TanStack Router + TanStack Query
+ shadcn/ui + Tailwind CSS v4
+ Zustand (wallet/tx state)
+ TypeScript
```

**Init Commands:**
```bash
bun create vite my-dapp --template react-ts
cd my-dapp
bun add wagmi viem @tanstack/react-query connectkit
bun add @tanstack/react-router @tanstack/react-router-devtools
bun add zustand
bunx shadcn@latest init
bunx shadcn@latest add button input card dialog table tabs toast
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

### I3: Smart Contracts (Hardhat + Solidity)

**Stack:**
```
Solidity ^0.8.20
+ Hardhat (compile/test/deploy)
+ OpenZeppelin Contracts (ERC20/721/1155 base)
+ Hardhat Ignition (deployment)
+ TypeScript (config + scripts)
```

**Init Commands:**
```bash
mkdir contracts && cd contracts
bunx hardhat init
bun add -d @openzeppelin/contracts @nomicfoundation/hardhat-toolbox
```

**Supported Chains:**
- BNB Chain (BEP20, NFA)
- Ethereum / Base / Arbitrum / Optimism
- Any EVM-compatible chain

**Project Structure:**
```
my-dapp/
├── landing/              # Astro + Starwind UI (Plan E2)
├── app/                  # Vite + React + Wagmi (DApp)
│   ├── src/
│   │   ├── routes/       # TanStack Router
│   │   ├── hooks/        # useContract, useWallet hooks
│   │   ├── components/   # UI components
│   │   └── lib/
│   │       ├── contracts/ # ABI + contract addresses
│   │       └── chains.ts  # Chain config
│   └── package.json
├── contracts/            # Hardhat + Solidity
│   ├── contracts/        # .sol files
│   ├── test/             # Contract tests
│   ├── ignition/         # Deployment modules
│   └── hardhat.config.ts
└── package.json          # Workspace root (bun workspace)
```

**Best For:**
- NFT Marketplace / Gallery
- DeFi protocols (swap, lending, staking)
- DAO governance platforms
- Agent marketplaces (NFA, ERC-8004)
- Token-gated applications

---

## Plan J: AI Coding Agent / TUI Tool (OpenTUI) ⭐

> **What is OpenTUI?**
> OpenTUI (https://github.com/sst/opentui) is a TypeScript-based Terminal User Interface (TUI) framework by the SST team. It's designed for building rich, interactive terminal applications with modern React-like patterns.

**Architecture Overview:**
```
┌─────────────────────────────────────────────────────────────┐
│  TUI Application                                             │
│  ├─ OpenTUI Framework (@opentui/core or @opentui/react)     │
│  ├─ AI Integration (Claude SDK / OpenAI SDK)                │
│  ├─ Terminal Rendering (Zig-powered, high performance)      │
│  └─ State Management (Signals / React patterns)             │
├─────────────────────────────────────────────────────────────┤
│  Core Features                                               │
│  ├─ Multi-session Management                                 │
│  ├─ Real-time Streaming Output                               │
│  ├─ Theme Switching (Light/Dark/Custom)                      │
│  ├─ Code Syntax Highlighting                                 │
│  └─ Interactive Keyboard Navigation                          │
├─────────────────────────────────────────────────────────────┤
│  Optional Integrations                                       │
│  ├─ LSP (Language Server Protocol)                           │
│  ├─ Git Integration                                          │
│  ├─ File System Watcher                                      │
│  └─ SSH Remote Execution                                     │
└─────────────────────────────────────────────────────────────┘
```

**Core Stack:**
```
OpenTUI (Terminal UI Framework)
+ TypeScript / Bun
+ Claude Agent SDK or OpenAI SDK (AI integration)
+ Ink (alternative React-based TUI)
+ Commander.js (CLI argument parsing)
+ Zod (input validation)
```

**Framework Options:**

| Framework | Style | Performance | Learning Curve | Best For |
|-----------|-------|-------------|----------------|----------|
| **@opentui/core** | Native signals | ⭐⭐⭐⭐⭐ | Medium | Maximum performance |
| **@opentui/react** | React patterns | ⭐⭐⭐⭐ | Low (if know React) | React developers |
| **@opentui/solid** | Solid.js signals | ⭐⭐⭐⭐⭐ | Medium | Solid.js developers |
| **Ink** (alternative) | React + Flexbox | ⭐⭐⭐ | Low | Simple TUI apps |

**Best For:**

- 🤖 **AI Coding Assistants** (like Claude Code, OpenCode)
- 🛠️ **Developer CLI Tools** with rich interactions
- 📊 **DevOps Dashboards** (k9s-style interfaces)
- 📝 **Log Viewers & Debug Tools**
- 🔍 **Database Management TUIs** (lazydocker-style)
- ☕ **Creative Developer Products** (terminal.shop-style)

**Init Commands (OpenTUI):**
```bash
# Create new project with Bun
mkdir my-tui-app && cd my-tui-app
bun init -y

# Install OpenTUI (check latest version at github.com/sst/opentui)
bun add @opentui/core
# Or for React-style:
bun add @opentui/react

# AI Integration
bun add @anthropic-ai/sdk
# Or OpenAI:
bun add openai

# CLI utilities
bun add commander zod chalk
bun add -d typescript @types/node vitest
```

**Alternative: Ink (Simpler React-based TUI):**
```bash
# For simpler TUI needs
mkdir my-ink-app && cd my-ink-app
bun init -y

bun add ink ink-text-input ink-spinner ink-select-input
bun add @anthropic-ai/sdk
bun add commander zod
bun add -d typescript @types/node
```

**Project Structure (AI Coding Agent):**
```
my-ai-agent/
├── src/
│   ├── index.ts              # Entry point + CLI
│   ├── app.tsx               # Main TUI component
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatView.tsx      # Chat message display
│   │   │   ├── InputBar.tsx      # User input area
│   │   │   └── StreamingText.tsx # AI response streaming
│   │   ├── sidebar/
│   │   │   ├── SessionList.tsx   # Multi-session switcher
│   │   │   └── FileTree.tsx      # File navigation
│   │   ├── editor/
│   │   │   ├── CodeBlock.tsx     # Syntax highlighted code
│   │   │   └── DiffView.tsx      # File diff display
│   │   └── common/
│   │       ├── Spinner.tsx
│   │       ├── StatusBar.tsx
│   │       └── Modal.tsx
│   ├── ai/
│   │   ├── client.ts             # AI SDK wrapper
│   │   ├── tools.ts              # Tool definitions
│   │   └── prompts.ts            # System prompts
│   ├── services/
│   │   ├── file-system.ts        # File operations
│   │   ├── git.ts                # Git integration
│   │   └── lsp.ts                # Language Server
│   ├── stores/
│   │   ├── session.ts            # Session state
│   │   ├── messages.ts           # Chat history
│   │   └── settings.ts           # User preferences
│   └── utils/
│       ├── keyboard.ts           # Key bindings
│       ├── theme.ts              # Theme definitions
│       └── config.ts             # Configuration
├── themes/
│   ├── default.json
│   ├── dark.json
│   └── monokai.json
├── package.json
├── tsconfig.json
└── README.md
```

**Basic OpenTUI Example:**
```typescript
// src/app.tsx (using @opentui/react)
import { Box, Text, useInput, useState } from '@opentui/react'

export function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useInput((key) => {
    if (key.return && input.trim()) {
      handleSubmit(input)
      setInput('')
    }
  })

  async function handleSubmit(text: string) {
    setIsLoading(true)
    setMessages((prev) => [...prev, { role: 'user', content: text }])

    // Stream AI response
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      messages: [...messages, { role: 'user', content: text }],
    })

    for await (const chunk of stream) {
      // Update UI with streaming content
    }

    setIsLoading(false)
  }

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1} flexDirection="column" padding={1}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && <Spinner />}
      </Box>
      <InputBar value={input} onChange={setInput} />
    </Box>
  )
}
```

**Ink Alternative Example:**
```typescript
// src/app.tsx (using Ink - simpler)
import React, { useState } from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import TextInput from 'ink-text-input'
import Spinner from 'ink-spinner'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export function App() {
  const { exit } = useApp()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  useInput((input, key) => {
    if (key.escape) exit()
  })

  async function handleSubmit(value: string) {
    if (!value.trim()) return

    setLoading(true)
    setQuery('')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: value }],
    })

    let fullResponse = ''
    for await (const event of stream) {
      if (event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta') {
        fullResponse += event.delta.text
        setResponse(fullResponse)
      }
    }

    setLoading(false)
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" padding={1}>
        <Text bold color="cyan">🤖 AI Assistant</Text>
      </Box>

      <Box flexDirection="column" marginY={1}>
        {response && (
          <Box borderStyle="single" padding={1}>
            <Text>{response}</Text>
          </Box>
        )}
        {loading && (
          <Box>
            <Spinner type="dots" />
            <Text> Thinking...</Text>
          </Box>
        )}
      </Box>

      <Box>
        <Text bold>❯ </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          placeholder="Ask anything..."
        />
      </Box>
    </Box>
  )
}
```

**CLI Entry Point:**
```typescript
// src/index.ts
#!/usr/bin/env node
import { program } from 'commander'
import { render } from 'ink'
import { App } from './app.js'

program
  .name('my-ai-agent')
  .description('AI-powered coding assistant')
  .version('1.0.0')

program
  .command('chat')
  .description('Start interactive chat')
  .option('-m, --model <model>', 'AI model to use', 'claude-sonnet-4-20250514')
  .action((options) => {
    render(<App model={options.model} />)
  })

program
  .command('ask <question>')
  .description('Ask a single question')
  .action(async (question) => {
    // Non-interactive mode
    const response = await askAI(question)
    console.log(response)
  })

program.parse()
```

**package.json Configuration:**
```json
{
  "name": "my-ai-agent",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-ai-agent": "./dist/index.js"
  },
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "bun build src/index.ts --outdir dist --target node",
    "start": "bun run src/index.ts"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.25.0",
    "ink": "^4.4.1",
    "ink-text-input": "^5.0.1",
    "ink-spinner": "^5.0.0",
    "ink-select-input": "^5.0.0",
    "commander": "^12.0.0",
    "zod": "^3.22.0",
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.4.0"
  }
}
```

**Key Features to Implement:**

| Feature | Library | Priority |
|---------|---------|----------|
| Streaming AI responses | @anthropic-ai/sdk | ⭐⭐⭐⭐⭐ |
| Syntax highlighting | cli-highlight / shiki | ⭐⭐⭐⭐⭐ |
| Multi-session support | Custom store | ⭐⭐⭐⭐ |
| Keyboard shortcuts | ink useInput | ⭐⭐⭐⭐ |
| Theme switching | Custom config | ⭐⭐⭐ |
| File tree view | ink + custom | ⭐⭐⭐ |
| Git integration | simple-git | ⭐⭐⭐ |
| LSP integration | vscode-languageclient | ⭐⭐ |

**Recommended Stack Summary:**

| Layer | Recommendation | Alternative |
|-------|----------------|-------------|
| **TUI Framework** | OpenTUI (@opentui/react) | Ink (simpler) |
| **Runtime** | Bun | Node.js |
| **AI SDK** | @anthropic-ai/sdk | openai |
| **CLI Parsing** | Commander.js | yargs |
| **Validation** | Zod | - |
| **Syntax Highlight** | shiki / cli-highlight | - |
| **Git** | simple-git | isomorphic-git |

**When to Choose This Stack:**

| Scenario | Recommendation |
|----------|----------------|
| Building Claude Code alternative | ✅ Perfect fit |
| Complex DevOps dashboard | ✅ Great choice |
| Simple CLI with prompts | ⚠️ Consider inquirer instead |
| Web-based tool | ❌ Use Plan C (Vite) instead |
| Mobile app | ❌ Use Plan F (Expo) instead |

**Reference Projects:**

- **OpenCode** (https://github.com/opencode-ai/opencode) - Claude Code alternative built with OpenTUI
- **lazydocker** - Docker management TUI (Go, but similar patterns)
- **k9s** - Kubernetes TUI (Go, but similar patterns)
- **terminal.shop** - Creative commerce via SSH

**Cost Estimate**: $0 (all open source, AI API costs separate)
