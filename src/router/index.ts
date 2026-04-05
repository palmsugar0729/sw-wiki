import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'
import ArticleView from '../components/ArticleView.vue'
import CountryList from '../pages/CountryList.vue'
import CountryDetail from '../pages/CountryDetail.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/article/:id', component: ArticleView },
  { path: '/countries', component: CountryList },
  { path: '/country/:id', component: CountryDetail }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router