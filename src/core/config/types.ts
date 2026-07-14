export type RuleConfigState<T> =
  | {
      status: 'configured'
      value: T
    }
  | {
      status: 'unresolved'
    }

export type ClaimPriorityAction = 'win' | 'kan-exposed' | 'pon' | 'chi'
export type FlowerReplacementMode = 'tail-replacement'
export type SelfDrawPaymentMode = 'all-other-players' | 'winner-only'
export type DiscardWinPaymentMode = 'discarder-only'

export type MahjongRuleConfig = {
  claimPriorityOrder: ClaimPriorityAction[]
  flowerReplacementMode: FlowerReplacementMode
  settlement: {
    selfDrawPaymentMode: SelfDrawPaymentMode
    discardWinPaymentMode: DiscardWinPaymentMode
    minimumTai: RuleConfigState<number>
  }
  postDraw: {
    dealerContinuation: RuleConfigState<boolean>
    readyHandCheck: RuleConfigState<boolean>
    readyHandPayment: RuleConfigState<boolean>
  }
  specialHands: {
    heavenWin: RuleConfigState<boolean>
    bigThreeDragons: RuleConfigState<boolean>
    littleThreeDragons: RuleConfigState<boolean>
    earthWin: RuleConfigState<boolean>
    qiangGang: RuleConfigState<boolean>
  }
}

export type MahjongRuleConfigOverride = {
  claimPriorityOrder?: ClaimPriorityAction[]
  flowerReplacementMode?: FlowerReplacementMode
  settlement?: Partial<MahjongRuleConfig['settlement']>
  postDraw?: Partial<MahjongRuleConfig['postDraw']>
  specialHands?: Partial<MahjongRuleConfig['specialHands']>
}

export type RuleConfigMergeResult =
  | {
      ok: true
      config: MahjongRuleConfig
    }
  | {
      ok: false
      error: string
    }

export type RoundFlowRuleConfig = Pick<MahjongRuleConfig, 'claimPriorityOrder' | 'flowerReplacementMode' | 'postDraw'>
export type ScoringRuleConfig = Pick<MahjongRuleConfig, 'settlement' | 'specialHands'>
