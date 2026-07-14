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
        status: 'configured',
        value: 0
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
        status: 'configured',
        value: 0
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
        status: 'configured',
        value: 0
      }
    })
  })

  it('returns no settlement when total tai is below configured minimumTai', () => {
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

    expect(settlement).toBeNull()
    expect(winning.isWinning).toBe(false)
    expect(winning.totalTai).toBe(2)
    expect(winning.settlement).toBeNull()
  })

  it('keeps settlement available when total tai reaches configured minimumTai', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      settlement: {
        selfDrawPaymentMode: 'winner-only',
        minimumTai: {
          status: 'configured',
          value: 2
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
        value: 2
      }
    })
    expect(winning.isWinning).toBe(true)
    expect(winning.totalTai).toBe(2)
    expect(winning.settlement?.minimumTai).toEqual({
      status: 'configured',
      value: 2
    })
  })

  it('adds heaven win tai on top of baseline dealer self-draw scoring', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red'),
        dragon('red')
      ],
      melds: [],
      flowers: [],
      winningTile: null,
      winningSeat: 'east',
      discarderSeat: null,
      winContext: {
        isHeavenWin: true
      }
    }

    const breakdown = decomposeStandardHand(input)
    const matchedPatterns = evaluateScoringPatterns(input, breakdown)
    const settlement = buildSettlementResult(input, matchedPatterns)

    expect(matchedPatterns).toEqual(['dealer-win', 'self-draw', 'heaven-win'])
    expect(settlement?.totalTai).toBe(26)
    expect(settlement?.scoringItems).toEqual(['dealer-win', 'self-draw', 'heaven-win'])
  })

  it('assigns configured tai to big three dragons and little three dragons', () => {
    const bigThreeDragons: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...chars(9, 9),
        ...dots(4, 5, 6),
        dragon('red'),
        dragon('red'),
        dragon('red'),
        dragon('green'),
        dragon('green'),
        dragon('green'),
        dragon('white'),
        dragon('white')
      ],
      melds: [],
      flowers: [],
      winningTile: dragon('white'),
      winningSeat: 'south',
      discarderSeat: 'west'
    }
    const littleThreeDragons: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(4, 5, 6),
        ...bamboos(7, 8, 9),
        dragon('red'),
        dragon('red'),
        dragon('red'),
        dragon('green'),
        dragon('green'),
        dragon('green'),
        dragon('white')
      ],
      melds: [],
      flowers: [],
      winningTile: dragon('white'),
      winningSeat: 'south',
      discarderSeat: 'west'
    }

    const bigPatterns = evaluateScoringPatterns(bigThreeDragons, decomposeStandardHand(bigThreeDragons))
    const littlePatterns = evaluateScoringPatterns(littleThreeDragons, decomposeStandardHand(littleThreeDragons))

    expect(buildSettlementResult(bigThreeDragons, bigPatterns)?.totalTai).toBe(8)
    expect(buildSettlementResult(littleThreeDragons, littlePatterns)?.totalTai).toBe(4)
  })
})
