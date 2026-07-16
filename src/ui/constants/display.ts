import type { ScoringItem, Seat } from '@/core'
import type { GameTablePlayerViewModel, GameTableSnapshotViewModel } from '@/views/game/types'
import { WIND_TILE_LABELS } from '@/ui/constants/tiles'

export const SEAT_LABELS: Record<Seat, string> = {
  east: '東家',
  south: '南家',
  west: '西家',
  north: '北家'
}

export const ROUND_PHASE_LABELS: Record<GameTableSnapshotViewModel['phase'], string> = {
  draw: '摸牌',
  discard: '出牌',
  'claim-window': '宣告',
  ended: '本局結束'
}

export const ROUND_OUTCOME_LABELS: Record<GameTableSnapshotViewModel['outcome'], string> = {
  'in-progress': '對局中',
  win: '和牌',
  draw: '流局'
}

export const CLAIM_TYPE_LABELS = {
  pass: '略過',
  chi: '吃牌',
  pon: '碰牌',
  'kan-exposed': '明槓',
  win: '和牌'
} as const

export const SELF_TURN_ACTION_LABELS = {
  'win-self-draw': '自摸',
  'kan-concealed': '暗槓',
  'kan-added': '加槓'
} as const

export const MELD_TYPE_LABELS: Record<GameTablePlayerViewModel['melds'][number]['type'], string> = {
  chi: '吃',
  pon: '碰',
  'kan-concealed': '暗槓',
  'kan-exposed': '明槓',
  'kan-added': '加槓'
}

export const RESULT_TYPE_LABELS: Record<NonNullable<GameTableSnapshotViewModel['resultSummary']>['type'], string> = {
  win: '和牌',
  draw: '流局'
}

export const DRAW_REASON_LABELS = {
  'wall-exhausted': '牌牆耗盡'
} as const

export const formatSeatLabel = (seat: Seat): string => {
  return SEAT_LABELS[seat]
}

export const formatWindLabel = (seat: Seat): string => {
  return WIND_TILE_LABELS[seat]
}

export const formatPhaseLabel = (phase: GameTableSnapshotViewModel['phase']): string => {
  return ROUND_PHASE_LABELS[phase]
}

export const formatOutcomeLabel = (outcome: GameTableSnapshotViewModel['outcome']): string => {
  return ROUND_OUTCOME_LABELS[outcome]
}

export const formatDrawReasonLabel = (reason: string | null): string => {
  if (reason == null)
    return '無'

  return DRAW_REASON_LABELS[reason as keyof typeof DRAW_REASON_LABELS] ?? '未分類流局'
}

export const formatScoringItemLabel = (item: ScoringItem): string => {
  return `${item.label} ${item.tai} 台`
}
