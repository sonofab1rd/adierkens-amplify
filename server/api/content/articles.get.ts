import { fetchArticleContent } from '../../utils/amplify-data'

export default defineEventHandler(async (event) => {
  return await fetchArticleContent(event)
})
