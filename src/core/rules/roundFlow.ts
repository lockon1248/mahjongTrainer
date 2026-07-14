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
  PlayersBySeat
} from '@/core/rules/types'

export const createBaselineRound = (input: { wall: Tile[]; ruleConfig?: MahjongRuleConfig }): BaselineRoundState => {
  let remainingWall = [...input.wall]
  const players = createPlayersBySeat()
  const effectiveRuleConfig = getRoundFlowRuleConfig(input.ruleConfig ?? createBaselineRuleConfig())

  for (const seat of ALL_SEATS) {
    const drawResult = drawHandToTarget({
      concealedTiles: [],
      flowers: [],
      wall: remainingWall,
      targetTileCount: seat === 'east' ? 17 : 16
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
      ...createInitialTableState(),
      wall: remainingWall
    },
    players,
    ruleConfig: effectiveRuleConfig,
    currentSeat: 'east',
    phase: 'discard',
    pendingActionWindow: null,
    outcome: { status: 'in-progress' },
    lastClaimResolution: null
  }
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

  return {
    ...round,
    currentSeat: winningClaim.seat,
    phase: 'discard',
    pendingActionWindow: null,
    lastClaimResolution: asClaimResolution(winningClaim)
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
    return candidate.actionType === claim.actionType
      && isSameTile(candidate.tile, claim.tile!)
      && areSameTiles(candidate.consumedTiles, claim.consumedTiles ?? [])
  })
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

const getNextSeat = (seat: Seat): Seat => {
  const currentIndex = ALL_SEATS.indexOf(seat)

  return ALL_SEATS[(currentIndex + 1) % ALL_SEATS.length]!
}

const isSameTile = (left: Tile, right: Tile): boolean => {
  return left.suit === right.suit && left.rank === right.rank
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

const areSameTiles = (left: Tile[], right: Tile[]): boolean => {
  if (left.length !== right.length)
    return false

  return left.every((tile, index) => {
    return right[index] != null && isSameTile(tile, right[index]!)
  })
}
