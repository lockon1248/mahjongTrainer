<script setup lang="ts">
import { computed } from 'vue'
import type { HumanClaimCandidate, HumanSelfTurnCandidate, ScoringItem, Seat, Tile } from '@/core'
import {
  CLAIM_TYPE_LABELS,
  formatDrawReasonLabel,
  formatOutcomeLabel,
  formatPhaseLabel,
  formatScoringItemLabel,
  formatSeatLabel,
  formatWindLabel,
  MELD_TYPE_LABELS,
  RESULT_TYPE_LABELS,
  SELF_TURN_ACTION_LABELS
} from '@/ui/constants/display'
import { formatTileLabel } from '@/ui/constants/tiles'
import type { GameTablePlayerViewModel, GameTableSnapshotViewModel } from '@/views/game/types'

const SEAT_ORDER: readonly Seat[] = ['east', 'south', 'west', 'north']

const props = defineProps<{
  snapshot: GameTableSnapshotViewModel
  humanSeat: Seat
  claimCandidates: HumanClaimCandidate[]
  selfTurnCandidates: HumanSelfTurnCandidate[]
}>()

const emit = defineEmits<{
  discard: [tile: Tile]
  claim: [candidate: HumanClaimCandidate]
  'self-turn-action': [candidate: HumanSelfTurnCandidate]
  'next-round': []
}>()

const isHumanTurn = computed(() => {
  return props.snapshot.currentSeat === props.humanSeat
    && props.snapshot.phase === 'discard'
    && props.snapshot.outcome === 'in-progress'
})

const hasHumanClaimWindow = computed(() => {
  return props.snapshot.phase === 'claim-window' && visibleClaimCandidates.value.length > 1
})

const lastClaimLabel = computed(() => {
  return formatClaimType(props.snapshot.lastClaimResolution?.type ?? 'pass')
})

const visibleClaimCandidates = computed(() => {
  return props.claimCandidates.filter((candidate) => {
    return candidate.actionType === 'pass' || props.claimCandidates.some(item => item.actionType !== 'pass')
  })
})

const hasPonClaim = computed(() => {
  return props.snapshot.phase === 'claim-window'
    && props.claimCandidates.some(candidate => candidate.actionType === 'pon')
})

const hasWinClaim = computed(() => {
  return props.snapshot.phase === 'claim-window'
    && props.claimCandidates.some(candidate => candidate.actionType === 'win')
})

const discardPools = computed<GameTablePlayerViewModel[]>(() => {
  const order = ['top', 'left', 'right', 'bottom'] as const

  return order.flatMap((position) => {
    const player = props.snapshot.players.find(candidate => candidate.relativePosition === position)

    return player == null ? [] : [player]
  })
})

const currentSeatSummaryLabel = computed(() => {
  return props.snapshot.phase === 'claim-window' ? '剛出牌' : '目前操作'
})

const localRoundLabel = computed(() => {
  return `${formatWind(props.snapshot.prevailingWind)}${getSeatRoundLabel(props.snapshot.dealerSeat)}局`
})

const matchModeLabel = computed(() => {
  if (props.snapshot.matchSummary == null)
    return null

  return props.snapshot.matchSummary.victoryMode === 'bankruptcy'
    ? '破產即止'
    : '四風圈結算'
})

const matchStakesLabel = computed(() => {
  if (props.snapshot.matchSummary == null)
    return null

  return `底 ${props.snapshot.matchSummary.baseStake} / 台 ${props.snapshot.matchSummary.taiValue}`
})

const isPlayerActive = (player: GameTablePlayerViewModel): boolean => {
  if (props.snapshot.phase === 'claim-window')
    return player.seat === props.humanSeat && hasHumanClaimWindow.value

  return player.seat === props.snapshot.currentSeat
}

const isPlayerRecent = (player: GameTablePlayerViewModel): boolean => {
  return props.snapshot.phase === 'claim-window' && player.seat === props.snapshot.currentSeat
}

