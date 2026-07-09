import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const RULES_BASELINE_PATH = resolve(
  process.cwd(),
  'openspec/specs/taiwan-mahjong-rules-baseline.md'
)

const REQUIRED_HEADINGS = [
  '# 台灣 16 張麻將規則 baseline',
  '## 基本桌規',
  '## 合法動作規則',
  '## 胡牌成立條件',
  '## 台型清單',
  '## 結算規則',
  '## 待確認／爭議規則',
  '## 測試案例對照'
]

describe('rules baseline structure', () => {
  it('contains every required section heading', () => {
    const content = readFileSync(RULES_BASELINE_PATH, 'utf8')

    expect(content.trim().length).toBeGreaterThan(0)

    for (const heading of REQUIRED_HEADINGS) {
      expect(content).toContain(heading)
    }
  })
})
