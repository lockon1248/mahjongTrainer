import type { Meld } from '@/core/types/player'
import type { Tile } from '@/core/types/tile'
import type { BreakdownGroup, StandardHandBreakdown, StandardWinInput } from '@/core/scoring/types'

export const decomposeStandardHand = (input: StandardWinInput): StandardHandBreakdown | null => {
  const meldGroups = input.melds.map(createMeldBreakdownGroup)
  const concealedTiles = sortTiles([
    ...input.concealedTiles,
    ...(input.winningTile ? [input.winningTile] : [])
  ])
  const concealedMeldsNeeded = 5 - meldGroups.length

  if (concealedMeldsNeeded < 0) {
    return null
  }

  for (const pairCandidate of getPairCandidates(concealedTiles)) {
    const remainingTiles = removeTiles(concealedTiles, pairCandidate)
    const concealedGroups = findMeldGroups(remainingTiles, concealedMeldsNeeded)

    if (concealedGroups !== null) {
      return {
        meldGroups: [...meldGroups, ...concealedGroups],
        pairGroup: {
          kind: 'pair',
          source: 'concealed',
          tiles: pairCandidate
        }
      }
    }
  }

  return null
}

const findMeldGroups = (tiles: Tile[], groupsNeeded: number): BreakdownGroup[] | null => {
  if (groupsNeeded === 0) {
    return tiles.length === 0 ? [] : null
  }

  if (tiles.length < groupsNeeded * 3) {
    return null
  }

  const [firstTile] = tiles

  if (!firstTile) {
    return null
  }

  const triplet = [firstTile, firstTile, firstTile]
  if (hasTiles(tiles, triplet)) {
    const remainingTiles = removeTiles(tiles, triplet)
    const groups = findMeldGroups(remainingTiles, groupsNeeded - 1)

    if (groups !== null) {
      return [
        {
          kind: 'triplet',
          source: 'concealed',
          tiles: triplet
        },
        ...groups
      ]
    }
  }

  const sequence = createSequence(firstTile)
  if (sequence && hasTiles(tiles, sequence)) {
    const remainingTiles = removeTiles(tiles, sequence)
    const groups = findMeldGroups(remainingTiles, groupsNeeded - 1)

    if (groups !== null) {
      return [
        {
          kind: 'sequence',
          source: 'concealed',
          tiles: sequence
        },
        ...groups
      ]
    }
  }

  return null
}

const createMeldBreakdownGroup = (meld: Meld): BreakdownGroup => {
  return {
    kind: inferMeldGroupKind(meld),
    source: 'meld',
    tiles: sortTiles(meld.tiles)
  }
}

const inferMeldGroupKind = (meld: Meld): BreakdownGroup['kind'] => {
  if (meld.tiles.length === 4) {
    return 'quad'
  }

  if (meld.type === 'chi') {
    return 'sequence'
  }

  return 'triplet'
}

const getPairCandidates = (tiles: Tile[]): Tile[][] => {
  const pairs: Tile[][] = []

  for (let index = 0; index < tiles.length - 1; index += 1) {
    const current = tiles[index]
    const next = tiles[index + 1]

    if (current && next && isSameTile(current, next)) {
      if (!pairs.some(([candidate]) => candidate && isSameTile(candidate, current))) {
        pairs.push([current, next])
      }
    }
  }

  return pairs
}

const createSequence = (tile: Tile): Tile[] | null => {
  if (
    (tile.suit === 'characters' || tile.suit === 'dots' || tile.suit === 'bamboo') &&
    tile.rank <= 7
  ) {
    return [
      tile,
      { suit: tile.suit, rank: (tile.rank + 1) as typeof tile.rank },
      { suit: tile.suit, rank: (tile.rank + 2) as typeof tile.rank }
    ]
  }

  return null
}

const hasTiles = (sourceTiles: Tile[], targetTiles: Tile[]): boolean => {
  const remaining = [...sourceTiles]

  for (const targetTile of targetTiles) {
    const index = remaining.findIndex((tile) => isSameTile(tile, targetTile))

    if (index === -1) {
      return false
    }

    remaining.splice(index, 1)
  }

  return true
}

const removeTiles = (sourceTiles: Tile[], targetTiles: Tile[]): Tile[] => {
  const remaining = [...sourceTiles]

  for (const targetTile of targetTiles) {
    const index = remaining.findIndex((tile) => isSameTile(tile, targetTile))

    if (index !== -1) {
      remaining.splice(index, 1)
    }
  }

  return remaining
}

const isSameTile = (left: Tile, right: Tile): boolean => {
  return left.suit === right.suit && left.rank === right.rank
}

const sortTiles = (tiles: Tile[]): Tile[] => {
  return [...tiles].sort((left, right) => compareTile(left, right))
}

const compareTile = (left: Tile, right: Tile): number => {
  const suitOrder = ['characters', 'dots', 'bamboo', 'winds', 'dragons', 'flower'] as const
  const suitDelta = suitOrder.indexOf(left.suit) - suitOrder.indexOf(right.suit)

  if (suitDelta !== 0) {
    return suitDelta
  }

  return String(left.rank).localeCompare(String(right.rank), 'en')
}
