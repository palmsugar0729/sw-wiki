# 需求清单 2.0

> 继承自 [needs.md](needs.md)（第一阶段需求，已封存）。
> 本清单延续之前的优先级排列规则，写在前面的优先执行。

---

## 5. 用户登录注册系统 🚧 进行中

> 方案已确定：**Cloudflare Pages Functions + D1 数据库 + JWT 认证**。
> 前端在 `src/pages/` 下（Login.vue / Register.vue），状态管理在 `src/store/auth.ts`，
> 后端在 `functions/`（路由入口）和 `workers/`（auth / crypto / db 逻辑）下。

### 已完成 ✅
- [x] Header 加登录/注册入口 & 用户问候/退出按钮
- [x] Vite dev 环境 `/api` 代理配置
- [x] 邮箱验证（当前版本注册即自动验证，后续可接入邮件服务）
- [x] 后端路由类型修正（`Env` 接口替换 `any` 断言）

### 待完成
- [ ] 数据库迁移（`migrations/0001_users.sql` 需要在 D1 执行）
- [ ] 配置 wrangler.jsonc 的 `database_id` 和 `JWT_SECRET`
- [ ] 接入邮件服务发送验证邮件（可选，当前自动验证）


## 6. 图片格式转化 ✅

~~打算把用到的图片转换为 webp 格式，以减小体积。
这个可以等我做完图片处理工具之后再进行。~~

> 已完成于 2026-07-08。public/ 下所有图片（306 张 .jpg/.png）已转为 .webp，代码引用全部更新（media.ts、global.scss、各页面组件、CountryInfo.json、Footer.vue、index.html）。详见 devlog。

---

> 前一阶段（1 ~ 4）已全部完成，详见 [devlog.md](devlog.md)。
