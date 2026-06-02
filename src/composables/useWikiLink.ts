import { useRouter } from 'vue-router'

/**
 * 处理 Wiki 内链点击事件
 * 在模板中通过 @click="handleLinkClick" 使用
 */
export function useWikiLink() {
  const router = useRouter()

  function handleLinkClick(e: Event) {
    const el = e.target as HTMLElement

    if (el.classList.contains('wiki-link')) {
      const type = el.dataset.type
      const id = el.dataset.id

      if (!type || !id) return

      router.push(`/${type}/${id}`)
    }
  }

  return { handleLinkClick }
}
