import { describe, expect, it } from 'vitest'
import {
  createBaselineRound,
  createDrawRoundResult,
  createWinRoundResult,
  createNextRoundFromCompletedRound,
  type BaselineRoundState,
  type Tile
} from '@/core'

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'characters', rank }))
}

const buildWall = (): Tile[] => {
  const pool: Tile[] = [...chars(1, 2, 3, 4, 5, 6, 7, 8, 9)]
  return Array.from({ length: 90 }, (_, index) => pool[index % pool.length]!)
}

const createCompletedWinRound = (input: {
  dealerSeat: BaselineRoundState['table']['dealerSeat']
  winnerSeat: BaselineRoundState['currentSeat']
}): BaselineRoundState => {
  const round = createBaselineRound({ wall: buildWall() })

  return {
    ...round,
    currentSeat: input.winnerSeat,
    phase: 'ended',
    table: {
      ...round.table,
      dealerSeat: input.dealerSeat
    },
    outcome: {
      status: 'win',
      result: createWinRoundResult({
        winnerSeat: input.winnerSeat,
        discarderSeat: null
      })
    }
  }
}

describe('dealer progression', () => {
  it('keeps the same dealer when the dealer wins the round', () => {
    const round = createCompletedWinRound({
      dealerSeat: 'east',
      winnerSeat: 'east'
    })

    const nextRound = createNextRoundFromCompletedRound(round, {
      wall: buildWall()
    })

    expect(nextRound.table.dealerSeat).toBe('east')
    expect(nextRound.currentSeat).toBe('east')
    expect(nextRound.phase).toBe('discard')
    expect(nextRound.outcome.status).toBe('in-progress')
  })

  it('passes the dealership to the winner next seat when a non-dealer wins the round', () => {
    const round = createCompletedWinRound({
      dealerSeat: 'east',
      winnerSeat: 'south'
    })

    const nextRound = createNextRoundFromCompletedRound(round, {
      wall: buildWall()
    })

    expect(nextRound.table.dealerSeat).toBe('west')
    expect(nextRound.currentSeat).toBe('west')
    expect(nextRound.phase).toBe('discard')
    expect(nextRound.outcome.status).toBe('in-progress')
  })

  it('keeps the same dealer and creates the next round after a draw outcome', () => {
    const round = createBaselineRound({ wall: buildWall() })
    const drawnRound: BaselineRoundState = {
      ...round,
      phase: 'ended',
      outcome: {
        status: 'draw',
        result: createDrawRoundResult()
      }
    }

    const nextRound = createNextRoundFromCompletedRound(drawnRound, {
      wall: buildWall()
    })

    expect(nextRound.table.dealerSeat).toBe('east')
    expect(nextRound.currentSeat).toBe('east')
    expect(nextRound.phase).toBe('discard')
    expect(nextRound.outcome.status).toBe('in-progress')
  })
})
