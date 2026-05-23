import type { ArticleRecord, FeatureRecord } from '../../shared/content'

type FeatureListResponse = {
  data?: {
    listFeatures?: {
      items?: FeatureRecord[]
    }
  }
}

type ArticleListResponse = {
  data?: {
    listArticles?: {
      items?: ArticleRecord[]
    }
  }
}

export function extractFeatureRecord(response: FeatureListResponse) {
  return response.data?.listFeatures?.items?.[0] ?? null
}

export function extractArticleRecords(response: ArticleListResponse) {
  return [...(response.data?.listArticles?.items ?? [])].sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  })
}
