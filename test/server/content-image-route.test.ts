import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('content image route redirects requested object paths through the signed storage URL resolver', () => {
  const source = readFileSync(new URL('../../server/routes/content-image.get.ts', import.meta.url), 'utf8')

  assert.match(source, /resolveStorageObjectUrl/)
  assert.match(source, /sendRedirect/)
  assert.match(source, /getQuery/)
})
