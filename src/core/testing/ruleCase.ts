import type { Meld } from '../types/player'
import type { Seat } from '../types/seat'
import type { Tile } from '../types/tile'

export type RuleCaseCategory =
  | 'standard-win'
  | 'meld-win'
  | 'flower-replace'
  | 'flower-chain'
  | 'claim-priority'
  | 'dealer-draw'
  | 'score-stack'

export type RuleCaseExpected = {
  canWin?: boolean
  winningSeat?: Seat
  claimResolution?: 'win' | 'kan-exposed' | 'pon' | 'chi' | 'pass'
  totalTai?: number
}

export type RuleCase = {
  id: string
  title: string
  category: RuleCaseCategory
  concealedTiles: Tile[]
  melds: Meld[]
  flowers: Tile[]
  winningTile: Tile | null
  expected: RuleCaseExpected
}

export type CreateRuleCaseInput = {
  id: string
  title: string
  category?: RuleCaseCategory
  concealedTiles?: Tile[]
  melds?: Meld[]
  flowers?: Tile[]
  winningTile?: Tile | null
  expected?: RuleCaseExpected
}

export function createRuleCase(input: CreateRuleCaseInput): RuleCase {
  return {
    id: input.id,
    title: input.title,
    category: input.category ?? 'standard-win',
    concealedTiles: input.concealedTiles ?? [],
    melds: input.melds ?? [],
    flowers: input.flowers ?? [],
    winningTile: input.winningTile ?? null,
    expected: input.expected ?? {}
  }
}
