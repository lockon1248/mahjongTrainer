import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  assertSupportedNodeVersion,
  readRequiredNodeMajor
} from '../../scripts/node-version-policy.mjs'

const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  engines?: { node?: string }
  scripts: Record<string, string>
}

const supportedEntries = [
  'dev',
  'preview',
  'build',
  'test',
  'test:watch',
  'typecheck',
  'test:e2e',
  'test:e2e:headed'
] as const

describe('repository Node version policy', () => {
  it('parses the required positive major from .nvmrc content', () => {
    expect(readRequiredNodeMajor('22\n')).toBe(22)
    expect(() => readRequiredNodeMajor('v22')).toThrow('invalid Node major in .nvmrc')
    expect(() => readRequiredNodeMajor('0')).toThrow('invalid Node major in .nvmrc')
  })

  it('accepts Node 22 and rejects Node 18 with the recovery command', () => {
    expect(() => assertSupportedNodeVersion('v22.21.1', 22)).not.toThrow()
    expect(() => assertSupportedNodeVersion('v18.20.8', 22)).toThrow(
      'Node 22 is required by .nvmrc; current runtime is v18.20.8. Run "nvm use".'
    )
  })

  it('connects every supported package entry to the same preflight', () => {
    expect(packageJson.engines?.node).toBe('22.x')

    for (const entry of supportedEntries)
      expect(packageJson.scripts[`pre${entry}`]).toBe('node scripts/check-node-version.mjs')
  })
})
