<template>
  <div v-if="visible && hasResults" class="search-dropdown" @click.stop>
    <!-- 分组 -->
    <div v-for="group in results" :key="group.type" class="group">
      <div class="group-label">{{ group.label }}</div>
      <div
        v-for="item in group.items"
        :key="`${item.type}-${item.id}`"
        class="result-item"
        @click="onSelect(item)"
      >
        <span class="item-title">{{ item.title }}</span>
        <span class="item-subtitle" v-if="item.subtitle">{{ item.subtitle }}</span>
        <span class="item-type-tag">{{ group.label }}</span>
      </div>
    </div>
  </div>

  <!-- 有输入但无结果 -->
  <div v-else-if="visible && !hasResults" class="search-dropdown empty" @click.stop>
    <div class="empty-text">未找到相关条目</div>
  </div>
</template>

<script setup lang="ts">
import type { SearchGroup, SearchResult } from '@/composables/useSearch'
import { computed } from 'vue'

const props = defineProps<{
  results: SearchGroup[]
  visible: boolean
}>()

const emit = defineEmits<{
  select: [item: SearchResult]
}>()

const hasResults = computed(() =>
  props.results.some(g => g.items.length > 0)
)

const onSelect = (item: SearchResult) => {
  emit('select', item)
}
</script>

<style scoped>
.search-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  max-height: 60vh;
  overflow-y: auto;
  z-index: 60;
}

.group-label {
  padding: 8px 12px 4px;
  font-size: 12px;
  color: #999;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #e0f7fa;
  }
}

.item-title {
  font-size: 14px;
  color: #222;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-subtitle {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-type-tag {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 11px;
  color: #0284c7;
  background: #e0f0ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.empty-text {
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #999;
}

/* 移动端 */
@media (max-width: 768px) {
  .search-dropdown {
    position: fixed;
    left: 10px;
    right: 10px;
    top: auto;
    margin-top: 60px;
    max-height: 50vh;
  }
}
</style>
