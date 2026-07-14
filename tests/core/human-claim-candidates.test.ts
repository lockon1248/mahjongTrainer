import { describe, expect, it } from 'vitest'
import {
  createBaselineRound,
  createPendingActionWindow,
  getLegalClaimCandidates,
  type BaselineRoundState,
  type Seat,
  type Tile
} from '@/core'

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
    wind('east'),
    wind('south'),
    wind('west'),
    wind('north'),
    dragon('red'),
    dragon('green'),
    dragon('white')
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

describe('human claim candidates', () => {
  it('includes pass and pon when the seat holds a matching pair', () => {
    const triggeringTile = { suit: 'dots', rank: 5 } as const
    const round = createClaimWindowRound(triggeringTile, 'east', {
      south: [
        ...chars(1, 2, 3),
        ...dots(5, 5, 7, 8, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        dragon('green'),
        dragon('white')
      ]
    })

    expect(getLegalClaimCandidates(round, 'south')).toEqual([
      {
        actionType: 'pass',
        tile: triggeringTile,
        consumedTiles: []
      },
      {
        actionType: 'pon',
        tile: triggeringTile,
        consumedTiles: dots(5, 5)
      }
    ])
  })

  it('requires three matching concealed tiles for exposed kan', () => {
    const triggeringTile = { suit: 'bamboo', rank: 7 } as const
    const round = createClaimWindowRound(triggeringTile, 'east', {
      west: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3),
        ...bamboos(7, 7, 7, 2, 3, 4),
        wind('north'),
        dragon('red'),
        dragon('green'),
        dragon('white')
      ]
    })

    expect(getLegalClaimCandidates(round, 'west')).toEqual([
      {
        actionType: 'pass',
        tile: triggeringTile,
        consumedTiles: []
      },
      {
        actionType: 'kan-exposed',
        tile: triggeringTile,
        consumedTiles: bamboos(7, 7, 7)
      },
      {
        actionType: 'pon',
        tile: triggeringTile,
        consumedTiles: bamboos(7, 7)
      }
    ])
  })

  it('offers chi only to the next seat and preserves concrete consumed tile pairs', () => {
    const triggeringTile = { suit: 'characters', rank: 3 } as const
    const southRound = createClaimWindowRound(triggeringTile, 'east', {
      south: [
        ...chars(1, 2, 4, 5, 7, 8),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('east'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        wind('south')
      ],
      west: [
        ...chars(1, 2, 4, 5),
        ...dots(4, 5, 6),
        ...bamboos(4, 5, 6),
        wind('west'),
        wind('west'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        wind('north')
      ]
    })

    expect(getLegalClaimCandidates(southRound, 'south')).toEqual([
      {
        actionType: 'pass',
        tile: triggeringTile,
        consumedTiles: []
      },
      {
        actionType: 'chi',
        tile: triggeringTile,
        consumedTiles: chars(1, 2)
      },
      {
        actionType: 'chi',
        tile: triggeringTile,
        consumedTiles: chars(2, 4)
      },
      {
        actionType: 'chi',
        tile: triggeringTile,
        consumedTiles: chars(4, 5)
      }
    ])

    expect(getLegalClaimCandidates(southRound, 'west')).toEqual([
      {
        actionType: 'pass',
        tile: triggeringTile,
        consumedTiles: []
      }
    ])
  })

  it('includes win only when the discarded tile completes a legal winning hand', () => {
    const triggeringTile = dragon('red')
    const round = createClaimWindowRound(triggeringTile, 'east', {
      north: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      south: [
        ...chars(1, 1),
        ...dots(2, 2),
        ...bamboos(3, 3),
        wind('east'),
        wind('south'),
        wind('west'),
        wind('north'),
        dragon('red'),
        dragon('green'),
        dragon('white'),
        ...chars(4, 5, 7, 8)
      ]
    })

    expect(getLegalClaimCandidates(round, 'north')).toEqual([
      {
        actionType: 'pass',
        tile: triggeringTile,
        consumedTiles: []
      },
      {
        actionType: 'win',
        tile: triggeringTile,
        consumedTiles: []
      }
    ])

    expect(getLegalClaimCandidates(round, 'south')).toEqual([
      {
        actionType: 'pass',
        tile: triggeringTile,
        consumedTiles: []
      }
    ])
  })
})
