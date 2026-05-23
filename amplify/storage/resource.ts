import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'siteContent',
  isDefault: true,
  access: (allow) => ({
    'public/content/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
})
