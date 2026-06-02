<template>
  <div
    class="page detail-bg"
    v-if="character"
    :style="{
      '--bg-image': `url(${getEntityImage('character', character.id, character.background)})`,
    }"
  >
    <div class="page-content detail-page">
      <div class="detail-container">
        <!-- 上半部分 -->
        <div class="top-section">
          <!-- 左侧表格 -->
          <table class="infoTable">
            <tr v-for="(item, index) in character.info" :key="index">
              <td class="label">{{ item.label }}</td>

              <td class="value">
                <template v-if="Array.isArray(item.value)">
                  <div
                    v-for="(v, i) in item.value"
                    :key="i"
                    v-html="renderText(v)"
                    @click="handleLinkClick"
                  ></div>
                </template>

                <template v-else>
                  <span
                    v-html="renderText(item.value)"
                    @click="handleLinkClick"
                  ></span>
                </template>
              </td>
            </tr>
          </table>

          <!-- 右 按钮切换图片 -->
          <div class="right">
            <div class="tabs">
              <button
                v-for="key in imageKeys"
                :key="key"
                :class="{ active: currentImage === key }"
                @click="currentImage = key"
              >
                {{ getImageLabel(key) }}
              </button>
            </div>

            <img
              class="mainImage"
              :src="getEntityImage('character', character.id, character.images[currentImage])"
              alt="啊咧？图片怎么没了？"
            />
          </div>
        </div>

        <!-- 中 -->
        <div class="introduction" @click="handleLinkClick">
          <template v-for="(block, index) in character.content" :key="index">
            <p
              v-if="block.type === 'text'"
              v-html="renderText(block.value)"
            ></p>

            <img
              v-else-if="block.type === 'image'"
              :src="getEntityImage('character', character.id, block.value)"
            />
          </template>
        </div>

        <!-- 下 -->
        <h2 class="g-title">美图一览</h2>
        <div class="gallery" v-if="character.gallery?.length">
          <img
            v-for="(img, i) in character.gallery"
            :key="i"
            :src="getEntityImage('character', character.id, img)"
            class="thumb"
            @click="openPreview(i)"
          />
        </div>

        <!-- 大图预览 -->
        <ImageViewer
          v-model="previewVisible"
          :images="galleryUrls"
          :initial-index="currentIndex"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import raw from '@/data/CharaInfo.json'
import { ref, computed, watch } from 'vue'
import { renderText } from '@/utils/render'
import { getEntityImage } from '@/utils/media'
import { useWikiLink } from '@/composables/useWikiLink'
import ImageViewer from '@/components/ImageViewer.vue'
import type { Character } from '@/types'

/* 数据 */
const characters = raw as Character[]
const route = useRoute()
const { handleLinkClick } = useWikiLink()

/* 动态计算，找到当前角色 */
const character = computed(() =>
  characters.find((ch) => ch.id === String(route.params.id))
)

/* 当前图片 */
const currentImage = ref<string>('')
/* 自动初始化 */
watch(
  () => character.value,
  (val) => {
    if (val?.images) {
      currentImage.value = Object.keys(val.images)[0]
    }
  },
  { immediate: true }
)
/* 图片 keys */
const imageKeys = computed(() => {
  if (!character.value) return []
  return Object.keys(character.value.images)
})
/* 标签映射 */
const getImageLabel = (key: string) => {
  if (key.includes('charaIll')) return '立绘'
  if (key === 'emblem') return '徽章'
  if (key === 'shield') return '护盾'
  if (key === 'icon') return '头像'
  return key
}

/* 大图预览 */
const previewVisible = ref(false)
const currentIndex = ref(0)

const galleryUrls = computed(() => {
  if (!character.value) return []
  return character.value.gallery.map((img) =>
    getEntityImage('character', character.value!.id, img)
  )
})

const openPreview = (index: number) => {
  currentIndex.value = index
  previewVisible.value = true
}
</script>

<style scoped>
.top-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;

  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

  button {
    padding: 6px 12px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: #000;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #0284c7;
    }
  }
  .active {
    background: #0284c7;
  }
}

.mainImage {
  width: 70%;
  max-width: 320px;
  border-radius: 8px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.2);
}

.g-title {
  margin-bottom: 10px;
  color: #facc15;
  font-size: 30px;
}

.gallery {
  display: grid;
  margin-top: 40px;
  grid-template-columns: repeat(auto-fill, 120px);
  gap: 10px;
  .thumb {
    width: 100%;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.1);
    }
  }
}

/* 移动端 ≤768px */
@media (max-width: 768px) {
  .top-section {
    grid-template-columns: 1fr;
  }

  .mainImage {
    width: 100%;
    max-width: 100%;
  }

  .gallery {
    grid-template-columns: repeat(auto-fill, 80px);
    gap: 8px;
  }
}
</style>
