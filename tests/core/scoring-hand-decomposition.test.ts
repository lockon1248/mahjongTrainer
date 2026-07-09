import { describe, expect, it } from 'vitest'
import { decomposeStandardHand, type StandardWinInput, type Tile } from '@/core/index'

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

describe('scoring hand decomposition', () => {
  it('decomposes a concealed standard winning hand into five meld groups and one pair group', () => {
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
      winningTile: null
    }

    const breakdown = decomposeStandardHand(input)

    expect(breakdown).not.toBeNull()
    expect(breakdown?.meldGroups).toHaveLength(5)
    expect(breakdown?.pairGroup).toEqual({
      kind: 'pair',
      source: 'concealed',
      tiles: [dragon('red'), dragon('red')]
    })
  })

  it('returns null when the tiles cannot be decomposed into five meld groups and one pair group', () => {
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

    expect(decomposeStandardHand(input)).toBeNull()
  })
})
