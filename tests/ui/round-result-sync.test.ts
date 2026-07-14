// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { GameTableSnapshotViewModel } from '@/views/game/types'
import GameTableView from '@/views/game/components/GameTableView.vue'

const basePlayers: GameTableSnapshotViewModel['players'] = [
  {
    seat: 'east',
    concealedCount: 16,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    discardCount: 8,
    score: 0,
    declaredReady: false
  },
  {
    seat: 'south',
    concealedCount: 17,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    discardCount: 7,
    score: 0,
    declaredReady: false
  },
  {
    seat: 'west',
    concealedCount: 16,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    discardCount: 7,
    score: 0,
    declaredReady: false
  },
  {
    seat: 'north',
    concealedCount: 16,
    concealedTiles: [],
    flowerCount: 0,
    meldCount: 0,
    discardCount: 8,
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
            scoringItems: ['dealer-win', 'self-draw']
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="result-type"]').text()).toContain('win')
    expect(wrapper.get('[data-testid="result-ended"]').text()).toContain('yes')
    expect(wrapper.get('[data-testid="result-winner"]').text()).toContain('south')
    expect(wrapper.get('[data-testid="result-discarder"]').text()).toContain('west')
    expect(wrapper.get('[data-testid="result-total-tai"]').text()).toContain('3')
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

    expect(wrapper.get('[data-testid="result-type"]').text()).toContain('draw')
    expect(wrapper.get('[data-testid="result-draw-reason"]').text()).toContain('wall-exhausted')
  })
})
