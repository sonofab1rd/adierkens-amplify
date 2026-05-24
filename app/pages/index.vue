<script setup lang="ts">
import type { FeatureApiResponse } from '~/shared/content'

const { data } = await useFetch<FeatureApiResponse>('/api/content/feature')
const feature = computed(() => data.value?.feature ?? null)
const loadError = computed(() => data.value?.error ?? 'Amplify homepage content is not configured yet.')
const usingFallbackContent = computed(() => Boolean(data.value && !data.value.configured))
</script>

<template>
  <div>
    <main v-if="usingFallbackContent" class="max-w-5xl mx-auto px-4 pt-8">
      <UAlert
        color="warning"
        variant="soft"
        title="Using extracted fallback content"
        :description="loadError"
      />
    </main>

    <UPageHero
        v-if="feature"
        :title="feature.title"
        :description="feature.description"
        :headline="feature.headline"
    >
      <template #top>
        <div v-if="feature.image.url" class="flex justify-center">
      <NuxtImg
          :src="feature.image.url"
          :alt="feature.image.alt"
          class="rounded-lg shadow-2xl ring ring-default mt-8"
      />
        </div>
      </template>
    </UPageHero>

    <main v-else class="max-w-5xl mx-auto px-4 py-12">
      <UAlert
        color="warning"
        variant="soft"
        title="Homepage content unavailable"
        :description="loadError"
      />
    </main>
  </div>
</template>

<style scoped>

</style>