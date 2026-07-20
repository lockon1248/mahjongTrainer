import type { MahjongRuleConfig } from '@/core/config'
import {
  applyHumanSelfTurnAction,
  createBaselineRound,
  discardTile,
  resolveClaimWindow
} from '@/core/rules/roundFlow'
import type { BaselineRoundState } from '@/core/rules/types'
import { ALL_SEATS, type Seat } from '@/core/types/seat'
import { isFlowerTile, type Tile } from '@/core/types/tile'
import { createBaselineWall } from '@/core/wall'

type ScenarioHands = Partial<Record<Seat, Tile[]>>

type ClaimWindowScenarioInput = {
  triggeringSeat: Seat
  triggeringTile: Tile
  hands?: ScenarioHands
  ruleConfig?: MahjongRuleConfig
  emptyWallAfterDeal?: boolean
}

const defaultWinningHand = (): Tile[] => [
  ...numberTiles('characters', 1, 2, 3),
  ...numberTiles('dots', 1, 2, 3, 9, 9, 9),
  ...numberTiles('bamboo', 1, 2, 3),
  ...windTiles('east', 'east', 'east'),
  dragonTile('red')
]

const defaultSelfDrawHand = (): Tile[] => [
  ...defaultWinningHand(),
  dragonTile('red')
]

export const createReachableClaimWindowScenario = (
  input: ClaimWindowScenarioInput
): BaselineRoundState => {
  const specifiedTriggeringHand = input.hands?.[input.triggeringSeat] ?? []
  const hands = {
    ...input.hands,
    [input.triggeringSeat]: [input.triggeringTile, ...specifiedTriggeringHand]
  }
  const round = createBaselineRound({
    wall: buildScenarioWall(input.triggeringSeat, hands, input.emptyWallAfterDeal),
    dealerSeat: input.triggeringSeat,
    ruleConfig: input.ruleConfig
  })
  const claimWindow = discardTile(round, {
    seat: input.triggeringSeat,
    tile: input.triggeringTile
  })

  assertRoundScenarioInvariants(claimWindow)
  return claimWindow
}

export const createReachableExhaustiveDrawScenario = (): BaselineRoundState => {
  const claimWindow = createReachableExhaustiveDrawClaimWindowScenario()
  const draw = resolveClaimWindow(claimWindow, [])

  assertRoundScenarioInvariants(draw)
  return draw
}

export const createReachableExhaustiveDrawClaimWindowScenario = (): BaselineRoundState => {
  const dealerSeat: Seat = 'east'
  const wall = buildScenarioWall(dealerSeat, {}, true)
  const round = createBaselineRound({ wall, dealerSeat })
  const triggeringTile = round.players[dealerSeat].concealedTiles[0]!
  const claimWindow = discardTile(round, { seat: dealerSeat, tile: triggeringTile })

  assertRoundScenarioInvariants(claimWindow)
  return claimWindow
}

export const createReachableDiscardWinScenario = (input?: {
  winnerSeat?: Seat
  triggeringSeat?: Seat
  triggeringTile?: Tile
  ruleConfig?: MahjongRuleConfig
}): BaselineRoundState => {
  const winnerSeat = input?.winnerSeat ?? 'east'
  const triggeringSeat = input?.triggeringSeat ?? 'south'
  const triggeringTile = input?.triggeringTile ?? dragonTile('red')
  const claimWindow = createReachableClaimWindowScenario({
    triggeringSeat,
    triggeringTile,
    ruleConfig: input?.ruleConfig,
    hands: {
      [winnerSeat]: defaultWinningHand()
    }
  })
  const win = resolveClaimWindow(claimWindow, [{
    seat: winnerSeat,
    actionType: 'win',
    tile: triggeringTile
  }])

  assertRoundScenarioInvariants(win)
  return win
}

export const createReachableSelfDrawWinScenario = (input?: {
  winnerSeat?: Seat
  ruleConfig?: MahjongRuleConfig
}): BaselineRoundState => {
  const round = createReachableSelfDrawOpportunityScenario(input)
  const winnerSeat = input?.winnerSeat ?? 'east'
  const win = applyHumanSelfTurnAction(round, {
    seat: winnerSeat,
    actionType: 'win-self-draw'
  })

  assertRoundScenarioInvariants(win)
  return win
}

export const createReachableSelfDrawOpportunityScenario = (input?: {
  winnerSeat?: Seat
  ruleConfig?: MahjongRuleConfig
}): BaselineRoundState => {
  const winnerSeat = input?.winnerSeat ?? 'east'
  const round = createBaselineRound({
    wall: buildScenarioWall(winnerSeat, { [winnerSeat]: defaultSelfDrawHand() }),
    dealerSeat: winnerSeat,
    ruleConfig: input?.ruleConfig
  })
  assertRoundScenarioInvariants(round)
  return round
}

