import type { MahjongRuleConfig } from '@/core/config'
import { decomposeStandardHand } from '@/core/scoring/decomposition'
import { evaluateScoringPatterns } from '@/core/scoring/patterns'
import { buildSettlementResult } from '@/core/scoring/settlement'
import type { StandardWinInput, WinningEvaluationResult } from '@/core/scoring/types'

export const validateStandardWin = (input: StandardWinInput, ruleConfig?: MahjongRuleConfig): WinningEvaluationResult => {
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
  const settlement = buildSettlementResult(input, matchedPatterns, ruleConfig)

  return {
    isWinning: true,
    breakdown,
    matchedPatterns,
    totalTai: settlement?.totalTai ?? 0,
    settlement
  }
}
