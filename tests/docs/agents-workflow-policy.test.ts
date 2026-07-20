import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const agentsText = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8')
const numberedHeadings = [...agentsText.matchAll(/^## (\d+[A-Z]?)\.\s+(.+)$/gm)].map((match) => ({
  id: match[1]!,
  title: match[2]!
}))

describe('AGENTS workflow authority', () => {
  it('uses every numbered hard-gate identifier exactly once', () => {
    const ids = numberedHeadings.map(heading => heading.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('names every workflow authority as an explicit section', () => {
    const titles = numberedHeadings.map(heading => heading.title).join('\n')

    for (const authority of [
      'Environment',
      'Mainline',
      'Post-MVP',
      'Verification',
      'Harness Engineering',
      'Audit',
      'Repair and Closure Authority'
    ])
      expect(titles).toContain(authority)
  })

  it('defines one explicit workflow state transition', () => {
    expect(agentsText.match(/audit \(read-only\) → explicit repair authority → propose\/apply → layer verification → explicit closure authority → archive\/mainline sync/g)).toHaveLength(1)
  })
})
