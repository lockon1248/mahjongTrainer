import { describe, expect, it } from 'vitest'
import {
  createBaselineRuleConfig,
  createBaselineRound,
  createDrawRoundResult,
  evaluateExhaustiveDraw,
  mergeRuleConfig,
  type Tile
} from '@/core/index'

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'characters', rank }))
}

const dots = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'dots', rank }))
}

const bamboos = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'bamboo', rank }))
}

const buildWall = (): Tile[] => {
  const pool = [
    ...chars(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...dots(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...bamboos(1, 2, 3, 4, 5, 6, 7, 8, 9)
  ]

  return Array.from({ length: 65 }, (_, index) => pool[index % pool.length]!)
}

describe('round flow exhaustive draw outcome', () => {
  it('does not advertise settled dealer continuation in the default draw result', () => {
    expect(createDrawRoundResult().unresolved).toEqual([
      'ready-hand-check',
      'ready-hand-payment'
    ])
  })

  it('returns an exhaustive draw outcome when no further normal draw is possible', () => {
    const round = createBaselineRound({ wall: buildWall() })
    const exhausted = {
      ...round,
      table: {
        ...round.table,
        wall: []
      },
      phase: 'draw' as const,
      currentSeat: 'south' as const
    }

    const result = evaluateExhaustiveDraw(exhausted)

    expect(result.outcome).toEqual({
      status: 'draw',
      result: {
        type: 'draw',
        winnerSeat: null,
        discarderSeat: null,
        totalTai: null,
        scoringItems: [],
        drawReason: 'wall-exhausted',
        unresolved: ['ready-hand-check', 'ready-hand-payment']
      }
    })
    expect(result.phase).toBe('ended')
  })

  it('keeps unresolved post-draw rules unset beyond the draw summary itself', () => {
    const round = createBaselineRound({ wall: buildWall() })
    const result = evaluateExhaustiveDraw({
      ...round,
      table: {
        ...round.table,
        wall: []
      },
      phase: 'draw'
    })

    if (result.outcome.status !== 'draw')
      throw new Error('expected draw outcome')

    expect(result.outcome.result.unresolved).toEqual([
      'ready-hand-check',
      'ready-hand-payment'
    ])
    expect(result.outcome.result.winnerSeat).toBeNull()
    expect(result.outcome.result.discarderSeat).toBeNull()
  })

  it('uses configured post-draw policies to reduce the unresolved list without inventing business outcomes', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      postDraw: {
        dealerContinuation: {
          status: 'configured',
          value: false
        }
      }
    })

    if (!merged.ok)
      throw new Error(merged.error)

    const round = createBaselineRound({
      wall: buildWall(),
      ruleConfig: merged.config
    })
    const result = evaluateExhaustiveDraw({
      ...round,
      table: {
        ...round.table,
        wall: []
      },
      phase: 'draw'
    })

    if (result.outcome.status !== 'draw')
      throw new Error('expected draw outcome')

    expect(result.outcome.result.unresolved).toEqual([
      'ready-hand-check',
      'ready-hand-payment'
    ])
    expect(result.outcome.result.drawReason).toBe('wall-exhausted')
  })
})
