import { describe, expect, it } from 'vitest'
import {
  createBaselineRuleConfig,
  getRoundFlowRuleConfig,
  getScoringRuleConfig,
  mergeRuleConfig
} from '@/core/index'

describe('rule config core', () => {
  it('builds a baseline default config from a single source of truth', () => {
    expect(createBaselineRuleConfig()).toEqual({
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
    })
  })

  it('merges supported override keys while preserving unrelated defaults', () => {
    const result = mergeRuleConfig(createBaselineRuleConfig(), {
      claimPriorityOrder: ['chi', 'pon', 'kan-exposed', 'win'],
      settlement: {
        minimumTai: {
          status: 'configured',
          value: 2
        }
      }
    })

    expect(result).toEqual({
      ok: true,
      config: {
        claimPriorityOrder: ['chi', 'pon', 'kan-exposed', 'win'],
        flowerReplacementMode: 'tail-replacement',
        settlement: {
          selfDrawPaymentMode: 'all-other-players',
          discardWinPaymentMode: 'discarder-only',
          minimumTai: {
            status: 'configured',
            value: 2
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
    })
  })

  it('rejects unknown override keys instead of silently ignoring them', () => {
    const result = mergeRuleConfig(createBaselineRuleConfig(), {
      invalidRuleKey: true
    } as never)

    expect(result).toEqual({
      ok: false,
      error: "Unknown rule config key: invalidRuleKey"
    })
  })

  it('provides stable round flow and scoring config slices from the same root config', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      claimPriorityOrder: ['chi', 'pon', 'kan-exposed', 'win'],
      settlement: {
        minimumTai: {
          status: 'configured',
          value: 3
        }
      },
      postDraw: {
        dealerContinuation: {
          status: 'configured',
          value: false
        }
      }
    })

    if (!merged.ok)
      throw new Error(merged.error)

    expect(getRoundFlowRuleConfig(merged.config)).toEqual({
      claimPriorityOrder: ['chi', 'pon', 'kan-exposed', 'win'],
      flowerReplacementMode: 'tail-replacement',
      postDraw: {
        dealerContinuation: {
          status: 'configured',
          value: false
        },
        readyHandCheck: {
          status: 'unresolved'
        },
        readyHandPayment: {
          status: 'unresolved'
        }
      }
    })

    expect(getScoringRuleConfig(merged.config)).toEqual({
      selfDrawPaymentMode: 'all-other-players',
      discardWinPaymentMode: 'discarder-only',
      minimumTai: {
        status: 'configured',
        value: 3
      }
    })
  })
})
