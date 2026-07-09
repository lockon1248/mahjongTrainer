import type { RoundOutcome, RoundPhase } from '@/core'
import type { Seat } from '@/core'

export type GameTablePlayerViewModel = {
  seat: Seat
  concealedCount: number
  flowerCount: number
  meldCount: number
  score: number
  declaredReady: boolean
}

export type GameTableSnapshotViewModel = {
  currentSeat: Seat
  phase: RoundPhase
  outcome: RoundOutcome['status']
  dealerSeat: Seat
  prevailingWind: Seat
  wallCount: number
  totalDiscards: number
  players: GameTablePlayerViewModel[]
}
