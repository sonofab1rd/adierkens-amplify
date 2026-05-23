type PublicRuntimeConfig = {
  amplifyAppsyncEndpoint?: string
  amplifyAwsRegion?: string
  amplifyStorageBucket?: string
}

type RuntimeConfigLike = {
  amplifyApiKey?: string
  public: PublicRuntimeConfig
}

export type AmplifyPublicReadConfig = {
  apiKey: string
  endpoint: string
  awsRegion: string
  storageBucket: string
}

export function getAmplifyPublicReadConfig(config: RuntimeConfigLike): AmplifyPublicReadConfig {
  const apiKey = config.amplifyApiKey?.trim()
  const endpoint = config.public.amplifyAppsyncEndpoint?.trim()
  const awsRegion = config.public.amplifyAwsRegion?.trim()
  const storageBucket = config.public.amplifyStorageBucket?.trim()

  if (!apiKey || !endpoint || !awsRegion || !storageBucket) {
    throw new Error('Missing Amplify public read configuration')
  }

  return {
    apiKey,
    endpoint,
    awsRegion,
    storageBucket,
  }
}
