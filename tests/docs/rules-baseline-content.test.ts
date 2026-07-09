import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const RULES_BASELINE_PATH = resolve(
  process.cwd(),
  'openspec/specs/taiwan-mahjong-rules-baseline.md'
)

describe('rules baseline content', () => {
  it('documents the confirmed table rules and action flow', () => {
    const content = readFileSync(RULES_BASELINE_PATH, 'utf8')

    expect(content).toContain('- 玩家數：4 人')
    expect(content).toContain('- 麻將總數：144 張')
    expect(content).toContain('- 閒家起手 16 張')
    expect(content).toContain('- 莊家起手 17 張')
    expect(content).toContain('- 每回合摸 1 打 1')
    expect(content).toContain('- 胡牌後手牌共 17 張')
    expect(content).toContain('- 五組面子')
    expect(content).toContain('- 一組將眼')
    expect(content).toContain('摸到花牌後必須立即亮出，並從牌尾補牌')
    expect(content).toContain('若補到花牌，必須持續補牌直到補到非花牌')
    expect(content).toContain('- 摸')
    expect(content).toContain('- 打')
    expect(content).toContain('- 吃')
    expect(content).toContain('- 碰')
    expect(content).toContain('- 明槓')
    expect(content).toContain('- 暗槓')
    expect(content).toContain('- 加槓')
    expect(content).toContain('- 胡')
    expect(content).toContain('- 過')
    expect(content).toContain('只能吃上家')
    expect(content).toContain('胡 > 槓 > 碰 > 吃')
    expect(content).toContain('自摸三家付')
    expect(content).toContain('放槍者單獨支付')
  })

  it('keeps variable rules out of hard-coded baseline behavior', () => {
    const content = readFileSync(RULES_BASELINE_PATH, 'utf8')

    expect(content).toContain('## 待確認／爭議規則')
    expect(content).toContain('## 可配置規則')
    expect(content).toContain('| 是否可吃 |')
    expect(content).toContain('| 是否可槓上家 |')
    expect(content).toContain('| 自摸是否三家包 |')
    expect(content).toContain('| 放槍是否包牌 |')
    expect(content).toContain('| 花牌計分 |')
    expect(content).toContain('| 最低胡牌台數 |')
    expect(content).toContain('| 是否允許搶槓 |')
    expect(content).toContain('| 是否一炮多響 |')
    expect(content).toContain('| 流局是否查聽 |')
    expect(content).toContain('| 花牌補牌方式 |')
  })
})
