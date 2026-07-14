import { describe, expect, it } from 'vitest'
import { createBaselineWall, type Tile } from '@/core'

const createCanonicalWall = (): Tile[] => {
  const tiles: Tile[] = []
  const numberSuits = ['characters', 'dots', 'bamboo'] as const
  const numberRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
  const winds = ['east', 'south', 'west', 'north'] as const
  const dragons = ['red', 'green', 'white'] as const
  const flowers = ['plum', 'orchid', 'chrysanthemum', 'bamboo', 'spring', 'summer', 'autumn', 'winter'] as const

  for (const suit of numberSuits) {
    for (let copyIndex = 0; copyIndex < 4; copyIndex += 1) {
      for (const rank of numberRanks)
        tiles.push({ suit, rank })
    }
  }

  for (const rank of winds) {
    for (let copyIndex = 0; copyIndex < 4; copyIndex += 1)
      tiles.push({ suit: 'winds', rank })
  }

  for (const rank of dragons) {
    for (let copyIndex = 0; copyIndex < 4; copyIndex += 1)
      tiles.push({ suit: 'dragons', rank })
  }

  for (const rank of flowers)
    tiles.push({ suit: 'flower', rank })

  return tiles
}

describe('baseline wall', () => {
  it('shuffles wall order instead of returning the canonical sorted sequence', () => {
    const random = (() => {
      let callCount = 0

      return () => {
        callCount += 1
        return ((callCount * 7) % 10) / 10
      }
    })()

    const wall = createBaselineWall(random)
    const canonicalWall = createCanonicalWall()

    expect(wall).toHaveLength(canonicalWall.length)
    expect(wall.slice(0, 20)).not.toEqual(canonicalWall.slice(0, 20))
    expect([...wall].sort((left, right) => `${left.suit}-${left.rank}`.localeCompare(`${right.suit}-${right.rank}`)))
      .toEqual([...canonicalWall].sort((left, right) => `${left.suit}-${left.rank}`.localeCompare(`${right.suit}-${right.rank}`)))
  })
})
