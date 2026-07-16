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

    expect(wrapper.find('[data-testid="match-setup-modal"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="game-table-view"]').exists()).toBe(false)
  })

  it('renders the table only after match setup is submitted', async () => {
    const wrapper = mount(GameView, {
      global: {
        plugins: [createPinia()]
      }
    })

    await wrapper.get('[data-testid="match-setup-submit"]').trigger('click')

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

  it('masks AI concealed kong tiles while the round is in progress', () => {
    const snapshot: GameTableSnapshotViewModel = {
      humanSeat: 'east',
      currentSeat: 'west',
      phase: 'discard',
      outcome: 'in-progress',
      dealerSeat: 'east',
      prevailingWind: 'east',
      wallCount: 32,
      totalDiscards: 6,
      lastClaimResolution: null,
      resultSummary: null,
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
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
          seat: 'south',
          relativePosition: 'right',
          concealedCount: 12,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 1,
          melds: [
            {
              type: 'kan-concealed',
              labels: ['暗牌', '暗牌', '暗牌', '暗牌'],
              isMasked: true
            }
          ],
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

    expect(wrapper.get('[data-testid="player-melds-south"]').text()).toContain('暗槓')
    expect(wrapper.get('[data-testid="player-melds-south"]').text()).toContain('暗牌')
    expect(wrapper.get('[data-testid="player-melds-south"]').text()).not.toContain('五筒')
  })

  it('keeps the human owner concealed kong tiles visible', () => {
    const snapshot: GameTableSnapshotViewModel = {
      humanSeat: 'east',
      currentSeat: 'east',
      phase: 'discard',
      outcome: 'in-progress',
      dealerSeat: 'east',
      prevailingWind: 'east',
      wallCount: 32,
      totalDiscards: 6,
      lastClaimResolution: null,
      resultSummary: null,
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 1,
          melds: [
            {
              type: 'kan-concealed',
              labels: ['五筒', '五筒', '五筒', '五筒'],
              isMasked: false
            }
          ],
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

    expect(wrapper.get('[data-testid="player-melds-east"]').text()).toContain('暗槓')
    expect(wrapper.get('[data-testid="player-melds-east"]').text()).toContain('五筒')
    expect(wrapper.get('[data-testid="player-melds-east"]').text()).not.toContain('暗牌')
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

  it('renders real match chips only when authoritative match summary exists', () => {
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
      matchSummary: {
        initialChips: 500,
        victoryMode: 'bankruptcy',
        baseStake: 30,
        taiValue: 10,
        status: 'in-progress',
        winnerSeat: null
      },
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
          concealedCount: 13,
          concealedTiles: [],
          flowerCount: 0,
          meldCount: 0,
          melds: [],
          discardCount: 0,
          discards: [],
          score: 540,
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
          score: 460,
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
          score: 500,
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
          score: 500,
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

    expect(wrapper.get('[data-testid="match-summary-mode"]').text()).toContain('破產即止')
    expect(wrapper.get('[data-testid="match-summary-stakes"]').text()).toContain('底 30 / 台 10')
    expect(wrapper.get('[data-testid="player-score-east"]').text()).toContain('540')
    expect(wrapper.get('[data-testid="player-score-south"]').text()).toContain('460')
  })

  it('renders the dealer badge on the dealer panel only', () => {
    const snapshot: GameTableSnapshotViewModel = {
      humanSeat: 'east',
      currentSeat: 'west',
      phase: 'discard',
      outcome: 'in-progress',
      dealerSeat: 'south',
      prevailingWind: 'east',
      wallCount: 40,
      totalDiscards: 0,
      lastClaimResolution: null,
      resultSummary: null,
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
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

    expect(wrapper.get('[data-testid="player-dealer-south"]').text()).toContain('莊家')
    expect(wrapper.find('[data-testid="player-dealer-east"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="player-dealer-west"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="player-dealer-north"]').exists()).toBe(false)
  })

  it('shows the local round label with prevailing wind and dealer seat', () => {
    const snapshot: GameTableSnapshotViewModel = {
      humanSeat: 'east',
      currentSeat: 'west',
      phase: 'discard',
      outcome: 'in-progress',
      dealerSeat: 'north',
      prevailingWind: 'east',
      wallCount: 40,
      totalDiscards: 0,
      lastClaimResolution: null,
      resultSummary: null,
      players: [
        {
          seat: 'east',
          relativePosition: 'bottom',
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

    expect(wrapper.get('[data-testid="summary-local-round"]').text()).toContain('東風北局')
  })
})
