import { createBaselineRuleConfig, getRoundFlowRuleConfig, type ClaimPriorityAction, type MahjongRuleConfig } from '@/core/config'
import { validateStandardWin } from '@/core/scoring/validation'
import type { PendingActionClaim } from '@/core/types/action'
import { createPendingActionWindow } from '@/core/types/action'
import { createEmptyPlayerState } from '@/core/types/player'
import { createDrawRoundResult, createWinRoundResult } from '@/core/types/result'
import { ALL_SEATS, type Seat } from '@/core/types/seat'
import { createInitialTableState } from '@/core/types/table'
import { isFlowerTile, type Tile } from '@/core/types/tile'
import type {
  BaselineRoundState,
  ClaimResolution,
  ClaimResolutionType,
  DrawHandInput,
  DrawHandResult,
  HumanClaimCandidate,
  HumanClaimActionType,
  HumanSelfTurnAction,
  HumanSelfTurnActionType,
  HumanSelfTurnCandidate,
  PlayersBySeat
} from '@/core/rules/types'

export const createBaselineRound = (input: {
  wall: Tile[]
  ruleConfig?: MahjongRuleConfig
  dealerSeat?: Seat
  prevailingWind?: Seat
}): BaselineRoundState => {
  let remainingWall = [...input.wall]
  const players = createPlayersBySeat()
  const effectiveRuleConfig = getRoundFlowRuleConfig(input.ruleConfig ?? createBaselineRuleConfig())
  const dealerSeat = input.dealerSeat ?? 'east'
  const prevailingWind = input.prevailingWind ?? 'east'

  for (const seat of ALL_SEATS) {
    const drawResult = drawHandToTarget({
      concealedTiles: [],
      flowers: [],
      wall: remainingWall,
      targetTileCount: seat === dealerSeat ? 17 : 16
    })

    players[seat] = {
      ...players[seat],
      concealedTiles: drawResult.concealedTiles,
      flowers: drawResult.flowers
    }
    remainingWall = drawResult.wall
  }

  return {
    table: {
      ...createInitialTableState({
        dealerSeat,
        prevailingWind
      }),
      wall: remainingWall
    },
    players,
    ruleConfig: effectiveRuleConfig,
    currentSeat: dealerSeat,
    phase: 'discard',
    pendingActionWindow: null,
    outcome: { status: 'in-progress' },
    lastClaimResolution: null
  }
}

export const createNextRoundFromCompletedRound = (
  round: BaselineRoundState,
  input: { wall: Tile[] }
): BaselineRoundState => {
  if (round.phase !== 'ended' || round.outcome.status === 'in-progress')
    throw new Error('cannot create next round from an in-progress round')

  if (round.outcome.status === 'draw')
    throw new Error('cannot create next round from unresolved draw outcome')

  const nextDealerSeat = round.outcome.result.winnerSeat === round.table.dealerSeat
    ? round.table.dealerSeat
    : getNextSeat(round.outcome.result.winnerSeat!)

  return createBaselineRound({
    wall: input.wall,
    ruleConfig: {
      ...createBaselineRuleConfig(),
      claimPriorityOrder: round.ruleConfig.claimPriorityOrder,
      flowerReplacementMode: round.ruleConfig.flowerReplacementMode,
      postDraw: round.ruleConfig.postDraw
    },
    dealerSeat: nextDealerSeat,
    prevailingWind: round.table.prevailingWind
  })
}

export const drawHandToTarget = (input: DrawHandInput): DrawHandResult => {
  const concealedTiles = [...input.concealedTiles]
  const flowers = [...input.flowers]
  const wall = [...input.wall]

  while (concealedTiles.length < input.targetTileCount) {
    const nextTile = drawFromWallHead(wall)

    if (isFlowerTile(nextTile)) {
      flowers.push(nextTile)
      drawReplacementFromWallTail({ concealedTiles, flowers, wall })
      continue
    }

    concealedTiles.push(nextTile)
  }

  return {
    concealedTiles,
    flowers,
    wall
  }
}

