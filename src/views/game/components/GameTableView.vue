<script setup lang="ts">
import type { GameTableSnapshotViewModel } from '@/views/game/types'

defineProps<{
  snapshot: GameTableSnapshotViewModel
}>()
</script>

<template>
  <section class="game-table-view" data-testid="game-table-view">
    <header class="table-summary" data-testid="table-summary">
      <div class="summary-chip">
        <span class="summary-label">dealer</span>
        <strong>{{ snapshot.dealerSeat }}</strong>
      </div>
      <div class="summary-chip">
        <span class="summary-label">wind</span>
        <strong>{{ snapshot.prevailingWind }}</strong>
      </div>
      <div class="summary-chip">
        <span class="summary-label">turn</span>
        <strong>{{ snapshot.currentSeat }}</strong>
      </div>
      <div class="summary-chip">
        <span class="summary-label">phase</span>
        <strong>{{ snapshot.phase }}</strong>
      </div>
      <div class="summary-chip">
        <span class="summary-label">outcome</span>
        <strong>{{ snapshot.outcome }}</strong>
      </div>
      <div class="summary-chip">
        <span class="summary-label">wall</span>
        <strong>{{ snapshot.wallCount }}</strong>
      </div>
    </header>

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
            <dt>ready</dt>
            <dd>{{ player.declaredReady ? 'yes' : 'no' }}</dd>
          </div>
        </dl>
      </article>
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
</style>
