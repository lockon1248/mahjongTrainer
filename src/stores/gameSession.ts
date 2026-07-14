import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import {
  chooseAiClaimDecision,
  chooseAiDiscardDecision,
  createAiDecisionContext,
  createBaselineRound,
  createBaselineRuleConfig,
  createBaselineWall,
  discardTile,
  drawForCurrentSeat,
  resolveClaimWindow,
  type BaselineRoundState,
  type PendingActionClaim,
  ALL_SEATS,
  type Seat,
  type Tile
} from '@/core'

const HUMAN_SEAT: Seat = 'east'
const TURN_ADVANCEMENT_LIMIT = 32

export const useGameSessionStore = defineStore('game-session', () => {
  const round = shallowRef<BaselineRoundState | null>(null)
  const error = shallowRef<string | null>(null)

  const isInitialized = computed(() => round.value != null)
  const humanSeat = HUMAN_SEAT

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

  const drawCurrentSeat = () => {
    const currentRound = requireRound()

    runRoundTransition(() => drawForCurrentSeat(currentRound))
  }

  const discard = (tile: Tile) => {
    const currentRound = requireRound()

    runRoundTransition(() => discardTile(currentRound, {
      seat: humanSeat,
      tile
    }))
  }

  const resolveClaims = () => {
    const currentRound = requireRound()
    const claims = collectAiClaims(currentRound)

    runRoundTransition(() => resolveClaimWindow(currentRound, claims))
  }

  const advanceTurn = () => {
    const initialRound = requireRound()

    if (isWaitingForHumanDiscard(initialRound) || initialRound.phase === 'ended')
      return

    runRoundTransition(() => {
      let nextRound = initialRound

      for (let step = 0; step < TURN_ADVANCEMENT_LIMIT; step += 1) {
        if (nextRound.phase === 'ended' || isWaitingForHumanDiscard(nextRound))
          return nextRound

        if (nextRound.phase === 'draw') {
          nextRound = drawForCurrentSeat(nextRound)
          continue
        }

        if (nextRound.phase === 'discard') {
          const aiContext = createAiDecisionContext(nextRound, {
            seat: nextRound.currentSeat
          })
          const decision = chooseAiDiscardDecision({
            seat: aiContext.seat,
            concealedTiles: aiContext.legalDiscards,
            melds: aiContext.melds,
            flowers: aiContext.flowers,
            ruleConfig: createBaselineRuleConfig()
          })

          nextRound = discardTile(nextRound, {
            seat: nextRound.currentSeat,
            tile: decision.tile
          })
          continue
        }

        nextRound = resolveClaimWindow(nextRound, collectAiClaims(nextRound))
      }

      throw new Error(`advanceTurn exceeded ${TURN_ADVANCEMENT_LIMIT} steps`)
    })
  }

  const requireRound = (): BaselineRoundState => {
    if (round.value == null)
      throw new Error('round is not initialized')

    return round.value
  }

  const runRoundTransition = (apply: () => BaselineRoundState) => {
    try {
      round.value = apply()
      error.value = null
    }
    catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'unknown-error'
    }
  }

  const collectAiClaims = (currentRound: BaselineRoundState): PendingActionClaim[] => {
    const triggeringTile = currentRound.pendingActionWindow?.triggeringTile ?? null

    return ALL_SEATS.filter(seat => seat !== humanSeat && seat !== currentRound.pendingActionWindow?.triggeringSeat).map((seat) => {
      const aiContext = createAiDecisionContext(currentRound, {
        seat,
        legalClaims: triggeringTile == null
          ? []
          : [{ actionType: 'pass', tile: triggeringTile }]
      })
      const decision = chooseAiClaimDecision({
        seat: aiContext.seat,
        concealedTiles: aiContext.concealedTiles,
        melds: aiContext.melds,
        flowers: aiContext.flowers,
        triggeringTile: aiContext.triggeringTile,
        candidates: aiContext.legalClaims,
        ruleConfig: createBaselineRuleConfig()
      })

      return {
        seat,
        actionType: decision.actionType,
        tile: decision.tile
      }
    })
  }

  const isWaitingForHumanDiscard = (currentRound: BaselineRoundState): boolean => {
    return currentRound.currentSeat === humanSeat
      && currentRound.phase === 'discard'
      && currentRound.outcome.status === 'in-progress'
  }

  return {
    round,
    error,
    isInitialized,
    humanSeat,
    startLocalRound,
    drawCurrentSeat,
    discard,
    resolveClaims,
    advanceTurn
  }
})
