import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('nuxt image config allowlists the Amplify storage hostname instead of an invalid amazonaws placeholder', () => {
  const source = readFileSync(new URL('../../nuxt.config.ts', import.meta.url), 'utf8')

  assert.doesNotMatch(source, /\[':\/\/amazonaws\.com'\]/)
  assert.match(source, /buildStorageHostname|storage.*bucket_name/)
  assert.match(source, /providers:\s*\{[\s\S]*none:\s*\{/)
})
