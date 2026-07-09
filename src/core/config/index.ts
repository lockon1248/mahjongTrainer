import type {
  MahjongRuleConfig,
  MahjongRuleConfigOverride,
  RoundFlowRuleConfig,
  RuleConfigMergeResult,
  ScoringRuleConfig
} from '@/core/config/types'

const TOP_LEVEL_KEYS = new Set(['claimPriorityOrder', 'flowerReplacementMode', 'settlement', 'postDraw', 'specialHands'])
const SETTLEMENT_KEYS = new Set(['selfDrawPaymentMode', 'discardWinPaymentMode', 'minimumTai'])
const POST_DRAW_KEYS = new Set(['dealerContinuation', 'readyHandCheck', 'readyHandPayment'])
const SPECIAL_HAND_KEYS = new Set(['heavenWin', 'earthWin', 'qiangGang'])

export * from '@/core/config/types'

export const createBaselineRuleConfig = (): MahjongRuleConfig => {
  return {
    claimPriorityOrder: ['win', 'kan-exposed', 'pon', 'chi'],
    flowerReplacementMode: 'tail-replacement',
    settlement: {
      selfDrawPaymentMode: 'all-other-players',
      discardWinPaymentMode: 'discarder-only',
      minimumTai: {
        status: 'unresolved'
      }
    },
    postDraw: {
      dealerContinuation: {
        status: 'unresolved'
      },
      readyHandCheck: {
        status: 'unresolved'
      },
      readyHandPayment: {
        status: 'unresolved'
      }
    },
    specialHands: {
      heavenWin: {
        status: 'unresolved'
      },
      earthWin: {
        status: 'unresolved'
      },
      qiangGang: {
        status: 'unresolved'
      }
    }
  }
}

export const mergeRuleConfig = (
  baseConfig: MahjongRuleConfig,
  overrides: MahjongRuleConfigOverride
): RuleConfigMergeResult => {
  const topLevelError = findUnknownKey(overrides as Record<string, unknown>, TOP_LEVEL_KEYS)

  if (topLevelError)
    return topLevelError

  if (overrides.settlement) {
    const settlementError = findUnknownKey(overrides.settlement as Record<string, unknown>, SETTLEMENT_KEYS)
    if (settlementError)
      return settlementError
  }

  if (overrides.postDraw) {
    const postDrawError = findUnknownKey(overrides.postDraw as Record<string, unknown>, POST_DRAW_KEYS)
    if (postDrawError)
      return postDrawError
  }

  if (overrides.specialHands) {
    const specialHandsError = findUnknownKey(overrides.specialHands as Record<string, unknown>, SPECIAL_HAND_KEYS)
    if (specialHandsError)
      return specialHandsError
  }

  return {
    ok: true,
    config: {
      ...baseConfig,
      claimPriorityOrder: overrides.claimPriorityOrder ?? baseConfig.claimPriorityOrder,
      flowerReplacementMode: overrides.flowerReplacementMode ?? baseConfig.flowerReplacementMode,
      settlement: {
        ...baseConfig.settlement,
        ...overrides.settlement
      },
      postDraw: {
        ...baseConfig.postDraw,
        ...overrides.postDraw
      },
      specialHands: {
        ...baseConfig.specialHands,
        ...overrides.specialHands
      }
    }
  }
}

export const getRoundFlowRuleConfig = (config: MahjongRuleConfig): RoundFlowRuleConfig => {
  return {
    claimPriorityOrder: config.claimPriorityOrder,
    flowerReplacementMode: config.flowerReplacementMode,
    postDraw: config.postDraw
  }
}

export const getScoringRuleConfig = (config: MahjongRuleConfig): ScoringRuleConfig => {
  return config.settlement
}

const findUnknownKey = (
  record: Record<string, unknown>,
  allowedKeys: Set<string>
): RuleConfigMergeResult | null => {
  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) {
      return {
        ok: false,
        error: `Unknown rule config key: ${key}`
      }
    }
  }

  return null
}
