<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { HumanClaimCandidate, HumanSelfTurnCandidate, Tile } from '@/core'
import { AI_TURN_DELAY_MS } from '@/views/game/constants'
import GameTableView from '@/views/game/components/GameTableView.vue'
import MatchSetupModal from '@/views/game/components/MatchSetupModal.vue'
import { createGameTableSnapshot } from '@/views/game/selectors'
import { useGameSessionStore } from '@/stores/gameSession'
import { attachGameE2EBridge } from '@/views/game/e2eBridge'

const gameSessionStore = useGameSessionStore()
const { error, needsMatchSetup, round } = storeToRefs(gameSessionStore)

attachGameE2EBridge(gameSessionStore)

const snapshot = computed(() => {
  if (round.value == null)
    return null

  return createGameTableSnapshot(round.value, gameSessionStore.humanSeat, gameSessionStore.match)
})

let autoAdvanceTimer: ReturnType<typeof window.setTimeout> | null = null

const clearAutoAdvanceTimer = () => {
  if (autoAdvanceTimer != null) {
    window.clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
}

const hasHumanClaimOpportunity = computed(() => {
  return gameSessionStore.availableHumanClaims.some(candidate => candidate.actionType !== 'pass')
})

const shouldScheduleAiAdvance = computed(() => {
  if (round.value == null || error.value != null)
    return false

  if (round.value.phase === 'ended' || round.value.outcome.status !== 'in-progress')
    return false

  if (round.value.currentSeat === gameSessionStore.humanSeat && round.value.phase === 'discard')
    return false

  if (round.value.phase === 'claim-window' && hasHumanClaimOpportunity.value)
    return false

  return true
})

watch([
  shouldScheduleAiAdvance,
  round
], ([shouldSchedule]) => {
  clearAutoAdvanceTimer()

  if (!shouldSchedule)
    return

  autoAdvanceTimer = window.setTimeout(() => {
    autoAdvanceTimer = null

    if (shouldScheduleAiAdvance.value)
      gameSessionStore.advanceTurn()
  }, AI_TURN_DELAY_MS)
}, { immediate: true })

onBeforeUnmount(() => {
  clearAutoAdvanceTimer()
})

const handleHumanDiscard = (tile: Tile) => {
  gameSessionStore.discard(tile)
}

const handleHumanClaim = (candidate: HumanClaimCandidate) => {
  gameSessionStore.submitHumanClaim(candidate.actionType, candidate.consumedTiles)
}

const handleHumanSelfTurnAction = (candidate: HumanSelfTurnCandidate) => {
  gameSessionStore.submitHumanSelfTurnAction(candidate.actionType, candidate.consumedTiles, candidate.meldTile)
}

const handleNextRound = () => {
  gameSessionStore.startNextRound()
}

const handleMatchSetupSubmit = (payload: { initialChips: number; victoryMode: 'bankruptcy' | 'four-winds' }) => {
  gameSessionStore.startLocalRound(payload)
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

    <MatchSetupModal
      v-if="needsMatchSetup"
      :default-initial-chips="1000"
      @submit="handleMatchSetupSubmit"
    />

    <GameTableView
      v-if="snapshot != null"
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
