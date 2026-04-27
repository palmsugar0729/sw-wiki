<template>
  <div class="page homepage-bg">
    <div class="page-content">
      <h1>欢迎来到强袭魔女系列中文资料站</h1>

      <div class="infoBox">
        <!-- 新闻 -->
        <div class="news">
          <h2>热点新闻</h2>

          <div 
            v-for="item in displayNews"
            :key="item.id"
            class="news-item">

            <!-- 标题 -->
            <div class="title">
              <span class="source">{{ item.source }}</span>
              <span class="date">{{ item.date }}</span>
            </div>

            <!-- 内容 -->
            <div 
              v-html="renderText(item.content)"
              @click="handleLinkClick"
              class="content">
            </div>

            <!-- 图片 -->
            <div class="images" v-if="item.images?.length">
              <img
                v-for="(img, i) in item.images"
                :key="img"
                :src="getNewsImage(item.id, img)"
                @click="openPreview(item, i)"
              >
            </div>

            <!-- 外链 -->
            <div
              v-if="item.link"
              @click="goExternal(item.link)"
              class="link">
              查看原文
            </div>
          </div>
        </div>

        <!-- 最近更新 -->
        <div class="recent">
          <h2>最近更新</h2>

          <div
            v-for="item in recentCharacters"
            :key="item.id"
            class="recent-item"
            @click="goDetail(item.id)"
          >
            <img
              :src="getImage(item.id, item.images.icon)"
              class="icon"
            />

            <div class="recent-content">
              <div class="name">
                {{ getName(item.info) }}
              </div>
              <div class="date">
                {{ item.updatedAt }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 全局图片预览 -->
    <div v-if="previewVisible" class="viewer" @click.self="close">
      <button class="nav left" @click.stop="prev">‹</button>

      <img
        :src="currentSrc"
        class="image"
        :class="transitionName"
      />

      <button class="nav right" @click.stop="next">›</button>

      <div class="close" @click="close">×</div>
    </div>

  </div>
</template>

<script setup lang="ts">
  /* 引入 */
  import { useRouter } from 'vue-router'
  import { renderText } from '../utils/render'
  import newsRaw from '../data/news.json'
  import charaRaw from '../data/CharaInfo.json'
  import { ref, computed } from 'vue'

 /*  类型 */
  type News = {
    id: string
    date: string
    source: string
    content: string
    link?: string
    images: string[]
  }

  type InfoItem = {
    label: string
    value: string | string[]
  }

  type Character = {
    id: string
    updatedAt: string
    info: InfoItem[]
    images: Record<string, string>
  }

  /* 数据 */
  const router = useRouter()
  const news = newsRaw as News[]
  const characters = charaRaw as Character[]

  /* 热点新闻 */
  const displayNews = computed(() => {
    return [...news]
      .sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 3)
  })

  const getNewsImage = (id: string, name?: string) => {
    if (!name) return ''
    return `/wiki/news/${id}/${name}.jpg`
  }

  /* 大图预览 */
  const previewVisible = ref(false)
  const previewList = ref<string[]>([])
  const previewIndex = ref(0)
  const previewId = ref('')
  const transitionName = ref('fade')

  const openPreview = (item: News, index: number) => {
    previewList.value = item.images
    previewIndex.value = index
    previewId.value = item.id
    previewVisible.value = true
  }

  const currentSrc = computed(() => {
    const name = previewList.value[previewIndex.value]
    return `/wiki/news/${previewId.value}/${name}.jpg`
  })

  const close = () => {
    previewVisible.value = false
  }

  const next = () => {
    transitionName.value = 'slide-left'
    previewIndex.value =
      (previewIndex.value + 1) % previewList.value.length
  }

  const prev = () => {
    transitionName.value = 'slide-right'
    previewIndex.value =
      (previewIndex.value - 1 + previewList.value.length) %
      previewList.value.length
  }

  /* 外链跳转 */
  const goExternal = (url: string) => {
    window.open(url, '_blank')
  }

  /* 内链点击 */
  const handleLinkClick = (e: Event) => {
    const el = e.target as HTMLElement

    if (el.classList.contains('wiki-link')) {
      const type = el.dataset.type
      const id = el.dataset.id
      if (!type || !id) return
      router.push(`/${type}/${id}`)
    }
  }

  /* 最近更新 */
  const recentCharacters = computed(() => {
    return [...characters]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )
      .slice(0, 5)
  })

  const getName = (info: InfoItem[]) => {
    const nameItem = info.find(i => i.label === '姓名')
    return nameItem?.value || '未知'
  }

  const getImage = (id: string, name: string) => {
    return `/wiki/character/${id}/${name}.jpg`
  }

  const goDetail = (id: string) => {
    router.push(`/character/${id}`)
  }
</script>

<style scoped>
  .page-content h1 {
    margin-bottom: 30px;
    font-size: 50px;
    text-align: center;
    font-weight: bold;
    color: #facc15;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  /* 热点盒子部分 */
  .infoBox {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 60px;
  }

  .infoBox > div {
    background: rgba(255, 255, 255, 0.78);
    padding: 20px;
    border-radius: 10px;
    min-height: 200px;
    transition: all 0.2s ease;
  }

  .infoBox h2 {
    font-size: 35px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  /* 热点新闻 */
  .title{
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 8px;
  }

  .title > span {
    font-size: 20px;
    font-weight: normal;
    color: #000;
  }
  .title .date {
    font-size: 14px;
  }

  .news-item {
    padding: 15px;
    margin-bottom: 15px;
    background: rgba(244, 221, 223, 0.6);
    border-radius: 10px;
    transition: 0.2s;
  }

  .news-item:hover, .recent-item:hover {
    background: rgba(217, 52, 72, 0.6);
  }

  .content {
    font-size: 14px;
    margin-bottom: 10px;
    color: #000;
    text-align: left;
    text-indent: 2em;
  }

  .images {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .images img {
    width: 120px;
    border-radius: 6px;
    cursor: pointer;
  }

  .link {
    margin-top: 10px;
    font-size: 13px;
    color: #0050A5;
    cursor: pointer;
  }

  /* 最近更新 */
  .recent-item {
    display: flex;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(244, 221, 223, 0.6);
  }

  /* 头像 */
  .recent-item .icon {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
  }

  /* 内容 */
  .recent-content {
    padding-top: 27px;
    padding-left: 40px;
  }

  .recent-content .name {
    color: #000;
    font-weight: bold;
    font-size: 25px;
  }

  .recent-content .date {
    color: #000;
    font-size: 15px;
    opacity: 0.7;
    text-align-last: left;
  }

  /* 大图预览 */

  .viewer {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .image {
    max-width: 85%;
    max-height: 85%;
    border-radius: 8px;
    transition: all 0.25s ease;
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    background: none;
    border: none;
    cursor: pointer;
  }

  .left { left: 30px; }
  .right { right: 30px; }

  .close {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 40px;
    color: #fff;
    cursor: pointer;
  }
</style>