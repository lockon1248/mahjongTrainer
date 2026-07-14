import { createBaselineRuleConfig, getScoringRuleConfig, type MahjongRuleConfig } from '@/core/config'
import type { DragonTileRank } from '@/core/types/tile'
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

  if (input.winningSeat === 'east') {
    patterns.push('dealer-win')
  }

  if (input.winningSeat && input.discarderSeat == null) {
    patterns.push('self-draw')
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

  return patterns
}

const DRAGON_RANKS: DragonTileRank[] = ['red', 'green', 'white']

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
