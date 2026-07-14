import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createBaselineRound, type Tile } from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'

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

describe('ai self-turn actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('ends the round when auto-turn reaches an AI self-draw win', () => {
    const store = useGameSessionStore()
    const round = createBaselineRound({ wall: buildWall() })
    store.round = {
      ...round,
      currentSeat: 'south',
      phase: 'discard',
      players: {
        ...round.players,
        south: {
          ...round.players.south,
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
        }
      }
    }

    store.advanceTurn()

    expect(store.error).toBeNull()
    expect(store.round?.phase).toBe('ended')
    expect(store.round?.outcome.status).toBe('win')
    if (store.round?.outcome.status !== 'win')
      throw new Error('expected AI self-draw win outcome')
    expect(store.round.outcome.result.winnerSeat).toBe('south')
  })
})
