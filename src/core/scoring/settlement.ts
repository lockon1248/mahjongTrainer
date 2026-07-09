import { ALL_SEATS } from '@/core/types/seat'
import type { ScoringPatternResult, SettlementResult, StandardWinInput } from '@/core/scoring/types'

const PATTERN_TAI: Record<ScoringPatternResult, number> = {
  'dealer-win': 1,
  'self-draw': 1
}

export function buildSettlementResult(
  input: StandardWinInput,
  matchedPatterns: ScoringPatternResult[] = []
): SettlementResult | null {
  if (!input.winningSeat) {
    return null
  }

  const isSelfDraw = input.discarderSeat == null
  const totalTai = matchedPatterns.reduce((total, patternId) => total + PATTERN_TAI[patternId], 0)

  return {
    winnerSeat: input.winningSeat,
    discarderSeat: input.discarderSeat ?? null,
    paymentResponsibility: isSelfDraw
      ? {
          type: 'self-draw',
          payerSeats: ALL_SEATS.filter((seat) => seat !== input.winningSeat)
        }
      : {
          type: 'discard-win',
          payerSeats: input.discarderSeat ? [input.discarderSeat] : []
        },
    scoringItems: matchedPatterns,
    totalTai
  }
}
