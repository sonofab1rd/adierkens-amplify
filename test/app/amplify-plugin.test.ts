import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('Amplify client plugin configures Amplify from the shared outputs adapter', () => {
  const source = readFileSync(new URL('../../app/plugins/01.amplify.client.ts', import.meta.url), 'utf8')

  assert.match(source, /Amplify\.configure\(getAmplifyClientConfig\(\)\)/)
  assert.doesNotMatch(source, /useRuntimeConfig|amplifyAppsyncEndpoint|cognitoUserPoolId/)
})
