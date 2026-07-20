import type { RuleConfigState } from '@/core/config'
import type { Meld } from '@/core/types/player'
import type { Seat } from '@/core/types/seat'
import type { Tile } from '@/core/types/tile'

export type BreakdownGroupKind = 'sequence' | 'triplet' | 'quad' | 'pair'
export type BreakdownGroupSource = 'concealed' | 'meld'
export type SettlementType = 'self-draw' | 'discard-win'
export type SupportedPatternId =
  | 'dealer-win'
  | 'dealer-continuation'
  | 'self-draw'
  | 'heaven-win'
  | 'big-three-dragons'
  | 'little-three-dragons'
  | 'seat-flower'
  | 'any-flower'
  | 'any-wind-triplet'
  | 'concealed-hand'
  | 'concealed-self-draw'
  | 'full-flush'
  | 'concealed-kong-bonus'

export type BreakdownGroup = {
  kind: BreakdownGroupKind
  source: BreakdownGroupSource
  tiles: Tile[]
}

export type StandardHandBreakdown = {
  meldGroups: BreakdownGroup[]
  pairGroup: BreakdownGroup | null
}

export type StandardWinInput = {
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  winningTile: Tile | null
  winningSeat?: Seat | null
  discarderSeat?: Seat | null
  winContext?: {
    isHeavenWin?: boolean
    dealerSeat?: Seat
    dealerContinuationCount?: number
  }
}

export type ScoringPatternResult = SupportedPatternId

export type ScoringItem = {
  patternId: SupportedPatternId
  label: string
  tai: number
  reason: string
}

export type PaymentResponsibility = {
  type: SettlementType | 'winner-only'
  payerSeats: Seat[]
}

export type SettlementResult = {
  winnerSeat: Seat | null
  discarderSeat: Seat | null
  paymentResponsibility: PaymentResponsibility | null
  scoringItems: ScoringItem[]
  totalTai: number | null
  minimumTai?: RuleConfigState<number> | null
}

export type WinningEvaluationResult = {
  isWinning: boolean
  breakdown: StandardHandBreakdown | null
  matchedPatterns: ScoringPatternResult[]
  totalTai: number | null
  settlement: SettlementResult | null
}
