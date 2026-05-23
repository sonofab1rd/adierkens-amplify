import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Feature: a
    .model({
      slug: a.string().required(),
      headline: a.string().required(),
      title: a.string().required(),
      description: a.string().required(),
      imagePath: a.string(),
      imageAlt: a.string(),
    })
    .identifier(['slug'])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
    ]),
  Article: a
    .model({
      slug: a.string().required(),
      title: a.string().required(),
      content: a.string().required(),
      publishedAt: a.datetime().required(),
      coverPath: a.string(),
      coverAlt: a.string(),
    })
    .identifier(['slug'])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
    ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
