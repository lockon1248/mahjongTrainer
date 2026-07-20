import type { Seat } from '@/core/types/seat'
import type { Tile } from '@/core/types/tile'

export type DiscardPoolBySeat = Record<Seat, Tile[]>

export type TableState = {
  dealerSeat: Seat
  dealerContinuationCount: number
  prevailingWind: Seat
  wall: Tile[]
  discards: DiscardPoolBySeat
  discardSequence: Tile[]
}

export const createInitialTableState = (input?: {
  dealerSeat?: Seat
  dealerContinuationCount?: number
  prevailingWind?: Seat
}): TableState => {
  return {
    dealerSeat: input?.dealerSeat ?? 'east',
    dealerContinuationCount: input?.dealerContinuationCount ?? 0,
    prevailingWind: input?.prevailingWind ?? 'east',
    wall: [],
    discards: createEmptyDiscards(),
    discardSequence: []
  }
}

const createEmptyDiscards = (): DiscardPoolBySeat => {
  return {
    east: [],
    south: [],
    west: [],
    north: []
  }
}
