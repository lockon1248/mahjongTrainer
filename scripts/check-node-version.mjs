import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  assertSupportedNodeVersion,
  readRequiredNodeMajor
} from './node-version-policy.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '..')
const requiredMajor = readRequiredNodeMajor(
  readFileSync(resolve(repositoryRoot, '.nvmrc'), 'utf8')
)

try {
  assertSupportedNodeVersion(process.version, requiredMajor)
}
catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
