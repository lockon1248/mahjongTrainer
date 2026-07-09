import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { createMahjongRouter } from '@/router'

export const createMahjongApp = () => {
  const app = createApp(App)
  const pinia = createPinia()
  const router = createMahjongRouter()

  app.use(pinia)
  app.use(router)

  return app
}
