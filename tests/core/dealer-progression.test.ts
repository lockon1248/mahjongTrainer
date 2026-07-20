import { describe, expect, it } from 'vitest'
import {
  createBaselineRound,
  discardTile,
  createWinRoundResult,
  createNextRoundFromCompletedRound,
  resolveClaimWindow,
  type BaselineRoundState,
  type Tile
} from '@/core'

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'characters', rank }))
}

const buildWall = (length = 90): Tile[] => {
  const pool: Tile[] = [...chars(1, 2, 3, 4, 5, 6, 7, 8, 9)]
  return Array.from({ length }, (_, index) => pool[index % pool.length]!)
}

const createCompletedWinRound = (input: {
  dealerSeat: BaselineRoundState['table']['dealerSeat']
  winnerSeat: BaselineRoundState['currentSeat']
  dealerContinuationCount?: number
}): BaselineRoundState => {
  const round = createBaselineRound({ wall: buildWall() })

  return {
    ...round,
    currentSeat: input.winnerSeat,
    phase: 'ended',
    table: {
      ...round.table,
      dealerSeat: input.dealerSeat,
      dealerContinuationCount: input.dealerContinuationCount ?? 0
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
  it('starts a new match with no dealer continuation', () => {
    const round = createBaselineRound({ wall: buildWall() })

    expect(round.table.dealerContinuationCount).toBe(0)
  })

  it('keeps the same dealer when the dealer wins the round', () => {
    const round = createCompletedWinRound({
      dealerSeat: 'east',
      winnerSeat: 'east'
    })

    const nextRound = createNextRoundFromCompletedRound(round, {
      wall: buildWall()
    })

    expect(nextRound.table.dealerSeat).toBe('east')
    expect(nextRound.table.dealerContinuationCount).toBe(1)
    expect(nextRound.currentSeat).toBe('east')
    expect(nextRound.phase).toBe('discard')
    expect(nextRound.outcome.status).toBe('in-progress')
  })

  it('increments the cumulative continuation count after repeated dealer wins', () => {
    const round = createCompletedWinRound({
      dealerSeat: 'east',
      winnerSeat: 'east',
      dealerContinuationCount: 1
    })

    const nextRound = createNextRoundFromCompletedRound(round, {
      wall: buildWall()
    })

    expect(nextRound.table.dealerContinuationCount).toBe(2)
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
    expect(nextRound.table.dealerContinuationCount).toBe(0)
    expect(nextRound.currentSeat).toBe('west')
    expect(nextRound.phase).toBe('discard')
    expect(nextRound.outcome.status).toBe('in-progress')
  })

  it('keeps the same dealer and creates the next round after a draw outcome', () => {
    const round = createBaselineRound({ wall: buildWall(65) })
    const claimWindow = discardTile(round, {
      seat: 'east',
      tile: round.players.east.concealedTiles[0]!
    })
    const drawnRound = resolveClaimWindow(claimWindow, [])

    expect(drawnRound.outcome.status).toBe('draw')
    if (drawnRound.outcome.status !== 'draw')
      throw new Error('expected a reachable draw outcome')
    expect(drawnRound.outcome.result.unresolved).toEqual([
      'ready-hand-check',
      'ready-hand-payment'
    ])

    const nextRound = createNextRoundFromCompletedRound(drawnRound, {
      wall: buildWall()
    })

    expect(nextRound.table.dealerSeat).toBe('east')
    expect(nextRound.table.dealerContinuationCount).toBe(1)
    expect(nextRound.currentSeat).toBe('east')
    expect(nextRound.phase).toBe('discard')
    expect(nextRound.outcome.status).toBe('in-progress')
  })
})
