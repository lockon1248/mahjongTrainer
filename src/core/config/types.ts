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
export type ScoringProfile = 'classic-taiwan' | 'flower-wind-bonus'

export type MahjongRuleConfig = {
  scoringProfile: ScoringProfile
  claimPriorityOrder: ClaimPriorityAction[]
  flowerReplacementMode: FlowerReplacementMode
  settlement: {
    selfDrawPaymentMode: SelfDrawPaymentMode
    discardWinPaymentMode: DiscardWinPaymentMode
    minimumTai: RuleConfigState<number>
    maxTai: RuleConfigState<number>
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
  scoringProfile?: ScoringProfile
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

export type RoundFlowRuleConfig = MahjongRuleConfig
export type ScoringRuleConfig = Pick<MahjongRuleConfig, 'scoringProfile' | 'settlement' | 'specialHands'>
