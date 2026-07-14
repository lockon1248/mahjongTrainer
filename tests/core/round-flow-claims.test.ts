import { describe, expect, it } from 'vitest'
import {
  createBaselineRuleConfig,
  createBaselineRound,
  createPendingActionWindow,
  mergeRuleConfig,
  resolveClaimWindow,
  type BaselineRoundState,
  type PendingActionClaim,
  type Seat,
  type Tile
} from '@/core/index'

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

const buildWall = (): Tile[] => {
  const pool: Tile[] = [
    ...chars(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...dots(1, 2, 3, 4, 5, 6, 7, 8, 9),
    ...bamboos(1, 2, 3, 4, 5, 6, 7, 8, 9),
    { suit: 'winds', rank: 'east' },
    { suit: 'winds', rank: 'south' },
    { suit: 'winds', rank: 'west' },
    { suit: 'winds', rank: 'north' },
    { suit: 'dragons', rank: 'red' },
    { suit: 'dragons', rank: 'green' },
    { suit: 'dragons', rank: 'white' }
  ]

  return Array.from({ length: 90 }, (_, index) => pool[index % pool.length]!)
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

describe('round flow claim resolution', () => {
  it('prefers a win claim over lower priority claims', () => {
    const discardedTile = dragon('red')
    const pendingRound = createClaimWindowRound(discardedTile, 'south', {
      east: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      south: [
        ...chars(1, 2, 3),
        ...dots(4, 5, 6, 7, 8, 9),
        ...bamboos(4, 5, 6),
        wind('south'),
        wind('south'),
        dragon('red'),
        dragon('green'),
        dragon('white')
      ]
    })
    const claims: PendingActionClaim[] = [
      { seat: 'east', actionType: 'win', tile: discardedTile },
      { seat: 'west', actionType: 'pon', tile: discardedTile, consumedTiles: [dragon('red'), dragon('red')] }
    ]

    const resolved = resolveClaimWindow(pendingRound, claims)

    expect(resolved.lastClaimResolution).toEqual({
      type: 'win',
      seat: 'east',
      tile: discardedTile
    })
    expect(resolved.outcome.status).toBe('win')
    expect(resolved.phase).toBe('ended')

    if (resolved.outcome.status !== 'win')
      throw new Error('expected win outcome')

    expect(resolved.outcome.result).toEqual({
      type: 'win',
      winnerSeat: 'east',
      discarderSeat: 'south',
      totalTai: 1,
      scoringItems: ['dealer-win'],
      drawReason: null,
      unresolved: []
    })
  })

  it('prefers exposed kan over chi when no win exists', () => {
    const discardedTile = chars(3)[0]!
    const pendingRound = createClaimWindowRound(discardedTile, 'east', {
      west: [
        ...chars(3, 3, 3),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('west'),
        wind('west'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        chars(9)[0]!
      ],
      south: [
        ...chars(1, 2, 4, 5),
        ...dots(4, 5, 6),
        ...bamboos(4, 5, 6),
        wind('south'),
        wind('south'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        chars(7)[0]!
      ]
    })
    const claims: PendingActionClaim[] = [
      { seat: 'west', actionType: 'kan-exposed', tile: discardedTile, consumedTiles: chars(3, 3, 3) },
      { seat: 'south', actionType: 'chi', tile: discardedTile, consumedTiles: chars(1, 2) }
    ]

    const resolved = resolveClaimWindow(pendingRound, claims)

    expect(resolved.lastClaimResolution).toEqual({
      type: 'kan-exposed',
      seat: 'west',
      tile: discardedTile
    })
    expect(resolved.currentSeat).toBe('west')
    expect(resolved.phase).toBe('discard')
  })

  it('moves a claimed pon into melds, removes consumed tiles from concealed hand, and removes the claimed discard from the pool', () => {
    const discardedTile = dragon('red')
    const pendingRound = createClaimWindowRound(discardedTile, 'east', {
      south: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('south'),
        wind('south'),
        dragon('red'),
        dragon('red'),
        dragon('green'),
        dragon('white')
      ]
    })
    const claims: PendingActionClaim[] = [
      { seat: 'south', actionType: 'pon', tile: discardedTile, consumedTiles: [dragon('red'), dragon('red')] }
    ]

    const resolved = resolveClaimWindow(pendingRound, claims)

    expect(resolved.currentSeat).toBe('south')
    expect(resolved.phase).toBe('discard')
    expect(resolved.players.south.melds).toEqual([
      {
        type: 'pon',
        tiles: [dragon('red'), dragon('red'), dragon('red')],
        claimedTile: dragon('red'),
        claimedFromSeat: 'east'
      }
    ])
    expect(resolved.players.south.concealedTiles.filter(tile => tile.suit === 'dragons' && tile.rank === 'red')).toHaveLength(0)
    expect(resolved.table.discards.east.filter(tile => tile.suit === 'dragons' && tile.rank === 'red')).toHaveLength(0)
  })

  it('advances to the next seat draw phase when every claimant passes', () => {
    const pendingRound = createClaimWindowRound(chars(3)[0]!, 'east', {})

    const resolved = resolveClaimWindow(pendingRound, [])

    expect(resolved.lastClaimResolution).toEqual({
      type: 'pass',
      seat: null,
      tile: pendingRound.pendingActionWindow!.triggeringTile
    })
    expect(resolved.currentSeat).toBe('south')
    expect(resolved.phase).toBe('draw')
    expect(resolved.outcome).toEqual({ status: 'in-progress' })
  })

  it('reads claim priority order from rule config instead of a fixed constant', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      claimPriorityOrder: ['chi', 'pon', 'kan-exposed', 'win']
    })

    if (!merged.ok)
      throw new Error(merged.error)

    const round = createBaselineRound({
      wall: buildWall(),
      ruleConfig: merged.config
    })
    const discardedTile = chars(3)[0]!
    const pendingRound = {
      ...createClaimWindowRound(discardedTile, 'east', {
        west: [
          ...chars(3, 3),
          ...dots(4, 5, 6),
          ...bamboos(4, 5, 6),
          wind('west'),
          wind('west'),
          dragon('red'),
          dragon('green'),
          dragon('white'),
          chars(9)[0]!
        ],
        south: [
          ...chars(1, 2, 4, 5),
          ...dots(4, 5, 6),
          ...bamboos(4, 5, 6),
          wind('south'),
          wind('south'),
          dragon('red'),
          dragon('green'),
          dragon('white'),
          chars(7)[0]!
        ]
      }),
      ruleConfig: round.ruleConfig
    }
    const claims: PendingActionClaim[] = [
      { seat: 'west', actionType: 'pon', tile: discardedTile, consumedTiles: chars(3, 3) },
      { seat: 'south', actionType: 'chi', tile: discardedTile, consumedTiles: chars(1, 2) }
    ]

    const resolved = resolveClaimWindow(pendingRound, claims)

    expect(resolved.lastClaimResolution).toEqual({
      type: 'chi',
      seat: 'south',
      tile: discardedTile
    })
  })
})