const isDealer = (player: GameTablePlayerViewModel): boolean => {
  return player.seat === props.snapshot.dealerSeat
}

const getPlayerStatus = (player: GameTablePlayerViewModel): string | null => {
  if (props.snapshot.phase === 'claim-window') {
    if (player.seat === props.humanSeat && hasHumanClaimWindow.value)
      return '請宣告'

    if (player.seat === props.snapshot.currentSeat)
      return '剛出牌'
  }

  if (player.seat === props.snapshot.currentSeat) {
    if (props.snapshot.phase === 'draw')
      return player.seat === props.humanSeat ? '輪到你摸牌' : '正在摸牌'

    if (props.snapshot.phase === 'discard')
      return player.seat === props.humanSeat ? '輪到你' : '正在出牌'
  }

  if (player.seat === props.humanSeat)
    return '你'

  return null
}

const getPlayerActiveFlagLabel = (player: GameTablePlayerViewModel): string | null => {
  if (!isPlayerActive(player))
    return null

  if (props.snapshot.phase === 'claim-window')
    return player.seat === props.humanSeat ? '等待宣告' : '剛出牌'

  return '目前出牌'
}

const formatClaimLabel = (candidate: HumanClaimCandidate): string => {
  if (candidate.consumedTiles.length === 0)
    return formatClaimType(candidate.actionType)

  return `${formatClaimType(candidate.actionType)}：${candidate.consumedTiles.map(formatTileLabel).join('、')}`
}

const formatSelfTurnLabel = (candidate: HumanSelfTurnCandidate): string => {
  if (candidate.consumedTiles.length === 0)
    return formatSelfTurnActionType(candidate.actionType)

  return `${formatSelfTurnActionType(candidate.actionType)}：${candidate.consumedTiles.map(formatTileLabel).join('、')}`
}

const formatSeat = (seat: Seat): string => {
  return formatSeatLabel(seat)
}

const getSeatRoundLabel = (seat: Seat): string => {
  return {
    east: '東',
    south: '南',
    west: '西',
    north: '北'
  }[seat]
}

const formatWind = (seat: Seat): string => {
  return formatWindLabel(seat)
}

const formatPhase = (phase: GameTableSnapshotViewModel['phase']): string => {
  return formatPhaseLabel(phase)
}

const formatOutcome = (outcome: GameTableSnapshotViewModel['outcome']): string => {
  return formatOutcomeLabel(outcome)
}

const formatClaimType = (type: 'pass' | 'chi' | 'pon' | 'kan-exposed' | 'win'): string => {
  return CLAIM_TYPE_LABELS[type] ?? '未知宣告'
}

const formatSelfTurnActionType = (actionType: HumanSelfTurnCandidate['actionType']): string => {
  return SELF_TURN_ACTION_LABELS[actionType]
}

const formatMeldType = (type: GameTablePlayerViewModel['melds'][number]['type']): string => {
  return MELD_TYPE_LABELS[type]
}

const formatResultType = (type: NonNullable<GameTableSnapshotViewModel['resultSummary']>['type']): string => {
  return RESULT_TYPE_LABELS[type]
}

const formatDrawReason = (reason: string | null): string => {
  return formatDrawReasonLabel(reason)
}

const formatScoringItem = (item: ScoringItem): string => {
  return formatScoringItemLabel(item)
}

const getPlayerPanelClasses = (player: GameTablePlayerViewModel) => {
  return [
    'player-panel-shell grid gap-[0.6rem] rounded-[1.2rem] bg-[linear-gradient(180deg,rgba(35,80,65,0.98),rgba(21,51,43,0.98))] p-[0.9rem] text-[#f8f2e7] shadow-[0_1rem_1.8rem_rgba(20,50,41,0.18)]',
    {
      'player-panel--active border border-[rgba(255,228,163,0.58)] shadow-[0_0_0_4px_rgba(255,205,101,0.42),0_1.25rem_2.2rem_rgba(20,50,41,0.26)] bg-[linear-gradient(180deg,rgba(52,113,91,0.99),rgba(26,67,55,0.99))]': isPlayerActive(player),
      'player-panel--recent shadow-[0_0_0_2px_rgba(255,255,255,0.26),0_1rem_2rem_rgba(20,50,41,0.18)]': isPlayerRecent(player)
    }
  ]
}

