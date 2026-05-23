// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui'
  ],
  css: ['./assets/css/main.css'],
  runtimeConfig: {
    amplifyApiKey: process.env.AMPLIFY_DATA_API_KEY || '',
    public: {
      amplifyAppsyncEndpoint: process.env.AMPLIFY_APPSYNC_ENDPOINT || '',
      amplifyAwsRegion: process.env.AMPLIFY_AWS_REGION || '',
      amplifyStorageBucket: process.env.AMPLIFY_STORAGE_BUCKET || '',
      cognitoUserPoolId: process.env.AMPLIFY_COGNITO_USER_POOL_ID || '',
      cognitoClientId: process.env.AMPLIFY_COGNITO_USER_POOL_CLIENT_ID || '',
      cognitoIdentityPoolId: process.env.AMPLIFY_COGNITO_IDENTITY_POOL_ID || '',
    },
  }
})