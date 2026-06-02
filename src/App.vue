<template>
  <div id="app">
    <!-- 上半部分，header -->
    <Header />
    <!-- 中间部分 -->
    <div class="layout">
      <Sidebar />
      <div class="main" :class="{ 'sidebar-hidden': isCollapsed }">
        <router-view />
      </div>
    </div>

    <!-- 底部：整个底部页面 -->
     <Footer />
  </div>
    
</template>

<script setup lang="ts">
  import Header from '@/components/Header.vue'
  import Sidebar from '@/components/Sidebar.vue'
  import Footer from '@/components/Footer.vue'
  import { computed } from 'vue'
  import { useSidebarStore } from '@/store/sidebar'

  const sidebarStore = useSidebarStore()
    const isCollapsed = computed(() => sidebarStore.isCollapsed)
</script>