const getPlayerStatusBadgeClasses = (player: GameTablePlayerViewModel) => {
  return [
    'player-status-pill bg-[rgba(248,242,231,0.14)] text-[#f8f2e7]',
    {
      'player-status-badge--human-turn bg-[#f1d48a] text-[#17382e]': player.seat === props.humanSeat && props.snapshot.phase === 'discard' && props.snapshot.currentSeat === props.humanSeat,
      'player-status-badge--claim bg-[#f4a259] text-[#2f1706]': player.seat === props.humanSeat && hasHumanClaimWindow.value,
      'player-status-badge--recent bg-[rgba(255,255,255,0.18)] text-[#f8f2e7]': props.snapshot.phase === 'claim-window' && player.seat === props.snapshot.currentSeat
    }
  ]
}

const getDiscardPoolClasses = (player: GameTablePlayerViewModel) => {
  return [
    'min-h-[5.25rem] rounded-4 p-[0.6rem] text-[#f8f2e7] transition-colors duration-200',
    {
      'bg-[rgba(246,239,226,0.1)]': !isPlayerRecent(player),
      'border border-[rgba(255,255,255,0.26)] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(246,239,226,0.12))] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]': isPlayerRecent(player)
    }
  ]
}

const getLatestDiscardSeat = (): Seat | null => {
  if (props.snapshot.outcome !== 'in-progress')
    return null

  if (props.snapshot.phase === 'claim-window')
    return props.snapshot.currentSeat

  const currentSeatIndex = SEAT_ORDER.indexOf(props.snapshot.currentSeat)

  if (currentSeatIndex === -1)
    return null

  return SEAT_ORDER[(currentSeatIndex + SEAT_ORDER.length - 1) % SEAT_ORDER.length] ?? null
}

const isLatestDiscardTile = (player: GameTablePlayerViewModel, tileIndex: number): boolean => {
  const latestDiscardSeat = getLatestDiscardSeat()

  if (latestDiscardSeat == null || player.seat !== latestDiscardSeat)
    return false

  return tileIndex === player.discards.length - 1
}

const getDiscardTileClasses = (player: GameTablePlayerViewModel, tileIndex: number) => {
  const isLatestTile = isLatestDiscardTile(player, tileIndex)

  return [
    'tile-pill border-[rgba(248,242,231,0.16)] bg-[rgba(248,242,231,0.12)]',
    {
      'discard-tile--latest border-[rgba(255,232,164,0.98)] bg-[linear-gradient(180deg,rgba(255,220,118,0.48),rgba(242,163,63,0.44))] text-[#fffbea] shadow-[0_0_0_2px_rgba(255,223,133,0.28),0_0.55rem_1rem_rgba(77,42,10,0.24)]': isLatestTile,
      'discard-tile--pon border-[rgba(255,120,120,0.98)] shadow-[0_0_0_2px_rgba(255,110,110,0.26),0_0.45rem_0.9rem_rgba(107,24,24,0.2)]': isLatestTile && hasPonClaim.value,
      'discard-tile--win bg-[linear-gradient(180deg,rgba(255,235,120,0.52),rgba(232,188,45,0.46))] text-[#fffbea] shadow-[0_0_0_2px_rgba(255,224,102,0.26),0_0.45rem_0.9rem_rgba(92,70,16,0.2)]': isLatestTile && hasWinClaim.value
    }
  ]
}
</script>

