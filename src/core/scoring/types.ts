import type { Meld } from '@/core/types/player'
import type { Seat } from '@/core/types/seat'
import type { Tile } from '@/core/types/tile'

export type BreakdownGroupKind = 'sequence' | 'triplet' | 'quad' | 'pair'
export type BreakdownGroupSource = 'concealed' | 'meld'
export type SettlementType = 'self-draw' | 'discard-win'
export type SupportedPatternId = 'dealer-win' | 'self-draw'

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
}

export type ScoringPatternResult = SupportedPatternId

export type PaymentResponsibility = {
  type: SettlementType
  payerSeats: Seat[]
}

export type SettlementResult = {
  winnerSeat: Seat | null
  discarderSeat: Seat | null
  paymentResponsibility: PaymentResponsibility | null
  scoringItems: string[]
  totalTai: number | null
}

export type WinningEvaluationResult = {
  isWinning: boolean
  breakdown: StandardHandBreakdown | null
  matchedPatterns: ScoringPatternResult[]
  totalTai: number | null
  settlement: SettlementResult | null
}
