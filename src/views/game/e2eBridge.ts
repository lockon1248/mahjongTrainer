import {
  createBaselineRound,
  createDrawRoundResult,
  createPendingActionWindow,
  createBaselineRuleConfig,
  createWinRoundResult,
  mergeRuleConfig,
  type BaselineRoundState,
  type MahjongRuleConfig,
  type Seat,
  type Tile
} from '@/core'
import type { useGameSessionStore } from '@/stores/gameSession'

type GameSessionStore = ReturnType<typeof useGameSessionStore>

type GameE2EBridge = {
  seedPonClaimScenario: () => void
  seedDiscardWinScenario: () => void
  seedBigThreeDragonsClaimScenario: () => void
  seedDrawNextRoundScenario: () => void
  seedClassicFlowerProfileWinScenario: () => void
  seedBonusFlowerProfileWinScenario: () => void
  seedDealerRotationNextRoundScenario: () => void
  seedAiWinRevealScenario: () => void
}

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
  seatTiles: Partial<Record<Seat, Tile[]>>,
  ruleConfig?: MahjongRuleConfig
): BaselineRoundState => {
  const round = createBaselineRound({ wall: buildWall(), ruleConfig })

  return {
    ...round,
    currentSeat: triggeringSeat,
    phase: 'claim-window',
    table: {
      ...round.table,
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

const isE2EMode = (): boolean => {
  if (!import.meta.env.DEV || typeof window === 'undefined')
    return false

  return new URLSearchParams(window.location.search).get('e2e') === '1'
}

export const attachGameE2EBridge = (store: GameSessionStore) => {
  if (typeof window === 'undefined')
    return

  const bridgeWindow = window as Window & { __MAHJONG_E2E__?: GameE2EBridge }

  if (!isE2EMode()) {
    delete bridgeWindow.__MAHJONG_E2E__
    return
  }

  bridgeWindow.__MAHJONG_E2E__ = {
    seedPonClaimScenario() {
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
      store.error = null
    },
    seedDiscardWinScenario() {
      store.round = createClaimWindowRound(dragon('red'), 'south', {
        east: [
          ...chars(1, 2, 3),
          ...dots(1, 2, 3),
          ...bamboos(1, 2, 3),
          ...chars(9, 9, 9),
          wind('east'),
          wind('east'),
          wind('east'),
          dragon('red')
        ]
      })
      store.error = null
    },
    seedBigThreeDragonsClaimScenario() {
      store.round = createClaimWindowRound(dragon('white'), 'south', {
        east: [
          ...chars(1, 2, 3),
          ...chars(9, 9),
          ...dots(4, 5, 6),
          dragon('red'),
          dragon('red'),
          dragon('red'),
          dragon('green'),
          dragon('green'),
          dragon('green'),
          dragon('white'),
          dragon('white')
        ]
      })
      store.error = null
    },
    seedDrawNextRoundScenario() {
      const round = createBaselineRound({ wall: buildWall() })
      store.round = {
        ...round,
        phase: 'ended',
        outcome: {
          status: 'draw',
          result: createDrawRoundResult()
        }
      }
      store.error = null
    },
    seedClassicFlowerProfileWinScenario() {
      store.round = createClaimWindowRound(dragon('red'), 'south', {
        east: [
          ...chars(1, 2, 3),
          ...chars(2, 3, 4),
          ...dots(4, 5, 6),
          ...bamboos(7, 8, 9),
          wind('east'),
          wind('east'),
          wind('east'),
          dragon('red')
        ]
      }, {
        ...createBaselineRuleConfig()
      })
      store.round.players.east.flowers = [
        { suit: 'flower', rank: 'spring' },
        { suit: 'flower', rank: 'plum' }
      ]
      store.error = null
    },
    seedBonusFlowerProfileWinScenario() {
      const merged = mergeRuleConfig(createBaselineRuleConfig(), {
        scoringProfile: 'flower-wind-bonus'
      })

      if (!merged.ok)
        throw new Error(merged.error)

      store.round = createClaimWindowRound(dragon('red'), 'south', {
        east: [
          ...chars(1, 2, 3),
          ...chars(2, 3, 4),
          ...dots(4, 5, 6),
          ...bamboos(7, 8, 9),
          wind('east'),
          wind('east'),
          wind('east'),
          dragon('red')
        ]
      }, merged.config)
      store.round.players.east.flowers = [
        { suit: 'flower', rank: 'spring' },
        { suit: 'flower', rank: 'plum' }
      ]
      store.error = null
    },
    seedDealerRotationNextRoundScenario() {
      const round = createBaselineRound({ wall: buildWall() })
      store.round = {
        ...round,
        currentSeat: 'south',
        phase: 'ended',
        table: {
          ...round.table,
          dealerSeat: 'east'
        },
        outcome: {
          status: 'win',
          result: createWinRoundResult({
            winnerSeat: 'south',
            discarderSeat: 'west'
          })
        }
      }
      store.error = null
    },
    seedAiWinRevealScenario() {
      const round = createBaselineRound({ wall: buildWall() })
      store.round = {
        ...round,
        currentSeat: 'south',
        phase: 'ended',
        players: {
          ...round.players,
          south: {
            ...round.players.south,
            concealedTiles: [
              ...chars(1, 2, 3),
              ...dots(4, 5, 6),
              ...bamboos(7, 8, 9),
              wind('east'),
              wind('east'),
              wind('east'),
              dragon('red'),
              dragon('red')
            ]
          }
        },
        outcome: {
          status: 'win',
          result: createWinRoundResult({
            winnerSeat: 'south',
            discarderSeat: null,
            totalTai: 3
          })
        }
      }
      store.error = null
    }
  }
}
