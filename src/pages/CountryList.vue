<template>
    <div class="content">
      <h1>国家介绍</h1>
      <!-- 展示卡片 -->
      <div class="grid">
        <div v-for="item in countries" :key="item.id" class="card"
        @click="goDetail(item.id)">
          <img :src="item.images" class="flag" />
          <h3>{{ item.countryChineseName }}</h3>
          <p class="shortIntro">{{ item.shortContents }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import countries from '../data/CountryInfo.json'
    import { useRouter } from 'vue-router'
    // 添加路由控制，点击展示卡片跳转到详情页
    const router = useRouter()

    const goDetail = (id: number) => {
      router.push(`/country/${id}`)
    }
  </script>
  
  <style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }
  
  .card {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
  }

  .flag {
    width: 100%;
    aspect-ratio: 790 / 530;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .shortIntro {
    text-indent: 2em;
    text-align: left;
  }

  </style>