export const discardTile = (
  round: BaselineRoundState,
  input: { seat: Seat; tile: Tile }
): BaselineRoundState => {
  if (round.phase !== 'discard' || round.currentSeat !== input.seat)
    throw new Error('cannot discard outside the active discard phase')

  const player = round.players[input.seat]
  const concealedTiles = [...player.concealedTiles]
  const tileIndex = concealedTiles.findIndex((tile) => isSameTile(tile, input.tile))

  if (tileIndex < 0)
    throw new Error('discard tile is not present in concealed tiles')

  const [discardedTile] = concealedTiles.splice(tileIndex, 1)
  const discards = {
    ...round.table.discards,
    [input.seat]: [...round.table.discards[input.seat], discardedTile]
  }

  return {
    ...round,
    table: {
      ...round.table,
      discards
    },
    players: {
      ...round.players,
      [input.seat]: {
        ...player,
        concealedTiles
      }
    },
    phase: 'claim-window',
    pendingActionWindow: {
      ...createPendingActionWindow(),
      triggeringSeat: input.seat,
      triggeringTile: discardedTile
    },
    lastClaimResolution: null
  }
}

export const resolveClaimWindow = (
  round: BaselineRoundState,
  claims: PendingActionClaim[]
): BaselineRoundState => {
  const pendingActionWindow = round.pendingActionWindow

  if (round.phase !== 'claim-window' || pendingActionWindow == null)
    throw new Error('no pending claim window to resolve')

  const validClaims = claims.filter((claim) => isValidClaim(round, claim))
  const winningClaim = pickHighestPriorityClaim(validClaims, round.ruleConfig.claimPriorityOrder)

  if (winningClaim == null) {
    const nextSeat = getNextSeat(pendingActionWindow.triggeringSeat!)
    const passedRound: BaselineRoundState = {
      ...round,
      currentSeat: nextSeat,
      phase: 'draw',
      pendingActionWindow: null,
      lastClaimResolution: {
        type: 'pass',
        seat: null,
        tile: pendingActionWindow.triggeringTile
      }
    }

    return passedRound.table.wall.length === 0
      ? evaluateExhaustiveDraw(passedRound)
      : passedRound
  }

  if (winningClaim.actionType === 'win') {
    return {
      ...round,
      currentSeat: winningClaim.seat,
      phase: 'ended',
      pendingActionWindow: null,
      lastClaimResolution: asClaimResolution(winningClaim),
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: winningClaim.seat,
          discarderSeat: pendingActionWindow.triggeringSeat
        })
      }
    }
  }

  const claimedPlayer = round.players[winningClaim.seat]
  const concealedTiles = removeTiles(claimedPlayer.concealedTiles, winningClaim.consumedTiles ?? [])
  const triggeringSeat = pendingActionWindow.triggeringSeat!
  const triggeringTile = pendingActionWindow.triggeringTile!
  const updatedDiscardPool = removeLastMatchingTile(round.table.discards[triggeringSeat], triggeringTile)
  const meldTiles = [...(winningClaim.consumedTiles ?? []), triggeringTile].sort(compareTile)

  return {
    ...round,
    currentSeat: winningClaim.seat,
    phase: 'discard',
    pendingActionWindow: null,
    lastClaimResolution: asClaimResolution(winningClaim),
    table: {
      ...round.table,
      discards: {
        ...round.table.discards,
        [triggeringSeat]: updatedDiscardPool
      }
    },
    players: {
      ...round.players,
      [winningClaim.seat]: {
        ...claimedPlayer,
        concealedTiles,
        melds: [
          ...claimedPlayer.melds,
          {
            type: winningClaim.actionType,
            tiles: meldTiles,
            claimedTile: triggeringTile,
            claimedFromSeat: triggeringSeat
          }
        ]
      }
    }
  }
}

