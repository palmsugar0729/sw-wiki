<template>
    <div class="page-bg">
      <div class="page-content">
        <h1>人物介绍</h1>
        <!-- 展示卡片 -->
        <div class="grid">
          <div v-for="item in characters" :key="item.id" class="card"
          @click="goDetail(item.id)">
            <img :src="getImage(item, 'icon')" class="icon" />
            <h3>{{ getInfo(item.info, '姓名') }}</h3>
            <h3>{{ getInfo(item.info, '外语名') }}</h3>
            <h3>{{ getInfo(item.info, '所属') }}</h3>
            <p class="shortIntro">{{ item.shortContents }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import characters from '../data/CharaInfo.json'
    import { useRouter } from 'vue-router'
    // 添加路由控制，点击展示卡片跳转到详情页
    const router = useRouter()

    const goDetail = (id: string) => {
      router.push(`/character/${id}`)
    }

    // 通过json中的信息，获取images中的任意图片路径
    const getImage = (character: any, key: string) => {
        const name = character.images[key]
        return `/wiki/character/${character.id}/${name}.jpg`
    }

    // 调用json中info里的任意信息
    const getInfo = (info: any[], label: string) => {
      return info.find(i => i.label === label)?.value || ''
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
    border: 1px solid rgba(255,255,255,0.2);
  }

  .shortIntro {
    text-indent: 2em;
    text-align: left;
  }

  </style>