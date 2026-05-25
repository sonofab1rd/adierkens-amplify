import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('homepage reads feature content through the Nitro API instead of a direct Amplify client', () => {
  const source = readFileSync(new URL('../../app/pages/index.vue', import.meta.url), 'utf8')

  assert.match(source, /useFetch<FeatureApiResponse>\('\/api\/content\/feature'\)/)
  assert.match(source, /provider="none"/)
  assert.doesNotMatch(source, /generateClient|client\.models\.Feature/)
})
