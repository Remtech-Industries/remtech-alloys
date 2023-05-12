import type { Attribute } from './storefront-api-types'

type ReduceType = Record<Attribute['key'], Attribute['value']>

export function convertAttributesToObject(attributes: Attribute[]) {
  return attributes.reduce(
    (acc: ReduceType, attr) => ({ ...acc, [attr.key]: attr.value }),
    { _parent_id: null }
  )
}
