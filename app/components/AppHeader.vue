<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'About',
    to: '/about',
    active: route.path.startsWith('/about'),
  },
  {
    label: 'Gallery',
    to: '/gallery',
    active: route.path.startsWith('/gallery')
  },
  {
    label: 'Events',
    to: '/events',
    active: route.path.startsWith('/events')
  },
])

</script>

<template>
<UHeader >
<template #left>
  <NuxtLink to="/" class="text-lg font-bold">
  Audrey Dierkens
  </NuxtLink>
</template>
  <template #right>
    <UNavigationMenu  :items="items" class="hidden lg:block" color="neutral" variant="link" />
  </template>
  <template #body>
    <UNavigationMenu  :items="items" orientation="vertical" class="-mx-2.5" />
  </template>
</UHeader>
</template>

<style scoped>

</style>