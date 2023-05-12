import type { Collection } from '@/utils/storefront-api-types'
import { usePostToShopify } from './post-to-shopify'

const query = `
query collection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
}`

export async function useGetCollection(handle: string) {
  const { collection }: { collection: Collection } = await usePostToShopify(
    query,
    { handle: handle }
  )
  return collection
}
