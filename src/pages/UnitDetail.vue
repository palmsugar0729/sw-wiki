<template>
  <div class="page detail-bg" 
    v-if="unit"
    :style="{'--bg-image': `url(${getBg(unit.id, unit.background)})`
  }">
    <div class="page-content">
      
      <h1 class="title">部队介绍</h1>

      <!-- 上半部分：信息 + 图片 -->
      <div class="top-section">

        <!-- 左侧：信息 -->
         <table class="infoTable">
          <tr v-for="(item, index) in unit.info" :key="index">
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

        <!-- 右侧：图片 -->
        <div class="image">
          <img 
          :src="getEm(unit.id, unit.emblem)" 
          alt="unit image" />
        </div>

      </div>

      <!-- 下半部分：部队介绍 -->
      <div class="introduction" @click="handleLinkClick">
        <div v-html="renderText(unit.history)"></div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import raw from '../data/UnitInfo.json'
  import { renderText } from '../utils/render'
  
  /* ✅ 定义类型 */
  type InfoItem = {
      label: string
      value: string | string[]
    }

  type Unit = {
    id: string
    info: InfoItem[]
    emblem: string
    background: string
    history: string
    tags: string[]
  }
  
  /* 数据 */
  const units = raw as Unit[]
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

  /* 找到当前部队 */ 
  const unit = computed(() => 
    units.find(u => u.id === String(route.params.id))
  )

  // 获取部队标识
  const getEm = (id: string, name?: string) => {
    if (!name) return ''
    return `/wiki/unit/${id}/${name}.jpg`
  }
  // 或许背景图片
  const getBg = (id: string, name?: string) => {
    if (!name) return ''
    return `/wiki/unit/${id}/${name}.jpg`
  }
</script>
  
  

<style>
  .detail {
    padding: 20px;
    color: #fff;
  }

  /* 背景 */
  .detail-bg::before {
    content: '';
    grid-area: 1/1;
    background-image: var(--bg-image);  /* 👈 关键 */
    background-size: cover;
    background-position: center;
    filter: blur(6px);
    opacity: 0.5;
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

  /* 右侧图片 */
  .top-section .image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  .top-section .image img {
    max-width: 100%;
    border-radius: 10px;
  }

  /* 底部 历史区域 */
  .introduction {
    margin-top: 20px;
  }

  /* Markdown 标题 */
  .introduction h2 {
    margin-top: 20px;
    margin-bottom: 35px;
    font-size: 40px;
  }
  /* 历史正文 */
  .introduction p {
    line-height: 1.6;
    text-align: left;
    text-indent: 2em;
    color: #fff;
  }

</style>