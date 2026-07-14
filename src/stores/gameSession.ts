import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import {
  chooseAiClaimDecision,
  chooseAiDiscardDecision,
  chooseAiSelfTurnDecision,
  createAiDecisionContext,
  createBaselineRound,
  createBaselineRuleConfig,
  createBaselineWall,
  createNextRoundFromCompletedRound,
  discardTile,
  drawForCurrentSeat,
  getLegalClaimCandidates,
  getLegalSelfTurnCandidates,
  resolveClaimWindow,
  applyHumanSelfTurnAction,
  type BaselineRoundState,
  type HumanClaimActionType,
  type HumanClaimCandidate,
  type HumanSelfTurnActionType,
  type HumanSelfTurnCandidate,
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
  const availableHumanClaims = computed<HumanClaimCandidate[]>(() => {
    if (round.value == null)
      return []

    return getLegalClaimCandidates(round.value, humanSeat)
  })
  const availableHumanSelfTurnActions = computed<HumanSelfTurnCandidate[]>(() => {
    if (round.value == null)
      return []

    return getLegalSelfTurnCandidates(round.value, humanSeat)
  })

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

  const startNextRound = () => {
    const currentRound = requireRound()

    runRoundTransition(() => createNextRoundFromCompletedRound(currentRound, {
      wall: createBaselineWall()
    }))

    if (round.value != null && !isWaitingForHumanDiscard(round.value) && !isWaitingForHumanClaim(round.value) && round.value.phase !== 'ended')
      advanceTurn()
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

  const submitHumanClaim = (actionType: HumanClaimActionType, consumedTiles: Tile[] = []) => {
    const currentRound = requireRound()
    const selectedCandidate = availableHumanClaims.value.find((candidate) => {
      return candidate.actionType === actionType && areSameTiles(candidate.consumedTiles, consumedTiles)
    })

    if (selectedCandidate == null) {
      error.value = 'human claim is not currently legal'
      return
    }

    const aiClaims = collectAiClaims(currentRound)
    const humanClaim: PendingActionClaim | null = selectedCandidate.actionType === 'pass'
      ? null
      : {
          seat: humanSeat,
          actionType: selectedCandidate.actionType,
          tile: selectedCandidate.tile,
          consumedTiles: selectedCandidate.consumedTiles
        }

    runRoundTransition(() => resolveClaimWindow(currentRound, humanClaim == null ? aiClaims : [humanClaim, ...aiClaims]))
  }

  const submitHumanSelfTurnAction = (
    actionType: HumanSelfTurnActionType,
    consumedTiles: Tile[] = [],
    meldTile: Tile | null = null
  ) => {
    const currentRound = requireRound()
    const selectedCandidate = availableHumanSelfTurnActions.value.find((candidate) => {
      return candidate.actionType === actionType
        && areSameTiles(candidate.consumedTiles, consumedTiles)
        && areSameOptionalTile(candidate.meldTile, meldTile)
    })

    if (selectedCandidate == null) {
      error.value = 'human self-turn action is not currently legal'
      return
    }

    runRoundTransition(() => applyHumanSelfTurnAction(currentRound, {
      seat: humanSeat,
      actionType: selectedCandidate.actionType,
      consumedTiles: selectedCandidate.consumedTiles,
      meldTile: selectedCandidate.meldTile
    }))
  }

  const advanceTurn = () => {
    const initialRound = requireRound()

    if (isWaitingForHumanDiscard(initialRound) || isWaitingForHumanClaim(initialRound) || initialRound.phase === 'ended')
      return

    runRoundTransition(() => {
      let nextRound = initialRound

      for (let step = 0; step < TURN_ADVANCEMENT_LIMIT; step += 1) {
        if (nextRound.phase === 'ended' || isWaitingForHumanDiscard(nextRound) || isWaitingForHumanClaim(nextRound))
          return nextRound

        if (nextRound.phase === 'draw') {
          nextRound = drawForCurrentSeat(nextRound)
          continue
        }

        if (nextRound.phase === 'discard') {
          const legalSelfTurnActions = getLegalSelfTurnCandidates(nextRound, nextRound.currentSeat)

          if (legalSelfTurnActions.length > 0) {
            const aiSelfTurnDecision = chooseAiSelfTurnDecision({
              seat: nextRound.currentSeat,
              concealedTiles: nextRound.players[nextRound.currentSeat].concealedTiles,
              melds: nextRound.players[nextRound.currentSeat].melds,
              flowers: nextRound.players[nextRound.currentSeat].flowers,
              candidates: legalSelfTurnActions,
              ruleConfig: createBaselineRuleConfig()
            })

            nextRound = applyHumanSelfTurnAction(nextRound, {
              seat: nextRound.currentSeat,
              actionType: aiSelfTurnDecision.actionType,
              consumedTiles: aiSelfTurnDecision.consumedTiles,
              meldTile: aiSelfTurnDecision.meldTile
            })
            continue
          }

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
    return ALL_SEATS.filter(seat => seat !== humanSeat && seat !== currentRound.pendingActionWindow?.triggeringSeat).map((seat) => {
      const legalClaims = getLegalClaimCandidates(currentRound, seat)
      const aiContext = createAiDecisionContext(currentRound, {
        seat,
        legalClaims
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
        tile: decision.tile,
        consumedTiles: decision.consumedTiles ?? []
      }
    })
  }

  const isWaitingForHumanDiscard = (currentRound: BaselineRoundState): boolean => {
    return currentRound.currentSeat === humanSeat
      && currentRound.phase === 'discard'
      && currentRound.outcome.status === 'in-progress'
  }

  const isWaitingForHumanClaim = (currentRound: BaselineRoundState): boolean => {
    if (currentRound.phase !== 'claim-window' || currentRound.outcome.status !== 'in-progress')
      return false

    return getLegalClaimCandidates(currentRound, humanSeat).some(candidate => candidate.actionType !== 'pass')
  }

  const areSameTiles = (left: Tile[], right: Tile[]): boolean => {
    if (left.length !== right.length)
      return false

    return left.every((tile, index) => {
      const rightTile = right[index]

      return rightTile != null && tile.suit === rightTile.suit && tile.rank === rightTile.rank
    })
  }

  const areSameOptionalTile = (left: Tile | null, right: Tile | null): boolean => {
    if (left == null || right == null)
      return left === right

    return left.suit === right.suit && left.rank === right.rank
  }

  return {
    round,
    error,
    isInitialized,
    humanSeat,
    availableHumanClaims,
    availableHumanSelfTurnActions,
    startLocalRound,
    startNextRound,
    drawCurrentSeat,
    discard,
    resolveClaims,
    submitHumanClaim,
    submitHumanSelfTurnAction,
    advanceTurn
  }
})
