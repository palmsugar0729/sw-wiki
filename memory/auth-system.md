---
name: auth-system
description: D1 + Workers 用户认证系统设计和部署步骤
metadata:
  type: project
---

## 认证系统架构

用 Cloudflare 免费方案（Pages + Workers + D1）实现用户登录注册系统。

### 后端（Workers + D1）

- `migrations/0001_users.sql` — users 表（id, email, password_hash, nickname, avatar_url, email_verified, created_at, updated_at）
- `functions/api/[[route]].ts` — Pages Function 入口，路由分发到不同 handler
- `workers/auth.ts` — Register / Login / Logout / Me 四个 handler
- `workers/db.ts` — D1 CRUD helper（findUserByEmail, findUserById, createUser, markEmailVerified）
- `workers/crypto.ts` — PBKDF2 密码哈希 + HS256 JWT 签发/验证（纯 Web Crypto API，零依赖）
- `wrangler.jsonc` — D1 绑定（sw-wiki-db）+ JWT_SECRET 环境变量

### 前端

- `src/store/auth.ts` — Pinia store：user, loading, error, isLoggedIn, fetchMe(), login(), register(), logout()
- `src/pages/Login.vue` — 登录页
- `src/pages/Register.vue` — 注册页
- `src/router/index.ts` — 新增 /login 和 /register 路由
- `src/main.ts` — 启动时调用 fetchMe() 恢复登录态

### 部署步骤（按顺序）

1. `npx wrangler d1 create sw-wiki-db` → 拿到 database_id
2. 把 database_id 填到 wrangler.jsonc 的 d1_databases[0].database_id
3. `npx wrangler d1 execute sw-wiki-db --file=migrations/0001_users.sql`（建表）
4. `npx wrangler secret put JWT_SECRET`（设置一个随机字符串作为 JWT 签名密钥）
5. `npx wrangler pages deploy dist`（部署）

### 状态

- [x] 所有代码文件已创建
- [x] TypeScript 类型检查通过
- [x] Vite build 通过
- [ ] D1 数据库未创建
- [ ] 未部署到 Cloudflare
- [ ] JWT_SECRET 未设置

**Why:** 用户登录注册系统是 needs_2.0.md 第 5 项需求。选 D1 因为全在 CF 免费额度内，且 D1 就是 SQLite，以后迁移到自己服务器时 SQL 和逻辑可以复用。

**How to apply:** 明天按部署步骤 1-5 依次执行即可。部署后再做邮箱验证功能。
