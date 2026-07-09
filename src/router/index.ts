import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import GameView from '@/views/game/GameView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/game',
    component: GameView
  }
]

export const createMahjongRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes
  })
}