export const drawForCurrentSeat = (round: BaselineRoundState): BaselineRoundState => {
  if (round.phase !== 'draw')
    throw new Error('cannot draw outside the draw phase')

  if (round.table.wall.length === 0)
    return evaluateExhaustiveDraw(round)

  const currentPlayer = round.players[round.currentSeat]
  const drawResult = drawHandToTarget({
    concealedTiles: currentPlayer.concealedTiles,
    flowers: currentPlayer.flowers,
    wall: round.table.wall,
    targetTileCount: currentPlayer.concealedTiles.length + 1
  })

  return {
    ...round,
    table: {
      ...round.table,
      wall: drawResult.wall
    },
    players: {
      ...round.players,
      [round.currentSeat]: {
        ...currentPlayer,
        concealedTiles: drawResult.concealedTiles,
        flowers: drawResult.flowers
      }
    },
    phase: 'discard'
  }
}

export const getLegalClaimCandidates = (
  round: BaselineRoundState,
  seat: Seat
): HumanClaimCandidate[] => {
  const pendingActionWindow = round.pendingActionWindow
  const triggeringTile = pendingActionWindow?.triggeringTile
  const triggeringSeat = pendingActionWindow?.triggeringSeat

  if (round.phase !== 'claim-window' || pendingActionWindow == null || triggeringTile == null || triggeringSeat == null)
    return []

  if (seat === triggeringSeat)
    return []

  const player = round.players[seat]
  const candidates: HumanClaimCandidate[] = [{
    actionType: 'pass',
    tile: triggeringTile,
    consumedTiles: []
  }]

  const candidatesByAction = new Map<HumanClaimActionType, HumanClaimCandidate[]>()

  if (isWinningClaim(player, triggeringTile, seat, triggeringSeat)) {
    candidatesByAction.set('win', [{
      actionType: 'win',
      tile: triggeringTile,
      consumedTiles: []
    }])
  }

  const matchingTiles = findMatchingTiles(player.concealedTiles, triggeringTile)

  if (matchingTiles.length >= 3) {
    candidatesByAction.set('kan-exposed', [{
      actionType: 'kan-exposed',
      tile: triggeringTile,
      consumedTiles: matchingTiles.slice(0, 3)
    }])
  }

  if (matchingTiles.length >= 2) {
    candidatesByAction.set('pon', [{
      actionType: 'pon',
      tile: triggeringTile,
      consumedTiles: matchingTiles.slice(0, 2)
    }])
  }

  const chiCandidates = buildChiCandidates(player.concealedTiles, triggeringTile, seat, triggeringSeat)

  if (chiCandidates.length > 0)
    candidatesByAction.set('chi', chiCandidates)

  for (const actionType of round.ruleConfig.claimPriorityOrder) {
    const actionCandidates = candidatesByAction.get(actionType)

    if (actionCandidates)
      candidates.push(...actionCandidates)
  }

  return candidates
}

export const getLegalSelfTurnCandidates = (
  round: BaselineRoundState,
  seat: Seat
): HumanSelfTurnCandidate[] => {
  if (round.phase !== 'discard' || round.currentSeat !== seat || round.outcome.status !== 'in-progress')
    return []

  const player = round.players[seat]
  const candidates: HumanSelfTurnCandidate[] = []

  if (validateStandardWin({
    concealedTiles: player.concealedTiles,
    melds: player.melds,
    flowers: player.flowers,
    winningTile: null,
    winningSeat: seat
  }).isWinning) {
    candidates.push({
      actionType: 'win-self-draw',
      tile: null,
      consumedTiles: [],
      meldTile: null
    })
  }

  for (const tile of getDistinctTiles(player.concealedTiles)) {
    const matchingTiles = findMatchingTiles(player.concealedTiles, tile)

    if (matchingTiles.length >= 4) {
      candidates.push({
        actionType: 'kan-concealed',
        tile,
        consumedTiles: matchingTiles.slice(0, 4),
        meldTile: null
      })
    }
  }

  for (const meld of player.melds) {
    if (meld.type !== 'pon')
      continue

    const [meldTile] = meld.tiles

    if (meldTile == null)
      continue

    const matchingTiles = findMatchingTiles(player.concealedTiles, meldTile)

    if (matchingTiles.length === 0)
      continue

    candidates.push({
      actionType: 'kan-added',
      tile: meldTile,
      consumedTiles: [matchingTiles[0]!],
      meldTile
    })
  }

  return candidates.sort(compareSelfTurnCandidate)
}

