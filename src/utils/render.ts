import { marked } from 'marked'
import characters from '../data/CharaInfo.json'
import countries from '../data/CountryInfo.json'
import units from '../data/UnitInfo.json'

/* =========================
   🔍 查找目标
========================= */
const findTarget = (name: string) => {

  // 👉 人物（从 info 里找“姓名”）
  const chara = characters.find(c =>
    c.alias?.includes(name)
  )
  if (chara) {
    return { type: 'character', id: chara.id }
  }

  // 👉 国家（根据你数据结构）
  const country = countries.find(c =>
    c.alias?.includes(name)
  )
  if (country) {
    return { type: 'country', id: country.id }
  }

  // 👉 部队
  const unit = units.find(u =>
    u.alias?.includes(name)
  )
  if (unit) {
    return { type: 'unit', id: unit.id }
  }

  return null
}

/* =========================
   🔗 解析 [[内链]]
========================= */
export const parseWikiLinks = (text: string) => {
  return text.replace(/\[\[(.*?)\]\]/g, (_, raw) => {

    const name = raw.trim()
    const target = findTarget(name)

    if (!target) return name

    return `<span class="wiki-link" data-type="${target.type}" data-id="${target.id}">
      ${name}
    </span>`
  })
}

/* =========================
   🎨 渲染入口
========================= */
export const renderText = (text: string) => {
  if (!text) return ''
  return marked(parseWikiLinks(text))
}