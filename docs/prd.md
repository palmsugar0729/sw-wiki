# SW-Wiki 产品需求文档 (PRD)

> 最后更新：2026-07-12

## 项目概述

**sw-wiki** 是《强袭魔女》(Strike Witches) 系列的非官方中文 Wiki 百科站。为系列粉丝提供尽可能详尽的中文资料，涵盖角色、国家、部队、世界观等内容。

## 技术栈

Vue 3 + TypeScript + Vite + Pinia + Vue Router + SCSS + marked

前端为主，认证系统使用 Cloudflare Pages Functions + D1 数据库 + JWT（serverless，无传统后台服务器）。

> 详见 `docs/needs_2.0.md` 第 5 条方案说明。

---

## 开发路线图

开发分为 6 个阶段，按优先级排列：

### 1. 项目文件夹结构优化 ✅ 已完成

- 删除 Vite 模板残留的 `style.scss`
- 删除未引用的死文件（`router.ts`、`welcome-icon.jpg`、`角色编号.xlsx`）
- 样式文件重新划分职责：`reset.scss` / `global.scss` / `layout.scss` / `list.scss` / `detail.scss`
- 侧边栏内部样式从 `App.vue` 迁入 `Sidebar.vue`（scoped）

### 2. 代码优化 ✅ 已完成

- 创建 `src/types/index.ts` 共享类型文件（InfoItem、ContentBlock、Character、Country、Unit、News、WorldViewItem）
- 创建 `src/composables/useWikiLink.ts` — 统一内链点击跳转逻辑，消除 4 处重复
- 创建 `src/utils/media.ts` — 统一 `getEntityImage` / `getInfoValue` 工具函数
- 创建 `src/components/ImageViewer.vue` — 统一图片预览组件（带键盘导航）
- 文件重命名：`CharaList`→`CharacterList`、`CharaDetail`→`CharacterDetail`、`privacy`→`Privacy`、`clockParts`→`ClockWidget`
- 全部相对路径 import 改为 `@/` 别名
- 删除 `src/data/model.txt`
- 修补所有 `any` 类型标注

### 3. 移动端适配 ✅ 已完成

- 全局响应式断点 ≤768px
- 侧边栏改为 fixed overlay 模式（移动端），带 backdrop 遮罩
- 首页双栏 → 单列，字体全面缩小
- 详情页双栏布局 → 单列
- 国家详情页 float 国旗 → 正常流
- Footer 纵向堆叠
- PC 端细节优化（box-shadow、hover 颜色统一）

### 4. 搜索系统 ✅ 已完成

- 创建 `useSearch` composable：搜索三类数据的 `alias` 字段，模糊匹配，按类型分组
- 创建 `SearchDropdown` 组件：分组下拉面板，点击跳转，移动端适配
- 集成到 Sidebar：keyword≥2 字符自动显示，点击外部关闭

### 5. 用户登录注册系统 ✅ 已完成

- 采用 Cloudflare Pages Functions + D1 数据库 + JWT 方案（serverless，无需传统服务器）
- PBKDF2 密码哈希 + HMAC-SHA256 JWT，Web Crypto API 零依赖
- 注册/登录/登出/会话恢复全部实现
- 当前版本注册即自动验证邮箱，后续可接入邮件服务
- 相关文件：`functions/`、`workers/`、`src/store/auth.ts`、`migrations/`

### 6. 图片格式转换 ✅ 已完成

- public/ 下全部 306 张图片已转为 .webp 格式
- 代码引用全部更新

---

## 页面清单

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 公告、热点新闻、最近更新角色 |
| `/world` | 世界观 | 世界观介绍 |
| `/countries` | 国家列表 | 所有国家卡片列表 |
| `/country/:id` | 国家详情 | 领土、历史、政体、军事 |
| `/units` | 部队列表 | 所有部队卡片列表 |
| `/unit/:id` | 部队详情 | 部队信息、历史 |
| `/characters` | `CharacterList.vue` | 角色列表 |
| `/character/:id` | `CharacterDetail.vue` | 角色详情 |
| `/privacy` | `Privacy.vue` | 隐私政策 |
| `/login` | `Login.vue` | 用户登录 |
| `/register` | `Register.vue` | 用户注册 |

## 数据模型

三类核心实体：角色 (Character)、国家 (Country)、部队 (Unit)。均以 JSON 数组存储，每项含 `id`、`alias`（用于内链匹配）、`tags` 等字段。类型定义见 `src/types/index.ts`。

## 关键功能

### Wiki 内链

自定义 `[[名称]]` 语法，在 Markdown 渲染时自动解析为可点击的内部链接，跳转到对应角色/国家/部队详情页。解析逻辑在 `src/utils/render.ts`。

### 图片预览

详情页图集支持左右翻页的大图预览，键盘左右箭头切换，ESC 关闭。首页新闻图片同样支持预览。
