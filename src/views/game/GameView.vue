<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { HumanClaimCandidate, HumanSelfTurnCandidate, Tile } from '@/core'
import GameTableView from '@/views/game/components/GameTableView.vue'
import { createGameTableSnapshot } from '@/views/game/selectors'
import { useGameSessionStore } from '@/stores/gameSession'

const gameSessionStore = useGameSessionStore()
const { error, isInitialized, round } = storeToRefs(gameSessionStore)

if (!isInitialized.value && error.value == null) {
  gameSessionStore.startLocalRound()
}

const snapshot = computed(() => {
  if (round.value == null)
    return null

  return createGameTableSnapshot(round.value, gameSessionStore.humanSeat)
})

const handleHumanDiscard = (tile: Tile) => {
  gameSessionStore.discard(tile)

  if (gameSessionStore.error == null)
    gameSessionStore.advanceTurn()
}

const handleHumanClaim = (candidate: HumanClaimCandidate) => {
  gameSessionStore.submitHumanClaim(candidate.actionType, candidate.consumedTiles)

  if (gameSessionStore.error == null)
    gameSessionStore.advanceTurn()
}

const handleHumanSelfTurnAction = (candidate: HumanSelfTurnCandidate) => {
  gameSessionStore.submitHumanSelfTurnAction(candidate.actionType, candidate.consumedTiles, candidate.meldTile)
}

const handleNextRound = () => {
  gameSessionStore.startNextRound()
}
</script>

<template>
  <section class="game-view" data-testid="game-view">
    <div class="game-header">
      <p class="game-kicker">本機對局</p>
      <h1 class="game-title">麻將牌局</h1>
    </div>

    <p v-if="error != null" class="game-error" data-testid="game-error">
      {{ error }}
    </p>

    <GameTableView
      v-else-if="snapshot != null"
      :snapshot="snapshot"
      :human-seat="gameSessionStore.humanSeat"
      :claim-candidates="gameSessionStore.availableHumanClaims"
      :self-turn-candidates="gameSessionStore.availableHumanSelfTurnActions"
      @discard="handleHumanDiscard"
      @claim="handleHumanClaim"
      @self-turn-action="handleHumanSelfTurnAction"
      @next-round="handleNextRound"
    />
  </section>
</template>

<style scoped>
.game-view {
  display: grid;
  gap: 1.5rem;
}

.game-header {
  display: grid;
  gap: 0.35rem;
}

.game-kicker {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a6d42;
}

.game-title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
}

.game-error {
  margin: 0;
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(150, 36, 36, 0.12);
  color: #7c1f1f;
}
</style>
