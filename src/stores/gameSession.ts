import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { createBaselineRound, createBaselineWall, type BaselineRoundState } from '@/core'

export const useGameSessionStore = defineStore('game-session', () => {
  const round = shallowRef<BaselineRoundState | null>(null)
  const error = shallowRef<string | null>(null)

  const isInitialized = computed(() => round.value != null)

  const startLocalRound = () => {
    try {
      round.value = createBaselineRound({
        wall: createBaselineWall()
      })
      error.value = null
    }
    catch (caughtError) {
      round.value = null
      error.value = caughtError instanceof Error ? caughtError.message : 'unknown-error'
    }
  }

  return {
    round,
    error,
    isInitialized,
    startLocalRound
  }
})
