import { describe, expect, it } from 'vitest'
import { validateStandardWin, type StandardWinInput, type Tile } from '@/core/index'

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
})
