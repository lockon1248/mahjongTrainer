// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { HumanClaimCandidate } from '@/core'
import type { GameTableSnapshotViewModel } from '@/views/game/types'
import GameTableView from '@/views/game/components/GameTableView.vue'

const claimCandidates: HumanClaimCandidate[] = [
  {
    actionType: 'pass',
    tile: { suit: 'characters', rank: 3 },
    consumedTiles: []
  },
  {
    actionType: 'chi',
    tile: { suit: 'characters', rank: 3 },
    consumedTiles: [
      { suit: 'characters', rank: 1 },
      { suit: 'characters', rank: 2 }
    ]
  }
]

const baseSnapshot: GameTableSnapshotViewModel = {
  humanSeat: 'east',
  currentSeat: 'north',
  phase: 'claim-window',
  outcome: 'in-progress',
  dealerSeat: 'east',
  prevailingWind: 'east',
  wallCount: 40,
  totalDiscards: 6,
  lastClaimResolution: null,
  players: [
    {
      seat: 'east',
      relativePosition: 'bottom',
      concealedCount: 16,
      concealedTiles: [
        { suit: 'characters', rank: 1 },
        { suit: 'characters', rank: 2 }
      ],
      flowerCount: 0,
      meldCount: 0,
      melds: [],
      discardCount: 1,
      discards: [],
      score: 0,
      declaredReady: false
    },
    {
      seat: 'south',
      relativePosition: 'right',
      concealedCount: 16,
      concealedTiles: [],
      flowerCount: 0,
      meldCount: 0,
      melds: [],
      discardCount: 1,
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
      discardCount: 2,
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
      discardCount: 2,
      discards: [],
      score: 0,
      declaredReady: false
    }
  ]
}

describe('human claim window', () => {
  it('renders only the legal claim actions provided by core', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: baseSnapshot,
        humanSeat: 'east',
        claimCandidates,
        selfTurnCandidates: []
      }
    })

    const renderedButtons = wrapper.findAll('[data-testid="human-claim-action"]').map(button => button.text())

    expect(renderedButtons).toEqual(['略過', '吃牌：一萬、二萬'])
  })

  it('emits the selected legal claim candidate back to the parent', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: baseSnapshot,
        humanSeat: 'east',
        claimCandidates,
        selfTurnCandidates: []
      }
    })

    await wrapper.findAll('[data-testid="human-claim-action"]')[1]!.trigger('click')

    expect(wrapper.emitted('claim')).toEqual([[claimCandidates[1]]])
  })

  it('keeps rendering summary fields from the latest snapshot after claim resolution', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: baseSnapshot,
        humanSeat: 'east',
        claimCandidates,
        selfTurnCandidates: []
      }
    })

    await wrapper.setProps({
      snapshot: {
        ...baseSnapshot,
        currentSeat: 'east',
        phase: 'discard',
        lastClaimResolution: {
          type: 'chi',
          seat: 'east',
          tile: { suit: 'characters', rank: 3 }
        }
      },
      claimCandidates: [],
      selfTurnCandidates: []
    })

    expect(wrapper.get('[data-testid="summary-current-seat"]').text()).toContain('東家')
    expect(wrapper.get('[data-testid="summary-phase"]').text()).toContain('出牌')
    expect(wrapper.get('[data-testid="summary-last-claim"]').text()).toContain('吃牌')
  })

  it('clarifies claim-window ownership and shows strong seat flags on the table', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: baseSnapshot,
        humanSeat: 'east',
        claimCandidates,
        selfTurnCandidates: []
      }
    })

    expect(wrapper.get('[data-testid="summary-current-seat"]').text()).toContain('剛出牌')
    expect(wrapper.get('[data-testid="summary-current-seat"]').text()).toContain('北家')
    expect(wrapper.get('[data-testid="player-status-east"]').text()).toContain('請宣告')
    expect(wrapper.get('[data-testid="player-status-north"]').text()).toContain('剛出牌')
    expect(wrapper.get('[data-seat="east"]').classes()).toContain('player-panel--active')
    expect(wrapper.get('[data-seat="north"]').classes()).toContain('player-panel--recent')
  })
})
