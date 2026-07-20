// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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
  resultSummary: {
    type: 'win',
    ended: true,
    winnerSeat: 'south',
    discarderSeat: 'west',
    totalTai: 0,
    drawReason: null,
    scoringItems: [],
    chipSettlements: [
      { seat: 'east', delta: 0, chipsAfter: 100 },
      { seat: 'south', delta: 30, chipsAfter: 130 },
      { seat: 'west', delta: -30, chipsAfter: 70 },
      { seat: 'north', delta: 0, chipsAfter: 100 }
    ]
  },
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
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders the next-round entry only after the round ends', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...winningSnapshot,
          phase: 'discard',
          outcome: 'in-progress',
          resultSummary: null
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
    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()

    expect(document.body.querySelector('[data-testid="next-round-action"]')?.textContent).toContain('下一局')
  })

  it('renders the next-round action inside the settlement dialog instead of the human action row', async () => {
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: winningSnapshot,
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="next-round-actions"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="player-action-row-east"]').text()).not.toContain('下一局')
    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    expect(document.body.querySelector('[data-testid="round-settlement-dialog"]')?.textContent).toContain('下一局')
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

    await vi.advanceTimersByTimeAsync(1500)
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('[data-testid="next-round-action"]')?.click()
    await nextTick()

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
