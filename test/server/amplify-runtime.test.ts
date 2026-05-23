import assert from 'node:assert/strict'
import test from 'node:test'

import { getAmplifyPublicReadConfig } from '../../server/utils/amplify-runtime'

test('getAmplifyPublicReadConfig throws when required env is missing', () => {
  assert.throws(
    () =>
      getAmplifyPublicReadConfig({
        amplifyApiKey: '',
        public: {
          amplifyAppsyncEndpoint: '',
          amplifyAwsRegion: 'us-east-1',
          amplifyStorageBucket: 'site-content',
        },
      }),
    /Missing Amplify public read configuration/,
  )
})

test('getAmplifyPublicReadConfig returns the normalized read config', () => {
  assert.deepEqual(
    getAmplifyPublicReadConfig({
      amplifyApiKey: 'secret',
      public: {
        amplifyAppsyncEndpoint: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
        amplifyAwsRegion: 'us-east-1',
        amplifyStorageBucket: 'site-content',
      },
    }),
    {
      apiKey: 'secret',
      endpoint: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
      awsRegion: 'us-east-1',
      storageBucket: 'site-content',
    },
  )
})
