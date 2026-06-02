/* =========================
   共享类型定义
   供所有页面和工具函数使用
========================= */

/** 信息表单项（姓名/年龄/出身等） */
export interface InfoItem {
  label: string
  value: string | string[]
}

/** 内容块（文本或图片） */
export interface ContentBlock {
  type: 'text' | 'image'
  value: string
}

/** 角色 */
export interface Character {
  id: string
  updatedAt: string
  info: InfoItem[]
  images: Record<string, string>
  background: string
  shortContents: string
  content: ContentBlock[]
  gallery: string[]
  tag: string[]
  alias: string[]
}

/** 国家 */
export interface Country {
  id: string
  countryChineseName: string
  countryEnglishName: string
  images: string
  shortContents: string
  territory: string
  history: string
  polity: string
  military: string
  tags: string[]
  alias: string[]
}

/** 部队 */
export interface Unit {
  id: string
  updatedAt: string
  info: InfoItem[]
  images: Record<string, string>
  background: string
  history: string
  tags: string[]
  alias: string[]
}

/** 新闻 */
export interface News {
  id: string
  type?: string
  date: string
  source: string
  content: string
  link?: string
  images: string[]
}

/** 世界观条目 */
export interface WorldViewItem {
  id: number
  title: string
  content: string
}
