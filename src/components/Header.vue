<template>
  <div class="header">
    <div class="left-content">
      <!-- 侧边栏按钮，点击收起或展开 -->
      <button
        type="button"
        class="grid-item sidebar-btn"
        id="sidebarBtn"
        @click="toggleSidebar"
        :class="{ active: isCollapsed }"
      >
        <span class="sidebar-icon"></span>
      </button>
      <div class="grid-item page-title">
        {{ pageTitle }}
      </div>
    </div>
    <div class="right-content">
      <template v-if="auth.isLoggedIn">
        <span class="user-greeting" :title="auth.user?.email">
          {{ auth.user?.nickname || auth.user?.email?.split('@')[0] || '用户' }}
        </span>
        <button class="auth-btn logout-btn" @click="handleLogout">退出</button>
      </template>
      <template v-else>
        <router-link to="/login" class="auth-btn login-btn">登录</router-link>
        <router-link to="/register" class="auth-btn register-btn">注册</router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "@/store/sidebar";
import { useAuthStore } from "@/store/auth";
import { useRoute, useRouter } from "vue-router";
import type { Character, Country, Unit, InfoItem } from "@/types";

import charactersRaw from "@/data/CharaInfo.json";
import countriesRaw from "@/data/CountryInfo.json";
import unitsRaw from "@/data/UnitInfo.json";

const characters = charactersRaw as Character[]
const countries = countriesRaw as Country[]
const units = unitsRaw as Unit[]

const route = useRoute();
const router = useRouter();

const sidebarStore = useSidebarStore();
const auth = useAuthStore();

const isCollapsed = computed(() => sidebarStore.isCollapsed);
const toggleSidebar = () => {
  sidebarStore.toggleSidebar();
};

const handleLogout = async () => {
  await auth.logout();
  router.push("/");
};

// 页面标题
const pageTitle = computed(() => {
  const path = route.path;
  const id = route.params.id as string;

  // 首页
  if (path === "/") return "首页";

  // 列表页
  if (path.startsWith("/world")) return "世界观";
  if (path.startsWith("/countries")) return "国家介绍";
  if (path.startsWith("/units")) return "部队介绍";
  if (path.startsWith("/characters")) return "人物介绍";

  // 国家
  if (path.startsWith("/country/") && id) {
    const item = countries.find((c: Country) => c.id === id);
    return item?.countryChineseName || "国家详情";
  }

  // 部队
  if (path.startsWith("/unit/") && id) {
    const item = units.find((u: Unit) => u.id === id);
    const name = item?.info?.find((i: InfoItem) => i.label === "部队名")?.value;
    return name || "部队详情";
  }

  // 角色
  if (path.startsWith("/character/") && id) {
    const item = characters.find((ch: Character) => ch.id === id);
    const name = item?.info?.find((i: InfoItem) => i.label === "姓名")?.value;
    return name || "人物详情";
  }

  if (path === "/privacy") return "隐私政策";
  if (path === "/login") return "登录";
  if (path === "/register") return "注册";

  return "未知页面";
});
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26px;
  min-height: 5vh;
  padding: 0 20px;
  font-weight: bold;
  background: #fff;
  z-index: 5;

  .left-content {
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: auto auto;

    // 按钮
    .sidebar-btn {
      background: transparent;
      border: none;
      width: 30px;
      height: 30px;
      cursor: pointer;
      outline: 0;
      z-index: 9;

      /* 三条杠图标 - 中间横条 */
      .sidebar-icon {
        width: 100%;
        height: 3px;
        background: #0ea5e9;
        display: block;
        position: relative;

        /* 上下横条（用伪类实现） */
        &::before,
        &::after {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: #0ea5e9;
          transition: all 0.3s;
        }

        &::before {
          top: -8px;
        }

        &::after {
          top: 8px;
        }
      }
      &.active {
        .sidebar-icon {
          background: transparent;

          &::before {
            transform: rotate(45deg);
            background: #ffcccc;
            top: 0;
          }

          &::after {
            transform: rotate(-45deg);
            background: #ffcccc;
            top: 0;
          }
        }
      }
    }

    // 页面标题
    .page-title {
      margin-top: 4px;
      color: #000;
    }
  }

  .right-content {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: normal;

    .user-greeting {
      color: var(--text-secondary, #666);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (max-width: 768px) {
        display: none;
      }
    }

    .auth-btn {
      padding: 4px 14px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 15px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .login-btn {
      background: var(--accent, #0ea5e9);
      color: #fff;

      &:hover { opacity: 0.85; }
    }

    .register-btn {
      background: transparent;
      color: var(--accent, #0ea5e9);
      border-color: var(--accent, #0ea5e9);

      &:hover { background: var(--accent, #0ea5e9); color: #fff; }
    }

    .logout-btn {
      background: transparent;
      color: #999;
      border-color: #ccc;

      &:hover { color: #d32f2f; border-color: #d32f2f; }
    }
  }
}
</style>
