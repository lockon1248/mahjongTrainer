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

const flower = (rank: 'spring' | 'summer' | 'autumn' | 'winter' | 'plum' | 'orchid' | 'bamboo' | 'chrysanthemum'): Tile => {
  return { suit: 'flower', rank }
}

const scoringItem = (
  patternId: string,
  label: string,
  tai: number,
  reason: string
) => ({ patternId, label, tai, reason })

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
      scoringItems: [
        scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
        scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌')
      ],
      totalTai: 4,
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
      scoringItems: [
        scoringItem('concealed-hand', '門清', 1, '沒有吃也沒有碰，手牌皆為自摸整理')
      ],
      totalTai: 1,
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
    expect(winning.matchedPatterns).toEqual(['dealer-win', 'concealed-self-draw'])
    expect(winning.totalTai).toBe(4)
    expect(winning.settlement).toEqual({
      winnerSeat: 'east',
      discarderSeat: null,
      paymentResponsibility: {
        type: 'self-draw',
        payerSeats: ['south', 'west', 'north']
      },
      scoringItems: [
        scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
        scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌')
      ],
      totalTai: 4,
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
          value: 5
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
    expect(winning.totalTai).toBe(4)
    expect(winning.settlement).toBeNull()
  })

  it('keeps settlement available when total tai reaches configured minimumTai', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      settlement: {
        selfDrawPaymentMode: 'winner-only',
        minimumTai: {
          status: 'configured',
          value: 4
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
      scoringItems: [
        scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
        scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌')
      ],
      totalTai: 4,
      minimumTai: {
        status: 'configured',
        value: 4
      }
    })
    expect(winning.isWinning).toBe(true)
    expect(winning.totalTai).toBe(4)
    expect(winning.settlement?.minimumTai).toEqual({
      status: 'configured',
      value: 4
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

    expect(matchedPatterns).toEqual(['dealer-win', 'concealed-self-draw', 'heaven-win'])
    expect(settlement?.totalTai).toBe(28)
    expect(settlement?.scoringItems).toEqual([
      scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
      scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌'),
      scoringItem('heaven-win', '天胡', 24, '莊家配牌完成後尚未打出第一張牌前已成和')
    ])
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

    expect(buildSettlementResult(bigThreeDragons, bigPatterns)?.totalTai).toBe(9)
    expect(buildSettlementResult(littleThreeDragons, littlePatterns)?.totalTai).toBe(5)
  })

  it('keeps concealed-self-draw and removes concealed-hand plus self-draw from the final scoring items', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...chars(4, 5, 6),
        ...dots(2, 3, 4),
        ...dots(6, 7, 8),
        ...bamboos(5, 6, 7),
        chars(9)[0]
      ],
      melds: [],
      flowers: [],
      winningTile: chars(9)[0],
      winningSeat: 'south',
      discarderSeat: null
    }

    const patterns = evaluateScoringPatterns(input, decomposeStandardHand(input))

    expect(patterns).toEqual(['concealed-self-draw'])
    expect(buildSettlementResult(input, patterns)?.scoringItems).toEqual([
      scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌')
    ])
  })

  it('keeps full-flush and removes half-flush from the final scoring items', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...chars(2, 3, 4),
        ...chars(4, 5, 6),
        ...chars(6, 7, 8),
        ...chars(8, 8, 8),
        chars(9)[0]
      ],
      melds: [],
      flowers: [],
      winningTile: chars(9)[0],
      winningSeat: 'south',
      discarderSeat: 'west'
    }

    const patterns = evaluateScoringPatterns(input, decomposeStandardHand(input))

    expect(patterns).toEqual(['concealed-hand', 'full-flush'])
    expect(buildSettlementResult(input, patterns)?.scoringItems).toEqual([
      scoringItem('concealed-hand', '門清', 1, '沒有吃也沒有碰，手牌皆為自摸整理'),
      scoringItem('full-flush', '清一色', 8, '整副牌由同一花色組成')
    ])
  })

  it('keeps concealed-kong-bonus and removes exposed-kong-bonus for the same kong group', () => {
    const bonus = mergeRuleConfig(createBaselineRuleConfig(), {
      scoringProfile: 'flower-wind-bonus'
    })

    if (!bonus.ok)
      throw new Error(bonus.error)

    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(4, 5, 6),
        ...bamboos(7, 8, 9),
        dragon('red'),
        dragon('red'),
        dragon('red'),
        wind('east')
      ],
      melds: [
        {
          type: 'kan-concealed',
          tiles: [...chars(7, 7, 7), chars(7)[0]],
          claimedTile: null,
          claimedFromSeat: null
        }
      ],
      flowers: [flower('spring')],
      winningTile: wind('east'),
      winningSeat: 'south',
      discarderSeat: null
    }

    const patterns = evaluateScoringPatterns(input, decomposeStandardHand(input), bonus.config)

    expect(patterns).toEqual(['concealed-self-draw', 'any-flower', 'concealed-kong-bonus'])
    expect(buildSettlementResult(input, patterns, bonus.config)?.scoringItems).toEqual([
      scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌'),
      scoringItem('any-flower', '見花見台', 1, '任一花牌皆可計台'),
      scoringItem('concealed-kong-bonus', '暗槓', 2, '每一組暗槓計 2 台')
    ])
  })

  it('does not keep all-sequences when self-draw or flowers violate its exclusion rules', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 2, 3),
        ...chars(4, 5, 6),
        ...dots(2, 3, 4),
        ...dots(6, 7, 8),
        ...bamboos(5, 6, 7),
        chars(9)[0]
      ],
      melds: [],
      flowers: [flower('spring')],
      winningTile: chars(9)[0],
      winningSeat: 'east',
      discarderSeat: null
    }

    const patterns = evaluateScoringPatterns(input, decomposeStandardHand(input))

    expect(patterns).not.toContain('all-sequences')
  })
})
