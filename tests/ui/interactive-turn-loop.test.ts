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

    expect(wrapper.get('[data-testid="summary-current-seat"]').text()).not.toContain('turneast')
    expect(wrapper.get('[data-testid="summary-phase"]').text()).toMatch(/phase(draw|discard|claim-window|ended)/)
    expect(Number(wrapper.get('[data-testid="summary-total-discards"]').text().replace('discards', ''))).toBeGreaterThan(1)
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
        humanSeat: 'east',
        claimCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="summary-outcome"]').text()).toContain('draw')
  })
})
