import assert from 'node:assert/strict'
import test from 'node:test'

import {
  extractArticleRecords,
  extractFeatureRecord,
} from '../../server/utils/amplify-content'

test('extractFeatureRecord returns the first feature item from a GraphQL list response', () => {
  assert.deepEqual(
    extractFeatureRecord({
      data: {
        listFeatures: {
          items: [
            {
              slug: 'home',
              headline: 'Featured',
              title: 'Audrey Dierkens',
              description: 'Painter and storyteller.',
              imagePath: 'public/content/feature/hero.jpg',
              imageAlt: 'Audrey portrait',
            },
          ],
        },
      },
    }),
    {
      slug: 'home',
      headline: 'Featured',
      title: 'Audrey Dierkens',
      description: 'Painter and storyteller.',
      imagePath: 'public/content/feature/hero.jpg',
      imageAlt: 'Audrey portrait',
    },
  )
})

test('extractArticleRecords sorts articles newest first', () => {
  assert.deepEqual(
    extractArticleRecords({
      data: {
        listArticles: {
          items: [
            {
              slug: 'older-show',
              title: 'Older Show',
              content: 'Older content.',
              publishedAt: '2026-04-01T00:00:00.000Z',
              coverPath: 'public/content/articles/older-show.jpg',
            },
            {
              slug: 'newer-show',
              title: 'Newer Show',
              content: 'Newer content.',
              publishedAt: '2026-05-01T00:00:00.000Z',
              coverPath: 'public/content/articles/newer-show.jpg',
            },
          ],
        },
      },
    }),
    [
      {
        slug: 'newer-show',
        title: 'Newer Show',
        content: 'Newer content.',
        publishedAt: '2026-05-01T00:00:00.000Z',
        coverPath: 'public/content/articles/newer-show.jpg',
      },
      {
        slug: 'older-show',
        title: 'Older Show',
        content: 'Older content.',
        publishedAt: '2026-04-01T00:00:00.000Z',
        coverPath: 'public/content/articles/older-show.jpg',
      },
    ],
  )
})
