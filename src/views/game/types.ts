import type { ClaimResolution, Meld, RoundOutcome, RoundPhase, ScoringItem, Seat, Tile } from '@/core'

export type GameTableRelativePosition = 'bottom' | 'right' | 'top' | 'left'

export type GameTablePlayerViewModel = {
  seat: Seat
  relativePosition: GameTableRelativePosition
  concealedCount: number
  concealedTiles: Tile[]
  revealedWinningTiles?: Tile[]
  flowerCount: number
  meldCount: number
  melds: Meld[]
  discardCount: number
  discards: Tile[]
  score: number
  declaredReady: boolean
}

export type GameTableSnapshotViewModel = {
  humanSeat: Seat
  currentSeat: Seat
  phase: RoundPhase
  outcome: RoundOutcome['status']
  resultSummary?: GameTableResultSummaryViewModel | null
  dealerSeat: Seat
  prevailingWind: Seat
  wallCount: number
  totalDiscards: number
  lastClaimResolution: ClaimResolution | null
  players: GameTablePlayerViewModel[]
}

export type GameTableResultSummaryViewModel = {
  type: 'win' | 'draw'
  ended: boolean
  winnerSeat: Seat | null
  discarderSeat: Seat | null
  totalTai: number | null
  drawReason: string | null
  scoringItems: ScoringItem[]
}
