import type { Seat } from '@/core/types/seat'

export type RoundResultType = 'win' | 'draw'
export type DrawReason = 'wall-exhausted'
export type UnresolvedDrawRule =
  | 'dealer-continuation'
  | 'ready-hand-check'
  | 'ready-hand-payment'

export type RoundResult = {
  type: RoundResultType
  winnerSeat: Seat | null
  discarderSeat: Seat | null
  totalTai: number | null
  scoringItems: string[]
  drawReason?: DrawReason | null
  unresolved?: UnresolvedDrawRule[]
}

export const createWinRoundResult = (input: {
  winnerSeat: Seat
  discarderSeat: Seat | null
  totalTai?: number | null
  scoringItems?: string[]
}): RoundResult => {
  return {
    type: 'win',
    winnerSeat: input.winnerSeat,
    discarderSeat: input.discarderSeat,
    totalTai: input.totalTai ?? null,
    scoringItems: input.scoringItems ?? [],
    drawReason: null,
    unresolved: []
  }
}

export const createDrawRoundResult = (input?: {
  unresolved?: UnresolvedDrawRule[]
}): RoundResult => {
  return {
    type: 'draw',
    winnerSeat: null,
    discarderSeat: null,
    totalTai: null,
    scoringItems: [],
    drawReason: 'wall-exhausted',
    unresolved: input?.unresolved ?? ['dealer-continuation', 'ready-hand-check', 'ready-hand-payment']
  }
}
