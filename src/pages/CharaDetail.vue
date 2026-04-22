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
              <template v-if="Array.isArray(item.value)">
                <div v-for="(v, i) in item.value" 
                :key="i" 
                v-html="renderText(v)"
                @click="handleLinkClick"
              >
                </div>
              </template>
  
              <template v-else>
                <span 
                v-html="renderText(item.value)"
                @click="handleLinkClick"></span>
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
          v-for="(img, i) in character.gallery"
          :key="i"
          :src="getImage(character.id, img)"
          class="thumb"
          @click="openPreview(i)"
        />
      </div>
        <!-- 大图预览 -->
      <div v-if="previewVisible" class="preview" @click.self="closePreview">

        <!-- 左按钮 -->
        <button class="nav left" @click.stop="prevImage">‹</button>

        <!-- 图片（带动画） -->
        <transition :name="transitionName">
          <img
            :key="currentIndex"
            :src="getImage(character.id, character.gallery[currentIndex])"
            class="preview-img"
          />
        </transition>

        <!-- 右按钮 -->
        <button class="nav right" @click.stop="nextImage">›</button>

      </div>
  
    </div>
  
    <div v-else>
      <h2>未找到该角色</h2>
    </div>
</template>
  
<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router'
    import raw from '../data/CharaInfo.json'
    import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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

    /* 大图预览 */
    const previewVisible = ref(false)
    const currentIndex = ref(0)
    const transitionName = ref('slide-left')

    const openPreview = (index: number) => {
      currentIndex.value = index
      previewVisible.value = true
    }

    const closePreview = () => {
      previewVisible.value = false
    }

    const galleryList = computed(() => character.value?.gallery || [])

    /* 👉 下一张 */
    const nextImage = () => {
      transitionName.value = 'slide-left'
      currentIndex.value =
        (currentIndex.value + 1) % galleryList.value.length
    }

    /* 👉 上一张 */
    const prevImage = () => {
      transitionName.value = 'slide-right'
      currentIndex.value =
        (currentIndex.value - 1 + galleryList.value.length) %
        galleryList.value.length
    }

    /* 👉 键盘支持 */
    const handleKey = (e: KeyboardEvent) => {
      if (!previewVisible.value) return
    
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closePreview()
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKey)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKey)
    })
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
  /* 图集网格 */
  .gallery {
    display: grid;
    margin-top: 40px;
    grid-template-columns: repeat(auto-fill, 120px);
    gap: 10px;
  }
  .gallery h2 {
    margin-bottom: 10px;
  }
  .thumb {
    width: 100%;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .thumb:hover {
    transform: scale(1.1);
  }
  /* 预览层 */
  .preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
  
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .preview-img {
    max-width: 85%;
    max-height: 85%;
    position: absolute;
  }
  /* 左右按钮 */
  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 40px;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 10;
  }
  .nav.left {
    left: 20px;
  }
  .nav.right {
    right: 20px;
  }
  /* 轮播动画 */
  /* 👉 左滑（下一张） */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.3s ease;
  }
  .slide-left-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
  /* 👉 右滑（上一张） */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.3s ease;
  }
  .slide-right-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

</style>