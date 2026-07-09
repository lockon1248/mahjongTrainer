import type { PendingActionClaim, PendingActionWindow } from '@/core/types/action'
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
  PlayersBySeat
} from '@/core/rules/types'

const CLAIM_PRIORITIES: Record<ClaimResolutionType, number> = {
  win: 0,
  'kan-exposed': 1,
  pon: 2,
  chi: 3,
  pass: 4
}

export const createBaselineRound = (input: { wall: Tile[] }): BaselineRoundState => {
  let remainingWall = [...input.wall]
  const players = createPlayersBySeat()

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

  const validClaims = claims.filter((claim) => isValidClaim(claim, pendingActionWindow))
  const winningClaim = pickHighestPriorityClaim(validClaims)

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
      result: createDrawRoundResult()
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

const isValidClaim = (claim: PendingActionClaim, pendingActionWindow: PendingActionWindow): boolean => {
  if (claim.tile == null || pendingActionWindow.triggeringTile == null)
    return false

  if (claim.seat === pendingActionWindow.triggeringSeat)
    return false

  if (!isSameTile(claim.tile, pendingActionWindow.triggeringTile))
    return false

  return claim.actionType === 'win'
    || claim.actionType === 'kan-exposed'
    || claim.actionType === 'pon'
    || claim.actionType === 'chi'
}

const pickHighestPriorityClaim = (claims: PendingActionClaim[]): PendingActionClaim | null => {
  if (claims.length === 0)
    return null

  return [...claims].sort((left, right) => {
    const leftPriority = CLAIM_PRIORITIES[left.actionType as ClaimResolutionType]
    const rightPriority = CLAIM_PRIORITIES[right.actionType as ClaimResolutionType]

    if (leftPriority !== rightPriority)
      return leftPriority - rightPriority

    return ALL_SEATS.indexOf(left.seat) - ALL_SEATS.indexOf(right.seat)
  })[0]!
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
