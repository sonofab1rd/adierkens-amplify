import { Amplify } from 'aws-amplify'

export default defineNuxtPlugin({
  name: 'amplify',
  enforce: 'pre',
  setup() {
    if (!import.meta.client) {
      return
    }

    const config = useRuntimeConfig()
    const {
      amplifyAppsyncEndpoint,
      amplifyAwsRegion,
      amplifyStorageBucket,
      cognitoClientId,
      cognitoIdentityPoolId,
      cognitoUserPoolId,
    } = config.public

    if (
      !amplifyAppsyncEndpoint ||
      !amplifyAwsRegion ||
      !amplifyStorageBucket ||
      !cognitoUserPoolId ||
      !cognitoClientId ||
      !cognitoIdentityPoolId
    ) {
      return
    }

    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: cognitoUserPoolId,
          userPoolClientId: cognitoClientId,
          identityPoolId: cognitoIdentityPoolId,
          loginWith: {
            email: true,
          },
        },
      },
      API: {
        GraphQL: {
          endpoint: amplifyAppsyncEndpoint,
          region: amplifyAwsRegion,
          defaultAuthMode: 'userPool',
        },
      },
      Storage: {
        S3: {
          bucket: amplifyStorageBucket,
          region: amplifyAwsRegion,
        },
      },
    })
  },
})
