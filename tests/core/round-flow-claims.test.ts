import { describe, expect, it } from 'vitest'
import {
  createBaselineRuleConfig,
  createBaselineRound,
  createPendingActionWindow,
  createReachableClaimWindowScenario,
  discardTile,
  drawForCurrentSeat,
  getLegalClaimCandidates,
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

const flower = (rank: 'spring' | 'summer' | 'autumn' | 'winter' | 'plum' | 'orchid' | 'bamboo' | 'chrysanthemum'): Tile => {
  return { suit: 'flower', rank }
}

const scoringItem = (
  patternId: string,
  label: string,
  tai: number,
  reason: string
) => ({ patternId, label, tai, reason })

const buildWall = (...tailTiles: Tile[]): Tile[] => {
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
      discardSequence: [triggeringTile],
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
  it('preserves discards in actual turn order across seats', () => {
    const round = createBaselineRound({ wall: buildWall() })
    const eastDiscard = round.players.east.concealedTiles[0]!
    const afterEastDiscard = discardTile(round, { seat: 'east', tile: eastDiscard })
    const southDraw = drawForCurrentSeat(resolveClaimWindow(afterEastDiscard, []))
    const southDiscard = southDraw.players.south.concealedTiles[0]!
    const afterSouthDiscard = discardTile(southDraw, { seat: 'south', tile: southDiscard })

    expect(afterSouthDiscard.table.discardSequence).toEqual([eastDiscard, southDiscard])
  })

  it('removes an accepted pon tile from both discard projections', () => {
    const discardedTile = wind('west')
    const pendingRound = createClaimWindowRound(discardedTile, 'north', {
      east: [
        wind('west'),
        wind('west'),
        ...chars(1, 2, 3, 4, 5, 6, 7, 8, 9),
        ...dots(1, 2, 3, 4, 5, 6)
      ]
    })

    const resolved = resolveClaimWindow(pendingRound, [{
      seat: 'east',
      actionType: 'pon',
      tile: discardedTile,
      consumedTiles: [wind('west'), wind('west')]
    }])

    expect(resolved.table.discards.north).toEqual([])
    expect(resolved.table.discardSequence).toEqual([])
  })

  it('prefers a win claim over lower priority claims', () => {
    const discardedTile = dragon('red')
    const pendingRound = createReachableClaimWindowScenario({
      triggeringTile: discardedTile,
      triggeringSeat: 'south',
      hands: {
        east: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
        ],
        west: [dragon('red'), dragon('red')]
      }
    })
    const claims: PendingActionClaim[] = [
      { seat: 'east', actionType: 'win', tile: discardedTile },
      { seat: 'west', actionType: 'pon', tile: discardedTile, consumedTiles: [dragon('red'), dragon('red')] }
    ]

    expect(getLegalClaimCandidates(pendingRound, 'east').map(candidate => candidate.actionType)).toContain('win')
    expect(getLegalClaimCandidates(pendingRound, 'west').map(candidate => candidate.actionType)).toContain('pon')

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
      scoringItems: [
        scoringItem('concealed-hand', '門清', 1, '沒有吃也沒有碰，手牌皆為自摸整理')
      ],
      drawReason: null,
      unresolved: []
    })
  })

  it('uses the round scoring profile when resolving a win claim result', () => {
    const merged = mergeRuleConfig(createBaselineRuleConfig(), {
      scoringProfile: 'flower-wind-bonus'
    })

    if (!merged.ok)
      throw new Error(merged.error)

    const discardedTile = dragon('red')
    const pendingRound = createClaimWindowRound(discardedTile, 'south', {
      east: [
        ...chars(1, 2, 3),
        ...chars(2, 3, 4),
        ...dots(4, 5, 6),
        ...bamboos(7, 8, 9),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ]
    })

    pendingRound.ruleConfig = merged.config
    pendingRound.players.east.flowers = [
      { suit: 'flower', rank: 'spring' },
      { suit: 'flower', rank: 'plum' }
    ]

    const resolved = resolveClaimWindow(pendingRound, [
      { seat: 'east', actionType: 'win', tile: discardedTile }
    ])

    if (resolved.outcome.status !== 'win')
      throw new Error('expected win outcome')

    expect(resolved.outcome.result.totalTai).toBe(5)
    expect(resolved.outcome.result.scoringItems).toEqual([
      scoringItem('dealer-win', '莊家', 1, '胡牌者為莊家'),
      scoringItem('concealed-hand', '門清', 1, '沒有吃也沒有碰，手牌皆為自摸整理'),
      scoringItem('any-flower', '見花見台', 1, '任一花牌皆可計台'),
      scoringItem('any-flower', '見花見台', 1, '任一花牌皆可計台'),
      scoringItem('any-wind-triplet', '見風見台', 1, '任一風牌刻子皆可計台')
    ])
  })

  it('prefers exposed kan over chi when no win exists', () => {
    const discardedTile = chars(3)[0]!
    const replacementTile = dragon('green')
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
        chars(9)[0]!,
        dots(9)[0]!
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
    pendingRound.table.wall = buildWall(replacementTile)
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
    expect(resolved.players.west.melds).toEqual([
      {
        type: 'kan-exposed',
        tiles: chars(3, 3, 3, 3),
        claimedTile: discardedTile,
        claimedFromSeat: 'east'
      }
    ])
    expect(resolved.players.west.concealedTiles).toContainEqual(replacementTile)
    expect(resolved.players.west.concealedTiles).toHaveLength(14)
    expect(resolved.table.wall).toHaveLength(pendingRound.table.wall.length - 1)
  })

  it('reveals flower replacements and keeps drawing for an exposed kan until a non-flower tile is found', () => {
    const discardedTile = chars(3)[0]!
    const replacementTile = dragon('white')
    const pendingRound = createClaimWindowRound(discardedTile, 'east', {
      west: [
        ...chars(3, 3, 3),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('west'),
        wind('west'),
        dragon('red'),
        dragon('green'),
        chars(9)[0]!,
        dots(9)[0]!,
        bamboos(9)[0]!
      ]
    })
    pendingRound.table.wall = buildWall(replacementTile, flower('spring'))

    const resolved = resolveClaimWindow(pendingRound, [
      { seat: 'west', actionType: 'kan-exposed', tile: discardedTile, consumedTiles: chars(3, 3, 3) }
    ])

    expect(resolved.phase).toBe('discard')
    expect(resolved.players.west.flowers).toContainEqual(flower('spring'))
    expect(resolved.players.west.concealedTiles).toContainEqual(replacementTile)
    expect(resolved.players.west.concealedTiles).toHaveLength(14)
    expect(resolved.table.wall).toHaveLength(pendingRound.table.wall.length - 2)
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
