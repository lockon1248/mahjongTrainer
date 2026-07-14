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

  const matchedPatterns = evaluateScoringPatterns(input, breakdown, ruleConfig)
  const settlement = buildSettlementResult(input, matchedPatterns, ruleConfig)
  const totalTai = matchedPatterns.reduce((total, patternId) => {
    return total + (patternId === 'dealer-win' || patternId === 'self-draw' ? 1 : 0)
  }, 0)

  return {
    isWinning: settlement != null,
    breakdown,
    matchedPatterns,
    totalTai,
    settlement
  }
}
