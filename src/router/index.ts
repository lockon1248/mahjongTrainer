import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/HomeView.vue')
  },
  {
    path: '/game',
    component: () => import('@/views/game/GameView.vue')
  }
]

export const createMahjongRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes
  })
}
