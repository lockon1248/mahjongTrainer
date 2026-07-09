import type { BaselineRoundState } from '@/core'
import type { GameTableSnapshotViewModel } from '@/views/game/types'

export const createGameTableSnapshot = (
  round: BaselineRoundState
): GameTableSnapshotViewModel => {
  return {
    currentSeat: round.currentSeat,
    phase: round.phase,
    outcome: round.outcome.status,
    dealerSeat: round.table.dealerSeat,
    prevailingWind: round.table.prevailingWind,
    wallCount: round.table.wall.length,
    totalDiscards: Object.values(round.table.discards).reduce((total, seatDiscards) => {
      return total + seatDiscards.length
    }, 0),
    players: Object.values(round.players).map((player) => {
      return {
        seat: player.seat,
        concealedCount: player.concealedTiles.length,
        flowerCount: player.flowers.length,
        meldCount: player.melds.length,
        score: player.score,
        declaredReady: player.declaredReady
      }
    })
  }
}