export const assertRoundScenarioInvariants = (round: BaselineRoundState): void => {
  const isTerminal = round.outcome.status !== 'in-progress'

  if ((round.phase === 'ended') !== isTerminal)
    throw new Error('phase/outcome invariant violated')

  if (round.phase === 'claim-window') {
    const pending = round.pendingActionWindow
    const triggeringSeat = pending?.triggeringSeat
    const triggeringTile = pending?.triggeringTile
    const finalSequenceTile = round.table.discardSequence.at(-1)
    const finalSeatTile = triggeringSeat == null ? null : round.table.discards[triggeringSeat].at(-1)

    if (triggeringSeat == null || triggeringTile == null || finalSequenceTile == null || finalSeatTile == null
      || !isSameTile(triggeringTile, finalSequenceTile) || !isSameTile(triggeringTile, finalSeatTile))
      throw new Error('claim/discard invariant violated')
  }
  else if (round.pendingActionWindow != null) {
    throw new Error('phase/outcome invariant violated: pending claim outside claim-window')
  }

  if (round.outcome.status === 'draw' && round.table.wall.length !== 0)
    throw new Error('wall/draw invariant violated')

  if (round.outcome.status === 'win') {
    const winnerSeat = round.outcome.result.winnerSeat

    if (winnerSeat == null)
      throw new Error('winning effective count invariant violated: missing winner')

    const winner = round.players[winnerSeat]
    const effectiveTileCount = winner.concealedTiles.length
      + winner.melds.length * 3
      + (round.outcome.result.discarderSeat == null ? 0 : 1)

    if (effectiveTileCount !== 17)
      throw new Error(`winning effective count invariant violated: expected 17, received ${effectiveTileCount}`)
  }

  const tileCounts = new Map<string, number>()
  const countTile = (tile: Tile): void => {
    const key = tileKey(tile)
    tileCounts.set(key, (tileCounts.get(key) ?? 0) + 1)
  }

  round.table.wall.forEach(countTile)
  Object.values(round.table.discards).flat().forEach(countTile)

  for (const player of Object.values(round.players)) {
    player.concealedTiles.forEach(countTile)
    player.flowers.forEach(countTile)
    player.melds.flatMap(meld => meld.tiles).forEach(countTile)
  }

  for (const [key, count] of tileCounts) {
    const maximum = key.startsWith('flower:') ? 1 : 4

    if (count > maximum)
      throw new Error(`physical tile inventory invariant violated: ${key} appears ${count} times`)
  }
}

const buildScenarioWall = (
  dealerSeat: Seat,
  specifiedHands: ScenarioHands,
  dealOnly = false
): Tile[] => {
  const inventory = createBaselineWall(() => 0.5)
  const hands: Record<Seat, Tile[]> = {
    east: [],
    south: [],
    west: [],
    north: []
  }

  for (const seat of ALL_SEATS) {
    const requested = [...(specifiedHands[seat] ?? [])]
    const targetCount = seat === dealerSeat ? 17 : 16

    if (requested.length > targetCount)
      throw new Error(`scenario hand for ${seat} exceeds ${targetCount} tiles`)

    for (const tile of requested)
      removeInventoryTile(inventory, tile)

    while (requested.length < targetCount) {
      const tileIndex = inventory.findIndex(tile => !isFlowerTile(tile))
      const [tile] = inventory.splice(tileIndex, 1)

      if (tile == null)
        throw new Error('scenario inventory cannot fill all hands')

      requested.push(tile)
    }

    hands[seat] = requested
  }

  const dealtTiles = ALL_SEATS.flatMap(seat => hands[seat])
  return dealOnly ? dealtTiles : [...dealtTiles, ...inventory]
}

const removeInventoryTile = (inventory: Tile[], requestedTile: Tile): void => {
  const tileIndex = inventory.findIndex(tile => isSameTile(tile, requestedTile))

  if (tileIndex < 0)
    throw new Error(`scenario tile exceeds physical inventory: ${tileKey(requestedTile)}`)

  inventory.splice(tileIndex, 1)
}

const tileKey = (tile: Tile): string => `${tile.suit}:${tile.rank}`

const isSameTile = (left: Tile, right: Tile): boolean => {
  return left.suit === right.suit && left.rank === right.rank
}

const numberTiles = (
  suit: 'characters' | 'dots' | 'bamboo',
  ...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>
): Tile[] => ranks.map(rank => ({ suit, rank }))

const windTiles = (...ranks: Array<'east' | 'south' | 'west' | 'north'>): Tile[] => {
  return ranks.map(rank => ({ suit: 'winds', rank }))
}

const dragonTile = (rank: 'red' | 'green' | 'white'): Tile => ({ suit: 'dragons', rank })
