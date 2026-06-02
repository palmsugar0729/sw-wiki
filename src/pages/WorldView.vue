<template>
  <div class="page list-bg">
    <div class="page-content">
      <div class="detail-container">
        <div v-for="item in views" :key="item.id" class="section">
          <h1>{{ item.title }}</h1>
          <p v-html="render(item.content)"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import raw from '@/data/WorldView.json'
import type { WorldViewItem } from '@/types'

const views = raw as WorldViewItem[]

const render = (text: string) => {
  return marked(text || '')
}
</script>

<style scoped>
.section {
  margin-bottom: 60px;
}
</style>
