import { ALL_SEATS, type BaselineRoundState, type Seat } from '@/core'
import {
  DRAGON_TILE_ORDER,
  FLOWER_TILE_ORDER,
  TILE_SUIT_ORDER,
  WIND_TILE_ORDER
} from '@/ui/constants/tiles'
import { formatTileLabel } from '@/ui/constants/tiles'
import type {
  GameTableMatchSummaryViewModel,
  GameTableMeldViewModel,
  GameTableRelativePosition,
  GameTableSnapshotViewModel
} from '@/views/game/types'

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

const createVisibleMelds = (
  round: BaselineRoundState,
  seat: Seat,
  humanSeat: Seat
): GameTableMeldViewModel[] => {
  const shouldRevealAllMelds = round.outcome.status === 'win' && round.outcome.result.winnerSeat === seat

  return round.players[seat].melds.map((meld) => {
    const shouldMaskConcealedKong = meld.type === 'kan-concealed'
      && seat !== humanSeat
      && !shouldRevealAllMelds

    if (shouldMaskConcealedKong) {
      return {
        type: meld.type,
        labels: Array.from({ length: meld.tiles.length }, () => '暗牌'),
        isMasked: true
      }
    }

    return {
      type: meld.type,
      labels: meld.tiles.map(formatTileLabel),
      isMasked: false
    }
  })
}

export const createGameTableSnapshot = (
  round: BaselineRoundState,
  humanSeat: Seat,
  match?: {
    config: {
      initialChips: number
      victoryMode: GameTableMatchSummaryViewModel['victoryMode']
      baseStake: number
      taiValue: number
    } | null
    chipsBySeat: Record<Seat, number>
    status: 'setup' | 'in-progress' | 'ended'
    winnerSeat: Seat | null
    lastRoundSettlement: {
      chipDeltaBySeat: Record<Seat, number>
      chipsAfterBySeat: Record<Seat, number>
    } | null
  }
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
          scoringItems: [...round.outcome.result.scoringItems],
          chipSettlements: match?.lastRoundSettlement == null
            ? []
            : ALL_SEATS.map(seat => ({
                seat,
                delta: match.lastRoundSettlement!.chipDeltaBySeat[seat],
                chipsAfter: match.lastRoundSettlement!.chipsAfterBySeat[seat]
              }))
        },
    dealerSeat: round.table.dealerSeat,
    prevailingWind: round.table.prevailingWind,
    wallCount: round.table.wall.length,
    lastClaimResolution: round.lastClaimResolution,
    matchSummary: match?.config == null
      ? null
      : {
          initialChips: match.config.initialChips,
          victoryMode: match.config.victoryMode,
          baseStake: match.config.baseStake,
          taiValue: match.config.taiValue,
          status: match.status === 'ended' ? 'ended' : 'in-progress',
          winnerSeat: match.winnerSeat
        },
    totalDiscards: Object.values(round.table.discards).reduce((total, seatDiscards) => {
      return total + seatDiscards.length
    }, 0),
    discardSequence: [...round.table.discardSequence],
    players: Object.values(round.players).map((player) => {
      return {
        seat: player.seat,
        relativePosition: getRelativePosition(player.seat, humanSeat),
        concealedCount: player.concealedTiles.length,
        concealedTiles: player.seat === humanSeat ? sortDisplayTiles(player.concealedTiles) : [],
        revealedWinningTiles: getRevealedWinningTiles(round, player.seat),
        flowerCount: player.flowers.length,
        meldCount: player.melds.length,
        melds: createVisibleMelds(round, player.seat, humanSeat),
        discardCount: round.table.discards[player.seat].length,
        discards: [...round.table.discards[player.seat]],
        score: match?.config == null ? player.score : match.chipsBySeat[player.seat],
        declaredReady: player.declaredReady
      }
    })
  }
}
