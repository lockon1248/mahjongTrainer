// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import type { Tile } from '@/core'
import type { GameTableMeldViewModel, GameTablePlayerViewModel, GameTableSnapshotViewModel } from '@/views/game/types'
import GameTableView from '@/views/game/components/GameTableView.vue'

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

const snapshot: GameTableSnapshotViewModel = {
  humanSeat: 'east',
  currentSeat: 'east',
  phase: 'discard',
  outcome: 'in-progress',
  dealerSeat: 'east',
  prevailingWind: 'east',
  wallCount: 48,
  totalDiscards: 8,
  lastClaimResolution: null,
  resultSummary: null,
  players: [
    {
      seat: 'east',
      relativePosition: 'bottom',
      concealedCount: 14,
      concealedTiles: [chars(3)[0]!, dots(2)[0]!, bamboos(7)[0]!, wind('east'), dragon('red'), flower('orchid')],
      flowerCount: 1,
      meldCount: 1,
      melds: [
        {
          type: 'pon',
          labels: ['西風', '西風', '西風']
        }
      ],
      discardCount: 2,
      discards: [chars(1)[0]!, chars(2)[0]!],
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
      discardCount: 1,
      discards: [dots(5)[0]!],
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
      flowerCount: 1,
      meldCount: 0,
      melds: [],
      discardCount: 3,
      discards: [dragon('red'), wind('east'), flower('plum')],
      score: 0,
      declaredReady: false
    }
  ]
}

describe('game table layout', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('anchors the human player at the bottom and arranges the other seats around the table', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-seat="east"]').attributes('data-relative-position')).toBe('bottom')
    expect(wrapper.get('[data-seat="south"]').attributes('data-relative-position')).toBe('right')
    expect(wrapper.get('[data-seat="west"]').attributes('data-relative-position')).toBe('top')
    expect(wrapper.get('[data-seat="north"]').attributes('data-relative-position')).toBe('left')
  })

  it('renders all four discard pools in the center table area with seat ownership preserved', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="center-discard-pools"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="discard-pool-east"]').text()).toContain('一萬')
    expect(wrapper.get('[data-testid="discard-pool-east"]').text()).toContain('二萬')
    expect(wrapper.get('[data-testid="discard-pool-south"]').text()).toContain('五筒')
    expect(wrapper.get('[data-testid="discard-pool-west"]').text()).toContain('暫無捨牌')
    expect(wrapper.get('[data-testid="discard-pool-north"]').text()).toContain('紅中')
    expect(wrapper.get('[data-testid="discard-pool-north"]').text()).toContain('東風')
    expect(wrapper.get('[data-testid="discard-pool-north"]').text()).toContain('梅')
  })

  it('renders exposed melds beside the owning player instead of leaving them mixed into hand or discard pools', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="player-melds-east"]').text()).toContain('西風')
    expect(wrapper.get('[data-testid="player-melds-east"]').text()).toContain('碰')
  })

  it('renders each exposed meld as a compact inline group instead of a full-width stacked card', () => {
    const compactMelds: GameTableMeldViewModel[] = [
      {
        type: 'pon',
        labels: ['西風', '西風', '西風']
      },
      {
        type: 'pon',
        labels: ['八筒', '八筒', '八筒']
      }
    ]

    const players: GameTablePlayerViewModel[] = snapshot.players.map(player => {
      if (player.seat !== 'east') {
        return player
      }

      return {
        ...player,
        meldCount: compactMelds.length,
        melds: compactMelds
      }
    })

    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...snapshot,
          players
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="player-melds-east"]').classes()).toContain('player-meld-list--compact')
    expect(wrapper.get('[data-testid="player-meld-east-0"]').classes()).toContain('player-meld-chip')
    expect(wrapper.get('[data-testid="player-meld-east-1"]').classes()).toContain('player-meld-chip')
  })

  it('highlights only the current latest discard tile in the center pools', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="discard-tile-east-1"]').classes()).not.toContain('discard-tile--latest')
    expect(wrapper.get('[data-testid="discard-tile-east-0"]').classes()).not.toContain('discard-tile--latest')
    expect(wrapper.get('[data-testid="discard-tile-south-0"]').classes()).not.toContain('discard-tile--latest')
    expect(wrapper.get('[data-testid="discard-tile-north-2"]').classes()).toContain('discard-tile--latest')
  })

  it('keeps the active emphasis on the player panel instead of moving it into the discard pool', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-seat="east"]').classes()).toContain('player-panel--active')
    expect(wrapper.get('[data-testid="discard-pool-east"]').classes()).not.toContain('shadow-[0_0_0_2px_rgba(255,214,122,0.22),0_0.9rem_1.4rem_rgba(56,23,8,0.18)]')
  })

  it('shows a strong on-table flag for the active human seat', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="player-status-east"]').text()).toContain('輪到你')
    expect(wrapper.get('[data-testid="player-active-east"]').text()).toContain('目前出牌')
  })

  it('highlights the active player panel during a human discard turn', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-seat="east"]').classes()).toContain('player-panel--active')
    expect(wrapper.get('[data-seat="south"]').classes()).not.toContain('player-panel--active')
  })

  it('keeps result summary and expanded player sections inside the stage-friendly table layout', async () => {
    vi.useFakeTimers()
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...snapshot,
          phase: 'ended',
          outcome: 'win',
          resultSummary: {
            type: 'win',
            ended: true,
            winnerSeat: 'east',
            discarderSeat: 'south',
            totalTai: 5,
            drawReason: null,
            scoringItems: [
              {
                name: '平胡',
                tai: 2
              },
              {
                name: '門清',
                tai: 3
              }
            ],
            chipSettlements: [
              { seat: 'east', delta: 80, chipsAfter: 1080 },
              { seat: 'south', delta: -80, chipsAfter: 920 },
              { seat: 'west', delta: 0, chipsAfter: 1000 },
              { seat: 'north', delta: 0, chipsAfter: 1000 }
            ]
          },
          players: snapshot.players.map(player => {
            if (player.seat !== 'east') {
              return player
            }

            return {
              ...player,
              meldCount: 2,
              melds: [
                {
                  type: 'pon',
                  labels: ['西風', '西風', '西風']
                },
                {
                  type: 'pon',
                  labels: ['八筒', '八筒', '八筒']
                }
              ]
            }
          })
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="game-table-view"]').classes()).toContain('game-table-layout')
    expect(wrapper.get('[data-testid="mahjong-table"]').classes()).toContain('mahjong-table--wide')
    expect(wrapper.get('[data-testid="mahjong-table"]').classes()).toContain('mahjong-table--compact')
    expect(wrapper.get('[data-testid="mahjong-table"]').classes()).toContain('mahjong-table--rebalanced')
    expect(wrapper.get('[data-testid="center-discard-pools"]').classes()).toContain('table-center--compact')
    expect(wrapper.get('[data-testid="center-discard-pools"]').classes()).toContain('table-center--rebalanced')
    expect(wrapper.get('[data-seat="east"]').get('dl').classes()).toContain('player-stat-grid--balanced')
    expect(wrapper.get('[data-seat="east"]').classes()).toContain('player-panel--bottom-rebalanced')
    expect(wrapper.get('[data-testid="round-result-summary"]').classes()).toContain('round-result-grid')
    expect(wrapper.get('[data-testid="player-action-row-east"]').text()).not.toContain('下一局')
    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    expect(document.body.querySelector('[data-testid="round-settlement-dialog"]')?.textContent).toContain('下一局')
    expect(wrapper.get('[data-testid="player-melds-east"]').classes()).toContain('player-meld-list--compact')
  })
})
