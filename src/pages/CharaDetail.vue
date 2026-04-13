<template>
    <div class="content" v-if="character">
  
      <h1 class="title">人物介绍</h1>
  
      <!-- 上半部分 -->
      <div class="top-section">
  
        <!-- 左 -->
        <table class="infoTable">
          <tr v-for="(item, index) in character.info" :key="index">
            <td class="label">{{ item.label }}</td>
  
            <td class="value">
              <template v-if="Array.isArray(item.value)"  @click="handleLinkClick">
                <div v-for="(v, i) in item.value" :key="i" v-html="renderText(v)">
                </div>
              </template>
  
              <template v-else>
                <span v-html="renderText(item.value)"></span>
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
            :src="getImage(character.id, character.images[currentImage])"
            alt="啊咧？图片怎么没了？"
          />
        </div>
  
      </div>
  
      <!-- 中 -->
      <div class="introduction" @click="handleLinkClick">
        <template v-for="(block, index) in character.content" :key="index">
  
          <p v-if="block.type === 'text'" v-html="renderText(block.value)">
          </p>
  
          <img
            v-else-if="block.type === 'image'"
            :src="getImage(character.id, block.value)"
          />
  
        </template>
  
      </div>
  
      <!-- 下 -->
      <div class="gallery" v-if="character.gallery?.length">
        <h2>美图一览</h2>
  
        <img
          v-for="img in character.gallery"
          :key="img"
          :src="getImage(character.id, img)"
        />
      </div>
  
    </div>
  
    <div v-else>
      <h2>未找到该角色</h2>
    </div>
</template>
  
<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router'
    import raw from '../data/CharaInfo.json'
    import { ref, computed, watch } from 'vue'
    import { renderText } from '../utils/render'
    
    /* 类型 */
    type InfoItem = {
      label: string
      value: string | string[]
    }

    type ContentBlock = {
      type: 'text' | 'image'
      value: string
    }

    type Character = {
      id: string
      info: InfoItem[]
      images: Record<string, string>
      shortContents: string
      content: ContentBlock[]
      gallery: string[]
      tag: string[]
    }

    /* 数据 */
    const characters = raw as Character[]
    const route = useRoute()
    const router = useRouter()

    // 处理内链接点击
    const handleLinkClick = (e: Event) => {
      const el = e.target as HTMLElement

      if (el.classList.contains('wiki-link')) {
        const type = el.dataset.type
        const id = el.dataset.id

        if (!type || !id) return

        router.push(`/${type}/${id}`)
      }
    }

    /* 动态计算，找到当前角色 */
    const character = computed(() =>
      characters.find(ch => ch.id === String(route.params.id))
    )

    /* 图片路径 */
    const getImage = (id: string, name?: string) => {
      if (!name) return ''
      return `/wiki/character/${id}/${name}.jpg`
    }

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
</script>
  
<style scoped>
    .detail {
      padding: 20px;
      color: #fff;
    }

    /* ===== 标题 ===== */
    .title {
      margin-bottom: 20px;
      text-align: center;
    }

    /* ===== 上半部分 ===== */
    .top-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: start;
    }

    /* ===== 表格 ===== */
    .infoTable {
      width: 100%;
      border-collapse: collapse;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      overflow: hidden;
    }

    .infoTable tr {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .infoTable td {
      height: 50px;
    }

    .label {
      width: 30%;
      color: #ccc;
      font-size: 20px;
    }

    .value {
      white-space: normal;
      font-size: 20px;
    }

    /* ===== 右侧图片区 ===== */
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ===== tabs ===== */
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .tabs button {
      padding: 6px 12px;
      border: none;
      background: rgba(255,255,255,0.1);
      color: #fff;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.2s;
    }

    .tabs button:hover {
      background: rgba(255,255,255,0.2);
    }

    .tabs .active {
      background: #0284c7;
    }

    /* ===== 主图 ===== */
    .mainImage {
      width: 70%;
      max-width: 320px;
      border-radius: 8px;
      object-fit: contain;
      background: rgba(0,0,0,0.2);
    }

    /* ===== 中间介绍 ===== */
    .introduction {
      margin-top: 30px;
      line-height: 1.6;
    }

    .introduction p {
      text-indent: 2em;
      margin: 10px 0;
    }

    .introduction img {
      width: 25%;
      margin: 15px 0;
      border-radius: 8px;
    }

    /* ===== 图集 ===== */
    .gallery {
      margin-top: 40px;
    }

    .gallery h2 {
      margin-bottom: 10px;
    }

    /* 图集网格（比 flex 更整齐） */
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
    }

    .gallery img {
      width: 100%;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.2s;
    }

    /* 悬浮效果 */
    .gallery img:hover {
      transform: scale(1.05);
    }
</style>