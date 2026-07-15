<script setup lang="ts">
import { computed } from 'vue'
import type { HumanClaimCandidate, HumanSelfTurnCandidate, ScoringItem, Seat, Tile } from '@/core'
import type { GameTablePlayerViewModel, GameTableSnapshotViewModel } from '@/views/game/types'

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

const isPlayerActive = (player: GameTablePlayerViewModel): boolean => {
  if (props.snapshot.phase === 'claim-window')
    return player.seat === props.humanSeat && hasHumanClaimWindow.value

  return player.seat === props.snapshot.currentSeat
}

const isPlayerRecent = (player: GameTablePlayerViewModel): boolean => {
  return props.snapshot.phase === 'claim-window' && player.seat === props.snapshot.currentSeat
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

const formatTile = (tile: Tile): string => {
  switch (tile.suit) {
    case 'characters':
      return `${NUMBER_LABELS[tile.rank - 1]}萬`
    case 'dots':
      return `${NUMBER_LABELS[tile.rank - 1]}筒`
    case 'bamboo':
      return `${NUMBER_LABELS[tile.rank - 1]}條`
    case 'winds':
      return WIND_LABELS[tile.rank]
    case 'dragons':
      return DRAGON_LABELS[tile.rank]
    case 'flower':
      return FLOWER_LABELS[tile.rank]
  }
}

const formatClaimLabel = (candidate: HumanClaimCandidate): string => {
  if (candidate.consumedTiles.length === 0)
    return formatClaimType(candidate.actionType)

  return `${formatClaimType(candidate.actionType)}：${candidate.consumedTiles.map(formatTile).join('、')}`
}

const formatSelfTurnLabel = (candidate: HumanSelfTurnCandidate): string => {
  if (candidate.consumedTiles.length === 0)
    return formatSelfTurnActionType(candidate.actionType)

  return `${formatSelfTurnActionType(candidate.actionType)}：${candidate.consumedTiles.map(formatTile).join('、')}`
}

const NUMBER_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'] as const

const WIND_LABELS = {
  east: '東風',
  south: '南風',
  west: '西風',
  north: '北風'
} as const

const DRAGON_LABELS = {
  red: '紅中',
  green: '青發',
  white: '白板'
} as const

const FLOWER_LABELS = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
  plum: '梅',
  orchid: '蘭',
  bamboo: '竹',
  chrysanthemum: '菊'
} as const

const formatSeat = (seat: Seat): string => {
  return {
    east: '東家',
    south: '南家',
    west: '西家',
    north: '北家'
  }[seat]
}

const formatWind = (seat: Seat): string => {
  return WIND_LABELS[seat]
}

const formatPhase = (phase: GameTableSnapshotViewModel['phase']): string => {
  return {
    draw: '摸牌',
    discard: '出牌',
    'claim-window': '宣告',
    ended: '本局結束'
  }[phase]
}

const formatOutcome = (outcome: GameTableSnapshotViewModel['outcome']): string => {
  return {
    'in-progress': '對局中',
    win: '和牌',
    draw: '流局'
  }[outcome]
}

const formatClaimType = (type: 'pass' | 'chi' | 'pon' | 'kan-exposed' | 'win'): string => {
  return {
    pass: '略過',
    chi: '吃牌',
    pon: '碰牌',
    'kan-exposed': '明槓',
    win: '和牌'
  }[type] ?? '未知宣告'
}

const formatSelfTurnActionType = (actionType: HumanSelfTurnCandidate['actionType']): string => {
  return {
    'win-self-draw': '自摸',
    'kan-concealed': '暗槓',
    'kan-added': '加槓'
  }[actionType]
}

const formatMeldType = (type: GameTablePlayerViewModel['melds'][number]['type']): string => {
  return {
    chi: '吃',
    pon: '碰',
    'kan-concealed': '暗槓',
    'kan-exposed': '明槓',
    'kan-added': '加槓'
  }[type]
}

const formatResultType = (type: NonNullable<GameTableSnapshotViewModel['resultSummary']>['type']): string => {
  return type === 'win' ? '和牌' : '流局'
}

const formatDrawReason = (reason: string | null): string => {
  if (reason == null)
    return '無'

  return {
    'wall-exhausted': '牌牆耗盡'
  }[reason] ?? '未分類流局'
}

