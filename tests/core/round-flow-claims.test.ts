import { describe, expect, it } from 'vitest'
import {
  createBaselineRound,
  discardTile,
  resolveClaimWindow,
  type PendingActionClaim,
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

const createClaimingRound = () => {
  const round = createBaselineRound({ wall: buildWall() })
  const discardedTile = round.players.east.concealedTiles[0]!

  return discardTile(round, {
    seat: 'east',
    tile: discardedTile
  })
}

describe('round flow claim resolution', () => {
  it('prefers a win claim over lower priority claims', () => {
    const pendingRound = createClaimingRound()
    const discardedTile = pendingRound.pendingActionWindow!.triggeringTile!
    const claims: PendingActionClaim[] = [
      { seat: 'north', actionType: 'win', tile: discardedTile },
      { seat: 'south', actionType: 'pon', tile: discardedTile }
    ]

    const resolved = resolveClaimWindow(pendingRound, claims)

    expect(resolved.lastClaimResolution).toEqual({
      type: 'win',
      seat: 'north',
      tile: discardedTile
    })
    expect(resolved.outcome.status).toBe('win')
    expect(resolved.phase).toBe('ended')
  })

  it('prefers exposed kan over chi when no win exists', () => {
    const pendingRound = createClaimingRound()
    const discardedTile = pendingRound.pendingActionWindow!.triggeringTile!
    const claims: PendingActionClaim[] = [
      { seat: 'west', actionType: 'kan-exposed', tile: discardedTile },
      { seat: 'south', actionType: 'chi', tile: discardedTile }
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

  it('advances to the next seat draw phase when every claimant passes', () => {
    const pendingRound = createClaimingRound()

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
})
