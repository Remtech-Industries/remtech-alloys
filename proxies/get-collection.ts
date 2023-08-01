import { Collection } from '@/utils/storefront-api-types'
import { useShopify } from './shopify'

const query = `
query collection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(first: 200, sortKey: PRICE) {
      edges {
        node {
          id
          title
          handle
          totalInventory
          priceRange {
            minVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
}`

export function useGetCollection(handle: string) {
  const { data, doGet } = useShopify<{ collection: Collection }>(query, { handle: handle })
  return { data, doGet }
}
