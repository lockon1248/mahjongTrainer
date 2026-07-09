import { describe, expect, it } from 'vitest'
import { createRuleCase } from '../../src/core/index'

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
    expect(
      createRuleCase({
        id: 'CLAIM-PRIORITY-001',
        title: '胡優先於碰',
        category: 'claim-priority',
        expected: {
          canWin: true,
          winningSeat: 'south',
          claimResolution: 'win'
        }
      })
    ).toEqual({
      id: 'CLAIM-PRIORITY-001',
      title: '胡優先於碰',
      category: 'claim-priority',
      concealedTiles: [],
      melds: [],
      flowers: [],
      winningTile: null,
      expected: {
        canWin: true,
        winningSeat: 'south',
        claimResolution: 'win'
      }
    })
  })
})
