import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  createBaselineRound,
  createReachableClaimWindowScenario,
  createReachableExhaustiveDrawScenario,
  type Tile
} from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'
import { createGameTableSnapshot } from '@/views/game/selectors'

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

describe('mainline playable flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('covers opening and basic draw-discard progression from a fresh local round', () => {
    const store = useGameSessionStore()

    store.startLocalRound()

    expect(store.round?.phase).toBe('discard')
    expect(store.round?.currentSeat).toBe('east')

    const discardedTile = store.round!.players.east.concealedTiles[0]!
    store.discard(discardedTile)

    expect(store.round?.phase).toBe('claim-window')
    expect(store.round?.table.discards.east).toContainEqual(discardedTile)
    expect(createGameTableSnapshot(store.round!, 'east').discardSequence).toEqual([discardedTile])
  })

  it('covers a terminal win path and syncs the result summary into the snapshot', () => {
    const store = useGameSessionStore()
    store.round = createReachableClaimWindowScenario({
      triggeringTile: dragon('red'),
      triggeringSeat: 'west',
      hands: { east: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3, 9, 9, 9),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('east'),
        dragon('red')
      ] }
    })

    store.submitHumanClaim('win')

    expect(store.round?.phase).toBe('ended')
    expect(store.round?.outcome.status).toBe('win')

    const snapshot = createGameTableSnapshot(store.round!, 'east')

    expect(snapshot.resultSummary?.type).toBe('win')
    expect(snapshot.resultSummary?.winnerSeat).toBe('east')
    expect(snapshot.resultSummary?.discarderSeat).toBe('west')
  })

  it('covers a draw terminal path and syncs the draw summary into the snapshot', () => {
    const store = useGameSessionStore()
    store.round = createReachableExhaustiveDrawScenario()

    const snapshot = createGameTableSnapshot(store.round, 'east')

    expect(snapshot.resultSummary?.type).toBe('draw')
    expect(snapshot.resultSummary?.drawReason).toBe('wall-exhausted')
    expect(snapshot.resultSummary?.ended).toBe(true)
  })
})
