import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path: string): string => {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')
}

describe('frontend delivery policy', () => {
  it('keeps route views and the development bridge behind dynamic imports', () => {
    const routerSource = readProjectFile('src/router/index.ts')
    const gameViewSource = readProjectFile('src/views/game/GameView.vue')

    expect(routerSource).not.toMatch(/import HomeView from/)
    expect(routerSource).not.toMatch(/import GameView from/)
    expect(routerSource).toContain("() => import('@/views/home/HomeView.vue')")
    expect(routerSource).toContain("() => import('@/views/game/GameView.vue')")
    expect(gameViewSource).not.toMatch(/import \{ attachGameE2EBridge \} from/)
    expect(gameViewSource).toContain('if (import.meta.env.DEV)')
    expect(gameViewSource).toContain("await import('@/views/game/e2eBridge')")
  })

  it('emits route chunks without development bridge or precompression artifacts', () => {
    const assetDirectory = new URL('../../dist/assets/', import.meta.url)
    const assetNames = readdirSync(assetDirectory)
    const javascriptAssets = assetNames.filter(name => name.endsWith('.js'))
    const javascriptSource = javascriptAssets
      .map(name => readFileSync(new URL(name, assetDirectory), 'utf8'))
      .join('\n')

    expect(javascriptAssets.length).toBeGreaterThanOrEqual(2)
    expect(javascriptSource).not.toContain('seedPonClaimScenario')
    expect(javascriptSource).not.toContain('seedExhaustedSharedDiscardScenario')
    expect(assetNames.some(name => name.endsWith('.gz') || name.endsWith('.br'))).toBe(false)
  })
})
