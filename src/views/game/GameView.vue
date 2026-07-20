<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
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

const stageFrameRef = useTemplateRef<HTMLElement>('stageFrame')
const stageScalerRef = useTemplateRef<HTMLElement>('stageScaler')
const stageScale = shallowRef(1)
let stageResizeObserver: ResizeObserver | null = null
let stageMeasureRaf: number | null = null

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

const clearStageMeasureRaf = () => {
  if (stageMeasureRaf != null) {
    window.cancelAnimationFrame(stageMeasureRaf)
    stageMeasureRaf = null
  }
}

const measureStageScale = () => {
  const frame = stageFrameRef.value
  const scaler = stageScalerRef.value

  if (frame == null || scaler == null) {
    stageScale.value = 1
    return
  }

  const frameWidth = frame.clientWidth
  const frameHeight = frame.clientHeight
  const contentWidth = scaler.scrollWidth
  const contentHeight = scaler.scrollHeight

  if (frameWidth === 0 || frameHeight === 0 || contentWidth === 0 || contentHeight === 0) {
    stageScale.value = 1
    return
  }

  stageScale.value = Math.min(frameWidth / contentWidth, frameHeight / contentHeight, 1)
}

const scheduleStageMeasure = () => {
  clearStageMeasureRaf()

  stageMeasureRaf = window.requestAnimationFrame(() => {
    stageMeasureRaf = null
    measureStageScale()
  })
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
  clearStageMeasureRaf()
  stageResizeObserver?.disconnect()
  window.removeEventListener('resize', scheduleStageMeasure)
})

onMounted(() => {
  scheduleStageMeasure()
  window.addEventListener('resize', scheduleStageMeasure)

  if (typeof ResizeObserver !== 'undefined') {
    stageResizeObserver = new ResizeObserver(() => {
      scheduleStageMeasure()
    })

    if (stageFrameRef.value != null)
      stageResizeObserver.observe(stageFrameRef.value)

    if (stageScalerRef.value != null)
      stageResizeObserver.observe(stageScalerRef.value)
  }
})

watch([
  snapshot,
  needsMatchSetup,
  error
], async () => {
  await nextTick()
  scheduleStageMeasure()
}, { immediate: true })

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
    <div class="game-stage-shell game-stage-shell--expanded" data-testid="game-stage-shell">
      <div ref="stageFrame" class="game-stage-frame game-stage-frame--expanded game-stage-frame--wide game-stage-frame--rebalanced game-stage-frame--wide-desktop" data-testid="game-stage-frame">
        <div
          ref="stageScaler"
          class="game-stage-scaler game-stage-scaler--wide game-stage-scaler--rebalanced game-stage-scaler--wide-desktop"
          data-testid="game-stage-scaler"
          :style="{ transform: `translateX(-50%) scale(${stageScale})` }"
        >
          <div class="game-stage-content">
            <div class="game-header">
              <h1 class="game-kicker">本機對局</h1>
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.game-view {
  min-height: 100%;
  height: 100%;
  overflow: hidden;
}

.game-stage-shell {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding-inline: clamp(0.1rem, 0.65vw, 0.45rem);
  padding-block-end: 0.25rem;
}

.game-stage-shell--expanded {
  display: grid;
}

.game-stage-frame {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
  width: min(100%, 112rem);
  margin-inline: auto;
}

.game-stage-frame--expanded {
  max-width: min(100%, 112rem);
}

.game-stage-frame--wide {
  width: min(100%, 112rem);
  max-width: min(100%, 112rem);
}

.game-stage-frame--rebalanced {
  width: min(100%, 112rem);
  max-width: min(100%, 112rem);
}

.game-stage-frame--wide-desktop {
  width: min(100%, 112rem);
  max-width: min(100%, 112rem);
}

.game-stage-scaler {
  position: absolute;
  inset-block-start: 0;
  left: 50%;
  width: min(100%, 112rem);
  transform-origin: top center;
}

.game-stage-scaler--wide {
  width: min(100%, 112rem);
}

.game-stage-scaler--rebalanced {
  width: min(100%, 112rem);
}

.game-stage-scaler--wide-desktop {
  width: min(100%, 112rem);
}

.game-stage-content {
  display: grid;
  gap: 0.85rem;
  min-height: 100%;
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

.game-error {
  margin: 0;
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(150, 36, 36, 0.12);
  color: #7c1f1f;
}
</style>
