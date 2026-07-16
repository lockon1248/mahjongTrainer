// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { GameTableSnapshotViewModel } from '@/views/game/types'
import GameTableView from '@/views/game/components/GameTableView.vue'
import type { Tile } from '@/core'

const scoringItem = (
  patternId: string,
  label: string,
  tai: number,
  reason: string
) => ({ patternId, label, tai, reason })

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'characters', rank }))
}

const wind = (rank: 'east' | 'south' | 'west' | 'north'): Tile => {
  return { suit: 'winds', rank }
}

const basePlayers: GameTableSnapshotViewModel['players'] = [
  {
    seat: 'east',
    relativePosition: 'bottom',
    concealedCount: 16,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    melds: [],
    discardCount: 8,
    discards: [],
    score: 0,
    declaredReady: false
  },
  {
    seat: 'south',
    relativePosition: 'right',
    concealedCount: 17,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    melds: [],
    discardCount: 7,
    discards: [],
    score: 0,
    declaredReady: false
  },
  {
    seat: 'west',
    relativePosition: 'top',
    concealedCount: 16,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    melds: [],
    discardCount: 7,
    discards: [],
    score: 0,
    declaredReady: false
  },
  {
    seat: 'north',
    relativePosition: 'left',
    concealedCount: 16,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    melds: [],
    discardCount: 8,
    discards: [],
    score: 0,
    declaredReady: false
  }
]

const inProgressSnapshot: GameTableSnapshotViewModel = {
  humanSeat: 'east',
  currentSeat: 'east',
  phase: 'discard',
  outcome: 'in-progress',
  dealerSeat: 'east',
  prevailingWind: 'east',
  wallCount: 40,
  totalDiscards: 8,
  lastClaimResolution: null,
  resultSummary: null,
  players: [...basePlayers]
}

describe('round result sync', () => {
  it('does not render a result summary while the round is still in progress', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: inProgressSnapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="round-result-summary"]').exists()).toBe(false)
  })

  it('renders winner, discarder and total tai for a win result', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome: 'win',
          resultSummary: {
            type: 'win',
            ended: true,
            winnerSeat: 'south',
            discarderSeat: 'west',
            totalTai: 3,
            drawReason: null,
            scoringItems: [
              scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
              scoringItem('self-draw', '自摸', 2, '自摸完成和牌')
            ]
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="result-type"]').text()).toContain('和牌')
    expect(wrapper.get('[data-testid="result-ended"]').text()).toContain('是')
    expect(wrapper.get('[data-testid="result-winner"]').text()).toContain('南家')
    expect(wrapper.get('[data-testid="result-discarder"]').text()).toContain('西家')
    expect(wrapper.get('[data-testid="result-total-tai"]').text()).toContain('3')
    expect(wrapper.get('[data-testid="result-scoring-items"]').text()).toContain('莊家 1 台')
    expect(wrapper.get('[data-testid="result-scoring-items"]').text()).toContain('自摸 2 台')
  })

  it('reveals the winning AI hand on the winner panel after a round ends', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome: 'win',
          players: [
            ...basePlayers,
          ].map((player) => {
            if (player.seat !== 'south')
              return player

            return {
              ...player,
              concealedCount: 5,
              revealedWinningTiles: [
                ...chars(1, 2, 3),
                wind('east'),
                wind('east')
              ]
            }
          }),
          resultSummary: {
            type: 'win',
            ended: true,
            winnerSeat: 'south',
            discarderSeat: 'west',
            totalTai: 3,
            drawReason: null,
            scoringItems: [
              scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
              scoringItem('self-draw', '自摸', 2, '自摸完成和牌')
            ]
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="player-winning-tiles-south"]').text()).toContain('和牌手牌')
    expect(wrapper.get('[data-testid="player-winning-tiles-south"]').text()).toContain('一萬')
    expect(wrapper.get('[data-testid="player-winning-tiles-south"]').text()).toContain('東風')
  })

  it('renders discard-win scoring items for a discard win result', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome: 'win',
          resultSummary: {
            type: 'win',
            ended: true,
            winnerSeat: 'east',
            discarderSeat: 'south',
            totalTai: 1,
            drawReason: null,
            scoringItems: [
              scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家')
            ]
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="result-winner"]').text()).toContain('東家')
    expect(wrapper.get('[data-testid="result-discarder"]').text()).toContain('南家')
    expect(wrapper.get('[data-testid="result-total-tai"]').text()).toContain('1')
    expect(wrapper.get('[data-testid="result-scoring-items"]').text()).toContain('莊家 1 台')
  })

  it('renders the draw reason for a draw result', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome: 'draw',
          resultSummary: {
            type: 'draw',
            ended: true,
            winnerSeat: null,
            discarderSeat: null,
            totalTai: null,
            drawReason: 'wall-exhausted',
            scoringItems: []
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="result-type"]').text()).toContain('流局')
    expect(wrapper.get('[data-testid="result-draw-reason"]').text()).toContain('牌牆耗盡')
  })
})
