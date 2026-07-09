import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const RULE_TEST_MATRIX_PATH = resolve(
  process.cwd(),
  'openspec/specs/taiwan-mahjong-rule-test-matrix.md'
)

describe('rule test matrix', () => {
  it('defines the required scenario categories', () => {
    const content = readFileSync(RULE_TEST_MATRIX_PATH, 'utf8')

    expect(content).toContain('# 台灣 16 張麻將規則測試矩陣')
    expect(content).toContain('## 案例分類')
    expect(content).toContain('- 一般胡牌')
    expect(content).toContain('- 副露胡牌')
    expect(content).toContain('- 補花')
    expect(content).toContain('- 連續補花')
    expect(content).toContain('- 宣告優先序')
    expect(content).toContain('- 流局')
    expect(content).toContain('- 台型組合')
  })

  it('defines the required case ids and their coverage intent', () => {
    const content = readFileSync(RULE_TEST_MATRIX_PATH, 'utf8')

    expect(content).toContain('WIN-STANDARD-001')
    expect(content).toContain('WIN-MELD-001')
    expect(content).toContain('FLOWER-REPLACE-001')
    expect(content).toContain('FLOWER-CHAIN-001')
    expect(content).toContain('CLAIM-PRIORITY-001')
    expect(content).toContain('DRAW-DEALER-001')
    expect(content).toContain('SCORE-STACK-001')
    expect(content).toContain('| Case ID | Category | 驗證重點 | 依據規則 | 備註 |')
  })
})
