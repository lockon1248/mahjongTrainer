// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  createBaselineRound,
  createPendingActionWindow,
  type BaselineRoundState,
  type Seat,
  type Tile
} from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'
import GameView from '@/views/game/GameView.vue'

const chars = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'characters', rank }))
}

const dots = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'dots', rank }))
}

const bamboos = (...ranks: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>): Tile[] => {
  return ranks.map(rank => ({ suit: 'bamboo', rank }))
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

describe('table layout verification flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('drives a human pon through the UI and syncs melds, concealed tiles, and center discards together', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useGameSessionStore()
    store.round = createClaimWindowRound(wind('west'), 'north', {
      east: [
        ...chars(1, 2, 3),
        ...dots(1, 2, 3),
        ...bamboos(1, 2, 3),
        wind('east'),
        wind('east'),
        wind('west'),
        wind('west'),
        dragon('red'),
        dragon('green'),
        dragon('white')
      ]
    })

    const wrapper = mount(GameView, {
      global: {
        plugins: [pinia]
      }
    })

    const claimButtons = wrapper.findAll('[data-testid="human-claim-action"]')
    expect(claimButtons.map(button => button.text())).toContain('碰牌：西風、西風')

    await claimButtons.find(button => button.text().includes('碰牌'))!.trigger('click')

    expect(wrapper.get('[data-testid="summary-phase"]').text()).toContain('出牌')
    expect(wrapper.get('[data-testid="player-active-east"]').text()).toContain('目前出牌')
    expect(wrapper.get('[data-testid="player-status-east"]').text()).toContain('輪到你')
    expect(wrapper.get('[data-testid="player-melds-east"]').text()).toContain('碰')
    expect(wrapper.get('[data-testid="player-melds-east"]').text()).toContain('西風')
    expect(wrapper.get('[data-testid="shared-discard-pool"]').text()).not.toContain('西風')
    expect(wrapper.findAll('[data-testid="human-discard-tile"]')).toHaveLength(14)
    expect(wrapper.get('[data-testid="human-concealed-tiles"]').text()).not.toContain('西風')

    expect(store.round?.players.east.melds).toHaveLength(1)
    expect(store.round?.players.east.concealedTiles.filter(tile => tile.suit === 'winds' && tile.rank === 'west')).toHaveLength(0)
    expect(store.round?.table.discards.north.filter(tile => tile.suit === 'winds' && tile.rank === 'west')).toHaveLength(0)
    expect(store.round?.table.discardSequence).toHaveLength(0)
  })
})