<template>
  <section class="game-table-layout grid gap-6" data-testid="game-table-view">
    <header class="table-summary-grid grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(7rem,1fr))]" data-testid="table-summary">
      <div class="table-chip" data-testid="summary-local-round">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">局次</span>
        <strong>{{ localRoundLabel }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-dealer">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">莊家</span>
        <strong>{{ formatSeat(snapshot.dealerSeat) }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-wind">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">圈風</span>
        <strong>{{ formatWind(snapshot.prevailingWind) }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-current-seat">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">{{ currentSeatSummaryLabel }}</span>
        <strong>{{ formatSeat(snapshot.currentSeat) }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-phase">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">階段</span>
        <strong>{{ formatPhase(snapshot.phase) }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-last-claim">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">上次宣告</span>
        <strong>{{ lastClaimLabel }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-outcome">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">本局狀態</span>
        <strong>{{ formatOutcome(snapshot.outcome) }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-wall">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">剩餘牌牆</span>
        <strong>{{ snapshot.wallCount }}</strong>
      </div>
      <div class="table-chip" data-testid="summary-total-discards">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">總捨牌數</span>
        <strong>{{ snapshot.totalDiscards }}</strong>
      </div>
    </header>

    <section
      v-if="snapshot.matchSummary != null"
      class="match-summary-grid grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(7rem,1fr))]"
      data-testid="match-summary"
    >
      <div class="table-chip" data-testid="match-summary-mode">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">勝利條件</span>
        <strong>{{ matchModeLabel }}</strong>
      </div>
      <div class="table-chip" data-testid="match-summary-stakes">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">結算</span>
        <strong>{{ matchStakesLabel }}</strong>
      </div>
    </section>

    <section
      v-if="snapshot.resultSummary != null"
      class="round-result-grid grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(7rem,1fr))]"
      data-testid="round-result-summary"
    >
      <div class="table-chip" data-testid="result-type">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">結果</span>
        <strong>{{ formatResultType(snapshot.resultSummary.type) }}</strong>
      </div>
      <div class="table-chip" data-testid="result-ended">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">是否結束</span>
        <strong>{{ snapshot.resultSummary.ended ? '是' : '否' }}</strong>
      </div>
      <div class="table-chip" data-testid="result-winner">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">和牌者</span>
        <strong>{{ snapshot.resultSummary.winnerSeat == null ? '無' : formatSeat(snapshot.resultSummary.winnerSeat) }}</strong>
      </div>
      <div class="table-chip" data-testid="result-discarder">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">放槍者</span>
        <strong>{{ snapshot.resultSummary.discarderSeat == null ? '無' : formatSeat(snapshot.resultSummary.discarderSeat) }}</strong>
      </div>
      <div class="table-chip" data-testid="result-total-tai">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">總台數</span>
        <strong>{{ snapshot.resultSummary.totalTai ?? '無' }}</strong>
      </div>
      <div class="table-chip" data-testid="result-scoring-items">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">台型明細</span>
        <strong>
          {{
            snapshot.resultSummary.scoringItems.length === 0
              ? '無'
              : snapshot.resultSummary.scoringItems.map(formatScoringItem).join('、')
          }}
        </strong>
      </div>
      <div class="table-chip" data-testid="result-draw-reason">
        <span class="mb-1 block text-[0.72rem] uppercase tracking-[0.08em] text-[#7d6a49]">流局原因</span>
        <strong>{{ formatDrawReason(snapshot.resultSummary.drawReason) }}</strong>
      </div>
    </section>

    <div class="mahjong-table mahjong-table--wide mahjong-table--compact mahjong-table--rebalanced" data-testid="mahjong-table">
      <article
        v-for="player in snapshot.players"
        :key="player.seat"
        data-testid="player-seat"
        :class="[
          `player-panel--${player.relativePosition}`,
          {
            'player-panel--bottom-rebalanced': player.relativePosition === 'bottom'
          },
          getPlayerPanelClasses(player)
        ]"
        :data-seat="player.seat"
        :data-relative-position="player.relativePosition"
      >
        <div class="flex items-start justify-between gap-2.5">
          <div class="grid gap-[0.25rem]">
            <div class="flex flex-wrap items-center gap-[0.45rem]">
              <h2 class="m-0 text-[1.15rem] leading-none">{{ formatSeat(player.seat) }}</h2>
              <span
                v-if="isDealer(player)"
                class="inline-flex items-center rounded-full border border-[rgba(241,212,138,0.48)] bg-[rgba(241,212,138,0.18)] px-[0.45rem] py-[0.14rem] text-[0.66rem] font-700 tracking-[0.06em] text-[#ffe6a7]"
                :data-testid="`player-dealer-${player.seat}`"
              >
                莊家
              </span>
              <span
                v-if="snapshot.matchSummary != null"
                class="player-score inline-flex items-center rounded-full border border-[rgba(248,242,231,0.2)] bg-[rgba(248,242,231,0.12)] px-[0.45rem] py-[0.14rem] text-[0.66rem] font-700 tracking-[0.03em] text-[#f8f2e7]"
                :data-testid="`player-score-${player.seat}`"
              >
                籌碼 {{ player.score }}
              </span>
              <span
                v-if="getPlayerActiveFlagLabel(player) != null"
                class="inline-flex items-center rounded-[0.6rem] border border-[rgba(255,240,205,0.75)] bg-[linear-gradient(180deg,#f0713b,#c54d1e)] px-[0.55rem] py-[0.2rem] text-[0.68rem] font-800 tracking-[0.06em] text-[#fff7ea] shadow-[0_0.35rem_0.8rem_rgba(92,31,5,0.24)]"
                :data-testid="`player-active-${player.seat}`"
              >
                {{ getPlayerActiveFlagLabel(player) }}
              </span>
              <span
                v-if="getPlayerStatus(player) != null"
                :class="getPlayerStatusBadgeClasses(player)"
                :data-testid="`player-status-${player.seat}`"
              >
                {{ getPlayerStatus(player) }}
              </span>
              <div
                v-if="player.seat === humanSeat && (snapshot.phase === 'claim-window' && visibleClaimCandidates.length > 1 || isHumanTurn && selfTurnCandidates.length > 0 || snapshot.outcome !== 'in-progress')"
                class="flex flex-wrap items-center gap-[0.45rem]"
                :data-testid="`player-action-row-${player.seat}`"
              >
                <template v-if="snapshot.phase === 'claim-window' && visibleClaimCandidates.length > 1">
                  <button
                    v-for="(candidate, candidateIndex) in visibleClaimCandidates"
                    :key="`${candidate.actionType}-${candidateIndex}`"
                    class="action-button-pill cursor-pointer"
                    data-testid="human-claim-action"
                    type="button"
                    @click="emit('claim', candidate)"
                  >
                    {{ formatClaimLabel(candidate) }}
                  </button>
                </template>
                <template v-if="isHumanTurn && selfTurnCandidates.length > 0">
                  <button
                    v-for="(candidate, candidateIndex) in selfTurnCandidates"
                    :key="`${candidate.actionType}-${candidateIndex}`"
                    class="action-button-pill cursor-pointer"
                    data-testid="human-self-turn-action"
                    type="button"
                    @click="emit('self-turn-action', candidate)"
                  >
                    {{ formatSelfTurnLabel(candidate) }}
                  </button>
                </template>
                <button
                  v-if="snapshot.outcome !== 'in-progress'"
                  class="action-button-pill cursor-pointer"
                  data-testid="next-round-action"
                  type="button"
                  @click="emit('next-round')"
                >
                  下一局
                </button>
              </div>
            </div>
          </div>
        </div>
        <dl :class="['player-stat-grid player-stat-grid--balanced', { 'player-stat-grid--bottom-rebalanced': player.relativePosition === 'bottom' }]">
          <div class="m-0">
            <dt class="text-[0.64rem] uppercase tracking-[0.04em] text-[rgba(248,242,231,0.72)]">手牌</dt>
            <dd class="mb-0 mt-[0.08rem] text-[0.98rem] leading-none">{{ player.concealedCount }}</dd>
          </div>
          <div class="m-0">
            <dt class="text-[0.64rem] uppercase tracking-[0.04em] text-[rgba(248,242,231,0.72)]">花牌</dt>
            <dd class="mb-0 mt-[0.08rem] text-[0.98rem] leading-none">{{ player.flowerCount }}</dd>
          </div>
          <div class="m-0">
            <dt class="text-[0.64rem] uppercase tracking-[0.04em] text-[rgba(248,242,231,0.72)]">副露</dt>
            <dd class="mb-0 mt-[0.08rem] text-[0.98rem] leading-none">{{ player.meldCount }}</dd>
          </div>
          <div class="m-0">
            <dt class="text-[0.64rem] uppercase tracking-[0.04em] text-[rgba(248,242,231,0.72)]">捨牌</dt>
            <dd class="mb-0 mt-[0.08rem] text-[0.98rem] leading-none">{{ player.discardCount }}</dd>
          </div>
        </dl>
        <div
          v-if="player.melds.length > 0"
          class="player-meld-list--compact mt-2.5 flex flex-wrap items-start gap-[0.45rem]"
          :data-testid="`player-melds-${player.seat}`"
        >
          <div
            v-for="(meld, meldIndex) in player.melds"
            :key="`${player.seat}-meld-${meld.type}-${meldIndex}`"
            class="player-meld-card player-meld-chip"
            :data-testid="`player-meld-${player.seat}-${meldIndex}`"
          >
            <span class="text-[0.75rem] font-700 tracking-[0.08em] text-[#f1d48a]">{{ formatMeldType(meld.type) }}</span>
            <div class="flex flex-wrap items-center gap-[0.45rem]">
              <span
                v-for="(label, tileIndex) in meld.labels"
                :key="`${player.seat}-meld-tile-${meldIndex}-${label}-${tileIndex}`"
                class="rounded-[0.7rem] border border-[rgba(241,212,138,0.28)] bg-[rgba(241,212,138,0.12)] px-[0.52rem] py-[0.28rem] text-[0.9rem] text-[#fff2c6]"
              >
                {{ label }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="(player.revealedWinningTiles?.length ?? 0) > 0"
          class="mt-2.5 grid gap-[0.45rem]"
          :data-testid="`player-winning-tiles-${player.seat}`"
        >
          <div class="player-meld-card border border-[rgba(255,227,151,0.28)] bg-[rgba(255,229,160,0.08)]">
            <span class="text-[0.75rem] font-700 tracking-[0.08em] text-[#ffe7a8]">和牌手牌</span>
            <div class="flex flex-wrap gap-[0.45rem]">
              <span
                v-for="(tile, tileIndex) in player.revealedWinningTiles"
                :key="`${player.seat}-winning-tile-${tile.suit}-${tile.rank}-${tileIndex}`"
                class="rounded-[0.7rem] border border-[rgba(255,227,151,0.36)] bg-[rgba(255,227,151,0.12)] px-[0.52rem] py-[0.28rem] text-[0.9rem] text-[#fff4d0]"
              >
                {{ formatTileLabel(tile) }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="player.seat === humanSeat"
          :class="[
            'mt-2.5 flex flex-wrap gap-[0.35rem]',
            {
              'human-concealed-tiles--bottom-rebalanced mt-[1rem]': player.relativePosition === 'bottom'
            }
          ]"
          data-testid="human-concealed-tiles"
        >
          <button
            v-for="(tile, tileIndex) in player.concealedTiles"
            :key="`${player.seat}-${tile.suit}-${tile.rank}-${tileIndex}`"
            class="cursor-pointer rounded-[0.72rem] border border-[rgba(248,242,231,0.18)] bg-[rgba(248,242,231,0.1)] px-[0.5rem] py-[0.28rem] text-[0.82rem] text-inherit disabled:cursor-default disabled:opacity-56"
            data-testid="human-discard-tile"
            type="button"
            :disabled="!isHumanTurn"
            @click="emit('discard', tile)"
          >
            {{ formatTileLabel(tile) }}
          </button>
        </div>
      </article>

      <section class="table-center table-center--compact table-center--rebalanced grid grid-cols-2 content-start gap-[0.55rem] rounded-[1.15rem] border border-[rgba(59,88,68,0.16)] bg-[radial-gradient(circle_at_center,rgba(244,227,183,0.08),transparent_65%),linear-gradient(180deg,rgba(35,80,65,0.98),rgba(21,51,43,0.98))] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" data-testid="center-discard-pools">
        <div
          v-for="player in discardPools"
          :key="player.seat"
          :class="[
            `discard-pool--${player.relativePosition}`,
            getDiscardPoolClasses(player)
          ]"
          :data-testid="`discard-pool-${player.seat}`"
        >
          <div class="mb-[0.35rem] flex items-baseline justify-between gap-2">
            <strong>{{ formatSeat(player.seat) }}</strong>
            <span class="text-[0.72rem] text-[rgba(248,242,231,0.72)]">{{ player.discardCount }} 張</span>
          </div>
          <div
            v-if="player.discards.length > 0"
            class="flex flex-wrap gap-[0.3rem]"
          >
            <span
              v-for="(tile, tileIndex) in player.discards"
              :key="`${player.seat}-discard-${tile.suit}-${tile.rank}-${tileIndex}`"
              :class="getDiscardTileClasses(player, tileIndex)"
              :data-testid="`discard-tile-${player.seat}-${tileIndex}`"
            >
              {{ formatTileLabel(tile) }}
            </span>
          </div>
          <p v-else class="m-0 text-[rgba(248,242,231,0.72)]">
            暫無捨牌
          </p>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.game-table-layout {
  min-width: 0;
  min-height: 0;
  align-content: start;
}

.table-summary-grid,
.match-summary-grid,
.round-result-grid {
  min-width: 0;
  align-content: start;
}

.table-chip {
  min-width: 0;
}

.table-chip strong {
  display: block;
  overflow-wrap: anywhere;
}

.mahjong-table {
  display: grid;
  grid-template-columns: minmax(15rem, 1fr) minmax(19rem, 1.55fr) minmax(15rem, 1fr);
  grid-template-areas:
    ". top ."
    "left center right"
    "bottom bottom bottom";
  align-items: stretch;
  gap: 0.7rem;
  min-width: 0;
  min-height: 0;
}

.mahjong-table--wide {
  grid-template-columns: minmax(15rem, 1fr) minmax(19rem, 1.55fr) minmax(15rem, 1fr);
}

.mahjong-table--compact {
  gap: 0.7rem;
}

.mahjong-table--rebalanced {
  grid-template-columns: minmax(15rem, 0.96fr) minmax(24rem, 1.9fr) minmax(15rem, 0.96fr);
  grid-template-rows: auto minmax(10.75rem, auto) auto;
}

.player-panel-shell {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.player-panel--top {
  grid-area: top;
}

.player-panel--right {
  grid-area: right;
}

.player-panel--bottom {
  grid-area: bottom;
}

.player-panel--bottom-rebalanced {
  padding: 0.72rem 0.82rem;
  gap: 0.48rem;
}

.player-panel--left {
  grid-area: left;
}

.table-center {
  grid-area: center;
  min-width: 0;
}

.table-center--rebalanced {
  min-height: 12rem;
}

.player-meld-list--compact {
  align-content: flex-start;
  min-width: 0;
  overflow: hidden;
}

.player-meld-chip {
  width: fit-content;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
  min-width: 0;
}

.player-meld-card {
  min-width: 0;
}

.player-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem 1rem;
  min-width: 0;
}

.player-stat-grid--balanced {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.player-stat-grid--bottom-rebalanced {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.3rem 0.7rem;
}

.human-concealed-tiles--bottom-rebalanced {
  margin-top: 1rem;
}

@media (max-width: 1080px) {
  .mahjong-table {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas:
      "top top"
      "left right"
      "center center"
      "bottom bottom";
  }
}

@media (max-width: 720px) {
  .mahjong-table {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "top"
      "right"
      "center"
      "left"
      "bottom";
  }

  .table-center {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
