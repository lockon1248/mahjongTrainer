// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createBaselineRound, createBaselineWall, createNextRoundFromCompletedRound, createWinRoundResult } from '@/core'
import type { GameTableSnapshotViewModel } from '@/views/game/types'
import GameTableView from '@/views/game/components/GameTableView.vue'

const winningSnapshot: GameTableSnapshotViewModel = {
  humanSeat: 'east',
  currentSeat: 'south',
  phase: 'ended',
  outcome: 'win',
  dealerSeat: 'east',
  prevailingWind: 'east',
  wallCount: 0,
  totalDiscards: 30,
  lastClaimResolution: null,
  players: [
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
}

describe('next round flow', () => {
  it('renders the next-round entry only after the round ends', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...winningSnapshot,
          phase: 'discard',
          outcome: 'in-progress'
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="next-round-action"]').exists()).toBe(false)

    await wrapper.setProps({
      snapshot: winningSnapshot
    })

    expect(wrapper.get('[data-testid="next-round-action"]').text()).toContain('下一局')
  })

  it('renders the next-round action inside the human action row instead of a separate footer row', () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: winningSnapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="next-round-actions"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="player-action-row-east"]').text()).toContain('下一局')
  })

  it('emits the next-round intent back to the parent', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: winningSnapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    await wrapper.get('[data-testid="next-round-action"]').trigger('click')

    expect(wrapper.emitted('next-round')).toEqual([[]])
  })

  it('wraps the next round prevailing wind back to east after the north cycle completes', () => {
    const completedRound = createBaselineRound({
      wall: createBaselineWall(),
      dealerSeat: 'west',
      prevailingWind: 'north'
    })
    const nextRound = createNextRoundFromCompletedRound({
      ...completedRound,
      currentSeat: 'north',
      phase: 'ended',
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: 'north',
          discarderSeat: 'south',
          totalTai: 1
        })
      }
    }, {
      wall: createBaselineWall()
    })

    expect(nextRound.table.prevailingWind).toBe('east')
    expect(nextRound.table.dealerSeat).toBe('east')
  })
})
