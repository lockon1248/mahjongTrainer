import { describe, expect, it } from 'vitest'
import {
  applyHumanSelfTurnAction,
  createBaselineRound,
  getLegalSelfTurnCandidates,
  type BaselineRoundState,
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

  const base = Array.from({ length: 70 }, (_, index) => pool[index % pool.length]!)

  return [...base, ...tailTiles]
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

describe('human self-turn actions', () => {
  it('returns only the legal self-turn candidates and preserves action data', () => {
    const concealedKanTile = chars(9)[0]!
    const addedKanTile = dots(5)[0]!
    const round = createSelfTurnRound({
      concealedTiles: [
        ...chars(1, 2, 3),
        ...chars(9, 9, 9, 9),
        ...dots(1, 2, 3),
        ...dots(5),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        dragon('red')
      ],
      melds: [
        {
          type: 'pon',
          tiles: dots(5, 5, 5),
          claimedTile: dots(5)[0]!,
          claimedFromSeat: 'south'
        }
      ]
    })

    expect(getLegalSelfTurnCandidates(round, 'east')).toEqual([
      {
        actionType: 'kan-concealed',
        tile: concealedKanTile,
        consumedTiles: chars(9, 9, 9, 9),
        meldTile: null
      },
      {
        actionType: 'kan-added',
        tile: addedKanTile,
        consumedTiles: dots(5),
        meldTile: dots(5)[0]!
      }
    ])
    expect(getLegalSelfTurnCandidates(round, 'south')).toEqual([])
  })

  it('ends the round with a self-draw win outcome when win-self-draw is legal', () => {
    const round = createSelfTurnRound({
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
    const winCandidate = getLegalSelfTurnCandidates(round, 'east').find(candidate => candidate.actionType === 'win-self-draw')

    expect(winCandidate).toBeDefined()

    const resolved = applyHumanSelfTurnAction(round, {
      seat: 'east',
      actionType: 'win-self-draw'
    })

    expect(resolved.phase).toBe('ended')
    expect(resolved.currentSeat).toBe('east')
    expect(resolved.outcome.status).toBe('win')
    if (resolved.outcome.status !== 'win')
      throw new Error('expected a winning outcome')
    expect(resolved.outcome.result.winnerSeat).toBe('east')
    expect(resolved.outcome.result.discarderSeat).toBeNull()
  })

  it('applies concealed kan and draws a replacement tile from the wall tail', () => {
    const replacementTile = dragon('green')
    const round = createSelfTurnRound({
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
      wall: buildWall(replacementTile)
    })

    const resolved = applyHumanSelfTurnAction(round, {
      seat: 'east',
      actionType: 'kan-concealed',
      consumedTiles: chars(7, 7, 7, 7)
    })

    expect(resolved.phase).toBe('discard')
    expect(resolved.currentSeat).toBe('east')
    expect(resolved.players.east.melds).toEqual([
      {
        type: 'kan-concealed',
        tiles: chars(7, 7, 7, 7),
        claimedTile: null,
        claimedFromSeat: null
      }
    ])
    expect(resolved.players.east.concealedTiles).toContainEqual(replacementTile)
    expect(resolved.players.east.concealedTiles).toHaveLength(14)
    expect(resolved.table.wall).toHaveLength(round.table.wall.length - 1)
  })

  it('upgrades an existing pon to kan-added and draws a replacement tile from the wall tail', () => {
    const replacementTile = dragon('white')
    const round = createSelfTurnRound({
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        ...chars(4, 5),
        wind('east'),
        dragon('red'),
        ...dots(5)
      ],
      melds: [
        {
          type: 'pon',
          tiles: dots(5, 5, 5),
          claimedTile: dots(5)[0]!,
          claimedFromSeat: 'south'
        }
      ],
      wall: buildWall(replacementTile)
    })

    const resolved = applyHumanSelfTurnAction(round, {
      seat: 'east',
      actionType: 'kan-added',
      consumedTiles: dots(5),
      meldTile: dots(5)[0]!
    })

    expect(resolved.phase).toBe('discard')
    expect(resolved.currentSeat).toBe('east')
    expect(resolved.players.east.melds).toEqual([
      {
        type: 'kan-added',
        tiles: dots(5, 5, 5, 5),
        claimedTile: dots(5)[0]!,
        claimedFromSeat: 'south'
      }
    ])
    expect(resolved.players.east.concealedTiles).not.toContainEqual(dots(5)[0]!)
    expect(resolved.players.east.concealedTiles).toContainEqual(replacementTile)
    expect(resolved.players.east.concealedTiles).toHaveLength(14)
    expect(resolved.table.wall).toHaveLength(round.table.wall.length - 1)
  })
})
