import { decomposeStandardHand } from '@/core/scoring/decomposition'
import { evaluateScoringPatterns } from '@/core/scoring/patterns'
import { buildSettlementResult } from '@/core/scoring/settlement'
import type { StandardWinInput, WinningEvaluationResult } from '@/core/scoring/types'

export function validateStandardWin(input: StandardWinInput): WinningEvaluationResult {
  const breakdown = decomposeStandardHand(input)

  if (breakdown === null) {
    return {
      isWinning: false,
      breakdown: null,
      matchedPatterns: [],
      totalTai: null,
      settlement: null
    }
  }

  const matchedPatterns = evaluateScoringPatterns(input, breakdown)
  const settlement = buildSettlementResult(input, matchedPatterns)

  return {
    isWinning: true,
    breakdown,
    matchedPatterns,
    totalTai: settlement?.totalTai ?? 0,
    settlement
  }
}
