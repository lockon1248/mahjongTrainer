import { describe, expect, it } from 'vitest'
import {
  ALL_SEATS,
  createEmptyPlayerState,
  createInitialTableState,
  createPendingActionWindow,
  isFlowerTile
} from '@/core/index'

describe('core domain model', () => {
  it('exports the four seats in table order', () => {
    expect(ALL_SEATS).toEqual(['east', 'south', 'west', 'north'])
  })

  it('creates an empty player state for a given seat', () => {
    expect(createEmptyPlayerState('east')).toEqual({
      seat: 'east',
      concealedTiles: [],
      melds: [],
      flowers: [],
      score: 0,
      declaredReady: false
    })
  })

  it('creates an initial table state with east dealer and prevailing wind', () => {
    expect(createInitialTableState()).toEqual({
      dealerSeat: 'east',
      dealerContinuationCount: 0,
      prevailingWind: 'east',
      wall: [],
      discards: {
        east: [],
        south: [],
        west: [],
        north: []
      }
    })
  })

  it('identifies flower tiles', () => {
    expect(isFlowerTile({ suit: 'flower', rank: 'spring' })).toBe(true)
    expect(isFlowerTile({ suit: 'flower', rank: 'chrysanthemum' })).toBe(true)
    expect(isFlowerTile({ suit: 'characters', rank: 1 })).toBe(false)
    expect(isFlowerTile({ suit: 'winds', rank: 'east' })).toBe(false)
  })

  it('creates a stable empty pending action window', () => {
    expect(createPendingActionWindow()).toEqual({
      triggeringSeat: null,
      triggeringTile: null,
      highestPriorityAction: null,
      claims: []
    })
  })
})
