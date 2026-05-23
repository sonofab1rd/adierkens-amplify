import type { ArticleContent, ArticlesApiResponse, FeatureApiResponse } from '../../shared/content'

const fallbackMessage = 'Using locally extracted Strapi content until Amplify runtime is configured.'

const seedFeature = {
  slug: 'home',
  headline: 'The wonders of coffee!',
  title: 'Coffee Bar',
  description: 'A glorious coffee setup!',
  image: {
    path: 'migrated-content/coffee_beans_68c2d68a8d.jpeg',
    alt: 'An image uploaded to Strapi called coffee-beans',
    url: '/migrated-content/coffee_beans_68c2d68a8d.jpeg',
  },
}

const seedArticles: ArticleContent[] = [
  {
    slug: 'beautiful-picture',
    title: 'Beautiful picture',
    content: 'Description of a beautiful picture',
    publishedAt: '2026-02-23T17:48:33.190Z',
    cover: {
      path: 'migrated-content/beautiful_picture_52328b234b.jpeg',
      alt: 'An image uploaded to Strapi called beautiful-picture',
      url: '/migrated-content/beautiful_picture_52328b234b.jpeg',
    },
  },
  {
    slug: 'what-s-inside-a-black-hole',
    title: "What's inside a Black Hole",
    content: 'Maybe the answer is in this article, or not...',
    publishedAt: '2026-02-23T17:48:33.190Z',
    cover: {
      path: 'migrated-content/what_s_inside_a_black_hole_701519fbfc.jpeg',
      alt: 'An image uploaded to Strapi called what-s-inside-a-black-hole',
      url: '/migrated-content/what_s_inside_a_black_hole_701519fbfc.jpeg',
    },
  },
  {
    slug: 'a-bug-is-becoming-a-meme-on-the-internet',
    title: 'A bug is becoming a meme on the internet',
    content: 'How a bug on MySQL is becoming a meme on the internet',
    publishedAt: '2026-02-23T17:48:33.189Z',
    cover: {
      path: 'migrated-content/a_bug_is_becoming_a_meme_on_the_internet_89bde87d31.jpeg',
      alt: 'An image uploaded to Strapi called a-bug-is-becoming-a-meme-on-the-internet',
      url: '/migrated-content/a_bug_is_becoming_a_meme_on_the_internet_89bde87d31.jpeg',
    },
  },
  {
    slug: 'this-shrimp-is-awesome',
    title: 'This shrimp is awesome',
    content: 'Mantis shrimps, or stomatopods, are marine crustaceans of the order Stomatopoda.',
    publishedAt: '2026-02-23T17:48:33.188Z',
    cover: {
      path: 'migrated-content/this_shrimp_is_awesome_814d26a06c.jpeg',
      alt: 'An image uploaded to Strapi called this-shrimp-is-awesome',
      url: '/migrated-content/this_shrimp_is_awesome_814d26a06c.jpeg',
    },
  },
  {
    slug: 'the-internet-s-own-boy',
    title: "The internet's Own boy",
    content: 'Follow the story of Aaron Swartz, the boy who could change the world',
    publishedAt: '2026-02-23T17:48:33.187Z',
    cover: {
      path: 'migrated-content/the_internet_s_own_boy_2c1adde8c1.jpeg',
      alt: 'An image uploaded to Strapi called the-internet-s-own-boy',
      url: '/migrated-content/the_internet_s_own_boy_2c1adde8c1.jpeg',
    },
  },
]

export function buildSeedFeatureResponse(error = fallbackMessage): FeatureApiResponse {
  return {
    configured: false,
    feature: seedFeature,
    error,
  }
}

export function buildSeedArticlesResponse(error = fallbackMessage): ArticlesApiResponse {
  return {
    configured: false,
    articles: seedArticles,
    error,
  }
}
