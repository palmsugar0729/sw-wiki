# sw-wiki

强袭魔女 (Strike Witches) 非官方中文 Wiki 百科。

## 技术栈

Vue 3 + TypeScript + Vite + Pinia + Vue Router + SCSS

认证系统：Cloudflare Pages Functions + D1 数据库 + JWT

## 功能

- 角色、国家、部队、世界观资料的浏览与检索
- Markdown 渲染 + 自定义 `[[内链]]` Wiki 跳转语法
- 响应式布局，侧边栏可折叠
- 用户注册/登录/登出（serverless 认证）

## 本地开发

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# （另一个终端）启动 API 开发服务器
npm run dev:api

# 类型检查 + 构建
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

## 项目结构

```
src/
├── main.ts            # 入口
├── App.vue            # 根布局
├── router/            # 路由配置
├── store/             # Pinia 状态（含 auth）
├── pages/             # 页面组件（含 Login/Register）
├── components/        # 通用组件
├── data/              # Wiki 数据 (JSON)
├── utils/             # 工具函数 (渲染/内链)
├── styles/            # 全局 SCSS
└── assets/            # 字体等静态资源
public/
└── wiki/              # Wiki 图片资源
functions/             # Cloudflare Pages Functions
├── api/
│   └── [[route]].ts   # /api/* 路由入口
workers/               # 认证后端逻辑
├── auth.ts            # 注册/登录/登出
├── crypto.ts          # PBKDF2 + JWT
└── db.ts              # D1 数据库操作
migrations/            # 数据库迁移
└── 0001_users.sql     # users 表
```

## 许可

本项目为爱好者作品，内容版权归原作者所有。
