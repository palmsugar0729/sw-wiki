import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../pages/Home.vue'
import World from '../pages/WorldView.vue'
import CountryList from '../pages/CountryList.vue'
import CountryDetail from '../pages/CountryDetail.vue'
import UnitList from '../pages/UnitList.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/world', component: World },
  { path: '/countries', component: CountryList },
  { path: '/country/:id', component: CountryDetail },
  { path: '/units', component: UnitList }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router