<template>
  <div class="content">
    <div class="detail-container">
      
      <div v-for="item in views" :key="item.id" class="section">
        <h1>{{ item.title }}</h1>
        <p v-html="render(item.content)"></p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked'
  import raw from '../data/WorldView.json'

  type WorldView = {
    id: number
    title: string
    content: string
  }

  const views = raw as WorldView[]

  const render = (text: string) => {
    return marked(text || '')
  }
</script>

<style scoped>
  .detail-container {
    display: block;
    max-width: 900px;
    margin: 0 auto;
    padding: 10px 20px;
  }

  /* 每一块世界观 */
  .section {
    margin-bottom: 60px;
  }

  /* 标题 */
  h1 {
    font-size: 40px;
    margin-bottom: 15px;
    border-bottom: 2px solid rgba(255,255,255,0.3);
    padding-bottom: 8px;
  }

  /* 段落 */
  p {
    margin: 10px 0;
    line-height: 1.8;
    text-indent: 2em;
    text-align: left;
  }
</style>