// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createBaselineRound, createBaselineWall, evaluateExhaustiveDraw } from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'
import { createGameTableSnapshot } from '@/views/game/selectors'
import GameView from '@/views/game/GameView.vue'
import GameTableView from '@/views/game/components/GameTableView.vue'

describe('interactive turn loop', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('forwards a human discard click into the store without recomputing rules in the component', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    const discardSpy = vi.spyOn(store, 'discard')
    const advanceSpy = vi.spyOn(store, 'advanceTurn')

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    const selectedTile = store.round!.players.east.concealedTiles[0]!
    await wrapper.get('[data-testid="human-discard-tile"]').trigger('click')

    expect(discardSpy).toHaveBeenCalledWith(selectedTile)
    expect(advanceSpy).toHaveBeenCalledTimes(1)
  })

  it('renders turn progress after the round advances through AI seats', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.get('[data-testid="human-discard-tile"]').trigger('click')

    expect(wrapper.get('[data-testid="summary-current-seat"]').text()).toContain('east')
    expect(wrapper.get('[data-testid="summary-phase"]').text()).toContain('discard')
    expect(wrapper.get('[data-testid="summary-last-claim"]').text()).toContain('pass')
    expect(wrapper.get('[data-testid="summary-total-discards"]').text()).toContain('4')
  })

  it('reflects exhaustive draw outcomes in the rendered table snapshot', () => {
    const round = createBaselineRound({ wall: createBaselineWall() })
    const exhaustedRound = evaluateExhaustiveDraw({
      ...round,
      table: {
        ...round.table,
        wall: []
      },
      phase: 'draw'
    })
    const snapshot = createGameTableSnapshot(exhaustedRound, 'east')

    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east'
      }
    })

    expect(wrapper.get('[data-testid="summary-outcome"]').text()).toContain('draw')
  })
})
