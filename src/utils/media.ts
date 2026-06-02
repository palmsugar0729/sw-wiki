import type { InfoItem } from '@/types'

/** 实体类型 */
type EntityType = 'character' | 'unit' | 'country'

/** 实体类型到 public/wiki 子目录的映射 */
const ENTITY_FOLDER: Record<EntityType, string> = {
  character: 'character',
  unit: 'Unit',
  country: 'Flag',
}

/**
 * 拼接 Wiki 图片路径
 * @param entityType - 实体类型
 * @param id - 实体 ID
 * @param imageName - 图片名（不含扩展名），可选
 * @returns 完整的图片 URL，若 imageName 为空则返回空字符串
 */
export function getEntityImage(
  entityType: EntityType,
  id: string,
  imageName?: string,
): string {
  if (!imageName) return ''
  const folder = ENTITY_FOLDER[entityType]
  return `/wiki/${folder}/${id}/${imageName}.jpg`
}

/**
 * 从 info 数组中按 label 查找值
 * @param info - info 数组
 * @param label - 要查找的 label
 * @returns 匹配的 value（若是数组则用逗号拼接），未找到返回空字符串
 */
export function getInfoValue(
  info: InfoItem[],
  label: string,
): string {
  const found = info.find((i) => i.label === label)
  if (!found) return ''
  return Array.isArray(found.value) ? found.value.join(', ') : found.value
}
