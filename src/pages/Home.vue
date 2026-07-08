<template>
  <div class="page homepage-bg">
    <div class="page-content">
      <h1>欢迎来到强袭魔女系列中文资料站</h1>

      <div class="infoBox">
        <!-- 本站说明 -->
        <div class="brief-intro">
          欢迎来到SW系列中文资料站。<br />本站为系列粉丝提供尽可能详尽的中文资料。<br />目前还在开发中。
        </div>

        <!-- 公告栏 -->
        <div class="notice">
          <h3 class="headline">⚠︎ 公告</h3>
          <p>
            本wiki站还在建设中。<br />
            若您有任何建议或意见，欢迎点击下方链接获取我们的联系方式。<br />
            若您愿意慷慨解囊捐助本站的运营，可点击下方链接，在此提前感谢您的大力相助！
          </p>
        </div>
        <!-- 新闻 -->
        <div class="news">
          <h2>热点新闻</h2>

          <div v-for="item in displayNews" :key="item.id" class="news-item">
            <div class="title">
              <span class="source">{{ item.source }}</span>
              <span class="date">{{ item.date }}</span>
            </div>

            <div
              v-html="renderText(item.content)"
              @click="handleLinkClick"
              class="content"
            ></div>

            <div class="images" v-if="item.images?.length">
              <img
                v-for="(img, i) in item.images"
                :key="img"
                :src="getNewsImage(item.id, img)"
                @click="openNewsPreview(item, i)"
              />
            </div>

            <div v-if="item.link" @click="goExternal(item.link)" class="link">
              查看原文
            </div>
          </div>
        </div>

        <!-- 最近更新 -->
        <div class="recent">
          <h2>最近更新</h2>

          <div
            v-for="item in recentCharacters"
            :key="item.id"
            class="recent-item"
            @click="goDetail(item.id)"
          >
            <img
              :src="getEntityImage('character', item.id, item.images.icon)"
              class="icon"
            />

            <div class="recent-content">
              <div class="name">
                {{ getInfoValue(item.info, '姓名') }}
              </div>
              <div class="date">
                {{ item.updatedAt }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <ImageViewer
      v-model="previewVisible"
      :images="previewUrls"
      :initial-index="previewIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { renderText } from '@/utils/render'
import { getEntityImage, getInfoValue } from '@/utils/media'
import { useWikiLink } from '@/composables/useWikiLink'
import ImageViewer from '@/components/ImageViewer.vue'
import type { News, Character } from '@/types'
import newsRaw from '@/data/news.json'
import charaRaw from '@/data/CharaInfo.json'
import { ref, computed } from 'vue'

/* 数据 */
const router = useRouter()
const { handleLinkClick } = useWikiLink()
const news = newsRaw as News[]
const characters = charaRaw as Character[]

/* 热点新闻 */
const displayNews = computed(() => {
  return [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
})

const getNewsImage = (id: string, name?: string) => {
  if (!name) return ''
  return `/wiki/news/${id}/${name}.webp`
}

/* 大图预览 */
const previewVisible = ref(false)
const previewUrls = ref<string[]>([])
const previewIndex = ref(0)

const openNewsPreview = (item: News, index: number) => {
  previewUrls.value = item.images.map((img) => getNewsImage(item.id, img))
  previewIndex.value = index
  previewVisible.value = true
}

/* 外链跳转 */
const goExternal = (url: string) => {
  window.open(url, '_blank')
}

/* 最近更新 */
const recentCharacters = computed(() => {
  return [...characters]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5)
})

const goDetail = (id: string) => {
  router.push(`/character/${id}`)
}
</script>

<style scoped>
.page-content h1 {
  margin-bottom: 30px;
  font-size: 52px;
  text-align: center;
  font-weight: bold;
  color: #facc15;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.infoBox {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 60px;

  & > div {
    background: rgba(255, 255, 255, 0.78);
    padding: 20px;
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  h2 {
    font-size: 37px;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .brief-intro {
    display: flex;
    padding: 0 20px;
    background: none;
    text-align: left;
    align-items: center;
    font-size: 28px;
  }

  .notice {
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
    border-radius: 8px;
    background: repeating-linear-gradient(
      45deg,
      #f3f3f3,
      #f3f3f3 10px,
      #eaeaea 10px,
      #eaeaea 20px
    );

    .headline {
      margin: 0 0 10px 0;
      color: #000;
      display: flex;
      text-align: left;
      gap: 6px;
    }
    p {
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #333;
    }
  }

  .news-item {
    padding: 15px;
    margin-bottom: 15px;
    background: rgba(244, 221, 223, 0.6);
    border-radius: 10px;
    transition: 0.2s;

    .title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      opacity: 0.7;
      margin-bottom: 8px;

      & > span {
        font-size: 22px;
        font-weight: normal;
        color: #000;
      }
      .date {
        font-size: 16px;
      }
    }

    .content {
      font-size: 16px;
      margin-bottom: 10px;
      color: #000;
      text-align: left;
      text-indent: 2em;
    }

    .images {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      img {
        width: 120px;
        border-radius: 6px;
        cursor: pointer;
      }
    }

    .link {
      margin-top: 10px;
      font-size: 15px;
      color: #0050a5;
      cursor: pointer;
    }
  }

  .recent-item {
    display: flex;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(244, 221, 223, 0.6);

    .icon {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 6px;
    }

    .recent-content {
      padding-top: 27px;
      padding-left: 40px;

      .name {
        color: #000;
        font-weight: bold;
        font-size: 27px;
      }

      .date {
        color: #000;
        font-size: 17px;
        opacity: 0.7;
        text-align-last: left;
      }
    }
  }

  .news-item:hover,
  .recent-item:hover {
    background: rgba(217, 52, 72, 0.6);
  }
}

/* 移动端 ≤768px */
@media (max-width: 768px) {
  .page-content h1 {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .infoBox {
    grid-template-columns: 1fr;
    margin-top: 30px;
    gap: 15px;

    h2 {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .brief-intro {
      font-size: 18px;
      padding: 0 10px;
    }

    .news-item {
      .title > span {
        font-size: 16px;
      }

      .images img {
        width: 80px;
      }
    }

    .recent-item {
      .icon {
        width: 64px;
        height: 64px;
      }

      .recent-content {
        padding-top: 12px;
        padding-left: 15px;

        .name {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
