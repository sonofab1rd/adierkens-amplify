<script setup lang="ts">
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import { uploadData } from 'aws-amplify/storage'

import type { Schema } from '../../amplify/data/resource'

type EditableFeature = {
  slug: string
  headline: string
  title: string
  description: string
  imagePath: string
  imageAlt: string
}

type EditableArticle = {
  slug: string
  title: string
  content: string
  publishedAt: string
  coverPath: string
  coverAlt: string
}

const client = generateClient<Schema>()

const email = ref('')
const password = ref('')
const authError = ref('')
const saveMessage = ref('')
const isLoading = ref(false)
const isSignedIn = ref(false)
const currentUserEmail = ref('')
const featureImageFile = ref<File | null>(null)
const articleImageFiles = reactive<Record<string, File | null>>({})

const feature = reactive<EditableFeature>({
  slug: 'home',
  headline: '',
  title: '',
  description: '',
  imagePath: '',
  imageAlt: '',
})

const articles = ref<EditableArticle[]>([])

const amplifyConfigured = true

const sortArticles = () => {
  articles.value.sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
  })
}

const createArticleSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const uploadContentImage = async (kind: 'feature' | 'articles', slug: string, file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
  const path = `public/content/${kind}/${slug}-${Date.now()}-${safeName}`

  await uploadData({
    path,
    data: file,
    options: {
      contentType: file.type || 'application/octet-stream',
    },
  }).result

  return path
}

const loadContent = async () => {
  saveMessage.value = ''
  authError.value = ''

  const [featureResult, articlesResult] = await Promise.all([
    client.models.Feature.get({ slug: 'home' }),
    client.models.Article.list(),
  ])

  if (featureResult.data) {
    feature.slug = featureResult.data.slug
    feature.headline = featureResult.data.headline
    feature.title = featureResult.data.title
    feature.description = featureResult.data.description
    feature.imagePath = featureResult.data.imagePath ?? ''
    feature.imageAlt = featureResult.data.imageAlt ?? ''
  }

  articles.value = (articlesResult.data ?? []).map((article) => ({
    slug: article.slug,
    title: article.title,
    content: article.content,
    publishedAt: article.publishedAt,
    coverPath: article.coverPath ?? '',
    coverAlt: article.coverAlt ?? '',
  }))
  sortArticles()
}

const refreshSession = async () => {
  try {
    const user = await getCurrentUser()
    isSignedIn.value = true
    currentUserEmail.value = user.signInDetails?.loginId ?? user.username
    await loadContent()
  }
  catch {
    isSignedIn.value = false
  }
}

const handleSignIn = async () => {
  isLoading.value = true
  authError.value = ''

  try {
    const result = await signIn({
      username: email.value,
      password: password.value,
    })

    if (result.nextStep.signInStep !== 'DONE') {
      authError.value = `Additional sign-in step required: ${result.nextStep.signInStep}`
      return
    }

    await refreshSession()
  }
  catch (error) {
    authError.value = error instanceof Error ? error.message : 'Sign-in failed'
  }
  finally {
    isLoading.value = false
  }
}

const handleSignOut = async () => {
  await signOut()
  isSignedIn.value = false
  currentUserEmail.value = ''
}

const saveFeature = async () => {
  isLoading.value = true
  saveMessage.value = ''
  authError.value = ''

  try {
    let imagePath = feature.imagePath || null

    if (featureImageFile.value) {
      imagePath = await uploadContentImage('feature', feature.slug, featureImageFile.value)
      feature.imagePath = imagePath
      featureImageFile.value = null
    }

    const existing = await client.models.Feature.get({ slug: feature.slug })
    const payload = {
      slug: feature.slug,
      headline: feature.headline,
      title: feature.title,
      description: feature.description,
      imagePath,
      imageAlt: feature.imageAlt || feature.title,
    }

    if (existing.data) {
      await client.models.Feature.update(payload)
    }
    else {
      await client.models.Feature.create(payload)
    }

    saveMessage.value = 'Homepage feature saved.'
    await loadContent()
  }
  catch (error) {
    authError.value = error instanceof Error ? error.message : 'Failed to save the homepage feature'
  }
  finally {
    isLoading.value = false
  }
}

const saveArticle = async (article: EditableArticle) => {
  isLoading.value = true
  saveMessage.value = ''
  authError.value = ''

  try {
    if (!article.slug) {
      article.slug = createArticleSlug(article.title)
    }

    let coverPath = article.coverPath || null
    const pendingFile = articleImageFiles[article.slug]

    if (pendingFile) {
      coverPath = await uploadContentImage('articles', article.slug, pendingFile)
      article.coverPath = coverPath
      articleImageFiles[article.slug] = null
    }

    const existing = await client.models.Article.get({ slug: article.slug })
    const payload = {
      slug: article.slug,
      title: article.title,
      content: article.content,
      publishedAt: article.publishedAt,
      coverPath,
      coverAlt: article.coverAlt || article.title,
    }

    if (existing.data) {
      await client.models.Article.update(payload)
    }
    else {
      await client.models.Article.create(payload)
    }

    saveMessage.value = `Saved article "${article.title}".`
    await loadContent()
  }
  catch (error) {
    authError.value = error instanceof Error ? error.message : 'Failed to save the article'
  }
  finally {
    isLoading.value = false
  }
}

