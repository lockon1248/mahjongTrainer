import { describe, expect, it } from 'vitest'
import {
  buildSettlementResult,
  decomposeStandardHand,
  evaluateScoringPatterns,
  validateStandardWin
} from '@/core/index'

describe('scoring exports', () => {
  it('exposes the scoring foundation entrypoints from src/core/index.ts', () => {
    expect(decomposeStandardHand).toBeTypeOf('function')
    expect(validateStandardWin).toBeTypeOf('function')
    expect(evaluateScoringPatterns).toBeTypeOf('function')
    expect(buildSettlementResult).toBeTypeOf('function')
  })
})
