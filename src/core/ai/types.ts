import type { MahjongRuleConfig } from '@/core/config'
import type { BaselineRoundState } from '@/core/rules/types'
import type { HumanSelfTurnCandidate } from '@/core/rules/types'
import type { PendingActionClaim } from '@/core/types/action'
import type { Meld } from '@/core/types/player'
import type { Seat } from '@/core/types/seat'
import type { Tile } from '@/core/types/tile'

export type AiDecisionReasoning = {
  heuristic: 'discard' | 'claim'
  score: number
  ignoredUnresolvedRules: string[]
}

export type AiDecisionContext = {
  seat: Seat
  phase: BaselineRoundState['phase']
  currentSeat: Seat
  triggeringTile: Tile | null
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  legalDiscards: Tile[]
  legalClaims: AiClaimCandidate[]
  ruleConfig: BaselineRoundState['ruleConfig']
}

export type AiClaimCandidate = {
  actionType: 'win' | 'kan-exposed' | 'pon' | 'chi' | 'pass'
  tile: Tile | null
  consumedTiles?: Tile[]
}

export type CreateAiDecisionContextInput = {
  seat: Seat
  legalClaims?: AiClaimCandidate[]
}

export type AiDiscardDecisionInput = {
  seat: Seat
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  ruleConfig: MahjongRuleConfig
}

export type AiClaimDecisionInput = {
  seat: Seat
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  triggeringTile: Tile | null
  candidates: AiClaimCandidate[]
  ruleConfig: MahjongRuleConfig
}

export type AiDiscardDecision = {
  actionType: 'discard'
  tile: Tile
  reasoning: AiDecisionReasoning
}

export type AiClaimDecision = {
  actionType: AiClaimCandidate['actionType']
  tile: Tile | null
  consumedTiles?: Tile[]
  reasoning: AiDecisionReasoning
}

export type AiSelfTurnDecisionInput = {
  seat: Seat
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  candidates: HumanSelfTurnCandidate[]
  ruleConfig: MahjongRuleConfig
}

export type AiSelfTurnDecision = {
  actionType: HumanSelfTurnCandidate['actionType']
  tile: Tile | null
  consumedTiles: Tile[]
  meldTile: Tile | null
  reasoning: AiDecisionReasoning
}

export type AiClaimScoreSummary = PendingActionClaim
