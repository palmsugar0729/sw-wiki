<template>
  <div id="app">
    <!-- 上半部分：左右布局 -->
    <div class="layout">
      <Sidebar />
      <div class="main">
        <router-view />
      </div>
    </div>

    <!-- 底部：整个底部页面 -->
     <Footer />
  </div>
    
</template>

<script setup lang="ts">
  import Sidebar from './components/Sidebar.vue'
  import Footer from './components/Footer.vue';
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background: #0ea5e9;
  color: white;
}

.layout {
  display: flex;
  flex: 1;
}

.layout .main {
  flex: 1;
}

#app .layout .sidebar {
  width: 250px;
  background: #0284c7;
  padding: 15px;
  /* overflow-y: auto; */
}

.sidebar h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.sidebar a {
  display: block;
  color: white;
  text-decoration: none;
  margin: 5px 0;
  padding: 5px;
  border-radius: 6px;
}

.sidebar a:hover {
  background: rgba(255,255,255,0.2);
}

.content {
  flex: 1;
  padding: 20px;
  /* overflow-y: auto; */
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.search-box {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: none;
}

.article {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 12px;
}
</style>