export const applyHumanSelfTurnAction = (
  round: BaselineRoundState,
  action: HumanSelfTurnAction
): BaselineRoundState => {
  const legalCandidate = getLegalSelfTurnCandidates(round, action.seat).find(candidate => isSameSelfTurnCandidate(candidate, action))

  if (legalCandidate == null)
    throw new Error('human self-turn action is not currently legal')

  if (legalCandidate.actionType === 'win-self-draw') {
    return {
      ...round,
      currentSeat: action.seat,
      phase: 'ended',
      pendingActionWindow: null,
      lastClaimResolution: null,
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: action.seat,
          discarderSeat: null
        })
      }
    }
  }

  if (legalCandidate.actionType === 'kan-concealed') {
    const player = round.players[action.seat]
    const concealedTiles = removeTiles(player.concealedTiles, legalCandidate.consumedTiles)
    const flowers = [...player.flowers]
    const wall = [...round.table.wall]

    drawReplacementFromWallTail({ concealedTiles, flowers, wall })

    return {
      ...round,
      currentSeat: action.seat,
      phase: 'discard',
      pendingActionWindow: null,
      lastClaimResolution: null,
      table: {
        ...round.table,
        wall
      },
      players: {
        ...round.players,
        [action.seat]: {
          ...player,
          concealedTiles,
          flowers,
          melds: [
            ...player.melds,
            {
              type: 'kan-concealed',
              tiles: legalCandidate.consumedTiles,
              claimedTile: null,
              claimedFromSeat: null
            }
          ]
        }
      }
    }
  }

  const player = round.players[action.seat]
  const concealedTiles = removeTiles(player.concealedTiles, legalCandidate.consumedTiles)
  const flowers = [...player.flowers]
  const wall = [...round.table.wall]
  const melds = player.melds.map((meld) => {
    if (meld.type !== 'pon')
      return meld

    const [meldTile] = meld.tiles

    if (meldTile == null || legalCandidate.meldTile == null || !isSameTile(meldTile, legalCandidate.meldTile))
      return meld

    return {
      ...meld,
      type: 'kan-added' as const,
      tiles: [...meld.tiles, legalCandidate.consumedTiles[0]!]
    }
  })

  drawReplacementFromWallTail({ concealedTiles, flowers, wall })

  return {
    ...round,
    currentSeat: action.seat,
    phase: 'discard',
    pendingActionWindow: null,
    lastClaimResolution: null,
    table: {
      ...round.table,
      wall
    },
    players: {
      ...round.players,
      [action.seat]: {
        ...player,
        concealedTiles,
        flowers,
        melds
      }
    }
  }
}

export const evaluateExhaustiveDraw = (round: BaselineRoundState): BaselineRoundState => {
  if (round.outcome.status !== 'in-progress')
    return round

  if (round.table.wall.length > 0)
    return round

  return {
    ...round,
    phase: 'ended',
    pendingActionWindow: null,
    outcome: {
      status: 'draw',
      result: createDrawRoundResult({
        unresolved: getUnresolvedPostDrawPolicies(round)
      })
    }
  }
}

const createPlayersBySeat = (): PlayersBySeat => {
  return {
    east: createEmptyPlayerState('east'),
    south: createEmptyPlayerState('south'),
    west: createEmptyPlayerState('west'),
    north: createEmptyPlayerState('north')
  }
}

const compareSelfTurnCandidate = (left: HumanSelfTurnCandidate, right: HumanSelfTurnCandidate): number => {
  const actionOrder: HumanSelfTurnActionType[] = ['win-self-draw', 'kan-concealed', 'kan-added']
  const actionDelta = actionOrder.indexOf(left.actionType) - actionOrder.indexOf(right.actionType)

  if (actionDelta !== 0)
    return actionDelta

  if (left.tile == null || right.tile == null)
    return left.tile == null ? -1 : 1

  return compareTile(left.tile, right.tile)
}

