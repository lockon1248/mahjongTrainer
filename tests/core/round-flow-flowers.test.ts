import { describe, expect, it } from 'vitest'
import {
  createBaselineRound,
  discardTile,
  drawHandToTarget,
  drawForCurrentSeat,
  resolveClaimWindow,
  type Tile
} from '@/core/index'

const flower = (rank: 'spring' | 'summer' | 'autumn' | 'winter' | 'plum' | 'orchid' | 'bamboo' | 'chrysanthemum'): Tile => {
  return { suit: 'flower', rank }
}

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'characters', rank }))
}

const dots = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'dots', rank }))
}

const bamboos = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'bamboo', rank }))
}

const buildNonFlowerWall = (length: number): Tile[] => {
  const pool = [
    ...chars(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...dots(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...bamboos(1, 2, 3, 4, 5, 6, 7, 8, 9)
  ]

  return Array.from({ length }, (_, index) => pool[index % pool.length]!)
}

describe('round flow flower replacement', () => {
  it('reveals a flower and replaces it from the tail during hand setup', () => {
    const result = drawHandToTarget({
      concealedTiles: [],
      flowers: [],
      wall: [
        flower('spring'),
        ...chars(1, 2, 3, 4, 5),
        { suit: 'dragons', rank: 'red' }
      ],
      targetTileCount: 1
    })

    expect(result.flowers).toEqual([flower('spring')])
    expect(result.concealedTiles).toEqual([{ suit: 'dragons', rank: 'red' }])
  })

  it('keeps replacing flowers until a non-flower tile is drawn from the tail', () => {
    const result = drawHandToTarget({
      concealedTiles: [],
      flowers: [],
      wall: [
        flower('spring'),
        ...chars(1, 2, 3),
        { suit: 'dragons', rank: 'green' },
        flower('autumn'),
        flower('summer')
      ],
      targetTileCount: 1
    })

    expect(result.flowers).toEqual([flower('spring'), flower('summer'), flower('autumn')])
    expect(result.concealedTiles).toEqual([{ suit: 'dragons', rank: 'green' }])
  })

  it('uses the same flower replacement pipeline during a normal draw', () => {
    const round = createBaselineRound({
      wall: [
        ...buildNonFlowerWall(65),
        flower('winter'),
        ...buildNonFlowerWall(20),
        { suit: 'dragons', rank: 'white' }
      ]
    })

    const eastDiscard = round.players.east.concealedTiles[0]!
    const waitingForClaims = discardTile(round, {
      seat: 'east',
      tile: eastDiscard
    })
    const southDrawTurn = resolveClaimWindow(waitingForClaims, [])
    const afterDraw = drawForCurrentSeat(southDrawTurn)

    expect(afterDraw.currentSeat).toBe('south')
    expect(afterDraw.phase).toBe('discard')
    expect(afterDraw.players.south.flowers).toEqual([flower('winter')])
    expect(afterDraw.players.south.concealedTiles).toHaveLength(17)
    expect(afterDraw.players.south.concealedTiles.at(-1)).toEqual({ suit: 'dragons', rank: 'white' })
  })
})
