// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { HumanSelfTurnCandidate } from '@/core'
import type { GameTableSnapshotViewModel } from '@/views/game/types'
import GameTableView from '@/views/game/components/GameTableView.vue'

const selfTurnCandidates: HumanSelfTurnCandidate[] = [
  {
    actionType: 'win-self-draw',
    tile: null,
    consumedTiles: [],
    meldTile: null
  },
  {
    actionType: 'kan-concealed',
    tile: { suit: 'characters', rank: 9 },
    consumedTiles: [
      { suit: 'characters', rank: 9 },
      { suit: 'characters', rank: 9 },
      { suit: 'characters', rank: 9 },
      { suit: 'characters', rank: 9 }
    ],
    meldTile: null
  }
]

const baseSnapshot: GameTableSnapshotViewModel = {
  humanSeat: 'east',
  currentSeat: 'east',
  phase: 'discard',
  outcome: 'in-progress',
  dealerSeat: 'east',
  prevailingWind: 'east',
  wallCount: 40,
  totalDiscards: 6,
  lastClaimResolution: null,
  players: [
    {
      seat: 'east',
      concealedCount: 17,
      concealedTiles: [
        { suit: 'characters', rank: 1 },
        { suit: 'characters', rank: 2 }
      ],
      flowerCount: 0,
      meldCount: 0,
      discardCount: 1,
      score: 0,
      declaredReady: false
    },
    {
      seat: 'south',
      concealedCount: 16,
      concealedTiles: [],
      flowerCount: 0,
      meldCount: 0,
      discardCount: 1,
      score: 0,
      declaredReady: false
    },
    {
      seat: 'west',
      concealedCount: 16,
      concealedTiles: [],
      flowerCount: 0,
      meldCount: 0,
      discardCount: 2,
      score: 0,
      declaredReady: false
    },
    {
      seat: 'north',
      concealedCount: 16,
      concealedTiles: [],
      flowerCount: 0,
      meldCount: 0,
      discardCount: 2,
      score: 0,
      declaredReady: false
    }
  ]
}

describe('human self-turn actions', () => {
  it('renders only the legal self-turn actions provided by core', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: baseSnapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates
      }
    })

    const renderedButtons = wrapper.findAll('[data-testid="human-self-turn-action"]').map(button => button.text())

    expect(renderedButtons).toEqual(['win-self-draw', 'kan-concealed:characters-9+characters-9+characters-9+characters-9'])
  })

  it('emits the selected self-turn candidate back to the parent', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: baseSnapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates
      }
    })

    await wrapper.findAll('[data-testid="human-self-turn-action"]')[1]!.trigger('click')

    expect(wrapper.emitted('self-turn-action')).toEqual([[selfTurnCandidates[1]]])
  })
})
