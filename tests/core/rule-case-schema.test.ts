import { describe, expect, expectTypeOf, it } from 'vitest'
import { createRuleCase, type RuleCaseExpected } from '@/core/index'

describe('rule-case schema', () => {
  it('creates a rule case with stable default values', () => {
    expect(
      createRuleCase({
        id: 'WIN-STANDARD-001',
        title: '標準胡牌',
        category: 'standard-win'
      })
    ).toEqual({
      id: 'WIN-STANDARD-001',
      title: '標準胡牌',
      category: 'standard-win',
      concealedTiles: [],
      melds: [],
      flowers: [],
      winningTile: null,
      expected: {}
    })
  })

  it('allows expected values to be overridden', () => {
    expectTypeOf<RuleCaseExpected>().toMatchTypeOf<{
      isWinning?: boolean
      matchedPatterns?: string[]
      totalTai?: number
      settlementType?: 'self-draw' | 'discard-win'
    }>()

    const expected: RuleCaseExpected = {
      isWinning: true,
      winningSeat: 'south',
      matchedPatterns: ['self-draw', 'dealer-win'],
      totalTai: 2,
      settlementType: 'self-draw'
    }

    expect(
      createRuleCase({
        id: 'CLAIM-PRIORITY-001',
        title: '胡優先於碰',
        category: 'claim-priority',
        expected
      })
    ).toEqual({
      id: 'CLAIM-PRIORITY-001',
      title: '胡優先於碰',
      category: 'claim-priority',
      concealedTiles: [],
      melds: [],
      flowers: [],
      winningTile: null,
      expected
    })
  })
})
