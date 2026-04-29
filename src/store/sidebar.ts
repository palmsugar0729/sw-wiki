// src/store/sidebar.js
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isCollapsed: false  // 侧边栏是否收起
  }),
  
  actions: {
    // 切换侧边栏状态
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    },
    
    // 打开侧边栏
    openSidebar() {
      this.isCollapsed = false
    },
    
    // 关闭侧边栏
    closeSidebar() {
      this.isCollapsed = true
    }
  },
  
  getters: {
    // 获取侧边栏状态
    sidebarState: (state) => state.isCollapsed
  }
})