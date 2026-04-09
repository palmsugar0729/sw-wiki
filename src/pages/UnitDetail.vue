<template>
  <div class="content" v-if="unit">
    
    <div class="title">{{ unit.unitChineseName }}&emsp;{{ unit.ChineseNickName }}</div>

    <!-- 上半部分：信息 + 图片 -->
    <div class="top-section">

      <!-- 左侧：信息 -->
      <div class="info-table">

        <div class="row">
          <div class="label">部队名</div>
          <div class="value">{{ unit.unitChineseName }}</div>
        </div>

        <div class="row">
          <div class="label">英文名</div>
          <div class="value" v-html="render(unit.unitEnglishName)"></div>
        </div>

        <div class="row">
          <div class="label">外号</div>
          <div class="value" v-html="render(unit.ChineseNickName)"></div>
        </div>

        <div class="row">
          <div class="label">英文外号</div>
          <div class="value" v-html="render(unit.EnglishNickName)"></div>
        </div>

        <div class="row">
          <div class="label">基地</div>
          <div class="value" v-html="render(unit.baseZone)"></div>
        </div>

        <div class="row">
          <div class="label">隶属</div>
          <div class="value" v-html="render(unit.under)"></div>
        </div>

        <div class="row">
          <div class="label">负责空域</div>
          <div class="value" v-html="render(unit.responsibility)"></div>
        </div>

        <div class="row">
          <div class="label">司令</div>
          <div class="value" v-html="render(unit.commander)"></div>
        </div>

        <div class="row">
          <div class="label">战斗队长</div>
          <div class="value" v-html="render(unit.captain)"></div>
        </div>

        <div class="row">
          <div class="label">成员</div>
          <div class="value" v-html="render(unit.members)"></div>
        </div>

        </div>

      <!-- 右侧：图片 -->
      <div class="image">
        <img :src="unit.images" alt="unit image" />
      </div>

    </div>

    <!-- 下半部分：部队介绍 -->
    <div class="introduction">
      <div v-html="render(unit.history)"></div>
    </div>
  </div>

  <!-- 找不到这支部队 -->
  <div v-else>
    <h2>未找到该部队</h2>
  </div>

</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { marked } from 'marked'
  import raw from '../data/UnitInfo.json'
  
  /* ✅ 定义类型 */
  type Unit = {
    id: number
    unitChineseName: string
    unitEnglishName: string
    images: string
    ChineseNickName: string
    EnglishNickName: string
    baseZone: string
    under: string
    responsibility: string
    commander: string
    captain: string
    members: string
    history: string
  }
  
  /* ✅ 让 TS 认识 JSON */
  const units = raw as Unit[]
  const route = useRoute()
  
  /* ✅ 找到当前国家 */
  const unit = units.find(
    (u) => u.id === Number(route.params.id)
  )
  
  /* ✅ Markdown 渲染 */
  const render = (text: string) => {
    return marked(text || '')
  }
</script>

<style>
  .title {
    text-indent: center;
    font-size: 50px;
    margin-bottom: 60px;
    color: black;
  }


  /* 顶部区域：左右布局 */
  .top-section {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
  }

  /* 左侧信息 */
  .info-table {
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    overflow: hidden;
    font-size: 14px;
  }

  /* 每一行 */
  .row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    width: 600px;
    line-height: 1.6;
    padding: 8px 10px;
  }

  /* 左边标签 */
  .row .label {
    width: 100px;
    font-weight: bold;
    font-size: 20px;
  }

  /* 右边内容 */
  .row .value {
    flex: 1;
    border-left: 1px solid rgba(255,255,255,0.1);
    font-size: 20px;
  }

  /* 最后一行去边框 */
  .row:last-child {
    border-bottom: none;
  }

  /* 右侧图片 */
  .top-section .image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }

  .top-section .image img {
    max-width: 100%;
    border-radius: 10px;
  }

  /* 底部 历史区域 */
  .introduction {
    margin-top: 20px;
  }

  /* Markdown 标题 */
  .introduction h2 {
    margin-top: 20px;
    margin-bottom: 35px;
    font-size: 40px;
  }
  /* 历史正文 */
  .introduction p {
    line-height: 1.6;
    text-align: left;
    text-indent: 2em;
    color: #fff;
  }

</style>