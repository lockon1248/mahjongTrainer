import type { Seat } from '@/core/types/seat'
import type { Tile } from '@/core/types/tile'

export type DiscardPoolBySeat = Record<Seat, Tile[]>

export type TableState = {
  dealerSeat: Seat
  prevailingWind: Seat
  wall: Tile[]
  discards: DiscardPoolBySeat
}

export function createInitialTableState(): TableState {
  return {
    dealerSeat: 'east',
    prevailingWind: 'east',
    wall: [],
    discards: createEmptyDiscards()
  }
}

function createEmptyDiscards(): DiscardPoolBySeat {
  return {
    east: [],
    south: [],
    west: [],
    north: []
  }
}
