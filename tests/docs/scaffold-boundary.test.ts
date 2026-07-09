import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const SCAFFOLD_BOUNDARY_PATH = resolve(
  process.cwd(),
  'openspec/changes/archive/2026-07-09-taiwan-mahjong-core-foundation/vue-scaffold-boundary.md'
)

describe('vue scaffold boundary', () => {
  it('documents what is allowed before vue scaffold starts', () => {
    const content = readFileSync(SCAFFOLD_BOUNDARY_PATH, 'utf8')

    expect(content).toContain('# Vue Scaffold 邊界決策')
    expect(content).toContain('## 先做內容')
    expect(content).toContain('- rules baseline')
    expect(content).toContain('- rule test matrix')
    expect(content).toContain('- core domain model')
    expect(content).toContain('- rule-case schema')
  })

  it('documents deferred scope and the trigger to start vue scaffold', () => {
    const content = readFileSync(SCAFFOLD_BOUNDARY_PATH, 'utf8')

    expect(content).toContain('## 明確延後內容')
    expect(content).toContain('- Vue app scaffold')
    expect(content).toContain('- router')
    expect(content).toContain('- pinia')
    expect(content).toContain('- 牌桌 UI')
    expect(content).toContain('## 何時啟動 Vue scaffold')
    expect(content).toContain('規則文件、規則測試矩陣、core domain model、rule-case schema')
    expect(content).toContain('## 啟動後第一批允許內容')
  })
})
