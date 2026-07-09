import { describe, expect, it } from 'vitest'
import {
  decomposeStandardHand,
  evaluateScoringPatterns,
  type StandardWinInput,
  type Tile
} from '@/core/index'

function chars(...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] {
  return ranks.map((rank) => ({ suit: 'characters', rank }))
}

function dots(...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] {
  return ranks.map((rank) => ({ suit: 'dots', rank }))
}

function bamboos(...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] {
  return ranks.map((rank) => ({ suit: 'bamboo', rank }))
}

function wind(rank: 'east' | 'south' | 'west' | 'north'): Tile {
  return { suit: 'winds', rank }
}

function dragon(rank: 'red' | 'green' | 'white'): Tile {
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
    expect(patterns).not.toContain('heaven-win')
  })
})
