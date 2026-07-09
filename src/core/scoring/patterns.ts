import type { ScoringPatternResult, StandardHandBreakdown, StandardWinInput } from '@/core/scoring/types'

export function evaluateScoringPatterns(
  input: StandardWinInput,
  breakdown: StandardHandBreakdown | null
): ScoringPatternResult[] {
  if (breakdown === null) {
    return []
  }

  const patterns: ScoringPatternResult[] = []

  if (input.winningSeat === 'east') {
    patterns.push('dealer-win')
  }

  if (input.winningSeat && input.discarderSeat == null) {
    patterns.push('self-draw')
  }

  return patterns
}
