export const FLOWER_TILE_RANKS = [
  'spring',
  'summer',
  'autumn',
  'winter',
  'plum',
  'orchid',
  'bamboo',
  'chrysanthemum'
] as const

export type NumberTileSuit = 'characters' | 'dots' | 'bamboo'
export type WindTileRank = 'east' | 'south' | 'west' | 'north'
export type DragonTileRank = 'red' | 'green' | 'white'
export type FlowerTileRank = (typeof FLOWER_TILE_RANKS)[number]

export type NumberTile = {
  suit: NumberTileSuit
  rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export type WindTile = {
  suit: 'winds'
  rank: WindTileRank
}

export type DragonTile = {
  suit: 'dragons'
  rank: DragonTileRank
}

export type FlowerTile = {
  suit: 'flower'
  rank: FlowerTileRank
}

export type Tile = NumberTile | WindTile | DragonTile | FlowerTile

export const isFlowerTile = (tile: Tile): tile is FlowerTile => {
  return tile.suit === 'flower'
}
