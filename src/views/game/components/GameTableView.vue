<script setup lang="ts">
import { computed } from 'vue'
import type { HumanClaimCandidate, HumanSelfTurnCandidate, Seat, Tile } from '@/core'
import type { GameTableSnapshotViewModel } from '@/views/game/types'

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

const lastClaimLabel = computed(() => {
  return props.snapshot.lastClaimResolution?.type ?? 'none'
})

const visibleClaimCandidates = computed(() => {
  return props.claimCandidates.filter((candidate) => {
    return candidate.actionType === 'pass' || props.claimCandidates.some(item => item.actionType !== 'pass')
  })
})

const formatTile = (tile: Tile): string => {
  return `${tile.suit}-${tile.rank}`
}

const formatClaimLabel = (candidate: HumanClaimCandidate): string => {
  if (candidate.consumedTiles.length === 0)
    return candidate.actionType

  return `${candidate.actionType}:${candidate.consumedTiles.map(formatTile).join('+')}`
}

const formatSelfTurnLabel = (candidate: HumanSelfTurnCandidate): string => {
  if (candidate.consumedTiles.length === 0)
    return candidate.actionType

  return `${candidate.actionType}:${candidate.consumedTiles.map(formatTile).join('+')}`
}
</script>

<template>
  <section class="game-table-view" data-testid="game-table-view">
    <header class="table-summary" data-testid="table-summary">
      <div class="summary-chip" data-testid="summary-dealer">
        <span class="summary-label">dealer</span>
        <strong>{{ snapshot.dealerSeat }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-wind">
        <span class="summary-label">wind</span>
        <strong>{{ snapshot.prevailingWind }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-current-seat">
        <span class="summary-label">turn</span>
        <strong>{{ snapshot.currentSeat }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-phase">
        <span class="summary-label">phase</span>
        <strong>{{ snapshot.phase }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-last-claim">
        <span class="summary-label">claim</span>
        <strong>{{ lastClaimLabel }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-outcome">
        <span class="summary-label">outcome</span>
        <strong>{{ snapshot.outcome }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-wall">
        <span class="summary-label">wall</span>
        <strong>{{ snapshot.wallCount }}</strong>
      </div>
      <div class="summary-chip" data-testid="summary-total-discards">
        <span class="summary-label">discards</span>
        <strong>{{ snapshot.totalDiscards }}</strong>
      </div>
    </header>

    <section
      v-if="snapshot.resultSummary != null"
      class="table-summary"
      data-testid="round-result-summary"
    >
      <div class="summary-chip" data-testid="result-type">
        <span class="summary-label">result</span>
        <strong>{{ snapshot.resultSummary.type }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-ended">
        <span class="summary-label">ended</span>
        <strong>{{ snapshot.resultSummary.ended ? 'yes' : 'no' }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-winner">
        <span class="summary-label">winner</span>
        <strong>{{ snapshot.resultSummary.winnerSeat ?? 'none' }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-discarder">
        <span class="summary-label">discarder</span>
        <strong>{{ snapshot.resultSummary.discarderSeat ?? 'none' }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-total-tai">
        <span class="summary-label">tai</span>
        <strong>{{ snapshot.resultSummary.totalTai ?? 'none' }}</strong>
      </div>
      <div class="summary-chip" data-testid="result-draw-reason">
        <span class="summary-label">draw</span>
        <strong>{{ snapshot.resultSummary.drawReason ?? 'none' }}</strong>
      </div>
    </section>

    <div class="table-grid">
      <article
        v-for="player in snapshot.players"
        :key="player.seat"
        class="player-panel"
        data-testid="player-seat"
        :data-seat="player.seat"
      >
        <div class="player-header">
          <h2 class="player-seat">{{ player.seat }}</h2>
          <span class="player-score">{{ player.score }}</span>
        </div>
        <dl class="player-stats">
          <div class="player-stat">
            <dt>concealed</dt>
            <dd>{{ player.concealedCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>flowers</dt>
            <dd>{{ player.flowerCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>melds</dt>
            <dd>{{ player.meldCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>discards</dt>
            <dd>{{ player.discardCount }}</dd>
          </div>
          <div class="player-stat">
            <dt>ready</dt>
            <dd>{{ player.declaredReady ? 'yes' : 'no' }}</dd>
          </div>
        </dl>
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
}

.player-panel {
  border-radius: 1.25rem;
  padding: 1rem;
  background:
    linear-gradient(180deg, rgba(30, 73, 60, 0.96), rgba(20, 50, 41, 0.96));
  color: #f8f2e7;
  box-shadow: 0 1rem 2rem rgba(20, 50, 41, 0.16);
}

.player-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.player-seat,
.player-score {
  margin: 0;
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
</style>
