import type { Seat } from './seat'
import type { Tile } from './tile'

export type MeldType = 'chi' | 'pon' | 'kan-concealed' | 'kan-exposed' | 'kan-added'

export type Meld = {
  type: MeldType
  tiles: Tile[]
  claimedTile: Tile | null
  claimedFromSeat: Seat | null
}

export type PlayerState = {
  seat: Seat
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  score: number
  declaredReady: boolean
}

export function createEmptyPlayerState(seat: Seat): PlayerState {
  return {
    seat,
    concealedTiles: [],
    melds: [],
    flowers: [],
    score: 0,
    declaredReady: false
  }
}
