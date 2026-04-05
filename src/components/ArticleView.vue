<template>
    <div class="content" v-html="html"></div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { articles, type Article } from '../data/articles'
  import { marked } from 'marked'
  
  const route = useRoute()
  
  const id = Number(route.params.id)
  const article: Article | undefined = articles.find(a => a.id === id)
  
  const html = article
    ? marked.parse(article.content) as string
    : '未找到文章'
  </script>
  