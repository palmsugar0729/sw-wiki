<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 搜索（以后再用） -->
    <input v-model="keyword" placeholder="搜索" />

    <!-- 固定入口 -->
    <router-link to="/">首页</router-link>
    <router-link to="/world">世界观</router-link>
    <router-link to="/countries">国家介绍</router-link>
    <router-link to="/units">部队介绍</router-link>
    <router-link to="/characters">人物介绍</router-link>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useSidebarStore } from '../store/sidebar'

  const keyword = ref('')
  const sidebarStore = useSidebarStore()
  const isCollapsed = computed(() => sidebarStore.isCollapsed)
</script>

<style>
  
</style>