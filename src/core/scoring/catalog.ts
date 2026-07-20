import type { ScoringItem, SupportedPatternId } from '@/core/scoring/types'

type StaticPatternId = Exclude<SupportedPatternId, 'dealer-continuation'>

const PATTERN_DETAILS: Record<StaticPatternId, Omit<ScoringItem, 'patternId'>> = {
  'dealer-win': {
    label: '莊家',
    tai: 1,
    reason: '胡牌者為莊家'
  },
  'self-draw': {
    label: '自摸',
    tai: 1,
    reason: '自摸完成和牌'
  },
  'heaven-win': {
    label: '天胡',
    tai: 24,
    reason: '莊家配牌完成後尚未打出第一張牌前已成和'
  },
  'big-three-dragons': {
    label: '大三元',
    tai: 8,
    reason: '中、發、白三組刻子成立'
  },
  'little-three-dragons': {
    label: '小三元',
    tai: 4,
    reason: '兩組三元刻子加一組三元將眼成立'
  },
  'seat-flower': {
    label: '花牌',
    tai: 1,
    reason: '花牌與門位相對應'
  },
  'any-flower': {
    label: '見花見台',
    tai: 1,
    reason: '任一花牌皆可計台'
  },
  'any-wind-triplet': {
    label: '見風見台',
    tai: 1,
    reason: '任一風牌刻子皆可計台'
  },
  'concealed-hand': {
    label: '門清',
    tai: 1,
    reason: '沒有吃也沒有碰，手牌皆為自摸整理'
  },
  'concealed-self-draw': {
    label: '門清自摸',
    tai: 3,
    reason: '門清且自摸胡牌'
  },
  'full-flush': {
    label: '清一色',
    tai: 8,
    reason: '整副牌由同一花色組成'
  },
  'concealed-kong-bonus': {
    label: '暗槓',
    tai: 2,
    reason: '每一組暗槓計 2 台'
  }
}

export const createScoringItem = (patternId: StaticPatternId): ScoringItem => {
  return {
    patternId,
    ...PATTERN_DETAILS[patternId]
  }
}

export const createDealerContinuationScoringItem = (count: number): ScoringItem => ({
  patternId: 'dealer-continuation',
  label: `連莊 ${count} 台`,
  tai: count,
  reason: `莊家連續坐莊 ${count} 次`
})

export const getPatternTai = (patternId: StaticPatternId): number => {
  return PATTERN_DETAILS[patternId].tai
}
