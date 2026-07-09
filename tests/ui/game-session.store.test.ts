import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameSessionStore } from '@/stores/gameSession'

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
})
