<template>
  <div class="page list-bg">
    <div class="list-page page-content">
      <h1>国家介绍</h1>
      <div class="grid">
        <div
          v-for="item in countries"
          :key="item.id"
          class="card"
          @click="goDetail(item.id)"
        >
          <img :src="item.images" class="flag" />
          <h3>{{ item.countryChineseName }}</h3>
          <p class="shortIntro">{{ item.shortContents }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Country } from '@/types'
import countriesRaw from '@/data/CountryInfo.json'
import { useRouter } from 'vue-router'

const countries = countriesRaw as Country[]
const router = useRouter()

const goDetail = (id: string) => {
  router.push(`/country/${id}`)
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.flag {
  width: 100%;
  aspect-ratio: 790 / 530;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.shortIntro,
h3 {
  font-weight: bold;
}

.shortIntro {
  text-indent: 2em;
  text-align: left;
}

/* 移动端 ≤768px */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
