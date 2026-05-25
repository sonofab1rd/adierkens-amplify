import { Amplify } from 'aws-amplify'
import { getUrl } from 'aws-amplify/storage'

import { getAmplifyClientConfig } from '../../shared/amplify-outputs'

let amplifyConfigured = false

export function ensureAmplifyStorageConfigured() {
  if (amplifyConfigured) {
    return
  }

  Amplify.configure(getAmplifyClientConfig(), { ssr: true })
  amplifyConfigured = true
}

type ResolveStorageObjectUrlDependencies = {
  ensureConfigured?: () => void
  getUrl?: (input: { path: string }) => Promise<{ url: URL; expiresAt: Date }>
}

export async function resolveStorageObjectUrl(
  objectPath: string | null | undefined,
  dependencies: ResolveStorageObjectUrlDependencies = {},
) {
  if (!objectPath) {
    return null
  }

  const ensureConfigured = dependencies.ensureConfigured ?? ensureAmplifyStorageConfigured
  const getStorageUrl = dependencies.getUrl ?? getUrl

  ensureConfigured()

  const result = await getStorageUrl({ path: objectPath })

  return String(result.url)
}
