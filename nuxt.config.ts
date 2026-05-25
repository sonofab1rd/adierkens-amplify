// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui'
  ],
  image: {
    // domains: storageDomain ? [storageDomain] : [],
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