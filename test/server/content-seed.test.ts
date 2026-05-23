import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSeedArticlesResponse,
  buildSeedFeatureResponse,
} from '../../server/data/content-seed'

test('buildSeedFeatureResponse returns extracted fallback homepage content', () => {
  const response = buildSeedFeatureResponse('Amplify is not configured')

  assert.equal(response.configured, false)
  assert.equal(response.error, 'Amplify is not configured')
  assert.equal(response.feature?.title, 'Coffee Bar')
  assert.equal(response.feature?.image.url, '/migrated-content/coffee_beans_68c2d68a8d.jpeg')
})

test('buildSeedArticlesResponse returns extracted fallback gallery content', () => {
  const response = buildSeedArticlesResponse('Amplify is not configured')

  assert.equal(response.configured, false)
  assert.equal(response.error, 'Amplify is not configured')
  assert.equal(response.articles.length, 5)
  assert.equal(response.articles[0]?.slug, 'beautiful-picture')
})
