import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createBaselineRound, createBaselineWall, createWinRoundResult } from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'

describe('repro next round state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('logs state after startNextRound for south winner case', () => {
    const store = useGameSessionStore()
    const baseRound = createBaselineRound({ wall: createBaselineWall(() => 0.5) })
    store.round = {
      ...baseRound,
      phase: 'ended',
      currentSeat: 'south',
      outcome: {
        status: 'win',
        result: createWinRoundResult({ winnerSeat: 'south', discarderSeat: 'west' })
      }
    }

    store.startNextRound()

    console.log(JSON.stringify({
      phase: store.round?.phase,
      currentSeat: store.round?.currentSeat,
      outcome: store.round?.outcome.status,
      dealerSeat: store.round?.table.dealerSeat,
      humanClaims: store.availableHumanClaims.length,
      humanSelfTurnActions: store.availableHumanSelfTurnActions.length,
      error: store.error,
    }, null, 2))

    expect(store.error).toBeNull()
  })
})
