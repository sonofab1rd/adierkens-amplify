import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildStorageObjectUrl,
  normalizeArticleRecord,
  normalizeFeatureRecord,
} from '../../shared/content'

test('buildStorageObjectUrl returns null when no object path is available', () => {
  assert.equal(buildStorageObjectUrl('site-content', 'us-east-1', null), null)
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
      url: 'https://site-content.s3.us-east-1.amazonaws.com/public/content/feature/hero.jpg',
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
      url: 'https://site-content.s3.us-east-1.amazonaws.com/public/content/articles/spring-show.jpg',
    },
  })
})
