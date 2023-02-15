import type { Attribute } from './types'

export function convertAttributesToObject(attributes: Attribute[]) {
  return attributes.reduce(
    (acc, attribute) => {
      return { ...acc, [attribute.key]: attribute.value }
    },
    { _parent_id: null }
  )
}