const drawReplacementFromWallTail = (input: {
  concealedTiles: Tile[]
  flowers: Tile[]
  wall: Tile[]
}): void => {
  while (true) {
    const replacementTile = drawFromWallTail(input.wall)

    if (isFlowerTile(replacementTile)) {
      input.flowers.push(replacementTile)
      continue
    }

    input.concealedTiles.push(replacementTile)
    return
  }
}

const getDistinctTiles = (tiles: Tile[]): Tile[] => {
  const distinct: Tile[] = []

  for (const tile of tiles) {
    if (!distinct.some(candidate => isSameTile(candidate, tile)))
      distinct.push(tile)
  }

  return distinct
}

const drawFromWallHead = (wall: Tile[]): Tile => {
  const tile = wall.shift()

  if (tile == null)
    throw new Error('wall does not contain enough tiles')

  return tile
}

const drawFromWallTail = (wall: Tile[]): Tile => {
  const tile = wall.pop()

  if (tile == null)
    throw new Error('wall does not contain enough tiles')

  return tile
}

const isValidClaim = (round: BaselineRoundState, claim: PendingActionClaim): boolean => {
  const pendingActionWindow = round.pendingActionWindow

  if (claim.tile == null || pendingActionWindow?.triggeringTile == null)
    return false

  if (claim.actionType === 'pass')
    return false

  if (!isSameTile(claim.tile, pendingActionWindow.triggeringTile))
    return false

  const legalCandidates = getLegalClaimCandidates(round, claim.seat)

  return legalCandidates.some((candidate) => {
    if (candidate.actionType !== claim.actionType || !isSameTile(candidate.tile, claim.tile!))
      return false

    if (claim.consumedTiles == null)
      return true

    return areSameTiles(candidate.consumedTiles, claim.consumedTiles)
  })
}

const isSameSelfTurnCandidate = (candidate: HumanSelfTurnCandidate, action: HumanSelfTurnAction): boolean => {
  return candidate.actionType === action.actionType
    && areSameTiles(candidate.consumedTiles, action.consumedTiles ?? [])
    && isSameOptionalTile(candidate.meldTile, action.meldTile ?? null)
}

const pickHighestPriorityClaim = (
  claims: PendingActionClaim[],
  claimPriorityOrder: ClaimPriorityAction[]
): PendingActionClaim | null => {
  if (claims.length === 0)
    return null

  return [...claims].sort((left, right) => {
    const leftPriority = claimPriorityOrder.indexOf(left.actionType as ClaimPriorityAction)
    const rightPriority = claimPriorityOrder.indexOf(right.actionType as ClaimPriorityAction)

    if (leftPriority !== rightPriority)
      return leftPriority - rightPriority

    return ALL_SEATS.indexOf(left.seat) - ALL_SEATS.indexOf(right.seat)
  })[0]!
}

const getUnresolvedPostDrawPolicies = (round: BaselineRoundState): Array<'dealer-continuation' | 'ready-hand-check' | 'ready-hand-payment'> => {
  const unresolved: Array<'dealer-continuation' | 'ready-hand-check' | 'ready-hand-payment'> = []

  if (round.ruleConfig.postDraw.dealerContinuation.status === 'unresolved')
    unresolved.push('dealer-continuation')

  if (round.ruleConfig.postDraw.readyHandCheck.status === 'unresolved')
    unresolved.push('ready-hand-check')

  if (round.ruleConfig.postDraw.readyHandPayment.status === 'unresolved')
    unresolved.push('ready-hand-payment')

  return unresolved
}

const asClaimResolution = (claim: PendingActionClaim): ClaimResolution => {
  return {
    type: claim.actionType as ClaimResolutionType,
    seat: claim.seat,
    tile: claim.tile
  }
}

const removeTiles = (sourceTiles: Tile[], targetTiles: Tile[]): Tile[] => {
  const remainingTiles = [...sourceTiles]

  for (const targetTile of targetTiles) {
    const tileIndex = remainingTiles.findIndex(tile => isSameTile(tile, targetTile))

    if (tileIndex === -1)
      throw new Error('required tile is not present in concealed tiles')

    remainingTiles.splice(tileIndex, 1)
  }

  return remainingTiles
}

