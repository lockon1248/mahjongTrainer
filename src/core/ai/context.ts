import type { BaselineRoundState } from '@/core/rules/types'
import type { CreateAiDecisionContextInput, AiDecisionContext } from '@/core/ai/types'

export const createAiDecisionContext = (
  round: BaselineRoundState,
  input: CreateAiDecisionContextInput
): AiDecisionContext => {
  const player = round.players[input.seat]

  return {
    seat: input.seat,
    phase: round.phase,
    currentSeat: round.currentSeat,
    triggeringTile: round.pendingActionWindow?.triggeringTile ?? null,
    concealedTiles: player.concealedTiles,
    melds: player.melds,
    flowers: player.flowers,
    legalDiscards: round.phase === 'discard' && round.currentSeat === input.seat
      ? player.concealedTiles
      : [],
    legalClaims: input.legalClaims ?? [],
    ruleConfig: round.ruleConfig
  }
}
