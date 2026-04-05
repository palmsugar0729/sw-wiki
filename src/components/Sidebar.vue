<template>
    <div class="sidebar">
      <h2>SW-WIKI</h2>
      <input v-model="keyword" placeholder="搜索" />
      <div v-for="item in filtered" :key="item.id">
        <router-link :to="'/article/' + item.id">
          {{ item.title }}
        </router-link>
      </div>
      <router-link to="/countries">🌍 国家介绍</router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { articles, type Article } from '../data/articles'
  
  
  const keyword = ref<string>('')
  
  const filtered = computed<Article[]>(() =>
    articles.filter(a => a.title.includes(keyword.value))
  )
  </script>
  