const formatScoringItem = (item: ScoringItem): string => {
  return `${item.label} ${item.tai} 台`
}

</script>

<template>
  <section class="game-table-view" data-testid="game-table-view">
    <header class="table-summary" data-testid="table-summary">
      <div class="summary-chip" data-testid="summary-dealer">
        <span class="summary-label">莊家</span>
        <strong>{{ formatSeat(snapshot.dealerSeat) }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-wind">
        <span class="summary-label">圈風</span>
        <strong>{{ formatWind(snapshot.prevailingWind) }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-current-seat">
        <span class="summary-label">{{ currentSeatSummaryLabel }}</span>
        <strong>{{ formatSeat(snapshot.currentSeat) }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-phase">
        <span class="summary-label">階段</span>
        <strong>{{ formatPhase(snapshot.phase) }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-last-claim">
        <span class="summary-label">上次宣告</span>
        <strong>{{ lastClaimLabel }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-outcome">
        <span class="summary-label">本局狀態</span>
        <strong>{{ formatOutcome(snapshot.outcome) }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-wall">
        <span class="summary-label">剩餘牌牆</span>
        <strong>{{ snapshot.wallCount }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-total-discards">
        <span class="summary-label">總捨牌數</span>
        <strong>{{ snapshot.totalDiscards }}</strong>
      </div>
    </header>

    <section
      v-if="snapshot.resultSummary != null"
      class="table-summary"
      data-testid="round-result-summary"
    >
      <div class="summary-chip" data-testid="result-type">
        <span class="summary-label">結果</span>
        <strong>{{ formatResultType(snapshot.resultSummary.type) }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-ended">
        <span class="summary-label">是否結束</span>
        <strong>{{ snapshot.resultSummary.ended ? '是' : '否' }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-winner">
        <span class="summary-label">和牌者</span>
        <strong>{{ snapshot.resultSummary.winnerSeat == null ? '無' : formatSeat(snapshot.resultSummary.winnerSeat) }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-discarder">
        <span class="summary-label">放槍者</span>
        <strong>{{ snapshot.resultSummary.discarderSeat == null ? '無' : formatSeat(snapshot.resultSummary.discarderSeat) }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-total-tai">
        <span class="summary-label">總台數</span>
        <strong>{{ snapshot.resultSummary.totalTai ?? '無' }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-scoring-items">
        <span class="summary-label">台型明細</span>
        <strong>
          {{
            snapshot.resultSummary.scoringItems.length === 0
              ? '無'
              : snapshot.resultSummary.scoringItems.map(formatScoringItem).join('、')
          }}
        </strong>
      </div>
      <div class="summary-chip" data-testid="result-draw-reason">
        <span class="summary-label">流局原因</span>
        <strong>{{ formatDrawReason(snapshot.resultSummary.drawReason) }}</strong>
      </div>
    </section>

    <div class="mahjong-table" data-testid="mahjong-table">
      <article
        v-for="player in snapshot.players"
        :key="player.seat"
        class="player-panel"
        data-testid="player-seat"
        :class="[
          `player-panel--${player.relativePosition}`,
          {
            'player-panel--active': isPlayerActive(player),
            'player-panel--recent': isPlayerRecent(player)
          }
        ]"
        :data-seat="player.seat"
        :data-relative-position="player.relativePosition"
      >
        <div class="player-header">
          <div class="player-header-main">
            <h2 class="player-seat">{{ formatSeat(player.seat) }}</h2>
            <span
              v-if="getPlayerStatus(player) != null"
              class="player-status-badge"
              :class="{
                'player-status-badge--human-turn': player.seat === humanSeat && snapshot.phase === 'discard' && snapshot.currentSeat === humanSeat,
                'player-status-badge--claim': player.seat === humanSeat && hasHumanClaimWindow,
                'player-status-badge--recent': snapshot.phase === 'claim-window' && player.seat === snapshot.currentSeat
              }"
              :data-testid="`player-status-${player.seat}`"
            >
              {{ getPlayerStatus(player) }}
            </span>
          </div>
        </div>
        <dl class="player-stats">
          <div class="player-stat">
            <dt>手牌</dt>
            <dd>{{ player.concealedCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>花牌</dt>
            <dd>{{ player.flowerCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>副露</dt>
            <dd>{{ player.meldCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>捨牌</dt>
            <dd>{{ player.discardCount }}</dd>
          </div>
        </dl>
        <div
          v-if="player.melds.length > 0"
          class="player-melds"
          :data-testid="`player-melds-${player.seat}`"
        >
          <div
            v-for="(meld, meldIndex) in player.melds"
            :key="`${player.seat}-meld-${meld.type}-${meldIndex}`"
            class="player-meld"
          >
            <span class="player-meld-type">{{ formatMeldType(meld.type) }}</span>
            <div class="player-meld-tiles">
              <span
                v-for="(tile, tileIndex) in meld.tiles"
                :key="`${player.seat}-meld-tile-${meldIndex}-${tile.suit}-${tile.rank}-${tileIndex}`"
                class="player-meld-tile"
              >
                {{ formatTile(tile) }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="player.seat === humanSeat"
          class="player-concealed-tiles"
          data-testid="human-concealed-tiles"
        >
          <button
            v-for="(tile, tileIndex) in player.concealedTiles"
            :key="`${player.seat}-${tile.suit}-${tile.rank}-${tileIndex}`"
            class="concealed-tile-button"
            data-testid="human-discard-tile"
            type="button"
            :disabled="!isHumanTurn"
            @click="emit('discard', tile)"
          >
            {{ formatTile(tile) }}
          </button>
        </div>
      </article>

      <section class="table-center" data-testid="center-discard-pools">
        <div
          v-for="player in discardPools"
          :key="player.seat"
          class="discard-pool"
          :class="`discard-pool--${player.relativePosition}`"
          :data-testid="`discard-pool-${player.seat}`"
        >
          <div class="discard-pool-header">
            <strong>{{ formatSeat(player.seat) }}</strong>
            <span>{{ player.discardCount }} 張</span>
          </div>
          <div
            v-if="player.discards.length > 0"
            class="discard-tile-list"
          >
            <span
              v-for="(tile, tileIndex) in player.discards"
              :key="`${player.seat}-discard-${tile.suit}-${tile.rank}-${tileIndex}`"
              class="discard-tile"
              :class="{
                'discard-tile--latest': tileIndex === player.discards.length - 1
              }"
              :data-testid="`discard-tile-${player.seat}-${tileIndex}`"
            >
              {{ formatTile(tile) }}
            </span>
          </div>
          <p v-else class="discard-empty">
            暫無捨牌
          </p>
        </div>
      </section>
    </div>
    <div
      v-if="snapshot.phase === 'claim-window' && visibleClaimCandidates.length > 1"
      class="claim-action-bar"
      data-testid="human-claim-actions"
    >
      <button
        v-for="(candidate, candidateIndex) in visibleClaimCandidates"
        :key="`${candidate.actionType}-${candidateIndex}`"
        class="claim-action-button"
        data-testid="human-claim-action"
        type="button"
        @click="emit('claim', candidate)"
      >
        {{ formatClaimLabel(candidate) }}
      </button>
    </div>
    <div
      v-if="isHumanTurn && selfTurnCandidates.length > 0"
      class="claim-action-bar"
      data-testid="human-self-turn-actions"
    >
      <button
        v-for="(candidate, candidateIndex) in selfTurnCandidates"
        :key="`${candidate.actionType}-${candidateIndex}`"
        class="claim-action-button"
        data-testid="human-self-turn-action"
        type="button"
        @click="emit('self-turn-action', candidate)"
      >
        {{ formatSelfTurnLabel(candidate) }}
      </button>
    </div>
    <div
      v-if="snapshot.outcome !== 'in-progress'"
      class="claim-action-bar"
      data-testid="next-round-actions"
    >
      <button
        class="claim-action-button"
        data-testid="next-round-action"
        type="button"
        @click="emit('next-round')"
      >
        下一局
      </button>
    </div>
  </section>
</template>

<style scoped>
.game-table-view {
  display: grid;
  gap: 1.5rem;
}

.table-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: 0.75rem;
}

.summary-chip {
  border: 1px solid rgba(59, 88, 68, 0.18);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: rgba(248, 243, 232, 0.88);
}

.summary-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7d6a49;
}

.table-grid {
  display: none;
}

.mahjong-table {
  display: grid;
  grid-template-columns: minmax(12rem, 0.85fr) minmax(16rem, 1.3fr) minmax(12rem, 0.85fr);
  grid-template-areas:
    ". top ."
    "left center right"
    "bottom bottom bottom";
  align-items: stretch;
  gap: 1rem;
}

.player-panel {
  position: relative;
  border-radius: 1.25rem;
  padding: 1rem;
  background:
    linear-gradient(180deg, rgba(30, 73, 60, 0.96), rgba(20, 50, 41, 0.96));
  color: #f8f2e7;
  box-shadow: 0 1rem 2rem rgba(20, 50, 41, 0.16);
}

.player-panel--active {
  box-shadow:
    0 0 0 3px rgba(241, 212, 138, 0.92),
    0 1.25rem 2.2rem rgba(20, 50, 41, 0.22);
  background:
    linear-gradient(180deg, rgba(38, 89, 72, 0.98), rgba(21, 56, 46, 0.98));
}

.player-panel--recent {
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.26),
    0 1rem 2rem rgba(20, 50, 41, 0.18);
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

.player-panel--left {
  grid-area: left;
}

.player-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.player-header-main {
  display: grid;
  gap: 0.45rem;
}

.player-seat {
  margin: 0;
}

.player-status-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  padding: 0.32rem 0.72rem;
  background: rgba(248, 242, 231, 0.14);
  color: #f8f2e7;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.player-status-badge--human-turn {
  background: #f1d48a;
  color: #17382e;
}

.player-status-badge--claim {
  background: #f4a259;
  color: #2f1706;
}

.player-status-badge--recent {
  background: rgba(255, 255, 255, 0.18);
  color: #f8f2e7;
}

.player-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1rem 0 0;
}

.player-stat {
  margin: 0;
}

.player-stat dt {
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(248, 242, 231, 0.72);
}

.player-stat dd {
  margin: 0.2rem 0 0;
  font-size: 1.1rem;
}

.player-concealed-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.player-melds {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}

.player-meld {
  display: grid;
  gap: 0.45rem;
  border-radius: 0.95rem;
  padding: 0.7rem 0.8rem;
  background: rgba(248, 242, 231, 0.08);
}

.player-meld-type {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #f1d48a;
}

.player-meld-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.player-meld-tile {
  border: 1px solid rgba(241, 212, 138, 0.28);
  border-radius: 0.7rem;
  padding: 0.28rem 0.52rem;
  background: rgba(241, 212, 138, 0.12);
  color: #fff2c6;
  font-size: 0.9rem;
}

.table-center {
  grid-area: center;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  align-content: start;
  border: 1px solid rgba(59, 88, 68, 0.16);
  border-radius: 1.4rem;
  padding: 1rem;
  background:
    radial-gradient(circle at center, rgba(244, 227, 183, 0.08), transparent 65%),
    linear-gradient(180deg, rgba(35, 80, 65, 0.98), rgba(21, 51, 43, 0.98));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.discard-pool {
  min-height: 8.5rem;
  border-radius: 1rem;
  padding: 0.85rem;
  background: rgba(246, 239, 226, 0.1);
  color: #f8f2e7;
}

.discard-pool-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.7rem;
}

.discard-pool-header span {
  font-size: 0.8rem;
  color: rgba(248, 242, 231, 0.72);
}

.discard-tile-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.discard-tile {
  border: 1px solid rgba(248, 242, 231, 0.16);
  border-radius: 0.75rem;
  padding: 0.3rem 0.55rem;
  background: rgba(248, 242, 231, 0.12);
  font-size: 0.92rem;
}

.discard-tile--latest {
  border-color: rgba(241, 212, 138, 0.9);
  background: rgba(241, 212, 138, 0.22);
  color: #fff5d7;
  box-shadow: 0 0 0 1px rgba(241, 212, 138, 0.22);
}

.discard-empty {
  margin: 0;
  color: rgba(248, 242, 231, 0.72);
}

.concealed-tile-button {
  border: 1px solid rgba(248, 242, 231, 0.18);
  border-radius: 0.8rem;
  padding: 0.45rem 0.65rem;
  background: rgba(248, 242, 231, 0.1);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.concealed-tile-button:disabled {
  opacity: 0.56;
  cursor: default;
}

.claim-action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.claim-action-button {
  border: 1px solid rgba(59, 88, 68, 0.18);
  border-radius: 999px;
  padding: 0.6rem 0.9rem;
  background: rgba(248, 243, 232, 0.88);
  color: #214538;
  font: inherit;
  cursor: pointer;
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
