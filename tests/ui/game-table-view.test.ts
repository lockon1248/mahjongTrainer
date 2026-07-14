// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import GameView from '@/views/game/GameView.vue'

describe('game table view', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders a read-only table snapshot with all seats and round summary', () => {
    const wrapper = mount(GameView, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.find('[data-testid="game-table-view"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="table-summary"]').text()).toContain('東家')
    expect(wrapper.findAll('[data-testid="player-seat"]')).toHaveLength(4)
    expect(wrapper.get('[data-seat="east"]').text()).toContain('17')
    expect(wrapper.get('[data-seat="south"]').text()).toContain('16')
  })
})
