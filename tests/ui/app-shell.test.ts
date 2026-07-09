// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { routes } from '@/router'

const createTestRouter = (initialPath = '/game') => {
  return createRouter({
    history: createMemoryHistory(),
    routes
  })
}

describe('vue app shell', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts the root shell and renders the game route container', async () => {
    const pinia = createPinia()
    const router = createTestRouter('/game')
    router.push('/game')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })

    expect(wrapper.find('[data-testid="app-shell"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="game-view"]').exists()).toBe(true)
  })

  it('renders the home route container', async () => {
    const pinia = createPinia()
    const router = createTestRouter('/')
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })

    expect(wrapper.find('[data-testid="home-view"]').exists()).toBe(true)
  })
})
