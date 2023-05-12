import type { Attribute, Maybe, Scalars } from './storefront-api-types'

type ReduceType = Record<Scalars['String'], Maybe<string> | undefined>

export function convertAttributesToObject(attributes: Attribute[]) {
  return attributes.reduce(
    (acc: ReduceType, attr) => ({ ...acc, [attr.key]: attr.value }),
    { _parent_id: null }
  )
}
