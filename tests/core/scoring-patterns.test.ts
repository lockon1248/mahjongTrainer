import { describe, expect, it } from 'vitest'
import {
  decomposeStandardHand,
  evaluateScoringPatterns,
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

describe('scoring patterns', () => {
  it('returns supported baseline pattern identifiers in a stable order', () => {
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

    expect(evaluateScoringPatterns(input, breakdown)).toEqual(['dealer-win', 'self-draw'])
  })

  it('omits unsupported unresolved patterns', () => {
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
    const patterns = evaluateScoringPatterns(input, breakdown)

    expect(patterns).not.toContain('seven-rob-one')
    expect(patterns).not.toContain('earth-win')
  })

  it('detects heaven win when dealer starts with a complete hand before first discard', () => {
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

    expect(evaluateScoringPatterns(input, breakdown)).toEqual(['dealer-win', 'self-draw', 'heaven-win'])
  })

  it('detects big three dragons from three dragon triplets', () => {
    const input: StandardWinInput = {
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

    const breakdown = decomposeStandardHand(input)

    expect(evaluateScoringPatterns(input, breakdown)).toEqual(['big-three-dragons'])
  })

  it('detects little three dragons from two dragon triplets and one dragon pair', () => {
    const input: StandardWinInput = {
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

    const breakdown = decomposeStandardHand(input)

    expect(evaluateScoringPatterns(input, breakdown)).toEqual(['little-three-dragons'])
  })
})
