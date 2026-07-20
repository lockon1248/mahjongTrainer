import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  assertRoundScenarioInvariants,
  createReachableClaimWindowScenario,
  createReachableDiscardWinScenario,
  createReachableExhaustiveDrawScenario,
  createReachableSelfDrawWinScenario
} from '@/core/testing/roundScenario'

const redDragon = { suit: 'dragons', rank: 'red' } as const

describe('reachable round scenario harness', () => {
  it('keeps draw and AI win browser seeds on reachable production builders', () => {
    const bridgeSource = readFileSync(new URL('../../src/views/game/e2eBridge.ts', import.meta.url), 'utf8')
    const drawSeed = bridgeSource.match(/seedDrawNextRoundScenario\(\) \{([\s\S]*?)\n    \},/)?.[1]
    const aiWinSeed = bridgeSource.match(/seedAiWinRevealScenario\(\) \{([\s\S]*?)\n    \}/)?.[1]

    expect(drawSeed).toContain('createReachableExhaustiveDrawClaimWindowScenario')
    expect(drawSeed).toContain('store.resolveClaims()')
    expect(aiWinSeed).toContain('createReachableSelfDrawOpportunityScenario')
    expect(aiWinSeed).toContain('store.advanceTurn()')
    expect(aiWinSeed).not.toContain('createWinRoundResult')
  })

  it('builds a claim window through a production discard', () => {
    const round = createReachableClaimWindowScenario({
      triggeringSeat: 'south',
      triggeringTile: redDragon
    })

    expect(round.phase).toBe('claim-window')
    expect(round.pendingActionWindow?.triggeringSeat).toBe('south')
    expect(round.pendingActionWindow?.triggeringTile).toEqual(redDragon)
    expect(round.table.discards.south.at(-1)).toEqual(redDragon)
    expect(() => assertRoundScenarioInvariants(round)).not.toThrow()
  })

  it('builds exhaustive draw and win outcomes through production transitions', () => {
    const draw = createReachableExhaustiveDrawScenario()
    const discardWin = createReachableDiscardWinScenario()
    const selfDrawWin = createReachableSelfDrawWinScenario()

    expect(draw.phase).toBe('ended')
    expect(draw.outcome.status).toBe('draw')
    expect(draw.table.wall).toEqual([])
    expect(discardWin.outcome.status).toBe('win')
    expect(selfDrawWin.outcome.status).toBe('win')

    for (const round of [draw, discardWin, selfDrawWin])
      expect(() => assertRoundScenarioInvariants(round)).not.toThrow()
  })

  it.each([
    {
      name: 'phase/outcome mismatch',
      mutate: () => ({ ...createReachableExhaustiveDrawScenario(), phase: 'discard' as const }),
      error: 'phase/outcome invariant'
    },
    {
      name: 'claim source mismatch',
      mutate: () => {
        const round = createReachableClaimWindowScenario({ triggeringSeat: 'south', triggeringTile: redDragon })
        return { ...round, table: { ...round.table, discardSequence: [] } }
      },
      error: 'claim/discard invariant'
    },
    {
      name: 'draw with non-empty wall',
      mutate: () => {
        const round = createReachableExhaustiveDrawScenario()
        return { ...round, table: { ...round.table, wall: [redDragon] } }
      },
      error: 'wall/draw invariant'
    },
    {
      name: 'invalid winning effective count',
      mutate: () => {
        const round = createReachableSelfDrawWinScenario()
        return {
          ...round,
          players: {
            ...round.players,
            east: { ...round.players.east, concealedTiles: round.players.east.concealedTiles.slice(0, 16) }
          }
        }
      },
      error: 'winning effective count invariant'
    },
    {
      name: 'physical tile multiplicity above inventory',
      mutate: () => {
        const round = createReachableClaimWindowScenario({ triggeringSeat: 'south', triggeringTile: redDragon })
        return {
          ...round,
          players: {
            ...round.players,
            east: { ...round.players.east, concealedTiles: Array.from({ length: 17 }, () => redDragon) }
          }
        }
      },
      error: 'physical tile inventory invariant'
    }
  ])('rejects $name', ({ mutate, error }) => {
    expect(() => assertRoundScenarioInvariants(mutate())).toThrow(error)
  })
})
