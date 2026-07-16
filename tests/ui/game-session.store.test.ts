import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  createBaselineRound,
  createDrawRoundResult,
  createPendingActionWindow,
  createWinRoundResult,
  getLegalClaimCandidates,
  getLegalSelfTurnCandidates,
  type BaselineRoundState,
  type Seat,
  type Tile
} from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'

const illegalDiscardTile: Tile = { suit: 'flower', rank: 'spring' }

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'characters', rank }))
}

const dots = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'dots', rank }))
}

const bamboos = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map((rank) => ({ suit: 'bamboo', rank }))
}

const wind = (rank: 'east' | 'south' | 'west' | 'north'): Tile => {
  return { suit: 'winds', rank }
}

const dragon = (rank: 'red' | 'green' | 'white'): Tile => {
  return { suit: 'dragons', rank }
}

const buildWall = (...tailTiles: Tile[]): Tile[] => {
  const pool: Tile[] = [
    ...chars(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...dots(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...bamboos(1, 2, 3, 4, 5, 6, 7, 8, 9),
    wind('east'),
    wind('south'),
    wind('west'),
    wind('north'),
    dragon('red'),
    dragon('green'),
    dragon('white')
  ]

  const base = Array.from({ length: 90 }, (_, index) => pool[index % pool.length]!)

  return [...base, ...tailTiles]
}

const createClaimWindowRound = (
  triggeringTile: Tile,
  triggeringSeat: Seat,
  seatTiles: Partial<Record<Seat, Tile[]>>
): BaselineRoundState => {
  const round = createBaselineRound({ wall: buildWall() })

  return {
    ...round,
    currentSeat: triggeringSeat,
    phase: 'claim-window',
    table: {
      ...round.table,
      discards: {
        ...round.table.discards,
        [triggeringSeat]: [triggeringTile]
      }
    },
    pendingActionWindow: {
      ...createPendingActionWindow(),
      triggeringSeat,
      triggeringTile
    },
    players: {
      east: {
        ...round.players.east,
        concealedTiles: seatTiles.east ?? round.players.east.concealedTiles
      },
      south: {
        ...round.players.south,
        concealedTiles: seatTiles.south ?? round.players.south.concealedTiles
      },
      west: {
        ...round.players.west,
        concealedTiles: seatTiles.west ?? round.players.west.concealedTiles
      },
      north: {
        ...round.players.north,
        concealedTiles: seatTiles.north ?? round.players.north.concealedTiles
      }
    }
  }
}

const createSelfTurnRound = (input: {
  concealedTiles: Tile[]
  wall?: Tile[]
  melds?: BaselineRoundState['players']['east']['melds']
}): BaselineRoundState => {
  const round = createBaselineRound({ wall: input.wall ?? buildWall() })

  return {
    ...round,
    currentSeat: 'east',
    phase: 'discard',
    players: {
      ...round.players,
      east: {
        ...round.players.east,
        concealedTiles: input.concealedTiles,
        melds: input.melds ?? []
      }
    }
  }
}

describe('game session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes a new local round from core APIs', () => {
    const store = useGameSessionStore()

    store.startLocalRound()

    expect(store.isInitialized).toBe(true)
    expect(store.round).not.toBeNull()
    expect(store.error).toBeNull()
    expect(store.round?.currentSeat).toBe('east')
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.players.east.concealedTiles).toHaveLength(17)
    expect(store.round?.players.south.concealedTiles).toHaveLength(16)
  })

  it('draws for the current seat through core and advances draw phase into discard phase', () => {
    const store = useGameSessionStore()
    store.round = createClaimWindowRound(dragon('white'), 'east', {
      south: [chars(1)[0]!, dots(1)[0]!],
      west: [chars(2)[0]!, dots(2)[0]!],
      north: [chars(4)[0]!, dots(4)[0]!]
    })
    store.resolveClaims()

    expect(store.round?.currentSeat).toBe('south')
    expect(store.round?.phase).toBe('draw')

    store.drawCurrentSeat()

    expect(store.error).toBeNull()
    expect(store.round?.currentSeat).toBe('south')
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.players.south.concealedTiles).toHaveLength(3)
  })

  it('applies a human discard through core and opens a claim window', () => {
    const store = useGameSessionStore()

    store.startLocalRound()
    const discardedTile = store.round!.players.east.concealedTiles[0]!

    store.discard(discardedTile)

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('claim-window')
    expect(store.round?.players.east.concealedTiles).toHaveLength(16)
    expect(store.round?.table.discards.east).toEqual([discardedTile])
    expect(store.round?.pendingActionWindow?.triggeringTile).toEqual(discardedTile)
  })

  it('resolves a claim window as pass when no AI seat has a legal claim candidate', () => {
    const store = useGameSessionStore()
    store.round = createClaimWindowRound(dragon('white'), 'east', {
      south: [chars(1)[0]!, dots(1)[0]!],
      west: [chars(2)[0]!, dots(2)[0]!],
      north: [chars(4)[0]!, dots(4)[0]!]
    })

    store.resolveClaims()

    expect(store.error).toBeNull()
    expect(store.round?.pendingActionWindow).toBeNull()
    expect(store.round?.currentSeat).toBe('south')
    expect(store.round?.phase).toBe('draw')
    expect(store.round?.lastClaimResolution?.type).toBe('pass')
  })

  it('advances only one AI step per call so UI pacing can schedule readable progression', () => {
    const store = useGameSessionStore()
    const baseRound = createClaimWindowRound(dragon('white'), 'east', {
      east: [chars(1)[0]!, dots(1)[0]!],
      south: [chars(2)[0]!, dots(2)[0]!],
      west: [chars(4)[0]!, dots(4)[0]!],
      north: [chars(5)[0]!, dots(5)[0]!]
    })
    store.round = {
      ...baseRound,
      table: {
        ...baseRound.table,
        wall: []
      }
    }

    store.advanceTurn()

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('ended')
    expect(store.round?.outcome.status).toBe('draw')
    expect(store.round?.lastClaimResolution?.type).toBe('pass')
  })

  it('preserves the current round and records an error when discard input is illegal', () => {
    const store = useGameSessionStore()

    store.startLocalRound()
    const previousRound = store.round

    store.discard(illegalDiscardTile)

    expect(store.error).toBe('discard tile is not present in concealed tiles')
    expect(store.round).toBe(previousRound)
    expect(store.round).not.toBeNull()
  })

  it('surfaces exhaustive draw outcomes when the wall is exhausted during turn advancement', () => {
    const store = useGameSessionStore()

    store.startLocalRound()
    store.round = {
      ...store.round!,
      table: {
        ...store.round!.table,
        wall: []
      },
      phase: 'draw',
      currentSeat: 'south'
    }

    store.advanceTurn()

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('ended')
    expect(store.round?.outcome.status).toBe('draw')
  })

  it('pauses at claim-window when the human seat has a legal candidate', () => {
    const store = useGameSessionStore()
    store.round = createClaimWindowRound({ suit: 'characters', rank: 3 }, 'north', {
      east: [
        ...chars(1, 2, 4, 5),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('south'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        chars(7)[0]!
      ]
    })

    store.advanceTurn()

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('claim-window')
    expect(store.availableHumanClaims.some(candidate => candidate.actionType === 'chi')).toBe(true)
  })

  it('submits a human pass claim and advances to the next draw turn', () => {
    const store = useGameSessionStore()
    store.round = createClaimWindowRound({ suit: 'characters', rank: 3 }, 'north', {
      east: [chars(1)[0]!, chars(2)[0]!, chars(4)[0]!, chars(5)[0]!],
      south: [dots(1)[0]!, dots(4)[0]!],
      west: [bamboos(1)[0]!, bamboos(4)[0]!]
    })

    store.submitHumanClaim('pass')

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('draw')
    expect(store.round?.currentSeat).toBe('east')
    expect(store.round?.lastClaimResolution?.type).toBe('pass')
  })

  it('submits a human non-pass claim and keeps the round on the human discard turn', () => {
    const store = useGameSessionStore()
    store.round = createClaimWindowRound({ suit: 'characters', rank: 3 }, 'north', {
      east: [chars(1)[0]!, chars(2)[0]!, chars(4)[0]!, chars(5)[0]!],
      south: [dots(1)[0]!, dots(4)[0]!],
      west: [bamboos(1)[0]!, bamboos(4)[0]!]
    })
    const chiCandidate = getLegalClaimCandidates(store.round, 'east').find(candidate => candidate.actionType === 'chi')

    if (chiCandidate == null)
      throw new Error('expected chi candidate for human seat')

    store.submitHumanClaim(chiCandidate.actionType, chiCandidate.consumedTiles)

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.currentSeat).toBe('east')
    expect(store.round?.lastClaimResolution?.type).toBe('chi')
    expect(store.round?.players.east.melds[0]?.type).toBe('chi')
    expect(store.round?.table.discards.north).toHaveLength(0)
  })

  it('exposes no human self-turn actions when the current discard turn has no legal self-turn candidate', () => {
    const store = useGameSessionStore()
    store.startLocalRound()

    expect(store.round?.phase).toBe('discard')
    expect(store.availableHumanSelfTurnActions).toEqual([])
  })

  it('submits a human self-draw win and ends the round', () => {
    const store = useGameSessionStore()
    store.round = createSelfTurnRound({
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red'),
        dragon('red')
      ]
    })

    expect(store.availableHumanSelfTurnActions.some(candidate => candidate.actionType === 'win-self-draw')).toBe(true)

    store.submitHumanSelfTurnAction('win-self-draw')

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('ended')
    expect(store.round?.outcome.status).toBe('win')
  })

  it('submits a human concealed kan and keeps the round on the human discard turn after replacement draw', () => {
    const store = useGameSessionStore()
    store.round = createSelfTurnRound({
      concealedTiles: [
        ...chars(1, 2, 3),
        ...chars(7, 7, 7, 7),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        dragon('red'),
        dragon('white')
      ],
      wall: buildWall(dragon('green'))
    })
    const concealedKanCandidate = getLegalSelfTurnCandidates(store.round, 'east').find(candidate => candidate.actionType === 'kan-concealed')

    if (concealedKanCandidate == null)
      throw new Error('expected kan-concealed candidate for human seat')

    store.submitHumanSelfTurnAction(
      concealedKanCandidate.actionType,
      concealedKanCandidate.consumedTiles,
      concealedKanCandidate.meldTile
    )

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.currentSeat).toBe('east')
    expect(store.round?.players.east.melds[0]?.type).toBe('kan-concealed')
    expect(store.round?.players.east.concealedTiles).toContainEqual(dragon('green'))
  })

  it('starts the next round after a winning outcome and applies confirmed dealer progression', () => {
    const store = useGameSessionStore()
    const completedRound = createBaselineRound({ wall: buildWall() })
    store.round = {
      ...completedRound,
      currentSeat: 'south',
      phase: 'ended',
      table: {
        ...completedRound.table,
        dealerSeat: 'east'
      },
      outcome: {
        status: 'win',
        result: createWinRoundResult({
          winnerSeat: 'south',
          discarderSeat: 'west'
        })
      }
    }

    store.startNextRound()

    expect(store.error).toBeNull()
    expect(store.round?.outcome.status).toBe('in-progress')
    expect(store.round?.table.dealerSeat).toBe('west')
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.currentSeat).toBe('west')
  })


  it('starts the next round after a draw outcome and keeps the dealer seat', () => {
    const store = useGameSessionStore()
    const completedRound = createBaselineRound({ wall: buildWall() })
    store.round = {
      ...completedRound,
      phase: 'ended',
      outcome: {
        status: 'draw',
        result: createDrawRoundResult()
      }
    }

    store.startNextRound()

    expect(store.error).toBeNull()
    expect(store.round).not.toBe(completedRound)
    expect(store.round?.outcome.status).toBe('in-progress')
    expect(store.round?.table.dealerSeat).toBe('east')
    expect(store.round?.currentSeat).toBe('east')
    expect(store.round?.phase).toBe('discard')
  })
})
