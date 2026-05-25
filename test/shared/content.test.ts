import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildStorageHostname,
  buildStorageObjectUrl,
  normalizeArticleRecord,
  normalizeFeatureRecord,
} from '../../shared/content'

test('buildStorageHostname returns the bucket-specific S3 hostname', () => {
  assert.equal(
    buildStorageHostname('site-content', 'us-east-1'),
    'site-content.s3.us-east-1.amazonaws.com',
  )
})

test('buildStorageObjectUrl returns null when no object path is available', () => {
  assert.equal(buildStorageObjectUrl('site-content', 'us-east-1', null), null)
})

test('buildStorageObjectUrl returns the Nitro image route for an object path', () => {
  assert.equal(
    buildStorageObjectUrl('site-content', 'us-east-1', 'public/content/feature/hero.jpg'),
    '/content-image?path=public%2Fcontent%2Ffeature%2Fhero.jpg',
  )
})

test('normalizeFeatureRecord converts a feature record into homepage content', () => {
  const feature = normalizeFeatureRecord(
    {
      slug: 'home',
      headline: 'Featured',
      title: 'Audrey Dierkens',
      description: 'Painter and storyteller.',
      imagePath: 'public/content/feature/hero.jpg',
      imageAlt: 'Audrey portrait',
    },
    {
      storageBucket: 'site-content',
      awsRegion: 'us-east-1',
    },
  )

  assert.deepEqual(feature, {
    slug: 'home',
    headline: 'Featured',
    title: 'Audrey Dierkens',
    description: 'Painter and storyteller.',
    image: {
      path: 'public/content/feature/hero.jpg',
      alt: 'Audrey portrait',
      url: '/content-image?path=public%2Fcontent%2Ffeature%2Fhero.jpg',
    },
  })
})

test('normalizeArticleRecord converts an article record into gallery content', () => {
  const article = normalizeArticleRecord(
    {
      slug: 'spring-show',
      title: 'Spring Show',
      content: 'A new collection.',
      publishedAt: '2026-05-01T00:00:00.000Z',
      coverPath: 'public/content/articles/spring-show.jpg',
      coverAlt: 'Spring collection cover',
    },
    {
      storageBucket: 'site-content',
      awsRegion: 'us-east-1',
    },
  )

  assert.deepEqual(article, {
    slug: 'spring-show',
    title: 'Spring Show',
    content: 'A new collection.',
    publishedAt: '2026-05-01T00:00:00.000Z',
    cover: {
      path: 'public/content/articles/spring-show.jpg',
      alt: 'Spring collection cover',
      url: '/content-image?path=public%2Fcontent%2Farticles%2Fspring-show.jpg',
    },
  })
})
