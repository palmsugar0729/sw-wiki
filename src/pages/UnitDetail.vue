<template>
  <div
    class="page detail-bg"
    v-if="unit"
    :style="{ '--bg-image': `url(${getBg(unit.id, unit.background)})` }"
  >
    <div class="page-content detail-page">
      <div class="detail-container">
        <!-- 上半部分：信息 + 图片 -->
        <div class="top-section">
          <!-- 左侧：信息 -->
          <table class="infoTable">
            <tr v-for="(item, index) in unit.info" :key="index">
              <td class="label">{{ item.label }}</td>
              <td class="value">
                <template v-if="Array.isArray(item.value)">
                  <div
                    v-for="(v, i) in item.value"
                    :key="i"
                    v-html="renderText(v)"
                    @click="handleLinkClick"
                  ></div>
                </template>
                <template v-else>
                  <span
                    v-html="renderText(item.value)"
                    @click="handleLinkClick"
                  ></span>
                </template>
              </td>
            </tr>
          </table>

          <!-- 右侧：图片 -->
          <div class="image">
            <img :src="getEm(unit.id, unit.emblem)" alt="unit image" />
          </div>
        </div>

        <!-- 下半部分：部队介绍 -->
        <div class="introduction" @click="handleLinkClick">
          <div v-html="renderText(unit.history)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import raw from "../data/UnitInfo.json";
import { renderText } from "../utils/render";

/* ✅ 定义类型 */
type InfoItem = {
  label: string;
  value: string | string[];
};

type Unit = {
  id: string;
  info: InfoItem[];
  emblem: string;
  background: string;
  history: string;
  tags: string[];
};

/* 数据 */
const units = raw as Unit[];
const route = useRoute();
const router = useRouter();

// 处理内链接点击
const handleLinkClick = (e: Event) => {
  const el = e.target as HTMLElement;

  if (el.classList.contains("wiki-link")) {
    const type = el.dataset.type;
    const id = el.dataset.id;

    if (!type || !id) return;

    router.push(`/${type}/${id}`);
  }
};

/* 找到当前部队 */
const unit = computed(() =>
  units.find((u) => u.id === String(route.params.id))
);

// 获取部队标识
const getEm = (id: string, name?: string) => {
  if (!name) return "";
  return `/wiki/unit/${id}/${name}.jpg`;
};
// 或许背景图片
const getBg = (id: string, name?: string) => {
  if (!name) return "";
  return `/wiki/unit/${id}/${name}.jpg`;
};
</script>

<style scoped>
/* ===== 上半部分 ===== */
.top-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
  /* 右侧图片 */

  .image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 300px;

    img {
      max-width: 100%;
      border-radius: 10px;
    }
  }
}
</style>
