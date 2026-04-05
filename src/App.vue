<template>
  <div class="layout">
    <Sidebar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0ea5e9;
  color: white;
}

.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: #0284c7;
  padding: 15px;
  overflow-y: auto;
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
  overflow-y: auto;
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