// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMahjongRouter } from '@/router'
import { useGameSessionStore } from '@/stores/gameSession'
import { createMahjongApp } from '@/app'
import { createPinia, setActivePinia } from 'pinia'

describe('vue workspace bootstrap', () => {
  it('creates the router with home and game routes', () => {
    const router = createMahjongRouter()
    const paths = router.getRoutes().map((route) => route.path)

    expect(paths).toContain('/')
    expect(paths).toContain('/game')
  })

  it('creates the app shell dependencies without backend services', () => {
    const pinia = createPinia()
    const router = createMahjongRouter()
    const app = createMahjongApp()

    expect(app).toBeTruthy()
    expect(pinia).toBeTruthy()
    expect(router).toBeTruthy()
  })

  it('allows the session store to expose an initialized round snapshot', () => {
    setActivePinia(createPinia())
    const store = useGameSessionStore()

    store.startLocalRound()

    expect(store.round?.outcome.status).toBe('in-progress')
  })
})
