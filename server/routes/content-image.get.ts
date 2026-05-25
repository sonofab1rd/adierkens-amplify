import { createError, getQuery, sendRedirect } from 'h3'

import { resolveStorageObjectUrl } from '../utils/amplify-storage'

export default defineEventHandler(async (event) => {
  const { path } = getQuery(event)

  if (typeof path !== 'string' || path.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing storage image path',
    })
  }

  const signedUrl = await resolveStorageObjectUrl(path)

  if (!signedUrl) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Storage image path not found',
    })
  }

  return sendRedirect(event, signedUrl, 302)
})
