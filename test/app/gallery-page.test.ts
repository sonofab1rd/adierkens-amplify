import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('gallery reads article content through the Nitro API and renders storage images without IPX optimization', () => {
  const source = readFileSync(new URL('../../app/pages/gallery.vue', import.meta.url), 'utf8')

  assert.match(source, /useFetch<ArticlesApiResponse>\('\/api\/content\/articles'\)/)
  assert.match(source, /provider="none"/)
  assert.doesNotMatch(source, /generateClient|client\.models\.Article/)
})
