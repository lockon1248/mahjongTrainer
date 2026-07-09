import type { Seat } from './seat'

export type RoundResultType = 'win' | 'draw'

export type RoundResult = {
  type: RoundResultType
  winnerSeat: Seat | null
  discarderSeat: Seat | null
  totalTai: number | null
  scoringItems: string[]
}
