import assert from 'node:assert/strict'
import test from 'node:test'

import amplifyOutputs from '../../amplify_outputs.json'
import { getAmplifyPublicReadConfig } from '../../server/utils/amplify-runtime'

test('getAmplifyPublicReadConfig reads the normalized read config from amplify_outputs.json', () => {
  assert.deepEqual(getAmplifyPublicReadConfig(), {
    apiKey: amplifyOutputs.data.api_key,
    endpoint: amplifyOutputs.data.url,
    awsRegion: amplifyOutputs.data.aws_region,
    storageBucket: amplifyOutputs.storage.bucket_name,
  })
})
