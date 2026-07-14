import { createBaselineRuleConfig, getScoringRuleConfig, type MahjongRuleConfig } from '@/core/config'
import { ALL_SEATS } from '@/core/types/seat'
import type { ScoringPatternResult, SettlementResult, StandardWinInput } from '@/core/scoring/types'

const PATTERN_TAI: Record<ScoringPatternResult, number> = {
  'dealer-win': 1,
  'self-draw': 1,
  'heaven-win': 24,
  'big-three-dragons': 8,
  'little-three-dragons': 4
}

export const buildSettlementResult = (
  input: StandardWinInput,
  matchedPatterns: ScoringPatternResult[] = [],
  ruleConfig?: MahjongRuleConfig
): SettlementResult | null => {
  if (!input.winningSeat) {
    return null
  }

  const scoringRuleConfig = getScoringRuleConfig(ruleConfig ?? createBaselineRuleConfig())
  const isSelfDraw = input.discarderSeat == null
  const totalTai = matchedPatterns.reduce((total, patternId) => total + PATTERN_TAI[patternId], 0)

  if (
    scoringRuleConfig.settlement.minimumTai.status === 'configured'
    && totalTai < scoringRuleConfig.settlement.minimumTai.value
  ) {
    return null
  }

  return {
    winnerSeat: input.winningSeat,
    discarderSeat: input.discarderSeat ?? null,
    paymentResponsibility: isSelfDraw
      ? scoringRuleConfig.settlement.selfDrawPaymentMode === 'winner-only'
        ? {
            type: 'winner-only',
            payerSeats: [input.winningSeat]
          }
        : {
            type: 'self-draw',
            payerSeats: ALL_SEATS.filter((seat) => seat !== input.winningSeat)
          }
      : {
          type: 'discard-win',
          payerSeats: input.discarderSeat ? [input.discarderSeat] : []
    },
    scoringItems: matchedPatterns,
    totalTai,
    minimumTai: scoringRuleConfig.settlement.minimumTai
  }
}
