// https://nuxt.com/docs/api/configuration/nuxt-config

import amplifyOutputs from './amplify_outputs.json'

import { buildStorageHostname } from './shared/content'

const storageBucket = amplifyOutputs.storage?.bucket_name?.trim()
const storageRegion = amplifyOutputs.storage?.aws_region?.trim() || amplifyOutputs.data?.aws_region?.trim()
const storageDomain = storageBucket && storageRegion
  ? buildStorageHostname(storageBucket, storageRegion)
  : undefined

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui'
  ],
  image: {
    domains: storageDomain ? [storageDomain] : [],
    providers: {
      none: {
        provider: '@nuxt/image/runtime/providers/none',
      },
    },
    awsAmplify: {
      formats: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    },
  },
  css: ['./assets/css/main.css'],
})