import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path: string): string => {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')
}

describe('E2E Window bridge typing policy', () => {
  it('uses one compiler-checked bridge contract without assertion escapes', () => {
    const bridgeSource = readProjectFile('src/views/game/e2eBridge.ts')
    const environmentSource = readProjectFile('src/env.d.ts')
    const e2eSource = readProjectFile('e2e/game-table.smoke.spec.ts')
    const tsconfig = JSON.parse(readProjectFile('tsconfig.json')) as { include?: string[] }

    expect(bridgeSource).toContain('export type GameE2EBridge')
    expect(environmentSource).toContain("__MAHJONG_E2E__?: import('@/views/game/e2eBridge').GameE2EBridge")
    expect(tsconfig.include).toContain('e2e/**/*.ts')
    expect(e2eSource).not.toContain('window as Window &')
    expect(e2eSource).not.toContain('as unknown')
  })

  it('keeps browser timer handles numeric when Node ambient types are loaded', () => {
    const gameViewSource = readProjectFile('src/views/game/GameView.vue')

    expect(gameViewSource).toContain('let autoAdvanceTimer: number | null = null')
    expect(gameViewSource).not.toContain('ReturnType<typeof window.setTimeout>')
  })
})
