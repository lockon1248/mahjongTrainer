// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Tile } from '@/core'
import GameView from '@/views/game/GameView.vue'
import GameTableView from '@/views/game/components/GameTableView.vue'
import type { GameTableSnapshotViewModel } from '@/views/game/types'

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'characters', rank }))
}

const dots = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'dots', rank }))
}

const bamboos = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'bamboo', rank }))
}

const wind = (rank: 'east' | 'south' | 'west' | 'north'): Tile => {
  return { suit: 'winds', rank }
}

const dragon = (rank: 'red' | 'green' | 'white'): Tile => {
  return { suit: 'dragons', rank }
}

const flower = (rank: 'plum' | 'orchid' | 'bamboo' | 'chrysanthemum'): Tile => {
  return { suit: 'flower', rank }
}

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

  it('shows the human concealed hand in 萬 → 筒 → 條 → 風 → 三元 → 花 order', () => {
    const snapshot: GameTableSnapshotViewModel = {
      humanSeat: 'east',
      currentSeat: 'east',
      phase: 'discard',
      outcome: 'in-progress',
      dealerSeat: 'east',
      prevailingWind: 'east',
      wallCount: 40,
      totalDiscards: 0,
      lastClaimResolution: null,
      resultSummary: null,
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
          concealedCount: 6,
          concealedTiles: [chars(3)[0]!, dots(2)[0]!, bamboos(7)[0]!, wind('east'), dragon('red'), flower('orchid')],
          flowerCount: 1,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        },
        {
          seat: 'south',
          relativePosition: 'right',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        },
        {
          seat: 'west',
          relativePosition: 'top',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        },
        {
          seat: 'north',
          relativePosition: 'left',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        }
      ]
    }

    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    const tileLabels = wrapper.findAll('[data-testid="human-discard-tile"]').map(node => node.text())

    expect(tileLabels).toEqual(['三萬', '二筒', '七條', '東風', '紅中', '蘭'])
  })

  it('does not expose undriven ready-state or placeholder score fields as product UI', () => {
    const snapshot: GameTableSnapshotViewModel = {
      humanSeat: 'east',
      currentSeat: 'east',
      phase: 'discard',
      outcome: 'in-progress',
      dealerSeat: 'east',
      prevailingWind: 'east',
      wallCount: 40,
      totalDiscards: 0,
      lastClaimResolution: null,
      resultSummary: null,
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
          concealedCount: 6,
          concealedTiles: [chars(3)[0]!, dots(2)[0]!, bamboos(7)[0]!],
          flowerCount: 1,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        },
        {
          seat: 'south',
          relativePosition: 'right',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        },
        {
          seat: 'west',
          relativePosition: 'top',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        },
        {
          seat: 'north',
          relativePosition: 'left',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 0,
          declaredReady: false
        }
      ]
    }

    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.text()).not.toContain('聽牌')
    expect(wrapper.find('.player-score').exists()).toBe(false)
  })
})
