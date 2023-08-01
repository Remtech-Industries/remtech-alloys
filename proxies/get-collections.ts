import { useShopify } from './shopify'
import type { CollectionEdge } from '@/utils/storefront-api-types'

const query = `
  query {
    collections(first: 100) {
      edges {
        node {
          id
          title
          handle
          products(first: 100) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`

type Data = {
  collections: {
    edges: CollectionEdge[]
  }
}

export function useGetCollections() {
  const { data, doGet } = useShopify<Data>(query)
  return { data, doGet }
}
