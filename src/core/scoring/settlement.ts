import { createBaselineRuleConfig, getScoringRuleConfig, type MahjongRuleConfig } from '@/core/config'
import { createScoringItem } from '@/core/scoring/catalog'
import { ALL_SEATS } from '@/core/types/seat'
import type { ScoringPatternResult, SettlementResult, StandardWinInput } from '@/core/scoring/types'

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
  const scoringItems = matchedPatterns.map(createScoringItem)
  const totalTai = scoringItems.reduce((total, item) => total + item.tai, 0)

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
    scoringItems,
    totalTai,
    minimumTai: scoringRuleConfig.settlement.minimumTai
  }
}
