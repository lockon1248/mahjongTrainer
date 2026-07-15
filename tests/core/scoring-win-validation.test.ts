import { describe, expect, it } from 'vitest'
import { createBaselineRuleConfig, mergeRuleConfig, validateStandardWin, type StandardWinInput, type Tile } from '@/core/index'

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

const scoringItem = (
  patternId: string,
  label: string,
  tai: number,
  reason: string
) => ({ patternId, label, tai, reason })

describe('scoring win validation', () => {
  it('returns a winning result for WIN-STANDARD-001', () => {
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
      winningSeat: 'east'
    }

    const result = validateStandardWin(input)

    expect(result.isWinning).toBe(true)
    expect(result.breakdown?.meldGroups).toHaveLength(5)
    expect(result.breakdown?.pairGroup?.tiles).toEqual([dragon('red'), dragon('red')])
  })

  it('returns a winning result for WIN-MELD-001 while preserving exposed melds in the breakdown', () => {
    const input: StandardWinInput = {
      concealedTiles: [...chars(4, 5), ...dots(7, 8, 9), ...bamboos(1, 1), wind('east'), wind('east'), wind('east')],
      melds: [
        {
          type: 'chi',
          tiles: chars(1, 2, 3),
          claimedTile: { suit: 'characters', rank: 3 },
          claimedFromSeat: 'south'
        },
        {
          type: 'pon',
          tiles: dots(5, 5, 5),
          claimedTile: { suit: 'dots', rank: 5 },
          claimedFromSeat: 'west'
        }
      ],
      flowers: [],
      winningTile: { suit: 'characters', rank: 6 },
      winningSeat: 'east'
    }

    const result = validateStandardWin(input)

    expect(result.isWinning).toBe(true)
    expect(result.breakdown?.meldGroups).toHaveLength(5)
    expect(result.breakdown?.meldGroups.filter((group) => group.source === 'meld')).toHaveLength(2)
  })

  it('returns a non-winning result for a non-standard tile set', () => {
    const input: StandardWinInput = {
      concealedTiles: [
        ...chars(1, 1),
        ...dots(2, 2),
        ...bamboos(3, 3),
        wind('east'),
        wind('south'),
        wind('west'),
        wind('north'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        ...chars(4, 5, 7, 8)
      ],
      melds: [],
      flowers: [],
      winningTile: null
    }

    expect(validateStandardWin(input)).toEqual({
      isWinning: false,
      breakdown: null,
      matchedPatterns: [],
      totalTai: null,
      settlement: null
    })
  })

  it('treats a standard hand as not yet valid when total tai is below configured minimumTai', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      settlement: {
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
      winningSeat: 'south',
      discarderSeat: 'west'
    }

    const result = validateStandardWin(input, merged.config)

    expect(result.isWinning).toBe(false)
    expect(result.breakdown?.meldGroups).toHaveLength(5)
    expect(result.matchedPatterns).toEqual(['concealed-hand'])
    expect(result.totalTai).toBe(1)
    expect(result.settlement).toBeNull()
  })

  it('keeps a standard hand valid when total tai reaches configured minimumTai', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      settlement: {
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

    const result = validateStandardWin(input, merged.config)

    expect(result.isWinning).toBe(true)
    expect(result.matchedPatterns).toEqual(['dealer-win', 'concealed-self-draw'])
    expect(result.totalTai).toBe(4)
    expect(result.settlement?.scoringItems).toEqual([
      scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
      scoringItem('concealed-self-draw', '門清自摸', 3, '門清且自摸胡牌')
    ])
    expect(result.settlement?.minimumTai).toEqual({
      status: 'configured',
      value: 4
    })
  })
})
