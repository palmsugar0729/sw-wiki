import { computed, type Ref } from 'vue'
import type { Character, Country, Unit } from '@/types'
import charactersRaw from '@/data/CharaInfo.json'
import countriesRaw from '@/data/CountryInfo.json'
import unitsRaw from '@/data/UnitInfo.json'

/* =========================
   类型
========================= */
export interface SearchResult {
  type: 'character' | 'country' | 'unit'
  id: string
  title: string
  subtitle: string
  matchedAlias: string
}

export interface SearchGroup {
  label: string
  type: 'character' | 'country' | 'unit'
  items: SearchResult[]
}

/* =========================
   数据索引
========================= */
const characters = charactersRaw as Character[]
const countries = countriesRaw as Country[]
const units = unitsRaw as Unit[]

interface IndexEntry {
  type: 'character' | 'country' | 'unit'
  id: string
  title: string
  subtitle: string
  aliases: string[]
}

function getInfoValue(info: { label: string; value: string | string[] }[], label: string): string {
  const found = info.find(i => i.label === label)
  if (!found) return ''
  return Array.isArray(found.value) ? found.value.join(', ') : found.value
}

// 角色索引
const characterIndex: IndexEntry[] = characters.map(ch => ({
  type: 'character' as const,
  id: ch.id,
  title: getInfoValue(ch.info, '姓名'),
  subtitle: getInfoValue(ch.info, '外语名'),
  aliases: ch.alias || [],
}))

// 国家索引
const countryIndex: IndexEntry[] = countries.map(c => ({
  type: 'country' as const,
  id: c.id,
  title: c.countryChineseName,
  subtitle: c.countryEnglishName,
  aliases: c.alias || [],
}))

// 部队索引
const unitIndex: IndexEntry[] = units.map(u => ({
  type: 'unit' as const,
  id: u.id,
  title: getInfoValue(u.info, '部队名'),
  subtitle: getInfoValue(u.info, '外号'),
  aliases: u.alias || [],
}))

const allEntries = [...characterIndex, ...countryIndex, ...unitIndex]

/* =========================
   Composable
========================= */
export function useSearch(keyword: Ref<string>) {
  const results = computed<SearchGroup[]>(() => {
    const kw = keyword.value.trim().toLowerCase()
    if (kw.length < 2) return []

    const matched: SearchResult[] = []

    for (const entry of allEntries) {
      const matchedAlias = entry.aliases.find(a =>
        a.toLowerCase().includes(kw)
      )
      if (matchedAlias) {
        matched.push({
          type: entry.type,
          id: entry.id,
          title: entry.title,
          subtitle: entry.subtitle,
          matchedAlias,
        })
        // 每组最多 5 条
        const typeCount = matched.filter(m => m.type === entry.type).length
        if (typeCount >= 5) {
          // 跳过此条，继续下一个 entry
          matched.pop()
          continue
        }
      }
    }

    // 按类型分组
    const groups: SearchGroup[] = []
    const typeOrder: Array<'character' | 'country' | 'unit'> = ['character', 'country', 'unit']
    const typeLabels: Record<string, string> = {
      character: '角色',
      country: '国家',
      unit: '部队',
    }

    for (const type of typeOrder) {
      const items = matched.filter(m => m.type === type)
      if (items.length > 0) {
        groups.push({
          label: typeLabels[type],
          type,
          items,
        })
      }
    }

    return groups
  })

  return { results }
}
