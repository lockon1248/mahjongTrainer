import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('game session store HMR contract', () => {
  it('registers Pinia HMR acceptance for the setup store', () => {
    const source = readFileSync('src/stores/gameSession.ts', 'utf8')

    expect(source).toMatch(/import\s*\{[^}]*acceptHMRUpdate[^}]*\}\s*from\s*['"]pinia['"]/)
    expect(source).toContain('import.meta.hot.accept(acceptHMRUpdate(useGameSessionStore, import.meta.hot))')
  })
})
