import assert from 'node:assert/strict'
import test from 'node:test'

import { generateModelsSync } from '@aws-amplify/graphql-generator'

test('generateModelsSync emits model introspection for a minimal Amplify schema', () => {
  const generated = generateModelsSync({
    schema: 'type Feature @model { slug: String! @primaryKey }',
    target: 'introspection',
  })

  assert.equal(typeof generated['model-introspection.json'], 'string')
  assert.match(generated['model-introspection.json'], /"models"/)
})
