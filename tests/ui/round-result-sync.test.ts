// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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

const baseChipSettlements = [
  { seat: 'east', delta: 0, chipsAfter: 100 },
  { seat: 'south', delta: 30, chipsAfter: 130 },
  { seat: 'west', delta: -30, chipsAfter: 70 },
  { seat: 'north', delta: 0, chipsAfter: 100 }
] as const

const inProgressSnapshot: GameTableSnapshotViewModel = {
  humanSeat: 'east',
  currentSeat: 'east',
  phase: 'discard',
  outcome: 'in-progress',
  dealerSeat: 'east',
  prevailingWind: 'east',
  wallCount: 40,
  totalDiscards: 8,
  discardSequence: [],
  lastClaimResolution: null,
  resultSummary: null,
  players: [...basePlayers]
}

const advanceSettlementDelay = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(1500)
  await nextTick()
}

describe('round result sync', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

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

  it.each([
    {
      outcome: 'win' as const,
      resultSummary: {
        type: 'win' as const,
        ended: true,
        winnerSeat: 'south' as const,
        discarderSeat: 'west' as const,
        totalTai: 3,
        drawReason: null,
        scoringItems: [scoringItem('self-draw', '自摸', 2, '自摸完成和牌')],
        chipSettlements: [...baseChipSettlements]
      }
    },
    {
      outcome: 'draw' as const,
      resultSummary: {
        type: 'draw' as const,
        ended: true,
        winnerSeat: null,
        discarderSeat: null,
        totalTai: null,
        drawReason: 'wall-exhausted',
        scoringItems: [],
        chipSettlements: baseChipSettlements.map(item => ({
          ...item,
          delta: 0,
          chipsAfter: 100
        }))
      }
    }
  ])('waits 1.5 seconds before showing the $outcome settlement dialog', async ({ outcome, resultSummary }) => {
    vi.useFakeTimers()
    mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome,
          resultSummary
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(document.body.querySelector('[data-testid="round-settlement-dialog"]')).toBeNull()

    await vi.advanceTimersByTimeAsync(1499)
    expect(document.body.querySelector('[data-testid="round-settlement-dialog"]')).toBeNull()

    await vi.advanceTimersByTimeAsync(1)
    await nextTick()
    expect(document.body.querySelector('[data-testid="round-settlement-dialog"]')).not.toBeNull()
  })

  it('renders winner, discarder and total tai for a win result', async () => {
    vi.useFakeTimers()
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
            ],
            chipSettlements: [...baseChipSettlements]
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="result-type"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="result-ended"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="result-winner"]').text()).toContain('南家')
    expect(wrapper.get('[data-testid="result-discarder"]').text()).toContain('西家')
    expect(wrapper.get('[data-testid="result-total-tai"]').text()).toContain('3')
    expect(wrapper.find('[data-testid="result-scoring-trigger"]').exists()).toBe(false)
    await advanceSettlementDelay()
    const settlement = document.body.querySelector('[data-testid="round-settlement-dialog"]')
    expect(settlement?.textContent).toContain('本局結算')
    expect(settlement?.textContent).toContain('莊家 1 台')
    expect(settlement?.textContent).toContain('自摸 2 台')
    expect(settlement?.textContent).toContain('南家')
    expect(settlement?.textContent).toContain('本局 +30')
    expect(settlement?.textContent).toContain('結算後 130')
    expect(settlement?.querySelector('[data-testid="next-round-action"]')).not.toBeNull()
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
              meldCount: 1,
              melds: [
                {
                  type: 'kan-concealed',
                  labels: ['一萬', '一萬', '一萬', '一萬']
                }
              ],
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
            ],
            chipSettlements: [...baseChipSettlements]
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
    expect(wrapper.get('[data-testid="player-melds-south"]').text()).toContain('一萬')
  })

  it('renders discard-win scoring items for a discard win result', async () => {
    vi.useFakeTimers()
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
            ],
            chipSettlements: [...baseChipSettlements]
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
    await advanceSettlementDelay()
    const settlement = document.body.querySelector('[data-testid="round-settlement-dialog"]')
    expect(settlement?.querySelector('[data-testid="settlement-win-outcome"]')?.textContent).toBe('東家 和牌｜南家 放槍')
    expect(settlement?.textContent).toContain('莊家 1 台')
    expect(wrapper.find('[data-testid="result-scoring-trigger"]').exists()).toBe(false)
  })

  it('identifies a self-draw winner without showing a discarder', async () => {
    vi.useFakeTimers()
    mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome: 'win',
          resultSummary: {
            type: 'win',
            ended: true,
            winnerSeat: 'north',
            discarderSeat: null,
            totalTai: 2,
            drawReason: null,
            scoringItems: [scoringItem('self-draw', '自摸', 2, '自摸完成和牌')],
            chipSettlements: [...baseChipSettlements]
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    await advanceSettlementDelay()
    const settlement = document.body.querySelector('[data-testid="round-settlement-dialog"]')
    expect(settlement?.querySelector('[data-testid="settlement-win-outcome"]')?.textContent).toBe('北家 自摸')
    expect(settlement?.querySelector('[data-testid="settlement-win-outcome"]')?.textContent).not.toContain('放槍')
  })

  it('renders the draw reason for a draw result', async () => {
    vi.useFakeTimers()
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
            scoringItems: [],
            chipSettlements: baseChipSettlements.map(item => ({
              ...item,
              delta: 0,
              chipsAfter: 100
            }))
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(wrapper.find('[data-testid="result-type"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="result-draw-reason"]').text()).toContain('牌牆耗盡')
    await advanceSettlementDelay()
    const settlement = document.body.querySelector('[data-testid="round-settlement-dialog"]')
    expect(settlement?.textContent).toContain('牌牆耗盡')
    expect(settlement?.querySelector('[data-testid="settlement-win-outcome"]')).toBeNull()
    expect(settlement?.textContent).not.toContain('總台數')
    expect(settlement?.querySelector('[data-testid="result-scoring-items"]')).toBeNull()
    expect(settlement?.textContent).toContain('本局 ±0')
  })

  it('shows final match settlement after win scoring closes and hides the dead next-round action', async () => {
    vi.useFakeTimers()
    const wrapper = mount(GameTableView, {
      props: {
        snapshot: {
          ...inProgressSnapshot,
          phase: 'ended',
          outcome: 'win',
          matchSummary: {
            initialChips: 100,
            victoryMode: 'bankruptcy',
            baseStake: 30,
            taiValue: 10,
            status: 'ended',
            winnerSeat: 'east'
          },
          players: basePlayers.map((player, index) => ({
            ...player,
            score: [230, 100, 100, -30][index]!
          })),
          resultSummary: {
            type: 'win',
            ended: true,
            winnerSeat: 'east',
            discarderSeat: 'north',
            totalTai: 10,
            drawReason: null,
            scoringItems: [
              scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家')
            ],
            chipSettlements: [
              { seat: 'east', delta: 130, chipsAfter: 230 },
              { seat: 'south', delta: 0, chipsAfter: 100 },
              { seat: 'west', delta: 0, chipsAfter: 100 },
              { seat: 'north', delta: -130, chipsAfter: -30 }
            ]
          }
        },
        humanSeat: 'east',
        claimCandidates: [],
        selfTurnCandidates: []
      }
    })

    expect(document.body.querySelector('[data-testid="scoring-dialog"]')).toBeNull()
    expect(document.body.querySelector('[data-testid="match-settlement-dialog"]')).toBeNull()
    expect(wrapper.find('[data-testid="next-round-action"]').exists()).toBe(false)

    await advanceSettlementDelay()
    const settlement = document.body.querySelector('[data-testid="round-settlement-dialog"]')
    expect(settlement?.textContent).toContain('本局結算')
    expect(settlement?.textContent).toContain('總冠軍')
    expect(settlement?.textContent).toContain('東家')
    expect(settlement?.textContent).toContain('230')
    expect(settlement?.textContent).toContain('-30')
    expect(settlement?.querySelector('[data-testid="next-round-action"]')).toBeNull()

    document.body.querySelector<HTMLButtonElement>('[data-testid="restart-match-action"]')?.click()
    await nextTick()
    expect(wrapper.emitted('restart-match')).toHaveLength(1)
  })
})
