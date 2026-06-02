<template>
  <div class="page list-bg">
    <div class="page-content list-page">
      <h1>人物介绍</h1>
      <!-- 展示卡片 -->
      <div class="grid">
        <div
          v-for="item in characters"
          :key="item.id"
          class="card"
          @click="goDetail(item.id)"
        >
          <img :src="getEntityImage('character', item.id, item.images.icon)" class="icon" />
          <h3>{{ getInfoValue(item.info, '姓名') }}</h3>
          <h3>{{ getInfoValue(item.info, '外语名') }}</h3>
          <h3>{{ getInfoValue(item.info, '所属') }}</h3>
          <p class="shortIntro">{{ item.shortContents }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '@/types'
import charactersRaw from '@/data/CharaInfo.json'
import { useRouter } from 'vue-router'
import { getEntityImage, getInfoValue } from '@/utils/media'

const characters = charactersRaw as Character[]
const router = useRouter()

const goDetail = (id: string) => {
  router.push(`/character/${id}`)
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 15px;
}

.icon {
  width: 100%;
  aspect-ratio: 200 / 200;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 移动端 ≤768px */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
