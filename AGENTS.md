# AGENTS.md

AI 开发助手指南，后续开发请严格遵守以下约定。

---

## 项目概述

强袭魔女 (Strike Witches) Wiki 百科项目，基于 Vue 3 + TypeScript + Vite 构建。数据以 JSON 形式内置于 `src/data/` 中，渲染 Markdown 内容并支持自定义 `[[内链]]` 语法跳转。

产品需求文档：[docs/prd.md](docs/prd.md) | 需求清单：[needs.md](needs.md) | 开发日志：[docs/devlog.md](docs/devlog.md)

## 技术栈

- Vue 3.5 (Composition API + `<script setup lang="ts">`)
- TypeScript 5.9 (strict mode)
- Vite 8 (构建工具)
- Vue Router 5 (路由)
- Pinia 3 (状态管理)
- marked 17 (Markdown 渲染)
- SCSS / Sass (样式)

## 目录结构

| 目录/文件 | 用途 |
|-----------|------|
| `src/main.ts` | 入口，挂载 App、Pinia、Router、全局样式 |
| `src/App.vue` | 根组件，Header + Sidebar + `<router-view>` + Footer 布局 |
| `src/router/` | 路由配置，使用 `createWebHistory`，路径映射见下文 |
| `src/store/` | Pinia store，目前仅有 sidebar 折叠状态 |
| `src/pages/` | 页面组件（每个路由对应一个页面） |
| `src/components/` | 可复用 UI 组件（Header、Sidebar、Footer、ClockWidget、ImageViewer、SearchDropdown） |
| `src/composables/` | Vue composables（useWikiLink、useSearch） |
| `src/types/` | 共享 TypeScript 类型定义 |
| `src/data/` | 静态 JSON 数据（角色、国家、部队、世界观、新闻） |
| `src/utils/` | 工具函数：`render.ts`（Markdown + 内链解析）、`media.ts`（图片路径/信息提取） |
| `src/styles/` | 全局 SCSS 样式，按功能拆分（reset/global/layout/list/detail） |
| `src/assets/` | 静态资源，目前有字体文件 |
| `public/` | 直接拷贝到构建产物的静态文件（图片、图标等） |
| `public/wiki/` | Wiki 相关静态图片资源 |
| `public/donate/` | 捐赠相关图片 |
| `.vscode/` | VS Code 配置，仅提交 `extensions.json` |
| `.continue/` | Continue.dev AI 插件配置目录 |

## 路径别名

`@` → `src/`，已在 `vite.config.ts` 和 `tsconfig` 中配置。

```ts
// 正确用法
import { renderText } from '@/utils/render'
import characters from '@/data/CharaInfo.json'
```

## 路由表

| 路径 | 页面组件 | 说明 |
|------|----------|------|
| `/` | `Home.vue` | 首页 |
| `/world` | `WorldView.vue` | 世界观 |
| `/countries` | `CountryList.vue` | 国家列表 |
| `/country/:id` | `CountryDetail.vue` | 国家详情 |
| `/units` | `UnitList.vue` | 部队列表 |
| `/unit/:id` | `UnitDetail.vue` | 部队详情 |
| `/characters` | `CharacterList.vue` | 角色列表 |
| `/character/:id` | `CharacterDetail.vue` | 角色详情 |
| `/privacy` | `Privacy.vue` | 隐私政策 |

## 开发规则

### 通用规则

1. **组件写法**：统一使用 `<script setup lang="ts">`，不写 Options API。
2. **类型优先**：所有函数参数、props、返回值必须有明确类型，禁止 `any`。
3. **数据来源**：Wiki 内容数据均在 `src/data/*.json` 中，不调外部 API。
4. **内链语法**：`[[角色名/国家名/部队名]]` 自动解析为可点击的内部链接，解析逻辑在 `src/utils/render.ts`。
5. **样式**：使用 SCSS，全局样式放 `src/styles/`，组件级样式用 `<style scoped lang="scss">`。
6. **路径别名**：引用 `src/` 下的模块统一用 `@/` 别名，不写相对路径 `../../../`。

### 新增页面规则

1. 在 `src/pages/` 创建 `.vue` 文件，文件名用 PascalCase。
2. 在 `src/router/index.ts` 的 `routes` 数组中添加路由。
3. 如需在侧边栏显示导航链接，编辑 `src/components/Sidebar.vue`。

### 新增数据模型规则

1. JSON 数据文件统一放 `src/data/`。
2. 每个数据项必须有 `id` 字段（字符串）。
3. 如需支持 `[[内链]]` 跳转，在 `src/utils/render.ts` 的 `findTarget` 函数中注册新类型。
4. 共享类型定义放 `src/types/index.ts`，各页面通过 `import type { X } from '@/types'` 引用。

### Store 规则

- 全局状态用 Pinia，文件放 `src/store/`。
- Store 命名：`useXxxStore`。
- 轻量级的局部状态直接用 `ref`/`reactive`，不建 store。

### 构建与运行

```bash
npm run dev      # 开发服务器
npm run build    # 类型检查 + 构建
npm run preview  # 预览构建产物
```

### 改动前必读

- 修改 `src/utils/render.ts` 前，先看所有调用它的页面，确保内链解析行为不变。
- 修改 JSON 数据结构前，先看所有引用该 JSON 的页面组件。
- 样式修改注意 Sidebar 折叠/展开两种状态的兼容。
