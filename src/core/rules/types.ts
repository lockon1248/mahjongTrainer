import type { PendingActionWindow } from '@/core/types/action'
import type { PlayerState } from '@/core/types/player'
import type { RoundResult } from '@/core/types/result'
import type { Seat } from '@/core/types/seat'
import type { TableState } from '@/core/types/table'
import type { Tile } from '@/core/types/tile'

export type PlayersBySeat = Record<Seat, PlayerState>

export type RoundPhase = 'draw' | 'discard' | 'claim-window' | 'ended'

export type ClaimResolutionType = 'win' | 'kan-exposed' | 'pon' | 'chi' | 'pass'

export type ClaimResolution = {
  type: ClaimResolutionType
  seat: Seat | null
  tile: Tile | null
}

export type RoundOutcome =
  | { status: 'in-progress' }
  | { status: 'win'; result: RoundResult }
  | { status: 'draw'; result: RoundResult }

export type BaselineRoundState = {
  table: TableState
  players: PlayersBySeat
  currentSeat: Seat
  phase: RoundPhase
  pendingActionWindow: PendingActionWindow | null
  outcome: RoundOutcome
  lastClaimResolution: ClaimResolution | null
}

export type DrawHandInput = {
  concealedTiles: Tile[]
  flowers: Tile[]
  wall: Tile[]
  targetTileCount: number
}

export type DrawHandResult = {
  concealedTiles: Tile[]
  flowers: Tile[]
  wall: Tile[]
}
