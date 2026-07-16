import { ALL_SEATS, type BaselineRoundState, type Seat } from '@/core'
import {
  DRAGON_TILE_ORDER,
  FLOWER_TILE_ORDER,
  TILE_SUIT_ORDER,
  WIND_TILE_ORDER
} from '@/ui/constants/tiles'
import type { GameTableRelativePosition, GameTableSnapshotViewModel } from '@/views/game/types'

const SEAT_ORDER: readonly Seat[] = ALL_SEATS

const getRelativePosition = (
  seat: Seat,
  humanSeat: Seat
): GameTableRelativePosition => {
  const seatIndex = SEAT_ORDER.indexOf(seat)
  const humanSeatIndex = SEAT_ORDER.indexOf(humanSeat)
  const offset = (seatIndex - humanSeatIndex + SEAT_ORDER.length) % SEAT_ORDER.length

  return ['bottom', 'right', 'top', 'left'][offset] as GameTableRelativePosition
}

const compareTile = (left: BaselineRoundState['players'][Seat]['concealedTiles'][number], right: BaselineRoundState['players'][Seat]['concealedTiles'][number]): number => {
  const suitDelta = TILE_SUIT_ORDER.indexOf(left.suit) - TILE_SUIT_ORDER.indexOf(right.suit)

  if (suitDelta !== 0)
    return suitDelta

  if (
    (left.suit === 'characters' || left.suit === 'dots' || left.suit === 'bamboo')
    && (right.suit === 'characters' || right.suit === 'dots' || right.suit === 'bamboo')
  ) {
    return left.rank - right.rank
  }

  if (left.suit === 'winds' && right.suit === 'winds')
    return WIND_TILE_ORDER.indexOf(left.rank) - WIND_TILE_ORDER.indexOf(right.rank)

  if (left.suit === 'dragons' && right.suit === 'dragons')
    return DRAGON_TILE_ORDER.indexOf(left.rank) - DRAGON_TILE_ORDER.indexOf(right.rank)

  if (left.suit === 'flower' && right.suit === 'flower')
    return FLOWER_TILE_ORDER.indexOf(left.rank) - FLOWER_TILE_ORDER.indexOf(right.rank)

  return 0
}

const sortDisplayTiles = (tiles: BaselineRoundState['players'][Seat]['concealedTiles']): BaselineRoundState['players'][Seat]['concealedTiles'] => {
  return [...tiles].sort(compareTile)
}

const getRevealedWinningTiles = (round: BaselineRoundState, seat: Seat): BaselineRoundState['players'][Seat]['concealedTiles'] => {
  if (round.outcome.status !== 'win' || round.outcome.result.winnerSeat !== seat)
    return []

  const winningTile = round.outcome.result.discarderSeat != null
    && round.lastClaimResolution?.seat === seat
    && round.lastClaimResolution.type === 'win'
    ? round.lastClaimResolution.tile
    : null

  return sortDisplayTiles([
    ...round.players[seat].concealedTiles,
    ...(winningTile == null ? [] : [winningTile])
  ])
}

export const createGameTableSnapshot = (
  round: BaselineRoundState,
  humanSeat: Seat
): GameTableSnapshotViewModel => {
  return {
    humanSeat,
    currentSeat: round.currentSeat,
    phase: round.phase,
    outcome: round.outcome.status,
    resultSummary: round.outcome.status === 'in-progress'
      ? null
      : {
          type: round.outcome.result.type,
          ended: true,
          winnerSeat: round.outcome.result.winnerSeat,
          discarderSeat: round.outcome.result.discarderSeat,
          totalTai: round.outcome.result.totalTai,
          drawReason: round.outcome.result.drawReason ?? null,
          scoringItems: [...round.outcome.result.scoringItems]
        },
    dealerSeat: round.table.dealerSeat,
    prevailingWind: round.table.prevailingWind,
    wallCount: round.table.wall.length,
    lastClaimResolution: round.lastClaimResolution,
    totalDiscards: Object.values(round.table.discards).reduce((total, seatDiscards) => {
      return total + seatDiscards.length
    }, 0),
    players: Object.values(round.players).map((player) => {
      return {
        seat: player.seat,
        relativePosition: getRelativePosition(player.seat, humanSeat),
        concealedCount: player.concealedTiles.length,
        concealedTiles: player.seat === humanSeat ? sortDisplayTiles(player.concealedTiles) : [],
        revealedWinningTiles: getRevealedWinningTiles(round, player.seat),
        flowerCount: player.flowers.length,
        meldCount: player.melds.length,
        melds: player.melds.map(meld => ({
          ...meld,
          tiles: [...meld.tiles]
        })),
        discardCount: round.table.discards[player.seat].length,
        discards: [...round.table.discards[player.seat]],
        score: player.score,
        declaredReady: player.declaredReady
      }
    })
  }
}
