import type { ClaimResolution, RoundOutcome, RoundPhase, Seat, Tile } from '@/core'

export type GameTablePlayerViewModel = {
  seat: Seat
  concealedCount: number
  concealedTiles: Tile[]
  flowerCount: number
  meldCount: number
  discardCount: number
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
  scoringItems: string[]
}
