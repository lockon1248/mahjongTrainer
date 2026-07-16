import type { DragonTileRank, FlowerTileRank, Tile, WindTileRank } from '@/core'

export const NUMBER_TILE_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'] as const

export const TILE_SUIT_ORDER = ['characters', 'dots', 'bamboo', 'winds', 'dragons', 'flower'] as const

export const WIND_TILE_ORDER: readonly WindTileRank[] = ['east', 'south', 'west', 'north']
export const DRAGON_TILE_ORDER: readonly DragonTileRank[] = ['red', 'green', 'white']
export const FLOWER_TILE_ORDER: readonly FlowerTileRank[] = ['spring', 'summer', 'autumn', 'winter', 'plum', 'orchid', 'bamboo', 'chrysanthemum']

export const WIND_TILE_LABELS: Record<WindTileRank, string> = {
  east: '東風',
  south: '南風',
  west: '西風',
  north: '北風'
}

export const DRAGON_TILE_LABELS: Record<DragonTileRank, string> = {
  red: '紅中',
  green: '青發',
  white: '白板'
}

export const FLOWER_TILE_LABELS: Record<FlowerTileRank, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
  plum: '梅',
  orchid: '蘭',
  bamboo: '竹',
  chrysanthemum: '菊'
}

export const formatTileLabel = (tile: Tile): string => {
  switch (tile.suit) {
    case 'characters':
      return `${NUMBER_TILE_LABELS[tile.rank - 1]}萬`
    case 'dots':
      return `${NUMBER_TILE_LABELS[tile.rank - 1]}筒`
    case 'bamboo':
      return `${NUMBER_TILE_LABELS[tile.rank - 1]}條`
    case 'winds':
      return WIND_TILE_LABELS[tile.rank]
    case 'dragons':
      return DRAGON_TILE_LABELS[tile.rank]
    case 'flower':
      return FLOWER_TILE_LABELS[tile.rank]
  }
}
