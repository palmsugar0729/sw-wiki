# SW-Wiki 开发日志

> 汇总自 `logs/` 目录下的 14 份日志文件（2026-04-05 ~ 2026-05-03），记录第一阶段的开发历程。

---

## 2026-04-05 — 项目初始化

- 使用 Vite 创建 Vue 3 + TypeScript 项目
- 安装 vue-router、marked（Markdown 渲染）
- 配置基础目录结构（components / pages / router / data）
- 搭建路由系统，修复 `RouteRecordRaw` 类型问题
- 完成 Sidebar + ArticleView 页面框架
- 完成国家列表页（CountryList）— 国旗、名称、简介卡片展示
- 添加全局 CSS：天空蓝主题、左侧导航栏、主内容区布局
- 图片使用 `aspect-ratio` + `object-fit: cover` 防止变形

## 2026-04-06 — 国家详情页 + 数据设计

- 完善国家 JSON 数据结构（8 个字段：中文名、英文名、领土、历史、政体、军事等）
- 完成国家详情页（CountryDetail）— 列表点击跳转、动态路由 `:id`
- 页面布局：左侧文本 + 右侧国旗，flex 双栏
- 基础响应式适配（移动端简单优化）
- 确立 **JSON 数据结构 + Markdown 内容** 的内容组织模式

## 2026-04-07 — Footer + 世界观 + 模块化路由

- 新建 Footer.vue（版权、联系方式、赞助入口、时钟）
- 调整 App.vue 结构：Header + Sidebar + Content + Footer
- 侧边栏增加导航项：世界观、国家介绍、部队介绍
- 完成世界观页面（WorldView）— JSON 驱动多段 Markdown 渲染
- 统一模块化路由设计（`/world`、`/countries`、`/units`）

## 2026-04-08 ~ 04-09 — 部队模块

- 设计 UnitInfo.json 数据结构（info 表格 + 大段 history）
- 完成部队列表页（UnitList）+ 部队详情页（UnitDetail）
- 详情页采用表格形式展示，花大量时间调整布局
- Footer 结构优化，主页改为上下+左右结构

## 2026-04-10 — 角色模块起步

- 设计角色 JSON 数据结构（info 数组 + images 对象 + content 图文混排 + gallery 图集）
- 完成角色列表页（CharaList）— 调用 info 数组的通用函数 `getInfo` / `getImage`
- 开始编写角色 JSON 数据（角色数量多，逐步完善）

## 2026-04-13 — 角色详情 + Wiki 内链系统

- 完成角色详情页（CharaDetail）— 信息表格 + 图片切换 tabs + 图文介绍
- **核心功能：Wiki 内链系统**
  - 创建 `render.ts`：统一 Markdown 渲染 + `[[名称]]` 内链解析
  - 通过 alias 字段匹配角色/国家/部队，自动生成跳转链接
  - 在各页面通过 `v-html` + 点击事件实现跳转
- Footer 联系方式从 `alert` 改为弹出框（modal）

## 2026-04-14 — 图片预览 + 访问统计

- 角色详情页添加图集大图预览（点击放大 + 左右切图）
- 接入"不蒜子"网站访问统计

## 2026-04-15 ~ 04-18 — 内容填充

- 每日更新角色 JSON 数据和图片
- 数据增加 `updatedAt` 字段用于首页"最近更新"
- 首页增加"热点新闻"和"最近更新"模块
- 列表页和首页添加全局背景图 + 美化样式

## 2026-04-23 — 数据结构调整 + 自定义字体

- 部队数据结构重构（与国家/角色统一为 info 数组模式）
- 同步更新部队 list/detail 页代码
- 引入"得意黑"（SmileySans）开源字体
- 更新新闻数据

## 2026-04-29 — Header + 侧边栏折叠

- 新建 Header.vue：hamburger 按钮 + 动态页面标题
- 引入 Pinia 管理侧边栏折叠状态（`useSidebarStore`）
- 详情页添加动态背景图片（通过 CSS 变量 `--bg-image` 实现）

## 2026-05-03 — 样式模块化 + 背景优化

- 将共通样式抽取到模块化 SCSS 文件中
- 完善详情页背景图动态加载

---

## 第一阶段总结

### 技术选型
Vue 3 + TypeScript + Vite + Pinia + Vue Router + marked + SCSS

### 核心成果
| 类别 | 内容 |
|------|------|
| 页面 | 首页、世界观、国家列表/详情、部队列表/详情、角色列表/详情、隐私政策 |
| 数据 | 4 个 JSON 数据源（角色、国家、部队、新闻）+ 1 个世界观 JSON |
| 功能 | Markdown 渲染、`[[内链]]` Wiki 跳转、图片预览器、侧边栏折叠、访问统计 |
| 样式 | 天空蓝主题、得意黑字体、全局 SCSS 模块化 |

### 待完成（一期遗留）
- 搜索系统（仅预留了输入框）
- 移动端适配
- 代码整理优化
- 图片 WebP 转换
- 用户登录注册

---

> 以上内容在第二阶段（2026-06-02）进行了全面重构，详见 [prd.md](prd.md)。

---

## 第二阶段：全面重构（2026-06-02 ~ 2026-06-05）

### 2026-06-02 — 全面代码重构 + 移动端适配 + 搜索系统

- 项目文件夹结构优化：删除 Vite 模板残留、死文件，样式模块化拆分
- 代码优化：创建共享类型文件 `src/types/index.ts`、composables（useWikiLink、useSearch）、工具函数统一（render.ts、media.ts）
- 图片预览组件 `ImageViewer.vue` 统一封装，支持键盘导航
- 文件重命名规范化：CharaList→CharacterList、CharaDetail→CharacterDetail 等
- 全部相对路径 import 改为 `@/` 别名，修补 `any` 类型
- 移动端适配：全局响应式断点 ≤768px，侧边栏 fixed overlay 模式，首页/详情页布局适配
- 搜索系统：useSearch composable + SearchDropdown 组件，模糊匹配 alias 字段，按类型分组

> 详见 git commit `e08b80d refactor: 全面代码重构 + 移动端适配 + 搜索系统`

### 2026-06-04 — 新角色数据 + CharaInfo.json 格式化

- CharaInfo.json 缩进统一为 2 空格，整体格式化
- 新增角色 **赫尔米娜·约翰娜·齐格林德·兰特**（id: 117）
  - 卡尔斯兰帝国夜间战斗王牌，人类史上首个 100 击坠夜战魔女
  - 添加图片资源：`public/wiki/character/117/`（bg.jpg、ill01.jpg、立绘1.jpg、头像.jpg）
  - alias: 赫尔米娜·兰特 / 兰特

### 2026-06-05 — 需求文档整理 + UI 微调

- 未完成条目（用户登录注册系统、图片格式转化）从 `needs.md` 迁移至 `docs/needs_2.0.md`
- 原始 `needs.md` 封存至 `docs/needs.md`，不再修改
- 根目录 `needs.md` 保留已完成条目，指向新文档
- 更新 PRD 文档中需求清单链接
- 手动推送至 origin/main（GitHub 网络恢复后）
- **UI 微调**：PC 端全局字号 +2px（body 基准 16→20px），涉及所有页面标题、正文、组件，提升阅读体验
