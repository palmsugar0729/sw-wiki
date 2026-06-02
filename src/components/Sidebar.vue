<template>
  <!-- 移动端遮罩层 -->
  <div
    class="sidebar-backdrop"
    :class="{ visible: !isCollapsed }"
    @click="close"
  ></div>

  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 移动端关闭按钮 -->
    <button class="close-btn" @click="close">×</button>

    <!-- 搜索 -->
    <div class="search-wrap" ref="searchWrapRef">
      <input
        v-model="keyword"
        placeholder="搜索角色/国家/部队…"
        @focus="onFocus"
        @blur="onBlur"
      />
      <SearchDropdown
        :results="results"
        :visible="showDropdown"
        @select="goToResult"
      />
    </div>

    <!-- 固定入口 -->
    <router-link to="/" @click="closeOnMobile">首页</router-link>
    <router-link to="/world" @click="closeOnMobile">世界观</router-link>
    <router-link to="/countries" @click="closeOnMobile">国家介绍</router-link>
    <router-link to="/units" @click="closeOnMobile">部队介绍</router-link>
    <router-link to="/characters" @click="closeOnMobile">人物介绍</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebarStore } from '@/store/sidebar'
import { useSearch } from '@/composables/useSearch'
import type { SearchResult } from '@/composables/useSearch'
import SearchDropdown from '@/components/SearchDropdown.vue'

const router = useRouter()
const keyword = ref('')
const sidebarStore = useSidebarStore()
const isCollapsed = computed(() => sidebarStore.isCollapsed)

const { results } = useSearch(keyword as Ref<string>)

/* 下拉显示控制 */
const showDropdown = ref(false)
const searchWrapRef = ref<HTMLElement | null>(null)

const onFocus = () => {
  if (keyword.value.trim().length >= 2) {
    showDropdown.value = true
  }
}

const onBlur = () => {
  // 延迟关闭，让 click 事件先触发
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// keyword 变化时自动显示/隐藏
watch(keyword, (val) => {
  showDropdown.value = val.trim().length >= 2
})

/* 全局点击关闭 */
const handleClickOutside = (e: MouseEvent) => {
  if (searchWrapRef.value && !searchWrapRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

/* 选择结果 */
const goToResult = (item: SearchResult) => {
  showDropdown.value = false
  keyword.value = ''
  router.push(`/${item.type}/${item.id}`)
  // 移动端关闭侧边栏
  if (window.innerWidth <= 768) {
    sidebarStore.closeSidebar()
  }
}

const close = () => {
  sidebarStore.closeSidebar()
}

const closeOnMobile = () => {
  if (window.innerWidth <= 768) {
    sidebarStore.closeSidebar()
  }
}
</script>

<style scoped>
.search-wrap {
  position: relative;
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: none;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

a {
  display: block;
  color: white;
  text-decoration: none;
  margin: 5px 0;
  padding: 5px;
  border-radius: 6px;
}

a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 关闭按钮 — 仅移动端可见 */
.close-btn {
  display: none;
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 51;
}

/* 遮罩层 — 仅移动端可见 */
.sidebar-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 49;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
}

@media (max-width: 768px) {
  .close-btn {
    display: block;
  }

  .sidebar-backdrop {
    display: block;
  }
}
</style>
