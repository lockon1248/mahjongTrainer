import type { Seat } from '@/core/types/seat'
import type { Tile } from '@/core/types/tile'

export const ACTION_TYPES = [
  'draw',
  'discard',
  'chi',
  'pon',
  'kan-exposed',
  'kan-concealed',
  'kan-added',
  'win',
  'pass'
] as const

export type ActionType = (typeof ACTION_TYPES)[number]

export type PendingActionClaim = {
  seat: Seat
  actionType: ActionType
  tile: Tile | null
  consumedTiles?: Tile[]
}

export type PendingActionWindow = {
  triggeringSeat: Seat | null
  triggeringTile: Tile | null
  highestPriorityAction: ActionType | null
  claims: PendingActionClaim[]
}

export const createPendingActionWindow = (): PendingActionWindow => {
  return {
    triggeringSeat: null,
    triggeringTile: null,
    highestPriorityAction: null,
    claims: []
  }
}
