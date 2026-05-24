import type { H3Event } from 'h3'

import type { ArticlesApiResponse, FeatureApiResponse } from '../../shared/content'
import { buildSeedArticlesResponse, buildSeedFeatureResponse } from '../data/content-seed'
import { normalizeArticleRecord, normalizeFeatureRecord } from '../../shared/content'
import { extractArticleRecords, extractFeatureRecord } from './amplify-content'
import { getAmplifyPublicReadConfig } from './amplify-runtime'

const listFeaturesQuery = `
  query ListFeatures {
    listFeatures {
      items {
        slug
        headline
        title
        description
        imagePath
        imageAlt
      }
    }
  }
`

const listArticlesQuery = `
  query ListArticles {
    listArticles {
      items {
        slug
        title
        content
        publishedAt
        coverPath
        coverAlt
      }
    }
  }
`

type GraphqlResponse<TData> = {
  data?: TData
  errors?: Array<{ message: string }>
}

async function requestAmplifyGraphql<TData>(query: string) {
  const config = getAmplifyPublicReadConfig()
  const response = await $fetch<GraphqlResponse<TData>>(config.endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': config.apiKey,
    },
    body: { query },
  })

  if (response.errors?.length) {
    throw new Error(response.errors.map((error) => error.message).join('; '))
  }

  return {
    config,
    response,
  }
}

export async function fetchFeatureContent(_event: H3Event): Promise<FeatureApiResponse> {
  try {
    const { config, response } = await requestAmplifyGraphql<{
      listFeatures?: {
        items?: Array<{
          slug: string
          headline: string
          title: string
          description: string
          imagePath?: string | null
          imageAlt?: string | null
        }>
      }
    }>(listFeaturesQuery)

    const feature = extractFeatureRecord(response)

    return {
      configured: true,
      feature: feature ? normalizeFeatureRecord(feature, config) : null,
    }
  }
  catch (error) {
    return buildSeedFeatureResponse(
      error instanceof Error ? error.message : 'Failed to load feature content',
    )
  }
}

export async function fetchArticleContent(_event: H3Event): Promise<ArticlesApiResponse> {
  try {
    const { config, response } = await requestAmplifyGraphql<{
      listArticles?: {
        items?: Array<{
          slug: string
          title: string
          content: string
          publishedAt: string
          coverPath?: string | null
          coverAlt?: string | null
        }>
      }
    }>(listArticlesQuery)

    return {
      configured: true,
      articles: extractArticleRecords(response).map((article) => normalizeArticleRecord(article, config)),
    }
  }
  catch (error) {
    return buildSeedArticlesResponse(
      error instanceof Error ? error.message : 'Failed to load article content',
    )
  }
}
