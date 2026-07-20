import { createBaselineRuleConfig, getScoringRuleConfig, type MahjongRuleConfig } from '@/core/config'
import type { Meld } from '@/core/types/player'
import type { DragonTileRank, FlowerTileRank, WindTileRank } from '@/core/types/tile'
import type { ScoringPatternResult, StandardHandBreakdown, StandardWinInput } from '@/core/scoring/types'

export const evaluateScoringPatterns = (
  input: StandardWinInput,
  breakdown: StandardHandBreakdown | null,
  ruleConfig?: MahjongRuleConfig
): ScoringPatternResult[] => {
  if (breakdown === null) {
    return []
  }

  const patterns: ScoringPatternResult[] = []
  const scoringRuleConfig = getScoringRuleConfig(ruleConfig ?? createBaselineRuleConfig())

  if (input.winningSeat === (input.winContext?.dealerSeat ?? 'east')) {
    patterns.push('dealer-win')
  }

  if (input.winningSeat && input.discarderSeat == null) {
    patterns.push('self-draw')
  }

  if (isConcealedHand(input)) {
    patterns.push('concealed-hand')
  }

  if (isConcealedSelfDraw(input)) {
    removePattern(patterns, 'concealed-hand')
    removePattern(patterns, 'self-draw')
    patterns.push('concealed-self-draw')
  }

  if (
    scoringRuleConfig.specialHands.heavenWin.status === 'configured'
    && scoringRuleConfig.specialHands.heavenWin.value
    && input.winContext?.isHeavenWin === true
  ) {
    patterns.push('heaven-win')
  }

  if (
    scoringRuleConfig.specialHands.bigThreeDragons.status === 'configured'
    && scoringRuleConfig.specialHands.bigThreeDragons.value
    && hasBigThreeDragons(breakdown)
  ) {
    patterns.push('big-three-dragons')
  }

  if (
    scoringRuleConfig.specialHands.littleThreeDragons.status === 'configured'
    && scoringRuleConfig.specialHands.littleThreeDragons.value
    && hasLittleThreeDragons(breakdown)
  ) {
    patterns.push('little-three-dragons')
  }

  if (isFullFlush(input, breakdown)) {
    patterns.push('full-flush')
  }

  if (scoringRuleConfig.scoringProfile === 'classic-taiwan') {
    patterns.push(...getSeatFlowerPatterns(input))
  }

  if (scoringRuleConfig.scoringProfile === 'flower-wind-bonus') {
    patterns.push(...input.flowers.map(() => 'any-flower' as const))
    patterns.push(...getAnyWindTripletPatterns(breakdown))
    patterns.push(...getConcealedKongBonusPatterns(input.melds))
  }

  return patterns
}

const DRAGON_RANKS: DragonTileRank[] = ['red', 'green', 'white']
const SEAT_FLOWER_MAP: Record<WindTileRank, FlowerTileRank[]> = {
  east: ['spring', 'plum'],
  south: ['summer', 'orchid'],
  west: ['autumn', 'bamboo'],
  north: ['winter', 'chrysanthemum']
}

const getDragonTripletRanks = (breakdown: StandardHandBreakdown): DragonTileRank[] => {
  return breakdown.meldGroups.flatMap((group) => {
    const [firstTile] = group.tiles

    if (
      firstTile?.suit === 'dragons'
      && (group.kind === 'triplet' || group.kind === 'quad')
      && group.tiles.every(tile => tile.suit === 'dragons' && tile.rank === firstTile.rank)
    ) {
      return [firstTile.rank]
    }

    return []
  })
}

const hasBigThreeDragons = (breakdown: StandardHandBreakdown): boolean => {
  const tripletRanks = new Set(getDragonTripletRanks(breakdown))

  return DRAGON_RANKS.every(rank => tripletRanks.has(rank))
}

const hasLittleThreeDragons = (breakdown: StandardHandBreakdown): boolean => {
  const tripletRanks = new Set(getDragonTripletRanks(breakdown))
  const pairRank = breakdown.pairGroup?.tiles[0]?.suit === 'dragons'
    ? breakdown.pairGroup.tiles[0].rank
    : null

  return tripletRanks.size === 2
    && pairRank != null
    && !tripletRanks.has(pairRank)
    && DRAGON_RANKS.every(rank => tripletRanks.has(rank) || rank === pairRank)
}

const getSeatFlowerPatterns = (input: StandardWinInput): ScoringPatternResult[] => {
  if (!input.winningSeat)
    return []

  const validRanks = new Set(SEAT_FLOWER_MAP[input.winningSeat])

  return input.flowers.flatMap((tile) => {
    if (tile.suit === 'flower' && validRanks.has(tile.rank))
      return ['seat-flower']

    return []
  })
}

const getAnyWindTripletPatterns = (breakdown: StandardHandBreakdown): ScoringPatternResult[] => {
  return breakdown.meldGroups.flatMap((group) => {
    const [firstTile] = group.tiles

    if (
      firstTile?.suit === 'winds'
      && (group.kind === 'triplet' || group.kind === 'quad')
      && group.tiles.every(tile => tile.suit === 'winds' && tile.rank === firstTile.rank)
    ) {
      return ['any-wind-triplet']
    }

    return []
  })
}

const isConcealedHand = (input: StandardWinInput): boolean => {
  return input.melds.every(meld => meld.type === 'kan-concealed')
}

const isConcealedSelfDraw = (input: StandardWinInput): boolean => {
  return isConcealedHand(input) && input.winningSeat != null && input.discarderSeat == null
}

const isFullFlush = (input: StandardWinInput, breakdown: StandardHandBreakdown): boolean => {
  const tiles = [
    ...input.concealedTiles,
    ...input.melds.flatMap(meld => meld.tiles),
    ...(input.winningTile ? [input.winningTile] : [])
  ]

  const numberSuits = new Set(
    tiles
      .filter(tile => tile.suit === 'characters' || tile.suit === 'dots' || tile.suit === 'bamboo')
      .map(tile => tile.suit)
  )
  const hasHonorTiles = tiles.some(tile => tile.suit === 'winds' || tile.suit === 'dragons')

  return !hasHonorTiles
    && numberSuits.size === 1
    && breakdown.meldGroups.length === 5
}

const getConcealedKongBonusPatterns = (melds: Meld[]): ScoringPatternResult[] => {
  return melds.flatMap((meld) => {
    if (meld.type === 'kan-concealed')
      return ['concealed-kong-bonus']

    return []
  })
}

const removePattern = (patterns: ScoringPatternResult[], target: ScoringPatternResult): void => {
  const index = patterns.indexOf(target)

  if (index !== -1)
    patterns.splice(index, 1)
}
