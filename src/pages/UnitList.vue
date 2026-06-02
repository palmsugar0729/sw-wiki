<template>
  <div class="page list-bg">
    <div class="page-content list-page">
      <h1>部队介绍</h1>
      <div class="grid">
        <div
          v-for="item in units"
          :key="item.id"
          class="card"
          @click="goDetail(item.id)"
        >
          <img :src="getEntityImage('unit', item.id, item.images.emblem)" class="emblem" />
          <h3>{{ getInfoValue(item.info, '部队名') }}</h3>
          <h3>{{ getInfoValue(item.info, '外号') }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Unit } from '@/types'
import unitsRaw from '@/data/UnitInfo.json'
import { useRouter } from 'vue-router'
import { getEntityImage, getInfoValue } from '@/utils/media'

const units = unitsRaw as Unit[]
const router = useRouter()

const goDetail = (id: string): void => {
  router.push(`/unit/${id}`)
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
  aspect-ratio: 200 / 200;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 移动端 ≤768px */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
