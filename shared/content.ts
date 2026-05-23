export type StorageConfig = {
  storageBucket: string
  awsRegion: string
}

export type FeatureRecord = {
  slug: string
  headline: string
  title: string
  description: string
  imagePath?: string | null
  imageAlt?: string | null
}

export type ArticleRecord = {
  slug: string
  title: string
  content: string
  publishedAt: string
  coverPath?: string | null
  coverAlt?: string | null
}

export type ContentImage = {
  path: string | null
  alt: string
  url: string | null
}

export type FeatureContent = {
  slug: string
  headline: string
  title: string
  description: string
  image: ContentImage
}

export type ArticleContent = {
  slug: string
  title: string
  content: string
  publishedAt: string
  cover: ContentImage
}

export type FeatureApiResponse = {
  configured: boolean
  feature: FeatureContent | null
  error?: string
}

export type ArticlesApiResponse = {
  configured: boolean
  articles: ArticleContent[]
  error?: string
}

export function buildStorageObjectUrl(storageBucket: string, awsRegion: string, objectPath: string | null | undefined) {
  if (!objectPath) {
    return null
  }

  return `https://${storageBucket}.s3.${awsRegion}.amazonaws.com/${objectPath}`
}

export function normalizeFeatureRecord(feature: FeatureRecord, storage: StorageConfig): FeatureContent {
  return {
    slug: feature.slug,
    headline: feature.headline,
    title: feature.title,
    description: feature.description,
    image: {
      path: feature.imagePath ?? null,
      alt: feature.imageAlt ?? feature.title,
      url: buildStorageObjectUrl(storage.storageBucket, storage.awsRegion, feature.imagePath),
    },
  }
}

export function normalizeArticleRecord(article: ArticleRecord, storage: StorageConfig): ArticleContent {
  return {
    slug: article.slug,
    title: article.title,
    content: article.content,
    publishedAt: article.publishedAt,
    cover: {
      path: article.coverPath ?? null,
      alt: article.coverAlt ?? article.title,
      url: buildStorageObjectUrl(storage.storageBucket, storage.awsRegion, article.coverPath),
    },
  }
}
