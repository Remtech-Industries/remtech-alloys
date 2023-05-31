import { usePostToShopify } from './post-to-shopify'
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

export async function useGetCollections(): Promise<CollectionEdge[]> {
  const { collections }: Data = await usePostToShopify(query)
  return collections.edges
}
