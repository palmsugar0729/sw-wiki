<template>
  <div class="page detail-bg">
    <div class="page-content">
      <div class="detail-container" v-if="country">
        <!-- 标题 -->
        <h1>{{ country.countryChineseName }}</h1>
        <h3>{{ country.countryEnglishName }}</h3>
        <!-- 右侧国旗图片 -->
        <div class="image-box">
          <img :src="country.images" class="flag" />
        </div>
        <!-- 左侧文字内容 -->
        <div class="info">
          <div
            v-html="renderText(country.territory)"
            @click="handleLinkClick"
          ></div>
          <div
            v-html="renderText(country.history)"
            @click="handleLinkClick"
          ></div>
          <div
            v-html="renderText(country.polity)"
            @click="handleLinkClick"
          ></div>
          <div
            v-html="renderText(country.military)"
            @click="handleLinkClick"
          ></div>
        </div>
      </div>

      <!-- 找不到国家 -->
      <div v-else>
        <h2>未找到该国家</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import raw from "../data/CountryInfo.json";
import { renderText } from "../utils/render";

/* ✅ 定义类型 */
type Country = {
  id: string;
  countryChineseName: string;
  countryEnglishName: string;
  images: string;
  territory: string;
  history: string;
  polity: string;
  military: string;
};

/* ✅ 让 TS 认识 JSON */
const countries = raw as Country[];
const route = useRoute();
const router = useRouter();

/* ✅ 找到当前国家 */
const country = countries.find((c) => c.id === String(route.params.id));

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
</script>

<style scoped>
.detail-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url("/wiki/bg-normal.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(6px);
  opacity: 0.5;
  z-index: 0;
}

.detail-container::after {
  display: block;
  content: "";
  clear: both;
}
/* 右侧 */
.image-box {
  float: right;
  width: 350px;
  margin: 0 0 20px 20px;
  /* 国旗 */
  .flag {
    width: 100%;
    display: block;
    border-radius: 10px;
  }
}
</style>
