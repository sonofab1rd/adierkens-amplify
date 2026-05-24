import amplifyOutputs from '../amplify_outputs.json'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import type { ResourcesConfig } from 'aws-amplify'

export type AmplifyPublicReadConfig = {
  apiKey: string
  endpoint: string
  awsRegion: string
  storageBucket: string
}

type AmplifyOutputsLike = {
  auth?: {
    user_pool_id?: string
    aws_region?: string
    user_pool_client_id?: string
    identity_pool_id?: string
    username_attributes?: string[]
    standard_required_attributes?: string[]
    user_verification_types?: string[]
    groups?: string[]
    mfa_configuration?: string
    mfa_methods?: string[]
    password_policy?: {
      min_length?: number
      require_lowercase?: boolean
      require_numbers?: boolean
      require_symbols?: boolean
      require_uppercase?: boolean
    }
    unauthenticated_identities_enabled?: boolean
  }
  data?: {
    url?: string
    aws_region?: string
    api_key?: string
    default_authorization_type?: string
    authorization_types?: string[]
    model_introspection?: {
      version?: number
      models?: Record<string, unknown>
      enums?: Record<string, unknown>
      nonModels?: Record<string, unknown>
    }
  }
  storage?: {
    bucket_name?: string
    aws_region?: string
    buckets?: Array<Record<string, unknown>>
  }
}

function requireOutputValues(
  outputs: AmplifyOutputsLike,
  required: Array<[path: string, value: unknown]>,
) {
  const missing = required
    .filter(([, value]) => {
      if (typeof value === 'string') {
        return value.trim().length === 0
      }

      return value == null
    })
    .map(([path]) => path)

  if (missing.length) {
    throw new Error(`Missing Amplify outputs configuration: ${missing.join(', ')}`)
  }
}

export function getAmplifyPublicReadConfigFromOutputs(outputs: AmplifyOutputsLike): AmplifyPublicReadConfig {
  requireOutputValues(outputs, [
    ['data.url', outputs.data?.url],
    ['data.aws_region', outputs.data?.aws_region],
    ['data.api_key', outputs.data?.api_key],
    ['storage.bucket_name', outputs.storage?.bucket_name],
  ])

  return {
    apiKey: outputs.data!.api_key!.trim(),
    endpoint: outputs.data!.url!.trim(),
    awsRegion: outputs.data!.aws_region!.trim(),
    storageBucket: outputs.storage!.bucket_name!.trim(),
  }
}

export function getAmplifyClientConfigFromOutputs(outputs: AmplifyOutputsLike): ResourcesConfig {
  requireOutputValues(outputs, [
    ['auth.user_pool_id', outputs.auth?.user_pool_id],
    ['auth.aws_region', outputs.auth?.aws_region],
    ['auth.user_pool_client_id', outputs.auth?.user_pool_client_id],
    ['auth.identity_pool_id', outputs.auth?.identity_pool_id],
    ['data.url', outputs.data?.url],
    ['data.aws_region', outputs.data?.aws_region],
    ['data.default_authorization_type', outputs.data?.default_authorization_type],
    ['data.model_introspection', outputs.data?.model_introspection],
    ['storage.bucket_name', outputs.storage?.bucket_name],
    ['storage.aws_region', outputs.storage?.aws_region],
  ])

  return parseAmplifyConfig(outputs)
}

export function getAmplifyPublicReadConfig(): AmplifyPublicReadConfig {
  return getAmplifyPublicReadConfigFromOutputs(amplifyOutputs)
}

export function getAmplifyClientConfig(): ResourcesConfig {
  return getAmplifyClientConfigFromOutputs(amplifyOutputs)
}
