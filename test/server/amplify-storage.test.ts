import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveStorageObjectUrl } from '../../server/utils/amplify-storage'

test('resolveStorageObjectUrl returns null when no storage path is provided', async () => {
  assert.equal(await resolveStorageObjectUrl(null), null)
})

test('resolveStorageObjectUrl configures Amplify and returns the signed URL', async () => {
  let configured = 0
  const calls: Array<{ path: string }> = []

  const url = await resolveStorageObjectUrl('public/content/feature/hero.jpg', {
    ensureConfigured: () => {
      configured += 1
    },
    getUrl: async ({ path }) => {
      calls.push({ path })

      return {
        url: new URL('https://example.com/signed-image.jpg?token=abc123'),
        expiresAt: new Date('2026-05-24T00:00:00.000Z'),
      }
    },
  })

  assert.equal(configured, 1)
  assert.deepEqual(calls, [{ path: 'public/content/feature/hero.jpg' }])
  assert.equal(url, 'https://example.com/signed-image.jpg?token=abc123')
})