const deleteArticle = async (slug: string) => {
  isLoading.value = true
  saveMessage.value = ''
  authError.value = ''

  try {
    await client.models.Article.delete({ slug })
    articles.value = articles.value.filter((article) => article.slug !== slug)
    saveMessage.value = 'Article deleted.'
  }
  catch (error) {
    authError.value = error instanceof Error ? error.message : 'Failed to delete the article'
  }
  finally {
    isLoading.value = false
  }
}

const addArticle = () => {
  articles.value.unshift({
    slug: '',
    title: '',
    content: '',
    publishedAt: new Date().toISOString(),
    coverPath: '',
    coverAlt: '',
  })
}

const setFeatureImage = (event: Event) => {
  const input = event.target as HTMLInputElement
  featureImageFile.value = input.files?.[0] ?? null
}

const setArticleImage = (slug: string, event: Event) => {
  const input = event.target as HTMLInputElement
  articleImageFiles[slug] = input.files?.[0] ?? null
}

onMounted(async () => {
  if (amplifyConfigured) {
    await refreshSession()
  }
})
</script>

<template>
  <div class="space-y-8">
    <UAlert
      v-if="!amplifyConfigured"
      color="warning"
      variant="soft"
      title="Amplify outputs are unavailable"
      description="Generate the root amplify_outputs.json file before using the internal editor."
    />

    <template v-else-if="!isSignedIn">
      <div class="max-w-md rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h1 class="text-2xl font-bold">Admin sign in</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Sign in with your Cognito user to manage homepage and gallery content.
        </p>
        <form class="space-y-4" @submit.prevent="handleSignIn">
          <label class="block space-y-1">
            <span class="text-sm font-medium">Email</span>
            <input v-model="email" type="email" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required>
          </label>
          <label class="block space-y-1">
            <span class="text-sm font-medium">Password</span>
            <input v-model="password" type="password" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required>
          </label>
          <button type="submit" class="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2" :disabled="isLoading">
            {{ isLoading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">Content admin</h1>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Signed in as {{ currentUserEmail }}
          </p>
        </div>
        <button type="button" class="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2" @click="handleSignOut">
          Sign out
        </button>
      </div>

      <UAlert
        v-if="authError"
        color="error"
        variant="soft"
        title="Admin action failed"
        :description="authError"
      />

      <UAlert
        v-if="saveMessage"
        color="success"
        variant="soft"
        title="Update saved"
        :description="saveMessage"
      />

      <section class="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div>
          <h2 class="text-xl font-semibold">Homepage feature</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300">Edit the single feature block shown on the homepage.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="block space-y-1">
            <span class="text-sm font-medium">Headline</span>
            <input v-model="feature.headline" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
          </label>
          <label class="block space-y-1">
            <span class="text-sm font-medium">Title</span>
            <input v-model="feature.title" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
          </label>
        </div>

        <label class="block space-y-1">
          <span class="text-sm font-medium">Description</span>
          <textarea v-model="feature.description" rows="4" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </label>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="block space-y-1">
            <span class="text-sm font-medium">Image alt text</span>
            <input v-model="feature.imageAlt" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
          </label>
          <label class="block space-y-1">
            <span class="text-sm font-medium">Replace image</span>
            <input type="file" accept="image/*" @change="setFeatureImage">
          </label>
        </div>

        <p v-if="feature.imagePath" class="text-sm text-gray-500 break-all">
          Current image path: {{ feature.imagePath }}
        </p>

        <button type="button" class="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2" :disabled="isLoading" @click="saveFeature">
          Save homepage feature
        </button>
      </section>

      <section class="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold">Gallery articles</h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">Create, edit, and delete the articles shown on the gallery page.</p>
          </div>
          <button type="button" class="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2" @click="addArticle">
            Add article
          </button>
        </div>

        <div v-if="articles.length" class="space-y-6">
          <article
            v-for="article in articles"
            :key="article.slug || article.publishedAt"
            class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4"
          >
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block space-y-1">
                <span class="text-sm font-medium">Title</span>
                <input v-model="article.title" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
              </label>
              <label class="block space-y-1">
                <span class="text-sm font-medium">Slug</span>
                <input v-model="article.slug" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
              </label>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="block space-y-1">
                <span class="text-sm font-medium">Published at</span>
                <input v-model="article.publishedAt" type="datetime-local" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
              </label>
              <label class="block space-y-1">
                <span class="text-sm font-medium">Cover alt text</span>
                <input v-model="article.coverAlt" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2">
              </label>
            </div>

            <label class="block space-y-1">
              <span class="text-sm font-medium">Content</span>
              <textarea v-model="article.content" rows="4" class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
            </label>

            <label class="block space-y-1">
              <span class="text-sm font-medium">Replace cover image</span>
              <input type="file" accept="image/*" @change="setArticleImage(article.slug || createArticleSlug(article.title) || 'draft', $event)">
            </label>

            <p v-if="article.coverPath" class="text-sm text-gray-500 break-all">
              Current cover path: {{ article.coverPath }}
            </p>

            <div class="flex gap-3">
              <button type="button" class="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2" :disabled="isLoading" @click="saveArticle(article)">
                Save article
              </button>
              <button
                v-if="article.slug"
                type="button"
                class="rounded-md border border-red-300 text-red-600 px-4 py-2"
                :disabled="isLoading"
                @click="deleteArticle(article.slug)"
              >
                Delete article
              </button>
            </div>
          </article>
        </div>

        <UAlert
          v-else
          color="neutral"
          variant="soft"
          title="No articles yet"
          description="Create the first gallery article from this editor."
        />
      </section>
    </template>
  </div>
</template>
