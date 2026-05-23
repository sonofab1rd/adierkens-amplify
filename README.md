# adierkens-amplify

Nuxt 4 frontend for `www.adierkens.com`, now transplanted into this repository as the active migration target.

## Repository roles

- `adierkens-amplify` is the working repository for the app and the Strapi-to-Amplify migration.
- `adierkens-ui` remains untouched as the backup copy of the original Strapi-backed app.

## Current application state

- The app source was copied from `adierkens-ui` into this repository.
- Public pages now read through local Nitro API routes backed by Amplify runtime configuration instead of page-level `useStrapi()` calls.
- The repo now contains Amplify Gen 2 backend resources for:
  - Cognito auth
  - Amplify Data models for `Feature` and `Article`
  - Amplify Storage for content images
- The app also includes a Cognito-backed `/admin` route for editing homepage and gallery content once the Amplify runtime variables are configured.

## Local development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Build or run the production server locally:

```bash
npm run build
npm run start
```

Health endpoint:

```bash
curl http://localhost:3000/api/health
```

## Runtime configuration

Copy `.env.example` to `.env` and provide the Amplify values for your environment:

- `AMPLIFY_DATA_API_KEY`
- `AMPLIFY_APPSYNC_ENDPOINT`
- `AMPLIFY_AWS_REGION`
- `AMPLIFY_STORAGE_BUCKET`
- `AMPLIFY_COGNITO_USER_POOL_ID`
- `AMPLIFY_COGNITO_USER_POOL_CLIENT_ID`
- `AMPLIFY_COGNITO_IDENTITY_POOL_ID`

Public page reads use the AppSync endpoint plus API key through server routes. The `/admin` editor uses Cognito + Amplify Data + Amplify Storage from the client-side plugin.

## Amplify backend workflow

The repo now includes an `amplify/` directory for Gen 2 backend resources. Typical workflow:

```bash
npm run amplify:sandbox
```

After provisioning the backend, fill in the runtime variables above for local Nuxt development and the Amplify Hosting environment.

## Migration note

Do all new migration work in this repository. Do not modify `adierkens-ui` except to reference it as the backup/source baseline.

## Remaining migration gap

The code path is migrated, but the real content import still needs the original Strapi data to be extracted from the local MySQL-backed Strapi schema and written into the Amplify `Feature` and `Article` models.