<script setup lang="ts">
import type { ArticlesApiResponse } from '~/shared/content'

const { data } = await useFetch<ArticlesApiResponse>('/api/content/articles')

const articles = computed(() => data.value?.articles ?? [])
const loadError = computed(() => data.value?.error ?? 'Amplify gallery content is not configured yet.')

// Format date
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('en-US', options)
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-5xl font-extrabold mb-12 text-center">
      Gallery
    </h1>

    <section aria-labelledby="articles-title">
      <h2 id="articles-title" class="sr-only">Latest Articles</h2>

      <UAlert
        v-if="data && !data.configured"
        color="warning"
        variant="soft"
        title="Gallery content unavailable"
        :description="loadError"
        class="mb-8"
      />

      <div v-if="articles.length" class="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-6">
        <article
            v-for="(article, index) in articles"
            :key="article.slug"
            :class="[
              'w-full max-w-sm flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800',
              index % 2 === 0 ? 'md:justify-self-end md:text-left' : 'md:justify-self-start md:text-left'
            ]"
        >
          <div v-if="article.cover.url" class="relative h-56 w-full overflow-hidden">
            <NuxtImg
                provider="none"
                :src="article.cover.url"
                :alt="article.cover.alt"
                class="w-full h-full object-cover"
            />
          </div>

          <div class="p-6 flex flex-col gap-3">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ formatDate(article.publishedAt) }}
            </p>

            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ article.title }}
            </h3>
          </div>
        </article>
      </div>

      <UAlert
        v-else
        color="neutral"
        variant="soft"
        title="No gallery articles yet"
        description="Publish articles in the Amplify-backed admin editor to populate this page."
      />
    </section>
  </main>
</template>

<style scoped>

</style>