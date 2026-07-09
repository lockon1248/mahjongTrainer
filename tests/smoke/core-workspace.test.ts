import { describe, expect, it } from 'vitest'
import { CORE_WORKSPACE_MODE, CORE_WORKSPACE_VERSION } from '../../src/core/index'

describe('core workspace bootstrap', () => {
  it('exposes the core foundation markers', () => {
    expect(CORE_WORKSPACE_MODE).toBe('core-foundation')
    expect(CORE_WORKSPACE_VERSION).toBe('0.1.0')
  })
})
