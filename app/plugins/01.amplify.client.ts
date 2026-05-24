import { Amplify } from 'aws-amplify'
import { getAmplifyClientConfig } from '../../shared/amplify-outputs'

export default defineNuxtPlugin({
  name: 'amplify',
  enforce: 'pre',
  setup() {
    if (!import.meta.client) {
      return
    }

    Amplify.configure(getAmplifyClientConfig())
  },
})
