---
name: tech-stack
description: 项目技术栈和包管理器偏好
metadata:
  type: project
---

sw-wiki 是 Vue 3 + Vite + TypeScript 纯前端项目，部署在 Cloudflare Pages（免费方案）。

- 包管理器：**npm**（已从 pnpm 切回），有 package-lock.json，不要用 pnpm 命令
- UI 框架：Vue 3 + Pinia + Vue Router
- 样式：SCSS (sass-embedded)
- Markdown 渲染：marked
- 部署目标：Cloudflare Pages（静态站点）
- 构建命令：`npm run build`（vue-tsc + vite build）
- 构建输出：`dist/`
