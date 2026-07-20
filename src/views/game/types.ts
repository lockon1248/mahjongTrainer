import type { ClaimResolution, MeldType, RoundOutcome, RoundPhase, ScoringItem, Seat, Tile } from '@/core'

export type GameTableRelativePosition = 'bottom' | 'right' | 'top' | 'left'

export type GameTableMeldViewModel = {
  type: MeldType
  labels: string[]
  isMasked?: boolean
}

export type MatchVictoryMode = 'bankruptcy' | 'four-winds'

export type GameTableMatchSummaryViewModel = {
  initialChips: number
  victoryMode: MatchVictoryMode
  baseStake: number
  taiValue: number
  status: 'in-progress' | 'ended'
  winnerSeat: Seat | null
}

export type GameTablePlayerViewModel = {
  seat: Seat
  relativePosition: GameTableRelativePosition
  concealedCount: number
  concealedTiles: Tile[]
  revealedWinningTiles?: Tile[]
  flowerCount: number
  meldCount: number
  melds: GameTableMeldViewModel[]
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
  discardSequence: Tile[]
  lastClaimResolution: ClaimResolution | null
  matchSummary?: GameTableMatchSummaryViewModel | null
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
  chipSettlements: Array<{
    seat: Seat
    delta: number
    chipsAfter: number
  }>
}
