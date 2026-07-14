import { FLOWER_TILE_RANKS, type DragonTileRank, type NumberTileSuit, type Tile, type WindTileRank } from '@/core/types/tile'

const NUMBER_TILE_SUITS: NumberTileSuit[] = ['characters', 'dots', 'bamboo']
const NUMBER_TILE_RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
const WIND_TILE_RANKS: WindTileRank[] = ['east', 'south', 'west', 'north']
const DRAGON_TILE_RANKS: DragonTileRank[] = ['red', 'green', 'white']

export const createBaselineWall = (random: () => number = Math.random): Tile[] => {
  const tiles: Tile[] = []

  for (const suit of NUMBER_TILE_SUITS) {
    for (let copyIndex = 0; copyIndex < 4; copyIndex += 1) {
      for (const rank of NUMBER_TILE_RANKS) {
        tiles.push({ suit, rank })
      }
    }
  }

  for (const rank of WIND_TILE_RANKS) {
    for (let copyIndex = 0; copyIndex < 4; copyIndex += 1) {
      tiles.push({ suit: 'winds', rank })
    }
  }

  for (const rank of DRAGON_TILE_RANKS) {
    for (let copyIndex = 0; copyIndex < 4; copyIndex += 1) {
      tiles.push({ suit: 'dragons', rank })
    }
  }

  for (const rank of FLOWER_TILE_RANKS) {
    tiles.push({ suit: 'flower', rank })
  }

  for (let index = tiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const currentTile = tiles[index]!
    tiles[index] = tiles[swapIndex]!
    tiles[swapIndex] = currentTile
  }

  return tiles
}