const removeLastMatchingTile = (sourceTiles: Tile[], targetTile: Tile): Tile[] => {
  const remainingTiles = [...sourceTiles]

  for (let index = remainingTiles.length - 1; index >= 0; index -= 1) {
    if (!isSameTile(remainingTiles[index]!, targetTile))
      continue

    remainingTiles.splice(index, 1)
    return remainingTiles
  }

  throw new Error('claimed discard tile is not present in discard pool')
}

const areSameTiles = (left: Tile[], right: Tile[]): boolean => {
  if (left.length !== right.length)
    return false

  return left.every((tile, index) => {
    const otherTile = right[index]
    return otherTile != null && isSameTile(tile, otherTile)
  })
}

const isSameOptionalTile = (left: Tile | null, right: Tile | null): boolean => {
  if (left == null || right == null)
    return left === right

  return isSameTile(left, right)
}

const getNextSeat = (seat: Seat): Seat => {
  const currentIndex = ALL_SEATS.indexOf(seat)

  return ALL_SEATS[(currentIndex + 1) % ALL_SEATS.length]!
}

const isSameTile = (left: Tile, right: Tile): boolean => {
  return left.suit === right.suit && left.rank === right.rank
}

const compareTile = (left: Tile, right: Tile): number => {
  const suitOrder = ['characters', 'dots', 'bamboo', 'winds', 'dragons', 'flower'] as const
  const suitDelta = suitOrder.indexOf(left.suit) - suitOrder.indexOf(right.suit)

  if (suitDelta !== 0)
    return suitDelta

  return String(left.rank).localeCompare(String(right.rank), 'en')
}

const isWinningClaim = (
  player: PlayersBySeat[Seat],
  triggeringTile: Tile,
  seat: Seat,
  discarderSeat: Seat
): boolean => {
  return validateStandardWin({
    concealedTiles: player.concealedTiles,
    melds: player.melds,
    flowers: player.flowers,
    winningTile: triggeringTile,
    winningSeat: seat,
    discarderSeat
  }).isWinning
}

const findMatchingTiles = (concealedTiles: Tile[], targetTile: Tile): Tile[] => {
  return concealedTiles.filter((tile) => isSameTile(tile, targetTile))
}

const buildChiCandidates = (
  concealedTiles: Tile[],
  triggeringTile: Tile,
  seat: Seat,
  triggeringSeat: Seat
): HumanClaimCandidate[] => {
  if (seat !== getNextSeat(triggeringSeat))
    return []

  if (!isNumberTile(triggeringTile))
    return []

  const rankPairs: Array<[number, number]> = [
    [triggeringTile.rank - 2, triggeringTile.rank - 1],
    [triggeringTile.rank - 1, triggeringTile.rank + 1],
    [triggeringTile.rank + 1, triggeringTile.rank + 2]
  ]

  return rankPairs.flatMap(([leftRank, rightRank]) => {
    if (!isValidSequenceRank(leftRank) || !isValidSequenceRank(rightRank))
      return []

    const leftTile = concealedTiles.find((tile) => isSameTile(tile, { suit: triggeringTile.suit, rank: leftRank }))
    const rightTile = concealedTiles.find((tile) => isSameTile(tile, { suit: triggeringTile.suit, rank: rightRank }))

    if (leftTile == null || rightTile == null)
      return []

    return [{
      actionType: 'chi' as const,
      tile: triggeringTile,
      consumedTiles: [leftTile, rightTile]
    }]
  })
}

const isNumberTile = (tile: Tile): tile is Extract<Tile, { suit: 'characters' | 'dots' | 'bamboo' }> => {
  return tile.suit === 'characters' || tile.suit === 'dots' || tile.suit === 'bamboo'
}

const isValidSequenceRank = (rank: number): rank is 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 => {
  return rank >= 1 && rank <= 9
}
