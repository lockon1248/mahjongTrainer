import { describe, expect, it } from 'vitest'
import {
  chooseAiClaimDecision,
  chooseAiDiscardDecision,
  chooseAiSelfTurnDecision,
  createAiDecisionContext,
  createBaselineRound,
  createBaselineRuleConfig,
  mergeRuleConfig,
  type AiClaimCandidate,
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

const dragon = (rank: 'red' | 'green' | 'white'): Tile => {
  return { suit: 'dragons', rank }
}

const wind = (rank: 'east' | 'south' | 'west' | 'north'): Tile => {
  return { suit: 'winds', rank }
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

describe('ai decision core', () => {
  it('creates an AI-safe round decision context from a legal discard turn state', () => {
    const round = createBaselineRound({ wall: buildWall() })

    const context = createAiDecisionContext(round, {
      seat: 'east'
    })

    expect(context).toEqual({
      seat: 'east',
      phase: 'discard',
      currentSeat: 'east',
      triggeringTile: null,
      concealedTiles: round.players.east.concealedTiles,
      melds: round.players.east.melds,
      flowers: round.players.east.flowers,
      legalDiscards: round.players.east.concealedTiles,
      legalClaims: [],
      ruleConfig: round.ruleConfig
    })
  })

  it('chooses one legal discard tile from the concealed hand', () => {
    const decision = chooseAiDiscardDecision({
      seat: 'east',
      concealedTiles: [
        ...chars(1, 2, 3),
        ...dots(4, 5),
        ...bamboos(7, 8, 9),
        wind('east'),
        wind('east'),
        dragon('white')
      ],
      melds: [],
      flowers: [],
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision).toEqual({
      actionType: 'discard',
      tile: dragon('white'),
      reasoning: {
        heuristic: 'discard',
        score: 0,
        ignoredUnresolvedRules: ['earthWin', 'qiangGang']
      }
    })
  })

  it('prefers discarding an equally weak honor tile before breaking a suit tile with future flexibility', () => {
    const decision = chooseAiDiscardDecision({
      seat: 'east',
      concealedTiles: [
        chars(1)[0]!,
        chars(9)[0]!,
        ...dots(4, 5, 6),
        ...bamboos(7, 8, 9),
        wind('east'),
        dragon('white')
      ],
      melds: [],
      flowers: [],
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision.tile).toEqual(wind('east'))
  })

  it('prioritizes win over lower-priority claim actions', () => {
    const candidates: AiClaimCandidate[] = [
      {
        actionType: 'pon',
        tile: chars(3)[0]!,
        consumedTiles: chars(3, 3)
      },
      {
        actionType: 'win',
        tile: chars(3)[0]!
      }
    ]

    const decision = chooseAiClaimDecision({
      seat: 'south',
      concealedTiles: [...chars(1, 2, 4, 5), ...dots(7, 8), ...bamboos(2, 3)],
      melds: [],
      flowers: [],
      triggeringTile: chars(3)[0]!,
      candidates,
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision).toEqual({
      actionType: 'win',
      tile: chars(3)[0]!,
      consumedTiles: undefined,
      reasoning: {
        heuristic: 'claim',
        score: Number.POSITIVE_INFINITY,
        ignoredUnresolvedRules: ['earthWin', 'qiangGang']
      }
    })
  })

  it('chooses a beneficial chi over pass when it improves hand progression', () => {
    const candidates: AiClaimCandidate[] = [
      {
        actionType: 'chi',
        tile: chars(1)[0]!,
        consumedTiles: chars(2, 3)
      },
      {
        actionType: 'pass',
        tile: chars(1)[0]!
      }
    ]

    const decision = chooseAiClaimDecision({
      seat: 'south',
      concealedTiles: [...chars(2, 3, 6, 7), ...dots(4, 5), ...bamboos(7, 8)],
      melds: [],
      flowers: [],
      triggeringTile: chars(1)[0]!,
      candidates,
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision.actionType).toBe('chi')
    expect(decision.tile).toEqual(chars(1)[0]!)
    expect(decision.reasoning.heuristic).toBe('claim')
  })

  it('passes when a non-winning claim would break stronger existing structure', () => {
    const candidates: AiClaimCandidate[] = [
      {
        actionType: 'pon',
        tile: chars(4)[0]!,
        consumedTiles: chars(4, 4)
      },
      {
        actionType: 'pass',
        tile: chars(4)[0]!
      }
    ]

    const decision = chooseAiClaimDecision({
      seat: 'west',
      concealedTiles: [...chars(3, 4, 4, 5, 6), ...dots(2, 3), ...bamboos(7, 8)],
      melds: [],
      flowers: [],
      triggeringTile: chars(4)[0]!,
      candidates,
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision.actionType).toBe('pass')
  })

  it('chooses pon over pass when the meld clearly advances a weak pair into a made set', () => {
    const candidates: AiClaimCandidate[] = [
      {
        actionType: 'pon',
        tile: chars(4)[0]!,
        consumedTiles: chars(4, 4)
      },
      {
        actionType: 'pass',
        tile: chars(4)[0]!
      }
    ]

    const decision = chooseAiClaimDecision({
      seat: 'west',
      concealedTiles: [
        ...chars(4, 4, 5, 6),
        ...dots(1, 2),
        ...bamboos(7, 8)
      ],
      melds: [],
      flowers: [],
      triggeringTile: chars(4)[0]!,
      candidates,
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision.actionType).toBe('pon')
  })

  it('prioritizes self-draw win over lower-priority AI self-turn actions', () => {
    const decision = chooseAiSelfTurnDecision({
      seat: 'south',
      concealedTiles: [...chars(1, 2, 3), ...dots(1, 2, 3)],
      melds: [],
      flowers: [],
      candidates: [
        {
          actionType: 'kan-concealed',
          tile: chars(9)[0]!,
          consumedTiles: chars(9, 9, 9, 9),
          meldTile: null
        },
        {
          actionType: 'win-self-draw',
          tile: null,
          consumedTiles: [],
          meldTile: null
        }
      ],
      ruleConfig: createBaselineRuleConfig()
    })

    expect(decision.actionType).toBe('win-self-draw')
  })

  it('keeps unresolved-rule handling conservative by ignoring unresolved bonuses', () => {
    const baselineRuleConfig = createBaselineRuleConfig()
    const merged = mergeRuleConfig(baselineRuleConfig, {
      specialHands: {
        heavenWin: {
          status: 'configured',
          value: false
        },
        earthWin: {
          status: 'configured',
          value: false
        },
        qiangGang: {
          status: 'configured',
          value: false
        }
      }
    })

    if (!merged.ok)
      throw new Error(merged.error)

    const unresolvedDecision = chooseAiDiscardDecision({
      seat: 'east',
      concealedTiles: [...chars(1, 2, 3), ...dots(4, 5), ...bamboos(7, 8, 9), dragon('white')],
      melds: [],
      flowers: [],
      ruleConfig: baselineRuleConfig
    })
    const configuredDecision = chooseAiDiscardDecision({
      seat: 'east',
      concealedTiles: [...chars(1, 2, 3), ...dots(4, 5), ...bamboos(7, 8, 9), dragon('white')],
      melds: [],
      flowers: [],
      ruleConfig: merged.config
    })

    expect(unresolvedDecision.tile).toEqual(configuredDecision.tile)
    expect(unresolvedDecision.reasoning.score).toBe(configuredDecision.reasoning.score)
    expect(unresolvedDecision.reasoning.ignoredUnresolvedRules).toEqual(['earthWin', 'qiangGang'])
    expect(configuredDecision.reasoning.ignoredUnresolvedRules).toEqual([])
  })
})
