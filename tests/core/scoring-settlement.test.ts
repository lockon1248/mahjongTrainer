import { describe, expect, it } from 'vitest'
import {
  buildSettlementResult,
  createBaselineRuleConfig,
  decomposeStandardHand,
  evaluateScoringPatterns,
  mergeRuleConfig,
  validateStandardWin,
  type StandardWinInput,
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

const wind = (rank: 'east' | 'south' | 'west' | 'north'): Tile => {
  return { suit: 'winds', rank }
}

const dragon = (rank: 'red' | 'green' | 'white'): Tile => {
  return { suit: 'dragons', rank }
}

describe('scoring settlement', () => {
  it('builds a self-draw settlement result with matched scoring items and totalTai', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      melds: [],
      flowers: [],
      winningTile: dragon('red'),
      winningSeat: 'east',
      discarderSeat: null
    }

    const breakdown = decomposeStandardHand(input)
    const matchedPatterns = evaluateScoringPatterns(input, breakdown)

    expect(buildSettlementResult(input, matchedPatterns)).toEqual({
      winnerSeat: 'east',
      discarderSeat: null,
      paymentResponsibility: {
        type: 'self-draw',
        payerSeats: ['south', 'west', 'north']
      },
      scoringItems: ['dealer-win', 'self-draw'],
      totalTai: 2,
      minimumTai: {
        status: 'unresolved'
      }
    })
  })

  it('builds a discard-win settlement result with a single payer', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      melds: [],
      flowers: [],
      winningTile: dragon('red'),
      winningSeat: 'south',
      discarderSeat: 'west'
    }

    const breakdown = decomposeStandardHand(input)
    const matchedPatterns = evaluateScoringPatterns(input, breakdown)

    expect(buildSettlementResult(input, matchedPatterns)).toEqual({
      winnerSeat: 'south',
      discarderSeat: 'west',
      paymentResponsibility: {
        type: 'discard-win',
        payerSeats: ['west']
      },
      scoringItems: [],
      totalTai: 0,
      minimumTai: {
        status: 'unresolved'
      }
    })
  })

  it('proves SCORE-STACK-001 uses scoring core output rather than UI logic', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      melds: [],
      flowers: [],
      winningTile: dragon('red'),
      winningSeat: 'east',
      discarderSeat: null
    }

    const winning = validateStandardWin(input)

    expect(winning.isWinning).toBe(true)
    expect(winning.matchedPatterns).toEqual(['dealer-win', 'self-draw'])
    expect(winning.totalTai).toBe(2)
    expect(winning.settlement).toEqual({
      winnerSeat: 'east',
      discarderSeat: null,
      paymentResponsibility: {
        type: 'self-draw',
        payerSeats: ['south', 'west', 'north']
      },
      scoringItems: ['dealer-win', 'self-draw'],
      totalTai: 2,
      minimumTai: {
        status: 'unresolved'
      }
    })
  })

  it('reads scoring payment and minimum tai settings from rule config', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      settlement: {
        selfDrawPaymentMode: 'winner-only',
        minimumTai: {
          status: 'configured',
          value: 3
        }
      }
    })

    if (!merged.ok)
      throw new Error(merged.error)

    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      melds: [],
      flowers: [],
      winningTile: dragon('red'),
      winningSeat: 'east',
      discarderSeat: null
    }

    const breakdown = decomposeStandardHand(input)
    const matchedPatterns = evaluateScoringPatterns(input, breakdown)
    const settlement = buildSettlementResult(input, matchedPatterns, merged.config)
    const winning = validateStandardWin(input, merged.config)

    expect(settlement).toEqual({
      winnerSeat: 'east',
      discarderSeat: null,
      paymentResponsibility: {
        type: 'winner-only',
        payerSeats: ['east']
      },
      scoringItems: ['dealer-win', 'self-draw'],
      totalTai: 2,
      minimumTai: {
        status: 'configured',
        value: 3
      }
    })
    expect(winning.totalTai).toBe(2)
    expect(winning.settlement?.minimumTai).toEqual({
      status: 'configured',
      value: 3
    })
  })
})
