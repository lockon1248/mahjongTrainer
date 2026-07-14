import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Tile } from '@/core'
import { useGameSessionStore } from '@/stores/gameSession'

const illegalDiscardTile: Tile = { suit: 'flower', rank: 'spring' }

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

    store.startLocalRound()
    store.discard(store.round!.players.east.concealedTiles[0]!)
    store.resolveClaims()

    expect(store.round?.currentSeat).toBe('south')
    expect(store.round?.phase).toBe('draw')

    store.drawCurrentSeat()

    expect(store.error).toBeNull()
    expect(store.round?.currentSeat).toBe('south')
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.players.south.concealedTiles).toHaveLength(17)
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

    store.startLocalRound()
    store.discard(store.round!.players.east.concealedTiles[0]!)

    store.resolveClaims()

    expect(store.error).toBeNull()
    expect(store.round?.pendingActionWindow).toBeNull()
    expect(store.round?.currentSeat).toBe('south')
    expect(store.round?.phase).toBe('draw')
    expect(store.round?.lastClaimResolution?.type).toBe('pass')
  })

  it('auto-advances AI seats until the round reaches the next human discard turn', () => {
    const store = useGameSessionStore()

    store.startLocalRound()
    store.discard(store.round!.players.east.concealedTiles[0]!)

    store.advanceTurn()

    expect(store.error).toBeNull()
    expect(store.round?.currentSeat).toBe('east')
    expect(store.round?.phase).toBe('discard')
    expect(store.round?.pendingActionWindow).toBeNull()
    expect(store.round?.lastClaimResolution?.type).toBe('pass')
    expect(store.round?.table.discards.east).toHaveLength(1)
    expect(store.round?.table.discards.south).toHaveLength(1)
    expect(store.round?.table.discards.west).toHaveLength(1)
    expect(store.round?.table.discards.north).toHaveLength(1)
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
})
