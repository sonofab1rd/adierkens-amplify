import assert from 'node:assert/strict'
import test from 'node:test'

import amplifyOutputs from '../../amplify_outputs.json'
import { parseAmplifyConfig } from 'aws-amplify/utils'

import {
  getAmplifyClientConfigFromOutputs,
  getAmplifyClientConfig,
  getAmplifyPublicReadConfigFromOutputs,
  getAmplifyPublicReadConfig,
} from '../../shared/amplify-outputs'

test('getAmplifyPublicReadConfigFromOutputs returns the public read settings from Amplify outputs', () => {
  assert.deepEqual(
    getAmplifyPublicReadConfigFromOutputs({
      data: {
        url: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
        aws_region: 'us-east-1',
        api_key: 'public-read-key',
      },
      storage: {
        bucket_name: 'site-content',
      },
    }),
    {
      apiKey: 'public-read-key',
      endpoint: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
      awsRegion: 'us-east-1',
      storageBucket: 'site-content',
    },
  )
})

test('getAmplifyClientConfigFromOutputs returns the Amplify resources config parsed from outputs', () => {
  const outputs = {
    auth: {
      user_pool_id: 'us-east-1_example',
      aws_region: 'us-east-1',
      user_pool_client_id: 'client-id',
      identity_pool_id: 'us-east-1:identity-pool',
      username_attributes: ['email'],
      standard_required_attributes: ['email'],
      user_verification_types: ['email'],
      groups: [],
      mfa_configuration: 'NONE',
      mfa_methods: [],
      password_policy: {
        min_length: 8,
        require_lowercase: true,
        require_numbers: true,
        require_symbols: true,
        require_uppercase: true,
      },
      unauthenticated_identities_enabled: true,
    },
    data: {
      url: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
      aws_region: 'us-east-1',
      default_authorization_type: 'AMAZON_COGNITO_USER_POOLS',
      authorization_types: ['API_KEY', 'AWS_IAM'],
      model_introspection: {
        version: 1,
        models: {},
        enums: {},
        nonModels: {},
      },
    },
    storage: {
      bucket_name: 'site-content',
      aws_region: 'us-east-1',
      buckets: [],
    },
  }

  assert.deepEqual(getAmplifyClientConfigFromOutputs(outputs), parseAmplifyConfig(outputs))
})

test('getAmplifyPublicReadConfigFromOutputs throws when required public read keys are missing', () => {
  assert.throws(
    () =>
      getAmplifyPublicReadConfigFromOutputs({
        data: {
          url: '',
          aws_region: 'us-east-1',
          api_key: '',
        },
        storage: {
          bucket_name: '',
        },
      }),
    /data\.url, data\.api_key, storage\.bucket_name/,
  )
})

test('getAmplifyClientConfigFromOutputs throws when required client config keys are missing', () => {
  assert.throws(
    () =>
      getAmplifyClientConfigFromOutputs({
        auth: {
          aws_region: 'us-east-1',
          user_pool_client_id: 'client-id',
        },
        data: {
          url: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
          aws_region: 'us-east-1',
          default_authorization_type: 'AMAZON_COGNITO_USER_POOLS',
        },
        storage: {
          bucket_name: 'site-content',
        },
      }),
    /auth\.user_pool_id, auth\.identity_pool_id, data\.model_introspection, storage\.aws_region/,
  )
})

test('getAmplifyPublicReadConfig reads the project amplify_outputs.json file', () => {
  assert.deepEqual(getAmplifyPublicReadConfig(), {
    apiKey: amplifyOutputs.data.api_key,
    endpoint: amplifyOutputs.data.url,
    awsRegion: amplifyOutputs.data.aws_region,
    storageBucket: amplifyOutputs.storage.bucket_name,
  })
})

test('getAmplifyClientConfig reads the project amplify_outputs.json file', () => {
  assert.deepEqual(getAmplifyClientConfig(), parseAmplifyConfig(amplifyOutputs))
})
