<template>
  <div class="page-bg">
    <div class="page-content">
      <h1>部队介绍</h1>
      <!-- 展示卡片 -->
      <div class="grid">
        <div v-for="item in units" :key="item.id" class="card"
        @click="goDetail(item.id)">
          <img :src="item.images" class="emblem" />
          <h3>{{ getInfo(item.info, '部队名') }}</h3>
          <h3>{{ getInfo(item.info, '外号') }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import units from '../data/UnitInfo.json'
  import { useRouter } from 'vue-router'
  // 添加路由控制，点击展示卡片跳转到详情页
  const router = useRouter()

  const goDetail = (id: string) => {
    router.push(`/unit/${id}`)
  }

  // 调用json中info里的任意信息
  const getInfo = (info: any[], label:string) => {
    return info.find(i => i.label === label)?.value || ''
  }
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.emblem {
  width: 100%;
  aspect-ratio: 650 / 650;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
}

</style>