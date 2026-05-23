import { fetchFeatureContent } from '../../utils/amplify-data'

export default defineEventHandler(async (event) => {
  return await fetchFeatureContent(event)
})
