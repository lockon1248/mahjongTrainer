import type { MahjongRuleConfig } from '@/core/config'
import type {
  AiClaimCandidate,
  AiClaimDecision,
  AiClaimDecisionInput,
  AiDecisionReasoning,
  AiDiscardDecision,
  AiDiscardDecisionInput
} from '@/core/ai/types'
import type { Tile } from '@/core/types/tile'

export const chooseAiDiscardDecision = (input: AiDiscardDecisionInput): AiDiscardDecision => {
  const ignoredUnresolvedRules = getIgnoredUnresolvedRules(input.ruleConfig)
  const scoredTiles = input.concealedTiles.map((tile) => ({
    tile,
    score: getTileKeepScore(tile, input.concealedTiles)
  }))
  const selected = [...scoredTiles].sort((left, right) => {
    if (left.score !== right.score)
      return left.score - right.score

    return compareTile(left.tile, right.tile)
  })[0]

  if (!selected)
    throw new Error('AI discard decision requires at least one legal concealed tile')

  return {
    actionType: 'discard',
    tile: selected.tile,
    reasoning: {
      heuristic: 'discard',
      score: selected.score,
      ignoredUnresolvedRules
    }
  }
}

export const chooseAiClaimDecision = (input: AiClaimDecisionInput): AiClaimDecision => {
  if (input.candidates.length === 0)
    throw new Error('AI claim decision requires at least one legal claim candidate')

  const ignoredUnresolvedRules = getIgnoredUnresolvedRules(input.ruleConfig)
  const winningCandidate = input.candidates.find((candidate) => candidate.actionType === 'win')

  if (winningCandidate) {
    return {
      actionType: 'win',
      tile: winningCandidate.tile,
      consumedTiles: winningCandidate.consumedTiles,
      reasoning: {
        heuristic: 'claim',
        score: Number.POSITIVE_INFINITY,
        ignoredUnresolvedRules
      }
    }
  }

  const scoredCandidates = input.candidates.map((candidate) => ({
    candidate,
    score: getClaimScore(candidate, input.concealedTiles)
  }))
  const selected = [...scoredCandidates].sort((left, right) => {
    if (left.score !== right.score)
      return right.score - left.score

    return getClaimTieBreaker(left.candidate) - getClaimTieBreaker(right.candidate)
  })[0]

  if (!selected)
    throw new Error('AI claim decision could not score legal candidates')

  return {
    actionType: selected.candidate.actionType,
    tile: selected.candidate.tile,
    consumedTiles: selected.candidate.consumedTiles,
    reasoning: {
      heuristic: 'claim',
      score: selected.score,
      ignoredUnresolvedRules
    }
  }
}

const getClaimScore = (candidate: AiClaimCandidate, concealedTiles: Tile[]): number => {
  if (candidate.actionType === 'pass')
    return 0

  const consumedTiles = candidate.consumedTiles ?? []
  const penalty = consumedTiles.reduce((total, tile) => total + getTileKeepScore(tile, concealedTiles), 0)

  switch (candidate.actionType) {
    case 'chi':
      return 3 - penalty
    case 'pon':
      return 1 - penalty
    case 'kan-exposed':
      return 0.5 - penalty
    default:
      throw new Error(`Unsupported AI claim action: ${candidate.actionType}`)
  }
}

const getClaimTieBreaker = (candidate: AiClaimCandidate): number => {
  switch (candidate.actionType) {
    case 'chi':
      return 0
    case 'pon':
      return 1
    case 'kan-exposed':
      return 2
    case 'pass':
      return 3
    default:
      return 4
  }
}

const getTileKeepScore = (tile: Tile, concealedTiles: Tile[]): number => {
  const duplicates = concealedTiles.filter((candidate) => isSameTile(candidate, tile)).length - 1

  if (tile.suit === 'winds' || tile.suit === 'dragons' || tile.suit === 'flower')
    return Math.max(duplicates, 0) * 2

  const neighbors = concealedTiles.filter((candidate) => {
    if (candidate === tile)
      return false

    return candidate.suit === tile.suit
      && typeof candidate.rank === 'number'
      && Math.abs(candidate.rank - tile.rank) === 1
  }).length

  const gaps = concealedTiles.filter((candidate) => {
    if (candidate === tile)
      return false

    return candidate.suit === tile.suit
      && typeof candidate.rank === 'number'
      && Math.abs(candidate.rank - tile.rank) === 2
  }).length

  return Math.max(duplicates, 0) * 2 + neighbors + gaps * 0.5
}

const getIgnoredUnresolvedRules = (ruleConfig: MahjongRuleConfig): string[] => {
  const ignored: string[] = []

  if (ruleConfig.specialHands.heavenWin.status === 'unresolved')
    ignored.push('heavenWin')

  if (ruleConfig.specialHands.earthWin.status === 'unresolved')
    ignored.push('earthWin')

  if (ruleConfig.specialHands.qiangGang.status === 'unresolved')
    ignored.push('qiangGang')

  return ignored
}

const compareTile = (left: Tile, right: Tile): number => {
  const suitOrder = ['characters', 'dots', 'bamboo', 'winds', 'dragons', 'flower'] as const
  const suitDelta = suitOrder.indexOf(left.suit) - suitOrder.indexOf(right.suit)

  if (suitDelta !== 0)
    return suitDelta

  return String(left.rank).localeCompare(String(right.rank), 'en')
}

const isSameTile = (left: Tile, right: Tile): boolean => {
  return left.suit === right.suit && left.rank === right.rank
}
