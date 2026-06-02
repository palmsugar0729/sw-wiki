import { marked } from 'marked'
import type { Character, Country, Unit } from '@/types'
import charactersRaw from '@/data/CharaInfo.json'
import countriesRaw from '@/data/CountryInfo.json'
import unitsRaw from '@/data/UnitInfo.json'

const characters = charactersRaw as Character[]
const countries = countriesRaw as Country[]
const units = unitsRaw as Unit[]

/* =========================
   🔍 查找目标
========================= */
const findTarget = (name: string) => {

  // 👉 人物
  const chara = characters.find((c: Character) =>
    c.alias?.includes(name)
  )
  if (chara) {
    return { type: 'character', id: chara.id }
  }

  // 👉 国家
  const country = countries.find((c: Country) =>
    c.alias?.includes(name)
  )
  if (country) {
    return { type: 'country', id: country.id }
  }

  // 👉 部队
  const unit = units.find((u: Unit) =>
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