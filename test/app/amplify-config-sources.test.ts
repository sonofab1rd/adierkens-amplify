import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('ContentAdmin client component no longer checks Amplify setup through runtime config env values', () => {
  const source = readFileSync(new URL('../../app/components/ContentAdmin.client.vue', import.meta.url), 'utf8')

  assert.doesNotMatch(source, /useRuntimeConfig|amplifyAppsyncEndpoint|cognitoUserPoolId/)
})

test('nuxt config no longer maps Amplify env vars into runtime config', () => {
  const source = readFileSync(new URL('../../nuxt.config.ts', import.meta.url), 'utf8')

  assert.doesNotMatch(
    source,
    /AMPLIFY_DATA_API_KEY|AMPLIFY_APPSYNC_ENDPOINT|AMPLIFY_AWS_REGION|AMPLIFY_STORAGE_BUCKET|AMPLIFY_COGNITO_USER_POOL_ID|AMPLIFY_COGNITO_USER_POOL_CLIENT_ID|AMPLIFY_COGNITO_IDENTITY_POOL_ID/,
  )
})
