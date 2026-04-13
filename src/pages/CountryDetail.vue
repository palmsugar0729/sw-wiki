<template>
  <div class="content">
    <div class="detail-container" v-if="country">
      
      <!-- 左侧内容 -->
      <div class="info" @click="handleLinkClick">
        <h1>{{ country.countryChineseName }}</h1>
        <h3>{{ country.countryEnglishName }}</h3>

        <div v-html="renderText(country.territory)"></div>
        <div v-html="renderText(country.history)"></div>
        <div v-html="renderText(country.polity)"></div>
        <div v-html="renderText(country.military)"></div>
      </div>

      <!-- 右侧国旗 -->
      <div class="side">
        <img :src="country.images" class="flag" />
      </div>
    </div>

    <!-- 找不到国家 -->
    <div v-else>
      <h2>未找到该国家</h2>
    </div>
  </div>

</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import raw from '../data/CountryInfo.json'
  import { renderText } from '../utils/render'
  
  /* ✅ 定义类型 */
  type Country = {
    id: number
    countryChineseName: string
    countryEnglishName: string
    images: string
    territory: string
    history: string
    polity: string
    military: string
  }
  
  /* ✅ 让 TS 认识 JSON */
  const countries = raw as Country[]
  const route = useRoute()
  const router = useRouter()
  
  /* ✅ 找到当前国家 */
  const country = countries.find(
    (c) => c.id === Number(route.params.id)
  )

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
  
</script>

<style>
  .detail-container {
    display: flex;
    gap: 20px;
  }
  
  /* 左侧 */
  .info {
    flex: 2;
  }
  
  /* 右侧 */
  .side {
    flex: 1;
  }
  
  /* 国旗 */
  .flag {
    width: 100%;
    border-radius: 10px;
  }
  
  /* 标题 */
  .info h1 {
    margin-bottom: 5px;
  }
  
  .info h3 {
    margin-top: 25px;
    margin-bottom: 15px;
    color: #ddd;
  }
  
  /* Markdown 内容优化 */
  .info img {
    max-width: 100%;
    border-radius: 8px;
    margin: 10px 0;
  }
  
  .info p {
    line-height: 1.6;
    text-align: left;
    text-indent: 2em;
  }
  
  .info h2 {
    margin-top: 20px;
  }
</style>