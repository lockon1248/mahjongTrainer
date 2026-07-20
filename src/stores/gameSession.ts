import { computed, shallowRef } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
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
import { DEFAULT_MATCH_INITIAL_CHIPS, MIN_MATCH_INITIAL_CHIPS } from '@/views/game/matchSetup'

const HUMAN_SEAT: Seat = 'east'
const MATCH_BASE_STAKE = 30
const MATCH_TAI_VALUE = 10

type MatchVictoryMode = 'bankruptcy' | 'four-winds'

type MatchConfig = {
  initialChips: number
  victoryMode: MatchVictoryMode
  baseStake: number
  taiValue: number
}

export type RoundChipSettlement = {
  chipDeltaBySeat: Record<Seat, number>
  chipsAfterBySeat: Record<Seat, number>
}

type MatchState = {
  config: MatchConfig | null
  chipsBySeat: Record<Seat, number>
  status: 'setup' | 'in-progress' | 'ended'
  winnerSeat: Seat | null
  lastSettledRoundKey: string | null
  lastRoundSettlement: RoundChipSettlement | null
}

export const useGameSessionStore = defineStore('game-session', () => {
  const round = shallowRef<BaselineRoundState | null>(null)
  const error = shallowRef<string | null>(null)
  const match = shallowRef<MatchState>({
    config: null,
    chipsBySeat: createChipsBySeat(0),
    status: 'setup',
    winnerSeat: null,
    lastSettledRoundKey: null,
    lastRoundSettlement: null
  })

  const isInitialized = computed(() => round.value != null)
  const needsMatchSetup = computed(() => match.value.config == null)
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

  const startLocalRound = (input?: { initialChips?: number; victoryMode?: MatchVictoryMode }) => {
    try {
      const config = createMatchConfig({
        initialChips: input?.initialChips ?? DEFAULT_MATCH_INITIAL_CHIPS,
        victoryMode: input?.victoryMode ?? 'bankruptcy'
      })

      match.value = {
        config,
        chipsBySeat: createChipsBySeat(config.initialChips),
        status: 'in-progress',
        winnerSeat: null,
        lastSettledRoundKey: null,
        lastRoundSettlement: null
      }
      round.value = createBaselineRound({
        wall: createBaselineWall()
      })
      error.value = null
    }
    catch (caughtError) {
      round.value = null
      match.value = {
        config: null,
        chipsBySeat: createChipsBySeat(0),
        status: 'setup',
        winnerSeat: null,
        lastSettledRoundKey: null,
        lastRoundSettlement: null
      }
      error.value = caughtError instanceof Error ? caughtError.message : 'unknown-error'
    }
  }

  const startNextRound = () => {
    const currentRound = requireRound()

    if (match.value.status === 'ended')
      return

    const didEndMatch = applyMatchSettlement(currentRound)

    if (didEndMatch)
      return

    runRoundTransition(() => createNextRoundFromCompletedRound(currentRound, {
      wall: createBaselineWall()
    }))
  }

  const resetMatch = () => {
    round.value = null
    error.value = null
    match.value = {
      config: null,
      chipsBySeat: createChipsBySeat(0),
      status: 'setup',
      winnerSeat: null,
      lastSettledRoundKey: null,
      lastRoundSettlement: null
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
    const currentRound = requireRound()

    if (isWaitingForHumanDiscard(currentRound) || isWaitingForHumanClaim(currentRound) || currentRound.phase === 'ended')
      return

    runRoundTransition(() => {
      if (currentRound.phase === 'draw')
        return drawForCurrentSeat(currentRound)

      if (currentRound.phase === 'discard') {
        const legalSelfTurnActions = getLegalSelfTurnCandidates(currentRound, currentRound.currentSeat)

        if (legalSelfTurnActions.length > 0) {
          const aiSelfTurnDecision = chooseAiSelfTurnDecision({
            seat: currentRound.currentSeat,
            concealedTiles: currentRound.players[currentRound.currentSeat].concealedTiles,
            melds: currentRound.players[currentRound.currentSeat].melds,
            flowers: currentRound.players[currentRound.currentSeat].flowers,
            candidates: legalSelfTurnActions,
            ruleConfig: createBaselineRuleConfig()
          })

          return applyHumanSelfTurnAction(currentRound, {
            seat: currentRound.currentSeat,
            actionType: aiSelfTurnDecision.actionType,
            consumedTiles: aiSelfTurnDecision.consumedTiles,
            meldTile: aiSelfTurnDecision.meldTile
          })
        }

        const aiContext = createAiDecisionContext(currentRound, {
          seat: currentRound.currentSeat
        })
        const decision = chooseAiDiscardDecision({
          seat: aiContext.seat,
          concealedTiles: aiContext.legalDiscards,
          melds: aiContext.melds,
          flowers: aiContext.flowers,
          ruleConfig: createBaselineRuleConfig()
        })

        return discardTile(currentRound, {
          seat: currentRound.currentSeat,
          tile: decision.tile
        })
      }

      return resolveClaimWindow(currentRound, collectAiClaims(currentRound))
    })
  }

  const requireRound = (): BaselineRoundState => {
    if (round.value == null)
      throw new Error('round is not initialized')

    return round.value
  }

  const runRoundTransition = (apply: () => BaselineRoundState) => {
    try {
      const previousRound = round.value
      const nextRound = apply()
      round.value = nextRound
      reconcileMatchState(previousRound, nextRound)
      error.value = null
    }
    catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'unknown-error'
    }
  }

  const reconcileMatchState = (
    previousRound: BaselineRoundState | null,
    nextRound: BaselineRoundState
  ) => {
    if (match.value.config == null)
      return

    if (nextRound.phase === 'ended' && previousRound?.phase !== 'ended')
      applyMatchSettlement(nextRound)
  }

  const applyMatchSettlement = (completedRound: BaselineRoundState): boolean => {
    const currentConfig = match.value.config

    if (currentConfig == null)
      return false

    if (completedRound.phase !== 'ended' || completedRound.outcome.status === 'in-progress')
      return false

    const settlementKey = getRoundSettlementKey(completedRound)

    if (match.value.lastSettledRoundKey === settlementKey)
      return match.value.status === 'ended'

    if (completedRound.outcome.status === 'win') {
      const amount = currentConfig.baseStake + ((completedRound.outcome.result.totalTai ?? 0) * currentConfig.taiValue)
      const nextChips = { ...match.value.chipsBySeat }
      const chipDeltaBySeat = createChipsBySeat(0)
      const winnerSeat = completedRound.outcome.result.winnerSeat!
      const discarderSeat = completedRound.outcome.result.discarderSeat

      if (discarderSeat == null) {
        for (const seat of ALL_SEATS) {
          if (seat === winnerSeat)
            continue

          nextChips[seat] -= amount
          nextChips[winnerSeat] += amount
          chipDeltaBySeat[seat] -= amount
          chipDeltaBySeat[winnerSeat] += amount
        }
      }
      else {
        nextChips[discarderSeat] -= amount
        nextChips[winnerSeat] += amount
        chipDeltaBySeat[discarderSeat] -= amount
        chipDeltaBySeat[winnerSeat] += amount
      }

      match.value = {
        ...match.value,
        chipsBySeat: nextChips,
        lastSettledRoundKey: settlementKey,
        lastRoundSettlement: {
          chipDeltaBySeat,
          chipsAfterBySeat: { ...nextChips }
        }
      }
    }
    else {
      match.value = {
        ...match.value,
        lastSettledRoundKey: settlementKey,
        lastRoundSettlement: {
          chipDeltaBySeat: createChipsBySeat(0),
          chipsAfterBySeat: { ...match.value.chipsBySeat }
        }
      }
    }

    if (currentConfig.victoryMode === 'bankruptcy') {
      if (Object.values(match.value.chipsBySeat).some(chips => chips <= 0)) {
        match.value = {
          ...match.value,
          status: 'ended',
          winnerSeat: getChipLeader(match.value.chipsBySeat)
        }
      }
      return match.value.status === 'ended'
    }

    if (didCompleteFourWindsMatch(completedRound)) {
      match.value = {
        ...match.value,
        status: 'ended',
        winnerSeat: getChipLeader(match.value.chipsBySeat)
      }
    }

    return match.value.status === 'ended'
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
    match,
    error,
    isInitialized,
    needsMatchSetup,
    humanSeat,
    availableHumanClaims,
    availableHumanSelfTurnActions,
    startLocalRound,
    resetMatch,
    startNextRound,
    drawCurrentSeat,
    discard,
    resolveClaims,
    submitHumanClaim,
    submitHumanSelfTurnAction,
    advanceTurn
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameSessionStore, import.meta.hot))

const createMatchConfig = (input: {
  initialChips: number
  victoryMode: MatchVictoryMode
}): MatchConfig => {
  if (input.initialChips < MIN_MATCH_INITIAL_CHIPS)
    throw new Error(`initial chips must be at least ${MIN_MATCH_INITIAL_CHIPS}`)

  return {
    initialChips: input.initialChips,
    victoryMode: input.victoryMode,
    baseStake: MATCH_BASE_STAKE,
    taiValue: MATCH_TAI_VALUE
  }
}

const createChipsBySeat = (amount: number): Record<Seat, number> => ({
  east: amount,
  south: amount,
  west: amount,
  north: amount
})

const getChipLeader = (chipsBySeat: Record<Seat, number>): Seat => {
  return ALL_SEATS.reduce((leader, seat) => {
    return chipsBySeat[seat] > chipsBySeat[leader] ? seat : leader
  }, 'east')
}

const didCompleteFourWindsMatch = (completedRound: BaselineRoundState): boolean => {
  if (completedRound.table.prevailingWind !== 'north')
    return false

  const previewNextRound = createNextRoundFromCompletedRound(completedRound, {
    wall: createBaselineWall()
  })

  return previewNextRound.table.prevailingWind === 'north'
    ? false
    : previewNextRound.table.prevailingWind === 'east'
}

const getRoundSettlementKey = (round: BaselineRoundState): string => {
  if (round.outcome.status === 'draw') {
    return [
      'draw',
      round.table.prevailingWind,
      round.table.dealerSeat,
      round.outcome.result.drawReason
    ].join(':')
  }

  if (round.outcome.status !== 'win')
    return ['in-progress', round.table.prevailingWind, round.table.dealerSeat].join(':')

  return [
    'win',
    round.table.prevailingWind,
    round.table.dealerSeat,
    round.outcome.result.winnerSeat,
    round.outcome.result.discarderSeat ?? 'self-draw',
    String(round.outcome.result.totalTai ?? 0)
  ].join(':')
}
